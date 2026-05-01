import { API_URL } from '../config';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, MapPin, IndianRupee, Phone, Calendar, Clock, 
  Car, ShieldCheck, Lock, Unlock, PhoneCall, LogOut,
  Navigation, CheckCircle, AlertTriangle, User, MoreVertical,
  Menu, X, ChevronRight, BellRing, Volume2, VolumeX, TrendingUp, Map as MapIcon, Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { Link } from 'react-router-dom';

const ALERT_SOUND_URL = 'https://www.soundjay.com/buttons/beep-01a.mp3';

const DriverDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('marketplace');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [newLeadAlert, setNewLeadAlert] = useState(null);
  const [audioEnabled] = useState(true); // Always enabled
  
  const lastLeadIdRef = useRef(null);
  const audioRef = useRef(new Audio(ALERT_SOUND_URL));
  const { lang } = useLanguage();
  const { logout, user } = useAuth();
  
  const [stats, setStats] = useState(null);
  const [statsRange, setStatsRange] = useState('week');
  const [statsLoading, setStatsLoading] = useState(false);

  const t = {
    EN: {
      marketplace: 'Marketplace',
      history: 'My History',
      landing: 'Landing Page',
      online: 'Online',
      offline: 'Offline',
      available: 'Available',
      leads: 'Leads',
      mission: 'Mission',
      historyTitle: 'History',
      claimHigh: 'Claim high-value manifests.',
      trackSecured: 'Track your secured leads.',
      loggedInAs: 'Logged in as',
      totalMissions: 'Total Missions',
      syncing: 'Syncing Network...',
      noMissions: 'No Missions Available in your sector',
      noClaimed: 'You have not claimed any missions yet',
      pickup: 'Pickup',
      drop: 'Drop',
      estFare: 'Est. Fare',
      distance: 'Distance',
      unlocked: 'Unlocked',
      pending: 'Pending Payment',
      newLead: 'New Lead',
      claimBtn: 'Claim Lead',
      activated: 'Lead Activated',
      locked: 'Locked',
      contactAdmin: 'Contact admin',
      claimedByOther: 'Claimed by another',
      newBooking: 'New Booking Available',
      newSub: 'A new manifest has been manifested in your sector.',
      accept: 'Accept Booking',
      dismiss: 'Dismiss',
      verifyStart: 'Verify Start OTP',
      verifyDrop: 'Drop OTP (From Customer)',
      trackingLive: 'Tracking Live',
      missionCompleted: 'Mission Completed',
      startBtn: 'Start',
      finishBtn: 'Finish',
      anonymous: 'Anonymous',
      kycTitle: 'Account Under Review',
      kycSub: 'Your operative credentials are being verified by central command.',
      kycDesc: 'You will receive a notification once your profile is verified. Until then, lead marketplace access is restricted for security reasons.',
      kycContact: 'For urgent clearance, contact Admin',
      performance: 'Performance',
      totalEarnings: 'Total Fare Value',
      netEarnings: 'Net Earnings',
      totalFees: 'Lead Fees Paid',
      today: 'Today',
      week: 'This Week',
      month: 'This Month',
      rides: 'Rides',
      completed: 'Completed',
      rejected: 'Rejected/Other',
      recentPerformance: 'Recent Performance',
    },
    TA: {
      marketplace: 'சந்தை',
      history: 'எனது வரலாறு',
      landing: 'முகப்பு பக்கம்',
      online: 'ஆன்லைன்',
      offline: 'ஆஃப்லைன்',
      available: 'கிடைக்கக்கூடிய',
      leads: 'லீட்கள்',
      mission: 'பணி',
      historyTitle: 'வரலாறு',
      claimHigh: 'உயர் மதிப்புள்ள லீட்களைப் பெறுங்கள்.',
      trackSecured: 'உங்கள் லீட்களைக் கண்காணிக்கவும்.',
      loggedInAs: 'உள்நுழைந்துள்ளவர்',
      totalMissions: 'மொத்த பணிகள்',
      syncing: 'நெட்வொர்க் இணைக்கப்படுகிறது...',
      noMissions: 'உங்கள் பகுதியில் பணிகள் ஏதுமில்லை',
      noClaimed: 'நீங்கள் இன்னும் எந்தப் பணியையும் பெறவில்லை',
      pickup: 'ஏறும் இடம்',
      drop: 'இறங்கும் இடம்',
      estFare: 'மதிப்பிடப்பட்ட கட்டணம்',
      distance: 'தூரம்',
      unlocked: 'திறக்கப்பட்டது',
      pending: 'பணம் செலுத்த நிலுவையில் உள்ளது',
      newLead: 'புதிய லீட்',
      claimBtn: 'லீட் பெறுங்கள்',
      activated: 'லீட் செயல்படுத்தப்பட்டது',
      locked: 'பூட்டப்பட்டது',
      contactAdmin: 'நிர்வாகியைத் தொடர்பு கொள்ளவும்',
      claimedByOther: 'மற்றொருவரால் பெறப்பட்டது',
      newBooking: 'புதிய முன்பதிவு உள்ளது',
      newSub: 'உங்கள் பகுதியில் ஒரு புதிய முன்பதிவு வந்துள்ளது.',
      accept: 'ஏற்றுக்கொள்',
      dismiss: 'தவிர்',
      verifyStart: 'தொடக்க OTP-ஐ சரிபார்க்கவும்',
      verifyDrop: 'இறங்கும் OTP (வாடிக்கையாளரிடமிருந்து)',
      trackingLive: 'நேரடி கண்காணிப்பு',
      missionCompleted: 'பணி முடிந்தது',
      startBtn: 'தொடங்கு',
      finishBtn: 'முடிக்கவும்',
      anonymous: 'பெயர் தெரியாதவர்',
      kycTitle: 'கணக்கு பரிசீலனையில் உள்ளது',
      kycSub: 'உங்கள் விவரங்கள் நிர்வாகியால் சரிபார்க்கப்படுகின்றன.',
      kycDesc: 'உங்கள் சுயவிவரம் சரிபார்க்கப்பட்டதும் உங்களுக்கு அறிவிக்கப்படும். அதுவரை, பாதுகாப்பு காரணங்களுக்காக லீட்களைப் பார்க்க முடியாது.',
      kycContact: 'அவசர உதவிக்கு, நிர்வாகியைத் தொடர்பு கொள்ளவும்',
      performance: 'செயல்திறன்',
      totalEarnings: 'மொத்த கட்டண மதிப்பு',
      netEarnings: 'நிகர வருமானம்',
      totalFees: 'செலுத்தப்பட்ட லீட் கட்டணம்',
      today: 'இன்று',
      week: 'இந்த வாரம்',
      month: 'இந்த மாதம்',
      rides: 'பயணங்கள்',
      completed: 'முடிந்தவை',
      rejected: 'நிராகரிக்கப்பட்டவை',
      recentPerformance: 'சமீபத்திய செயல்திறன்',
    }
  };

  useEffect(() => {
    audioRef.current.loop = true;
    
    // Auto-unlock audio on first user interaction
    const unlockAudio = () => {
      audioRef.current.play().then(() => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }).catch(() => {});
      window.removeEventListener('click', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);

    fetchLeads(true);
    fetchStats('week');
    const interval = setInterval(() => fetchLeads(false), 2000);
    return () => {
      clearInterval(interval);
      stopAlarm();
      window.removeEventListener('click', unlockAudio);
    };
  }, []);

  const fetchStats = async (range) => {
    setStatsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/trips/stats?range=${range}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error('Stats fetch failed', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchLeads = async (isInitial = false) => {
    try {
      const res = await axios.get(`${API_URL}/api/trips/marketplace`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = res.data || [];
      setLeads(data);

      if (isOnline && !isInitial) {
        checkForNewLeads(data);
      } else if (isInitial && data.length > 0) {
        lastLeadIdRef.current = data[0]._id;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkForNewLeads = (currentLeads) => {
    const availableLeads = currentLeads.filter(l => !l.accepted_driver_id);
    if (availableLeads.length > 0) {
      const latestLead = availableLeads[0];
      if (latestLead._id !== lastLeadIdRef.current) {
        console.log("New Lead Detected:", latestLead._id);
        lastLeadIdRef.current = latestLead._id;
        triggerAlert(latestLead);
      }
    }
  };

  const triggerAlert = (lead) => {
    console.log("Triggering Alarm for Lead:", lead._id);
    setNewLeadAlert(lead);
    
    // Explicitly try to play
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(e => {
      console.warn("Audio play blocked by browser. Please click on the page to enable sound.");
    });
    if (navigator.vibrate) {
      navigator.vibrate([500, 200, 500]);
    }
  };

  const stopAlarm = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const handleAcceptFromAlert = async () => {
    const leadId = newLeadAlert._id;
    stopAlarm();
    setNewLeadAlert(null);
    await acceptLead(leadId);
  };

  const handleDismissAlert = () => {
    stopAlarm();
    setNewLeadAlert(null);
  };

  const acceptLead = async (id) => {
    try {
      await axios.post(`${API_URL}/api/trips/${id}/accept`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchLeads(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept lead');
    }
  };

  const verifyOTP = async (id, type, otp) => {
    try {
      const endpoint = type === 'start' ? 'verify-start-otp' : 'verify-drop-otp';
      await axios.post(`${API_URL}/api/trips/${id}/${endpoint}`, { otp }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchLeads(true);
      alert(`${type === 'start' ? 'Trip Started!' : 'Trip Completed!'}`);
    } catch (err) {
      alert('Invalid OTP. Please check with the customer.');
    }
  };

  const filteredLeads = leads.filter(l => {
    if (activeTab === 'marketplace') {
      return !l.accepted_driver_id || (l.accepted_driver_id === user.id && l.status !== 'PAID');
    }
    return l.accepted_driver_id === user.id && l.status === 'PAID';
  });

  const totalOrdersCount = leads.filter(l => l.accepted_driver_id === user.id).length;

  const SidebarContent = () => (
    <div className="space-y-2">
      <button onClick={() => { setActiveTab('marketplace'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'marketplace' ? 'bg-[#0B1E3F] text-white shadow-xl shadow-blue-900/10' : 'text-slate-400 hover:bg-white'}`}><Zap className="w-4 h-4" /> {t[lang].marketplace}</button>
      <button onClick={() => { setActiveTab('history'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-[#0B1E3F] text-white shadow-xl shadow-blue-900/10' : 'text-slate-400 hover:bg-white'}`}><Clock className="w-4 h-4" /> {t[lang].history}</button>
      <div className="pt-4 mt-4 border-t border-slate-100">
        <Link 
          to="/"
          className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-[#0B1E3F] transition-all"
        >
          <Home className="w-4 h-4" /> {t[lang].landing}
        </Link>
      </div>
      <div className="pt-4 mt-4 border-t border-slate-100">
         <button onClick={() => { setActiveTab('performance'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'performance' ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/10' : 'text-slate-400 hover:bg-white'}`}><TrendingUp className="w-4 h-4" /> {t[lang].performance}</button>
      </div>
      <div className="sm:hidden px-4 py-2">
        <LanguageSwitcher />
      </div>
    </div>
  );

  const renderLeadActions = (lead) => {
    if (!lead?.accepted_driver_id) {
      return (
        <button 
          onClick={() => acceptLead(lead?._id)} 
          className="w-full py-4 bg-[#22C55E] hover:bg-green-600 text-white rounded-xl lg:rounded-2xl font-bold uppercase tracking-widest text-[10px] lg:text-xs shadow-lg shadow-green-500/20 active:scale-[0.98] transition-all"
        >
          {t[lang].claimBtn}
        </button>
      );
    }

    if (lead?.accepted_driver_id === user?.id) {
      if (lead?.details_unlocked) {
        return (
          <div className="p-4 bg-green-50 border border-green-100 rounded-xl lg:rounded-2xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-[10px] text-green-700 font-bold uppercase tracking-widest">{t[lang].activated}</p>
          </div>
        );
      } else {
        return (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl lg:rounded-2xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-[#EF4444] flex-shrink-0" />
            <div>
              <p className="text-[9px] font-bold text-[#EF4444] uppercase tracking-widest">{t[lang].locked} • ₹{lead?.lead_fee || 0} Fee</p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-tight font-medium">{t[lang].contactAdmin}: <span className="font-bold text-[#0B1E3F]">+91 9342042401</span></p>
            </div>
          </div>
        );
      }
    }

    return (
      <div className="p-4 bg-slate-100 border border-slate-200 rounded-xl lg:rounded-2xl flex items-center gap-3 opacity-60">
        <User className="w-5 h-5 text-slate-400 flex-shrink-0" />
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t[lang].claimedByOther}</p>
      </div>
    );
  };

  const renderOtpSection = (lead) => {
    if (lead.status === 'PAID' || lead.status === 'START_OTP_SENT') {
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{t[lang].verifyStart}</span>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              id={`otp-start-${lead._id}`}
              placeholder="4-Digit Code"
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-100 outline-none"
              maxLength={4}
            />
            <button 
              onClick={() => verifyOTP(lead._id, 'start', document.getElementById(`otp-start-${lead._id}`).value)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20"
            >
              {t[lang].startBtn}
            </button>
          </div>
        </div>
      );
    }

    if (lead.status === 'STARTED') {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-green-50 p-3 rounded-xl border border-green-100">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-bold text-green-700 uppercase tracking-widest">{t[lang].trackingLive}</span>
            </div>
            <MapIcon className="w-3.5 h-3.5 text-green-600" />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t[lang].verifyDrop}</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                id={`otp-drop-${lead._id}`}
                placeholder="4-Digit Code"
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-100 outline-none"
                maxLength={4}
              />
              <button 
                onClick={() => verifyOTP(lead._id, 'drop', document.getElementById(`otp-drop-${lead._id}`).value)}
                className="bg-[#0B1E3F] hover:bg-[#1a2e4f] text-white px-6 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
              >
                {t[lang].finishBtn}
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (lead.status === 'COMPLETED') {
      return (
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
          <CheckCircle className="w-4 h-4 text-slate-400" />
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t[lang].missionCompleted}</p>
        </div>
      );
    }

    return null;
  };

  const toggleOnline = () => {
    if (user?.kyc_status !== 'verified') {
      return alert(lang === 'EN' ? 'KYC Verification Pending. Please contact admin.' : 'KYC சரிபார்ப்பு நிலுவையில் உள்ளது. நிர்வாகியை அணுகவும்.');
    }
    setIsOnline(!isOnline);
  };

  if (user?.kyc_status !== 'verified') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-['Poppins']">
        <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-40 text-[#0B1E3F]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0B1E3F] rounded-xl flex items-center justify-center"><Car className="w-6 h-6 text-white" /></div>
            <h1 className="text-sm font-bold uppercase tracking-tight leading-none">VandiGo</h1>
          </div>
          <div className="flex items-center gap-4">
             <LanguageSwitcher variant="pill" />
             <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500 transition-all"><LogOut className="w-5 h-5" /></button>
          </div>
        </nav>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-[500px] w-full bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl shadow-blue-900/5 text-center">
            <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <ShieldCheck className="w-10 h-10 text-amber-600 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-[#0B1E3F] mb-3">{t[lang].kycTitle}</h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
              {t[lang].kycDesc}
            </p>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t[lang].kycContact}</p>
               <p className="text-sm font-bold text-[#0B1E3F]">+91 93420 42401</p>
            </div>
            <button onClick={logout} className="w-full py-4 border border-slate-100 text-slate-400 hover:bg-slate-50 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all">
               {t[lang].logout || 'Sign Out'}
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0B1E3F] font-['Poppins']">
      <AnimatePresence>
        {newLeadAlert && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0B1E3F]/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-[400px] rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-blue-600 animate-pulse" />
               <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
                     <BellRing className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-black mb-2">{t[lang].newBooking} 🚖</h3>
                  <p className="text-slate-400 text-sm font-medium mb-8">{t[lang].newSub}</p>
                  
                  <div className="w-full bg-slate-50 rounded-3xl p-6 mb-8 space-y-4 text-left">
                     <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-blue-600 mt-1" />
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t[lang].mission} ({newLeadAlert.distance_km} KM)</p>
                           <p className="text-sm font-bold">{newLeadAlert.pickupLocation} → {newLeadAlert.dropLocation}</p>
                        </div>
                     </div>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <Car className="w-4 h-4 text-slate-400" />
                           <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{newLeadAlert.carType}</span>
                        </div>
                        <div className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-black">
                           ₹{newLeadAlert.estimated_fare?.toLocaleString()}
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-col gap-3 w-full">
                     <button onClick={handleAcceptFromAlert} className="w-full py-5 bg-[#22C55E] text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-green-500/20 active:scale-[0.98]">{t[lang].accept}</button>
                     <button onClick={handleDismissAlert} className="w-full py-4 text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:text-slate-600">{t[lang].dismiss}</button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-400"><Menu className="w-6 h-6" /></button>
          <div className="w-10 h-10 bg-[#0B1E3F] rounded-xl flex items-center justify-center"><Car className="w-6 h-6 text-white" /></div>
          <div className="hidden xs:block">
            <h1 className="text-sm font-bold uppercase tracking-tight leading-none">VandiGo</h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Operative</p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <div className="hidden sm:block scale-90">
            <LanguageSwitcher />
          </div>
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
            <span className="text-[9px] font-bold uppercase tracking-widest hidden sm:inline">{isOnline ? t[lang].online : t[lang].offline}</span>
            <button onClick={toggleOnline} className={`w-7 h-3.5 rounded-full relative transition-all ${isOnline ? 'bg-green-100' : 'bg-slate-200'}`}><div className={`absolute top-0.5 w-2.5 h-2.5 rounded-full transition-all ${isOnline ? 'right-0.5 bg-green-500' : 'left-0.5 bg-slate-400'}`} /></button>
          </div>
          <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500 transition-all"><LogOut className="w-5 h-5" /></button>
        </div>
      </nav>

      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsSidebarOpen(false)} 
              className="fixed inset-0 backdrop-blur-sm z-[100] lg:hidden"
              style={{ backgroundColor: 'rgba(11, 30, 63, 0.4)' }}
            />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="fixed left-0 top-0 bottom-0 w-[280px] bg-white z-[101] p-8 lg:hidden">
              <div className="flex justify-between items-center mb-10"><span className="text-xl font-bold">VandiGo</span><button onClick={() => setIsSidebarOpen(false)}><X /></button></div>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="max-w-[1400px] mx-auto px-6 py-6 lg:py-10 flex flex-col lg:flex-row gap-6 lg:gap-10">
        <div className="hidden lg:block w-64 flex-shrink-0"><SidebarContent /></div>
        <div className="flex-1">
          {user?.kyc_status !== 'verified' && (
            <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-[32px] flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-amber-900 uppercase tracking-widest">KYC Pending Verification</h4>
                <p className="text-xs text-amber-700 mt-1 font-medium">Your operative profile is currently under review by the central command. You will be notified once your credentials are verified and you can start accepting leads.</p>
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 lg:mb-10">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold">
                {activeTab === 'marketplace' ? <>{t[lang].available} <span className="text-blue-600">{t[lang].leads}</span></> : 
                 activeTab === 'history' ? <>{t[lang].mission} <span className="text-blue-600">{t[lang].historyTitle}</span></> :
                 <>{t[lang].performance} <span className="text-blue-600">Overview</span></>}
              </h2>
              <p className="text-slate-400 text-xs lg:text-sm mt-1">
                {activeTab === 'marketplace' ? t[lang].claimHigh : 
                 activeTab === 'history' ? t[lang].trackSecured :
                 t[lang].recentPerformance}
              </p>
            </div>
            {activeTab === 'performance' && (
              <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
                 {['today', 'week', 'month'].map((r) => (
                   <button 
                    key={r}
                    onClick={() => { setStatsRange(r); fetchStats(r); }}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statsRange === r ? 'bg-[#0B1E3F] text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                     {t[lang][r]}
                   </button>
                 ))}
              </div>
            )}
            <div className="text-left sm:text-right bg-white p-3 rounded-2xl border border-slate-100 sm:border-none sm:bg-transparent">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t[lang].loggedInAs}</p>
              <p className="text-xs lg:text-sm font-bold truncate max-w-[150px]">{user?.name}</p>
            </div>
          </div>

          {/* Driver Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5">
               <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-blue-600" />
               </div>
               <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t[lang].totalMissions}</p>
                  <p className="text-2xl font-black text-[#0B1E3F]">{totalOrdersCount}</p>
               </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 lg:py-40"><div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4" /><p className="text-slate-400 text-xs font-bold uppercase tracking-widest animate-pulse">{t[lang].syncing}</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 lg:gap-8">
              {filteredLeads.length === 0 ? (
                <div className="col-span-full py-16 lg:py-20 bg-white border border-dashed border-slate-200 rounded-[32px] text-center"><Zap className="w-10 h-10 lg:w-12 lg:h-12 text-slate-200 mx-auto mb-4" /><p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] lg:text-xs px-6">{activeTab === 'marketplace' ? t[lang].noMissions : t[lang].noClaimed}</p></div>
              ) : (
                filteredLeads.map((lead) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    key={lead?._id} 
                    className={`bg-white border rounded-[28px] lg:rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 relative ${
                      lead.accepted_driver_id === user.id ? 'border-blue-200 ring-4 ring-blue-50/50' : 'border-slate-100'
                    }`}
                  >
                    <div className="px-6 lg:px-8 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${lead.status === 'PAID' ? 'bg-[#22C55E]' : lead.status === 'ACCEPTED' ? 'bg-orange-400' : 'bg-blue-500'}`} />
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${lead.status === 'PAID' ? 'text-green-600' : lead.status === 'ACCEPTED' ? 'text-orange-600' : 'text-blue-600'}`}>{lead.status === 'PAID' ? t[lang].unlocked : lead.status === 'ACCEPTED' ? t[lang].pending : t[lang].newLead}</span>
                      </div>
                      <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">SEC #{lead?._id?.slice(-4)}</p>
                    </div>
                    <div className="p-6 lg:p-8 space-y-5 lg:space-y-6">
                      <div className="flex items-start gap-4"><div className="w-7 h-7 lg:w-8 lg:h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0"><MapPin className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-blue-600" /></div><div className="min-w-0"><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t[lang].pickup}</p><p className="text-base lg:text-lg font-bold truncate">{lead?.pickupLocation}</p></div></div>
                      <div className="flex items-start gap-4"><div className="w-7 h-7 lg:w-8 lg:h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0"><MapPin className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-green-600" /></div><div className="min-w-0"><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t[lang].drop}</p><p className="text-base lg:text-lg font-bold truncate">{lead?.dropLocation}</p></div></div>
                    </div>
                    <div className="px-6 lg:px-8 pb-6 lg:pb-8 grid grid-cols-2 gap-3 lg:gap-4">
                      <div className="bg-slate-50 p-3 lg:p-4 rounded-xl lg:rounded-2xl flex flex-col gap-1">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t[lang].estFare}</p>
                        <div className="flex items-center gap-2">
                          <IndianRupee className="w-3.5 h-3.5 text-blue-600" />
                          <p className="text-sm lg:text-base font-black text-[#0B1E3F]">₹{lead?.estimated_fare?.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-3 lg:p-4 rounded-xl lg:rounded-2xl flex flex-col gap-1">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t[lang].distance}</p>
                        <div className="flex items-center gap-2">
                          <Navigation className="w-3.5 h-3.5 text-slate-400" />
                          <p className="text-sm lg:text-base font-black text-slate-600 uppercase truncate">{lead?.distance_km} KM</p>
                        </div>
                      </div>
                    </div>
                    <div className="px-6 lg:px-8 pb-6 lg:pb-8 grid grid-cols-2 gap-3 lg:gap-4">
                      <div className="bg-slate-50 p-3 lg:p-4 rounded-xl lg:rounded-2xl flex items-center gap-3"><Calendar className="w-3.5 h-3.5 text-slate-400" /><p className="text-[10px] lg:text-xs font-bold text-slate-600 truncate">{lead?.bookingDateTime?.split(' ')[0]}</p></div>
                      <div className="bg-slate-50 p-3 lg:p-4 rounded-xl lg:rounded-2xl flex items-center gap-3"><Car className="w-3.5 h-3.5 text-slate-400" /><p className="text-[10px] lg:text-xs font-bold text-slate-600 uppercase truncate">{lead?.carType}</p></div>
                    </div>
                    <div className="px-6 lg:px-8 py-6 lg:py-8 bg-slate-50/50 border-t border-slate-100 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 lg:gap-4">
                          <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center border ${
                            lead?.details_unlocked ? 'bg-green-100 border-green-200 text-green-600' : 'bg-white border-slate-100 text-slate-300'
                          }`}>
                            {lead?.details_unlocked ? <Unlock className="w-5 h-5 lg:w-6 lg:h-6" /> : <Lock className="w-5 h-5 lg:w-6 lg:h-6" />}
                          </div>
                          <div className="min-w-0">
                            <p className={`text-xs lg:text-sm font-bold truncate max-w-[120px] ${
                              lead?.details_unlocked ? 'text-[#0B1E3F]' : 'text-slate-400 select-none'
                            }`}>
                              {lead?.customerName || t[lang].anonymous}
                            </p>
                            <p className={`text-[10px] lg:text-xs font-bold mt-0.5 truncate ${
                              lead?.details_unlocked ? 'text-blue-600' : 'text-slate-300 select-none'
                            }`}>
                              {lead?.customerPhone || '••••••••••'}
                            </p>
                          </div>
                        </div>
                        {(lead?.status === 'PAID' || lead?.status === 'START_OTP_SENT' || lead?.status === 'STARTED') && (
                          <a href={`tel:${lead?.customerPhone}`} className="w-10 h-10 lg:w-12 lg:h-12 bg-[#22C55E] hover:bg-green-600 text-white rounded-xl lg:rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-green-500/20">
                            <PhoneCall className="w-4 h-4 lg:w-5 lg:h-5" />
                          </a>
                        )}
                      </div>
                      {lead?.accepted_driver_id === user?.id && lead?.details_unlocked && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          {renderOtpSection(lead)}
                        </div>
                      )}
                      
                      <div className="mt-4">
                        {renderLeadActions(lead)}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DriverDashboard;
