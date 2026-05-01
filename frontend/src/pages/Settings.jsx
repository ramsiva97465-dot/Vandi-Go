import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Building2, IndianRupee, Bell, Shield, 
  Map, MessageSquare, Palette, Save, 
  Lock, Check, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const InputField = ({ label, value, onChange, type = 'text', placeholder }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input 
      type={type}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-semibold text-[#0B1E3F] focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
    />
  </div>
);

const ToggleField = ({ label, value, onChange, desc }) => (
  <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[28px] border border-slate-100">
    <div>
      <p className="text-sm font-bold text-[#0B1E3F]">{label}</p>
      <p className="text-[10px] font-medium text-slate-400 mt-0.5">{desc}</p>
    </div>
    <button 
      onClick={() => onChange(!value)}
      className={`w-12 h-6 rounded-full transition-all relative ${value ? 'bg-blue-600' : 'bg-slate-200'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${value ? 'left-7' : 'left-1'}`} />
    </button>
  </div>
);

const Settings = () => {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('business');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);

  const [settings, setSettings] = useState({
    business: {
      name: 'Vandi Go',
      supportPhone: '+91 98765 43210',
      supportEmail: 'support@vandigo.com',
      address: 'Chennai, Tamil Nadu, India'
    },
    pricing: {
      defaultLeadFee: 100,
      perKmLeadFee: true,
      commissionType: 'flat'
    },
    otp: {
      enableStartOtp: true,
      enableDropOtp: true,
      otpLength: 4,
      otpExpiry: 300
    },
    tracking: {
      enableLiveTracking: true,
      updateInterval: 10,
      offlineAlert: true
    },
    notifications: {
      driverAlarm: true,
      adminAlerts: true,
      smsToggle: false
    },
    payment: {
      upiId: 'vandigo@upi',
      phone: '9876543210',
      manualVerify: true
    },
    security: {
      hideDetailsBeforePayment: true,
      forceOtpRules: true
    },
    branding: {
      appName: 'Vandi Go',
      themeColor: '#3B82F6',
      logoUrl: ''
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/settings`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.data && Object.keys(res.data).length > 0) {
        setSettings(prev => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setFetching(false);
    }
  };

  const t = {
    EN: {
      settings: 'System Configuration',
      sub: 'Manage platform parameters and global rules.',
      save: 'Save Changes',
      business: 'Business',
      pricing: 'Pricing',
      otp: 'OTP Rules',
      tracking: 'Tracking',
      notifications: 'Alerts',
      payment: 'Payment',
      security: 'Security',
      branding: 'Branding',
      saved: 'Settings synchronized successfully'
    },
    TA: {
      settings: 'சிஸ்டம் கட்டமைப்பு',
      sub: 'தள அளவுருக்கள் மற்றும் உலகளாவிய விதிகளை நிர்வகிக்கவும்.',
      save: 'மாற்றங்களைச் சேமி',
      business: 'வணிகம்',
      pricing: 'விலை',
      otp: 'OTP விதிகள்',
      tracking: 'கண்காணிப்பு',
      notifications: 'எச்சரிக்கைகள்',
      payment: 'கட்டணம்',
      security: 'பாதுகாப்பு',
      branding: 'பிராண்டிங்',
      saved: 'அமைப்புகள் வெற்றிகரமாக ஒத்திசைக்கப்பட்டன'
    }
  };

  const tabs = [
    { id: 'business', icon: Building2, label: t[lang].business },
    { id: 'pricing', icon: IndianRupee, label: t[lang].pricing },
    { id: 'otp', icon: Lock, label: t[lang].otp },
    { id: 'tracking', icon: Map, label: t[lang].tracking },
    { id: 'notifications', icon: Bell, label: t[lang].notifications },
    { id: 'payment', icon: IndianRupee, label: t[lang].payment },
    { id: 'security', icon: Shield, label: t[lang].security },
    { id: 'branding', icon: Palette, label: t[lang].branding },
  ];

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/settings`, settings, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save settings: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px]">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
         <div>
            <h1 className="text-3xl font-bold">{t[lang].settings.split(' ')[0]} <span className="text-blue-600">{t[lang].settings.split(' ')[1]}</span></h1>
            <p className="text-slate-400 text-sm mt-1">{t[lang].sub}</p>
         </div>
         <button 
          onClick={handleSave}
          disabled={loading}
          className="px-8 py-4 bg-[#0B1E3F] text-white rounded-2xl text-xs font-bold shadow-xl hover:bg-[#1a2e4f] flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50"
         >
           {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : success ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
           {loading ? 'Syncing...' : success ? 'Synced' : t[lang].save}
         </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-72 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-[#0B1E3F] hover:bg-white/50'}`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-300'}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 lg:p-12 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {activeTab === 'business' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InputField label="Company Name" value={settings.business.name} onChange={(v) => setSettings({...settings, business: {...settings.business, name: v}})} />
                  <InputField label="Support Phone" value={settings.business.supportPhone} onChange={(v) => setSettings({...settings, business: {...settings.business, supportPhone: v}})} />
                  <InputField label="Support Email" value={settings.business.supportEmail} onChange={(v) => setSettings({...settings, business: {...settings.business, supportEmail: v}})} />
                  <InputField label="Address" value={settings.business.address} onChange={(v) => setSettings({...settings, business: {...settings.business, address: v}})} />
                </div>
              )}

              {activeTab === 'pricing' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputField type="number" label="Default Lead Fee (₹)" value={settings.pricing.defaultLeadFee} onChange={(v) => setSettings({...settings, pricing: {...settings.pricing, defaultLeadFee: v}})} />
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Commission Type</label>
                      <select className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-semibold outline-none" value={settings.pricing.commissionType} onChange={(e) => setSettings({...settings, pricing: {...settings.pricing, commissionType: e.target.value}})}>
                        <option value="flat">Flat Amount (₹)</option>
                        <option value="percentage">Percentage (%)</option>
                      </select>
                    </div>
                  </div>
                  <ToggleField label="Enable Per KM Lead Fee" desc="Charge drivers based on the total trip distance." value={settings.pricing.perKmLeadFee} onChange={(v) => setSettings({...settings, pricing: {...settings.pricing, perKmLeadFee: v}})} />
                </div>
              )}

              {activeTab === 'otp' && (
                <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputField type="number" label="OTP Length" value={settings.otp.otpLength} onChange={(v) => setSettings({...settings, otp: {...settings.otp, otpLength: v}})} />
                    <InputField type="number" label="Expiry (Seconds)" value={settings.otp.otpExpiry} onChange={(v) => setSettings({...settings, otp: {...settings.otp, otpExpiry: v}})} />
                  </div>
                  <ToggleField label="Enable Start OTP" desc="Require driver to enter OTP to start the journey." value={settings.otp.enableStartOtp} onChange={(v) => setSettings({...settings, otp: {...settings.otp, enableStartOtp: v}})} />
                  <ToggleField label="Enable Drop OTP" desc="Require driver to enter OTP to complete the journey." value={settings.otp.enableDropOtp} onChange={(v) => setSettings({...settings, otp: {...settings.otp, enableDropOtp: v}})} />
                </div>
              )}

              {activeTab === 'tracking' && (
                <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputField type="number" label="Update Interval (Seconds)" value={settings.tracking.updateInterval} onChange={(v) => setSettings({...settings, tracking: {...settings.tracking, updateInterval: v}})} />
                  </div>
                  <ToggleField label="Live Tracking" desc="Enable real-time driver GPS monitoring during trips." value={settings.tracking.enableLiveTracking} onChange={(v) => setSettings({...settings, tracking: {...settings.tracking, enableLiveTracking: v}})} />
                  <ToggleField label="Offline Alerts" desc="Notify admin if a driver goes offline during an active trip." value={settings.tracking.offlineAlert} onChange={(v) => setSettings({...settings, tracking: {...settings.tracking, offlineAlert: v}})} />
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <ToggleField label="Driver Alarm Sound" desc="Play a loud alarm sound when a driver receives a new lead." value={settings.notifications.driverAlarm} onChange={(v) => setSettings({...settings, notifications: {...settings.notifications, driverAlarm: v}})} />
                  <ToggleField label="Admin Alerts" desc="Receive notifications for critical system events." value={settings.notifications.adminAlerts} onChange={(v) => setSettings({...settings, notifications: {...settings.notifications, adminAlerts: v}})} />
                  <ToggleField label="SMS Notifications" desc="Send automated SMS alerts to customers and drivers." value={settings.notifications.smsToggle} onChange={(v) => setSettings({...settings, notifications: {...settings.notifications, smsToggle: v}})} />
                </div>
              )}

              {activeTab === 'payment' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputField label="UPI ID" value={settings.payment.upiId} onChange={(v) => setSettings({...settings, payment: {...settings.payment, upiId: v}})} />
                    <InputField label="Contact Phone" value={settings.payment.phone} onChange={(v) => setSettings({...settings, payment: {...settings.payment, phone: v}})} />
                  </div>
                  <ToggleField label="Manual Verification" desc="Admins must manually approve lead payments." value={settings.payment.manualVerify} onChange={(v) => setSettings({...settings, payment: {...settings.payment, manualVerify: v}})} />
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <ToggleField label="Privacy Shield" desc="Hide customer phone numbers until lead payment is verified." value={settings.security.hideDetailsBeforePayment} onChange={(v) => setSettings({...settings, security: {...settings.security, hideDetailsBeforePayment: v}})} />
                  <ToggleField label="Enforce OTP Rules" desc="Trips cannot be started or ended without valid OTP entry." value={settings.security.forceOtpRules} onChange={(v) => setSettings({...settings, security: {...settings.security, forceOtpRules: v}})} />
                </div>
              )}

              {activeTab === 'branding' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InputField label="Application Name" value={settings.branding.appName} onChange={(v) => setSettings({...settings, branding: {...settings.branding, appName: v}})} />
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Theme Color</label>
                    <div className="flex gap-3">
                      <input type="color" className="w-12 h-14 bg-slate-50 border-none rounded-2xl p-1 cursor-pointer" value={settings.branding.themeColor} onChange={(e) => setSettings({...settings, branding: {...settings.branding, themeColor: e.target.value}})} />
                      <input type="text" className="flex-1 bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-semibold outline-none" value={settings.branding.themeColor} onChange={(e) => setSettings({...settings, branding: {...settings.branding, themeColor: e.target.value}})} />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {success && (
             <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-8 right-8 bg-emerald-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl"
             >
               <Check className="w-4 h-4" /> {t[lang].saved}
             </motion.div>
          )}
        </div>
      </div>

      <div className="mt-12 p-8 bg-blue-50/50 rounded-[32px] border border-blue-100/50 flex items-start gap-4">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm"><Info className="w-5 h-5 text-blue-600" /></div>
        <div>
          <h4 className="text-sm font-bold text-[#0B1E3F]">Global Enforcement</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-[800px]">Any changes made to these parameters will propagate across the entire operative network in real-time. Please ensure you have verified all changes before synchronizing.</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
