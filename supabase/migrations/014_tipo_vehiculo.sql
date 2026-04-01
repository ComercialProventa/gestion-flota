-- Migración: Agregar tipo de vehículo (bus / camion) a la tabla buses
-- Ejecutar en Supabase SQL Editor

ALTER TABLE public.buses 
  ADD COLUMN IF NOT EXISTS tipo text NOT NULL DEFAULT 'bus'
  CHECK (tipo IN ('bus', 'camion'));

-- Comentario: los buses ya existentes quedan como 'bus' por defecto.
-- Para marcar una unidad como camión:
-- UPDATE buses SET tipo = 'camion' WHERE patente = 'XXXX-XX';
