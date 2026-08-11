import React, { useState } from 'react';
import { t } from '../data/translations';
import { Sprout, Droplets, Bug, Sun, PhoneCall, ArrowRight, Sparkles, ChevronLeft, ChevronRight, Layers } from 'lucide-react';

export default function FarmerSimpleView({ village, riskMetrics, onSelectCrop, currentLang = 'mr' }) {
  const [selectedCrop, setSelectedCrop] = useState(village?.primaryCrops[0] || 'Cotton');
  const [cropStageIndex, setCropStageIndex] = useState(0); // Stage 0 (Crops 1-4) or Stage 1 (Crops 5-8)

  if (!village || !riskMetrics) return null;

  const { overallRiskScore, subIndices } = riskMetrics;

  // Weather Risk Status
  const getSimpleStatus = (score) => {
    if (score >= 70) return { title: '🔴 HIGH RISK (धोका)', desc: 'Weather alert! Take crop protection steps below.', cardBg: 'bg-red-50 border-red-200 text-red-900', badgeBg: 'bg-red-100 text-red-800 border-red-300' };
    if (score >= 45) return { title: '🟡 MODERATE RISK (काळजी घ्या)', desc: 'Weather requires care. Follow simple crop advice.', cardBg: 'bg-amber-50 border-amber-200 text-amber-900', badgeBg: 'bg-amber-100 text-amber-800 border-amber-300' };
    return { title: '🟢 GOOD CONDITIONS (सुरक्षित)', desc: 'Weather is favorable. Regular crop care recommended.', cardBg: 'bg-emerald-50 border-emerald-200 text-emerald-950', badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
  };

  const status = getSimpleStatus(overallRiskScore);

  // Full Expanded Catalog of 8 Crops for 4-per-stage space saving
  const availableCropsCatalog = [
    ...(village.primaryCrops || ['Cotton', 'Soybean', 'Sugarcane', 'Onion']),
    'Pomegranate', 'Grapes', 'Turmeric', 'Bajra'
  ].slice(0, 8);

  const itemsPerPage = 4; // 4 crops per stage
  const totalCropStages = Math.ceil(availableCropsCatalog.length / itemsPerPage);

  const currentCropStageItems = availableCropsCatalog.slice(
    cropStageIndex * itemsPerPage,
    (cropStageIndex + 1) * itemsPerPage
  );

  // Dynamic Crop-Specific 4-Step Actions Engine
  const getCropSpecificActions = (cropName) => {
    const name = cropName.toLowerCase();

    if (name.includes('cotton') || name.includes('कापूस')) {
      return {
        water: "Give light water during flowering & boll formation. Keep soil drained.",
        fertilizer: "Spray 1% MgSO4 + 19:19:19 to keep leaves green and stop reddening.",
        pest: "Hang 8 Pink Bollworm traps/acre. Spray 5% organic Neem seed extract.",
        insurance: "Inform bank within 72 hours if unseasonal rain damages open cotton."
      };
    }
    if (name.includes('soybean') || name.includes('सोयाबीन')) {
      return {
        water: "Irrigate during pod initiation and pod filling stage if rain delays.",
        fertilizer: "Spray 2% DAP or Potassium Nitrate at pod stage for bigger seeds.",
        pest: "Watch for Girdle Beetle. Spray Chlorantraniliprole 18.5% SC (3ml/10L).",
        insurance: "Inform bank within 72 hours if drought causes pod shedding."
      };
    }
    if (name.includes('sugarcane') || name.includes('ऊस')) {
      return {
        water: "Drip irrigate every 4-6 days. Cover soil with dry trash to save water.",
        fertilizer: "Apply Zinc Sulphate + Ferrous Sulphate to prevent yellow leaves.",
        pest: "Release Trichogramma parasite cards against Early Shoot Borer.",
        insurance: "Report flood waterlogging (>48 hours) to bank for insurance."
      };
    }
    if (name.includes('pomegranate') || name.includes('डाळिंब') || name.includes('अनार')) {
      return {
        water: "Give 20-30 liters water/tree/day through drip. Avoid irregular watering.",
        fertilizer: "Spray Calcium Nitrate (3g/L) + Boron (1g/L) to prevent fruit cracking.",
        pest: "Spray Copper Oxychloride (2.5g/L) for Bacterial Oily Spot (Telya).",
        insurance: "Report hailstorms within 72 hours if fruit skins are damaged."
      };
    }
    if (name.includes('onion') || name.includes('कांदा')) {
      return {
        water: "Stop watering 15 days before harvest for longer storage life.",
        fertilizer: "Apply Sulphur 80% (3g/L) for dark red onion color and pungency.",
        pest: "Spray Fipronil 5% SC (2ml/L) for Thrips. Hang yellow sticky cards.",
        insurance: "Report unseasonal rain rotting harvested onions in field within 72h."
      };
    }
    if (name.includes('grape') || name.includes('द्राक्ष') || name.includes('अंगूर')) {
      return {
        water: "Regulate drip watering strictly according to berry development stage.",
        fertilizer: "Spray Gibberellic Acid (GA3) for uniform berry elongation.",
        pest: "Spray Potassium Bicarbonate (5g/L) for Downy Mildew disease.",
        insurance: "Claim insurance if Oct-Nov unseasonal rains damage grape bunches."
      };
    }

    return {
      water: `Provide protective irrigation during flowering & fruiting of ${cropName}.`,
      fertilizer: `Spray 1% Potassium Nitrate (KNO3) during hot dry spells to protect leaves.`,
      pest: `Install 8 Sticky Traps per acre and spray 5% organic Neem seed extract.`,
      insurance: `Inform bank or call toll-free 1800-180-1551 within 72 hours if weather damages crop.`
    };
  };

  const currentActions = getCropSpecificActions(selectedCrop);

  const handleCropButtonClick = (crop) => {
    setSelectedCrop(crop);
    if (onSelectCrop) onSelectCrop(crop);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. FRONT HERO WEATHER STATUS BANNER */}
      <div className={`p-5 sm:p-7 rounded-3xl border shadow-sm space-y-4 transition-all ${status.cardBg}`}>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className={`px-3 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${status.badgeBg}`}>
                🌾 शेतकरी मार्गदर्शक / Farmer Guide
              </span>
              <span className="text-xs font-bold text-slate-700">📍 {village.villageName} ({village.districtName})</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {status.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 font-medium mt-0.5">
              {status.desc}
            </p>
          </div>
        </div>

        {/* Quick Weather Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-bold pt-1">
          <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center space-x-2.5 shadow-2xs">
            <Sun className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-500">{t('drought', currentLang)} (दुष्काळ)</div>
              <div className="text-sm font-black text-slate-900">{subIndices.droughtIndex > 60 ? t('high', currentLang) : t('low', currentLang)}</div>
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center space-x-2.5 shadow-2xs">
            <Droplets className="w-5 h-5 text-cyan-600 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-500">{t('water', currentLang)} (पाणी)</div>
              <div className="text-sm font-black text-slate-900">{village.groundwaterStatus.split(' ')[0]}</div>
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center space-x-2.5 shadow-2xs">
            <Bug className="w-5 h-5 text-purple-600 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-500">{t('pestRisk', currentLang)} (कीड)</div>
              <div className="text-sm font-black text-slate-900">{subIndices.pestIndex > 60 ? t('high', currentLang) : t('safe', currentLang)}</div>
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center space-x-2.5 shadow-2xs">
            <Sprout className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-500">{t('rainfall', currentLang)} (पाऊस)</div>
              <div className="text-sm font-black text-slate-900">{village.annualRainfallNormal} mm</div>
            </div>
          </div>
        </div>

      </div>

      {/* 2. CROP SELECTION WITH MOBILE-STYLE PAGINATED TRANSITION LINE SLIDER */}
      <div className="glass-card border border-slate-200/80 p-5 sm:p-6 rounded-3xl shadow-sm space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-100">
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-600" />
            {t('selectCropTitle', currentLang)} <span className="text-xs font-bold text-emerald-700">(पिक निवडा)</span>
          </h3>

          {/* MOBILE-STYLE STAGE TRANSITION LINE & PREV/NEXT ARROWS */}
          <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-2xl text-xs font-bold">
            <div className="flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-[11px] font-black text-slate-800">
                Stage {cropStageIndex + 1}/{totalCropStages}
              </span>
            </div>

            {/* Indicator Line Bar */}
            <div className="w-24 sm:w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden flex">
              {Array.from({ length: totalCropStages }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-full flex-1 transition-all duration-500 ${
                    idx === cropStageIndex ? 'bg-emerald-600 font-bold' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>

            {/* Prev/Next Controls */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCropStageIndex(prev => Math.max(0, prev - 1))}
                disabled={cropStageIndex === 0}
                className="p-1 rounded-lg bg-white hover:bg-emerald-600 hover:text-white border border-slate-300 text-slate-700 transition-all disabled:opacity-40 cursor-pointer shadow-2xs"
                aria-label="Previous 4 Crops"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCropStageIndex(prev => Math.min(totalCropStages - 1, prev + 1))}
                disabled={cropStageIndex === totalCropStages - 1}
                className="p-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all disabled:opacity-40 cursor-pointer shadow-2xs"
                aria-label="Next 4 Crops"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 CROPS PER STAGE BUTTONS */}
        <div key={cropStageIndex} className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 animate-slideUp">
          {currentCropStageItems.map(crop => {
            const isSelected = selectedCrop === crop;
            return (
              <button
                key={crop}
                onClick={() => handleCropButtonClick(crop)}
                className={`p-3.5 rounded-2xl text-left border transition-all duration-300 min-h-[72px] flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-black border-emerald-700 shadow-md scale-[1.02]'
                    : 'bg-slate-50 hover:bg-emerald-50 text-slate-800 border-slate-200'
                }`}
              >
                <div className="text-[10px] font-bold opacity-80 uppercase tracking-wider">Crop Selection</div>
                <div className="text-sm font-black truncate">{crop}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. DYNAMIC 4-STEP ACTION PLAN FOR SELECTED CROP */}
      <div className="glass-card border border-slate-200/80 p-5 sm:p-6 rounded-3xl shadow-sm space-y-4 transition-all">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            {t('keyActionsTitle', currentLang)} <span className="text-emerald-700 underline decoration-emerald-500/50">{selectedCrop}</span>:
          </h3>
          <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-0.5 rounded-full border border-emerald-300 font-extrabold hidden sm:inline">
            {t('adviceFor', currentLang)} {selectedCrop}
          </span>
        </div>

        <div key={selectedCrop} className="grid grid-cols-1 md:grid-cols-2 gap-3.5 animate-slideUp">
          
          {/* Step 1: Watering */}
          <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-2 hover:border-emerald-400 transition-all">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-black text-sm">
                1
              </div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900">💧 {t('watering', currentLang)} ({selectedCrop})</h4>
            </div>
            <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              {currentActions.water}
            </p>
          </div>

          {/* Step 2: Soil & Fertilizer */}
          <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-2 hover:border-emerald-400 transition-all">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm">
                2
              </div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900">🌱 {t('soilSpray', currentLang)} ({selectedCrop})</h4>
            </div>
            <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              {currentActions.fertilizer}
            </p>
          </div>

          {/* Step 3: Pest Control */}
          <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-2 hover:border-emerald-400 transition-all">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-black text-sm">
                3
              </div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900">🐛 {t('insectSpray', currentLang)} ({selectedCrop})</h4>
            </div>
            <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              {currentActions.pest}
            </p>
          </div>

          {/* Step 4: Crop Insurance */}
          <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-2 hover:border-emerald-400 transition-all">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-black text-sm">
                4
              </div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900">🛡️ {t('cropInsurance', currentLang)} ({selectedCrop})</h4>
            </div>
            <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              {currentActions.insurance}
            </p>
          </div>

        </div>
      </div>

      {/* 4. HELPLINE CARD */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 p-5 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-white text-emerald-700 flex items-center justify-center shrink-0 shadow-sm">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-black">{t('helplineTitle', currentLang)}</h4>
            <p className="text-xs font-semibold text-emerald-100">{t('helplineSub', currentLang)}</p>
          </div>
        </div>

        <a
          href="tel:18001801551"
          className="px-5 py-2.5 bg-white text-emerald-800 font-black text-xs rounded-xl shadow-sm hover:bg-emerald-50 transition-all shrink-0 flex items-center space-x-2"
        >
          <span>{t('callNow', currentLang)}</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

    </div>
  );
}
