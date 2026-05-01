import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Languages } from 'lucide-react';

const LanguageSwitcher = ({ variant = 'default' }) => {
  const { lang, setLang } = useLanguage();

  if (variant === 'pill') {
    return (
      <div className="inline-flex p-1 bg-white border border-slate-100 rounded-2xl shadow-sm">
        <button 
          onClick={() => setLang('EN')}
          className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${lang === 'EN' ? 'bg-[#0B1E3F] text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
        >
          English
        </button>
        <button 
          onClick={() => setLang('TA')}
          className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${lang === 'TA' ? 'bg-[#0B1E3F] text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
        >
          தமிழ்
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => setLang(lang === 'EN' ? 'TA' : 'EN')}
      className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-slate-100 hover:bg-white transition-all group"
    >
      <Languages className="w-4 h-4 text-blue-600" />
      <span className="text-[10px] font-black tracking-widest uppercase text-[#0B1E3F]">
        {lang === 'EN' ? 'தமிழ்' : 'English'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
