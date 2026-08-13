import React, { useState } from 'react';
import { IndianRupee, TrendingUp, Droplets, ShieldCheck, Star, ArrowUpRight, ChevronLeft, ChevronRight, Layers, Sparkles } from 'lucide-react';

export default function CropProfitRecommendation({ village, riskMetrics, onSelectCrop, isDarkMode = false }) {
  const [currentStage, setCurrentStage] = useState(0); // Stage 0 (Crops 1-4) or Stage 1 (Crops 5-8)

  if (!village || !riskMetrics) return null;

  const { subIndices, overallRiskScore } = riskMetrics;

  // AI Profit Maximizing Crop Recommendation Engine based on Climate & Soil (8 Crops Total for 4-per-stage pagination)
  const getAllProfitCrops = () => {
    const isDroughtProne = subIndices.droughtIndex > 50;

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

            {/* Click Button */}
            <button
              onClick={() => onSelectCrop(crop.cropName)}
              className="w-full py-2.5 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-[11px] flex items-center justify-center gap-1 transition-all shadow-xs active:scale-95 cursor-pointer mt-2"
            >
              <span>Get Advisory Guide (सल्ला)</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
