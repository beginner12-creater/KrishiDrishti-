import React, { createContext, useContext, useState, useEffect } from 'react';
import hiLocale from '../locales/hi.json';
import mrLocale from '../locales/mr.json';
import enLocale from '../locales/en.json';

export const TRANSLATIONS = {
  en: enLocale,
  hi: hiLocale,
  mr: mrLocale
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('krishidrishti_lang');
      if (saved && (saved === 'en' || saved === 'hi' || saved === 'mr')) {
        return saved;
      }
    } catch (e) {
      console.warn('Unable to access localStorage for language:', e);
    }
    return 'hi';
  });

  const setLanguage = (newLang) => {
    if (newLang === 'en' || newLang === 'hi' || newLang === 'mr') {
      setLanguageState(newLang);
      try {
        localStorage.setItem('krishidrishti_lang', newLang);
      } catch (e) {
        console.warn('Unable to save language to localStorage:', e);
      }
    }
  };

  const t = (key) => {
    const currentDict = TRANSLATIONS[language] || TRANSLATIONS['hi'];
    if (currentDict && currentDict[key]) return currentDict[key];
    if (TRANSLATIONS['en'] && TRANSLATIONS['en'][key]) return TRANSLATIONS['en'][key];
    if (TRANSLATIONS['hi'] && TRANSLATIONS['hi'][key]) return TRANSLATIONS['hi'][key];
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, TRANSLATIONS }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
