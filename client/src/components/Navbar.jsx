import React, { useState } from 'react';
import { Sprout, ShieldAlert, MapPin, BarChart3, Bot, GitCompare, FileText, Globe, Menu, X } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, currentLang, setCurrentLang, onOpenReportModal, activeVillage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'gu', label: 'ગુજરાતી (Gujarati)' }
  ];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
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
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Brand Header */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-900/40 shrink-0">
            <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="text-base sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-400 bg-clip-text text-transparent">
                KrishiDrishti <span className="text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 rounded-md bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">AI 2.0</span>
              </h1>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium hidden xs:block">
              Village Climate Risk Advisory
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs sm:text-sm font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === item.id
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Tools & Language & Mobile Hamburger */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Language Selector */}
          <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-lg px-1.5 py-1 text-xs text-slate-300">
            <Globe className="w-3.5 h-3.5 mr-1 text-emerald-400 shrink-0" />
            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
              className="bg-transparent border-none text-slate-200 text-xs font-medium focus:outline-none cursor-pointer pr-1"
            >
              {languages.map(l => (
                <option key={l.code} value={l.code} className="bg-slate-900 text-slate-100">
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Export Report Button */}
          {activeVillage && (
            <button
              onClick={onOpenReportModal}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-semibold transition-all"
              title="Print or Export Village Climate Audit"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center space-x-2 p-2.5 rounded-xl text-xs font-bold transition-all min-h-[44px] ${
                  activeTab === item.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-300 border border-slate-800'
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
