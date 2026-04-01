-- Migración: Agregar campo de precio total pagado al registro de combustible
-- Esto permite calcular costo por kilómetro (el KPI más importante para gerencia)
-- Ejecutar en Supabase SQL Editor

ALTER TABLE public.registros_combustible 
  ADD COLUMN IF NOT EXISTS precio_total_pago integer DEFAULT NULL;

-- Comentario: es NULL para registros antiguos (no se puede retroactivar).
-- Los nuevos registros lo capturan. El dashboard ignora registros sin precio
-- al calcular costo/km promedio.
