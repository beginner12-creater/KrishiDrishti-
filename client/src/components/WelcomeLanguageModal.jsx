import React from 'react';
import { Sprout, Check } from 'lucide-react';
import { t } from '../data/translations';

export default function WelcomeLanguageModal({ onSelectLanguage, isDarkMode = false }) {
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
            नमस्कार किसान भाई! / शेतकरी मित्रांनो!
          </h2>
          <p className="text-xs font-black text-slate-400 mt-1">
            कृषिदृष्टि AI - अपनी भाषा चुनें (Select Your Language):
          </p>
        </div>

        {/* 2 GIANT LANGUAGE BUTTONS: HINDI vs MARATHI */}
        <div className="space-y-3 pt-2">
          
          {/* Button 1: Hindi */}
          <button
            onClick={() => onSelectLanguage('hi')}
            className="w-full min-h-[60px] p-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-lg sm:text-xl flex items-center justify-between shadow-xl active:scale-95 transition-all cursor-pointer border-2 border-amber-500"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🇮🇳</span>
              <span className="font-sans">हिंदी (Hindi)</span>
            </div>
            <span className="text-xs bg-slate-950 text-amber-300 px-3 py-1 rounded-full font-black">
              चुनें ✓
            </span>
          </button>

          {/* Button 2: Marathi */}
          <button
            onClick={() => onSelectLanguage('mr')}
            className="w-full min-h-[60px] p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg sm:text-xl flex items-center justify-between shadow-xl active:scale-95 transition-all cursor-pointer border-2 border-emerald-400"
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
          💡 बाद में भी भाषा बदल सकते हैं (You can change language anytime).
        </p>

      </div>
    </div>
  );
}
