const supabase = require('./supabase');
const bcrypt = require('bcryptjs');

async function setupAdmin() {
  const email = 'ramsiva97465@gmail.com';
  const password = 'Ram121126';
  const name = 'Admin';

  console.log(`Starting Admin Setup for: ${email}`);

  // 1. Check if user exists in Auth
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('Error listing users:', listError.message);
    return;
  }

  let user = users.find(u => u.email === email);
  let userId;

  if (!user) {
    console.log('User not found in Auth. Creating new user...');
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role: 'admin' }
    });

    if (createError) {
      console.error('Error creating auth user:', createError.message);
      return;
    }
    userId = newUser.user.id;
    console.log('Auth user created successfully.');
  } else {
    userId = user.id;
    console.log('Auth user already exists.');
    
    // Update password just in case
    const { error: updateAuthError } = await supabase.auth.admin.updateUserById(userId, { password });
    if (updateAuthError) console.warn('Note: Could not update Auth password:', updateAuthError.message);
  }

  // 2. Hash password for our profiles table (Hybrid logic)
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Check if profile exists
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (!profile) {
    console.log('Profile entry missing. Creating...');
    const { error: insertError } = await supabase
      .from('profiles')
      .insert([{
        id: userId,
        name,
        email,
        password: hashedPassword,
        role: 'admin'
      }]);

    if (insertError) {
      console.error('Error creating profile:', insertError.message);
      if (insertError.message.includes('column "password" does not exist')) {
        console.error('CRITICAL: Please run "ALTER TABLE public.profiles ADD COLUMN password TEXT;" in Supabase SQL Editor.');
      }
    } else {
      console.log('Profile created successfully.');
    }
  } else {
    console.log('Profile exists. Updating password and role...');
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        password: hashedPassword,
        role: 'admin'
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating profile:', updateError.message);
    } else {
      console.log('Profile updated successfully.');
    }
  }

  console.log('--- SETUP COMPLETE ---');
  console.log('Email:', email);
  console.log('Password:', password);
  process.exit(0);
}

setupAdmin();
