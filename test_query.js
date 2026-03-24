const { createClient } = require('@supabase/supabase-js');
const auth = require('dotenv').config({ path: 'c:\\Users\\Usuario\\Documents\\Convenios Chile\\Herramientas\\gestion de flota\\gestion-flota\\.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase
    .from("neumaticos")
    .select(`
      id,
      codigo_unico,
      numero_serie,
      codigo_dot,
      ciclo_vida,
      estado,
      posicion_actual,
      desgaste_acumulado_km,
      factura_numero,
      proveedor,
      precio,
      creado_en,
      modelos_neumaticos ( marca, medida ),
      usuarios ( nombre_completo ),
      buses ( patente )
    `)
    .order("creado_en", { ascending: false });

  console.log("ERROR:", error);
  console.log("DATA LENGTH:", data ? data.length : 0);
}

test();
