const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const auth = require('../middleware/auth');

// Get all settings
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*');

    if (error) throw error;
    
    // Transform array to object
    const settingsObj = {};
    data.forEach(item => {
      settingsObj[item.key] = item.value;
    });
    
    res.json(settingsObj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update specific setting category
router.post('/', auth, async (req, res) => {
  try {
    // Only admins can update settings
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updates = req.body; // e.g. { business: { ... }, pricing: { ... } }
    
    const promises = Object.keys(updates).map(key => {
      return supabase
        .from('settings')
        .upsert({ key, value: updates[key], updated_at: new Date() });
    });

    await Promise.all(promises);
    res.json({ message: 'Settings updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
