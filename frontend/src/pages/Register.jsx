import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, User, ChevronRight, Eye, EyeOff, 
  Mail, BadgeCheck, AlertCircle, Car, 
  CreditCard, FileText, Upload, Camera, ChevronLeft
} from 'lucide-react';

const Register = () => {
  const { lang } = useLanguage();
  
  const t = {
    EN: {
      join: 'JOIN THE',
      fleet: 'FLEET',
      sub: 'Field Operative Onboarding Portal',
      title: 'Registration',
      sub2: 'Initialize your operative identity',
      name: 'Legal Name',
      namePlaceholder: 'Enter full name',
      email: 'Gmail Authentication',
      emailPlaceholder: 'name@gmail.com',
      password: 'Security Key',
      passwordPlaceholder: 'Create secure key',
      submit: 'Next Phase',
      already: 'Already an operative?',
      signIn: 'Sign In',
      official: 'Official Vandi Go Registry',
      step: 'PHASE',
      vehicleType: 'Vehicle Class',
      vehicleNumber: 'Plate Number',
      licenseNumber: 'DL Number',
      aadhaarNumber: 'Aadhaar (12-Digit)',
      docs: 'Documentation',
      aadhaarFront: 'Aadhaar Front',
      aadhaarBack: 'Aadhaar Back',
      driverPhoto: 'Field Photo',
      upload: 'Upload Image',
      finish: 'Complete Enrollment',
      back: 'Previous Phase',
      aadhaarPlaceholder: 'XXXX XXXX XXXX'
    },
    TA: {
      join: 'வாகனக் கூட்டத்தில்',
      fleet: 'இணையுங்கள்',
      sub: 'டிரைவர் சேர்க்கை தளம்',
      title: 'பதிவு',
      sub2: 'உங்கள் கணக்கை உருவாக்கவும்',
      name: 'முழு பெயர்',
      namePlaceholder: 'முழு பெயரை உள்ளிடவும்',
      email: 'மின்னஞ்சல் முகவரி',
      emailPlaceholder: 'பெயர்@gmail.com',
      password: 'ரகசிய குறியீடு',
      passwordPlaceholder: 'ரகசிய குறியீட்டை உருவாக்கவும்',
      submit: 'அடுத்த கட்டம்',
      already: 'ஏற்கனவே கணக்கு உள்ளதா?',
      signIn: 'உள்நுழைக',
      official: 'அதிகாரப்பூர்வ வண்டி கோ பதிவு',
      step: 'நிலை',
      vehicleType: 'வாகன வகை',
      vehicleNumber: 'வண்டி எண்',
      licenseNumber: 'ஓட்டுநர் உரிம எண்',
      aadhaarNumber: 'ஆதார் எண் (12-இலக்கம்)',
      docs: 'ஆவணங்கள்',
      aadhaarFront: 'ஆதார் முன் பக்கம்',
      aadhaarBack: 'ஆதார் பின் பக்கம்',
      driverPhoto: 'புகைப்படம்',
      upload: 'பதிவேற்றவும்',
      finish: 'பதிவை முடிக்கவும்',
      back: 'முந்தைய கட்டம்',
      aadhaarPlaceholder: 'XXXX XXXX XXXX'
    }
  };

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    vehicleType: '',
    vehicleNumber: '',
    licenseNumber: '',
    aadhaarNumber: '',
    aadhaarFront: null,
    aadhaarBack: null,
    driverPhoto: null
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, [field]: file });
    }
  };

  const nextStep = () => {
    if (step === 1 && (!formData.name || !formData.email || !formData.password)) {
      return setError('Please fill all account details');
    }
    if (step === 2 && (!formData.vehicleType || !formData.vehicleNumber || !formData.aadhaarNumber)) {
      return setError('Please fill all identity details');
    }
    setError('');
    setStep(step + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) return nextStep();
    
    setError('');
    setLoading(true);
    
    // In a real app with Supabase, we would upload files first
    // For now, we simulate with the existing register function
    const result = await register(formData.name, formData.email, formData.password, 'driver', {
      vehicleType: formData.vehicleType,
      vehicleNumber: formData.vehicleNumber,
      licenseNumber: formData.licenseNumber,
      aadhaarNumber: formData.aadhaarNumber,
      kyc_status: 'pending'
    });

    setLoading(false);
    if (result.success) {
      navigate('/driver');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-sans relative overflow-hidden selection:bg-blue-500/30">
      {/* Background Mesh Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[520px] relative z-10"
      >
        {/* Language Switcher */}
        <div className="flex justify-center mb-8">
          <LanguageSwitcher variant="pill" />
        </div>

        {/* Branding */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="inline-block p-4 bg-white rounded-3xl shadow-2xl mb-6 relative group"
          >
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl group-hover:bg-emerald-500/40 transition-all rounded-3xl" />
            <div className="w-12 h-12 flex items-center justify-center bg-[#0B1E3F] rounded-2xl relative z-10">
              <Car className="w-7 h-7 text-white" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
            {t[lang].join} <span className="text-blue-500">{t[lang].fleet}</span>
          </h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-3">
            {t[lang].sub}
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[48px] p-10 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
           
           <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">{t[lang].title}</h2>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{t[lang].step} 0{step} / 03</p>
              </div>
              <div className="flex gap-1.5">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`w-8 h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-slate-800'}`} />
                ))}
              </div>
           </div>

           <AnimatePresence mode="wait">
             {error && (
               <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs font-bold"
               >
                 <AlertCircle className="w-4 h-4" />
                 {error}
               </motion.div>
             )}
           </AnimatePresence>

           <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2.5">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t[lang].name}</label>
                       <div className="relative group">
                          <div className="absolute inset-y-0 left-6 flex items-center text-slate-600 group-focus-within:text-blue-500 transition-colors"><User className="w-5 h-5" /></div>
                          <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder={t[lang].namePlaceholder} className="w-full bg-slate-950/50 border border-white/5 rounded-3xl py-4.5 pl-16 pr-6 text-white placeholder:text-slate-800 focus:outline-none focus:border-blue-500/50 transition-all font-bold" required />
                       </div>
                    </div>
                    <div className="space-y-2.5">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t[lang].email}</label>
                       <div className="relative group">
                          <div className="absolute inset-y-0 left-6 flex items-center text-slate-600 group-focus-within:text-blue-500 transition-colors"><Mail className="w-5 h-5" /></div>
                          <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder={t[lang].emailPlaceholder} className="w-full bg-slate-950/50 border border-white/5 rounded-3xl py-4.5 pl-16 pr-6 text-white placeholder:text-slate-800 focus:outline-none focus:border-blue-500/50 transition-all font-bold" required />
                       </div>
                    </div>
                    <div className="space-y-2.5">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t[lang].password}</label>
                       <div className="relative group">
                          <div className="absolute inset-y-0 left-6 flex items-center text-slate-600 group-focus-within:text-blue-500 transition-colors"><Lock className="w-5 h-5" /></div>
                          <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder={t[lang].passwordPlaceholder} className="w-full bg-slate-950/50 border border-white/5 rounded-3xl py-4.5 pl-16 pr-14 text-white placeholder:text-slate-800 focus:outline-none focus:border-blue-500/50 transition-all font-bold" required />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-6 flex items-center text-slate-700 hover:text-slate-400">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                       </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2.5">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t[lang].vehicleType}</label>
                       <div className="relative group">
                          <div className="absolute inset-y-0 left-6 flex items-center text-slate-600 group-focus-within:text-blue-500 transition-colors"><Car className="w-5 h-5" /></div>
                          <select value={formData.vehicleType} onChange={(e) => setFormData({...formData, vehicleType: e.target.value})} className="w-full bg-slate-950/50 border border-white/5 rounded-3xl py-4.5 pl-16 pr-6 text-white appearance-none focus:outline-none focus:border-blue-500/50 transition-all font-bold" required>
                            <option value="" className="bg-slate-900 text-slate-500">Select Class</option>
                            <option value="Mini" className="bg-slate-900">Mini (Hatchback)</option>
                            <option value="Sedan" className="bg-slate-900">Sedan (Executive)</option>
                            <option value="SUV" className="bg-slate-900">SUV (6+ Seater)</option>
                          </select>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2.5">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t[lang].vehicleNumber}</label>
                         <input type="text" value={formData.vehicleNumber} onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})} placeholder="TN 01 AB 1234" className="w-full bg-slate-950/50 border border-white/5 rounded-3xl py-4.5 px-6 text-white placeholder:text-slate-800 focus:outline-none focus:border-blue-500/50 transition-all font-bold" required />
                      </div>
                      <div className="space-y-2.5">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t[lang].licenseNumber}</label>
                         <input type="text" value={formData.licenseNumber} onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})} placeholder="DL-12345678" className="w-full bg-slate-950/50 border border-white/5 rounded-3xl py-4.5 px-6 text-white placeholder:text-slate-800 focus:outline-none focus:border-blue-500/50 transition-all font-bold" required />
                      </div>
                    </div>
                    <div className="space-y-2.5">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t[lang].aadhaarNumber}</label>
                       <div className="relative group">
                          <div className="absolute inset-y-0 left-6 flex items-center text-slate-600 group-focus-within:text-blue-500 transition-colors"><CreditCard className="w-5 h-5" /></div>
                          <input type="text" maxLength={12} value={formData.aadhaarNumber} onChange={(e) => setFormData({...formData, aadhaarNumber: e.target.value.replace(/\D/g, '')})} placeholder={t[lang].aadhaarPlaceholder} className="w-full bg-slate-950/50 border border-white/5 rounded-3xl py-4.5 pl-16 pr-6 text-white placeholder:text-slate-800 focus:outline-none focus:border-blue-500/50 transition-all font-bold tracking-[0.2em]" required />
                       </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">{t[lang].aadhaarFront}</label>
                        <label className="relative flex flex-col items-center justify-center h-28 bg-slate-950/50 border border-dashed border-white/10 rounded-[24px] cursor-pointer hover:border-blue-500/50 group transition-all overflow-hidden">
                          {formData.aadhaarFront ? (
                            <img src={URL.createObjectURL(formData.aadhaarFront)} className="w-full h-full object-cover" />
                          ) : (
                            <>
                              <Upload className="w-6 h-6 text-slate-700 group-hover:text-blue-500 transition-colors" />
                              <span className="text-[8px] font-bold text-slate-600 mt-2 uppercase">{t[lang].upload}</span>
                            </>
                          )}
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'aadhaarFront')} />
                        </label>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">{t[lang].aadhaarBack}</label>
                        <label className="relative flex flex-col items-center justify-center h-28 bg-slate-950/50 border border-dashed border-white/10 rounded-[24px] cursor-pointer hover:border-blue-500/50 group transition-all overflow-hidden">
                          {formData.aadhaarBack ? (
                            <img src={URL.createObjectURL(formData.aadhaarBack)} className="w-full h-full object-cover" />
                          ) : (
                            <>
                              <Upload className="w-6 h-6 text-slate-700 group-hover:text-blue-500 transition-colors" />
                              <span className="text-[8px] font-bold text-slate-600 mt-2 uppercase">{t[lang].upload}</span>
                            </>
                          )}
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'aadhaarBack')} />
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">{t[lang].driverPhoto}</label>
                      <label className="relative flex flex-col items-center justify-center h-40 bg-slate-950/50 border border-dashed border-white/10 rounded-[32px] cursor-pointer hover:border-emerald-500/50 group transition-all overflow-hidden">
                        {formData.driverPhoto ? (
                          <img src={URL.createObjectURL(formData.driverPhoto)} className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mb-3 group-hover:bg-emerald-500/10 transition-colors">
                              <Camera className="w-6 h-6 text-slate-700 group-hover:text-emerald-500 transition-colors" />
                            </div>
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{t[lang].upload}</span>
                          </>
                        )}
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'driverPhoto')} />
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-4 pt-4">
                {step > 1 && (
                  <button 
                    type="button"
                    onClick={prevStep}
                    className="flex-1 bg-slate-950/50 border border-white/5 text-white py-5 rounded-[28px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 hover:bg-slate-900"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    {t[lang].back}
                  </button>
                )}
                <button 
                  type="submit"
                  disabled={loading}
                  className={`flex-[2] bg-white text-black py-5 rounded-[28px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95 hover:bg-zinc-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Processing...' : step === 3 ? t[lang].finish : t[lang].submit}
                  {step < 3 && <ChevronRight className="w-5 h-5" />}
                </button>
              </div>
           </form>

           <div className="mt-10 text-center">
              <p className="text-xs text-slate-600 font-bold">
                 {t[lang].already} 
                 <Link to="/login" className="text-blue-500 hover:text-blue-400 ml-2 border-b border-blue-500/30">
                    {t[lang].signIn}
                 </Link>
              </p>
           </div>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-3 text-slate-700">
           <BadgeCheck className="w-5 h-5 text-emerald-500/40" />
           <span className="text-[10px] font-black uppercase tracking-[0.4em]">{t[lang].official}</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
