-- Migración 007: Nuevo rol 'conductor' y tabla de asignaciones de flota
-- Esta migración asume que la tabla usuarios usa una restricción CHECK en lugar de un ENUM nativo. Si es un ENUM, adaptar.
-- Si hay restricción CHECK:
ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS usuarios_rol_check;
ALTER TABLE usuarios ADD CONSTRAINT usuarios_rol_check CHECK (rol IN ('administrador', 'administrativo', 'taller_conductor', 'conductor'));

-- Si 'rol_usuario' es un tipo ENUM (Supabase a veces usa TEXT con CHECK, pero si es ENUM intentamos agregarlo):
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rol_usuario') THEN
        ALTER TYPE rol_usuario ADD VALUE IF NOT EXISTS 'conductor';
    END IF;
END $$;

-- 1. Tabla de asignaciones (Quién puede conducir/ver qué)
CREATE TABLE IF NOT EXISTS asignacion_flota (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    bus_id UUID NOT NULL REFERENCES buses(id) ON DELETE CASCADE,
    asignado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(usuario_id, bus_id)
);

-- 2. Índices de rendimiento
CREATE INDEX IF NOT EXISTS idx_asignacion_usuario ON asignacion_flota(usuario_id);
CREATE INDEX IF NOT EXISTS idx_asignacion_bus ON asignacion_flota(bus_id);

-- 3. Políticas RLS
ALTER TABLE asignacion_flota ENABLE ROW LEVEL SECURITY;

-- Los administradores y administrativos tienen full acceso
CREATE POLICY "admin_all_asignacion_flota"
ON asignacion_flota FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM usuarios 
    WHERE id = auth.uid() AND rol IN ('administrador', 'administrativo')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM usuarios 
    WHERE id = auth.uid() AND rol IN ('administrador', 'administrativo')
  )
);

-- Los conductores pueden ver solo sus propias asignaciones
CREATE POLICY "conductor_select_asignacion"
ON asignacion_flota FOR SELECT TO authenticated
USING (usuario_id = auth.uid());
