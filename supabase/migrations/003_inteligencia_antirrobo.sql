-- Migración: Módulos de Inteligencia y Antirrobo
-- Fecha: 2026-03-21

-- 1. Agregar capacidad del estanque a buses (para alerta "Estanque Fantasma")
ALTER TABLE buses ADD COLUMN IF NOT EXISTS capacidad_estanque integer DEFAULT NULL;

-- 2. Agregar precio a neumáticos (para cálculo CPK)
ALTER TABLE neumaticos ADD COLUMN IF NOT EXISTS precio integer DEFAULT 0;

-- 3. Crear tabla de registros de mantenimiento
CREATE TABLE IF NOT EXISTS registros_mantenimiento (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  bus_id uuid REFERENCES buses(id) ON DELETE CASCADE,
  usuario_id uuid,
  tipo_pieza varchar(100) NOT NULL,
  descripcion text,
  costo integer DEFAULT 0,
  fecha date DEFAULT CURRENT_DATE,
  creado_en timestamptz DEFAULT now()
);

-- 4. Crear tabla de alertas del sistema
CREATE TABLE IF NOT EXISTS alertas_sistema (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  bus_id uuid REFERENCES buses(id) ON DELETE CASCADE,
  tipo varchar(50) NOT NULL, -- 'estanque_fantasma', 'rendimiento_bajo', 'cambiazo', 'mantenimiento_anomalo'
  severidad varchar(20) DEFAULT 'alta', -- 'baja', 'media', 'alta', 'critica'
  titulo varchar(255) NOT NULL,
  detalle text,
  resuelta boolean DEFAULT false,
  usuario_id uuid,
  creado_en timestamptz DEFAULT now()
);

-- 5. Índices para rendimiento
CREATE INDEX IF NOT EXISTS idx_registros_combustible_bus_fecha ON registros_combustible(bus_id, fecha);
CREATE INDEX IF NOT EXISTS idx_registros_mantenimiento_bus_fecha ON registros_mantenimiento(bus_id, fecha);
CREATE INDEX IF NOT EXISTS idx_alertas_sistema_tipo ON alertas_sistema(tipo, resuelta);

-- 6. RLS (Row Level Security) - Políticas abiertas para el MVP
ALTER TABLE registros_mantenimiento ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas_sistema ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acceso total para autenticados - mantenimiento" ON registros_mantenimiento
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Acceso total para autenticados - alertas" ON alertas_sistema
  FOR ALL USING (auth.role() = 'authenticated');
