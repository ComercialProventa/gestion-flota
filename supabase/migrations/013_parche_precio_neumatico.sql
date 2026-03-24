-- Migración 013: Parche Precio Neumaticos
-- Fecha: 2026-03-23
-- Descripción: Soluciona el error silencioso de lectura asegurando que la columna precio existe en la tabla de inventario físico.

ALTER TABLE neumaticos ADD COLUMN IF NOT EXISTS precio integer DEFAULT 0;
