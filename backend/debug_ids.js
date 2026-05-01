
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

async function debugIDs() {
  console.log('--- PROFILES ---');
  const { data: profiles } = await supabase.from('profiles').select('id, email, name, role');
  console.table(profiles);

  console.log('--- DRIVERS ---');
  const { data: drivers } = await supabase.from('drivers').select('id');
  console.table(drivers);

  console.log('--- COMPARISON ---');
  profiles.forEach(p => {
    const isDriver = drivers.some(d => d.id === p.id);
    console.log(`${p.email} (${p.role}): ${isDriver ? 'Found in Drivers' : 'MISSING from Drivers!'}`);
  });
}

debugIDs();
