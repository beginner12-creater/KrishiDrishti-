import React, { useState } from 'react';
import { Sprout, ShieldAlert, MapPin, BarChart3, Bot, GitCompare, FileText, Globe, Menu, X, Sparkles, IndianRupee, User, LogOut, LogIn, Star, Settings } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, currentLang, setCurrentLang, onOpenReportModal, activeVillage, viewMode, setViewMode, user, onOpenAuthModal, onLogout }) {
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
    { id: 'reviews', label: '⭐ Reviews', icon: Star },
    { id: 'advisory', label: 'AI Advisory', icon: ShieldAlert },
    { id: 'map', label: 'Geo Map', icon: MapPin },
    { id: 'chat', label: 'Krishi Mitr AI', icon: Bot },
    { id: 'admin', label: '⚙️ Admin Hub', icon: Settings }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-slate-200 px-3 sm:px-6 py-2 transition-all w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 w-full min-w-0">
        
        {/* Row 1: Brand Logo + Language + User Login/Profile + Hamburger */}
        <div className="flex items-center justify-between w-full sm:w-auto min-w-0 gap-2">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-md shrink-0">
              <Sprout className="w-4 h-4 sm:w-6 sm:h-6 text-white font-bold" />
            </div>
            <div>
              <h1 className="text-sm sm:text-lg font-black tracking-tight text-slate-900 leading-none">
                KrishiDrishti <span className="text-[9px] sm:text-xs font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">AI</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">Climate Advisory Platform</p>
            </div>
          </div>

          {/* Right Mobile Actions: Language + Login + Hamburger */}
          <div className="flex items-center space-x-1.5 sm:hidden shrink-0">
            {/* Language Dropdown */}
            <div className="relative flex items-center bg-slate-100 border border-slate-200 rounded-lg px-1.5 py-1 text-xs text-slate-800">
              <Globe className="w-3 h-3 mr-1 text-emerald-600 shrink-0" />
              <select
                value={currentLang}
                onChange={(e) => setCurrentLang(e.target.value)}
                className="bg-transparent border-none text-slate-900 text-xs font-bold focus:outline-none cursor-pointer"
              >
                {languages.map(l => (
                  <option key={l.code} value={l.code} className="bg-white text-slate-900">
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Login / User Profile */}
            {user ? (
              <div className="flex items-center space-x-1 bg-slate-100 border border-slate-200 p-1 rounded-xl">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-6 h-6 rounded-lg object-cover shrink-0"
                />
                <button
                  onClick={onLogout}
                  className="p-1 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-200 cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all shadow-xs shrink-0 cursor-pointer min-h-[30px]"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            {viewMode === 'detailed' && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 min-h-[30px] min-w-[30px] flex items-center justify-center"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            )}
          </div>

        </div>

        {/* Row 2 on Mobile / Middle Desktop: Mode Toggle: Farmer Mode vs Detailed Analytics */}
        <div className="flex items-center justify-between sm:justify-center w-full sm:w-auto gap-2">
          
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold w-full sm:w-auto justify-center">
            <button
              onClick={() => setViewMode('farmer')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 min-h-[32px] ${
                viewMode === 'farmer'
                  ? 'bg-emerald-600 text-white font-extrabold shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="text-xs">🌾 Farmer Mode (शेतकरी)</span>
            </button>

            <button
              onClick={() => setViewMode('detailed')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 min-h-[32px] ${
                viewMode === 'detailed'
                  ? 'bg-emerald-600 text-white font-extrabold shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 shrink-0" />
              <span className="text-xs">📊 Full Analytics</span>
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

        {/* Desktop Only Right Tools: Language & User Auth & Export */}
        <div className="hidden sm:flex items-center space-x-2 shrink-0">
          
          {/* Language Selector Dropdown */}
          <div className="relative flex items-center bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 min-h-[32px]">
            <Globe className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" />
            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
              className="bg-transparent border-none text-slate-900 text-xs font-bold focus:outline-none cursor-pointer pr-1"
            >
              {languages.map(l => (
                <option key={l.code} value={l.code} className="bg-white text-slate-900">
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* User Auth Profile / Login Button */}
          {user ? (
            <div className="flex items-center space-x-1.5 bg-slate-100 border border-slate-200 px-2 py-1 rounded-xl">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-6 h-6 rounded-lg object-cover shrink-0"
              />
              <span className="text-xs font-black text-slate-900 max-w-[100px] truncate">
                {user.name.split(' ')[0]}
              </span>
              <button
                onClick={onLogout}
                className="p-1 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-200 cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all shadow-xs shrink-0 cursor-pointer min-h-[32px]"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login (लॉगिन)</span>
            </button>
          )}

          {/* Export Report Button */}
          {activeVillage && (
            <button
              onClick={onOpenReportModal}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-semibold transition-all min-h-[32px]"
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
              className="xl:hidden p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 min-h-[32px] min-w-[32px] flex items-center justify-center"
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
