
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY // Use service role key
);

async function setupDummyDriver() {
  const email = 'driver1@vandigo.com';
  const password = 'Driver123';
  const name = 'Dummy Driver';
  const role = 'driver';

  console.log(`Setting up dummy driver: ${email}...`);

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
    } else {
      console.log('User created in Auth.');
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
    console.log('Profile updated in database.');

    // 3. Check/Update Driver Info (Pending Status)
    const { error: driverError } = await supabase
      .from('drivers')
      .upsert({
        id: userId,
        vehicle_type: 'Sedan',
        vehicle_number: 'TN 01 DUMMY 01',
        license_number: 'DL-DUMMY-01',
        aadhaar_number: '123456789012',
        kyc_status: 'pending' // Default to pending to test the blocker
      });

    if (driverError) throw driverError;
    console.log('Driver info initialized with PENDING status.');

    console.log('\nSUCCESS: Dummy Driver Created!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Status: PENDING (Should see blocking screen)');

  } catch (error) {
    console.error('Error setting up dummy driver:', error.message);
  }
}

setupDummyDriver();
