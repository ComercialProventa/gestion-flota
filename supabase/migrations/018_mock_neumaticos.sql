-- Mock de datos para dashboard de Neumáticos (CPK Ranking)
-- Crea neumáticos en estado 'reciclaje' con precios y km reales variados
-- Ejecutar DESPUÉS de 011_poblar_modelos_neumaticos (modelos ya existen)
-- Limpiar datos anteriores si existen:
-- DELETE FROM movimientos_neumaticos WHERE neumatico_id::text LIKE 'e0000001%';
-- DELETE FROM neumaticos WHERE id::text LIKE 'e0000001%';

-- MICHILEN 295/80R22.5 — Premium, buen rendimiento
INSERT INTO neumaticos (id, codigo_unico, modelo_id, estado, precio, desgaste_acumulado_km, numero_serie, codigo_dot, ciclo_vida)
SELECT
  ('e0000001-0000-0000-0000-' || LPAD(i::text, 12, '0'))::uuid,
  'NEU-MICH-295-' || LPAD(i::text, 3, '0'),
  (SELECT id FROM modelos_neumaticos WHERE marca = 'Michelin' AND medida = '295/80R22.5' LIMIT 1),
  'reciclaje',
  320000 + (random() * 40000)::integer,
  108000 + (random() * 15000)::integer,
  'SR-MICH-' || LPAD(i::text, 6, '0'),
  (2020 + (random() * 3)::integer)::text,
  'nuevo'
FROM generate_series(1, 8) AS i;

-- MICHILEN 315/80R22.5 — Premium tracción
INSERT INTO neumaticos (id, codigo_unico, modelo_id, estado, precio, desgaste_acumulado_km, numero_serie, codigo_dot, ciclo_vida)
SELECT
  ('e0000002-0000-0000-0000-' || LPAD(i::text, 12, '0'))::uuid,
  'NEU-MICH-315-' || LPAD(i::text, 3, '0'),
  (SELECT id FROM modelos_neumaticos WHERE marca = 'Michelin' AND medida = '315/80R22.5' LIMIT 1),
  'reciclaje',
  380000 + (random() * 50000)::integer,
  115000 + (random() * 18000)::integer,
  'SR-MICH315-' || LPAD(i::text, 6, '0'),
  (2020 + (random() * 3)::integer)::text,
  'nuevo'
FROM generate_series(1, 6) AS i;

-- BRIDGESTONE 295/80R22.5 — Premium direccional
INSERT INTO neumaticos (id, codigo_unico, modelo_id, estado, precio, desgaste_acumulado_km, numero_serie, codigo_dot, ciclo_vida)
SELECT
  ('e0000003-0000-0000-0000-' || LPAD(i::text, 12, '0'))::uuid,
  'NEU-BRID-295-' || LPAD(i::text, 3, '0'),
  (SELECT id FROM modelos_neumaticos WHERE marca = 'Bridgestone' AND medida = '295/80R22.5' LIMIT 1),
  'reciclaje',
  290000 + (random() * 35000)::integer,
  100000 + (random() * 12000)::integer,
  'SR-BRID-' || LPAD(i::text, 6, '0'),
  (2020 + (random() * 3)::integer)::text,
  'nuevo'
FROM generate_series(1, 7) AS i;

-- GOODYEAR 295/80R22.5 — Premium tracción
INSERT INTO neumaticos (id, codigo_unico, modelo_id, estado, precio, desgaste_acumulado_km, numero_serie, codigo_dot, ciclo_vida)
SELECT
  ('e0000004-0000-0000-0000-' || LPAD(i::text, 12, '0'))::uuid,
  'NEU-GDYR-295-' || LPAD(i::text, 3, '0'),
  (SELECT id FROM modelos_neumaticos WHERE marca = 'Goodyear' AND medida = '295/80R22.5' LIMIT 1),
  'reciclaje',
  270000 + (random() * 30000)::integer,
  92000 + (random() * 10000)::integer,
  'SR-GDYR-' || LPAD(i::text, 6, '0'),
  (2020 + (random() * 3)::integer)::text,
  'nuevo'
FROM generate_series(1, 5) AS i;

