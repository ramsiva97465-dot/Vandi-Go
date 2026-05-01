
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

async function checkTripData() {
  const { data: trips, error } = await supabase.from('trips').select('*');
  if (error) console.error(error);
  console.log('--- ALL TRIPS ---');
  console.table(trips.map(t => ({
    id: t.id.slice(-4),
    pickup: t.pickup_location,
    fare: t.estimated_fare,
    fee: t.lead_fee,
    status: t.status
  })));
}

checkTripData();
