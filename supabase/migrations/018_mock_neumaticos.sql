-- Mock de datos para dashboard de Neumáticos (CPK Ranking)
-- Crea neumáticos en estado 'reciclaje' con precios y km reales variados
-- Ejecutar DESPUÉS de 011_poblar_modelos_neumaticos (modelos ya existen)
-- NOTA: si ya existen datos mock, borrar primero:
-- DELETE FROM movimientos_neumaticos WHERE neumatico_id::text LIKE 'n0000001%';
-- DELETE FROM neumaticos WHERE id::text LIKE 'n0000001%';

-- ═══════════════════════════════════════════════════
-- NEUMÁTICOS RECICLADOS (mock data para CPK ranking)
-- ═══════════════════════════════════════════════════
-- Estrategia: cada modelo tiene varias muestras con variación realista
-- Los IDs de modelo se referencian por subquery a la tabla modelos_neumaticos

-- MICHILEN 295/80R22.5 — Premium, buen rendimiento (CPK bajo)
INSERT INTO neumaticos (id, codigo_unico, modelo_id, estado, precio, desgaste_acumulado_km, numero_serie, codigo_dot, ciclo_vida)
SELECT
  'n0000001-0001-0001-0001-' || LPAD(i::text, 12, '0'),
  'NEU-MICH-295-' || LPAD(i::text, 3, '0'),
  (SELECT id FROM modelos_neumaticos WHERE marca = 'Michelin' AND medida = '295/80R22.5' LIMIT 1),
  'reciclaje',
  320000 + (random() * 40000)::integer,
  108000 + (random() * 15000)::integer,  -- vida util: 115000 → cumple ~95-105%
  'SR-MICH-' || LPAD(i::text, 6, '0'),
  'DOT' || (2020 + (random() * 3)::integer)::text,
  'nuevo'
FROM generate_series(1, 8) AS i;

-- MICHILEN 315/80R22.5 — Premium tracción
INSERT INTO neumaticos (id, codigo_unico, modelo_id, estado, precio, desgaste_acumulado_km, numero_serie, codigo_dot, ciclo_vida)
SELECT
  'n0000002-0001-0001-0001-' || LPAD(i::text, 12, '0'),
  'NEU-MICH-315-' || LPAD(i::text, 3, '0'),
  (SELECT id FROM modelos_neumaticos WHERE marca = 'Michelin' AND medida = '315/80R22.5' LIMIT 1),
  'reciclaje',
  380000 + (random() * 50000)::integer,
  115000 + (random() * 18000)::integer,  -- vida util: 125000 → cumple ~92-107%
  'SR-MICH315-' || LPAD(i::text, 6, '0'),
  'DOT' || (2020 + (random() * 3)::integer)::text,
  'nuevo'
FROM generate_series(1, 6) AS i;

-- BRIDGESTONE 295/80R22.5 — Premium direccional
INSERT INTO neumaticos (id, codigo_unico, modelo_id, estado, precio, desgaste_acumulado_km, numero_serie, codigo_dot, ciclo_vida)
SELECT
  'n0000003-0001-0001-0001-' || LPAD(i::text, 12, '0'),
  'NEU-BRID-295-' || LPAD(i::text, 3, '0'),
  (SELECT id FROM modelos_neumaticos WHERE marca = 'Bridgestone' AND medida = '295/80R22.5' LIMIT 1),
  'reciclaje',
  290000 + (random() * 35000)::integer,
  100000 + (random() * 12000)::integer,  -- vida util: 115000 → cumple ~87-97%
  'SR-BRID-' || LPAD(i::text, 6, '0'),
  'DOT' || (2020 + (random() * 3)::integer)::text,
  'nuevo'
FROM generate_series(1, 7) AS i;

-- GOODYEAR 295/80R22.5 — Premium tracción
INSERT INTO neumaticos (id, codigo_unico, modelo_id, estado, precio, desgaste_acumulado_km, numero_serie, codigo_dot, ciclo_vida)
SELECT
  'n0000004-0001-0001-0001-' || LPAD(i::text, 12, '0'),
  'NEU-GDYR-295-' || LPAD(i::text, 3, '0'),
  (SELECT id FROM modelos_neumaticos WHERE marca = 'Goodyear' AND medida = '295/80R22.5' LIMIT 1),
  'reciclaje',
  270000 + (random() * 30000)::integer,
  92000 + (random() * 10000)::integer,  -- vida util: 105000 → cumple ~88-97%
  'SR-GDYR-' || LPAD(i::text, 6, '0'),
  'DOT' || (2020 + (random() * 3)::integer)::text,
  'nuevo'
FROM generate_series(1, 5) AS i;

