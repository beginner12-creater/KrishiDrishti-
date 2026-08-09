import React from 'react';
import { Home, IndianRupee, BarChart3, MapPin, Bot } from 'lucide-react';

export default function BottomNavBar({ activeTab, setActiveTab, viewMode, setViewMode }) {
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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 px-2 py-1.5 shadow-lg">
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
                  ? 'text-emerald-700 font-black scale-105'
                  : 'text-slate-600 hover:text-slate-900 font-semibold'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5] text-emerald-600' : 'stroke-2 text-slate-500'}`} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
