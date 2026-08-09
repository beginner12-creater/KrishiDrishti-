import React, { useState } from 'react';
import { Sprout, ShieldAlert, MapPin, BarChart3, Bot, GitCompare, FileText, Globe, Menu, X, Sparkles, IndianRupee } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, currentLang, setCurrentLang, onOpenReportModal, activeVillage, viewMode, setViewMode }) {
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
    { id: 'compare', label: 'Compare', icon: GitCompare },
    { id: 'chat', label: 'Krishi Mitr AI', icon: Bot }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-slate-200 px-2 sm:px-6 py-2 transition-all max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1 w-full min-w-0">
        
        {/* Brand Header */}
        <div className="flex items-center space-x-1.5 shrink min-w-0">
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-md shrink-0">
            <Sprout className="w-4 h-4 sm:w-6 sm:h-6 text-white font-bold" />
          </div>
          <div className="min-w-0 truncate">
            <h1 className="text-xs sm:text-lg font-black tracking-tight text-slate-900 truncate">
              KrishiDrishti <span className="text-[9px] sm:text-xs font-bold px-1 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">AI</span>
            </h1>
          </div>
        </div>

        {/* Mode Toggle: Farmer Mode vs Detailed Analytics */}
        <div className="flex items-center space-x-0.5 bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200 text-xs font-bold shrink-0">
          <button
            onClick={() => setViewMode('farmer')}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all flex items-center gap-1 min-h-[30px] ${
              viewMode === 'farmer'
                ? 'bg-emerald-600 text-white font-extrabold shadow-sm'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
            <span className="text-[10px] sm:text-xs">🌾 Farmer</span>
          </button>
          <button
            onClick={() => setViewMode('detailed')}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all flex items-center gap-1 min-h-[30px] ${
              viewMode === 'detailed'
                ? 'bg-emerald-600 text-white font-extrabold shadow-sm'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3 h-3 shrink-0" />
            <span className="text-[10px] sm:text-xs">📊 Full</span>
          </button>
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
                      ? 'bg-emerald-600 text-white font-bold shadow-sm'
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

        {/* Right Tools & Language & Mobile Hamburger */}
        <div className="flex items-center space-x-1 shrink-0">
          
          {/* Language Selector Dropdown */}
          <div className="relative flex items-center bg-slate-100 border border-slate-200 rounded-lg px-1 py-0.5 text-xs text-slate-800 min-h-[30px]">
            <Globe className="w-3 h-3 mr-0.5 text-emerald-600 shrink-0" />
            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
              className="bg-transparent border-none text-slate-900 text-[11px] sm:text-xs font-bold focus:outline-none cursor-pointer pr-0.5"
            >
              {languages.map(l => (
                <option key={l.code} value={l.code} className="bg-white text-slate-900">
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Export Report Button */}
          {activeVillage && (
            <button
              onClick={onOpenReportModal}
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-semibold transition-all min-h-[30px]"
              title="Print or Export Village Climate Audit"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          {viewMode === 'detailed' && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 min-h-[30px] min-w-[30px] flex items-center justify-center"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      {mobileMenuOpen && viewMode === 'detailed' && (
        <div className="xl:hidden mt-2 pt-2 border-t border-slate-200 grid grid-cols-2 gap-1.5 animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center space-x-2 p-2 rounded-xl text-xs font-bold transition-all min-h-[42px] ${
                  activeTab === item.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-800 border border-slate-200'
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
