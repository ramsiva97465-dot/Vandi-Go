import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutGrid, Users, Settings as SettingsIcon, Plus, Search, Bell, 
  Trash2, X, ArrowRight, CheckCircle, Clock, Zap,
  AlertTriangle, MapPin, Target, Car, Menu, LogOut, ShieldCheck, Home
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AdminHome from './AdminHome';
import CabManagement from './CabManagement';
import Settings from './Settings';
import LocationAutocomplete from '../components/LocationAutocomplete';

import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const AdminDashboard = () => {
  const { lang } = useLanguage();
  
  const t = {
    EN: {
      central: 'Central',
      control: 'Administrative Control',
      overview: 'Overview',
      bookings: 'Bookings',
      fleet: 'Fleet',
      drivers: 'Drivers',
      newBooking: 'New Booking',
      realtime: 'Real-time marketplace security & oversight.',
      home: 'Dashboard Home',
      allBookings: 'All Bookings',
      cabMgmt: 'Cab Management',
      operativeFleet: 'Operative Fleet',
      settings: 'Settings',
      logout: 'Logout Session',
      loggedInAs: 'Logged in as',
      customer: 'Customer',
      journey: 'Journey',
      status: 'Status',
      pricing: 'Pricing',
      liveTrack: 'Live Track',
      otps: 'OTPs',
      actions: 'Actions',
      manualBooking: 'Manual Booking',
      pickup: 'Pickup',
      drop: 'Drop',
      vehicleClass: 'Vehicle Class',
      selectVehicle: 'Select a Vehicle Class',
      name: 'Name',
      phone: 'Phone',
      calculatedFare: 'Calculated Fare',
      routeDistance: 'Route Distance',
      createManifest: 'Create Manifest',
      updateBooking: 'Update Booking',
      recalculating: 'Recalculating...',
      waitSignal: 'Wait Signal',
      verify: 'Verify',
      deleteConfirm: 'Delete this booking?',
      opFailed: 'Operation failed',
      delFailed: 'Delete failed',
      verFailed: 'Verification failed',
      kycStatus: 'KYC Status',
      operative: 'Operative',
      documents: 'Documents',
      approve: 'Approve',
      reject: 'Reject',
      viewDocs: 'View Documents',
      aadhaar: 'Aadhaar'
    },
    TA: {
      central: 'மையம்',
      control: 'நிர்வாகக் கட்டுப்பாடு',
      overview: 'கண்ணோட்டம்',
      bookings: 'முன்பதிவுகள்',
      fleet: 'வாகனங்கள்',
      drivers: 'ஓட்டுநர்கள்',
      newBooking: 'புதிய முன்பதிவு',
      realtime: 'நிகழ்நேர சந்தை பாதுகாப்பு மற்றும் மேற்பார்வை.',
      home: 'டாஷ்போர்டு முகப்பு',
      allBookings: 'அனைத்து முன்பதிவுகள்',
      cabMgmt: 'கேப் மேலாண்மை',
      operativeFleet: 'செயல்பாட்டு வாகனங்கள்',
      settings: 'அமைப்புகள்',
      logout: 'வெளியேறு',
      loggedInAs: 'உள்நுழைந்துள்ளவர்',
      customer: 'வாடிக்கையாளர்',
      journey: 'பயணம்',
      status: 'நிலை',
      pricing: 'விலை',
      liveTrack: 'நேரடி கண்காணிப்பு',
      otps: 'OTP-கள்',
      actions: 'செயல்கள்',
      manualBooking: 'கைமுறை முன்பதிவு',
      pickup: 'ஏறும் இடம்',
      drop: 'இறங்கும் இடம்',
      vehicleClass: 'வாகன வகை',
      selectVehicle: 'வாகன வகையைத் தேர்ந்தெடுக்கவும்',
      name: 'பெயர்',
      phone: 'தொலைபேசி',
      calculatedFare: 'கணக்கிடப்பட்ட கட்டணம்',
      routeDistance: 'பயண தூரம்',
      createManifest: 'பதிவு செய்',
      updateBooking: 'முன்பதிவை மாற்றவும்',
      recalculating: 'மீண்டும் கணக்கிடப்படுகிறது...',
      waitSignal: 'சிக்னலுக்காக காத்திருக்கவும்',
      verify: 'சரிபார்',
      deleteConfirm: 'இந்த முன்பதிவை நீக்கவா?',
      opFailed: 'செயல்பாடு தோல்வியடைந்தது',
      delFailed: 'நீக்குதல் தோல்வியடைந்தது',
      verFailed: 'சரிபார்ப்பு தோல்வியடைந்தது',
      kycStatus: 'KYC நிலை',
      operative: 'இயக்குபவர்',
      documents: 'ஆவணங்கள்',
      approve: 'அங்கீகரி',
      reject: 'நிராகரி',
      viewDocs: 'ஆவணங்களைப் பார்',
      aadhaar: 'ஆதார்'
    }
  };
  const [trips, setTrips] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [cabTypes, setCabTypes] = useState([]);
  const [view, setView] = useState('dashboard'); // dashboard, bookings, cab_mgmt, drivers
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    pickupLocation: '', dropLocation: '', carType: 'Sedan', cab_type_id: '',
    customerName: '', customerPhone: '', bookingDateTime: '', status: 'CREATED',
    pickup_lat: null, pickup_lng: null, drop_lat: null, drop_lng: null,
    distance_km: null, estimated_fare: null
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const maskAadhaar = (num) => {
    if (!num) return 'XXXX XXXX XXXX';
    return `XXXX XXXX ${num.slice(-4)}`;
  };

  const updateKycStatus = async (driverId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/auth/drivers/${driverId}/kyc`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchDrivers();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/login');
    fetchTrips();
    fetchDrivers();
    fetchCabTypes();
    const interval = setInterval(fetchTrips, 2000); // Fast live sync (2s)
    return () => clearInterval(interval);
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/trips', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTrips(res.data);
      setLoading(false);
    } catch (err) { console.error(err); }
  };

  const fetchDrivers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/drivers', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDrivers(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchCabTypes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/cab-types');
      setCabTypes(res.data);
    } catch (err) { console.error(err); }
  };

  const calculateFare = async (data) => {
    if (data.pickup_lat && data.drop_lat && data.cab_type_id) {
      setIsCalculating(true);
      try {
        const res = await axios.post('http://localhost:5000/api/trips/calculate-distance', {
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

  const confirmPayment = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/trips/${id}/payment-confirm`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchTrips();
    } catch (err) { alert(t[lang].verFailed); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTrip) {
        await axios.put(`http://localhost:5000/api/trips/${editingTrip._id}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/trips', formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      setShowModal(false);
      resetForm();
      fetchTrips();
    } catch (err) { alert(t[lang].opFailed); }
  };

  const deleteTrip = async (id) => {
    if (window.confirm(t[lang].deleteConfirm)) {
      try {
        await axios.delete(`http://localhost:5000/api/trips/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchTrips();
      } catch (err) { alert(t[lang].delFailed); }
    }
  };

  const resetForm = () => {
    setFormData({
      pickupLocation: '', dropLocation: '', fareAmount: '', carType: 'Sedan',
      customerName: '', customerPhone: '', bookingDateTime: '', status: 'CREATED'
    });
    setEditingTrip(null);
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      'CREATED': 'bg-yellow-50 text-yellow-600 border-yellow-100',
      'PAID': 'bg-blue-50 text-blue-600 border-blue-100',
      'ACCEPTED': 'bg-orange-50 text-orange-600 border-orange-100',
      'STARTED': 'bg-green-50 text-green-600 border-green-100',
      'COMPLETED': 'bg-slate-50 text-slate-400 border-slate-100'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${styles[status] || styles['COMPLETED']}`}>
        {status || 'CREATED'}
      </span>
    );
  };

  const filteredTrips = (trips || []).filter(t => 
    (t?.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t?.pickupLocation || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const NavItems = () => (
    <nav className="space-y-2">
      {[
        { id: 'dashboard', label: t[lang].home, icon: Home },
        { id: 'bookings', label: t[lang].allBookings, icon: LayoutGrid },
        { id: 'cab_mgmt', label: t[lang].cabMgmt, icon: Car },
        { id: 'fleet', label: t[lang].operativeFleet, icon: Users },
        { id: 'settings', label: t[lang].settings, icon: SettingsIcon },
      ].map((item) => (
        <button 
          key={item.id}
          onClick={() => { setView(item.id); setIsSidebarOpen(false); }}
          className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-[13px] font-semibold transition-all duration-300 ${view === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          <item.icon className="w-5 h-5" /> {item.label}
        </button>
      ))}
    </nav>
  );

  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return <AdminHome trips={trips} drivers={drivers} />;
      case 'cab_mgmt':
        return <CabManagement />;
      case 'settings':
        return <Settings />;
      case 'bookings':
        return (
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t[lang].customer}</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t[lang].journey}</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t[lang].status}</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t[lang].pricing}</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t[lang].liveTrack}</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t[lang].otps}</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">{t[lang].actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredTrips.map((trip) => (
                    <tr key={trip._id} className="hover:bg-slate-50/30 transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center font-bold text-blue-600 text-sm">{trip.customerName?.charAt(0)}</div>
                          <div><p className="text-sm font-bold text-[#0B1E3F]">{trip.customerName}</p><p className="text-[10px] font-medium text-slate-400">{trip.customerPhone}</p></div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">{trip.pickupLocation} <ArrowRight className="w-3 h-3 text-slate-300" /> {trip.dropLocation}</div>
                        <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{trip.carType}</p>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex flex-col gap-1">
                           <StatusBadge status={trip.status} />
                           {trip.status === 'STARTED' && <div className="flex items-center gap-1 text-[8px] font-black text-green-500 uppercase tracking-tighter animate-pulse"><Zap className="w-2 h-2" /> Live</div>}
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex flex-col gap-1">
                           <p className="text-[11px] font-black text-[#0B1E3F]">₹{trip.estimated_fare?.toLocaleString()}</p>
                           <div className="flex items-center gap-1.5">
                             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{trip.distance_km} KM</p>
                             <span className="w-1 h-1 rounded-full bg-slate-200" />
                             <p className="text-[9px] font-black text-blue-600 uppercase tracking-tighter">Fee: ₹{trip.lead_fee || 0}</p>
                           </div>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                        {trip.driver_location ? (
                          <div className="space-y-1">
                            <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter ${trip.driver_location.status === 'Active' ? 'text-green-600' : 'text-red-500'}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${trip.driver_location.status === 'Active' ? 'bg-green-500 animate-ping' : 'bg-red-500'}`} />
                              {trip.driver_location.status}
                            </div>
                            <p className="text-[9px] font-bold text-slate-400">{trip.driver_location.lat?.toFixed(4)}, {trip.driver_location.lng?.toFixed(4)}</p>
                          </div>
                        ) : <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">{t[lang].waitSignal}</span>}
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2"><span className="text-[8px] font-black text-slate-400 uppercase">Start:</span><span className="text-xs font-black text-blue-600 tracking-wider">{trip.start_otp || '----'}</span></div>
                          <div className="flex items-center gap-2"><span className="text-[8px] font-black text-slate-400 uppercase">Drop:</span><span className="text-xs font-black text-[#0B1E3F] tracking-wider">{trip.drop_otp || '----'}</span></div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {trip.status === 'ACCEPTED' && <button onClick={() => confirmPayment(trip._id)} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-[10px] font-bold rounded-lg uppercase tracking-widest shadow-lg shadow-green-500/20">{t[lang].verify}</button>}
                          <button onClick={() => deleteTrip(trip._id)} className="p-2 text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'fleet':
        return (
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr className="border-b border-slate-100">
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t[lang].operative}</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t[lang].aadhaar}</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t[lang].kycStatus}</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t[lang].documents}</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">{t[lang].actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {drivers.map((driver) => (
                    <tr key={driver._id} className="hover:bg-slate-50/50 transition-all">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold">{driver.name?.charAt(0)}</div>
                          <div>
                            <p className="text-sm font-bold text-[#0B1E3F]">{driver.name}</p>
                            <p className="text-[10px] font-medium text-slate-400">{driver.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-slate-600 tracking-widest">
                        {maskAadhaar(driver.aadhaarNumber)}
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                          driver.kyc_status === 'verified' ? 'bg-green-50 text-green-600 border-green-100' :
                          driver.kyc_status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                          'bg-yellow-50 text-yellow-600 border-yellow-100'
                        }`}>
                          {driver.kyc_status || 'pending'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <button className="text-blue-600 text-[10px] font-bold uppercase tracking-widest hover:underline flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> {t[lang].viewDocs}
                        </button>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {driver.kyc_status !== 'verified' && (
                            <button 
                              onClick={() => updateKycStatus(driver._id, 'verified')}
                              className="px-3 py-1.5 bg-emerald-500 text-white text-[9px] font-bold rounded-lg uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-sm"
                            >
                              {t[lang].approve}
                            </button>
                          )}
                          {driver.kyc_status !== 'rejected' && (
                            <button 
                              onClick={() => updateKycStatus(driver._id, 'rejected')}
                              className="px-3 py-1.5 bg-red-50 text-red-500 text-[9px] font-bold rounded-lg uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100"
                            >
                              {t[lang].reject}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden p-20 text-center">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Section Under Maintenance</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-['Poppins']">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0B1E3F] text-white transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20"><Car className="w-6 h-6 text-white" /></div>
            <span className="text-xl font-bold tracking-tight">VandiGo<span className="text-blue-400 font-black">Admin</span></span>
          </div>
          <NavItems />
          <div className="mt-auto pt-8 border-t border-white/5">
            <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="flex items-center gap-4 px-6 py-4 text-slate-400 hover:text-white transition-all w-full text-[13px] font-semibold">
              <LogOut className="w-5 h-5" /> {t[lang].logout}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 min-w-0 flex flex-col">
        <header className="h-20 bg-white border-b border-slate-100 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-400"><Menu /></button>
            <div className="hidden xs:block">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t[lang].control}</p>
               <h1 className="text-lg font-bold text-[#0B1E3F]">VandiGo <span className="text-blue-600">{t[lang].central}</span></h1>
            </div>
          </div>
          <div className="flex items-center gap-4 lg:gap-8">
            <div className="hidden md:block scale-90">
              <LanguageSwitcher />
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t[lang].loggedInAs}</p>
                 <p className="text-sm font-bold">{user?.name}</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center relative"><Bell className="w-5 h-5 text-slate-400" /><div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full" /></div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-10">
             <div>
                <h1 className="text-3xl font-bold">{view === 'bookings' ? t[lang].bookings : t[lang].fleet} <span className="text-blue-600">{t[lang].overview}</span></h1>
                <p className="text-slate-400 text-sm mt-1">{t[lang].realtime}</p>
             </div>
             <button onClick={() => { resetForm(); setShowModal(true); }} className="px-6 py-4 bg-[#0B1E3F] text-white rounded-2xl text-xs font-bold shadow-xl hover:bg-[#1a2e4f] flex items-center gap-2 transition-all"><Plus className="w-4 h-4" /> {t[lang].newBooking}</button>
          </div>

          <div className="bg-transparent mb-10">
            {renderContent()}
          </div>
        </div>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-sm" style={{ backgroundColor: 'rgba(11, 30, 63, 0.4)' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white w-full max-w-[700px] rounded-[32px] shadow-2xl overflow-hidden">
              <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-xl font-bold">
                  {t[lang].manualBooking.split(' ')[0]} <span className="text-blue-600">{t[lang].manualBooking.split(' ')[1]}</span>
                </h2>
                <button onClick={() => setShowModal(false)}>
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-10 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">{t[lang].pickup}</label>
                    <LocationAutocomplete 
                      placeholder="Where from?" 
                      value={formData.pickupLocation}
                      onSelect={(loc) => {
                        const newData = { ...formData, pickupLocation: loc.name, pickup_lat: loc.lat, pickup_lng: loc.lng };
                        setFormData(newData);
                        calculateFare(newData);
                      }} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">{t[lang].drop}</label>
                    <LocationAutocomplete 
                      placeholder="Where to?" 
                      value={formData.dropLocation}
                      onSelect={(loc) => {
                        const newData = { ...formData, dropLocation: loc.name, drop_lat: loc.lat, drop_lng: loc.lng };
                        setFormData(newData);
                        calculateFare(newData);
                      }} 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">{t[lang].vehicleClass}</label>
                    <select 
                      required 
                      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-semibold outline-none"
                      value={formData.cab_type_id}
                      onChange={(e) => {
                        const selected = cabTypes.find(c => c._id === e.target.value);
                        const newData = { ...formData, cab_type_id: e.target.value, carType: selected?.name || '' };
                        setFormData(newData);
                        calculateFare(newData);
                      }}
                    >
                      <option value="">{t[lang].selectVehicle}</option>
                      {cabTypes.map(cab => (
                        <option key={cab._id} value={cab._id}>{cab.name} (₹{cab.base_fare} + ₹{cab.price_per_km} per KM)</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase ml-1">{t[lang].name}</label><input required className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-semibold" value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} /></div>
                  <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase ml-1">{t[lang].phone}</label><input required className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-semibold" value={formData.customerPhone} onChange={(e) => setFormData({...formData, customerPhone: e.target.value})} /></div>
                </div>

                <AnimatePresence>
                  {formData.estimated_fare && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-blue-50/50 rounded-[24px] p-6 border border-blue-100/50">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{t[lang].calculatedFare}</p>
                          <p className="text-xl font-black text-[#0B1E3F]">₹{formData.estimated_fare.toLocaleString()}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t[lang].routeDistance}</p>
                          <p className="text-sm font-black text-[#0B1E3F]">{formData.distance_km} KM</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button type="submit" disabled={isCalculating} className="w-full py-5 bg-[#0B1E3F] text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:bg-slate-200">
                  {isCalculating ? t[lang].recalculating : editingTrip ? t[lang].updateBooking : t[lang].createManifest}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
