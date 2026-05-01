const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../supabase');

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user in profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !profile) return res.status(400).json({ message: 'Invalid credentials' });

    // Since we are migrating from a local DB where we stored hashed passwords in 'users', 
    // for now we'll assume the password is in the profile or a separate auth mechanism.
    // In a real migration, we'd use Supabase Auth.
    // Let's assume we store the hash in the profile for this hybrid phase.
    
    const isMatch = await bcrypt.compare(password, profile.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Get driver details if it's a driver
    let kyc_status = 'pending';
    if (profile.role === 'driver') {
      const { data: driverData } = await supabase
        .from('drivers')
        .select('kyc_status')
        .eq('id', profile.id)
        .single();
      if (driverData) kyc_status = driverData.kyc_status;
    }

    const token = jwt.sign({ id: profile.id, role: profile.role }, process.env.JWT_SECRET || 'secret');
    res.json({ 
      token, 
      user: { 
        id: profile.id, 
        name: profile.name, 
        role: profile.role,
        kyc_status: kyc_status
      } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, ...extra } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 1. Create Profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert([{ 
        name, 
        email, 
        password: hashedPassword, 
        role,
        phone: extra.phone
      }])
      .select()
      .single();

    if (profileError) return res.status(400).json({ message: profileError.message });

    // 2. If Driver, create Driver record
    if (role === 'driver') {
      const { error: driverError } = await supabase
        .from('drivers')
        .insert([{
          id: profile.id,
          vehicle_type: extra.vehicleType,
          vehicle_number: extra.vehicleNumber,
          license_number: extra.licenseNumber,
          aadhaar_number: extra.aadhaarNumber,
          kyc_status: 'pending'
        }]);
      
      if (driverError) {
        // Rollback profile (optional but good)
        await supabase.from('profiles').delete().eq('id', profile.id);
        return res.status(400).json({ message: driverError.message });
      }
    }

    const token = jwt.sign({ id: profile.id, role: profile.role }, process.env.JWT_SECRET || 'secret');
    res.json({ 
      token, 
      user: { 
        id: profile.id, 
        name: profile.name, 
        role: profile.role,
        kyc_status: role === 'driver' ? 'pending' : 'verified'
      } 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update KYC Status (Admin Only)
router.put('/drivers/:id/kyc', async (req, res) => {
  try {
    const { status } = req.body;
    const { data, error } = await supabase
      .from('drivers')
      .update({ kyc_status: status })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return res.status(404).json({ message: 'Driver not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Drivers
router.get('/drivers', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, drivers(*)')
      .eq('role', 'driver');

    if (error) throw error;
    
    // Flatten and map to frontend keys
    const formatted = data.map(p => {
      const d = p.drivers[0] || {};
      return {
        _id: p.id,
        id: p.id,
        name: p.name,
        email: p.email,
        phone: p.phone,
        kyc_status: d.kyc_status,
        aadhaarNumber: d.aadhaar_number,
        licenseNumber: d.license_number,
        vehicleType: d.vehicle_type,
        vehicleNumber: d.vehicle_number,
        isOnline: d.is_online
      };
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
