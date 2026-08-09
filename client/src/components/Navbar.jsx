import React, { useState } from 'react';
import { Sprout, ShieldAlert, MapPin, BarChart3, Bot, Globe, Menu, X, Sparkles, IndianRupee } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, currentLang, setCurrentLang, activeVillage, viewMode, setViewMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const languages = [
    { code: 'mr', label: 'मराठी' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'en', label: 'EN' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ' },
    { code: 'ta', label: 'தமிழ்' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'gu', label: 'ગુજરાતી' }
  ];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'profit', label: '💰 Profit Crops', icon: IndianRupee },
    { id: 'advisory', label: 'AI Advisory', icon: ShieldAlert },
    { id: 'map', label: 'Geo Map', icon: MapPin },
    { id: 'chat', label: 'Krishi Mitr AI', icon: Bot }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3 transition-all w-full max-w-full overflow-hidden shadow-xs">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 w-full">
        
        {/* Minimalist Brand Logo */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-sm shrink-0">
            <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-black text-slate-900 leading-none tracking-tight">
              KrishiDrishti <span className="text-emerald-700 text-xs font-bold">AI</span>
            </h1>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Simple Agriculture Platform</p>
          </div>
        </div>

        {/* Minimal Mode Switcher: Farmer vs Full */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/80 text-xs font-extrabold shrink-0">
          <button
            onClick={() => setViewMode('farmer')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              viewMode === 'farmer'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>🌾 Farmer Mode</span>
          </button>
          <button
            onClick={() => setViewMode('detailed')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              viewMode === 'detailed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 shrink-0" />
            <span>📊 Detailed</span>
          </button>
        </div>

        {/* Right Tools: Language Dropdown */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="flex items-center bg-slate-100 border border-slate-200/80 rounded-xl px-2.5 py-1.5 text-xs font-extrabold text-slate-800">
            <Globe className="w-3.5 h-3.5 mr-1.5 text-emerald-600 shrink-0" />
            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
              className="bg-transparent border-none text-slate-900 font-bold focus:outline-none cursor-pointer"
            >
              {languages.map(l => (
                <option key={l.code} value={l.code} className="bg-white text-slate-900 font-bold">
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Navigation */}
          {viewMode === 'detailed' && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          )}
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && viewMode === 'detailed' && (
        <div className="xl:hidden mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center space-x-2 p-2.5 rounded-2xl text-xs font-extrabold transition-all ${
                  activeTab === item.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
