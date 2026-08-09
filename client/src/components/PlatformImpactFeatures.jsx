import React, { useState } from 'react';
import { ShieldCheck, Zap, TrendingUp, Calendar, AlertTriangle, CloudSun, Bot, Sprout, Bell, BarChart2, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

export default function PlatformImpactFeatures({ village, riskMetrics }) {
  const [activeFeature, setActiveFeature] = useState('forecast'); // 'forecast' | 'prediction' | 'advisory' | 'harvest' | 'alerts' | 'historical'

  if (!village || !riskMetrics) return null;

  const outcomes = [
    {
      id: 1,
      title: "Early Weather Alerts (हवामान पूर्वसूचना)",
      desc: "72-Hour advance IMD agro-met warning system for hailstorms, unseasonal rain & heatwaves.",
      stat: "72 Hours",
      statLabel: "Advance Notice",
      icon: Zap,
      color: "text-amber-600 bg-amber-100 border-amber-300"
    },
    {
      id: 2,
      title: "Reduced Crop Losses (पिक नुकसान घट)",
      desc: "Preventive spraying & drainage routines to minimize climate-induced crop destruction.",
      stat: "45% Loss",
      statLabel: "Reduction",
      icon: ShieldCheck,
      color: "text-emerald-600 bg-emerald-100 border-emerald-300"
    },
    {
      id: 3,
      title: "Climate-Resilient Farming (हवामान सहनशील शेती)",
      desc: "ICAR-certified drought-resistant seed cultivars & organic Jeevamrut soil enrichment.",
      stat: "88/100",
      statLabel: "Resilience Score",
      icon: Sprout,
      color: "text-cyan-600 bg-cyan-100 border-cyan-300"
    },
    {
      id: 4,
      title: "Improved Crop Planning (पिक नियोजन)",
      desc: "Precision sowing, irrigation scheduling & peak market price harvesting windows.",
      stat: "+₹1.2L",
      statLabel: "Income / Acre",
      icon: TrendingUp,
      color: "text-purple-600 bg-purple-100 border-purple-300"
    },
    {
      id: 5,
      title: "Better Disaster Preparedness (आपत्ती व्यवस्थापन)",
      desc: "Instant 72-hour PMFBY crop insurance intimation and local Panchayat flood mitigation.",
      stat: "72 Hours",
      statLabel: "Claim Intimation",
      icon: AlertTriangle,
      color: "text-rose-600 bg-rose-100 border-rose-300"
    }
  ];

  const features = [
    {
      id: 'forecast',
      title: "Hyperlocal Weather Forecasts",
      titleMr: "हवामान अंदाज",
      icon: CloudSun,
      summary: "7-Day village-level agro-meteorological forecast updated live from IMD Doppler weather radars.",
      content: {
        temp: "31°C / 22°C",
        humidity: "68% Relative Humidity",
        wind: "14 km/h SW Breeze",
        rainfallEst: "12 mm expected in next 48h",
        recommendation: "Avoid pesticide spraying between 12 PM - 3 PM due to high afternoon temperatures."
      }
    },
    {
      id: 'prediction',
      title: "AI Risk Prediction",
      titleMr: "कृत्रिम बुद्धिमत्ता धोका शोध",
      icon: Bot,
      summary: "Multi-hazard machine learning index analyzing Drought, Thermal Stress, Flood & Pest risk.",
      content: {
        score: `${riskMetrics.overallRiskScore} / 100`,
        category: riskMetrics.riskCategory,
        drought: `${riskMetrics.subIndices.droughtIndex}% Risk`,
        pest: `${riskMetrics.subIndices.pestIndex}% Risk`,
        recommendation: "Pest risk is elevated due to 68% humidity. Install 8 yellow sticky traps per acre."
      }
    },
    {
      id: 'advisory',
      title: "Crop-Specific Advisories",
      titleMr: "पिकानुसार सल्ला",
      icon: Sprout,
      summary: "Tailored 4-step action plans for Cotton, Sugarcane, Soybean, Onion, Grapes & Pomegranate.",
      content: {
        crops: village.primaryCrops.join(', '),
        soil: village.soilType,
        water: village.groundwaterStatus,
        recommendation: `Apply 1% MgSO4 + 19:19:19 spray for ${village.primaryCrops[0]} to maintain leaf chlorophyll.`
      }
    },
    {
      id: 'harvest',
      title: "Harvest Planning & Market Timing",
      titleMr: "काढणी नियोजन व बाजारभाव",
      icon: Calendar,
      summary: "AI-computed optimum harvesting days to avoid rain damage & sell at peak APMC Mandi rates.",
      content: {
        optimumWindow: "Oct 15 - Oct 22 (Ideal Sowing/Harvest)",
        mandiPriceTrend: "Upward Trend (+12% Expected)",
        moistureContent: "Safe 12% Grain Moisture Target",
        recommendation: "Harvest dry pods during morning hours. Store in moisture-proof poly bags."
      }
    },
    {
      id: 'alerts',
      title: "Alert Notifications System",
      titleMr: "आपत्कालीन सूचना",
      icon: Bell,
      summary: "Instant high-priority alerts for unseasonal rainfall, frost, hailstorms & pest outbreaks.",
      content: {
        activeAlerts: "1 Active Weather Advisory",
        channels: "SMS • WhatsApp • Audio Call",
        triggerRule: "Triggered if Rainfall > 25mm within 6 hours",
        recommendation: "Check field bunds and ensure open drainage channels before night rain."
      }
    },
    {
      id: 'historical',
      title: "Historical Weather Analysis",
      titleMr: "ऐतिहासिक हवामान विश्लेषण",
      icon: BarChart2,
      summary: "10-Year historical monsoon trend, groundwater table depletion & rainfall deficiency records.",
      content: {
        rainfall10Yr: `${village.annualRainfallNormal} mm average (10-Yr Baseline)`,
        droughtFrequency: "2 dry spells per 5 years",
        waterTable: village.groundwaterStatus,
        recommendation: "Construct MGNREGA recharge pits to store excess monsoon runoff."
      }
    }
  ];

  const currentFeatureObj = features.find(f => f.id === activeFeature) || features[0];

  return (
    <div className="space-y-6 mb-8">
      
      {/* 1. EXPECTED OUTCOMES SHOWCASE HEADER */}
      <div className="bg-white border border-slate-200 p-5 sm:p-7 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-black uppercase">
              🎯 Platform Impact & Expected Outcomes (अपेक्षित निकाल)
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Climate Resilience Outcomes for {village.villageName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Empowering farmers with early warnings, climate adaptation & yield protection
            </p>
          </div>
        </div>

        {/* Outcome Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-1">
          {outcomes.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col justify-between space-y-3 shadow-xs hover:border-emerald-500 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold border ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400">OUTCOME 0{item.id}</span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-black text-slate-900 mt-2.5 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 font-medium mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">{item.statLabel}</span>
                  <span className="text-xs font-black text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {item.stat}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. CORE PLATFORM FEATURES INTERACTIVE HUB */}
      <div className="bg-white border border-slate-200 p-5 sm:p-7 rounded-3xl shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Core Platform Features (प्रमुख वैशिष्ट्ये)
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Explore the 6 core AI tools protecting agricultural livelihoods in {village.districtName}
            </p>
          </div>
        </div>

        {/* Feature Module Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {features.map((feat) => {
            const Icon = feat.icon;
            const isActive = activeFeature === feat.id;
            return (
              <button
                key={feat.id}
                onClick={() => setActiveFeature(feat.id)}
                className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between min-h-[75px] cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white border-emerald-700 font-black shadow-md scale-[1.02]'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 font-bold'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
                <div>
                  <div className="text-[10px] opacity-80 uppercase tracking-wider">{feat.titleMr}</div>
                  <div className="text-xs font-black leading-tight mt-0.5">{feat.title}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Feature Deep-Dive Display Card */}
        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                <currentFeatureObj.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900">{currentFeatureObj.title} ({currentFeatureObj.titleMr})</h4>
                <p className="text-xs text-slate-600 font-medium">{currentFeatureObj.summary}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {Object.entries(currentFeatureObj.content).map(([key, val], idx) => (
              <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 space-y-1 shadow-xs">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  {key.replace(/([A-Z])/g, ' $1')}
                </span>
                <strong className="text-slate-900 font-extrabold text-xs block leading-relaxed">{val}</strong>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
