-- Migración 010: Restricción Única de Posición de Neumáticos
-- Evita a nivel de base de datos que dos neumáticos ocupen la misma posición en el mismo bus simultáneamente.

-- 1. Crear índice único parcial
CREATE UNIQUE INDEX IF NOT EXISTS unq_bus_posicion_instalado 
ON public.neumaticos (bus_actual_id, posicion_actual) 
WHERE estado = 'instalado' AND bus_actual_id IS NOT NULL AND posicion_actual IS NOT NULL;