-- CONTINENTAL 295/80R22.5 — Premium direccional
INSERT INTO neumaticos (id, codigo_unico, modelo_id, estado, precio, desgaste_acumulado_km, numero_serie, codigo_dot, ciclo_vida)
SELECT
  'n0000005-0001-0001-0001-' || LPAD(i::text, 12, '0'),
  'NEU-CONT-295-' || LPAD(i::text, 3, '0'),
  (SELECT id FROM modelos_neumaticos WHERE marca = 'Continental' AND medida = '295/80R22.5' LIMIT 1),
  'reciclaje',
  280000 + (random() * 30000)::integer,
  102000 + (random() * 12000)::integer,  -- vida util: 115000 → cumple ~89-99%
  'SR-CONT-' || LPAD(i::text, 6, '0'),
  'DOT' || (2020 + (random() * 3)::integer)::text,
  'nuevo'
FROM generate_series(1, 5) AS i;

-- HANKOOK 295/80R22.5 — Middle, rendimiento regular
INSERT INTO neumaticos (id, codigo_unico, modelo_id, estado, precio, desgaste_acumulado_km, numero_serie, codigo_dot, ciclo_vida)
SELECT
  'n0000006-0001-0001-0001-' || LPAD(i::text, 12, '0'),
  'NEU-HANK-295-' || LPAD(i::text, 3, '0'),
  (SELECT id FROM modelos_neumaticos WHERE marca = 'Hankook' AND medida = '295/80R22.5' LIMIT 1),
  'reciclaje',
  195000 + (random() * 25000)::integer,
  78000 + (random() * 10000)::integer,  -- vida util: 90000 → cumple ~87-98%
  'SR-HANK-' || LPAD(i::text, 6, '0'),
  'DOT' || (2021 + (random() * 2)::integer)::text,
  'nuevo'
FROM generate_series(1, 6) AS i;

-- FIRESTONE 295/80R22.5 — Middle tracción
INSERT INTO neumaticos (id, codigo_unico, modelo_id, estado, precio, desgaste_acumulado_km, numero_serie, codigo_dot, ciclo_vida)
SELECT
  'n0000007-0001-0001-0001-' || LPAD(i::text, 12, '0'),
  'NEU-FIRE-295-' || LPAD(i::text, 3, '0'),
  (SELECT id FROM modelos_neumaticos WHERE marca = 'Firestone' AND medida = '295/80R22.5' LIMIT 1),
  'reciclaje',
  180000 + (random() * 20000)::integer,
  72000 + (random() * 8000)::integer,   -- vida util: 88000 → cumple ~82-91%
  'SR-FIRE-' || LPAD(i::text, 6, '0'),
  'DOT' || (2021 + (random() * 2)::integer)::text,
  'nuevo'
FROM generate_series(1, 5) AS i;

-- DUNLOP 295/80R22.5 — Middle mixto
INSERT INTO neumaticos (id, codigo_unico, modelo_id, estado, precio, desgaste_acumulado_km, numero_serie, codigo_dot, ciclo_vida)
SELECT
  'n0000008-0001-0001-0001-' || LPAD(i::text, 12, '0'),
  'NEU-DUNL-295-' || LPAD(i::text, 3, '0'),
  (SELECT id FROM modelos_neumaticos WHERE marca = 'Dunlop' AND medida = '295/80R22.5' LIMIT 1),
  'reciclaje',
  190000 + (random() * 20000)::integer,
  75000 + (random() * 12000)::integer,  -- vida util: 90000 → cumple ~83-97%
  'SR-DUNL-' || LPAD(i::text, 6, '0'),
  'DOT' || (2021 + (random() * 2)::integer)::text,
  'nuevo'
FROM generate_series(1, 4) AS i;

-- AEOLUS 295/80R22.5 — Budget, rendimiento bajo (CPK alto)
INSERT INTO neumaticos (id, codigo_unico, modelo_id, estado, precio, desgaste_acumulado_km, numero_serie, codigo_dot, ciclo_vida)
SELECT
  'n0000009-0001-0001-0001-' || LPAD(i::text, 12, '0'),
  'NEU-AEOL-295-' || LPAD(i::text, 3, '0'),
  (SELECT id FROM modelos_neumaticos WHERE marca = 'Aeolus' AND medida = '295/80R22.5' LIMIT 1),
  'reciclaje',
  120000 + (random() * 15000)::integer,
  52000 + (random() * 10000)::integer,  -- vida util: 70000 → cumple ~74-89%
  'SR-AEOL-' || LPAD(i::text, 6, '0'),
  'DOT' || (2021 + (random() * 2)::integer)::text,
  'nuevo'
FROM generate_series(1, 8) AS i;

