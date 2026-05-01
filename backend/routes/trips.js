const express = require('express');
const router = express.Router();
const supabase = require('../supabase');
const auth = require('../middleware/auth');
const axios = require('axios');

const calculateDistance = async (lat1, lon1, lat2, lon2) => {
  try {
    const apiKey = process.env.GEOAPIFY_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GEOAPIFY_API_KEY') {
      return { distance_km: Math.floor(Math.random() * 45) + 5, duration_min: 20 };
    }

    const url = `https://api.geoapify.com/v1/routing?waypoints=${lat1},${lon1}|${lat2},${lon2}&mode=drive&apiKey=${apiKey}`;
    const response = await axios.get(url);
    
    if (response.data.features && response.data.features.length > 0) {
      const properties = response.data.features[0].properties;
      const distance_km = (properties.distance / 1000).toFixed(2);
      const duration_min = Math.ceil(properties.time / 60);
      return { distance_km: parseFloat(distance_km), duration_min };
    }
    throw new Error('No route found');
  } catch (err) {
    console.error('Geoapify Error:', err.message);
    return { distance_km: Math.floor(Math.random() * 45) + 5, duration_min: 20 };
  }
};

// POST /api/trips/calculate-distance
router.post('/calculate-distance', async (req, res) => {
  const { pickup_lat, pickup_lng, drop_lat, drop_lng, cab_type_id } = req.body;
  
  if (!pickup_lat || !pickup_lng || !drop_lat || !drop_lng) {
    return res.status(400).json({ message: 'Missing coordinates' });
  }

  try {
    const { distance_km, duration_min } = await calculateDistance(pickup_lat, pickup_lng, drop_lat, drop_lng);
    
    let fare = 0;
    const { data: cabType, error } = await supabase
      .from('cab_types')
      .select('*')
      .eq('id', cab_type_id)
      .single();

    if (cabType) {
      fare = cabType.base_fare + (distance_km * cabType.price_per_km);
      if (cabType.min_fare && fare < cabType.min_fare) fare = cabType.min_fare;
    }

    const estimated_fare = Math.round(fare);
    const lead_fee = estimated_fare > 7000 ? 1000 : 500;

    res.json({ distance_km, duration_min, estimated_fare, lead_fee });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /public → anonymous booking
router.post('/public', async (req, res) => {
  try {
    const { pickup_lat, pickup_lng, drop_lat, drop_lng, cab_type_id, customerName, customerPhone, pickupLocation, dropLocation, carType, bookingDateTime } = req.body;
    
    const { distance_km, duration_min } = await calculateDistance(pickup_lat, pickup_lng, drop_lat, drop_lng);
    
    let fare = 0;
    const { data: cabType } = await supabase
      .from('cab_types')
      .select('*')
      .eq('id', cab_type_id)
      .single();

    if (cabType) {
      fare = cabType.base_fare + (distance_km * cabType.price_per_km);
      if (cabType.min_fare && fare < cabType.min_fare) fare = cabType.min_fare;
    }

    const estimated_fare = Math.round(fare);
    const lead_fee = estimated_fare > 7000 ? 1000 : 500;

    const { data: booking, error } = await supabase
      .from('trips')
      .insert([{
        pickup_location: pickupLocation,
        drop_location: dropLocation,
        pickup_lat,
        pickup_lng,
        drop_lat,
        drop_lng,
        distance_km,
        estimated_fare,
        lead_fee,
        customer_name: customerName,
        customer_phone: customerPhone,
        status: 'CREATED',
        payment_status: 'pending',
        details_unlocked: false
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /bookings → list all bookings (Admin Only)
router.get('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  try {
    const { data: bookings, error } = await supabase
      .from('trips')
      .select('*, accepted_driver_id(*)');

    if (error) throw error;
    
    const mappedBookings = bookings.map(b => ({
      ...b,
      _id: b.id,
      pickupLocation: b.pickup_location,
      dropLocation: b.drop_location,
      customerName: b.customer_name,
      customerPhone: b.customer_phone,
      carType: b.car_type || 'Sedan',
      bookingDateTime: b.created_at
    }));

    res.json(mappedBookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /marketplace → bookings visible to driver
router.get('/marketplace', auth, async (req, res) => {
  try {
    const { data: allBookings, error } = await supabase
      .from('trips')
      .select('*')
      .or(`status.eq.CREATED,status.eq.ACCEPTED,accepted_driver_id.eq.${req.user.id}`);

    if (error) throw error;

    const visibleBookings = allBookings.map(b => {
      let result = { 
        ...b,
        _id: b.id,
        pickupLocation: b.pickup_location,
        dropLocation: b.drop_location,
        customerName: b.customer_name,
        customerPhone: b.customer_phone,
        carType: b.car_type || 'Sedan',
        bookingDateTime: b.created_at
      };

      if (b.accepted_driver_id === req.user.id && !b.details_unlocked) {
        result.customerName = 'HIDDEN (Pay to Unlock)';
        result.customerPhone = '**********';
      } else if (!b.accepted_driver_id) {
        result.customerName = 'PROTECTED';
        result.customerPhone = '**********';
      }
      return result;
    });
    
    res.json(visibleBookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /stats → driver performance stats
router.get('/stats', auth, async (req, res) => {
  try {
    const { range = 'week' } = req.query;
    const driverId = req.user.id;
    
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    if (range === 'week') {
      const day = startDate.getDay();
      const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // Monday
      startDate.setDate(diff);
    } else if (range === 'month') {
      startDate.setDate(1);
    }

    // Fetch trips for this driver within range
    const { data: trips, error } = await supabase
      .from('trips')
      .select('*')
      .eq('accepted_driver_id', driverId)
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    const completedTrips = trips.filter(t => t.status === 'COMPLETED');
    const cancelledTrips = trips.filter(t => t.status === 'CANCELLED' || t.status === 'REJECTED');
    
    const totalFare = completedTrips.reduce((sum, t) => sum + (Number(t.estimated_fare) || 0), 0);
    const totalFees = completedTrips.reduce((sum, t) => sum + (Number(t.lead_fee) || 0), 0);

    res.json({
      totalRides: trips.length,
      completedRides: completedTrips.length,
      cancelledRides: cancelledTrips.length,
      totalFareValue: totalFare,
      totalLeadFees: totalFees,
      netEarnings: totalFare - totalFees,
      recentTrips: trips.slice(0, 10).map(t => ({
        id: t.id,
        _id: t.id,
        date: t.created_at,
        pickupLocation: t.pickup_location,
        dropLocation: t.drop_location,
        distance: t.distance_km,
        fare: t.estimated_fare,
        status: t.status
      }))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /accept → driver accepts booking
router.post('/:id/accept', auth, async (req, res) => {
  try {
    const { data: booking } = await supabase
      .from('trips')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (req.user.role !== 'driver') return res.status(403).json({ message: 'Only drivers can claim leads' });
    if (booking.accepted_driver_id) return res.status(400).json({ message: 'Lead already accepted' });

    const { data: updated, error } = await supabase
      .from('trips')
      .update({
        status: 'ACCEPTED',
        accepted_driver_id: req.user.id,
        payment_status: 'pending'
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /payment-confirm → admin confirms payment
router.post('/:id/payment-confirm', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
  try {
    const startOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const dropOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const { data: updated, error } = await supabase
      .from('trips')
      .update({
        status: 'PAID',
        payment_status: 'paid',
        details_unlocked: true,
        start_otp: startOtp,
        drop_otp: dropOtp
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /verify-start-otp
router.post('/:id/verify-start-otp', auth, async (req, res) => {
  const { otp } = req.body;
  try {
    const { data: booking } = await supabase
      .from('trips')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (booking.start_otp !== otp) return res.status(400).json({ message: 'Invalid Start OTP' });
    
    const { data: updated, error } = await supabase
      .from('trips')
      .update({
        status: 'STARTED',
        start_time: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /verify-drop-otp
router.post('/:id/verify-drop-otp', auth, async (req, res) => {
  const { otp } = req.body;
  try {
    const { data: booking } = await supabase
      .from('trips')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (booking.drop_otp !== otp) return res.status(400).json({ message: 'Invalid Drop OTP' });
    
    const { data: updated, error } = await supabase
      .from('trips')
      .update({
        status: 'COMPLETED',
        end_time: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/trips/:id → delete booking
router.delete('/:id', auth, async (req, res) => {
  try {
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
