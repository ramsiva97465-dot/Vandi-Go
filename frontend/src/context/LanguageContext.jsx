import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('vandi_go_lang') || 'EN';
  });

  useEffect(() => {
    localStorage.setItem('vandi_go_lang', lang);
  }, [lang]);

  const toggleLang = () => {
    setLang(prev => (prev === 'EN' ? 'TA' : 'EN'));
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
