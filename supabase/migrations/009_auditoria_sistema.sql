-- 1. Crear tabla central de auditoría
CREATE TABLE IF NOT EXISTS public.registro_auditoria (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    fecha timestamptz DEFAULT now() NOT NULL,
    usuario_id uuid REFERENCES public.usuarios(id) ON DELETE SET NULL,
    accion text NOT NULL CHECK (accion IN ('INSERT', 'UPDATE', 'DELETE')),
    tabla_afectada text NOT NULL,
    registro_id text NOT NULL,
    valores_anteriores jsonb,
    valores_nuevos jsonb
);

-- Habilitar RLS estricto (solo lectura para administradores reales)
ALTER TABLE public.registro_auditoria ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Solo administradores pueden ver auditoria"
ON public.registro_auditoria FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios
    WHERE usuarios.id = auth.uid()
    AND (usuarios.rol = 'administrador' OR usuarios.rol = 'administrativo')
  )
);

-- 2. Función Trigger Genérica
CREATE OR REPLACE FUNCTION public.grabar_auditoria()
RETURNS TRIGGER AS $$
DECLARE
    v_usuario_id uuid;
    v_registro_id text;
    v_old jsonb;
    v_new jsonb;
BEGIN
    -- Intentamos obtener el usuario de la sesión actual (Supabase JWT)
    v_usuario_id := auth.uid();

    IF TG_OP = 'INSERT' THEN
        v_registro_id := NEW.id::text;
        v_new := to_jsonb(NEW);
        
        INSERT INTO public.registro_auditoria (usuario_id, accion, tabla_afectada, registro_id, valores_nuevos)
        VALUES (v_usuario_id, TG_OP, TG_TABLE_NAME, v_registro_id, v_new);
        
        RETURN NEW;
        
    ELSIF TG_OP = 'UPDATE' THEN
        v_registro_id := NEW.id::text;
        v_old := to_jsonb(OLD);
        v_new := to_jsonb(NEW);
        
        -- Evitamos registrar si no hubo cambios reales a nivel de JSON simple
        IF v_old IS DISTINCT FROM v_new THEN
            INSERT INTO public.registro_auditoria (usuario_id, accion, tabla_afectada, registro_id, valores_anteriores, valores_nuevos)
            VALUES (v_usuario_id, TG_OP, TG_TABLE_NAME, v_registro_id, v_old, v_new);
        END IF;

        RETURN NEW;
        
    ELSIF TG_OP = 'DELETE' THEN
        v_registro_id := OLD.id::text;
        v_old := to_jsonb(OLD);
        
        INSERT INTO public.registro_auditoria (usuario_id, accion, tabla_afectada, registro_id, valores_anteriores)
        VALUES (v_usuario_id, TG_OP, TG_TABLE_NAME, v_registro_id, v_old);
        
        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. Adjuntar a las tablas principales
-- (Si los triggers ya existen, los eliminamos primero para re-crearlos de forma segura)

-- Tabla: usuarios
DROP TRIGGER IF EXISTS trigger_auditar_usuarios ON public.usuarios;
CREATE TRIGGER trigger_auditar_usuarios
AFTER INSERT OR UPDATE OR DELETE ON public.usuarios
FOR EACH ROW EXECUTE FUNCTION public.grabar_auditoria();

-- Tabla: buses
DROP TRIGGER IF EXISTS trigger_auditar_buses ON public.buses;
CREATE TRIGGER trigger_auditar_buses
AFTER INSERT OR UPDATE OR DELETE ON public.buses
FOR EACH ROW EXECUTE FUNCTION public.grabar_auditoria();

-- Tabla: neumaticos
DROP TRIGGER IF EXISTS trigger_auditar_neumaticos ON public.neumaticos;
CREATE TRIGGER trigger_auditar_neumaticos
AFTER INSERT OR UPDATE OR DELETE ON public.neumaticos
FOR EACH ROW EXECUTE FUNCTION public.grabar_auditoria();

-- Tabla: modelos_neumaticos
DROP TRIGGER IF EXISTS trigger_auditar_modelos ON public.modelos_neumaticos;
CREATE TRIGGER trigger_auditar_modelos
AFTER INSERT OR UPDATE OR DELETE ON public.modelos_neumaticos
FOR EACH ROW EXECUTE FUNCTION public.grabar_auditoria();

-- Tabla: movimientos_neumaticos
DROP TRIGGER IF EXISTS trigger_auditar_movimientos ON public.movimientos_neumaticos;
CREATE TRIGGER trigger_auditar_movimientos
AFTER INSERT OR UPDATE OR DELETE ON public.movimientos_neumaticos
FOR EACH ROW EXECUTE FUNCTION public.grabar_auditoria();

-- Tabla: registros_combustible
DROP TRIGGER IF EXISTS trigger_auditar_registros_combustible ON public.registros_combustible;
CREATE TRIGGER trigger_auditar_registros_combustible
AFTER INSERT OR UPDATE OR DELETE ON public.registros_combustible
FOR EACH ROW EXECUTE FUNCTION public.grabar_auditoria();
