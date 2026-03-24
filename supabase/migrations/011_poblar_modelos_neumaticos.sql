-- Migración 011: Poblar Catálogo Detallado de Modelos de Neumáticos
-- Fecha: 2026-03-23
-- Descripción: Llena la tabla 'modelos_neumaticos' con las medidas y marcas estándar de la industria de transporte (Buses y Camiones).

-- Opcional: Limpiar la tabla antes de insertar si deseas un inicio fresco (cuidado si ya tienes llantas creadas apuntando a estos modelos)
-- TRUNCATE TABLE modelos_neumaticos CASCADE;

INSERT INTO modelos_neumaticos (marca, medida, aplicacion_eje, profundidad_estria_nueva_mm, vida_util_km)
VALUES
  -- MICHELIN (Premium)
  ('Michelin', '295/80R22.5', 'mixto', 18, 115000),
  ('Michelin', '315/80R22.5', 'traccion', 20, 125000),
  ('Michelin', '385/65R22.5', 'arrastre', 15, 140000),
  ('Michelin', '275/80R22.5', 'direccional', 15, 115000),

  -- BRIDGESTONE (Premium)
  ('Bridgestone', '295/80R22.5', 'direccional', 16, 115000),
  ('Bridgestone', '315/80R22.5', 'traccion', 24, 120000),
  ('Bridgestone', '385/65R22.5', 'arrastre', 16, 135000),
  ('Bridgestone', '275/80R22.5', 'mixto', 18, 110000),
  ('Bridgestone', '11R22.5', 'mixto', 18, 115000),
  ('Bridgestone', '12.00R24', 'traccion', 24, 105000),

  -- GOODYEAR (Premium)
  ('Goodyear', '295/80R22.5', 'traccion', 21, 105000),
  ('Goodyear', '315/80R22.5', 'mixto', 20, 115000),
  ('Goodyear', '385/65R22.5', 'arrastre', 15, 130000),

  -- PIRELLI (Premium/Middle)
  ('Pirelli', '295/80R22.5', 'traccion', 22, 95000),
  ('Pirelli', '275/80R22.5', 'mixto', 18, 98000),

  -- CONTINENTAL (Premium)
  ('Continental', '295/80R22.5', 'direccional', 16, 115000),
  ('Continental', '315/80R22.5', 'mixto', 20, 115000),
  ('Continental', '385/65R22.5', 'arrastre', 15, 135000),

  -- HANKOOK (Middle)
  ('Hankook', '295/80R22.5', 'traccion', 20, 90000),
  ('Hankook', '275/80R22.5', 'mixto', 17, 92000),
  
  -- YOKOHAMA (Middle)
  ('Yokohama', '295/80R22.5', 'direccional', 15, 95000),

  -- FIRESTONE (Middle)
  ('Firestone', '295/80R22.5', 'traccion', 21, 88000),

  -- DUNLOP (Middle)
  ('Dunlop', '295/80R22.5', 'mixto', 17, 90000),
  ('Dunlop', '315/80R22.5', 'traccion', 22, 85000),

  -- KUMHO (Middle)
  ('Kumho', '295/80R22.5', 'direccional', 15, 85000),

  -- TOYO (Middle)
  ('Toyo', '295/80R22.5', 'traccion', 21, 85000),

  -- AEOLUS (Tier 3 - Budget - Extremadamente común en flotas latinas)
  ('Aeolus', '295/80R22.5', 'mixto', 18, 70000),
  ('Aeolus', '315/80R22.5', 'traccion', 22, 68000),
  ('Aeolus', '385/65R22.5', 'arrastre', 15, 80000),

  -- LINGLONG (Tier 3 - Budget)
  ('Linglong', '295/80R22.5', 'mixto', 17, 65000),

  -- TRIANGLE (Tier 3 - Budget)
  ('Triangle', '295/80R22.5', 'traccion', 20, 60000),
  ('Triangle', '315/80R22.5', 'mixto', 19, 62000),

  -- JINYU (Tier 3 - Budget)
  ('Jinyu', '295/80R22.5', 'direccional', 15, 62000),

  -- CHENGSHAN / PRINX (Tier 3 - Budget)
  ('Prinx', '295/80R22.5', 'mixto', 17, 60000),
  ('Chengshan', '315/80R22.5', 'traccion', 21, 58000)
ON CONFLICT (marca, medida) DO NOTHING;
