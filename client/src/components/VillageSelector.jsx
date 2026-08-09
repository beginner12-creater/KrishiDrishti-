import React, { useState, useEffect } from 'react';
import { Search, MapPin, Sparkles, Filter, Check } from 'lucide-react';

export default function VillageSelector({ villages, hierarchy, selectedVillage, onSelectVillage }) {
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (selectedVillage) {
      setSelectedState(selectedVillage.stateName);
      setSelectedDistrict(selectedVillage.districtName);
      setSelectedBlock(selectedVillage.blockName);
    }
  }, [selectedVillage]);

  const statesList = Object.keys(hierarchy || {}).sort();
  const districtsList = selectedState && hierarchy[selectedState] ? Object.keys(hierarchy[selectedState]).sort() : [];
  const blocksList = selectedState && selectedDistrict && hierarchy[selectedState][selectedDistrict] ? Object.keys(hierarchy[selectedState][selectedDistrict]).sort() : [];
  const villagesList = selectedState && selectedDistrict && selectedBlock && hierarchy[selectedState][selectedDistrict][selectedBlock] ? hierarchy[selectedState][selectedDistrict][selectedBlock] : [];

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedDistrict('');
    setSelectedBlock('');
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    setSelectedBlock('');
  };

  const handleBlockChange = (e) => {
    setSelectedBlock(e.target.value);
  };

  const handleVillageSelectFromDropdown = (e) => {
    const vId = e.target.value;
    const found = villages.find(v => v.id === vId);
    if (found) {
      onSelectVillage(found);
    }
  };

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
    <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-800/80 mb-6 shadow-xl relative">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        
        {/* Title & Selected Village Badge */}
        <div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-emerald-400 animate-pulse shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-slate-100">
              Village Climate Location
            </h2>
          </div>
          {selectedVillage ? (
            <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-emerald-400 text-sm">{selectedVillage.villageName}</span>
              <span>•</span>
              <span>Block: {selectedVillage.blockName}</span>
              <span>•</span>
              <span>Dist: {selectedVillage.districtName}</span>
              <span>•</span>
              <span className="text-slate-300 bg-slate-800 px-2 py-0.5 rounded text-[11px] font-mono">{selectedVillage.stateName}</span>
              <span className="text-emerald-400/90 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded text-[11px]">
                {selectedVillage.agroZone}
              </span>
            </p>
          ) : (
            <p className="text-xs text-slate-400 mt-1">Select an agricultural village in India to compute climate risks</p>
          )}
        </div>

        {/* Global Instant Search Input */}
        <div className="relative w-full lg:w-96">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search village, district, state or pincode..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-inner min-h-[44px]"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {isDropdownOpen && filteredSearchResults.length > 0 && (
            <div className="absolute top-13 left-0 right-0 z-50 glass-panel max-h-64 overflow-y-auto rounded-xl border border-slate-700 shadow-2xl">
              {filteredSearchResults.map(v => (
                <div
                  key={v.id}
                  onClick={() => {
                    onSelectVillage(v);
                    setSearchTerm('');
                    setIsDropdownOpen(false);
                  }}
                  className="p-3 hover:bg-emerald-950/40 hover:border-l-4 hover:border-emerald-400 transition-all cursor-pointer border-b border-slate-800/50 flex items-center justify-between min-h-[48px]"
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                      <span>{v.villageName}</span>
                      <span className="text-[11px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded font-mono">PIN: {v.pincode}</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      {v.blockName}, {v.districtName}, <span className="text-emerald-400">{v.stateName}</span>
                    </div>
                  </div>
                  {selectedVillage && selectedVillage.id === v.id && (
                    <Check className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cascading Hierarchy Selectors */}
      <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* State */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">1. Select State</label>
          <select
            value={selectedState}
            onChange={handleStateChange}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer min-h-[44px]"
          >
            <option value="">-- All States ({statesList.length}) --</option>
            {statesList.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {/* District */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">2. Select District</label>
          <select
            value={selectedDistrict}
            onChange={handleDistrictChange}
            disabled={!selectedState}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer disabled:opacity-50 min-h-[44px]"
          >
            <option value="">-- Select District --</option>
            {districtsList.map(dist => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
        </div>

        {/* Block / Tehsil */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">3. Select Block/Tehsil</label>
          <select
            value={selectedBlock}
            onChange={handleBlockChange}
            disabled={!selectedDistrict}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer disabled:opacity-50 min-h-[44px]"
          >
            <option value="">-- Select Block --</option>
            {blocksList.map(blk => (
              <option key={blk} value={blk}>{blk}</option>
            ))}
          </select>
        </div>

        {/* Village */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">4. Select Village</label>
          <select
            value={selectedVillage ? selectedVillage.id : ''}
            onChange={handleVillageSelectFromDropdown}
            disabled={!selectedBlock}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer disabled:opacity-50 min-h-[44px]"
          >
            <option value="">-- Select Village --</option>
            {villagesList.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Hotspot Quick Select Chips with touch swipe */}
      <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-slate-800/40 text-xs scrollbar-none">
        <span className="text-slate-500 text-[11px] font-medium flex items-center shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 mr-1" /> Hotspots:
        </span>
        {villages.slice(0, 6).map(v => (
          <button
            key={v.id}
            onClick={() => onSelectVillage(v)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all min-h-[36px] ${
              selectedVillage && selectedVillage.id === v.id
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            {v.villageName} ({v.districtName})
          </button>
        ))}
      </div>
    </div>
  );
}