-- CONTINENTAL 295/80R22.5 — Premium direccional
INSERT INTO neumaticos (id, codigo_unico, modelo_id, estado, precio, desgaste_acumulado_km, numero_serie, codigo_dot, ciclo_vida)
SELECT
  ('e0000005-0000-0000-0000-' || LPAD(i::text, 12, '0'))::uuid,
  'NEU-CONT-295-' || LPAD(i::text, 3, '0'),
  (SELECT id FROM modelos_neumaticos WHERE marca = 'Continental' AND medida = '295/80R22.5' LIMIT 1),
  'reciclaje',
  280000 + (random() * 30000)::integer,
  102000 + (random() * 12000)::integer,
  'SR-CONT-' || LPAD(i::text, 6, '0'),
  (2020 + (random() * 3)::integer)::text,
  'nuevo'
FROM generate_series(1, 5) AS i;

-- HANKOOK 295/80R22.5 — Middle regular
INSERT INTO neumaticos (id, codigo_unico, modelo_id, estado, precio, desgaste_acumulado_km, numero_serie, codigo_dot, ciclo_vida)
SELECT
  ('e0000006-0000-0000-0000-' || LPAD(i::text, 12, '0'))::uuid,
  'NEU-HANK-295-' || LPAD(i::text, 3, '0'),
  (SELECT id FROM modelos_neumaticos WHERE marca = 'Hankook' AND medida = '295/80R22.5' LIMIT 1),
  'reciclaje',
  195000 + (random() * 25000)::integer,
  78000 + (random() * 10000)::integer,
  'SR-HANK-' || LPAD(i::text, 6, '0'),
  (2021 + (random() * 2)::integer)::text,
  'nuevo'
FROM generate_series(1, 6) AS i;

-- FIRESTONE 295/80R22.5 — Middle tracción
INSERT INTO neumaticos (id, codigo_unico, modelo_id, estado, precio, desgaste_acumulado_km, numero_serie, codigo_dot, ciclo_vida)
SELECT
  ('e0000007-0000-0000-0000-' || LPAD(i::text, 12, '0'))::uuid,
  'NEU-FIRE-295-' || LPAD(i::text, 3, '0'),
  (SELECT id FROM modelos_neumaticos WHERE marca = 'Firestone' AND medida = '295/80R22.5' LIMIT 1),
  'reciclaje',
  180000 + (random() * 20000)::integer,
  72000 + (random() * 8000)::integer,
  'SR-FIRE-' || LPAD(i::text, 6, '0'),
  (2021 + (random() * 2)::integer)::text,
  'nuevo'
FROM generate_series(1, 5) AS i;

-- DUNLOP 295/80R22.5 — Middle mixto
INSERT INTO neumaticos (id, codigo_unico, modelo_id, estado, precio, desgaste_acumulado_km, numero_serie, codigo_dot, ciclo_vida)
SELECT
  ('e0000008-0000-0000-0000-' || LPAD(i::text, 12, '0'))::uuid,
  'NEU-DUNL-295-' || LPAD(i::text, 3, '0'),
  (SELECT id FROM modelos_neumaticos WHERE marca = 'Dunlop' AND medida = '295/80R22.5' LIMIT 1),
  'reciclaje',
  190000 + (random() * 20000)::integer,
  75000 + (random() * 12000)::integer,
  'SR-DUNL-' || LPAD(i::text, 6, '0'),
  (2021 + (random() * 2)::integer)::text,
  'nuevo'
FROM generate_series(1, 4) AS i;

-- AEOLUS 295/80R22.5 — Budget bajo
INSERT INTO neumaticos (id, codigo_unico, modelo_id, estado, precio, desgaste_acumulado_km, numero_serie, codigo_dot, ciclo_vida)
SELECT
  ('e0000009-0000-0000-0000-' || LPAD(i::text, 12, '0'))::uuid,
  'NEU-AEOL-295-' || LPAD(i::text, 3, '0'),
  (SELECT id FROM modelos_neumaticos WHERE marca = 'Aeolus' AND medida = '295/80R22.5' LIMIT 1),
  'reciclaje',
  120000 + (random() * 15000)::integer,
  52000 + (random() * 10000)::integer,
  'SR-AEOL-' || LPAD(i::text, 6, '0'),
  (2021 + (random() * 2)::integer)::text,
  'nuevo'
FROM generate_series(1, 8) AS i;

