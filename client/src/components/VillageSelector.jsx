import React, { useState } from 'react';
import { Search, MapPin, SlidersHorizontal, Check, Sparkles } from 'lucide-react';

export default function VillageSelector({ villages, hierarchy, selectedVillage, onSelectVillage }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');

  const statesList = Object.keys(hierarchy || {}).sort();
  const districtsList = selectedState && hierarchy[selectedState] ? Object.keys(hierarchy[selectedState]).sort() : [];
  const blocksList = selectedState && selectedDistrict && hierarchy[selectedState][selectedDistrict] ? Object.keys(hierarchy[selectedState][selectedDistrict]).sort() : [];
  const villagesList = selectedState && selectedDistrict && selectedBlock && hierarchy[selectedState][selectedDistrict][selectedBlock] ? hierarchy[selectedState][selectedDistrict][selectedBlock] : [];

  const filteredSearchResults = searchTerm.trim().length > 1
    ? villages.filter(v =>
        v.villageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.districtName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.stateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.blockName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.pincode.includes(searchTerm)
      )
    : [];

  return (
    <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-6 rounded-3xl mb-6 shadow-xl relative backdrop-blur-md">
      
      {/* Search Input Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="🔍 Type your village or district name (e.g. Sangamner, Baramati, Niphad)..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 min-h-[50px] shadow-inner"
          />

          {/* Autocomplete Dropdown */}
          {isDropdownOpen && filteredSearchResults.length > 0 && (
            <div className="absolute top-14 left-0 right-0 z-50 bg-slate-900 max-h-64 overflow-y-auto rounded-2xl border border-slate-700 shadow-2xl">
              {filteredSearchResults.map(v => (
                <div
                  key={v.id}
                  onClick={() => {
                    onSelectVillage(v);
                    setSearchTerm('');
                    setIsDropdownOpen(false);
                  }}
                  className="p-3.5 hover:bg-emerald-950/40 hover:border-l-4 hover:border-emerald-400 transition-all cursor-pointer border-b border-slate-800/50 flex items-center justify-between min-h-[48px]"
                >
                  <div>
                    <div className="text-sm font-extrabold text-slate-100 flex items-center gap-2">
                      <span>{v.villageName}</span>
                      <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">PIN: {v.pincode}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {v.blockName}, {v.districtName}, <span className="text-emerald-400 font-semibold">{v.stateName}</span>
                    </div>
                  </div>
                  {selectedVillage && selectedVillage.id === v.id && (
                    <Check className="w-5 h-5 text-emerald-400" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Toggle Advanced Filter Button */}
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="px-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-2 shrink-0 min-h-[50px]"
        >
          <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
          <span>{showAdvancedFilters ? 'Hide Filters' : 'Filter State/District'}</span>
        </button>
      </div>

      {/* Selected Location Pill */}
      {selectedVillage && (
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-2xl border border-slate-800 flex-wrap">
          <MapPin className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
          <span>Selected Village: <strong className="text-emerald-400 text-sm">{selectedVillage.villageName}</strong></span>
          <span>•</span>
          <span>Block: <strong>{selectedVillage.blockName}</strong></span>
          <span>•</span>
          <span>District: <strong>{selectedVillage.districtName}</strong> ({selectedVillage.stateName})</span>
        </div>
      )}

      {/* Popular Quick Select Chips */}
      <div className="mt-3 flex items-center gap-2 overflow-x-auto pt-2 text-xs scrollbar-none">
        <span className="text-slate-500 font-semibold shrink-0 text-xs flex items-center">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 mr-1" /> Quick Select:
        </span>
        {villages.slice(0, 7).map(v => (
          <button
            key={v.id}
            onClick={() => onSelectVillage(v)}
            className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all min-h-[36px] ${
              selectedVillage && selectedVillage.id === v.id
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            {v.villageName} ({v.districtName})
          </button>
        ))}
      </div>

      {/* Optional Advanced Cascading Selectors */}
      {showAdvancedFilters && (
        <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3 animate-fadeIn">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">State</label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict('');
                setSelectedBlock('');
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="">-- All States --</option>
              {statesList.map(st => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setSelectedBlock('');
              }}
              disabled={!selectedState}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none disabled:opacity-50"
            >
              <option value="">-- Select District --</option>
              {districtsList.map(dist => <option key={dist} value={dist}>{dist}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Block / Taluka</label>
            <select
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              disabled={!selectedDistrict}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none disabled:opacity-50"
            >
              <option value="">-- Select Block --</option>
              {blocksList.map(blk => <option key={blk} value={blk}>{blk}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Village</label>
            <select
              value={selectedVillage ? selectedVillage.id : ''}
              onChange={(e) => {
                const found = villages.find(v => v.id === e.target.value);
                if (found) onSelectVillage(found);
              }}
              disabled={!selectedBlock}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none disabled:opacity-50"
            >
              <option value="">-- Select Village --</option>
              {villagesList.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
        </div>
      )}

    </div>
  );
}
