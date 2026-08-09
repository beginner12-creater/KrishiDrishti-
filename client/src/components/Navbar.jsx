import React, { useState } from 'react';
import { Sprout, ShieldAlert, MapPin, BarChart3, Bot, GitCompare, FileText, Globe, Menu, X, Sparkles, IndianRupee, Volume2 } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, currentLang, setCurrentLang, onOpenReportModal, activeVillage, viewMode, setViewMode, onOpenVoicePanel }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'mr', label: 'मराठी' },
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
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 px-2.5 sm:px-6 py-2 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3">
        
        {/* Brand Header */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-700 flex items-center justify-center shadow-md shadow-emerald-900/40 shrink-0">
            <Sprout className="w-4 h-4 sm:w-6 sm:h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <h1 className="text-sm sm:text-lg font-black tracking-tight bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-400 bg-clip-text text-transparent">
              KrishiDrishti <span className="text-[9px] sm:text-xs font-semibold px-1 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">AI</span>
            </h1>
          </div>
        </div>

        {/* Mode Toggle: Farmer Mode vs Detailed Analytics */}
        <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold shrink-0">
          <button
            onClick={() => setViewMode('farmer')}
            className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all flex items-center gap-1 min-h-[32px] ${
              viewMode === 'farmer'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-950 shrink-0" />
            <span className="text-[11px] sm:text-xs">🌾 Farmer</span>
          </button>
          <button
            onClick={() => setViewMode('detailed')}
            className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all flex items-center gap-1 min-h-[32px] ${
              viewMode === 'detailed'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3 h-3 shrink-0" />
            <span className="text-[11px] sm:text-xs">📊 Full</span>
          </button>
        </div>

        {/* Desktop Navigation */}
        {viewMode === 'detailed' && (
          <nav className="hidden xl:flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
                    activeTab === item.id
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
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
        <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
          
          {/* AI Voice Panel Trigger Button */}
          <button
            onClick={onOpenVoicePanel}
            className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-800/60 text-xs font-bold transition-all hover:bg-amber-500/30 min-h-[32px]"
          >
            <Volume2 className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span className="text-[11px]">Voice</span>
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-lg px-1.5 py-1 text-xs text-slate-300 min-h-[32px]">
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
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-semibold transition-all min-h-[32px]"
              title="Print or Export Village Climate Audit"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          {viewMode === 'detailed' && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white min-h-[32px] min-w-[32px] flex items-center justify-center"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      {mobileMenuOpen && viewMode === 'detailed' && (
        <div className="xl:hidden mt-2 pt-2 border-t border-slate-800 grid grid-cols-2 gap-1.5 animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center space-x-2 p-2 rounded-xl text-xs font-bold transition-all min-h-[42px] ${
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
