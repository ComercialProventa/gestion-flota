-- Hacer asientos nullable (los camiones no necesitan asientos)
ALTER TABLE public.buses ALTER COLUMN asientos DROP NOT NULL;
