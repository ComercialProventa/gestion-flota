-- Mock de datos para dashboard de combustible
-- 10 máquinas, 10 conductores, ~15 cargas/mes × 5 meses (Nov 2025 - Mar 2026)
-- Ejecutar DESPUÉS de la migración 015 (precio_total_pago)
-- Los buses existentes se ignoran si ya tienen datos reales.

-- ═══════════════════════════════════════════════════
-- 1. UNIDADES (10 máquinas con personalidad distinta)
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
-- 2. USUARIOS CONDUCTORES (10)
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
-- 3. ASIGNACIONES (1 conductor → 1 bus)
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
-- 4. REGISTROS DE COMBUSTIBLE
--    15 cargas/mes × 5 meses × 10 máquinas = 750
--    Personalidad por unidad:
--    ABCD-12: Eficiente (3.5 Km/L) — Carlos Mendoza
--    EFGH-34: Ineficiente (2.0 Km/L) — María González ← PROBLEMA
--    IJKL-56: 3 ejes, promedio (2.8 Km/L) — Pedro Ramírez
--    MNOP-78: 3 ejes, bueno (3.2 Km/L) — Ana Martínez
--    QRST-90: Eficiente (3.8 Km/L) — Luis Hernández
--    UVWX-11: Promedio (3.0 Km/L) — Rosa Flores
--    YZAB-22: Camión, bajo (2.3 Km/L) — Jorge Soto
--    CDEF-33: Camión, promedio (2.8 Km/L) — Carmen Vargas
--    GHIJ-44: 3 ejes, bueno (3.4 Km/L) — Miguel Torres
--    KLMN-55: 3 ejes, promedio (2.6 Km/L) — Patricia Rojas

DO $$
DECLARE
  bus_data RECORD;
  fecha_base DATE := '2025-11-01';
  fecha_fin  DATE := '2026-03-31';
  fecha_carga DATE;
  km_actual INTEGER;
  kml_target NUMERIC;
  litros NUMERIC;
  precio INTEGER;
  dias_entre_cargas INTEGER;
  rand_offset NUMERIC;
  dia_count INTEGER;
BEGIN
  -- Configuración por bus: (bus_id, km_inicio, kml_base, precio_litro_base)
  FOR bus_data IN
    SELECT * FROM (VALUES
      ('a0000001-0001-0001-0001-000000000001', 120000, 3.5, 980),  -- ABCD-12 eficiente
      ('a0000001-0001-0001-0001-000000000002',  95000, 2.0, 980),  -- EFGH-34 ineficiente
      ('a0000001-0001-0001-0001-000000000003', 180000, 2.8, 1020), -- IJKL-56
      ('a0000001-0001-0001-0001-000000000004', 155000, 3.2, 1020), -- MNOP-78
      ('a0000001-0001-0001-0001-000000000005',  75000, 3.8, 990),  -- QRST-90
      ('a0000001-0001-0001-0001-000000000006',  88000, 3.0, 990),  -- UVWX-11
      ('a0000001-0001-0001-0001-000000000007', 200000, 2.3, 1050), -- YZAB-22 camión
      ('a0000001-0001-0001-0001-000000000008', 175000, 2.8, 1050), -- CDEF-33 camión
      ('a0000001-0001-0001-0001-000000000009', 130000, 3.4, 1000), -- GHIJ-44
      ('a0000001-0001-0001-0001-000000000010', 142000, 2.6, 1000)  -- KLMN-55
    ) AS t(bus_id, km_inicio, kml_base, precio_litro)
  LOOP
    km_actual := bus_data.km_inicio;
    fecha_carga := fecha_base;
    dia_count := 0;

    WHILE fecha_carga <= fecha_fin LOOP
      -- ~15 cargas por mes = cada 2 días con variación
      dias_entre_cargas := 2 + (random() * 2)::INTEGER; -- 2-3 días

      -- Variación aleatoria del rendimiento ±15%
      rand_offset := 1 + (random() * 0.3 - 0.15);
      kml_target := bus_data.km_base * rand_offset;

      -- Simular caída en enero (unidades cansadas, calor)
      IF EXTRACT(MONTH FROM fecha_carga) = 1 THEN
        kml_target := kml_target * 0.85;
      END IF;

      -- Km recorridos: ~300-500 km entre cargas
      km_actual := km_actual + (300 + (random() * 200)::INTEGER);

      -- Litros: km_recorridos / rendimiento
      litros := ROUND((300 + random() * 200) / kml_target, 1);

      -- Precio con variación ±5%
      precio := ROUND(litros * bus_data.precio_litro * (1 + random() * 0.1 - 0.05));

      INSERT INTO registros_combustible (bus_id, fecha, hora, kilometraje, litros_cargados, precio_total_pago)
      VALUES (
        bus_data.bus_id,
        fecha_carga,
        LPAD((6 + (random() * 14)::INTEGER)::TEXT, 2, '0') || ':' || LPAD((random() * 59)::INTEGER::TEXT, 2, '0'),
        km_actual,
        litros,
        precio
      );

      fecha_carga := fecha_carga + dias_entre_cargas;
      dia_count := dia_count + 1;
    END LOOP;
  END LOOP;
END $$;

-- ═══════════════════════════════════════════════════
-- 5. ALERTA DE ESTANQUE FANTASMA (1 para probar)
-- ═══════════════════════════════════════════════════

INSERT INTO alertas_sistema (bus_id, tipo, severidad, titulo, detalle, resuelta) VALUES
  ('a0000001-0001-0001-0001-000000000002', 'estanque_fantasma', 'critica',
   'Alerta: Estanque Fantasma (EFGH-34)',
   'Se intentó cargar 480 L, superando la capacidad máxima de 400 L (+20%).',
   false);

SELECT 'Mock data inserted: 10 buses, 10 conductores, 10 asignaciones, ~750 registros combustible, 1 alerta' AS resultado;
