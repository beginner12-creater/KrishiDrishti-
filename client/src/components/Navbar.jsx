import React from 'react';
import { Sprout, Globe, FileText } from 'lucide-react';

export default function Navbar({ currentLang, setCurrentLang, onOpenReportModal, activeVillage }) {
  const languages = [
    { code: 'mr', label: 'मराठी' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'en', label: 'EN' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'gu', label: 'ગુજરાતી' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-3 sm:px-6 py-2.5 transition-all w-full max-w-full overflow-hidden shadow-2xs">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 w-full min-w-0">
        
        {/* Minimal Brand Logo */}
        <div className="flex items-center space-x-2.5 shrink-0 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-xs shrink-0">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 truncate">
            <h1 className="text-base sm:text-lg font-black text-slate-900 leading-none truncate">
              KrishiDrishti <span className="text-emerald-700 text-xs font-black">AI</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold truncate">Simple Agriculture Platform</p>
          </div>
        </div>

        {/* Right Tools: Language Dropdown + Export Report Button */}
        <div className="flex items-center space-x-2 shrink-0">
          
          {/* Language Selector Dropdown */}
          <div className="flex items-center bg-slate-100 border border-slate-200/80 rounded-xl px-2 py-1.5 text-xs font-bold text-slate-800">
            <Globe className="w-3.5 h-3.5 mr-1.5 text-emerald-600 shrink-0" />
            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
              className="bg-transparent border-none text-slate-900 text-xs font-black focus:outline-none cursor-pointer pr-1"
            >
              {languages.map(l => (
                <option key={l.code} value={l.code} className="bg-white text-slate-900 font-bold">
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Export Report Button */}
          {activeVillage && (
            <button
              onClick={onOpenReportModal}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-extrabold transition-all cursor-pointer shadow-2xs"
              title="Print or Download PDF Report"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Export</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
