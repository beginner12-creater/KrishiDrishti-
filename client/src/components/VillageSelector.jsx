import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, ChevronDown, Check, Sparkles, Building2 } from 'lucide-react';
import { t } from '../data/translations';

export default function VillageSelector({ villages, hierarchy, selectedVillage, onSelectVillage, currentLang = 'mr', isDarkMode = false }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredVillages = villages.filter(v => 
    v.villageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.districtName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.blockName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.stateName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (v) => {
    onSelectVillage(v);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleNativeSelectChange = (e) => {
    const vId = e.target.value;
    const vObj = villages.find(v => v.id === vId);
    if (vObj) handleSelect(vObj);
  };

  return (
    <div className={`p-4 sm:p-5 rounded-3xl mb-5 border relative max-w-full overflow-hidden transition-all duration-500 ${
      isDarkMode
        ? 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
        : 'bg-white border-slate-200 text-slate-900 shadow-xs'
    }`}>
      
      {/* Village Selector Main Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5 w-full min-w-0">
        
        {/* 1. CURRENT SELECTED VILLAGE BADGE */}
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
            <MapPin className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="min-w-0 truncate">
            <span className="text-[10px] sm:text-xs font-black text-emerald-500 uppercase tracking-wide block">
              📍 {t('selectedVillage', currentLang)} (निवडलेले गाव)
            </span>
            <div className="flex items-baseline space-x-1.5 min-w-0">
              <h2 className={`text-base sm:text-xl font-black truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {selectedVillage ? selectedVillage.villageName : 'Loading...'}
              </h2>
              {selectedVillage && (
                <span className={`text-xs font-bold truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  ({selectedVillage.blockName}, {selectedVillage.districtName})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 2. DUAL VILLAGE SELECT MENU: NATIVE DROPDOWN + SEARCH BAR */}
        <div className="flex flex-col sm:flex-row items-center gap-2 flex-1 max-w-2xl min-w-0 w-full">
          
          {/* Direct Select Menu Dropdown (Option 1) */}
          <div className={`relative w-full sm:w-1/2 flex items-center border rounded-2xl px-3 py-2.5 shadow-2xs ${
            isDarkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
          }`}>
            <Building2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
            <select
              value={selectedVillage?.id || ''}
              onChange={handleNativeSelectChange}
              className={`w-full bg-transparent border-none text-xs sm:text-sm font-black focus:outline-none cursor-pointer pr-4 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              <option value="" disabled className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
                -- 📍 Select Village Menu (गाव निवडा) --
              </option>
              {villages.map((v) => (
                <option key={v.id} value={v.id} className={isDarkMode ? 'bg-slate-900 text-white font-extrabold' : 'bg-white text-slate-900 font-extrabold'}>
                  {v.villageName} ({v.blockName}, {v.districtName})
                </option>
              ))}
            </select>
          </div>

          {/* Autocomplete Search Input (Option 2) */}
          <div className="relative w-full sm:w-1/2 min-w-0" ref={dropdownRef}>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder={t('searchPlaceholder', currentLang)}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                className={`w-full border rounded-2xl pl-9 pr-8 py-2.5 text-xs sm:text-sm font-bold focus:outline-none focus:border-emerald-500 shadow-2xs ${
                  isDarkMode
                    ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
              <ChevronDown className="w-4 h-4 absolute right-3 text-slate-400 pointer-events-none" />
            </div>

            {/* Search Dropdown Modal Popup */}
            {isOpen && (
              <div className={`absolute top-full left-0 right-0 mt-2 border rounded-2xl shadow-2xl z-50 max-h-72 overflow-y-auto divide-y ${
                isDarkMode ? 'bg-slate-900 border-slate-700 divide-slate-800' : 'bg-white border-slate-200 divide-slate-100'
              }`}>
                {filteredVillages.length > 0 ? (
                  filteredVillages.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => handleSelect(v)}
                      className={`w-full text-left p-3 transition-all flex items-center justify-between text-xs cursor-pointer ${
                        selectedVillage?.id === v.id
                          ? 'bg-emerald-600/20 font-bold text-emerald-400'
                          : isDarkMode ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-800 hover:bg-emerald-50'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className={`font-black text-sm flex items-center gap-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {v.villageName}
                          <span className={`text-[10px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>({v.pincode})</span>
                        </div>
                        <div className={`text-[11px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          Taluka: <strong className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>{v.blockName}</strong> • Dist: <strong className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>{v.districtName}</strong>
                        </div>
                      </div>

                      {selectedVillage?.id === v.id && (
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500 font-medium">
                    No village matched "{searchTerm}".
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* 3. QUICK VILLAGE SELECTION CHIPS MENU */}
      <div className={`mt-3.5 pt-3 border-t flex items-center gap-2 overflow-x-auto text-xs scrollbar-none max-w-full ${
        isDarkMode ? 'border-slate-800' : 'border-slate-100'
      }`}>
        <span className={`text-[11px] font-black shrink-0 flex items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Select Menu:
        </span>
        {villages.slice(0, 8).map((v) => (
          <button
            key={v.id}
            onClick={() => handleSelect(v)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-black transition-all border whitespace-nowrap min-h-[32px] cursor-pointer ${
              selectedVillage?.id === v.id
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-[1.02]'
                : isDarkMode
                ? 'bg-slate-950 hover:bg-slate-800 text-emerald-300 border-slate-800 hover:border-emerald-500'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
            }`}
          >
            {v.villageName} ({v.blockName})
          </button>
        ))}
      </div>

    </div>
  );
}
