import React from 'react';
import { Home, IndianRupee, BarChart3, MapPin, Bot, Volume2 } from 'lucide-react';

export default function BottomNavBar({ activeTab, setActiveTab, viewMode, setViewMode, onOpenVoicePanel }) {
  const navItems = [
    { id: 'farmer', label: 'Farmer Home', icon: Home, isMode: true },
    { id: 'profit', label: 'Profit Crops', icon: IndianRupee, isMode: false },
    { id: 'map', label: 'Geo Map', icon: MapPin, isMode: false },
    { id: 'dashboard', label: 'Analytics', icon: BarChart3, isMode: false },
    { id: 'chat', label: 'Krishi Mitr', icon: Bot, isMode: false }
  ];

  const handleTabClick = (item) => {
    if (item.isMode) {
      setViewMode('farmer');
      setActiveTab('dashboard');
    } else {
      if (item.id === 'profit') setViewMode('detailed');
      setActiveTab(item.id);
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = (item.isMode && viewMode === 'farmer') || (!item.isMode && viewMode === 'detailed' && activeTab === item.id);
          
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all min-w-[60px] min-h-[48px] ${
                isActive
                  ? 'text-emerald-400 font-extrabold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}

        {/* Floating Voice Assistant Trigger Pill */}
        <button
          onClick={onOpenVoicePanel}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-amber-400 hover:text-amber-300 transition-all min-w-[55px] min-h-[48px] bg-amber-950/40 border border-amber-800/60"
        >
          <Volume2 className="w-5 h-5 mb-0.5 animate-pulse" />
          <span className="text-[10px] font-bold">Voice AI</span>
        </button>
      </div>
    </div>
  );
}
