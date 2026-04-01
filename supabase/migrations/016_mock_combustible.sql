-- Mock de datos para dashboard de combustible
-- 10 máquinas, 10 conductores, ~15 cargas/mes × 5 meses (Nov 2025 - Mar 2026)
-- Ejecutar DESPUÉS de 017_asientos_nullable y 015_precio_combustible

-- ═══════════════════════════════════════════════════
-- 1. UNIDADES
-- ═══════════════════════════════════════════════════

INSERT INTO buses (id, patente, marca, modelo, ano, chasis, tipo, capacidad_estanque, asientos, vencimiento_revision_tecnica, vencimiento_seguro) VALUES
  ('a0000001-0001-0001-0001-000000000001', 'ABCD-12', 'Mercedes-Benz', 'O-500',    2022, '2_ejes_6_ruedas', 'bus',  400, 44, '2026-08-15', '2026-06-01'),
  ('a0000001-0001-0001-0001-000000000002', 'EFGH-34', 'Mercedes-Benz', 'O-500',    2022, '2_ejes_6_ruedas', 'bus',  400, 44, '2026-09-20', '2026-07-10'),
  ('a0000001-0001-0001-0001-000000000003', 'IJKL-56', 'Volvo',         'B290R',    2021, '3_ejes_10_ruedas','bus',  450, 48, '2026-05-10', '2026-04-15'),
  ('a0000001-0001-0001-0001-000000000004', 'MNOP-78', 'Volvo',         'B290R',    2021, '3_ejes_10_ruedas','bus',  450, 48, '2026-11-01', '2026-09-20'),
  ('a0000001-0001-0001-0001-000000000005', 'QRST-90', 'Scania',        'K320',     2023, '2_ejes_6_ruedas', 'bus',  380, 42, '2026-07-30', '2026-05-25'),
  ('a0000001-0001-0001-0001-000000000006', 'UVWX-11', 'Scania',        'K320',     2023, '2_ejes_6_ruedas', 'bus',  380, 42, '2026-12-15', '2026-10-01'),
  ('a0000001-0001-0001-0001-000000000007', 'YZAB-22', 'Mercedes-Benz', 'Actros 2651','2023','2_ejes_6_ruedas','camion',550,NULL,'2026-06-20','2026-04-30'),
  ('a0000001-0001-0001-0001-000000000008', 'CDEF-33', 'Mercedes-Benz', 'Actros 2651','2023','2_ejes_6_ruedas','camion',550,NULL,'2026-10-05','2026-08-12'),
  ('a0000001-0001-0001-0001-000000000009', 'GHIJ-44', 'Marcopolo',     'Paradiso G7',2022,'3_ejes_10_ruedas','bus', 450, 46, '2026-08-25','2026-06-18'),
  ('a0000001-0001-0001-0001-000000000010', 'KLMN-55', 'Marcopolo',     'Paradiso G7',2022,'3_ejes_10_ruedas','bus', 450, 46, '2026-09-10','2026-07-22')
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════
-- 2. USUARIOS CONDUCTORES
-- ═══════════════════════════════════════════════════

INSERT INTO usuarios (id, nombre_completo, rut, correo, rol) VALUES
  ('b0000001-0001-0001-0001-000000000001', 'Carlos Mendoza',   '12.345.678-9', 'carlos.mendoza@proventa.cl',   'conductor'),
  ('b0000001-0001-0001-0001-000000000002', 'María González',   '13.456.789-0', 'maria.gonzalez@proventa.cl',   'conductor'),
  ('b0000001-0001-0001-0001-000000000003', 'Pedro Ramírez',    '14.567.890-1', 'pedro.ramirez@proventa.cl',    'conductor'),
  ('b0000001-0001-0001-0001-000000000004', 'Ana Martínez',     '15.678.901-2', 'ana.martinez@proventa.cl',     'conductor'),
  ('b0000001-0001-0001-0001-000000000005', 'Luis Hernández',   '16.789.012-3', 'luis.hernandez@proventa.cl',   'conductor'),
  ('b0000001-0001-0001-0001-000000000006', 'Rosa Flores',      '17.890.123-4', 'rosa.flores@proventa.cl',      'conductor'),
  ('b0000001-0001-0001-0001-000000000007', 'Jorge Soto',       '18.901.234-5', 'jorge.soto@proventa.cl',       'conductor'),
  ('b0000001-0001-0001-0001-000000000008', 'Carmen Vargas',    '19.012.345-6', 'carmen.vargas@proventa.cl',    'conductor'),
  ('b0000001-0001-0001-0001-000000000009', 'Miguel Torres',    '20.123.456-7', 'miguel.torres@proventa.cl',    'conductor'),
  ('b0000001-0001-0001-0001-000000000010', 'Patricia Rojas',   '21.234.567-8', 'patricia.rojas@proventa.cl',   'conductor')
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════
-- 3. ASIGNACIONES
-- ═══════════════════════════════════════════════════

