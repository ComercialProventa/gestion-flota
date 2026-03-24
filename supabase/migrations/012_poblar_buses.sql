-- Migración 012: Poblar 30 Buses de Flota
-- Fecha: 2026-03-23
-- Descripción: Agrega 30 unidades vehiculares (buses) con patentes chilenas, marcas y modelos reales, incluyendo chasis de 2 y 3 ejes.

INSERT INTO buses (patente, marca, modelo, ano, chasis, capacidad_estanque, asientos)
VALUES
  -- Scania K440 (3 Ejes / Double Decker / Buses Interurbanos de Larga Distancia)
  ('RX-TY-10', 'Scania', 'K440 - Marcopolo G8 1800DD', 2023, 'doble_piso_10', 500, 43),
  ('RX-TY-11', 'Scania', 'K440 - Marcopolo G8 1800DD', 2023, 'doble_piso_10', 500, 43),
  ('RX-TY-12', 'Scania', 'K400 - Marcopolo G7 1800DD', 2022, 'doble_piso_10', 500, 43),
  ('RX-TY-13', 'Scania', 'K400 - Marcopolo G7 1800DD', 2022, 'doble_piso_10', 500, 43),
  ('RX-TY-14', 'Scania', 'K400 - Irizar i6S', 2022, '3_ejes_10_ruedas', 450, 46),
  ('PT-LK-45', 'Scania', 'K400 - Irizar i6S', 2021, '3_ejes_10_ruedas', 450, 46),
  ('PT-LK-46', 'Scania', 'K360 - Marcopolo Paradiso 1200', 2021, '2_ejes_6_ruedas', 400, 42),
  ('PT-LK-47', 'Scania', 'K360 - Marcopolo Paradiso 1200', 2021, '2_ejes_6_ruedas', 400, 42),

  -- Mercedes-Benz (Interurbano / Minero / Personal)
  ('LW-YZ-88', 'Mercedes-Benz', 'O500RSD - Marcopolo G8', 2024, '3_ejes_10_ruedas', 460, 46),
  ('LW-YZ-89', 'Mercedes-Benz', 'O500RSD - Marcopolo G8', 2024, '3_ejes_10_ruedas', 460, 46),
  ('LW-YZ-90', 'Mercedes-Benz', 'O500RS - Marcopolo G7', 2023, '2_ejes_6_ruedas', 400, 42),
  ('LW-YZ-91', 'Mercedes-Benz', 'O500RS - Irizar i6', 2023, '2_ejes_6_ruedas', 400, 42),
  ('HK-PR-22', 'Mercedes-Benz', 'O500R - Buscar Vissta Buss', 2020, '2_ejes_6_ruedas', 350, 40),
  ('HK-PR-23', 'Mercedes-Benz', 'O500R - Buscar Vissta Buss', 2020, '2_ejes_6_ruedas', 350, 40),
  ('HK-PR-24', 'Mercedes-Benz', 'OH1622 - Neobus Mega', 2020, '2_ejes_6_ruedas', 300, 36),
  ('HK-PR-25', 'Mercedes-Benz', 'OF1722 - Mascarello Roma', 2020, '2_ejes_6_ruedas', 300, 32),

  -- Volvo (Alta Montaña / Largas Distancias)
  ('FZ-XW-11', 'Volvo', 'B430R - Irizar i6S', 2022, 'doble_piso_10', 520, 60),
  ('FZ-XW-12', 'Volvo', 'B430R - Irizar i6S', 2022, 'doble_piso_10', 520, 60),
  ('FZ-XW-13', 'Volvo', 'B380R - Marcopolo Paradiso 1350', 2021, '3_ejes_10_ruedas', 450, 46),
  ('FZ-XW-14', 'Volvo', 'B380R - Marcopolo Paradiso 1200', 2021, '2_ejes_6_ruedas', 420, 42),
  ('CB-RM-77', 'Volvo', 'B290R - Comil Campione', 2019, '2_ejes_6_ruedas', 380, 40),
  ('CB-RM-78', 'Volvo', 'B290R - Comil Campione', 2019, '2_ejes_6_ruedas', 380, 40),

  -- Yutong / King Long (Renovación Flota Económica / Eléctricos o Diésel)
  ('SX-FP-50', 'Yutong', 'ZK6122H - Minero', 2024, '2_ejes_6_ruedas', 300, 42),
  ('SX-FP-51', 'Yutong', 'ZK6122H - Minero', 2024, '2_ejes_6_ruedas', 300, 42),
  ('SX-FP-52', 'Yutong', 'ZK6136H - Interprovincial', 2023, '3_ejes_10_ruedas', 400, 46),
  ('SX-FP-53', 'Yutong', 'ZK6136H - Interprovincial', 2023, '3_ejes_10_ruedas', 400, 46),
  ('DJ-VN-33', 'King Long', 'XMQ6127', 2022, '2_ejes_6_ruedas', 300, 40),
  ('DJ-VN-34', 'King Long', 'XMQ6127', 2022, '2_ejes_6_ruedas', 300, 40),
  ('DJ-VN-35', 'King Long', 'XMQ6130', 2021, '3_ejes_10_ruedas', 350, 46),
  ('DJ-VN-36', 'King Long', 'XMQ6130', 2021, '3_ejes_10_ruedas', 350, 46),

  -- LOTE ADICIONAL: +30 BUSES (Flota Extendida)
  
  -- Modasa (Fabricante carrocero muy popular en LATAM, sobre chasis Volvo/Scania)
  ('XX-BB-10', 'Volvo', 'B430R - Modasa Zeus 4 DD', 2024, 'doble_piso_10', 500, 43),
  ('XX-BB-11', 'Volvo', 'B430R - Modasa Zeus 4 DD', 2024, 'doble_piso_10', 500, 43),
  ('XX-BB-12', 'Volvo', 'B430R - Modasa Zeus 4 DD', 2024, 'doble_piso_10', 500, 43),
  ('XX-BB-13', 'Scania', 'K400 - Modasa Zeus 3 DD', 2022, 'doble_piso_10', 500, 60),
  ('XX-BB-14', 'Scania', 'K400 - Modasa Zeus 3 DD', 2022, 'doble_piso_10', 500, 60),
  ('XX-BB-15', 'Mercedes-Benz', 'O500RSD - Modasa Zeus 3', 2022, '3_ejes_10_ruedas', 450, 46),
  
  -- Busscar (Vissta Buss DD / 3 Ejes / 2 Ejes)
  ('YY-CC-20', 'Scania', 'K440 - Busscar Vissta Buss DD', 2023, 'doble_piso_10', 520, 60),
  ('YY-CC-21', 'Scania', 'K440 - Busscar Vissta Buss DD', 2023, 'doble_piso_10', 520, 60),
  ('YY-CC-22', 'Mercedes-Benz', 'O500RSD - Busscar VB 360', 2021, '3_ejes_10_ruedas', 450, 46),
  ('YY-CC-23', 'Mercedes-Benz', 'O500RSD - Busscar VB 360', 2021, '3_ejes_10_ruedas', 450, 46),
  ('YY-CC-24', 'Volvo', 'B380R - Busscar VB 340', 2021, '2_ejes_6_ruedas', 400, 42),
  ('YY-CC-25', 'Volvo', 'B380R - Busscar VB 340', 2021, '2_ejes_6_ruedas', 400, 42),

  -- Comil (Campione Invictus HD / DD)
  ('ZZ-DD-30', 'Scania', 'K440 - Comil Invictus DD', 2024, 'doble_piso_10', 500, 60),
  ('ZZ-DD-31', 'Scania', 'K440 - Comil Invictus DD', 2024, 'doble_piso_10', 500, 60),
  ('ZZ-DD-32', 'Scania', 'K400 - Comil Invictus HD', 2023, '3_ejes_10_ruedas', 450, 46),
  ('ZZ-DD-33', 'Mercedes-Benz', 'O500RSD - Comil Invictus HD', 2023, '3_ejes_10_ruedas', 450, 46),
  ('ZZ-DD-34', 'Volvo', 'B430R - Comil Invictus HD', 2022, '3_ejes_10_ruedas', 450, 46),

  -- Marcopolo G8 / G7 (Expansión Interurbana)
  ('AA-EE-40', 'Mercedes-Benz', 'O500RSD - Marcopolo G8 1800DD', 2025, 'doble_piso_10', 500, 43),
  ('AA-EE-41', 'Mercedes-Benz', 'O500RSD - Marcopolo G8 1800DD', 2025, 'doble_piso_10', 500, 43),
  ('AA-EE-42', 'Mercedes-Benz', 'O500RSD - Marcopolo G8 1800DD', 2025, 'doble_piso_10', 500, 43),
  ('AA-EE-43', 'Volvo', 'B430R - Marcopolo G8 1800DD', 2025, 'doble_piso_10', 500, 43),
  ('AA-EE-44', 'Volvo', 'B430R - Marcopolo G8 1800DD', 2025, 'doble_piso_10', 500, 43),
  ('AA-EE-45', 'Scania', 'K360 - Marcopolo G7 1200', 2020, '2_ejes_6_ruedas', 400, 42),
  ('AA-EE-46', 'Scania', 'K360 - Marcopolo G7 1200', 2020, '2_ejes_6_ruedas', 400, 42),

  -- Irizar i6S (Servicios Premium)
  ('BB-FF-50', 'Volvo', 'B430R - Irizar i6S', 2024, '3_ejes_10_ruedas', 450, 46),
  ('BB-FF-51', 'Volvo', 'B430R - Irizar i6S', 2024, '3_ejes_10_ruedas', 450, 46),
  ('BB-FF-52', 'Scania', 'K400 - Irizar i6', 2021, '3_ejes_10_ruedas', 450, 46),
  ('BB-FF-53', 'Scania', 'K400 - Irizar i6', 2021, '3_ejes_10_ruedas', 450, 46),
  
  -- Flota Ligera Urbana / Enlace
  ('CC-GG-60', 'Mercedes-Benz', 'LO916 - Volare W9', 2022, '2_ejes_6_ruedas', 150, 28),
  ('CC-GG-61', 'Mercedes-Benz', 'LO916 - Volare W9', 2022, '2_ejes_6_ruedas', 150, 28);