-- LINGLONG 295/80R22.5 — Budget, muy bajo rendimiento
INSERT INTO neumaticos (id, codigo_unico, modelo_id, estado, precio, desgaste_acumulado_km, numero_serie, codigo_dot, ciclo_vida)
SELECT
  'n0000010-0001-0001-0001-' || LPAD(i::text, 12, '0'),
  'NEU-LING-295-' || LPAD(i::text, 3, '0'),
  (SELECT id FROM modelos_neumaticos WHERE marca = 'Linglong' AND medida = '295/80R22.5' LIMIT 1),
  'reciclaje',
  95000 + (random() * 12000)::integer,
  42000 + (random() * 8000)::integer,   -- vida util: 65000 → cumple ~65-77%
  'SR-LING-' || LPAD(i::text, 6, '0'),
  'DOT' || (2022 + (random() * 1)::integer)::text,
  'nuevo'
FROM generate_series(1, 6) AS i;

-- TRIANGLE 295/80R22.5 — Budget, bajo rendimiento
INSERT INTO neumaticos (id, codigo_unico, modelo_id, estado, precio, desgaste_acumulado_km, numero_serie, codigo_dot, ciclo_vida)
SELECT
  'n0000011-0001-0001-0001-' || LPAD(i::text, 12, '0'),
  'NEU-TRIA-295-' || LPAD(i::text, 3, '0'),
  (SELECT id FROM modelos_neumaticos WHERE marca = 'Triangle' AND medida = '295/80R22.5' LIMIT 1),
  'reciclaje',
  85000 + (random() * 10000)::integer,
  38000 + (random() * 10000)::integer,  -- vida util: 60000 → cumple ~63-80%
  'SR-TRIA-' || LPAD(i::text, 6, '0'),
  'DOT' || (2022 + (random() * 1)::integer)::text,
  'nuevo'
FROM generate_series(1, 5) AS i;

-- PIRELLI 295/80R22.5 — Premium medio
INSERT INTO neumaticos (id, codigo_unico, modelo_id, estado, precio, desgaste_acumulado_km, numero_serie, codigo_dot, ciclo_vida)
SELECT
  'n0000012-0001-0001-0001-' || LPAD(i::text, 12, '0'),
  'NEU-PIRE-295-' || LPAD(i::text, 3, '0'),
  (SELECT id FROM modelos_neumaticos WHERE marca = 'Pirelli' AND medida = '295/80R22.5' LIMIT 1),
  'reciclaje',
  250000 + (random() * 30000)::integer,
  82000 + (random() * 10000)::integer,  -- vida util: 95000 → cumple ~86-97%
  'SR-PIRE-' || LPAD(i::text, 6, '0'),
  'DOT' || (2020 + (random() * 3)::integer)::text,
  'nuevo'
FROM generate_series(1, 4) AS i;

-- YOKOHAMA 295/80R22.5 — Middle direccional
INSERT INTO neumaticos (id, codigo_unico, modelo_id, estado, precio, desgaste_acumulado_km, numero_serie, codigo_dot, ciclo_vida)
SELECT
  'n0000013-0001-0001-0001-' || LPAD(i::text, 12, '0'),
  'NEU-YOKO-295-' || LPAD(i::text, 3, '0'),
  (SELECT id FROM modelos_neumaticos WHERE marca = 'Yokohama' AND medida = '295/80R22.5' LIMIT 1),
  'reciclaje',
  210000 + (random() * 25000)::integer,
  80000 + (random() * 12000)::integer,  -- vida util: 95000 → cumple ~84-97%
  'SR-YOKO-' || LPAD(i::text, 6, '0'),
  'DOT' || (2021 + (random() * 2)::integer)::text,
  'nuevo'
FROM generate_series(1, 4) AS i;

-- ═══════════════════════════════════════════════════
-- MOVIMIENTOS (reciclaje) — para trazabilidad
-- ═══════════════════════════════════════════════════
-- Un movimiento de reciclaje por cada neumático mock

INSERT INTO movimientos_neumaticos (neumatico_id, accion, posicion_origen, fecha_hora, kilometraje_bus_momento, bus_id, usuario_id)
SELECT
  n.id,
  'reciclaje',
  CASE (random() * 3)::integer
    WHEN 0 THEN 'eje_delantero_izq'
    WHEN 1 THEN 'eje_delantero_der'
    WHEN 2 THEN 'eje_trasero_ext_izq'
    ELSE 'eje_trasero_int_der'
  END,
  NOW() - (random() * interval '90 days'),
  100000 + (random() * 200000)::integer,
  (SELECT id FROM buses ORDER BY random() LIMIT 1),
  (SELECT id FROM usuarios WHERE rol = 'conductor' ORDER BY random() LIMIT 1)
FROM neumaticos n
WHERE n.id::text LIKE 'n000001%'
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════
-- RESUMEN
-- ═══════════════════════════════════════════════════
SELECT
  'Mock neumáticos OK: ' || count(*) || ' neumáticos reciclados de ' || count(DISTINCT modelo_id) || ' modelos' AS resultado
FROM neumaticos
WHERE id::text LIKE 'n000001%';
