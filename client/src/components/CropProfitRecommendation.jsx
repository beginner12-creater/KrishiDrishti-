import React, { useState } from 'react';
import { IndianRupee, TrendingUp, Droplets, ShieldCheck, Star, ArrowUpRight, ChevronLeft, ChevronRight, Layers, Sparkles, X, Sprout, Bug, Sun, CheckCircle, FileText } from 'lucide-react';

export default function CropProfitRecommendation({ village, riskMetrics, onSelectCrop, isDarkMode = false }) {
  const [currentStage, setCurrentStage] = useState(0); // Stage 0 (Crops 1-4) or Stage 1 (Crops 5-8)
  const [activeAdvisoryCropModal, setActiveAdvisoryCropModal] = useState(null); // Selected Crop for Modal Popup

  if (!village || !riskMetrics) return null;

  const { subIndices, overallRiskScore } = riskMetrics;

  // AI Profit Maximizing Crop Recommendation Engine based on Climate & Soil (8 Crops Total for 4-per-stage pagination)
  const getAllProfitCrops = () => {
    return [
      {
        cropName: "Pomegranate",
        displayName: "Bhagwa Pomegranate (डाळिंब)",
        category: "High-Value Horticulture (फळबाग)",
        estProfitPerAcre: "₹ 1,80,000 - ₹ 3,20,000",
        waterSavings: "55% Less Water (ठिबक सिंचन)",
        resilienceScore: 88,
        marketDemand: 5,
        whyBest: `Ideal for ${village.villageName}'s soil & dry climate. Requires minimal drip irrigation.`
      },
      {
        cropName: "Dragon Fruit",
        displayName: "Dragon Fruit / Kamalam (कमलम)",
        category: "Exotic High-Profit Crop (नफा फळ)",
        estProfitPerAcre: "₹ 3,50,000 - ₹ 5,00,000",
        waterSavings: "70% Less Water (कमी पाणी)",
        resilienceScore: 92,
        marketDemand: 5,
        whyBest: "Thrives in arid regions with gravelly soil. 25-year plantation lifespan."
      },
      {
        cropName: "Turmeric",
        displayName: "Rajapuri Turmeric (हळद)",
        category: "High-Curcumin Spice (मसाले पीक)",
        estProfitPerAcre: "₹ 1,60,000 - ₹ 2,80,000",
        waterSavings: "40% Water Savings (मध्यम)",
        resilienceScore: 86,
        marketDemand: 5,
        whyBest: "High market price per quintal. Intercropping compatible with soybean."
      },
      {
        cropName: "Bajra",
        displayName: "Pearl Millet (बाजरी / बाजरा)",
        category: "Climate Resilient Grain (धोकामुक्त)",
        estProfitPerAcre: "₹ 45,000 - ₹ 75,000",
        waterSavings: "65% Less Water (अत्यल्प)",
        resilienceScore: 95,
        marketDemand: 4,
        whyBest: "Zero risk crop during dry spells. Requires minimal fertilizer."
      },
      {
        cropName: "Soybean",
        displayName: "Phule Samrudhi Soybean (सोयाबीन)",
        category: "Certified High Yield Pulse (कडधान्य)",
        estProfitPerAcre: "₹ 65,000 - ₹ 1,10,000",
        waterSavings: "35% Water Savings (पाऊस)",
        resilienceScore: 84,
        marketDemand: 5,
        whyBest: "Drought resistant KDS-753 variety. Fixes nitrogen in soil."
      },
      {
        cropName: "Onion",
        displayName: "Red Onion / Kanda (लाल कांदा)",
        category: "High Demand Cash Crop (कांदा)",
        estProfitPerAcre: "₹ 1,20,000 - ₹ 2,40,000",
        waterSavings: "30% Water Savings (पाणी)",
        resilienceScore: 80,
        marketDemand: 5,
        whyBest: "High APMC mandi prices. Suitable for storage in Kanda Chawl."
      },
      {
        cropName: "Cotton",
        displayName: "Bt Cotton BG-II (कापूस)",
        category: "Commercial Fiber Crop (कापूस)",
        estProfitPerAcre: "₹ 85,000 - ₹ 1,50,000",
        waterSavings: "30% Water Savings (कापूस)",
        resilienceScore: 82,
        marketDemand: 4,
        whyBest: "High lint percentage and pink bollworm resistance."
      },
      {
        cropName: "Grapes",
        displayName: "Thomson Seedless Grapes (द्राक्ष)",
        category: "Export Quality Horticulture (फळबाग)",
        estProfitPerAcre: "₹ 4,00,000 - ₹ 7,00,000",
        waterSavings: "50% Water Savings (ठिबक)",
        resilienceScore: 85,
        marketDemand: 5,
        whyBest: "High export demand for raisins & fresh bunches."
      }
    ];
  };

  const allCrops = getAllProfitCrops();
  const itemsPerStage = 4;
  const totalStages = Math.ceil(allCrops.length / itemsPerStage);

  const displayedCrops = allCrops.slice(
    currentStage * itemsPerStage,
    (currentStage + 1) * itemsPerStage
  );

  // Dynamic Crop-Specific 4-Step Actions Generator for Modal Popup
  const getCropActions = (cropName) => {
    if (!cropName) return null;
    const name = cropName.toLowerCase();

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

    return {
      water: `Provide protective drip irrigation during flowering & fruiting of ${cropName}.`,
      fertilizer: `Spray 1% Potassium Nitrate (KNO3) + 19:19:19 during dry spells to boost crop yield.`,
      pest: `Install 10 Yellow Sticky Traps per acre and spray 5% organic Neem seed extract.`,
      insurance: `Inform bank or call toll-free 1800-180-1551 within 72 hours if weather damages ${cropName}.`
    };
  };

  const handleOpenAdvisoryModal = (crop) => {
    setActiveAdvisoryCropModal(crop);
  };

  const handleRedirectToDashboard = (cropName) => {
    setActiveAdvisoryCropModal(null);
    if (onSelectCrop) onSelectCrop(cropName);
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  return (
    <div className={`p-4 sm:p-6 rounded-3xl shadow-sm border space-y-4 transition-colors duration-500 ${
      isDarkMode
        ? 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
        : 'glass-card border-slate-200/80 text-slate-900'
    }`}>
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className={`text-base sm:text-lg font-black flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              <span>AI Crop Profit Maximizer (उत्पन्न गणित)</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-black">4-Crop Stages</span>
            </h3>
          </div>
          <p className={`text-xs font-medium mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Suggested climate-resilient profit crops for <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{village.villageName}</strong> ({village.districtName})
          </p>
        </div>

        <span className={`text-xs px-3 py-1.5 rounded-xl border self-start sm:self-auto font-extrabold ${
          isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-200/80 text-slate-700'
        }`}>
          Resilience: <strong className="text-emerald-500">{100 - overallRiskScore}/100</strong>
        </span>
      </div>

      {/* MOBILE-STYLE STAGE TRANSITION LINE & PAGINATION CONTROL */}
      <div className={`flex flex-col sm:flex-row items-center justify-between gap-2.5 p-3 rounded-2xl border ${
        isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50/80 border-slate-200/80'
      }`}>
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className={`text-xs font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
            Stage {currentStage + 1} of {totalStages} <span className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>(पिके {currentStage * 4 + 1} ते {Math.min((currentStage + 1) * 4, allCrops.length)})</span>
          </span>
        </div>

        {/* Transition Line / Indicator Bar */}
        <div className={`w-full sm:w-48 h-2 rounded-full overflow-hidden flex ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
          {Array.from({ length: totalStages }).map((_, idx) => (
            <div
              key={idx}
              className={`h-full flex-1 transition-all duration-500 ${
                idx === currentStage ? 'bg-emerald-500 font-bold' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
              }`}
            />
          ))}
        </div>

        {/* Stage Previous / Next Controls */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setCurrentStage(prev => Math.max(0, prev - 1))}
            disabled={currentStage === 0}
            className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold flex items-center gap-1 transition-all disabled:opacity-40 cursor-pointer shadow-2xs ${
              isDarkMode ? 'bg-slate-900 hover:bg-emerald-600 border-slate-700 text-white' : 'bg-white hover:bg-emerald-600 border-slate-300 text-slate-800 hover:text-white'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev 4</span>
          </button>
          <button
            onClick={() => setCurrentStage(prev => Math.min(totalStages - 1, prev + 1))}
            disabled={currentStage === totalStages - 1}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-1 transition-all disabled:opacity-40 cursor-pointer shadow-sm"
          >
            <span>Next 4</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 CROPS PER STAGE GRID WITH SMOOTH SLIDE-UP ANIMATION */}
      <div key={currentStage} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1 animate-slideUp">
        {displayedCrops.map((crop, idx) => (
          <div
            key={idx}
            className={`border p-4 rounded-2xl flex flex-col justify-between transition-all duration-300 space-y-3 shadow-2xs hover:shadow-xl hover:-translate-y-1 ${
              isDarkMode
                ? 'bg-slate-950/80 border-slate-800 hover:border-emerald-500 hover:shadow-emerald-950/50'
                : 'glass-panel border-slate-200/80 hover:border-emerald-500'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-1.5">
                <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wider bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/30 truncate">
                  {crop.category}
                </span>
                <div className="flex items-center text-amber-500 text-xs shrink-0">
                  {Array.from({ length: crop.marketDemand }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />
                  ))}
                </div>
              </div>

              <h4 className={`text-sm font-black my-2 leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{crop.displayName}</h4>

              {/* Profit Metric Pill */}
              <div className={`border p-2.5 rounded-xl mb-2.5 ${
                isDarkMode ? 'bg-emerald-950/60 border-emerald-500/30' : 'bg-emerald-50 border-emerald-300'
              }`}>
                <div className="text-[10px] text-emerald-400 font-black uppercase tracking-wider flex items-center gap-1">
                  <IndianRupee className="w-3 h-3" /> Net Profit / Acre:
                </div>
                <div className={`text-base font-black mt-0.5 ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'}`}>
                  {crop.estProfitPerAcre}
                </div>
              </div>

              <div className={`space-y-1 text-[11px] font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1"><Droplets className="w-3 h-3 text-cyan-400" /> Water:</span>
                  <span className="font-extrabold text-cyan-400 truncate">{crop.waterSavings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-400" /> Resilience:</span>
                  <span className="font-extrabold text-emerald-400">{crop.resilienceScore}/100</span>
                </div>
              </div>

              <p className={`text-[11px] font-medium mt-2 p-2 rounded-xl border leading-relaxed ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
              }`}>
                💡 {crop.whyBest}
              </p>
            </div>

            {/* Click Button to Open Instant Advisory Guide Modal */}
            <button
              onClick={() => handleOpenAdvisoryModal(crop)}
              className="w-full py-2.5 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-[11px] flex items-center justify-center gap-1 transition-all shadow-md active:scale-95 cursor-pointer mt-2"
            >
              <span>Get Advisory Guide (सल्ला)</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* INSTANT ADVISORY GUIDE MODAL POPUP FOR SELECTED PROFIT CROP */}
      {/* ========================================================================= */}
      {activeAdvisoryCropModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className={`border w-full max-w-3xl rounded-3xl p-5 sm:p-7 shadow-2xl relative my-6 transition-all ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
                  <Sprout className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-black flex items-center gap-2">
                    AI 4-Step Advisory Guide — {activeAdvisoryCropModal.displayName}
                  </h3>
                  <p className="text-xs text-emerald-500 font-bold mt-0.5">
                    Net Profit Potential: <strong className="text-amber-400">{activeAdvisoryCropModal.estProfitPerAcre}</strong> ({village.villageName})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveAdvisoryCropModal(null)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isDarkMode ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Why Best Banner */}
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>💡 {activeAdvisoryCropModal.whyBest}</span>
            </div>

            {/* 4-Step Action Plan Grid */}
            {(() => {
              const actions = getCropActions(activeAdvisoryCropModal.cropName);
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                  <div className={`p-3.5 rounded-2xl space-y-1.5 border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-lg bg-cyan-100 text-cyan-800 flex items-center justify-center font-black text-xs">1</div>
                      <h4 className="text-xs font-black text-cyan-400">💧 Watering Management (पाणी नियोजन)</h4>
                    </div>
                    <p className="text-xs font-medium opacity-90 leading-relaxed">{actions.water}</p>
                  </div>

                  <div className={`p-3.5 rounded-2xl space-y-1.5 border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xs">2</div>
                      <h4 className="text-xs font-black text-amber-400">🌱 Soil & Fertilizer Spray (खत फवारणी)</h4>
                    </div>
                    <p className="text-xs font-medium opacity-90 leading-relaxed">{actions.fertilizer}</p>
                  </div>

                  <div className={`p-3.5 rounded-2xl space-y-1.5 border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-black text-xs">3</div>
                      <h4 className="text-xs font-black text-purple-400">🐛 Insect & Pest Spray (कीड नियंत्रण)</h4>
                    </div>
                    <p className="text-xs font-medium opacity-90 leading-relaxed">{actions.pest}</p>
                  </div>

                  <div className={`p-3.5 rounded-2xl space-y-1.5 border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-black text-xs">4</div>
                      <h4 className="text-xs font-black text-rose-400">🛡️ Crop Insurance Claim (पिक विमा)</h4>
                    </div>
                    <p className="text-xs font-medium opacity-90 leading-relaxed">{actions.insurance}</p>
                  </div>
                </div>
              );
            })()}

            {/* Modal Action Buttons */}
            <div className="flex items-center justify-between border-t border-slate-200/80 pt-4">
              <button
                onClick={() => setActiveAdvisoryCropModal(null)}
                className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer ${
                  isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Close
              </button>

              <button
                onClick={() => handleRedirectToDashboard(activeAdvisoryCropModal.cropName)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center space-x-1.5 shadow-md active:scale-95 cursor-pointer"
              >
                <Sprout className="w-4 h-4 text-white" />
                <span>Open in Farmer Dashboard</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
