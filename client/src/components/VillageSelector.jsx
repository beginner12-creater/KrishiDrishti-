import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, ChevronDown, Check, Sparkles, Building2 } from 'lucide-react';
import { t } from '../data/translations';

export default function VillageSelector({ villages, hierarchy, selectedVillage, onSelectVillage, currentLang = 'mr' }) {
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
    <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-3xl mb-5 shadow-xs relative max-w-full overflow-hidden">
      
      {/* Village Selector Main Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5 w-full min-w-0">
        
        {/* 1. CURRENT SELECTED VILLAGE BADGE */}
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
            <MapPin className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="min-w-0 truncate">
            <span className="text-[10px] sm:text-xs font-black text-emerald-800 uppercase tracking-wide block">
              📍 {t('selectedVillage', currentLang)} (निवडलेले गाव)
            </span>
            <div className="flex items-baseline space-x-1.5 min-w-0">
              <h2 className="text-base sm:text-xl font-black text-slate-900 truncate">
                {selectedVillage ? selectedVillage.villageName : 'Loading...'}
              </h2>
              {selectedVillage && (
                <span className="text-xs text-slate-500 font-bold truncate">
                  ({selectedVillage.blockName}, {selectedVillage.districtName})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 2. DUAL VILLAGE SELECT MENU: NATIVE DROPDOWN + SEARCH BAR */}
        <div className="flex flex-col sm:flex-row items-center gap-2 flex-1 max-w-2xl min-w-0 w-full">
          
          {/* Direct Select Menu Dropdown (Option 1) */}
          <div className="relative w-full sm:w-1/2 flex items-center bg-slate-50 border border-slate-300 rounded-2xl px-3 py-2.5 shadow-2xs">
            <Building2 className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
            <select
              value={selectedVillage?.id || ''}
              onChange={handleNativeSelectChange}
              className="w-full bg-transparent border-none text-xs sm:text-sm font-black text-slate-900 focus:outline-none cursor-pointer pr-4"
            >
              <option value="" disabled>-- 📍 Select Village Menu (गाव निवडा) --</option>
              {villages.map((v) => (
                <option key={v.id} value={v.id} className="bg-white text-slate-900 font-extrabold">
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
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-9 pr-8 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 font-bold focus:outline-none focus:border-emerald-600 shadow-2xs"
              />
              <ChevronDown className="w-4 h-4 absolute right-3 text-slate-400 pointer-events-none" />
            </div>

            {/* Search Dropdown Modal Popup */}
            {isOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 max-h-72 overflow-y-auto divide-y divide-slate-100">
                {filteredVillages.length > 0 ? (
                  filteredVillages.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => handleSelect(v)}
                      className={`w-full text-left p-3 hover:bg-emerald-50 transition-all flex items-center justify-between text-xs cursor-pointer ${
                        selectedVillage?.id === v.id ? 'bg-emerald-50 font-bold text-emerald-900' : 'text-slate-800'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-black text-sm text-slate-900 flex items-center gap-1">
                          {v.villageName}
                          <span className="text-[10px] font-bold text-slate-500">({v.pincode})</span>
                        </div>
                        <div className="text-[11px] text-slate-600 font-medium">
                          Taluka: <strong className="text-slate-800">{v.blockName}</strong> • Dist: <strong className="text-slate-800">{v.districtName}</strong>
                        </div>
                      </div>

                      {selectedVillage?.id === v.id && (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
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
      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none max-w-full">
        <span className="text-[11px] text-slate-600 font-black shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Select Menu:
        </span>
        {villages.slice(0, 8).map((v) => (
          <button
            key={v.id}
            onClick={() => handleSelect(v)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-black transition-all border whitespace-nowrap min-h-[32px] cursor-pointer ${
              selectedVillage?.id === v.id
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
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
