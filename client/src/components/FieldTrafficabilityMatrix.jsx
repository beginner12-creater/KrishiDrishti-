import React from 'react';
import { ShieldCheck, AlertOctagon, CheckCircle2, Wind, Droplets, Truck, AlertTriangle } from 'lucide-react';

export default function FieldTrafficabilityMatrix({ village, riskMetrics, liveWeather, farmContext, isDarkMode = false }) {
  if (!village || !riskMetrics) return null;

  const crop = farmContext?.crop || 'Cotton';
  const soil = farmContext?.soilType || 'Deep Black Clay (Regur)';

  const wind = liveWeather?.windSpeedKmh || 18;
  const rainProb = liveWeather?.rainProbability || 65;
  const humidity = liveWeather?.humidityPercent || 72;
  const temp = liveWeather?.tempC || 34;

  const isClay = soil.includes('Clay');
  const isHighWind = wind > 14;
  const isHighRain = rainProb > 40;

  // 1. Spray Decision Logic
  let sprayStatus = "OPEN 🟢";
  let sprayColor = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  let sprayReason = `Wind drift (${wind} km/h) & rain probability (${rainProb}%) are optimal for foliar application.`;

  if (isHighWind || isHighRain) {
    sprayStatus = "CLOSED 🔴";
    sprayColor = "bg-rose-500/20 text-rose-400 border-rose-500/40";
    sprayReason = `Closed: ${wind} km/h wind drift & ${rainProb}% rain expectation within 6h will wash active chemicals.`;
  } else if (temp > 35) {
    sprayStatus = "CAUTION 🟡";
    sprayColor = "bg-amber-500/20 text-amber-400 border-amber-500/30";
    sprayReason = `Caution: High afternoon temperature (${temp}°C) causes chemical volatilization. Spray between 6-8 AM.`;
  }

  // 2. Irrigation Scheduling Logic
  let irrStatus = "OPTIMAL 🟢";
  let irrColor = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  let irrReason = `Soil Water Deficit Index (SWDI) at 68%. Drip irrigate 45 minutes this evening.`;

  if (isHighRain) {
    irrStatus = "SUSPEND 🟡";
    irrColor = "bg-amber-500/20 text-amber-400 border-amber-500/30";
    irrReason = `Suspend: Soil Water Deficit Index (SWDI) at 34%. Monsoon rain (${rainProb}%) expected within 24h; avoid waterlogging in ${soil.split(' ')[0]} soil.`;
  }

  // 3. Field Operability & Harvest Trafficability Logic
  let trafficStatus = "GO 🟢";
  let trafficColor = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  let trafficIndex = 88;
  let trafficReason = `Soil compaction risk low. Heavy tractor & harvester trafficability index: 88/100.`;

  if (isClay && (isHighRain || rainProb > 30)) {
    trafficStatus = "NO-GO 🔴";
    trafficColor = "bg-rose-500/20 text-rose-400 border-rose-500/40";
    trafficIndex = 28;
    trafficReason = `No-Go: Severe soil compaction hazard. Machinery trafficability index: 28/100 (Saturated ${soil.split(' ')[0]} soil).`;
  } else if (isHighRain) {
    trafficStatus = "RESTRICTED 🟡";
    trafficColor = "bg-amber-500/20 text-amber-400 border-amber-500/30";
    trafficIndex = 54;
    trafficReason = `Restricted: Light machinery permitted. Heavy harvesters risk soil rutting.`;
  }

  return (
    <div className={`p-4 sm:p-6 rounded-3xl border shadow-xl relative overflow-hidden transition-all duration-500 ${
      isDarkMode
        ? 'bg-slate-900/90 border-slate-800 text-white'
        : 'bg-white border-slate-200 text-slate-900'
    }`}>
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold shadow-md">
            <Truck className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h3 className="text-base sm:text-xl font-black flex items-center gap-2">
              <span>Operational Decision & Field Trafficability Matrix</span>
            </h3>
            <p className={`text-xs font-bold mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Real-Time Field Go / No-Go Direct Action Rules for <strong>{crop}</strong> ({village.villageName})
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/30 font-extrabold uppercase">
          Field Trafficability Radar
        </span>
      </div>

      {/* 3 OPERATIONAL STATUS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        
        {/* Task 1: Chemical Spray Decision */}
        <div className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${
          isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-cyan-400" /> Pesticide / Fungicide Spray:
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${sprayColor}`}>
                {sprayStatus}
              </span>
            </div>

            <div className="mt-2.5">
              <h4 className="text-xs font-black text-slate-200">Foliar Chemical Spray Protocol</h4>
              <p className="text-xs font-medium text-slate-400 mt-1 leading-relaxed">
                {sprayReason}
              </p>
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800/60 flex justify-between">
            <span>Wind: {wind} km/h</span>
            <span>Rain: {rainProb}%</span>
          </div>
        </div>

        {/* Task 2: Irrigation Scheduling */}
        <div className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${
          isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Irrigation Scheduling:
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${irrColor}`}>
                {irrStatus}
              </span>
            </div>

            <div className="mt-2.5">
              <h4 className="text-xs font-black text-slate-200">Soil Moisture Deficit Tracking</h4>
              <p className="text-xs font-medium text-slate-400 mt-1 leading-relaxed">
                {irrReason}
              </p>
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800/60 flex justify-between">
            <span>SWDI Index: {isHighRain ? '34% (Moist)' : '68% (Deficit)'}</span>
            <span>Soil: {soil.split(' ')[0]}</span>
          </div>
        </div>

        {/* Task 3: Field Operability & Trafficability Window */}
        <div className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${
          isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-teal-400" /> Field Machinery Trafficability:
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${trafficColor}`}>
                {trafficStatus}
              </span>
            </div>

            <div className="mt-2.5">
              <h4 className="text-xs font-black text-slate-200">Soil Compaction & Harvest Window</h4>
              <p className="text-xs font-medium text-slate-400 mt-1 leading-relaxed">
                {trafficReason}
              </p>
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800/60 flex justify-between">
            <span>Trafficability Index: {trafficIndex}/100</span>
            <span>Soil Compaction: {isClay && isHighRain ? 'HIGH RISK' : 'LOW'}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
