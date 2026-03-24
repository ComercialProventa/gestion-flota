-- Agregar campo capacidad_estanque a la tabla buses
ALTER TABLE public.buses 
ADD COLUMN IF NOT EXISTS capacidad_estanque integer DEFAULT 400;

-- Optionalmente podrías agregar un check para que no sea negativo o cero
-- ALTER TABLE public.buses ADD CONSTRAINT buses_capacidad_estanque_check CHECK (capacidad_estanque > 0);