INSERT INTO asignacion_flota (usuario_id, bus_id) VALUES
  ('b0000001-0001-0001-0001-000000000001', 'a0000001-0001-0001-0001-000000000001'),
  ('b0000001-0001-0001-0001-000000000002', 'a0000001-0001-0001-0001-000000000002'),
  ('b0000001-0001-0001-0001-000000000003', 'a0000001-0001-0001-0001-000000000003'),
  ('b0000001-0001-0001-0001-000000000004', 'a0000001-0001-0001-0001-000000000004'),
  ('b0000001-0001-0001-0001-000000000005', 'a0000001-0001-0001-0001-000000000005'),
  ('b0000001-0001-0001-0001-000000000006', 'a0000001-0001-0001-0001-000000000006'),
  ('b0000001-0001-0001-0001-000000000007', 'a0000001-0001-0001-0001-000000000007'),
  ('b0000001-0001-0001-0001-000000000008', 'a0000001-0001-0001-0001-000000000008'),
  ('b0000001-0001-0001-0001-000000000009', 'a0000001-0001-0001-0001-000000000009'),
  ('b0000001-0001-0001-0001-000000000010', 'a0000001-0001-0001-0001-000000000010')
ON CONFLICT (usuario_id, bus_id) DO NOTHING;

-- ═══════════════════════════════════════════════════
-- 4. REGISTROS DE COMBUSTIBLE (~750 registros)
-- ═══════════════════════════════════════════════════

DO $$
DECLARE
  bus_id_var TEXT;
  km_inicio  INTEGER;
  kml_base   NUMERIC;
  precio_l   INTEGER;
  fecha_carga DATE;
  fecha_fin   DATE := '2026-03-31';
  km_actual   INTEGER;
  kml_real    NUMERIC;
  litros_val  NUMERIC;
  precio_val  INTEGER;
  dias_add    INTEGER;
  mes_actual  INTEGER;
