import React from 'react';
import { IndianRupee, TrendingUp, Droplets, ShieldCheck, Star, ArrowUpRight } from 'lucide-react';

export default function CropProfitRecommendation({ village, riskMetrics, onSelectCrop }) {
  if (!village || !riskMetrics) return null;

  const { subIndices, overallRiskScore } = riskMetrics;

  // AI Profit Maximizing Crop Recommendation Engine based on Climate & Soil
  const getProfitCrops = () => {
    const isDroughtProne = subIndices.droughtIndex > 50;
    const isHighRain = village.annualRainfallNormal > 1200;
    const isCanalIrrigated = village.irrigationCoveragePercent > 65;

    const recommendations = [];

    if (isDroughtProne) {
      recommendations.push({
        cropName: "Pomegranate",
        displayName: "Bhagwa Pomegranate (डाळिंब)",
        category: "High-Value Horticulture",
        estProfitPerAcre: "₹ 1,80,000 - ₹ 3,20,000",
        waterSavings: "55% Less Water (Drip Irrigated)",
        resilienceScore: 88,
        marketDemand: 5,
        whyBest: `Perfect for ${village.villageName}'s light/medium soil & dry climate. Requires minimal drip irrigation.`
      });

      recommendations.push({
        cropName: "Bajra",
        displayName: "Pearl Millet (बाजरी / बाजरा)",
        category: "Climate Resilient Grain",
        estProfitPerAcre: "₹ 45,000 - ₹ 75,000",
        waterSavings: "65% Less Water",
        resilienceScore: 94,
        marketDemand: 4,
        whyBest: "Requires only 2 protective irrigations. High market demand for healthy millet flour."
      });

      recommendations.push({
        cropName: "Dragon Fruit",
        displayName: "Dragon Fruit / Kamalam (कमलम)",
        category: "Exotic High-Profit Crop",
        estProfitPerAcre: "₹ 3,50,000 - ₹ 5,00,000",
        waterSavings: "70% Less Water",
        resilienceScore: 92,
        marketDemand: 5,
        whyBest: "Thrives in arid/semi-arid regions with gravelly soil. 25-year plantation lifespan."
      });
    } else if (isHighRain) {
      recommendations.push({
        cropName: "Paddy",
        displayName: "Indrayani / Wada Kolam Paddy (भात)",
        category: "Premium Scented Rice",
        estProfitPerAcre: "₹ 90,000 - ₹ 1,40,000",
        waterSavings: "Abundant Rainfall Suited",
        resilienceScore: 85,
        marketDemand: 5,
        whyBest: `Utilizes ${village.villageName}'s ${village.annualRainfallNormal}mm high monsoon rainfall effectively.`
      });

      recommendations.push({
        cropName: "Cashew Nut",
        displayName: "Cashew Nut (काजू)",
        category: "Coastal Plantation",
        estProfitPerAcre: "₹ 1,50,000 - ₹ 2,40,000",
        waterSavings: "Rainfed Plantation",
        resilienceScore: 90,
        marketDemand: 5,
        whyBest: "Suited for lateritic hilly slopes. Low maintenance with high export market demand."
      });
    } else if (isCanalIrrigated) {
      recommendations.push({
        cropName: "Grapes",
        displayName: "Export Quality Grapes (द्राक्ष)",
        category: "Export Cash Crop",
        estProfitPerAcre: "₹ 2,50,000 - ₹ 4,50,000",
        waterSavings: "Precision Drip Irrigation",
        resilienceScore: 82,
        marketDemand: 5,
        whyBest: `Ideal for ${village.districtName}'s climate. High returns from raisin processing & export.`
      });

      recommendations.push({
        cropName: "Turmeric",
        displayName: "Rajapuri Turmeric (हळद)",
        category: "High-Curcumin Spice",
        estProfitPerAcre: "₹ 1,60,000 - ₹ 2,80,000",
        waterSavings: "Medium Water Requirement",
        resilienceScore: 86,
        marketDemand: 5,
        whyBest: "High market price per quintal. Intercropping compatible with soybean."
      });
    } else {
      recommendations.push({
        cropName: "Soybean",
        displayName: "Soybean + Pigeonpea (सोयाबीन + तूर)",
        category: "Balanced Intercropping",
        estProfitPerAcre: "₹ 70,000 - ₹ 1,20,000",
        waterSavings: "35% Water Savings",
        resilienceScore: 89,
        marketDemand: 4,
        whyBest: "Double income security. Pigeonpea acts as climate buffer if monsoon dry spell occurs."
      });

      recommendations.push({
        cropName: "Guava",
        displayName: "VNR Bihi Guava (पेरू)",
        category: "High-Density Horticulture",
        estProfitPerAcre: "₹ 2,00,000 - ₹ 3,50,000",
        waterSavings: "50% Less Water",
        resilienceScore: 91,
        marketDemand: 5,
        whyBest: "Bears fruit within 1.5 years. High market price per kg (Jumbo 500g fruit)."
      });
    }

    return recommendations;
  };

  const profitCrops = getProfitCrops();

  return (
    <div className="bg-white border border-slate-200 p-5 sm:p-6 rounded-3xl mb-6 shadow-sm space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              Profit-Maximizing Crop Recommendations
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-extrabold">Max Profit</span>
            </h3>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Suggested high-profit, climate-suited crops for <strong className="text-slate-900">{village.villageName}</strong> ({village.districtName}) to maximize yield income
          </p>
        </div>

        <span className="text-xs text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto font-bold">
          Climate Resilience: <strong className="text-emerald-700">{100 - overallRiskScore}/100</strong>
        </span>
      </div>

      {/* Recommended Crop Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {profitCrops.map((crop, idx) => (
          <div
            key={idx}
            className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col justify-between hover:border-emerald-500 transition-all space-y-3 shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-extrabold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-300">
                  {crop.category}
                </span>
                <div className="flex items-center text-amber-500 text-xs">
                  {Array.from({ length: crop.marketDemand }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                  ))}
                </div>
              </div>

              <h4 className="text-base font-black text-slate-900 my-2">{crop.displayName}</h4>

              {/* Profit Metric Pill */}
              <div className="bg-emerald-100/70 border border-emerald-300 p-3 rounded-xl mb-3">
                <div className="text-[11px] text-emerald-900 font-black uppercase tracking-wider flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5" /> Estimated Net Profit / Acre:
                </div>
                <div className="text-lg font-black text-emerald-900 mt-0.5">
                  {crop.estProfitPerAcre}
                </div>
              </div>

              <div className="space-y-1.5 text-xs font-semibold text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-1"><Droplets className="w-3.5 h-3.5 text-cyan-600" /> Water Savings:</span>
                  <span className="font-bold text-cyan-700">{crop.waterSavings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Resilience:</span>
                  <span className="font-bold text-emerald-700">{crop.resilienceScore} / 100</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 font-medium mt-3 bg-white p-2.5 rounded-xl border border-slate-200 leading-relaxed">
                💡 {crop.whyBest}
              </p>
            </div>

            {/* Click Button */}
            <button
              onClick={() => onSelectCrop(crop.cropName)}
              className="w-full py-3 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm mt-2 active:scale-95 cursor-pointer"
            >
              <span>Get Full Advisory Guide</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
