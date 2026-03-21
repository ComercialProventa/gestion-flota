-- Migración 006: Trazabilidad de Creador de Inventario
-- Añade la columna 'usuario_creador_id' a la tabla 'neumaticos'.

ALTER TABLE neumaticos 
ADD COLUMN IF NOT EXISTS usuario_creador_id UUID REFERENCES usuarios(id);

-- Opcional: Crear índice para optimizar búsquedas por operario
CREATE INDEX IF NOT EXISTS idx_neumaticos_creador ON neumaticos(usuario_creador_id);
