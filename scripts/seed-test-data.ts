import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Cargar variables de entorno locales
// Asumimos que vas a correr este script usando ts-node desde la raíz del proyecto
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// Para insertar test data, idealmente usamos la service role key si tu tabla tiene RLS estricto
// Si no la tienes accesible aquí, podemos usar la anon key y asumir que hay políticas de insert permitidas (o probarlo desde backend)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const POSICIONES = [
  "delantero_izquierdo",
  "delantero_derecho",
  "trasero_exterior_izquierdo",
  "trasero_interior_izquierdo",
  "trasero_interior_derecho",
  "trasero_exterior_derecho",
]

async function seedTestData() {
  console.log('🌱 Iniciando creación de datos de prueba...')

  // 1. Crear 3 buses de prueba
  const busesData = [
    { patente: 'AA-1001', marca: 'Mercedes-Benz', modelo: 'O-500', ano: 2018, asientos: 44 },
    { patente: 'BB-2002', marca: 'Scania', modelo: 'K400', ano: 2020, asientos: 46 },
    { patente: 'CC-3003', marca: 'Volvo', modelo: 'B11R', ano: 2022, asientos: 42 }
  ]

  let buses: any[] = []
  
  const { data: insertedBuses, error: errorBuses } = await supabase
    .from('buses')
    .upsert(busesData, { onConflict: 'patente' })
    .select()

  if (errorBuses) {
    console.error('❌ Error creando/actualizando buses:', errorBuses)
    return
  }
  
  buses = insertedBuses || []
  console.log(`✅ Creados/Obtenidos ${buses.length} buses:`, buses.map(b => b.patente).join(', '))

  // 1.5 Obtener un usuario válido para la auditoría (requerido por constraint usuario_id)
  const { data: usuarios, error: errorUsers } = await supabase
    .from('usuarios')
    .select('id')
    .limit(1)

  if (errorUsers || !usuarios || usuarios.length === 0) {
    console.error('❌ Error: No hay usuarios en la base de datos para asignar como creador de neumáticos.')
    return
  }
  const usuarioId = usuarios[0].id

  // 2. Para cada bus, crearle 6 neumáticos (uno en cada posición)
  const neumaticosData = []
  
  for (const bus of buses) {
    for (const [index, posicion] of POSICIONES.entries()) {
      neumaticosData.push({
        codigo_unico: `N-${bus.patente.split('-')[0]}-${index + 1}00`, // ej: N-AA-100
        bus_actual_id: bus.id,
        posicion_actual: posicion,
        estado: 'instalado',
        desgaste_acumulado_km: Math.floor(Math.random() * 50000) + 1000 // Random km entre 1k y 51k
      })
    }
  }

  let neumaticos: any[] = []
  const { data: insertedNeumaticos, error: errorNeumaticos } = await supabase
    .from('neumaticos')
    .upsert(neumaticosData, { onConflict: 'codigo_unico' })
    .select()

  if (errorNeumaticos) {
    console.error('❌ Error creando neumáticos:', errorNeumaticos)
    return
  }
  
  neumaticos = insertedNeumaticos || []
  
  console.log(`✅ Creados ${neumaticos.length} neumáticos instalados en los buses.`)
  
  // 3. Crear unos neumáticos en bodega (para simular repuestos en el futuro)
  const bodegaData = [
    { codigo_unico: 'BOD-001', estado: 'bodega', desgaste_acumulado_km: 0 },
    { codigo_unico: 'BOD-002', estado: 'bodega', desgaste_acumulado_km: 0 },
    { codigo_unico: 'BOD-003', estado: 'bodega', desgaste_acumulado_km: 5000 },
  ]
  
  const { error: errorBodega } = await supabase.from('neumaticos').insert(bodegaData)
  
  if (errorBodega) {
    console.warn('⚠️ Error creando neumáticos en bodega (quizás estado enum no compatible):', errorBodega)
  } else {
    console.log(`✅ Creados neumáticos en bodega de prueba.`)
  }

  console.log('🎉 Seed completado exitosamente.')
}

seedTestData()
