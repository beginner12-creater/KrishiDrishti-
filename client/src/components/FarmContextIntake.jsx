import React from 'react';
import { Sprout, Calendar, Mountain, Maximize, Sliders, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

export default function FarmContextIntake({ farmContext, onChangeFarmContext, isDarkMode = false, primaryCrops = [] }) {
  const cropOptions = Array.from(new Set([
    ...(primaryCrops.length > 0 ? primaryCrops : ['Cotton', 'Soybean']),
    'Cotton', 'Soybean', 'Dragon Fruit', 'Pomegranate', 'Turmeric', 'Onion', 'Grapes', 'Bajra', 'Wheat', 'Rice', 'Sugarcane'
  ]));

  const phenologyStages = [
    'Germination & Emergence (0-15 Days)',
    'Vegetative Growth (16-45 Days)',
    'Flowering & Pollination (46-75 Days)',
    'Pod / Fruit Formation (76-105 Days)',
    'Grain Filling & Maturity (106+ Days)'
  ];

  const soilTypes = [
    'Deep Black Clay (Regur)',
    'Loam Soil (Balanced Drainage)',
    'Red Laterite Soil (Low Retention)',
    'Sandy Silt Soil (High Drainage)'
  ];

  const acreageOptions = [1.0, 2.5, 5.0, 10.0, 25.0];

  return (
    <div className={`p-4 sm:p-5 rounded-3xl mb-5 border relative max-w-full overflow-hidden transition-all duration-500 shadow-md ${
      isDarkMode
        ? 'bg-slate-900/95 border-emerald-500/30 text-white'
        : 'bg-white border-emerald-300 text-slate-900'
    }`}>
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-emerald-500/20 mb-3.5">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Sliders className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xs sm:text-base font-black flex items-center gap-2">
              <span>Mandatory Farm Profile Intake</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-black uppercase">
                Active Telemetry Input
              </span>
            </h2>
            <p className={`text-[11px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Dynamic bio-climatic risk, pathogen predictions & financial exposure recompute based on these parameters.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/30 font-bold self-start sm:self-auto">
          ⚡ Recomputing Real-Time Telemetry
        </span>
      </div>

      {/* 4 INPUT FILTERS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-bold">
        
        {/* 1. Crop Selection */}
        <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <label className="text-[10px] uppercase font-black tracking-wider text-emerald-400 flex items-center gap-1 mb-1.5">
            <Sprout className="w-3.5 h-3.5 text-emerald-400" />
            <span>Target Crop (पीक निवडा):</span>
          </label>
          <select
            value={farmContext.crop}
            onChange={(e) => onChangeFarmContext({ ...farmContext, crop: e.target.value })}
            className={`w-full bg-transparent border-none text-xs font-black focus:outline-none cursor-pointer ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            {cropOptions.map(c => (
              <option key={c} value={c} className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 font-bold'}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Sowing Date / Phenology Stage */}
        <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <label className="text-[10px] uppercase font-black tracking-wider text-emerald-400 flex items-center gap-1 mb-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Phenology Stage (पीक वाढीचा टप्पा):</span>
          </label>
          <select
            value={farmContext.phenologyStage}
            onChange={(e) => onChangeFarmContext({ ...farmContext, phenologyStage: e.target.value })}
            className={`w-full bg-transparent border-none text-xs font-black focus:outline-none cursor-pointer ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            {phenologyStages.map(s => (
              <option key={s} value={s} className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 font-bold'}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Soil Type */}
        <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <label className="text-[10px] uppercase font-black tracking-wider text-emerald-400 flex items-center gap-1 mb-1.5">
            <Mountain className="w-3.5 h-3.5 text-emerald-400" />
            <span>Soil Texture (जमिनीचा प्रकार):</span>
          </label>
          <select
            value={farmContext.soilType}
            onChange={(e) => onChangeFarmContext({ ...farmContext, soilType: e.target.value })}
            className={`w-full bg-transparent border-none text-xs font-black focus:outline-none cursor-pointer ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            {soilTypes.map(st => (
              <option key={st} value={st} className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 font-bold'}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Acreage */}
        <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <label className="text-[10px] uppercase font-black tracking-wider text-emerald-400 flex items-center gap-1 mb-1.5">
            <Maximize className="w-3.5 h-3.5 text-emerald-400" />
            <span>Plot Size (क्षेत्रफळ):</span>
          </label>
          <select
            value={farmContext.acreage}
            onChange={(e) => onChangeFarmContext({ ...farmContext, acreage: parseFloat(e.target.value) })}
            className={`w-full bg-transparent border-none text-xs font-black focus:outline-none cursor-pointer ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            {acreageOptions.map(a => (
              <option key={a} value={a} className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 font-bold'}>
                {a} {a === 1.0 ? 'Acre (एकड)' : 'Acres (एकड)'}
              </option>
            ))}
          </select>
        </div>

      </div>

    </div>
  );
}
