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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-2 sm:px-6 py-2 transition-all w-full max-w-full overflow-hidden shadow-xs">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 w-full min-w-0">
        
        {/* ROW 1: BRAND LOGO + LANGUAGE DROPDOWN (Strict 100% Mobile Fit) */}
        <div className="flex items-center justify-between w-full sm:w-auto min-w-0 gap-1.5 px-1">
          
          {/* Minimal Brand Logo */}
          <div className="flex items-center space-x-2 shrink-0 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-xs shrink-0">
              <Sprout className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0 truncate">
              <h1 className="text-sm sm:text-lg font-black text-slate-900 leading-none truncate">
                KrishiDrishti <span className="text-emerald-700 text-[10px] sm:text-xs font-bold">AI</span>
              </h1>
              <p className="text-[9px] sm:text-[11px] text-slate-500 font-bold truncate">Climate Platform</p>
            </div>
          </div>

          {/* Right Mobile Actions: Language Dropdown + Mobile Menu Toggle */}
          <div className="flex items-center space-x-1 shrink-0">
            {/* Language Selector Dropdown */}
            <div className="flex items-center bg-slate-100 border border-slate-200/80 rounded-xl px-1.5 py-1 text-xs font-bold text-slate-800">
              <Globe className="w-3 h-3 mr-1 text-emerald-600 shrink-0" />
              <select
                value={currentLang}
                onChange={(e) => setCurrentLang(e.target.value)}
                className="bg-transparent border-none text-slate-900 text-xs font-black focus:outline-none cursor-pointer pr-0.5"
              >
                {languages.map(l => (
                  <option key={l.code} value={l.code} className="bg-white text-slate-900 font-bold">
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Menu Toggle Button */}
            {viewMode === 'detailed' && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 min-h-[30px] min-w-[30px] flex items-center justify-center"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            )}
          </div>

        </div>

        {/* ROW 2: MODE SWITCHER (FARMER vs DETAILED) - Compact Full Mobile Width Fit */}
        <div className="flex items-center justify-center w-full sm:w-auto px-1 min-w-0">
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl border border-slate-200/80 text-[11px] font-extrabold w-full sm:w-auto justify-center min-w-0">
            <button
              onClick={() => setViewMode('farmer')}
              className={`flex-1 sm:flex-initial px-2.5 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1 min-h-[30px] truncate ${
                viewMode === 'farmer'
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
              <span className="truncate">🌾 Farmer Mode</span>
            </button>

            <button
              onClick={() => setViewMode('detailed')}
              className={`flex-1 sm:flex-initial px-2.5 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1 min-h-[30px] truncate ${
                viewMode === 'detailed'
                  ? 'bg-emerald-600 text-white shadow-xs font-black'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3 h-3 shrink-0" />
              <span className="truncate">📊 Detailed</span>
            </button>
          </div>
        </div>

        {/* Desktop Navigation */}
        {viewMode === 'detailed' && (
          <nav className="hidden xl:flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === item.id
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && viewMode === 'detailed' && (
        <div className="xl:hidden mt-2 pt-2 border-t border-slate-100 grid grid-cols-2 gap-1.5 animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center space-x-2 p-2 rounded-xl text-xs font-extrabold transition-all min-h-[38px] ${
                  activeTab === item.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
