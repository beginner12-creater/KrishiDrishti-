import React from 'react';
import { Sprout, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function WelcomeLanguageModal({ onSelectLanguage, isDarkMode = false }) {
  const { setLanguage, t } = useLanguage();

  const handleChoose = (lang) => {
    setLanguage(lang);
    if (onSelectLanguage) {
      onSelectLanguage(lang);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-md p-6 sm:p-8 rounded-3xl border-4 border-emerald-500 shadow-2xl text-center space-y-5 relative ${
        isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
      }`}>
        
        {/* Brand Icon */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center mx-auto shadow-lg animate-bounce">
          <Sprout className="w-9 h-9 text-white" />
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-black text-emerald-500 leading-tight">
            {t('welcomeTitle')}
          </h2>
          <p className="text-xs font-black text-slate-400 mt-1">
            {t('welcomeSub')}
          </p>
        </div>

        {/* 3 GIANT LANGUAGE BUTTONS: ENGLISH, HINDI, MARATHI */}
        <div className="space-y-3 pt-2">
          
          {/* Button 1: English */}
          <button
            onClick={() => handleChoose('en')}
            className="w-full min-h-[54px] p-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-base sm:text-lg flex items-center justify-between shadow-xl active:scale-95 transition-all cursor-pointer border-2 border-blue-400"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🇬🇧</span>
              <span className="font-sans">English</span>
            </div>
            <span className="text-xs bg-white text-blue-900 px-3 py-1 rounded-full font-black">
              Select ✓
            </span>
          </button>

          {/* Button 2: Hindi */}
          <button
            onClick={() => handleChoose('hi')}
            className="w-full min-h-[54px] p-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base sm:text-lg flex items-center justify-between shadow-xl active:scale-95 transition-all cursor-pointer border-2 border-amber-500"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🇮🇳</span>
              <span className="font-sans">हिंदी (Hindi)</span>
            </div>
            <span className="text-xs bg-slate-950 text-amber-300 px-3 py-1 rounded-full font-black">
              चुनें ✓
            </span>
          </button>

          {/* Button 3: Marathi */}
          <button
            onClick={() => handleChoose('mr')}
            className="w-full min-h-[54px] p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base sm:text-lg flex items-center justify-between shadow-xl active:scale-95 transition-all cursor-pointer border-2 border-emerald-400"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🚩</span>
              <span className="font-sans">मराठी (Marathi)</span>
            </div>
            <span className="text-xs bg-white text-emerald-800 px-3 py-1 rounded-full font-black">
              निवडा ✓
            </span>
          </button>

        </div>

        <p className="text-[11px] font-bold text-slate-400 pt-2 border-t border-slate-700/50">
          💡 You can change language anytime from top navbar.
        </p>

      </div>
    </div>
  );
}
