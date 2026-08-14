import React, { useState, useEffect } from 'react';
import { t } from '../data/translations';
import { Sprout, Droplets, Bug, Sun, CloudRain, CloudLightning, Cloud, PhoneCall, ArrowRight, Sparkles, ChevronLeft, ChevronRight, Layers, Snowflake, MapPin, X, AlertTriangle, ShieldAlert, XCircle } from 'lucide-react';
import { fetchLiveWeather } from '../services/realtimeApiService';
import { VILLAGES_DATABASE } from '../data/villages';

export default function FarmerSimpleView({ village, riskMetrics, onSelectCrop, currentLang = 'mr', isDarkMode = false, selectedCrop: selectedCropProp = null }) {
  const [selectedCrop, setSelectedCrop] = useState(selectedCropProp);
  const [cropStageIndex, setCropStageIndex] = useState(0);
  const [liveWeather, setLiveWeather] = useState(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);

  useEffect(() => {
    if (selectedCropProp) {
      setSelectedCrop(selectedCropProp);
    }
  }, [selectedCropProp]);

  if (!village || !riskMetrics) return null;

  const { overallRiskScore, subIndices } = riskMetrics;

  const lat = village?.coordinates?.latitude || 20.3888;
  const lng = village?.coordinates?.longitude || 78.1204;

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

  const availableCropsCatalog = Array.from(new Set([
    ...(village.primaryCrops || ['Cotton', 'Soybean', 'Sugarcane', 'Onion']),
    'Pomegranate', 'Dragon Fruit', 'Turmeric', 'Grapes', 'Bajra', 'Wheat', 'Rice'
  ])).slice(0, 8);

  const itemsPerPage = 4;
  const totalCropStages = Math.ceil(availableCropsCatalog.length / itemsPerPage);

  const currentCropStageItems = availableCropsCatalog.slice(
    cropStageIndex * itemsPerPage,
    (cropStageIndex + 1) * itemsPerPage
  );

  // Dynamic Crop-Specific 4-Step Actions & WHAT NOT TO DO Engine
  const getCropSpecificActions = (cropName) => {
    if (!cropName) return null;
    const name = cropName.toLowerCase();

    if (name.includes('cotton') || name.includes('कापूस')) {
      return {
        water: "Give light water during flowering & boll formation. Keep soil drained.",
        fertilizer: "Spray 1% MgSO4 + 19:19:19 to keep leaves green and stop reddening.",
        pest: "Hang 8 Pink Bollworm traps/acre. Spray 5% organic Neem seed extract.",
        insurance: "Inform bank within 72 hours if unseasonal rain damages open cotton.",
        notToDo: [
          "❌ DO NOT flood irrigate during flowering (causes severe flower square shedding).",
          "❌ DO NOT over-apply excess Urea (attracts Pink Bollworm & sucking pests).",
          "❌ DO NOT leave open cotton bolls exposed to rain; cover immediately with tarpaulin."
        ]
      };
    }
    if (name.includes('soybean') || name.includes('सोयाबीन')) {
      return {
        water: "Irrigate during pod initiation and pod filling stage if rain delays.",
        fertilizer: "Spray 2% DAP or Potassium Nitrate at pod stage for bigger seeds.",
        pest: "Watch for Girdle Beetle. Spray Chlorantraniliprole 18.5% SC (3ml/10L).",
        insurance: "Inform bank within 72 hours if drought causes pod shedding.",
        notToDo: [
          "❌ DO NOT deep plow topsoil prior to sowing (destroys vital seedbed moisture).",
          "❌ DO NOT delay harvest past R8 pod maturity (causes 25% pod shattering losses).",
          "❌ DO NOT spray chemical weedicides during afternoon heat (>35°C)."
        ]
      };
    }
    if (name.includes('dragon') || name.includes('कमलम') || name.includes('ड्रॅगन')) {
      return {
        water: "Requires minimal drip watering (2-4 liters/pole/day). Avoid waterlogging around trellis.",
        fertilizer: "Apply 10kg Vermicompost + SSP + Micronutrient spray every 3 months for heavy fruiting.",
        pest: "Spray Copper Fungicide (2g/L) for Stem Rot & Anthracnose during humid monsoon.",
        insurance: "Enroll under PMFBY horticulture scheme for trellis storm damage protection.",
        notToDo: [
          "❌ DO NOT allow standing water around RCC trellis poles (causes fatal stem crown rot).",
          "❌ DO NOT apply raw uncomposted animal manure directly at the stem base.",
          "❌ DO NOT prune main vertical stem until it climbs above the top ring structure."
        ]
      };
    }
    if (name.includes('pomegranate') || name.includes('डाळिंब') || name.includes('अनार')) {
      return {
        water: "Give 20-30 liters water/tree/day through drip. Avoid irregular watering.",
        fertilizer: "Spray Calcium Nitrate (3g/L) + Boron (1g/L) to prevent fruit cracking.",
        pest: "Spray Copper Oxychloride (2.5g/L) for Bacterial Oily Spot (Telya).",
        insurance: "Report hailstorms within 72 hours if fruit skins are damaged.",
        notToDo: [
          "❌ DO NOT give sudden heavy irrigation after a dry spell (causes 90% fruit cracking).",
          "❌ DO NOT force continuous Bahar flowering without giving 2 months tree rest.",
          "❌ DO NOT ignore initial Telya oily spot symptoms on leaves or stems."
        ]
      };
    }
    if (name.includes('turmeric') || name.includes('हळद')) {
      return {
        water: "Maintain moist soil during rhizome development stage. Drip irrigation every 3 days.",
        fertilizer: "Apply Potash (60kg/acre) + Azospirillum bio-fertilizer for high curcumin content.",
        pest: "Spray Mancozeb (2.5g/L) against Leaf Blotch and Rhizome Rot fungal infection.",
        insurance: "Report field flooding (>48h) to PMFBY for rhizome decay compensation.",
        notToDo: [
          "❌ DO NOT plant on flat beds without drainage channels (causes severe Rhizome Rot).",
          "❌ DO NOT leave harvested turmeric rhizomes under direct burning sun.",
          "❌ DO NOT apply excess chemical Nitrogen during late rhizome bulking stage."
        ]
      };
    }
    if (name.includes('onion') || name.includes('कांदा')) {
      return {
        water: "Stop watering 15 days before harvest for longer storage life.",
        fertilizer: "Apply Sulphur 80% (3g/L) for dark red onion color and pungency.",
        pest: "Spray Fipronil 5% SC (2ml/L) for Thrips. Hang yellow sticky cards.",
        insurance: "Report unseasonal rain rotting harvested onions in field within 72h.",
        notToDo: [
          "❌ DO NOT irrigate within 15 days of harvesting (causes neck rot during storage).",
          "❌ DO NOT heap fresh green onions in direct field sun without shade curing.",
          "❌ DO NOT apply Nitrogen fertilizers after bulb initiation stage."
        ]
      };
    }
    if (name.includes('grape') || name.includes('द्राक्ष') || name.includes('अंगूर')) {
      return {
        water: "Regulate drip watering strictly according to berry development stage.",
        fertilizer: "Spray Gibberellic Acid (GA3) for uniform berry elongation.",
        pest: "Spray Potassium Bicarbonate (5g/L) for Downy Mildew disease.",
        insurance: "Claim insurance if Oct-Nov unseasonal rains damage grape bunches.",
        notToDo: [
          "❌ DO NOT use overhead sprinklers during flowering & fruit setting.",
          "❌ DO NOT over-dose Gibberellic Acid (GA3) beyond recommended ppm limits.",
          "❌ DO NOT delay fungal spray after unseasonal morning dew or rainfall."
        ]
      };
    }
    if (name.includes('bajra') || name.includes('बाजरी') || name.includes('बाजरा')) {
      return {
        water: "Requires only 1-2 protective irrigations. Highly drought tolerant.",
        fertilizer: "Apply 40kg Nitrogen/acre split into sowing and tillering stage.",
        pest: "Spray Metalaxyl (2g/L) against Downy Mildew & Ergot earhead disease.",
        insurance: "Claim PMFBY insurance if severe dry spell causes grain filling failure.",
        notToDo: [
          "❌ DO NOT over-water or allow field waterlogging (causes rapid seedling rot).",
          "❌ DO NOT store harvested bajra grains with >12% moisture content."
        ]
      };
    }
    if (name.includes('wheat') || name.includes('गहू')) {
      return {
        water: "Ensure critical irrigations at Crown Root Initiation (21 days) and Grain Filling stage.",
        fertilizer: "Top dress Urea + Zinc Sulphate before second irrigation.",
        pest: "Spray Propiconazole 25% EC (1ml/L) against Yellow Rust fungal disease.",
        insurance: "Report March heatwaves causing early grain shrinking to crop insurance.",
        notToDo: [
          "❌ DO NOT skip the Crown Root Initiation (CRI) 21-day irrigation (causes 30% yield loss).",
          "❌ DO NOT flood irrigate on high wind days (causes heavy crop lodging/falling)."
        ]
      };
    }
    if (name.includes('rice') || name.includes('भात') || name.includes('तांदूळ')) {
      return {
        water: "Maintain 2-3 cm standing water during tillering and panicle initiation.",
        fertilizer: "Apply Neem Coated Urea in 3 split doses for high grain yield.",
        pest: "Install Pheromone Traps for Stem Borer; spray Cartap Hydrochloride.",
        insurance: "Report monsoon dry spell or flash floods damaging paddy nurseries.",
        notToDo: [
          "❌ DO NOT allow fields to dry out during panicle initiation stage.",
          "❌ DO NOT apply excess Urea during high humidity spells (attracts leaf blast)."
        ]
      };
    }

    return {
      water: `Provide protective drip irrigation during flowering & fruiting of ${cropName}.`,
      fertilizer: `Spray 1% Potassium Nitrate (KNO3) + 19:19:19 during dry spells to boost crop yield.`,
      pest: `Install 10 Yellow Sticky Traps per acre and spray 5% organic Neem seed extract.`,
      insurance: `Inform bank or call toll-free 1800-180-1551 within 72 hours if weather damages ${cropName}.`,
      notToDo: [
        `❌ DO NOT flood irrigate during extreme heatwaves to prevent root shock.`,
        `❌ DO NOT apply uncalibrated chemical sprays without jar testing.`,
        `❌ DO NOT delay reporting weather damage to PMFBY past 72 hours.`
      ]
    };
  };

  const currentActions = selectedCrop ? getCropSpecificActions(selectedCrop) : null;

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
      
      {/* 1. WEATHER WIDGET WITH FULL DYNAMIC BACKGROUND ANIMATIONS */}
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

          {/* DYNAMIC BACKGROUND WEATHER ANIMATIONS */}
          {conditionType === 'sunny' && !isRainyCondition && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
              <div className="w-96 h-96 rounded-full bg-amber-300/40 blur-3xl absolute -top-20 -right-20 animate-pulse" />
              <div className="w-64 h-64 rounded-full bg-orange-400/30 blur-2xl absolute -bottom-10 -left-10 animate-spin" style={{ animationDuration: '30s' }} />
            </div>
          )}

          {isRainyCondition && (
            <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#38bdf8_1.5px,transparent_1.5px)] [background-size:14px_14px] animate-pulse" />
          )}

          {conditionType === 'stormy' && (
            <div className="absolute inset-0 pointer-events-none opacity-25 bg-yellow-400/20 animate-ping" />
          )}

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
                    <Cloud className="w-7 h-7 text-teal-200 animate-pulse" />
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

              <div className="bg-white/15 backdrop-blur-md border border-white/25 px-3.5 py-2 rounded-2xl flex items-center space-x-2 self-start sm:self-auto shadow-xs">
                <CloudRain className="w-4 h-4 text-cyan-200 shrink-0 animate-bounce" />
                <div>
                  <div className="text-[9px] uppercase font-black opacity-80 leading-none">Rain Expectation (पाऊस अंदाज)</div>
                  <div className="text-xs sm:text-sm font-black mt-0.5">{rainProb}% Chance</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-bold text-slate-900 pt-0.5">
              <div className="bg-white/95 p-2.5 sm:p-3 rounded-2xl border border-white/40 flex items-center space-x-2 shadow-2xs">
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0 animate-spin" style={{ animationDuration: '15s' }} />
                <div className="min-w-0">
                  <div className="text-[9px] text-slate-500 uppercase font-black truncate">Drought Risk</div>
                  <div className="text-xs sm:text-sm font-black">{subIndices.droughtIndex > 60 ? 'HIGH RISK' : 'LOW RISK'}</div>
                </div>
              </div>
              <div className="bg-white/95 p-2.5 sm:p-3 rounded-2xl border border-white/40 flex items-center space-x-2 shadow-2xs">
                <Droplets className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600 shrink-0 animate-pulse" />
                <div className="min-w-0">
                  <div className="text-[9px] text-slate-500 uppercase font-black truncate">Water Level</div>
                  <div className="text-xs sm:text-sm font-black truncate">{village.groundwaterStatus}</div>
                </div>
              </div>
              <div className="bg-white/95 p-2.5 sm:p-3 rounded-2xl border border-white/40 flex items-center space-x-2 shadow-2xs">
                <Bug className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[9px] text-slate-500 uppercase font-black truncate">Pest Risk</div>
                  <div className="text-xs sm:text-sm font-black">{subIndices.pestIndex > 60 ? 'HIGH RISK' : 'SAFE'}</div>
                </div>
              </div>
              <div className="bg-white/95 p-2.5 sm:p-3 rounded-2xl border border-white/40 flex items-center space-x-2 shadow-2xs">
                <Sprout className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[9px] text-slate-500 uppercase font-black truncate">Annual Rain</div>
                  <div className="text-xs sm:text-sm font-black">{village.annualRainfallNormal} mm/yr</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 2. CROP SELECTION */}
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
              Click a crop to view detailed action plan and <strong>What NOT to Do</strong> guidelines.
            </p>
          </div>

          <div className={`flex items-center space-x-2.5 px-2.5 py-1.5 rounded-2xl text-xs font-bold self-start sm:self-auto border ${
            isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200/80 text-slate-800'
          }`}>
            <div className="flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className={`text-[11px] font-black whitespace-nowrap ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                Stage {cropStageIndex + 1}/{totalCropStages}
              </span>
            </div>

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

      {/* 3. DYNAMIC 4-STEP ACTION PLAN + WHAT NOT TO DO SECTION */}
      {selectedCrop && currentActions ? (
        <div className={`p-4 sm:p-6 rounded-3xl shadow-sm space-y-5 border transition-all animate-slideUp ${
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
              <span className="whitespace-nowrap">Close Plan</span>
            </button>
          </div>

          <div key={selectedCrop} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            
            <div className={`p-3.5 rounded-2xl space-y-2 border transition-all ${
              isDarkMode ? 'bg-slate-950 border-slate-800 hover:border-emerald-500' : 'bg-slate-50 border-slate-200/80 hover:border-emerald-400'
            }`}>
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-black text-xs shrink-0">
                  1
                </div>
                <h4 className={`text-xs sm:text-sm font-black leading-snug break-words ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>💧 Watering Management ({selectedCrop})</h4>
              </div>
              <p className={`text-xs font-medium leading-relaxed p-3 rounded-xl border shadow-2xs break-words ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
              }`}>
                {currentActions.water}
              </p>
            </div>

            <div className={`p-3.5 rounded-2xl space-y-2 border transition-all ${
              isDarkMode ? 'bg-slate-950 border-slate-800 hover:border-emerald-500' : 'bg-slate-50 border-slate-200/80 hover:border-emerald-400'
            }`}>
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xs shrink-0">
                  2
                </div>
                <h4 className={`text-xs sm:text-sm font-black leading-snug break-words ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>🌱 Soil & Fertilizer Spray ({selectedCrop})</h4>
              </div>
              <p className={`text-xs font-medium leading-relaxed p-3 rounded-xl border shadow-2xs break-words ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
              }`}>
                {currentActions.fertilizer}
              </p>
            </div>

            <div className={`p-3.5 rounded-2xl space-y-2 border transition-all ${
              isDarkMode ? 'bg-slate-950 border-slate-800 hover:border-emerald-500' : 'bg-slate-50 border-slate-200/80 hover:border-emerald-400'
            }`}>
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-black text-xs shrink-0">
                  3
                </div>
                <h4 className={`text-xs sm:text-sm font-black leading-snug break-words ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>🐛 Insect & Pest Spray ({selectedCrop})</h4>
              </div>
              <p className={`text-xs font-medium leading-relaxed p-3 rounded-xl border shadow-2xs break-words ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
              }`}>
                {currentActions.pest}
              </p>
            </div>

            <div className={`p-3.5 rounded-2xl space-y-2 border transition-all ${
              isDarkMode ? 'bg-slate-950 border-slate-800 hover:border-emerald-500' : 'bg-slate-50 border-slate-200/80 hover:border-emerald-400'
            }`}>
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-black text-xs shrink-0">
                  4
                </div>
                <h4 className={`text-xs sm:text-sm font-black leading-snug break-words ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>🛡️ Crop Insurance Claim ({selectedCrop})</h4>
              </div>
              <p className={`text-xs font-medium leading-relaxed p-3 rounded-xl border shadow-2xs break-words ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
              }`}>
                {currentActions.insurance}
              </p>
            </div>

          </div>

          {currentActions.notToDo && (
            <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/50 text-white space-y-2.5 animate-slideUp shadow-lg">
              <div className="flex items-center space-x-2 text-rose-300 font-black text-xs sm:text-sm">
                <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>🚫 WHAT NOT TO DO / PRACTICES TO AVOID (काय करू नये — {selectedCrop}):</span>
              </div>
              <div className="space-y-1.5 text-xs font-bold font-mono">
                {currentActions.notToDo.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-900/80 border border-rose-500/30 text-rose-200 leading-snug">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      ) : (
        <div className={`p-3.5 rounded-3xl text-center text-xs font-bold leading-normal border border-dashed ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-300 text-slate-500'
        }`}>
          💡 Select any crop above to reveal its customized 4-step action plan & What NOT to Do rules.
        </div>
      )}

    </div>
  );
}
