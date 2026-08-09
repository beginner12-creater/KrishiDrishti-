import React, { useState } from 'react';
import { CloudRain, ShieldCheck, Sprout, Calendar, Bell, LineChart, Star, Sparkles, X, ArrowRight, Thermometer, Droplets, Wind, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function PlatformImpactFeatures({ village, riskMetrics, onNavigateTab }) {
  const [activeModal, setActiveModal] = useState(null); // 'weather' | 'risk' | 'advisory' | 'harvest' | 'alert' | 'historical'

  const vName = village ? village.villageName : 'Selected Village';
  const dName = village ? village.districtName : 'Selected District';
  const bName = village ? village.blockName : 'Selected Taluka';
  const cropName = village?.primaryCrops ? village.primaryCrops[0] : 'Crop';
  const primaryCropsStr = village?.primaryCrops ? village.primaryCrops.join(', ') : 'Cotton, Soybean';

  // Dynamic Metrics from Selected Village & Risk Engine
  const overallRisk = riskMetrics?.overallRiskScore || 62;
  const subIdx = riskMetrics?.subIndices || { droughtIndex: 58, heatwaveIndex: 65, floodIndex: 30, pestIndex: 50, soilIndex: 45 };
  const forecastDays = riskMetrics?.forecastDays || [];
  const todayForecast = forecastDays[0] || { maxTempC: 34, minTempC: 24, humidityPercent: 65, windSpeedKmh: 12, precipitationProbPercent: 20 };

  const outcomes = [
    { id: 'alert', text: "Early weather alerts", textMr: "वेळेवर हवामान इशारा", icon: Bell, color: "text-amber-600 bg-amber-50 hover:border-amber-400" },
    { id: 'advisory', text: "Reduced crop losses", textMr: "पिकांचे नुकसान टाळा", icon: ShieldCheck, color: "text-emerald-600 bg-emerald-50 hover:border-emerald-400" },
    { id: 'risk', text: "Climate-resilient farming", textMr: "हवामान-सक्षम शेती", icon: Sprout, color: "text-teal-600 bg-teal-50 hover:border-teal-400" },
    { id: 'harvest', text: "Improved crop planning", textMr: "उत्तम पीक नियोजन", icon: Calendar, color: "text-blue-600 bg-blue-50 hover:border-blue-400" },
    { id: 'historical', text: "Better disaster preparedness", textMr: "आपत्ती पूर्वतयारी", icon: LineChart, color: "text-purple-600 bg-purple-50 hover:border-purple-400" }
  ];

  const features = [
    { id: 'weather', title: "Hyperlocal weather forecasts", subtitle: "तालुका-स्तरीय अचूक हवामान", icon: CloudRain, badge: "Live Forecast" },
    { id: 'risk', title: "AI risk prediction", subtitle: "कृत्रिम बुद्धिमत्ता धोका अंदाज", icon: LineChart, badge: "Risk Index" },
    { id: 'advisory', title: "Crop-specific advisories", subtitle: "पिकानुसार कृषी सल्ला", icon: Sprout, badge: "AI Advisory" },
    { id: 'harvest', title: "Harvest planning", subtitle: "काढणी व बाजार नियोजन", icon: Calendar, badge: "Mandi Guide" },
    { id: 'alert', title: "Alert notifications", subtitle: "इशारा संदेश", icon: Bell, badge: "Active Alert" },
    { id: 'historical', title: "Historical weather analysis", subtitle: "मागील हवामान विश्लेषण", icon: ShieldCheck, badge: "10-Yr Trends" }
  ];

  return (
    <div className="space-y-6 mb-6">
      
      {/* 1. EXPECTED OUTCOMES CARD (INTERACTIVE CLICKABLE) */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-700 font-bold" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                Expected Outcomes <span className="text-xs font-bold text-slate-500">(अपेक्षित फायदे)</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">Dynamic climate impact for <strong>{vName} ({bName}, {dName})</strong></p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2.5 py-1 rounded-full border border-emerald-300">
            Clickable Features 👆
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {outcomes.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModal(item.id)}
                className={`bg-slate-50 border border-slate-200/80 p-3.5 rounded-2xl flex items-center space-x-3 transition-all transform hover:-translate-y-0.5 hover:shadow-md cursor-pointer text-left ${item.color}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                  <Icon className="w-4 h-4 font-bold" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-black text-slate-900 leading-tight truncate">{item.text}</h3>
                  <p className="text-[10px] text-slate-500 font-bold mt-0.5 truncate">{item.textMr}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. CORE PLATFORM FEATURES CARD (INTERACTIVE CLICKABLE) */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center">
              <Star className="w-4 h-4 text-teal-700 font-bold" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                Core Platform Features <span className="text-xs font-bold text-slate-500">(मुख्य वैशिष्ट्ये)</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">Click any feature below to launch dynamic region analysis for <strong>{vName}</strong></p>
            </div>
          </div>
          <span className="text-[10px] bg-teal-100 text-teal-800 font-black px-2.5 py-1 rounded-full border border-teal-300">
            6 Live Features 🚀
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <button
                key={feat.id}
                onClick={() => setActiveModal(feat.id)}
                className="bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/80 hover:border-emerald-400 p-4 rounded-2xl flex items-center justify-between transition-all transform hover:-translate-y-0.5 hover:shadow-md cursor-pointer text-left group"
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 group-hover:border-emerald-500 flex items-center justify-center shrink-0 text-emerald-700 shadow-2xs group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <Icon className="w-5.5 h-5.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-tight truncate">{feat.title}</h3>
                    </div>
                    <p className="text-[11px] text-slate-500 font-bold truncate">{feat.subtitle}</p>
                    <span className="inline-block mt-1 text-[9px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-md border border-emerald-300">
                      {feat.badge}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DYNAMIC FEATURE & OUTCOME MODALS FOR SELECTED VILLAGE & REGION */}
      {/* ========================================================================= */}

      {/* FEATURE 1: DYNAMIC HYPERLOCAL WEATHER FORECAST MODAL */}
      {activeModal === 'weather' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl animate-scaleUp border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <CloudRain className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Hyperlocal Weather Forecast for {vName} <span className="text-xs font-bold text-slate-500">({bName}, {dName})</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">IMD Micro-Climate Station Baseline • Primary Crops: {primaryCropsStr}</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              {/* Today Dynamic Baseline Cards */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl">
                  <Thermometer className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Max Temp</span>
                  <span className="text-base font-black text-slate-900">{todayForecast.maxTempC}°C</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl">
                  <Droplets className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Humidity</span>
                  <span className="text-base font-black text-slate-900">{todayForecast.humidityPercent}%</span>
                </div>
                <div className="bg-teal-50 border border-teal-200 p-3 rounded-2xl">
                  <Wind className="w-5 h-5 text-teal-600 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Wind Speed</span>
                  <span className="text-base font-black text-slate-900">{todayForecast.windSpeedKmh} km/h</span>
                </div>
              </div>

              {/* Dynamic 7-Day Forecast Table */}
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide mb-2">7-Day Agro-Met Forecast Table for {vName}</h4>
                <div className="space-y-1.5 max-h-56 overflow-y-auto">
                  {forecastDays.slice(0, 7).map((d, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs font-bold border border-slate-100">
                      <span className="w-28 text-slate-900 font-extrabold">{d.dayName} ({d.date})</span>
                      <span className="w-24 text-slate-600">{d.maxTempC}°C / {d.minTempC}°C</span>
                      <span className="w-24 text-blue-700">{d.precipitationProbPercent}% Rain</span>
                      <span className="text-[11px] text-emerald-800 font-bold truncate">{d.agriImpact}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <button onClick={() => setActiveModal(null)} className="px-5 py-2.5 bg-emerald-600 text-white font-extrabold rounded-2xl text-xs shadow-sm">
                Close Forecast (बंद करा)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 2: DYNAMIC AI RISK PREDICTION MODAL */}
      {activeModal === 'risk' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl animate-scaleUp border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <LineChart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    AI Risk Prediction for {vName} <span className="text-xs font-bold text-slate-500">({dName})</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Agro-Climate Risk Calculator Baseline</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              {/* Dynamic Overall Risk Score */}
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-center">
                <span className="text-xs font-black text-amber-900 uppercase block">Overall Climate Risk Index for {vName}</span>
                <span className="text-3xl font-black text-amber-700">{overallRisk}/100</span>
                <p className="text-xs text-amber-800 font-bold mt-1">Groundwater Status: <strong>{village?.groundwaterStatus || 'Critical'}</strong> • Rainfall: <strong>{village?.annualRainfallNormal || 650}mm</strong></p>
              </div>

              {/* Dynamic Sub Indices Progress Bars */}
              <div className="space-y-3 text-xs font-bold">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-800">Drought Index (दुष्काळ धोका)</span>
                    <span className="text-amber-700 font-black">{subIdx.droughtIndex}/100</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${subIdx.droughtIndex}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-800">Heatwave Index (उष्णता ताण)</span>
                    <span className="text-orange-700 font-black">{subIdx.heatwaveIndex}/100</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${subIdx.heatwaveIndex}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-800">Pest Threat Index (कीड उपद्रव)</span>
                    <span className="text-purple-700 font-black">{subIdx.pestIndex}/100</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${subIdx.pestIndex}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-800">Flood Hazard Index (पूर धोका)</span>
                    <span className="text-blue-700 font-black">{subIdx.floodIndex}/100</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${subIdx.floodIndex}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <button onClick={() => setActiveModal(null)} className="px-5 py-2.5 bg-emerald-600 text-white font-extrabold rounded-2xl text-xs shadow-sm">
                Close Analytics (बंद करा)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 3: CROP-SPECIFIC ADVISORIES MODAL */}
      {activeModal === 'advisory' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl animate-scaleUp border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Sprout className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Crop Advisory for {cropName} <span className="text-xs font-bold text-slate-500">({vName})</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Crops in village: {primaryCropsStr}</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-xs font-medium leading-relaxed">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <h4 className="font-black text-emerald-900 text-sm mb-1">🌱 Seed Variety & Sowing Strategy for {cropName}</h4>
                <p className="text-slate-800">For {vName}'s soil ({village?.soilType || 'Black Soil'}), sow certified high-yielding hybrid seeds. Treat seeds with *Trichoderma Viride* (10g/kg) 24h prior to sowing.</p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl">
                <h4 className="font-black text-blue-900 text-sm mb-1">💧 Micro-Irrigation Schedule for {vName}</h4>
                <p className="text-slate-800">Groundwater status is {village?.groundwaterStatus || 'Critical'}. Apply Drip Irrigation strictly between 6 PM to 8 AM. Spread dry mulch (5 tonnes/ha) to conserve soil moisture by 35%.</p>
              </div>

              <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl">
                <h4 className="font-black text-purple-900 text-sm mb-1">🐛 Organic Pest Control Spray</h4>
                <p className="text-slate-800">Install 10 Yellow Sticky Traps per acre. Spray 5% Organic Neem Seed Kernel Extract (NSKE) at early crop stage.</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <button onClick={() => setActiveModal(null)} className="px-5 py-2.5 bg-emerald-600 text-white font-extrabold rounded-2xl text-xs shadow-sm">
                Close Advisory (बंद करा)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 4: HARVEST PLANNING MODAL */}
      {activeModal === 'harvest' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl animate-scaleUp border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Harvest & APMC Mandi Guide for {vName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">District APMC Market Hub: {dName} Mandi</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs font-medium leading-relaxed">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <h4 className="font-black text-slate-900 text-sm mb-1">🌾 Optimum Moisture Harvesting Window for {cropName}</h4>
                <p className="text-slate-700">Harvest crops when grain moisture drops to 12-14% or when fruits reach 80% color maturity to minimize post-harvest loss.</p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl">
                <h4 className="font-black text-amber-900 text-sm mb-1">📱 APMC {dName} Mandi Realization</h4>
                <p className="text-amber-800 font-bold">Grade produce into A, B, C quality bins before taking to {dName} APMC Mandi to get 15-20% higher market prices!</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <button onClick={() => setActiveModal(null)} className="px-5 py-2.5 bg-emerald-600 text-white font-extrabold rounded-2xl text-xs shadow-sm">
                Close Guide (बंद करा)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 5: EMERGENCY CLIMATE WEATHER ALERTS MODAL */}
      {activeModal === 'alert' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl animate-scaleUp border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
                  <Bell className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Emergency Alerts for {vName} <span className="text-xs font-bold text-slate-500">({bName})</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Active Weather Advisory & PMFBY Helpline</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs font-medium leading-relaxed">
              <div className="p-3.5 bg-red-50 border border-red-300 rounded-2xl flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-red-900 text-sm">⚠️ Heatwave Alert for {vName} (उष्णतेचा इशारा)</h4>
                  <p className="text-red-800 mt-1">Temperature expected to touch {todayForecast.maxTempC}°C over next 48 hours. Irrigate crops in the evening after 6 PM to prevent flower dropping.</p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl flex items-start space-x-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-amber-900 text-sm">🛡️ PMFBY Crop Insurance 72-Hour Claim Helpline</h4>
                  <p className="text-amber-800 mt-1">If unseasonal rain or hailstorm damages fields in {dName}, call toll-free <strong>1800-180-1551</strong> within 72 hours with mobile photos to claim compensation!</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <button onClick={() => setActiveModal(null)} className="px-5 py-2.5 bg-emerald-600 text-white font-extrabold rounded-2xl text-xs shadow-sm">
                Close Alerts (बंद करा)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEATURE 6: HISTORICAL WEATHER ANALYSIS MODAL */}
      {activeModal === 'historical' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl animate-scaleUp border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    10-Year Historical Trends for {vName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Decadal Monsoon & Groundwater Analysis for {dName}</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs font-medium leading-relaxed">
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl">
                <h4 className="font-black text-purple-900 text-sm mb-1">🌧️ 10-Year Annual Rainfall Normal</h4>
                <p className="text-purple-800">Normal annual rainfall in {vName} is <strong>{village?.annualRainfallNormal || 650} mm</strong>. Monsoon arrival fluctuates by up to 10-14 days.</p>
              </div>

              <div className="p-3 bg-teal-50 border border-teal-200 rounded-2xl">
                <h4 className="font-black text-teal-900 text-sm mb-1">💧 Groundwater Depth History (CGWB)</h4>
                <p className="text-teal-800">Groundwater status in {vName} is currently <strong>{village?.groundwaterStatus || 'Critical'}</strong>. Shifting to drip micro-irrigation is recommended.</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <button onClick={() => setActiveModal(null)} className="px-5 py-2.5 bg-emerald-600 text-white font-extrabold rounded-2xl text-xs shadow-sm">
                Close Analysis (बंद करा)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
