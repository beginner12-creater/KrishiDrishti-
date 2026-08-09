import React from 'react';
import { Sun, CloudRain, Flame, Bug, Activity, AlertTriangle } from 'lucide-react';

export default function RiskSummaryCards({ village, riskMetrics }) {
  if (!village || !riskMetrics) return null;

  const { overallRiskScore, riskCategory, riskBadgeColor, subIndices } = riskMetrics;

  const getMeterColor = (val) => {
    if (val >= 75) return 'bg-rose-500 text-rose-700';
    if (val >= 55) return 'bg-amber-500 text-amber-700';
    return 'bg-emerald-500 text-emerald-700';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5 sm:gap-4 mb-6">
      
      {/* 1. Main Vulnerability Score Card */}
      <div className="col-span-1 sm:col-span-2 lg:col-span-2 bg-white border border-slate-200 p-4 sm:p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-sm border-l-4" style={{ borderColor: riskBadgeColor }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-700">
              Agri-Climate Risk Score (हवामान धोका गुण)
            </span>
          </div>
          <span
            className="px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide shrink-0"
            style={{ backgroundColor: `${riskBadgeColor}15`, color: riskBadgeColor, border: `1px solid ${riskBadgeColor}40` }}
          >
            {riskCategory}
          </span>
        </div>

        <div className="my-4 flex items-center justify-between">
          <div>
            <div className="text-3xl sm:text-4xl font-black tracking-tight" style={{ color: riskBadgeColor }}>
              {overallRiskScore}
              <span className="text-sm sm:text-base font-bold text-slate-500"> / 100</span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-1">
              Multi-hazard risk index for <span className="text-slate-900 font-bold">{village.villageName}</span>
            </p>
          </div>
          
          {/* Circular Progress Gauge */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                strokeWidth="3.5"
                strokeDasharray={`${overallRiskScore}, 100`}
                stroke={riskBadgeColor}
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 absolute" style={{ color: riskBadgeColor }} />
          </div>
        </div>

        {/* Core Agro Baseline Bar */}
        <div className="pt-3 border-t border-slate-200 text-xs flex flex-wrap items-center justify-between gap-1 text-slate-600 font-medium">
          <div>Rainfall (पाऊस): <span className="text-slate-900 font-bold">{village.annualRainfallNormal} mm</span></div>
          <div>Irrigation (सिंचन): <span className="text-slate-900 font-bold">{village.irrigationCoveragePercent}%</span></div>
          <div>Soil (माती): <span className="text-emerald-700 font-bold">{village.soilType.split(' ')[0]}</span></div>
        </div>
      </div>

      {/* 2. Drought Index */}
      <div className="bg-white border border-slate-200 p-4 rounded-3xl flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-amber-500 shrink-0" /> Drought Risk (दुष्काळ धोका)
          </span>
          <span className={`text-xs font-extrabold ${getMeterColor(subIndices.droughtIndex).split(' ')[1]}`}>
            {subIndices.droughtIndex}%
          </span>
        </div>
        <div className="my-2.5">
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full ${getMeterColor(subIndices.droughtIndex).split(' ')[0]} rounded-full transition-all duration-500`}
              style={{ width: `${subIndices.droughtIndex}%` }}
            />
          </div>
        </div>
        <p className="text-[11px] text-slate-600 font-medium">
          {subIndices.droughtIndex > 60 ? 'Severe dry spells risk (मोठा ताण)' : 'Moderate rainfall deficit (मध्यम)'}
        </p>
      </div>

      {/* 3. Heatwave Risk */}
      <div className="bg-white border border-slate-200 p-4 rounded-3xl flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-rose-500 shrink-0" /> Heat Stress (उष्णता ताण)
          </span>
          <span className={`text-xs font-extrabold ${getMeterColor(subIndices.heatwaveIndex).split(' ')[1]}`}>
            {subIndices.heatwaveIndex}%
          </span>
        </div>
        <div className="my-2.5">
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full ${getMeterColor(subIndices.heatwaveIndex).split(' ')[0]} rounded-full transition-all duration-500`}
              style={{ width: `${subIndices.heatwaveIndex}%` }}
            />
          </div>
        </div>
        <p className="text-[11px] text-slate-600 font-medium">
          {subIndices.heatwaveIndex > 65 ? 'High thermal stress (कडक ऊन)' : 'Normal temperature (साधारण)'}
        </p>
      </div>

      {/* 4. Flood Hazard */}
      <div className="bg-white border border-slate-200 p-4 rounded-3xl flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <CloudRain className="w-4 h-4 text-cyan-600 shrink-0" /> Flood Hazard (पूर धोका)
          </span>
          <span className={`text-xs font-extrabold ${getMeterColor(subIndices.floodIndex).split(' ')[1]}`}>
            {subIndices.floodIndex}%
          </span>
        </div>
        <div className="my-2.5">
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full ${getMeterColor(subIndices.floodIndex).split(' ')[0]} rounded-full transition-all duration-500`}
              style={{ width: `${subIndices.floodIndex}%` }}
            />
          </div>
        </div>
        <p className="text-[11px] text-slate-600 font-medium">
          {subIndices.floodIndex > 60 ? 'High inundation risk (पाणी साचणे)' : 'Low runoff risk (कमी)'}
        </p>
      </div>

      {/* 5. Pest Threat */}
      <div className="bg-white border border-slate-200 p-4 rounded-3xl flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Bug className="w-4 h-4 text-purple-600 shrink-0" /> Pest Threat (कीड उपद्रव)
          </span>
          <span className={`text-xs font-extrabold ${getMeterColor(subIndices.pestIndex).split(' ')[1]}`}>
            {subIndices.pestIndex}%
          </span>
        </div>
        <div className="my-2.5">
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full ${getMeterColor(subIndices.pestIndex).split(' ')[0]} rounded-full transition-all duration-500`}
              style={{ width: `${subIndices.pestIndex}%` }}
            />
          </div>
        </div>
        <p className="text-[11px] text-slate-600 font-medium">
          {subIndices.pestIndex > 65 ? 'Elevated pest threat (कीड शक्यता)' : 'Controlled humidity (सुरक्षित)'}
        </p>
      </div>

    </div>
  );
}
