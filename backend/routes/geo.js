const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/autocomplete', async (req, res) => {
  const { text } = req.query;
  const apiKey = process.env.GEOAPIFY_API_KEY;
  
  if (!text) return res.json([]);
  if (!apiKey || apiKey === 'YOUR_GEOAPIFY_API_KEY') {
    // Return empty if no key
    return res.json([]);
  }

  try {
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&apiKey=${apiKey}`;
    const response = await axios.get(url);
    
    const suggestions = response.data.features.map(f => ({
      label: f.properties.formatted,
      lat: f.properties.lat,
      lon: f.properties.lon,
      place_id: f.properties.place_id
    }));
    
    res.json(suggestions);
  } catch (err) {
    console.error('Geoapify Autocomplete Error:', err.message);
    res.status(500).json({ message: 'Error fetching suggestions' });
  }
});

router.get('/reverse', async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!lat || !lon) return res.status(400).json({ message: 'Missing coordinates' });
  if (!apiKey || apiKey === 'YOUR_GEOAPIFY_API_KEY') return res.json({ name: `GPS: ${lat}, ${lon}` });

  try {
    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}`;
    const response = await axios.get(url);
    
    if (response.data.features && response.data.features.length > 0) {
      res.json({ name: response.data.features[0].properties.formatted });
    } else {
      res.json({ name: `GPS: ${lat}, ${lon}` });
    }
  } catch (err) {
    res.json({ name: `GPS: ${lat}, ${lon}` });
  }
});

module.exports = router;
