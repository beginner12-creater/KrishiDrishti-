import React from 'react';
import { Sprout, FileText, Sun, Moon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ onOpenReportModal, activeVillage, isDarkMode, onToggleTheme, currentHour = 12 }) {
  const { language, setLanguage, t } = useLanguage();

  // Determine Hourly Climate Label
  const getHourlyTimeBadge = () => {
    if (currentHour >= 5 && currentHour < 8) {
      return { label: '🌅 सकाळ', color: 'text-amber-500 bg-amber-500/10 border-amber-500/30' };
    }
    if (currentHour >= 8 && currentHour < 17) {
      return { label: '☀️ दुपार', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' };
    }
    if (currentHour >= 17 && currentHour < 20) {
      return { label: '🌇 संध्याकाळ', color: 'text-orange-500 bg-orange-500/10 border-orange-500/30' };
    }
    return { label: '🌙 रात्र', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' };
  };

  const timeBadge = getHourlyTimeBadge();

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b px-3 sm:px-6 py-2.5 transition-all duration-500 w-full max-w-full overflow-hidden shadow-sm ${
      isDarkMode
        ? 'bg-slate-900/95 border-slate-800 text-white'
        : 'bg-white/95 border-slate-200 text-slate-900'
    }`}>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 w-full min-w-0">
        
        {/* Minimal Brand Logo + Hourly Time Badge */}
        <div className="flex items-center space-x-2.5 shrink-0 min-w-0 self-start sm:self-auto">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-700 to-teal-600 flex items-center justify-center shadow-md shrink-0">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0 truncate">
            <div className="flex items-center space-x-1.5">
              <h1 className={`text-base sm:text-xl font-black leading-none truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {t('appTitle')} <span className="text-emerald-600 text-xs font-black">AI</span>
              </h1>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-black border hidden sm:inline-block whitespace-nowrap ${timeBadge.color}`}>
                {timeBadge.label}
              </span>
            </div>
            <p className={`text-[10px] font-extrabold truncate ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              {t('appSubtitle')}
            </p>
          </div>
        </div>

        {/* Center/Right: PROMINENT 3-BUTTON LANGUAGE SWITCHER (EN / हिंदी / मराठी) + Export Button */}
        <div className="flex items-center space-x-2 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-200/80 pt-1.5 sm:pt-0">
          
          {/* VISIBLE 3-BUTTON LANGUAGE SWITCHER (EN / हिंदी / मराठी) */}
          <div className="flex items-center space-x-1 bg-slate-950/20 p-1 rounded-2xl border border-slate-700/50">
            <button
              onClick={() => setLanguage('en')}
              className={`min-h-[36px] px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-1 ${
                language === 'en'
                  ? 'bg-blue-600 text-white shadow-md scale-105'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>🇬🇧 EN</span>
            </button>

            <button
              onClick={() => setLanguage('hi')}
              className={`min-h-[36px] px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-1 ${
                language === 'hi'
                  ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{t('hindiBtn')}</span>
            </button>

            <button
              onClick={() => setLanguage('mr')}
              className={`min-h-[36px] px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center space-x-1 ${
                language === 'mr'
                  ? 'bg-emerald-600 text-white shadow-md scale-105'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{t('marathiBtn')}</span>
            </button>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={onToggleTheme}
              className={`min-h-[40px] min-w-[40px] px-2.5 py-1.5 rounded-xl border transition-all duration-300 flex items-center justify-center cursor-pointer font-black text-xs ${
                isDarkMode
                  ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-300'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
              }`}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '20s' }} />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Export Report Button */}
            {activeVillage && (
              <button
                onClick={onOpenReportModal}
                className="min-h-[40px] px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center space-x-1 transition-all cursor-pointer shadow-md active:scale-95 whitespace-nowrap"
                title="Print or Download PDF Report"
              >
                <FileText className="w-3.5 h-3.5 text-white shrink-0" />
                <span>{t('exportReport')}</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
