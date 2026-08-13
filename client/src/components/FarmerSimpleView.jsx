import React, { useState, useEffect } from 'react';
import { t } from '../data/translations';
import { Sprout, Droplets, Bug, Sun, CloudRain, CloudLightning, Cloud, PhoneCall, ArrowRight, Sparkles, ChevronLeft, ChevronRight, Layers, Snowflake, MapPin, X } from 'lucide-react';
import { fetchLiveWeather } from '../services/realtimeApiService';
import { VILLAGES_DATABASE } from '../data/villages';

export default function FarmerSimpleView({ village, riskMetrics, onSelectCrop, currentLang = 'mr' }) {
  const [selectedCrop, setSelectedCrop] = useState(null); // INITIALLY UNSELECTED
  const [cropStageIndex, setCropStageIndex] = useState(0); // Stage 0 (Crops 1-4) or Stage 1 (Crops 5-8)
  const [liveWeather, setLiveWeather] = useState(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);

  if (!village || !riskMetrics) return null;

  const { overallRiskScore, subIndices } = riskMetrics;

  // Find Neighboring Villages & Talukas in the Same District / Zone for Diverse Regional Rain Mapping
  const regionalRainyVillages = VILLAGES_DATABASE.filter(
    v => v.districtName === village.districtName || v.stateName === village.stateName
  ).slice(0, 5);

  const regionalRainyNames = regionalRainyVillages.map(v => `${v.villageName} (${v.blockName})`).join(', ');

  // Fetch real-time weather integration with loading state
  useEffect(() => {
    if (village) {
      setIsWeatherLoading(true);
      fetchLiveWeather(village.coordinates?.lat || 19.5, village.coordinates?.lng || 74.2, village.villageName)
        .then(data => {
          setLiveWeather(data);
          setIsWeatherLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch live weather:', err);
          setIsWeatherLoading(false);
        });
    }
  }, [village]);

  // Determine Animated Weather Condition Visual State
  const getWeatherConditionType = () => {
    if (liveWeather?.conditionType) return liveWeather.conditionType;
    if (overallRiskScore >= 70) return 'stormy';
    if (subIndices.droughtIndex > 55) return 'sunny';
    if (subIndices.floodIndex > 50) return 'rainy';
    return 'cloudy';
  };

  const conditionType = getWeatherConditionType();
  const currentTemp = liveWeather?.tempC || 32;
  const rainProb = liveWeather?.rainProbability || 20;
  const isRainyCondition = conditionType === 'rainy' || rainProb > 50;

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
    if (!cropName) return null;
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

  const currentActions = selectedCrop ? getCropSpecificActions(selectedCrop) : null;

  // Toggle Crop Selection / Unselect Handler
  const handleCropButtonClick = (crop) => {
    if (selectedCrop === crop) {
      setSelectedCrop(null); // UNSELECT CROP
      if (onSelectCrop) onSelectCrop(null);
    } else {
      setSelectedCrop(crop); // SELECT CROP
      if (onSelectCrop) onSelectCrop(crop);
    }
  };

  return (
    <div className="space-y-5">
      
      {/* 1. YOUTUBE-STYLE SKELETON LOADER OR DYNAMIC WEATHER WIDGET */}
      {isWeatherLoading ? (
        <div className="rounded-3xl bg-slate-200 border border-slate-300 p-5 shadow-md animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-300 shrink-0" />
              <div className="space-y-2">
                <div className="w-28 h-4 bg-slate-300 rounded-md" />
                <div className="w-40 h-6 bg-slate-300 rounded-md" />
              </div>
            </div>
            <div className="w-20 h-9 bg-slate-300 rounded-2xl" />
          </div>
          <div className="w-full h-10 bg-slate-300 rounded-xl" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="h-12 bg-slate-300 rounded-xl" />
            <div className="h-12 bg-slate-300 rounded-xl" />
            <div className="h-12 bg-slate-300 rounded-xl" />
            <div className="h-12 bg-slate-300 rounded-xl" />
          </div>
        </div>
      ) : (
        <div className={`rounded-3xl border shadow-xl overflow-hidden relative transition-all duration-500 text-white ${
          isRainyCondition
            ? 'bg-gradient-to-r from-blue-700 via-teal-700 to-indigo-800 border-blue-400'
            : conditionType === 'sunny'
            ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 border-amber-400'
            : conditionType === 'stormy'
            ? 'bg-gradient-to-r from-purple-800 via-slate-800 to-red-900 border-red-500'
            : 'bg-gradient-to-r from-slate-700 via-teal-800 to-slate-800 border-slate-400'
        }`}>

          {/* A. DYNAMIC BACKGROUND WEATHER ANIMATIONS */}
          {conditionType === 'sunny' && !isRainyCondition && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
              <div className="w-[500px] h-[500px] rounded-full border-[30px] border-amber-200/40 absolute -top-40 -right-40 animate-sunrays" />
            </div>
          )}

          {isRainyCondition && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40 flex justify-around">
              <span className="w-0.5 h-6 bg-cyan-200 rounded-full animate-rain" style={{ animationDelay: '0.1s' }} />
              <span className="w-0.5 h-8 bg-cyan-100 rounded-full animate-rain" style={{ animationDelay: '0.4s' }} />
              <span className="w-0.5 h-6 bg-cyan-300 rounded-full animate-rain" style={{ animationDelay: '0.7s' }} />
              <span className="w-0.5 h-7 bg-cyan-200 rounded-full animate-rain" style={{ animationDelay: '0.2s' }} />
              <span className="w-0.5 h-8 bg-cyan-100 rounded-full animate-rain" style={{ animationDelay: '0.9s' }} />
            </div>
          )}

          {conditionType === 'cloudy' && !isRainyCondition && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 flex justify-between p-4">
              <Snowflake className="w-6 h-6 text-white animate-snow" style={{ animationDelay: '0.2s' }} />
              <Snowflake className="w-8 h-8 text-cyan-200 animate-snow" style={{ animationDelay: '0.8s' }} />
              <Snowflake className="w-5 h-5 text-white animate-snow" style={{ animationDelay: '1.4s' }} />
            </div>
          )}

          {/* B. MAIN WIDGET CONTENT (MOBILE OPTIMIZED - NO TEXT CUT OFF) */}
          <div className="p-4 sm:p-7 relative z-10 space-y-3.5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/20 pb-3.5">
              
              <div className="flex items-start sm:items-center space-x-3 min-w-0 flex-1">
                
                {/* DYNAMIC ANIMATED WEATHER ICON WIDGET */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden">
                  {isRainyCondition ? (
                    <div className="relative flex flex-col items-center justify-center">
                      <CloudRain className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-200 animate-bounce" />
                    </div>
                  ) : conditionType === 'sunny' ? (
                    <div className="relative flex items-center justify-center">
                      <Sun className="w-8 h-8 sm:w-10 sm:h-10 text-amber-200 animate-spin" style={{ animationDuration: '12s' }} />
                      <Sparkles className="w-4 h-4 text-amber-100 absolute animate-pulse" />
                    </div>
                  ) : conditionType === 'stormy' ? (
                    <div className="relative flex items-center justify-center">
                      <CloudLightning className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300 animate-pulse" />
                    </div>
                  ) : (
                    <div className="relative flex items-center justify-center">
                      <Cloud className="w-8 h-8 sm:w-10 sm:h-10 text-slate-100 animate-float" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] sm:text-[11px] font-black uppercase tracking-wider bg-white/20 text-white border border-white/30 backdrop-blur-sm break-words leading-tight">
                      {liveWeather?.source || 'IMD + OpenWeatherMap Live Feed'}
                    </span>
                    <span className="text-xs font-bold text-white/90 break-words">📍 {village.villageName} ({village.districtName})</span>
                  </div>

                  <h2 className="text-lg sm:text-2xl font-black tracking-tight leading-snug break-words">
                    {isRainyCondition
                      ? '🌧️ Rain Alert Today (आज पाऊस पडण्याची शक्यता आहे!)'
                      : conditionType === 'sunny'
                      ? '☀️ Sunny & Clear Sky (निरभ्र आकाश)'
                      : conditionType === 'stormy'
                      ? '⚡ Storm & Lightning Alert (वादळी इशारा)'
                      : '☁️ Partly Cloudy (ढगाळ हवामान)'}
                  </h2>
                  <p className="text-xs sm:text-sm text-white/90 font-semibold mt-0.5 leading-snug break-words">
                    {isRainyCondition
                      ? `Monsoon cloud cover active over ${village.villageName} (${village.blockName}, ${village.districtName})`
                      : liveWeather?.conditionDesc || 'Live Micro-Climate Station Active'}
                  </p>
                </div>
              </div>

              {/* LIVE TEMP & RAIN PROBABILITY DISPLAY */}
              <div className="flex items-center space-x-3 bg-black/20 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 self-start sm:self-auto shrink-0">
                <div className="text-right">
                  <div className="text-[9px] sm:text-[10px] text-white/80 font-bold uppercase tracking-wider">Live Temp (तापमान)</div>
                  <div className="text-base sm:text-xl font-black text-white">{currentTemp}°C</div>
                </div>
                <div className="h-7 w-px bg-white/30" />
                <div>
                  <div className="text-[9px] sm:text-[10px] text-white/80 font-bold uppercase tracking-wider">Rain Prob (पाऊस शक्यता)</div>
                  <div className="text-base sm:text-xl font-black text-cyan-200">{rainProb}%</div>
                </div>
              </div>

            </div>

            {/* C. SPECIFIC RAINY REGIONS & NEIGHBORING TALUKAS ALERT BANNER (MOBILE FULL TEXT WRAPPING) */}
            {isRainyCondition && (
              <div className="bg-cyan-900/50 backdrop-blur-md border border-cyan-300/40 p-3 sm:p-3.5 rounded-2xl flex items-start space-x-3 text-xs font-bold text-cyan-100 shadow-md animate-pulseGlow">
                <div className="w-8 h-8 rounded-xl bg-cyan-400 text-slate-900 flex items-center justify-center font-black shrink-0 shadow-xs mt-0.5">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-950" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-cyan-200 uppercase font-black tracking-wider block">
                    🌧️ Active Rainy Belt & Neighboring Talukas (अचूक पाऊस क्षेत्रे):
                  </span>
                  <p className="text-xs text-white font-black leading-normal mt-0.5 break-words whitespace-normal">
                    Active Rain Belt: <strong>{regionalRainyNames}</strong> ({village.districtName} District)
                  </p>
                </div>
              </div>
            )}

            {/* Quick Weather Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-bold text-slate-900 pt-0.5">
              <div className="bg-white/95 p-2.5 sm:p-3 rounded-2xl border border-white/40 flex items-center space-x-2 shadow-2xs">
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[9px] text-slate-500 uppercase font-black truncate">Drought Risk (दुष्काळ)</div>
                  <div className="text-xs sm:text-sm font-black">{subIndices.droughtIndex > 60 ? 'HIGH (जास्त)' : 'LOW (कमी)'}</div>
                </div>
              </div>
              <div className="bg-white/95 p-2.5 sm:p-3 rounded-2xl border border-white/40 flex items-center space-x-2 shadow-2xs">
                <Droplets className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[9px] text-slate-500 uppercase font-black truncate">Water Supply (पाणी)</div>
                  <div className="text-xs sm:text-sm font-black truncate">{village.groundwaterStatus.split(' ')[0]}</div>
                </div>
              </div>
              <div className="bg-white/95 p-2.5 sm:p-3 rounded-2xl border border-white/40 flex items-center space-x-2 shadow-2xs">
                <Bug className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[9px] text-slate-500 uppercase font-black truncate">Pest Risk (कीड)</div>
                  <div className="text-xs sm:text-sm font-black">{subIndices.pestIndex > 60 ? 'HIGH (जास्त)' : 'SAFE (सुरक्षित)'}</div>
                </div>
              </div>
              <div className="bg-white/95 p-2.5 sm:p-3 rounded-2xl border border-white/40 flex items-center space-x-2 shadow-2xs">
                <Sprout className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[9px] text-slate-500 uppercase font-black truncate">Rainfall (पाऊस)</div>
                  <div className="text-xs sm:text-sm font-black">{village.annualRainfallNormal} mm</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 2. CROP SELECTION WITH TOGGLE UNSELECT FEATURE */}
      <div className="glass-card border border-slate-200/80 p-4 sm:p-6 rounded-3xl shadow-sm space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Sprout className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
              <span>Select Your Crop (आपले पीक निवडा)</span>
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-snug break-words">
              Click a crop to view detailed 4-step action plan. Click again to unselect & hide.
            </p>
          </div>

          {/* MOBILE-STYLE STAGE TRANSITION LINE & PREV/NEXT ARROWS */}
          <div className="flex items-center space-x-2.5 bg-slate-50 border border-slate-200/80 px-2.5 py-1.5 rounded-2xl text-xs font-bold self-start sm:self-auto">
            <div className="flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-[11px] font-black text-slate-800 whitespace-nowrap">
                Stage {cropStageIndex + 1}/{totalCropStages}
              </span>
            </div>

            {/* Indicator Line Bar */}
            <div className="w-20 sm:w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden flex">
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

        {/* 4 CROPS PER STAGE BUTTONS (TOGGLES SELECTION) */}
        <div key={cropStageIndex} className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 animate-slideUp">
          {currentCropStageItems.map(crop => {
            const isSelected = selectedCrop === crop;
            return (
              <button
                key={crop}
                onClick={() => handleCropButtonClick(crop)}
                className={`p-3 rounded-2xl text-left border transition-all duration-300 min-h-[68px] flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-black border-emerald-700 shadow-md scale-[1.02]'
                    : 'bg-slate-50 hover:bg-emerald-50 text-slate-800 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold opacity-80 uppercase tracking-wider">
                    {isSelected ? '✓ Selected' : 'Tap to Select'}
                  </span>
                  {isSelected && <X className="w-3.5 h-3.5 text-white/90 shrink-0" />}
                </div>
                <div className="text-xs sm:text-sm font-black truncate leading-tight mt-1">{crop}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. DYNAMIC 4-STEP ACTION PLAN (ONLY APPEARS WHEN A CROP IS SELECTED! MOBILE OPTIMIZED) */}
      {selectedCrop && currentActions ? (
        <div className="glass-card border border-slate-200/80 p-4 sm:p-6 rounded-3xl shadow-sm space-y-4 transition-all animate-slideUp">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 gap-2">
            <h3 className="text-sm sm:text-lg font-black text-slate-900 flex items-center gap-1.5 leading-snug break-words">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" />
              <span>Key Actions (महत्त्वाचे उपाय) — </span>
              <span className="text-emerald-700 underline decoration-emerald-500/50 break-words">{selectedCrop}</span>:
            </h3>
            
            <button
              onClick={() => setSelectedCrop(null)}
              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">Close Plan (बंद करा)</span>
            </button>
          </div>

          <div key={selectedCrop} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            
            {/* Step 1: Watering */}
            <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl space-y-2 hover:border-emerald-400 transition-all">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-black text-xs shrink-0">
                  1
                </div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug break-words">💧 Watering Management (पाणी नियोजन) ({selectedCrop})</h4>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white p-3 rounded-xl border border-slate-200 shadow-2xs break-words">
                {currentActions.water}
              </p>
            </div>

            {/* Step 2: Soil & Fertilizer */}
            <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl space-y-2 hover:border-emerald-400 transition-all">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xs shrink-0">
                  2
                </div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug break-words">🌱 Soil & Fertilizer Spray (खत फवारणी) ({selectedCrop})</h4>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white p-3 rounded-xl border border-slate-200 shadow-2xs break-words">
                {currentActions.fertilizer}
              </p>
            </div>

            {/* Step 3: Pest Control */}
            <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl space-y-2 hover:border-emerald-400 transition-all">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-black text-xs shrink-0">
                  3
                </div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug break-words">🐛 Insect & Pest Spray (कीड नियंत्रण) ({selectedCrop})</h4>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white p-3 rounded-xl border border-slate-200 shadow-2xs break-words">
                {currentActions.pest}
              </p>
            </div>

            {/* Step 4: Crop Insurance */}
            <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl space-y-2 hover:border-emerald-400 transition-all">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-black text-xs shrink-0">
                  4
                </div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug break-words">🛡️ Crop Insurance Claim (पिक विमा) ({selectedCrop})</h4>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white p-3 rounded-xl border border-slate-200 shadow-2xs break-words">
                {currentActions.insurance}
              </p>
            </div>

          </div>
        </div>
      ) : (
        <div className="p-3.5 bg-slate-100 border border-dashed border-slate-300 rounded-3xl text-center text-xs font-bold text-slate-500 leading-normal">
          💡 Select any crop above to reveal its customized 4-step action plan (महत्त्वाचे उपाय).
        </div>
      )}

      {/* 4. HELPLINE CARD */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 p-4 sm:p-5 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white text-emerald-700 flex items-center justify-center shrink-0 shadow-sm">
            <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-base font-black leading-tight">Kisan Call Centre Helpline (किसान कॉल सेंटर हेल्पलाइन)</h4>
            <p className="text-[11px] sm:text-xs font-semibold text-emerald-100 leading-tight mt-0.5">Free Government Helpline for Farmers (मोफत शासकीय हेल्पलाइन)</p>
          </div>
        </div>

        <a
          href="tel:18001801551"
          className="px-4 py-2 sm:px-5 sm:py-2.5 bg-white text-emerald-800 font-black text-xs rounded-xl shadow-sm hover:bg-emerald-50 transition-all shrink-0 flex items-center space-x-2"
        >
          <span>Call 1800-180-1551 (कॉल करा)</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </a>
      </div>

    </div>
  );
}
