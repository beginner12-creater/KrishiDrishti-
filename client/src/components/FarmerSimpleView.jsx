import React, { useState, useEffect } from 'react';
import { t } from '../data/translations';
import { Sprout, Droplets, Bug, Sun, CloudRain, CloudLightning, Cloud, PhoneCall, ArrowRight, Sparkles, ChevronLeft, ChevronRight, Layers, Snowflake, MapPin, X } from 'lucide-react';
import { fetchLiveWeather } from '../services/realtimeApiService';
import { VILLAGES_DATABASE } from '../data/villages';

export default function FarmerSimpleView({ village, riskMetrics, onSelectCrop, currentLang = 'mr', isDarkMode = false, selectedCrop: selectedCropProp = null }) {
  const [selectedCrop, setSelectedCrop] = useState(selectedCropProp); // Sync with initial prop
  const [cropStageIndex, setCropStageIndex] = useState(0); // Stage 0 (Crops 1-4) or Stage 1 (Crops 5-8)
  const [liveWeather, setLiveWeather] = useState(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);

  // Sync internal selectedCrop state when selectedCropProp from parent/CropProfitRecommendation changes
  useEffect(() => {
    if (selectedCropProp) {
      setSelectedCrop(selectedCropProp);
    }
  }, [selectedCropProp]);

  if (!village || !riskMetrics) return null;

  const { overallRiskScore, subIndices } = riskMetrics;

  // Find Neighboring Villages & Talukas in the Same District / Zone for Diverse Regional Rain Mapping
  const regionalRainyVillages = VILLAGES_DATABASE.filter(
    v => v.districtName === village.districtName || v.stateName === village.stateName
  ).slice(0, 5);

  const lat = village?.coordinates?.latitude || 20.3888;
  const lng = village?.coordinates?.longitude || 78.1204;

  // Initial Load of Real-Time Live Weather API from Open-Meteo
  useEffect(() => {
    let isMounted = true;
    async function loadWeatherData() {
      setIsWeatherLoading(true);
      try {
        const data = await fetchLiveWeather(lat, lng, village.villageName);
        if (isMounted && data) {
          setLiveWeather(data);
        }
      } catch (err) {
        console.error('Failed to load live weather:', err);
      } finally {
        if (isMounted) setIsWeatherLoading(false);
      }
    }
    loadWeatherData();
    return () => { isMounted = false; };
  }, [lat, lng, village.villageName]);

  const conditionType = liveWeather?.conditionType || 'sunny';
  const currentTemp = liveWeather?.tempC || 32;
  const rainProb = liveWeather?.rainProbability || 20;
  const isRainyCondition = conditionType === 'rainy' || rainProb > 50;

  // Full Expanded Catalog of 8 Crops for 4-per-stage space saving
  const availableCropsCatalog = Array.from(new Set([
    ...(village.primaryCrops || ['Cotton', 'Soybean', 'Sugarcane', 'Onion']),
    'Pomegranate', 'Dragon Fruit', 'Turmeric', 'Grapes', 'Bajra', 'Wheat', 'Rice'
  ])).slice(0, 8);

  const itemsPerPage = 4; // 4 crops per stage
  const totalCropStages = Math.ceil(availableCropsCatalog.length / itemsPerPage);

  const currentCropStageItems = availableCropsCatalog.slice(
    cropStageIndex * itemsPerPage,
    (cropStageIndex + 1) * itemsPerPage
  );

  // Dynamic Crop-Specific 4-Step Actions Engine (100% CUSTOM FOR EVERY CROP)
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
    if (name.includes('dragon') || name.includes('कमलम') || name.includes('ड्रॅगन')) {
      return {
        water: "Requires minimal drip watering (2-4 liters/pole/day). Avoid waterlogging around trellis.",
        fertilizer: "Apply 10kg Vermicompost + SSP + Micronutrient spray every 3 months for heavy fruiting.",
        pest: "Spray Copper Fungicide (2g/L) for Stem Rot & Anthracnose during humid monsoon.",
        insurance: "Enroll under PMFBY horticulture scheme for trellis storm damage protection."
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
    if (name.includes('turmeric') || name.includes('हळद')) {
      return {
        water: "Maintain moist soil during rhizome development stage. Drip irrigation every 3 days.",
        fertilizer: "Apply Potash (60kg/acre) + Azospirillum bio-fertilizer for high curcumin content.",
        pest: "Spray Mancozeb (2.5g/L) against Leaf Blotch and Rhizome Rot fungal infection.",
        insurance: "Report field flooding (>48h) to PMFBY for rhizome decay compensation."
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
    if (name.includes('bajra') || name.includes('बाजरी') || name.includes('बाजरा')) {
      return {
        water: "Requires only 1-2 protective irrigations. Highly drought tolerant.",
        fertilizer: "Apply 40kg Nitrogen/acre split into sowing and tillering stage.",
        pest: "Spray Metalaxyl (2g/L) against Downy Mildew & Ergot earhead disease.",
        insurance: "Claim PMFBY insurance if severe dry spell causes grain filling failure."
      };
    }
    if (name.includes('wheat') || name.includes('गहू')) {
      return {
        water: "Ensure critical irrigations at Crown Root Initiation (21 days) and Grain Filling stage.",
        fertilizer: "Top dress Urea + Zinc Sulphate before second irrigation.",
        pest: "Spray Propiconazole 25% EC (1ml/L) against Yellow Rust fungal disease.",
        insurance: "Report March heatwaves causing early grain shrinking to crop insurance."
      };
    }
    if (name.includes('rice') || name.includes('भात') || name.includes('तांदूळ')) {
      return {
        water: "Maintain 2-3 cm standing water during tillering and panicle initiation.",
        fertilizer: "Apply Neem Coated Urea in 3 split doses for high grain yield.",
        pest: "Install Pheromone Traps for Stem Borer; spray Cartap Hydrochloride.",
        insurance: "Report monsoon dry spell or flash floods damaging paddy nurseries."
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

    return {
      water: `Provide protective drip irrigation during flowering & fruiting of ${cropName}.`,
      fertilizer: `Spray 1% Potassium Nitrate (KNO3) + 19:19:19 during dry spells to boost crop yield.`,
      pest: `Install 10 Yellow Sticky Traps per acre and spray 5% organic Neem seed extract.`,
      insurance: `Inform bank or call toll-free 1800-180-1551 within 72 hours if weather damages ${cropName}.`
    };
  };

  const currentActions = selectedCrop ? getCropSpecificActions(selectedCrop) : null;

  // Toggle Crop Selection / Unselect Handler
  const handleCropButtonClick = (crop) => {
    if (selectedCrop === crop) {
      setSelectedCrop(null);
      if (onSelectCrop) onSelectCrop(null);
    } else {
      setSelectedCrop(crop);
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
              <div className="w-96 h-96 rounded-full bg-amber-300/40 blur-3xl absolute -top-20 -right-20 animate-pulse" />
            </div>
          )}

          {isRainyCondition && (
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] animate-pulse" />
          )}

          {/* B. MAIN WEATHER HEADER BAR */}
          <div className="p-4 sm:p-6 space-y-4 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shrink-0 shadow-md">
                  {isRainyCondition ? (
                    <CloudRain className="w-7 h-7 text-cyan-200 animate-bounce" />
                  ) : conditionType === 'sunny' ? (
                    <Sun className="w-7 h-7 text-amber-200 animate-spin" style={{ animationDuration: '25s' }} />
                  ) : conditionType === 'stormy' ? (
                    <CloudLightning className="w-7 h-7 text-yellow-300 animate-pulse" />
                  ) : (
                    <Cloud className="w-7 h-7 text-teal-200" />
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/30">
                      📍 {village.villageName} ({village.blockName})
                    </span>
                    <span className="text-[10px] font-bold text-white/80 hidden sm:inline-block">
                      {liveWeather?.source || 'Realtime Open-Meteo Feed'}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-3xl font-black mt-1 leading-tight flex items-baseline space-x-2">
                    <span>{currentTemp}°C</span>
                    <span className="text-xs sm:text-sm font-bold opacity-90 truncate font-sans">
                      • {liveWeather?.conditionDesc || 'Clear Sunshine'}
                    </span>
                  </h2>
                </div>
              </div>

              {/* Rain Risk Badge */}
              <div className="bg-white/15 backdrop-blur-md border border-white/25 px-3.5 py-2 rounded-2xl flex items-center space-x-2 self-start sm:self-auto shadow-xs">
                <CloudRain className="w-4 h-4 text-cyan-200 shrink-0" />
                <div>
                  <div className="text-[9px] uppercase font-black opacity-80 leading-none">Rain Expectation (पाऊस अंदाज)</div>
                  <div className="text-xs sm:text-sm font-black mt-0.5">{rainProb}% Chance</div>
                </div>
              </div>

            </div>

            {/* Quick Weather Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-bold text-slate-900 pt-0.5">
              <div className="bg-white/95 p-2.5 sm:p-3 rounded-2xl border border-white/40 flex items-center space-x-2 shadow-2xs">
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[9px] text-slate-500 uppercase font-black truncate">Drought Risk (दुष्काळ)</div>
                  <div className="text-xs sm:text-sm font-black">{subIndices.droughtIndex > 60 ? 'HIGH RISK (जास्त)' : 'LOW RISK (कमी)'}</div>
                </div>
              </div>
              <div className="bg-white/95 p-2.5 sm:p-3 rounded-2xl border border-white/40 flex items-center space-x-2 shadow-2xs">
                <Droplets className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[9px] text-slate-500 uppercase font-black truncate">Water Level (पाणी)</div>
                  <div className="text-xs sm:text-sm font-black truncate">{village.groundwaterStatus}</div>
                </div>
              </div>
              <div className="bg-white/95 p-2.5 sm:p-3 rounded-2xl border border-white/40 flex items-center space-x-2 shadow-2xs">
                <Bug className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[9px] text-slate-500 uppercase font-black truncate">Pest Risk (कीड)</div>
                  <div className="text-xs sm:text-sm font-black">{subIndices.pestIndex > 60 ? 'HIGH RISK (जास्त)' : 'SAFE (सुरक्षित)'}</div>
                </div>
              </div>
              <div className="bg-white/95 p-2.5 sm:p-3 rounded-2xl border border-white/40 flex items-center space-x-2 shadow-2xs">
                <Sprout className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[9px] text-slate-500 uppercase font-black truncate">Annual Rain Level (वार्षिक पाऊस प्रमाण)</div>
                  <div className="text-xs sm:text-sm font-black">{village.annualRainfallNormal} mm/yr</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 2. CROP SELECTION WITH TOGGLE UNSELECT FEATURE */}
      <div className={`p-4 sm:p-6 rounded-3xl shadow-sm space-y-3.5 border transition-colors duration-500 ${
        isDarkMode
          ? 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
          : 'glass-card border-slate-200/80 text-slate-900'
      }`}>
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b ${
          isDarkMode ? 'border-slate-800' : 'border-slate-100'
        }`}>
          <div>
            <h3 className={`text-sm sm:text-lg font-black flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              <Sprout className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 shrink-0" />
              <span>Select Your Crop (आपले पीक निवडा)</span>
            </h3>
            <p className={`text-[11px] font-medium mt-0.5 leading-snug break-words ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Click a crop to view detailed 4-step action plan. Click again to unselect & hide.
            </p>
          </div>

          {/* MOBILE-STYLE STAGE TRANSITION LINE & PREV/NEXT ARROWS */}
          <div className={`flex items-center space-x-2.5 px-2.5 py-1.5 rounded-2xl text-xs font-bold self-start sm:self-auto border ${
            isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200/80 text-slate-800'
          }`}>
            <div className="flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className={`text-[11px] font-black whitespace-nowrap ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                Stage {cropStageIndex + 1}/{totalCropStages}
              </span>
            </div>

            {/* Indicator Line Bar */}
            <div className={`w-20 sm:w-32 h-1.5 rounded-full overflow-hidden flex ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
              {Array.from({ length: totalCropStages }).map((_, idx) => (
                <div
                  key={idx}
                  className={`h-full flex-1 transition-all duration-500 ${
                    idx === cropStageIndex ? 'bg-emerald-500 font-bold' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>

            {/* Prev/Next Controls */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCropStageIndex(prev => Math.max(0, prev - 1))}
                disabled={cropStageIndex === 0}
                className={`p-1 rounded-lg transition-all disabled:opacity-40 cursor-pointer shadow-2xs ${
                  isDarkMode ? 'bg-slate-800 hover:bg-emerald-600 border-slate-700 text-white' : 'bg-white hover:bg-emerald-600 border-slate-300 text-slate-700 hover:text-white'
                }`}
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
                    ? 'bg-emerald-600 text-white font-black border-emerald-700 shadow-lg scale-[1.02]'
                    : isDarkMode
                    ? 'bg-slate-950 hover:bg-slate-800 text-emerald-300 border-slate-800 hover:border-emerald-500 hover:shadow-emerald-950'
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

      {/* 3. DYNAMIC 4-STEP ACTION PLAN (100% DYNAMIC & CUSTOM FOR EVERY CROP!) */}
      {selectedCrop && currentActions ? (
        <div className={`p-4 sm:p-6 rounded-3xl shadow-sm space-y-4 border transition-all animate-slideUp ${
          isDarkMode
            ? 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
            : 'glass-card border-slate-200/80 text-slate-900'
        }`}>
          <div className={`flex items-center justify-between border-b pb-3 gap-2 ${
            isDarkMode ? 'border-slate-800' : 'border-slate-100'
          }`}>
            <h3 className={`text-sm sm:text-lg font-black flex items-center gap-1.5 leading-snug break-words ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" />
              <span>Key Actions (महत्त्वाचे उपाय) — </span>
              <span className="text-emerald-400 underline decoration-emerald-500/50 break-words">{selectedCrop}</span>:
            </h3>
            
            <button
              onClick={() => {
                setSelectedCrop(null);
                if (onSelectCrop) onSelectCrop(null);
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
                isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <X className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">Close Plan (बंद करा)</span>
            </button>
          </div>

          <div key={selectedCrop} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            
            {/* Step 1: Watering */}
            <div className={`p-3.5 rounded-2xl space-y-2 border transition-all ${
              isDarkMode ? 'bg-slate-950 border-slate-800 hover:border-emerald-500' : 'bg-slate-50 border-slate-200/80 hover:border-emerald-400'
            }`}>
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-black text-xs shrink-0">
                  1
                </div>
                <h4 className={`text-xs sm:text-sm font-black leading-snug break-words ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>💧 Watering Management (पाणी नियोजन) ({selectedCrop})</h4>
              </div>
              <p className={`text-xs font-medium leading-relaxed p-3 rounded-xl border shadow-2xs break-words ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
              }`}>
                {currentActions.water}
              </p>
            </div>

            {/* Step 2: Soil & Fertilizer */}
            <div className={`p-3.5 rounded-2xl space-y-2 border transition-all ${
              isDarkMode ? 'bg-slate-950 border-slate-800 hover:border-emerald-500' : 'bg-slate-50 border-slate-200/80 hover:border-emerald-400'
            }`}>
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xs shrink-0">
                  2
                </div>
                <h4 className={`text-xs sm:text-sm font-black leading-snug break-words ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>🌱 Soil & Fertilizer Spray (खत फवारणी) ({selectedCrop})</h4>
              </div>
              <p className={`text-xs font-medium leading-relaxed p-3 rounded-xl border shadow-2xs break-words ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
              }`}>
                {currentActions.fertilizer}
              </p>
            </div>

            {/* Step 3: Pest Control */}
            <div className={`p-3.5 rounded-2xl space-y-2 border transition-all ${
              isDarkMode ? 'bg-slate-950 border-slate-800 hover:border-emerald-500' : 'bg-slate-50 border-slate-200/80 hover:border-emerald-400'
            }`}>
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-black text-xs shrink-0">
                  3
                </div>
                <h4 className={`text-xs sm:text-sm font-black leading-snug break-words ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>🐛 Insect & Pest Spray (कीड नियंत्रण) ({selectedCrop})</h4>
              </div>
              <p className={`text-xs font-medium leading-relaxed p-3 rounded-xl border shadow-2xs break-words ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
              }`}>
                {currentActions.pest}
              </p>
            </div>

            {/* Step 4: Crop Insurance */}
            <div className={`p-3.5 rounded-2xl space-y-2 border transition-all ${
              isDarkMode ? 'bg-slate-950 border-slate-800 hover:border-emerald-500' : 'bg-slate-50 border-slate-200/80 hover:border-emerald-400'
            }`}>
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-black text-xs shrink-0">
                  4
                </div>
                <h4 className={`text-xs sm:text-sm font-black leading-snug break-words ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>🛡️ Crop Insurance Claim (पिक विमा) ({selectedCrop})</h4>
              </div>
              <p className={`text-xs font-medium leading-relaxed p-3 rounded-xl border shadow-2xs break-words ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
              }`}>
                {currentActions.insurance}
              </p>
            </div>

          </div>
        </div>
      ) : (
        <div className={`p-3.5 rounded-3xl text-center text-xs font-bold leading-normal border border-dashed ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-300 text-slate-500'
        }`}>
          💡 Select any crop above to reveal its customized 4-step action plan (महत्त्वाचे उपाय).
        </div>
      )}

    </div>
  );
}
