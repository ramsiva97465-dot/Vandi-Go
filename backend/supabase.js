const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl) {
  console.error("CRITICAL: SUPABASE_URL is missing in .env");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = supabase;