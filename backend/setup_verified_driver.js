
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY // Use service role key
);

async function setupVerifiedDriver() {
  const email = 'driver2@vandigo.com';
  const password = 'Driver123';
  const name = 'Verified Driver';
  const role = 'driver';

  console.log(`Setting up verified dummy driver: ${email}...`);

  try {
    // 1. Create User in Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('User already exists in Auth, updating password...');
        const { data: listData } = await supabase.auth.admin.listUsers();
        const existingUser = listData.users.find(u => u.email === email);
        if (existingUser) {
          await supabase.auth.admin.updateUserById(existingUser.id, { password });
          console.log('Password updated.');
        }
      } else {
        throw authError;
      }
    }

    // Get the user ID
    const { data: listData } = await supabase.auth.admin.listUsers();
    const user = listData.users.find(u => u.email === email);
    const userId = user.id;

    // 2. Check/Update Profile
    const hashedPassword = await bcrypt.hash(password, 10);
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        name,
        email,
        role,
        password: hashedPassword
      });

    if (profileError) throw profileError;

    // 3. Check/Update Driver Info (Verified Status)
    const { error: driverError } = await supabase
      .from('drivers')
      .upsert({
        id: userId,
        vehicle_type: 'SUV',
        vehicle_number: 'TN 02 GOOD 07',
        license_number: 'DL-VERIFIED-01',
        aadhaar_number: '987654321098',
        kyc_status: 'verified' // This driver should have full access
      });

    if (driverError) throw driverError;

    console.log('\nSUCCESS: Verified Dummy Driver Created!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Status: VERIFIED (Should see full dashboard)');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

setupVerifiedDriver();
