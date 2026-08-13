import React from 'react';
import { Sprout, Globe, FileText, Sun, Moon, Sunrise, Sunset } from 'lucide-react';

export default function Navbar({ currentLang, setCurrentLang, onOpenReportModal, activeVillage, isDarkMode, onToggleTheme, currentHour = 12 }) {
  const languages = [
    { code: 'mr', label: 'मराठी' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'en', label: 'EN' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'gu', label: 'ગુજરાતી' }
  ];

  // Determine Hourly Climate Label
  const getHourlyTimeBadge = () => {
    if (currentHour >= 5 && currentHour < 8) {
      return { label: '🌅 Sunrise (सकाळ)', color: 'text-amber-500 bg-amber-500/10 border-amber-500/30' };
    }
    if (currentHour >= 8 && currentHour < 17) {
      return { label: '☀️ Daytime (दुपार)', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' };
    }
    if (currentHour >= 17 && currentHour < 20) {
      return { label: '🌇 Sunset (संध्याकाळ)', color: 'text-orange-500 bg-orange-500/10 border-orange-500/30' };
    }
    return { label: '🌙 Night (रात्र)', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' };
  };

  const timeBadge = getHourlyTimeBadge();

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b px-3 sm:px-6 py-2.5 transition-all duration-500 w-full max-w-full overflow-hidden shadow-2xs ${
      isDarkMode
        ? 'bg-slate-900/90 border-slate-800 text-white'
        : 'bg-white/90 border-slate-200/80 text-slate-900'
    }`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 w-full min-w-0">
        
        {/* Minimal Brand Logo + Hourly Time Badge */}
        <div className="flex items-center space-x-2.5 shrink-0 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-xs shrink-0 transform hover:rotate-6 transition-transform">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 truncate">
            <div className="flex items-center space-x-1.5">
              <h1 className={`text-base sm:text-lg font-black leading-none truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                KrishiDrishti <span className="text-emerald-500 text-xs font-black">AI</span>
              </h1>
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-black border hidden sm:inline-block whitespace-nowrap ${timeBadge.color}`}>
                {timeBadge.label}
              </span>
            </div>
            <p className={`text-[10px] font-bold truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Climate Risk & Advisory Platform
            </p>
          </div>
        </div>

        {/* Right Tools: Dark/Light Toggle + Language Dropdown + Export Button */}
        <div className="flex items-center space-x-2 shrink-0">
          
          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-xl border transition-all duration-300 flex items-center space-x-1 cursor-pointer ${
              isDarkMode
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-300'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
            }`}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '20s' }} />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
            <span className="text-[10px] font-black hidden md:inline">
              {isDarkMode ? 'Light' : 'Dark'}
            </span>
          </button>

          {/* Language Selector Dropdown */}
          <div className={`flex items-center border rounded-xl px-2 py-1.5 text-xs font-bold ${
            isDarkMode
              ? 'bg-slate-800 border-slate-700 text-white'
              : 'bg-slate-100 border-slate-200/80 text-slate-800'
          }`}>
            <Globe className="w-3.5 h-3.5 mr-1.5 text-emerald-500 shrink-0" />
            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
              className={`bg-transparent border-none text-xs font-black focus:outline-none cursor-pointer pr-1 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              {languages.map(l => (
                <option key={l.code} value={l.code} className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 font-bold'}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Export Report Button */}
          {activeVillage && (
            <button
              onClick={onOpenReportModal}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all cursor-pointer shadow-xs"
              title="Print or Download PDF Report"
            >
              <FileText className="w-3.5 h-3.5 text-white shrink-0" />
              <span>Export</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
