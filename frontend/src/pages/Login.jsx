import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, Mail, Eye, EyeOff, AlertCircle, Car, ArrowRight, ChevronLeft
} from 'lucide-react';

const Login = () => {
  const { lang } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const t = {
    EN: {
      back: 'Back to Site',
      portal: 'Drivers Portal',
      sub: 'Log in to manage leads and fleet.',
      email: 'Email Address',
      password: 'Password',
      keep: 'Keep me logged in',
      lost: 'Lost Password?',
      enter: 'Enter Portal',
      processing: 'Processing...',
      new: 'New to the platform?',
      join: 'Join the Fleet',
      emailPlaceholder: 'name@example.com'
    },
    TA: {
      back: 'தளத்திற்குத் திரும்பு',
      portal: 'டிரைவர் போர்டல்',
      sub: 'லீட்கள் மற்றும் வாகனங்களை நிர்வகிக்க உள்நுழையவும்.',
      email: 'மின்னஞ்சல் முகவரி',
      password: 'கடவுச்சொல்',
      keep: 'என்னை உள்நுழைந்தே வைத்திருக்கவும்',
      lost: 'கடவுச்சொல்லை மறந்துவிட்டீர்களா?',
      enter: 'உள்நுழையவும்',
      processing: 'செயலாக்கத்தில் உள்ளது...',
      new: 'தளத்திற்கு புதியவரா?',
      join: 'எங்களுடன் இணையுங்கள்',
      emailPlaceholder: 'பெயர்@எடுத்துக்காட்டு.com'
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) {
      navigate(result.role.toLowerCase() === 'admin' ? '/admin' : '/driver');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-6 bg-slate-50 font-['Poppins'] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-100/50 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="flex flex-col items-center mb-8 md:mb-10">
          <Link to="/" className="group flex items-center gap-2 text-slate-400 hover:text-[#0B1E3F] transition-all mb-6 md:mb-8 self-start md:self-center">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">{t[lang].back}</span>
          </Link>

          <Link to="/" className="inline-flex items-center gap-3 hover:opacity-80 transition-all mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-[#0B1E3F] rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/20">
              <Car className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-bold tracking-tight text-[#0B1E3F]">Vandi<span className="text-blue-600">Go</span></span>
          </Link>

          {/* Language Switcher Above the Card */}
          <div className="flex justify-center mb-2">
            <LanguageSwitcher variant="pill" />
          </div>
        </div>

        <div className="bg-white rounded-[32px] md:rounded-[40px] p-8 md:p-10 shadow-2xl shadow-blue-900/5 border border-slate-100 relative">
           <div className="mb-8 text-center md:text-left">
              <h1 className="text-xl md:text-2xl font-bold text-[#0B1E3F]">{t[lang].portal}</h1>
              <p className="text-xs md:text-sm text-slate-400 mt-2 font-medium">{t[lang].sub}</p>
           </div>

           <AnimatePresence>
             {error && (
               <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-[10px] md:text-xs font-bold"
               >
                 <AlertCircle className="w-4 h-4 flex-shrink-0" />
                 {error}
               </motion.div>
             )}
           </AnimatePresence>

           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 block">
                    {t[lang].email}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input
                      type="email"
                      required
                      className="block w-full pl-14 pr-5 py-4 bg-slate-50 border-none rounded-2xl text-[#0B1E3F] placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm font-semibold"
                      placeholder={t[lang].emailPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 block">
                    {t[lang].password}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="block w-full pl-14 pr-12 py-4 bg-slate-50 border-none rounded-2xl text-[#0B1E3F] placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm font-semibold"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                 <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-200 text-blue-600 focus:ring-blue-100 transition-all" />
                    <span className="text-[10px] md:text-xs font-semibold text-slate-400 group-hover:text-slate-600 transition-all">{t[lang].keep}</span>
                 </label>
                 <button type="button" className="text-[10px] md:text-xs font-bold text-blue-600 hover:text-blue-700">{t[lang].lost}</button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-4 md:py-5 px-4 bg-[#0B1E3F] hover:bg-[#1a2e4f] text-white text-xs md:text-sm font-bold rounded-2xl md:rounded-3xl shadow-xl shadow-blue-900/10 focus:outline-none transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? t[lang].processing : (
                  <span className="flex items-center gap-2 uppercase tracking-widest">
                    {t[lang].enter} <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
           </form>

           <div className="mt-8 pt-8 border-t border-slate-50 text-center">
              <p className="text-[10px] md:text-xs font-semibold text-slate-400">
                {t[lang].new} {' '}
                <Link to="/register" className="text-blue-600 font-bold hover:underline ml-1">{t[lang].join}</Link>
              </p>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