-- LINGLONG 295/80R22.5 — Budget muy bajo
INSERT INTO neumaticos (id, codigo_unico, modelo_id, estado, precio, desgaste_acumulado_km, numero_serie, codigo_dot, ciclo_vida)
SELECT
  ('e000000a-0000-0000-0000-' || LPAD(i::text, 12, '0'))::uuid,
  'NEU-LING-295-' || LPAD(i::text, 3, '0'),
  (SELECT id FROM modelos_neumaticos WHERE marca = 'Linglong' AND medida = '295/80R22.5' LIMIT 1),
  'reciclaje',
  95000 + (random() * 12000)::integer,
  42000 + (random() * 8000)::integer,
  'SR-LING-' || LPAD(i::text, 6, '0'),
  (2022 + (random() * 1)::integer)::text,
  'nuevo'
FROM generate_series(1, 6) AS i;

-- TRIANGLE 295/80R22.5 — Budget bajo
INSERT INTO neumaticos (id, codigo_unico, modelo_id, estado, precio, desgaste_acumulado_km, numero_serie, codigo_dot, ciclo_vida)
SELECT
  ('e000000b-0000-0000-0000-' || LPAD(i::text, 12, '0'))::uuid,
  'NEU-TRIA-295-' || LPAD(i::text, 3, '0'),
  (SELECT id FROM modelos_neumaticos WHERE marca = 'Triangle' AND medida = '295/80R22.5' LIMIT 1),
  'reciclaje',
  85000 + (random() * 10000)::integer,
  38000 + (random() * 10000)::integer,
  'SR-TRIA-' || LPAD(i::text, 6, '0'),
  (2022 + (random() * 1)::integer)::text,
  'nuevo'
FROM generate_series(1, 5) AS i;

-- PIRELLI 295/80R22.5 — Premium medio
INSERT INTO neumaticos (id, codigo_unico, modelo_id, estado, precio, desgaste_acumulado_km, numero_serie, codigo_dot, ciclo_vida)
SELECT
  ('e000000c-0000-0000-0000-' || LPAD(i::text, 12, '0'))::uuid,
  'NEU-PIRE-295-' || LPAD(i::text, 3, '0'),
  (SELECT id FROM modelos_neumaticos WHERE marca = 'Pirelli' AND medida = '295/80R22.5' LIMIT 1),
  'reciclaje',
  250000 + (random() * 30000)::integer,
  82000 + (random() * 10000)::integer,
  'SR-PIRE-' || LPAD(i::text, 6, '0'),
  (2020 + (random() * 3)::integer)::text,
  'nuevo'
FROM generate_series(1, 4) AS i;

-- YOKOHAMA 295/80R22.5 — Middle direccional
INSERT INTO neumaticos (id, codigo_unico, modelo_id, estado, precio, desgaste_acumulado_km, numero_serie, codigo_dot, ciclo_vida)
SELECT
  ('e000000d-0000-0000-0000-' || LPAD(i::text, 12, '0'))::uuid,
  'NEU-YOKO-295-' || LPAD(i::text, 3, '0'),
  (SELECT id FROM modelos_neumaticos WHERE marca = 'Yokohama' AND medida = '295/80R22.5' LIMIT 1),
  'reciclaje',
  210000 + (random() * 25000)::integer,
  80000 + (random() * 12000)::integer,
  'SR-YOKO-' || LPAD(i::text, 6, '0'),
  (2021 + (random() * 2)::integer)::text,
  'nuevo'
FROM generate_series(1, 4) AS i;

-- MOVIMIENTOS (reciclaje)
INSERT INTO movimientos_neumaticos (neumatico_id, accion, posicion_origen, fecha_hora, kilometraje_bus_momento, bus_id, usuario_id)
SELECT
  n.id,
  'baja',
  CASE (random() * 3)::integer
    WHEN 0 THEN 'delantero_izquierdo'
    WHEN 1 THEN 'delantero_derecho'
    WHEN 2 THEN 'trasero_exterior_izquierdo'
    ELSE 'trasero_exterior_derecho'
  END::posicion_neumatico,
  NOW() - (random() * interval '90 days'),
  100000 + (random() * 200000)::integer,
  (SELECT id FROM buses ORDER BY random() LIMIT 1),
  (SELECT id FROM usuarios WHERE rol = 'conductor' ORDER BY random() LIMIT 1)
FROM neumaticos n
WHERE n.id::text LIKE 'e0000001%'
ON CONFLICT DO NOTHING;

-- RESUMEN
SELECT
  'Mock neumáticos OK: ' || count(*) || ' neumáticos reciclados de ' || count(DISTINCT modelo_id) || ' modelos' AS resultado
FROM neumaticos
WHERE id::text LIKE 'e000000%';
