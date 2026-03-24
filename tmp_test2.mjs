import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = "https://mphyipsdxbvxukmrraiz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1waHlpcHNkeGJ2eHVrbXJyYWl6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDAzNjI5OCwiZXhwIjoyMDg5NjEyMjk4fQ.hc_WLjJgBIrEh4vm368psqjllfKLHdyNzVBLjWTBNcc";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
  const { data: logs } = await supabase.from('neumaticos').select('*').limit(1);
  fs.writeFileSync('c:\\Users\\Usuario\\Documents\\Convenios Chile\\Herramientas\\gestion de flota\\gestion-flota\\tmp_data_neu.json', JSON.stringify({logs}, null, 2));
}

run();
