import React, { useState } from 'react';
import { IndianRupee, TrendingUp, Droplets, ShieldCheck, Star, ArrowUpRight, ChevronLeft, ChevronRight, Layers, Sparkles } from 'lucide-react';

export default function CropProfitRecommendation({ village, riskMetrics, onSelectCrop }) {
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
        waterSavings: "65% Less Water (कमी पाणी)",
        resilienceScore: 94,
        marketDemand: 4,
        whyBest: "Requires only 2 protective irrigations. High demand for healthy millet flour."
      },
      {
        cropName: "Guava",
        displayName: "VNR Bihi Guava (पेरू फळबाग)",
        category: "High-Density Horticulture (सघन फळबाग)",
        estProfitPerAcre: "₹ 2,00,000 - ₹ 3,50,000",
        waterSavings: "50% Less Water (कमी पाणी)",
        resilienceScore: 91,
        marketDemand: 5,
        whyBest: "Bears fruit within 1.5 years. High price per kg for Jumbo 500g fruit."
      },
      {
        cropName: "Grapes",
        displayName: "Export Quality Grapes (द्राक्ष बागा)",
        category: "Export Cash Crop (निर्यात पीक)",
        estProfitPerAcre: "₹ 2,50,000 - ₹ 4,50,000",
        waterSavings: "Precision Drip (ठिबक सिंचन)",
        resilienceScore: 82,
        marketDemand: 5,
        whyBest: `Suited for ${village.districtName}'s climate. High returns from raisin processing.`
      },
      {
        cropName: "Soybean",
        displayName: "Soybean + Pigeonpea (सोयाबीन + तूर)",
        category: "Intercropping (आंतरपीक पद्धत)",
        estProfitPerAcre: "₹ 70,000 - ₹ 1,20,000",
        waterSavings: "35% Water Savings (पाणी बचत)",
        resilienceScore: 89,
        marketDemand: 4,
        whyBest: "Double income security. Pigeonpea acts as climate buffer during dry spells."
      },
      {
        cropName: "Cashew Nut",
        displayName: "Cashew Nut (काजू बागायती)",
        category: "Plantation Crop (फळबाग)",
        estProfitPerAcre: "₹ 1,50,000 - ₹ 2,40,000",
        waterSavings: "Rainfed Plantation (पावसावर)",
        resilienceScore: 90,
        marketDemand: 5,
        whyBest: "Low maintenance with high export market demand."
      }
    ];
  };

  const allCrops = getAllProfitCrops();
  const itemsPerPage = 4; // 4 crops per stage for space saving
  const totalStages = Math.ceil(allCrops.length / itemsPerPage);

  const displayedCrops = allCrops.slice(
    currentStage * itemsPerPage,
    (currentStage + 1) * itemsPerPage
  );

  return (
    <div className="glass-card border border-slate-200/80 p-5 sm:p-6 rounded-3xl mb-6 shadow-sm space-y-4 transition-all duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              Profit-Maximizing Crops <span className="text-xs font-bold text-amber-700">(अधिक नफा देणारी पिके)</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-black">4-Crop Stages</span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Suggested climate-resilient profit crops for <strong className="text-slate-900">{village.villageName}</strong> ({village.districtName})
          </p>
        </div>

        <span className="text-xs text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/80 self-start sm:self-auto font-extrabold">
          Resilience: <strong className="text-emerald-700">{100 - overallRiskScore}/100</strong>
        </span>
      </div>

      {/* MOBILE-STYLE STAGE TRANSITION LINE & PAGINATION CONTROL */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-slate-50/80 border border-slate-200/80 p-3 rounded-2xl">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-xs font-black text-slate-800">
            Stage {currentStage + 1} of {totalStages} <span className="text-[11px] text-slate-500 font-bold">(पिके {currentStage * 4 + 1} ते {Math.min((currentStage + 1) * 4, allCrops.length)})</span>
          </span>
        </div>

        {/* Transition Line / Indicator Bar */}
        <div className="w-full sm:w-48 h-2 bg-slate-200 rounded-full overflow-hidden flex">
          {Array.from({ length: totalStages }).map((_, idx) => (
            <div
              key={idx}
              className={`h-full flex-1 transition-all duration-500 ${
                idx === currentStage ? 'bg-emerald-600 font-bold' : 'bg-slate-300'
              }`}
            />
          ))}
        </div>

        {/* Stage Previous / Next Controls */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setCurrentStage(prev => Math.max(0, prev - 1))}
            disabled={currentStage === 0}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-600 hover:text-white border border-slate-300 text-slate-800 text-xs font-extrabold flex items-center gap-1 transition-all disabled:opacity-40 cursor-pointer shadow-2xs"
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
            className="glass-panel border border-slate-200/80 p-4 rounded-2xl flex flex-col justify-between hover:border-emerald-500 transition-all duration-300 space-y-3 shadow-2xs hover:shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between gap-1.5">
                <span className="text-[10px] font-black text-emerald-900 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300 truncate">
                  {crop.category}
                </span>
                <div className="flex items-center text-amber-500 text-xs shrink-0">
                  {Array.from({ length: crop.marketDemand }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-500" />
                  ))}
                </div>
              </div>

              <h4 className="text-sm font-black text-slate-900 my-2 leading-tight">{crop.displayName}</h4>

              {/* Profit Metric Pill */}
              <div className="bg-emerald-50 border border-emerald-300 p-2.5 rounded-xl mb-2.5">
                <div className="text-[10px] text-emerald-900 font-black uppercase tracking-wider flex items-center gap-1">
                  <IndianRupee className="w-3 h-3" /> Net Profit / Acre:
                </div>
                <div className="text-base font-black text-emerald-800 mt-0.5">
                  {crop.estProfitPerAcre}
                </div>
              </div>

              <div className="space-y-1 text-[11px] font-bold text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1"><Droplets className="w-3 h-3 text-cyan-600" /> Water:</span>
                  <span className="font-extrabold text-cyan-700 truncate">{crop.waterSavings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-600" /> Resilience:</span>
                  <span className="font-extrabold text-emerald-700">{crop.resilienceScore}/100</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-700 font-medium mt-2 bg-white p-2 rounded-xl border border-slate-200 leading-relaxed">
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