BEGIN
  -- Bus 1: ABCD-12 — Eficiente (3.5 Km/L) — Carlos Mendoza
  bus_id_var := 'a0000001-0001-0001-0001-000000000001';
  km_inicio := 120000; kml_base := 3.5; precio_l := 980;
  km_actual := km_inicio;
  fecha_carga := '2025-11-01';
  WHILE fecha_carga <= fecha_fin LOOP
    kml_real := kml_base * (0.85 + random() * 0.3);
    mes_actual := EXTRACT(MONTH FROM fecha_carga);
    IF mes_actual = 1 THEN kml_real := kml_real * 0.85; END IF;
    km_actual := km_actual + (300 + (random() * 200)::INTEGER);
    litros_val := ROUND(((300 + random() * 200) / kml_real)::numeric, 1);
    precio_val := ROUND(litros_val * precio_l * (0.95 + random() * 0.1));
    INSERT INTO registros_combustible (bus_id, fecha, hora, kilometraje, litros_cargados, precio_total_pago)
    VALUES (bus_id_var, fecha_carga, LPAD((6 + (random() * 14)::INTEGER)::TEXT, 2, '0') || ':' || LPAD((random() * 59)::INTEGER::TEXT, 2, '0'), km_actual, litros_val, precio_val);
    dias_add := 2 + (random() * 2)::INTEGER;
    fecha_carga := fecha_carga + dias_add;
  END LOOP;

  -- Bus 2: EFGH-34 — INEFICIENTE (2.0 Km/L) — María González ← PROBLEMA
  bus_id_var := 'a0000001-0001-0001-0001-000000000002';
  km_inicio := 95000; kml_base := 2.0; precio_l := 980;
  km_actual := km_inicio;
  fecha_carga := '2025-11-01';
  WHILE fecha_carga <= fecha_fin LOOP
    kml_real := kml_base * (0.85 + random() * 0.3);
    km_actual := km_actual + (300 + (random() * 200)::INTEGER);
    litros_val := ROUND(((300 + random() * 200) / kml_real)::numeric, 1);
    precio_val := ROUND(litros_val * precio_l * (0.95 + random() * 0.1));
    INSERT INTO registros_combustible (bus_id, fecha, hora, kilometraje, litros_cargados, precio_total_pago)
    VALUES (bus_id_var, fecha_carga, LPAD((6 + (random() * 14)::INTEGER)::TEXT, 2, '0') || ':' || LPAD((random() * 59)::INTEGER::TEXT, 2, '0'), km_actual, litros_val, precio_val);
    dias_add := 2 + (random() * 2)::INTEGER;
    fecha_carga := fecha_carga + dias_add;
  END LOOP;

  -- Bus 3: IJKL-56 — 3 ejes (2.8 Km/L) — Pedro Ramírez (gemela con MNOP-78)
  bus_id_var := 'a0000001-0001-0001-0001-000000000003';
  km_inicio := 180000; kml_base := 2.8; precio_l := 1020;
  km_actual := km_inicio;
  fecha_carga := '2025-11-01';
  WHILE fecha_carga <= fecha_fin LOOP
    kml_real := kml_base * (0.85 + random() * 0.3);
    km_actual := km_actual + (300 + (random() * 200)::INTEGER);
    litros_val := ROUND(((300 + random() * 200) / kml_real)::numeric, 1);
    precio_val := ROUND(litros_val * precio_l * (0.95 + random() * 0.1));
    INSERT INTO registros_combustible (bus_id, fecha, hora, kilometraje, litros_cargados, precio_total_pago)
    VALUES (bus_id_var, fecha_carga, LPAD((6 + (random() * 14)::INTEGER)::TEXT, 2, '0') || ':' || LPAD((random() * 59)::INTEGER::TEXT, 2, '0'), km_actual, litros_val, precio_val);
    dias_add := 2 + (random() * 2)::INTEGER;
    fecha_carga := fecha_carga + dias_add;
  END LOOP;

  -- Bus 4: MNOP-78 — 3 ejes, mejor (3.2 Km/L) — Ana Martínez (gemela con IJKL-56)
  bus_id_var := 'a0000001-0001-0001-0001-000000000004';
  km_inicio := 155000; kml_base := 3.2; precio_l := 1020;
  km_actual := km_inicio;
  fecha_carga := '2025-11-01';
  WHILE fecha_carga <= fecha_fin LOOP
    kml_real := kml_base * (0.85 + random() * 0.3);
    km_actual := km_actual + (300 + (random() * 200)::INTEGER);
    litros_val := ROUND(((300 + random() * 200) / kml_real)::numeric, 1);
    precio_val := ROUND(litros_val * precio_l * (0.95 + random() * 0.1));
    INSERT INTO registros_combustible (bus_id, fecha, hora, kilometraje, litros_cargados, precio_total_pago)
    VALUES (bus_id_var, fecha_carga, LPAD((6 + (random() * 14)::INTEGER)::TEXT, 2, '0') || ':' || LPAD((random() * 59)::INTEGER::TEXT, 2, '0'), km_actual, litros_val, precio_val);
    dias_add := 2 + (random() * 2)::INTEGER;
    fecha_carga := fecha_carga + dias_add;
  END LOOP;

  -- Bus 5: QRST-90 — Muy eficiente (3.8 Km/L) — Luis Hernández
  bus_id_var := 'a0000001-0001-0001-0001-000000000005';
  km_inicio := 75000; kml_base := 3.8; precio_l := 990;
  km_actual := km_inicio;
  fecha_carga := '2025-11-01';
  WHILE fecha_carga <= fecha_fin LOOP
    kml_real := kml_base * (0.85 + random() * 0.3);
    km_actual := km_actual + (300 + (random() * 200)::INTEGER);
    litros_val := ROUND(((300 + random() * 200) / kml_real)::numeric, 1);
    precio_val := ROUND(litros_val * precio_l * (0.95 + random() * 0.1));
    INSERT INTO registros_combustible (bus_id, fecha, hora, kilometraje, litros_cargados, precio_total_pago)
    VALUES (bus_id_var, fecha_carga, LPAD((6 + (random() * 14)::INTEGER)::TEXT, 2, '0') || ':' || LPAD((random() * 59)::INTEGER::TEXT, 2, '0'), km_actual, litros_val, precio_val);
    dias_add := 2 + (random() * 2)::INTEGER;
    fecha_carga := fecha_carga + dias_add;
  END LOOP;

  -- Bus 6: UVWX-11 — Promedio (3.0 Km/L) — Rosa Flores (gemela con QRST-90)
  bus_id_var := 'a0000001-0001-0001-0001-000000000006';
  km_inicio := 88000; kml_base := 3.0; precio_l := 990;
  km_actual := km_inicio;
  fecha_carga := '2025-11-01';
  WHILE fecha_carga <= fecha_fin LOOP
    kml_real := kml_base * (0.85 + random() * 0.3);
    km_actual := km_actual + (300 + (random() * 200)::INTEGER);
    litros_val := ROUND(((300 + random() * 200) / kml_real)::numeric, 1);
    precio_val := ROUND(litros_val * precio_l * (0.95 + random() * 0.1));
    INSERT INTO registros_combustible (bus_id, fecha, hora, kilometraje, litros_cargados, precio_total_pago)
    VALUES (bus_id_var, fecha_carga, LPAD((6 + (random() * 14)::INTEGER)::TEXT, 2, '0') || ':' || LPAD((random() * 59)::INTEGER::TEXT, 2, '0'), km_actual, litros_val, precio_val);
    dias_add := 2 + (random() * 2)::INTEGER;
    fecha_carga := fecha_carga + dias_add;
  END LOOP;

  -- Bus 7: YZAB-22 — Camión (2.3 Km/L) — Jorge Soto
  bus_id_var := 'a0000001-0001-0001-0001-000000000007';
  km_inicio := 200000; kml_base := 2.3; precio_l := 1050;
  km_actual := km_inicio;
  fecha_carga := '2025-11-01';
  WHILE fecha_carga <= fecha_fin LOOP
    kml_real := kml_base * (0.85 + random() * 0.3);
    km_actual := km_actual + (300 + (random() * 200)::INTEGER);
    litros_val := ROUND(((300 + random() * 200) / kml_real)::numeric, 1);
    precio_val := ROUND(litros_val * precio_l * (0.95 + random() * 0.1));
    INSERT INTO registros_combustible (bus_id, fecha, hora, kilometraje, litros_cargados, precio_total_pago)
    VALUES (bus_id_var, fecha_carga, LPAD((6 + (random() * 14)::INTEGER)::TEXT, 2, '0') || ':' || LPAD((random() * 59)::INTEGER::TEXT, 2, '0'), km_actual, litros_val, precio_val);
    dias_add := 2 + (random() * 2)::INTEGER;
    fecha_carga := fecha_carga + dias_add;
  END LOOP;

  -- Bus 8: CDEF-33 — Camión promedio (2.8 Km/L) — Carmen Vargas (gemela con YZAB-22)
  bus_id_var := 'a0000001-0001-0001-0001-000000000008';
  km_inicio := 175000; kml_base := 2.8; precio_l := 1050;
  km_actual := km_inicio;
  fecha_carga := '2025-11-01';
  WHILE fecha_carga <= fecha_fin LOOP
    kml_real := kml_base * (0.85 + random() * 0.3);
    km_actual := km_actual + (300 + (random() * 200)::INTEGER);
    litros_val := ROUND(((300 + random() * 200) / kml_real)::numeric, 1);
    precio_val := ROUND(litros_val * precio_l * (0.95 + random() * 0.1));
    INSERT INTO registros_combustible (bus_id, fecha, hora, kilometraje, litros_cargados, precio_total_pago)
    VALUES (bus_id_var, fecha_carga, LPAD((6 + (random() * 14)::INTEGER)::TEXT, 2, '0') || ':' || LPAD((random() * 59)::INTEGER::TEXT, 2, '0'), km_actual, litros_val, precio_val);
    dias_add := 2 + (random() * 2)::INTEGER;
    fecha_carga := fecha_carga + dias_add;
  END LOOP;

  -- Bus 9: GHIJ-44 — 3 ejes, bueno (3.4 Km/L) — Miguel Torres (gemela con KLMN-55)
  bus_id_var := 'a0000001-0001-0001-0001-000000000009';
  km_inicio := 130000; kml_base := 3.4; precio_l := 1000;
  km_actual := km_inicio;
  fecha_carga := '2025-11-01';
  WHILE fecha_carga <= fecha_fin LOOP
    kml_real := kml_base * (0.85 + random() * 0.3);
    km_actual := km_actual + (300 + (random() * 200)::INTEGER);
    litros_val := ROUND(((300 + random() * 200) / kml_real)::numeric, 1);
    precio_val := ROUND(litros_val * precio_l * (0.95 + random() * 0.1));
    INSERT INTO registros_combustible (bus_id, fecha, hora, kilometraje, litros_cargados, precio_total_pago)
    VALUES (bus_id_var, fecha_carga, LPAD((6 + (random() * 14)::INTEGER)::TEXT, 2, '0') || ':' || LPAD((random() * 59)::INTEGER::TEXT, 2, '0'), km_actual, litros_val, precio_val);
    dias_add := 2 + (random() * 2)::INTEGER;
    fecha_carga := fecha_carga + dias_add;
  END LOOP;

  -- Bus 10: KLMN-55 — 3 ejes, más bajo (2.6 Km/L) — Patricia Rojas (gemela con GHIJ-44)
  bus_id_var := 'a0000001-0001-0001-0001-000000000010';
  km_inicio := 142000; kml_base := 2.6; precio_l := 1000;
  km_actual := km_inicio;
  fecha_carga := '2025-11-01';
  WHILE fecha_carga <= fecha_fin LOOP
    kml_real := kml_base * (0.85 + random() * 0.3);
    km_actual := km_actual + (300 + (random() * 200)::INTEGER);
    litros_val := ROUND(((300 + random() * 200) / kml_real)::numeric, 1);
    precio_val := ROUND(litros_val * precio_l * (0.95 + random() * 0.1));
    INSERT INTO registros_combustible (bus_id, fecha, hora, kilometraje, litros_cargados, precio_total_pago)
    VALUES (bus_id_var, fecha_carga, LPAD((6 + (random() * 14)::INTEGER)::TEXT, 2, '0') || ':' || LPAD((random() * 59)::INTEGER::TEXT, 2, '0'), km_actual, litros_val, precio_val);
    dias_add := 2 + (random() * 2)::INTEGER;
    fecha_carga := fecha_carga + dias_add;
  END LOOP;

END $$;

-- ═══════════════════════════════════════════════════
-- 5. ALERTA DE ESTANQUE FANTASMA
-- ═══════════════════════════════════════════════════

INSERT INTO alertas_sistema (bus_id, tipo, severidad, titulo, detalle, resuelta) VALUES
  ('a0000001-0001-0001-0001-000000000002', 'estanque_fantasma', 'critica',
   'Alerta: Estanque Fantasma (EFGH-34)',
   'Se intentó cargar 480 L, superando la capacidad máxima de 400 L (+20%).',
   false);

SELECT 'Mock data insertado correctamente' AS resultado;
