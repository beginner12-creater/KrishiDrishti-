import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search, ChevronDown, Check, Building2, Landmark, Sparkles } from 'lucide-react';
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

  return (
    <div className="bg-white border border-slate-200 p-3 sm:p-4 rounded-3xl mb-4 sm:mb-6 shadow-sm relative max-w-full overflow-hidden">
      
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 w-full min-w-0">
        
        {/* Current Active Village Label */}
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
          </div>
          <div className="min-w-0 truncate">
            <span className="text-[10px] sm:text-xs font-bold text-slate-600 block uppercase tracking-wider">
              {t('selectedVillage', currentLang)} (निवडलेले गाव)
            </span>
            <div className="flex items-baseline space-x-1.5 min-w-0">
              <h2 className="text-sm sm:text-lg font-black text-slate-900 truncate">
                {selectedVillage ? selectedVillage.villageName : 'Loading...'}
              </h2>
              {selectedVillage && (
                <span className="text-[11px] sm:text-xs text-slate-600 font-semibold truncate">
                  ({selectedVillage.blockName}, {selectedVillage.districtName})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Autocomplete Search Dropdown Bar */}
        <div className="relative flex-1 max-w-xl min-w-0 w-full" ref={dropdownRef}>
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
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-9 pr-8 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 font-bold focus:outline-none focus:border-emerald-600 shadow-xs"
            />
            <ChevronDown className="w-4 h-4 absolute right-3 text-slate-400 pointer-events-none" />
          </div>

          {/* Search Dropdown Modal */}
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
                      <div className="font-extrabold text-sm text-slate-900 flex items-center gap-1">
                        {v.villageName}
                        <span className="text-[10px] font-bold text-slate-500">({v.pincode})</span>
                      </div>
                      <div className="text-[11px] text-slate-600 font-medium">
                        Taluka: <strong className="text-slate-800">{v.blockName}</strong> • Dist: <strong className="text-slate-800">{v.districtName}</strong> ({v.stateName})
                      </div>
                    </div>

                    {selectedVillage?.id === v.id && (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    )}
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-500 font-medium">
                  No village matched "{searchTerm}". Search another Taluka or District.
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Quick Select Popular Maharashtra Village Chips */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none max-w-full">
        <span className="text-[11px] text-slate-500 font-extrabold shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" /> {t('quickSelect', currentLang)}
        </span>
        {villages.slice(0, 7).map((v) => (
          <button
            key={v.id}
            onClick={() => handleSelect(v)}
            className={`shrink-0 px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all border whitespace-nowrap min-h-[30px] cursor-pointer ${
              selectedVillage?.id === v.id
                ? 'bg-emerald-600 text-white border-emerald-700 font-black shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {v.villageName} ({v.blockName})
          </button>
        ))}
      </div>

    </div>
  );
}
