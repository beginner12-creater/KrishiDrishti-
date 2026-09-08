import React, { useState, useEffect } from 'react';
import { Sprout, Droplets, Bug, Sun, CloudRain, CloudLightning, Cloud, PhoneCall, ArrowRight, Sparkles, ChevronLeft, ChevronRight, Layers, Snowflake, MapPin, X, AlertTriangle, ShieldAlert, XCircle, Sliders, Truck } from 'lucide-react';
import { fetchLiveWeather } from '../services/realtimeApiService';
import BioClimaticRiskCard from './BioClimaticRiskCard';
import FieldTrafficabilityMatrix from './FieldTrafficabilityMatrix';
import ActionTriggerDisasterProtocols from './ActionTriggerDisasterProtocols';
import DecadalClimateBaselines from './DecadalClimateBaselines';
import { useLanguage } from '../context/LanguageContext';

export default function FarmerSimpleView({ village, riskMetrics, onSelectCrop, farmContext, onChangeFarmContext, isDarkMode = false, selectedCrop: selectedCropProp = null }) {
  const { language, t } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState(selectedCropProp || farmContext?.crop || 'Cotton');
  const [cropStageIndex, setCropStageIndex] = useState(0);
  const [liveWeather, setLiveWeather] = useState(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);

  // Sync internal selectedCrop with farmContext.crop or selectedCropProp
  useEffect(() => {
    if (selectedCropProp) {
      setSelectedCrop(selectedCropProp);
    } else if (farmContext?.crop) {
      setSelectedCrop(farmContext.crop);
    }
  }, [selectedCropProp, farmContext?.crop]);

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
  const currentTemp = liveWeather?.tempC || 34;
  const rainProb = liveWeather?.rainProbability || 45;

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
    const stage = farmContext?.phenologyStage || 'Flowering';

    if (name.includes('cotton') || name.includes('कापूस')) {
      return {
        water: `Give light water during ${stage.split(' ')[0]} stage. Keep soil drained in ${farmContext?.soilType || 'Black Clay'}.`,
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
        water: `Irrigate during ${stage.split(' ')[0]} stage if rain delays.`,
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

    return {
      water: `Provide protective drip irrigation during ${stage.split(' ')[0]} stage of ${cropName}.`,
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
      if (onChangeFarmContext) onChangeFarmContext({ ...farmContext, crop });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. HERO WIDGET: CROP HEALTH & BIO-CLIMATIC RISK INDEX CARD */}
      <BioClimaticRiskCard
        village={village}
        riskMetrics={riskMetrics}
        liveWeather={liveWeather}
        farmContext={farmContext}
        isDarkMode={isDarkMode}
      />

      {/* 2. DAILY MANDI RATES & APMC MARKET RADAR */}
      <MandiRatesSection
        village={village}
        selectedCrop={selectedCrop}
        isDarkMode={isDarkMode}
      />

      {/* 3. OPERATIONAL DECISION & FIELD TRAFFICABILITY MATRIX */}
      <FieldTrafficabilityMatrix
        village={village}
        riskMetrics={riskMetrics}
        liveWeather={liveWeather}
        farmContext={farmContext}
        isDarkMode={isDarkMode}
      />

      {/* 4. AGRO-ACTION TRIGGERS & LOSS PREVENTION PROTOCOLS (MITIGATION CHECKLIST) */}
      <ActionTriggerDisasterProtocols
        village={village}
        riskMetrics={riskMetrics}
        liveWeather={liveWeather}
        farmContext={farmContext}
        isDarkMode={isDarkMode}
      />

      {/* 5. PHENOLOGY-STAGE CROP SELECTION & ADVISORY WITH WHAT NOT TO DO RULES */}
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
              <span>Phenology-Stage Crop Strategy (आपले पीक व टप्पा निवडा)</span>
            </h3>
            <p className={`text-[11px] font-medium mt-0.5 leading-snug break-words ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Click any crop to inspect stage-specific action plan & <strong>What NOT to Do</strong> rules for <strong>{farmContext?.phenologyStage?.split(' ')[0]}</strong> stage.
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
          {currentCropStageItems.map(cropItem => {
            const isSelected = selectedCrop === cropItem;
            return (
              <button
                key={cropItem}
                onClick={() => handleCropButtonClick(cropItem)}
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
                <div className="text-xs sm:text-sm font-black truncate leading-tight mt-1">{cropItem}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* DYNAMIC ACTION PLAN & WHAT NOT TO DO CARDS */}
      {selectedCrop && currentActions && (
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
              <span>Phenology Strategy ({farmContext?.phenologyStage?.split(' ')[0]}) — </span>
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
      )}

      {/* 6. DECADAL CLIMATE BASELINES & VARIETAL SUITABILITY TAB */}
      <DecadalClimateBaselines
        village={village}
        riskMetrics={riskMetrics}
        farmContext={farmContext}
        isDarkMode={isDarkMode}
      />

    </div>
  );
}
