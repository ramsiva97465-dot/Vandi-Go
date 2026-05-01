import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Calendar, Clock, Car, User, Phone, 
  CheckCircle, ArrowRight, PhoneCall, ShieldCheck,
  Menu, X, ChevronRight, Zap, Target, Star, Map as MapIcon, Crosshair
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import LocationAutocomplete from '../components/LocationAutocomplete';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet default icon issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationPicker = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
};

const Landing = () => {
  const { lang } = useLanguage();
  
  const t = {
    EN: {
      support: 'Support',
      driversLogin: 'Drivers Login',
      heroTag: 'Premium Lead Marketplace',
      heroTitle: 'Book Your Ride Instantly.',
      heroSub: 'The smartest way to book a cab. Submit your request and our network of verified drivers will contact you directly.',
      formTitle: 'Request a Lead',
      formSub: 'Fill in the manifest to notify drivers.',
      pickup: 'Pickup Location',
      pickupPlaceholder: 'Where from?',
      drop: 'Drop Location',
      dropPlaceholder: 'Where to?',
      carType: 'Car Type',
      selectCar: 'Select Car',
      dateTime: 'Date & Time',
      fullName: 'Full Name',
      phone: 'Phone Number',
      estimatedFare: 'Estimated Fare',
      approx: 'Approx.',
      distance: 'Distance',
      confirm: 'Confirm Booking',
      processing: 'Processing...',
      calculating: 'Calculating Fare...'
    },
    TA: {
      support: 'உதவி',
      driversLogin: 'டிரைவர் லாகின்',
      heroTag: 'பிரீமியம் லீட் சந்தை',
      heroTitle: 'உங்கள் பயணத்தை உடனடியாக முன்பதிவு செய்யுங்கள்.',
      heroSub: 'கேப் முன்பதிவு செய்ய சிறந்த வழி. உங்கள் கோரிக்கையைச் சமர்ப்பிக்கவும், எங்களது சரிபார்க்கப்பட்ட டிரைவர்கள் உங்களைத் தொடர்புகொள்வார்கள்.',
      formTitle: 'முன்பதிவு செய்யவும்',
      formSub: 'டிரைவர்களுக்குத் தெரிவிக்க விவரங்களை நிரப்பவும்.',
      pickup: 'ஏறும் இடம்',
      pickupPlaceholder: 'எங்கிருந்து?',
      drop: 'இறங்கும் இடம்',
      dropPlaceholder: 'எங்கு?',
      carType: 'வாகன வகை',
      selectCar: 'வாகனத்தைத் தேர்ந்தெடுக்கவும்',
      dateTime: 'தேதி மற்றும் நேரம்',
      fullName: 'முழு பெயர்',
      phone: 'தொலைபேசி எண்',
      estimatedFare: 'மதிப்பிடப்பட்ட கட்டணம்',
      approx: 'சுமார்.',
      distance: 'தூரம்',
      confirm: 'முன்பதிவை உறுதிப்படுத்து',
      processing: 'செயலாக்கத்தில் உள்ளது...',
      calculating: 'கட்டணம் கணக்கிடப்படுகிறது...'
    }
  };

  const [formData, setFormData] = useState({
    pickupLocation: '', dropLocation: '', carType: 'Sedan', cab_type_id: '',
    customerName: '', customerPhone: '', bookingDateTime: '',
    pickup_lat: null, pickup_lng: null, drop_lat: null, drop_lng: null,
    distance_km: null, estimated_fare: null
  });
  const [cabTypes, setCabTypes] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapTarget, setMapTarget] = useState('dropLocation');
  useEffect(() => {
    fetchCabTypes();
  }, []);

  const fetchCabTypes = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/cab-types`);
      setCabTypes(res.data);
      if (res.data.length > 0) {
        setFormData(prev => ({ ...prev, cab_type_id: res.data[0]._id, carType: res.data[0].name }));
      }
    } catch (err) { console.error(err); }
  };

  const calculateFare = async (data) => {
    if (data.pickup_lat && data.drop_lat && data.cab_type_id) {
      setIsCalculating(true);
      try {
        const res = await axios.post(`${API_URL}/api/trips/calculate-distance`, {
          pickup_lat: data.pickup_lat,
          pickup_lng: data.pickup_lng,
          drop_lat: data.drop_lat,
          drop_lng: data.drop_lng,
          cab_type_id: data.cab_type_id
        });
        setFormData(prev => ({ 
          ...prev, 
          distance_km: res.data.distance_km, 
          estimated_fare: res.data.estimated_fare 
        }));
      } catch (err) {
        console.error('Fare calculation failed', err);
      } finally {
        setIsCalculating(false);
      }
    }
  };

  const handleGetLocation = (field) => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    setStatus({ type: 'loading', msg: 'Detecting your location...' });
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await axios.get(`${API_URL}/api/geo/reverse?lat=${latitude}&lon=${longitude}`);
          if (res.data) {
            const newData = { 
              ...formData, 
              [field]: res.data.name, 
              [`${field === 'pickupLocation' ? 'pickup' : 'drop'}_lat`]: latitude,
              [`${field === 'pickupLocation' ? 'pickup' : 'drop'}_lng`]: longitude
            };
            setFormData(newData);
            calculateFare(newData);
            setStatus({ type: '', msg: '' });
          }
        } catch (err) {
          const mockAddress = `GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setFormData(prev => ({ ...prev, [field]: mockAddress }));
          setStatus({ type: '', msg: '' });
        }
      },
      (error) => {
        setStatus({ type: 'error', msg: 'Unable to retrieve location' });
      }
    );
  };

  const handleMapSelect = (latlng) => {
    const address = `Map: ${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`;
    const isPickup = mapTarget === 'pickupLocation';
    const newData = { 
      ...formData, 
      [mapTarget]: address,
      [`${isPickup ? 'pickup' : 'drop'}_lat`]: latlng.lat,
      [`${isPickup ? 'pickup' : 'drop'}_lng`]: latlng.lng
    };
    setFormData(newData);
    calculateFare(newData);
    setShowMap(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', msg: 'Processing your request...' });
    try {
      await axios.post(`${API_URL}/api/trips/public`, formData);
      setStatus({ type: 'success', msg: 'Booking created! Drivers will contact you soon.' });
      setFormData({
        pickupLocation: '', dropLocation: '', carType: 'Sedan', cab_type_id: '',
        customerName: '', customerPhone: '', bookingDateTime: '',
        pickup_lat: null, pickup_lng: null, drop_lat: null, drop_lng: null,
        distance_km: null, estimated_fare: null
      });
      fetchCabTypes(); // Re-fetch to reset defaults
    } catch (err) {
      setStatus({ type: 'error', msg: 'Something went wrong. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0B1E3F] font-['Poppins'] selection:bg-blue-100">
      {/* Map Modal */}
      <AnimatePresence>
        {showMap && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMap(false)} className="absolute inset-0 backdrop-blur-sm" style={{ backgroundColor: 'rgba(11, 30, 63, 0.4)' }} />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-4xl h-[80vh] rounded-[32px] overflow-hidden shadow-2xl relative z-10 flex flex-col"
            >
              <div className="p-6 border-b flex justify-between items-center bg-white">
                <div>
                  <h3 className="text-lg font-bold">Select {mapTarget === 'pickupLocation' ? 'Pickup' : 'Drop'} Location</h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">Click on the map to set the point.</p>
                </div>
                <button onClick={() => setShowMap(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all"><X className="w-6 h-6" /></button>
              </div>
              <div className="flex-1 relative">
                <MapContainer center={[13.0827, 80.2707]} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationPicker onSelect={handleMapSelect} />
                </MapContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[1000]">
                  <MapPin className="w-10 h-10 text-blue-600 -mt-10 drop-shadow-xl animate-bounce" />
                </div>
              </div>
              <div className="p-4 text-center bg-blue-50">
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Tap anywhere on the map to confirm location</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Responsive Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-12 py-4 flex justify-between items-center sticky top-0 z-[100]">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-[#0B1E3F] rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Car className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <span className="text-lg md:text-xl font-bold tracking-tight">Vandi<span className="text-blue-600">Go</span></span>
        </div>

        <div className="hidden md:flex items-center gap-6">
           <LanguageSwitcher />
           <a href="tel:+919342042401" className="flex items-center gap-3 bg-blue-50 text-blue-700 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-100 transition-all">
             <PhoneCall className="w-4 h-4" /> {t[lang].support}
           </a>
           <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-[#0B1E3F] transition-all">{t[lang].driversLogin}</Link>
        </div>

        <div className="md:hidden flex items-center gap-4">
          <LanguageSwitcher />
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-white border-b border-slate-100 overflow-hidden">
            <div className="p-6 space-y-4">
              <a href="tel:+919342042401" className="flex items-center justify-center gap-3 bg-blue-50 text-blue-700 py-4 rounded-2xl text-sm font-bold"><PhoneCall className="w-5 h-5" /> {t[lang].support}</a>
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block text-center py-4 text-sm font-bold text-slate-400">{t[lang].driversLogin}</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <section className="px-6 md:px-12 py-12 md:py-24 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6 md:mb-8">
               <Zap className="w-3 h-3 md:w-4 md:h-4" /> {t[lang].heroTag}
            </div>
            <h1 className="text-4xl md:text-6xl xl:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6 md:mb-8">
              {t[lang].heroTitle}
            </h1>
            <p className="text-base md:text-lg text-slate-500 font-medium max-w-[500px] mx-auto lg:mx-0 mb-10 md:mb-12">
              {t[lang].heroSub}
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[540px] mx-auto">
            <div className="bg-white rounded-[32px] md:rounded-[48px] p-6 md:p-10 shadow-2xl shadow-blue-900/10 border border-slate-100 relative">
              <h2 className="text-xl md:text-2xl font-bold mb-2">{t[lang].formTitle}</h2>
              <p className="text-xs md:text-sm text-slate-400 mb-8 md:mb-10 font-medium">{t[lang].formSub}</p>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t[lang].pickup}</label>
                      <div className="relative group">
                        <LocationAutocomplete 
                          placeholder={t[lang].pickupPlaceholder}
                          value={formData.pickupLocation}
                          onSelect={(loc) => {
                            const newData = { ...formData, pickupLocation: loc.name, pickup_lat: loc.lat, pickup_lng: loc.lng };
                            setFormData(newData);
                            calculateFare(newData);
                          }} 
                        />
                        <button type="button" onClick={() => handleGetLocation('pickupLocation')} className="absolute right-4 top-3.5 p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-all z-20"><Crosshair className="w-5 h-5" /></button>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t[lang].drop}</label>
                      <div className="relative group">
                        <LocationAutocomplete 
                          placeholder={t[lang].dropPlaceholder}
                          value={formData.dropLocation}
                          onSelect={(loc) => {
                            const newData = { ...formData, dropLocation: loc.name, drop_lat: loc.lat, drop_lng: loc.lng };
                            setFormData(newData);
                            calculateFare(newData);
                          }} 
                        />
                        <button type="button" onClick={() => { setMapTarget('dropLocation'); setShowMap(true); }} className="absolute right-4 top-3.5 p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-all z-20" title="Select on Map">
                          <MapIcon className="w-5 h-5" />
                        </button>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t[lang].carType}</label>
                      <div className="relative group">
                        <Car className="absolute left-4 top-4 w-5 h-5 text-slate-300" />
                        <select 
                          className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold appearance-none outline-none" 
                          value={formData.cab_type_id} 
                          onChange={(e) => {
                            const selected = cabTypes.find(c => c._id === e.target.value);
                            const newData = { ...formData, cab_type_id: e.target.value, carType: selected?.name || '' };
                            setFormData(newData);
                            calculateFare(newData);
                          }}
                        >
                          <option value="">{t[lang].selectCar}</option>
                          {cabTypes.map(cab => (
                            <option key={cab._id} value={cab._id}>{cab.name}</option>
                          ))}
                        </select>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t[lang].dateTime}</label>
                      <div className="relative group">
                        <Calendar className="absolute left-4 top-4 w-5 h-5 text-slate-300" />
                        <input type="datetime-local" className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold" value={formData.bookingDateTime} onChange={(e) => setFormData({...formData, bookingDateTime: e.target.value})} />
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t[lang].fullName}</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-4 w-5 h-5 text-slate-300" />
                        <input required className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold" placeholder="John Doe" value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t[lang].phone}</label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-4 w-5 h-5 text-slate-300" />
                        <input required className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold" placeholder="Mobile Number" value={formData.customerPhone} onChange={(e) => setFormData({...formData, customerPhone: e.target.value})} />
                      </div>
                   </div>
                </div>
                
                <AnimatePresence>
                  {formData.estimated_fare && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-blue-50/50 rounded-3xl p-6 border border-blue-100/50">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{t[lang].estimatedFare}</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-[#0B1E3F]">₹{formData.estimated_fare.toLocaleString()}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{t[lang].approx}</span>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t[lang].distance}</p>
                          <p className="text-sm font-black text-[#0B1E3F]">{formData.distance_km} KM</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button type="submit" disabled={status.type === 'loading' || isCalculating} className="w-full py-5 bg-[#0B1E3F] text-white rounded-3xl font-bold uppercase tracking-[0.2em] text-xs shadow-xl flex items-center justify-center gap-3 disabled:bg-slate-200 disabled:shadow-none transition-all">
                  {status.type === 'loading' ? t[lang].processing : isCalculating ? t[lang].calculating : <>{t[lang].confirm} <ChevronRight className="w-5 h-5" /></>}
                </button>
                
                {status.msg && <div className={`text-center p-4 rounded-2xl text-xs font-bold uppercase ${status.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{status.msg}</div>}
              </form>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default Landing;
