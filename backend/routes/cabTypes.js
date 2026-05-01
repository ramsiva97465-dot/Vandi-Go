const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// GET all cab types
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cab_types')
      .select('*')
      .eq('is_active', true);

    const mapped = data.map(c => ({ ...c, _id: c.id }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add cab type
router.post('/', async (req, res) => {
  try {
    const { name, base_fare, price_per_km, min_fare } = req.body;
    if (!name || base_fare === undefined || price_per_km === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const { data, error } = await supabase
      .from('cab_types')
      .insert([{ 
        name, 
        base_fare: Number(base_fare), 
        price_per_km: Number(price_per_km), 
        min_fare: Number(min_fare || 0) 
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update cab type
router.put('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cab_types')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return res.status(404).json({ message: 'Cab type not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE cab type
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('cab_types')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Cab type deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
