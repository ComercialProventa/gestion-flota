-- Migración 004: Neumáticos World-Class
-- Añade estándares industriales para el manejo de neumáticos

-- 1. Crear ENUMs
CREATE TYPE tipo_aplicacion_neumatico AS ENUM ('direccional', 'traccion', 'arrastre', 'mixto');
CREATE TYPE estado_ciclo_vida AS ENUM ('nuevo', 'recapado_1', 'recapado_2', 'recapado_3');

-- 2. Actualizar Tabla modelos_neumaticos
ALTER TABLE modelos_neumaticos
  ADD COLUMN aplicacion_eje tipo_aplicacion_neumatico NOT NULL DEFAULT 'mixto',
  ADD COLUMN profundidad_estria_nueva_mm INTEGER NOT NULL DEFAULT 20;

-- 3. Actualizar Tabla neumaticos (Inventario físico)
ALTER TABLE neumaticos
  ADD COLUMN numero_serie VARCHAR(150),
  ADD COLUMN codigo_dot VARCHAR(4),
  ADD COLUMN ciclo_vida estado_ciclo_vida NOT NULL DEFAULT 'nuevo';

-- Índices recomendados
CREATE INDEX idx_neumaticos_nro_serie ON neumaticos(numero_serie);
CREATE INDEX idx_neumaticos_dot ON neumaticos(codigo_dot);
