import React, { useState } from 'react';
import { CloudRain, ShieldCheck, Sprout, Calendar, Bell, LineChart, Star, Sparkles, X, ArrowRight, Thermometer, Droplets, Wind, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function PlatformImpactFeatures({ village, riskMetrics, onNavigateTab }) {
  const [activeModal, setActiveModal] = useState(null); // 'weather' | 'risk' | 'advisory' | 'harvest' | 'alert' | 'historical' | 'outcome'

  const vName = village ? village.villageName : 'Selected Village';
  const dName = village ? village.districtName : 'Selected District';
  const cropName = village?.primaryCrops ? village.primaryCrops[0] : 'Crop';

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
              <p className="text-xs text-slate-500 font-medium">Click any outcome to see actionable farmer impact for {vName}</p>
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
              <p className="text-xs text-slate-500 font-medium">Click any feature below to launch the interactive live tool</p>
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
      {/* INTERACTIVE FEATURE & OUTCOME MODALS */}
      {/* ========================================================================= */}

      {/* FEATURE 1: HYPERLOCAL WEATHER FORECAST MODAL */}
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
                    Hyperlocal 7-Day Weather Forecast <span className="text-xs font-bold text-slate-500">(अचूक हवामान)</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">IMD Micro-Climate Station for {vName}, {dName}</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              {/* Today Baseline Cards */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl">
                  <Thermometer className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Max Temp</span>
                  <span className="text-base font-black text-slate-900">34.2°C</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl">
                  <Droplets className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Humidity</span>
                  <span className="text-base font-black text-slate-900">68%</span>
                </div>
                <div className="bg-teal-50 border border-teal-200 p-3 rounded-2xl">
                  <Wind className="w-5 h-5 text-teal-600 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Wind Speed</span>
                  <span className="text-base font-black text-slate-900">14 km/h</span>
                </div>
              </div>

              {/* 7-Day Forecast Table */}
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide mb-2">7-Day Agro-Met Forecast Table</h4>
                <div className="space-y-1.5">
                  {[
                    { day: "Today (आज)", temp: "34°C / 24°C", rain: "10% Rain", condition: "☀️ Sunny & Clear", advisory: "Ideal for spraying" },
                    { day: "Tomorrow (उद्या)", temp: "35°C / 25°C", rain: "25% Rain", condition: "⛅ Partly Cloudy", advisory: "Evening irrigation" },
                    { day: "Day 3 (परवा)", temp: "33°C / 23°C", rain: "65% Heavy Rain", condition: "🌧️ Thunderstorm Warning", advisory: "Postpone sowing & pesticide" },
                    { day: "Day 4", temp: "31°C / 22°C", rain: "80% Rain", condition: "🌧️ Continuous Rain", advisory: "Clear field drainage channels" },
                    { day: "Day 5", temp: "32°C / 23°C", rain: "30% Light Rain", condition: "🌥️ Scattered Clouds", advisory: "Inspect crop for stem rot" },
                    { day: "Day 6", temp: "34°C / 24°C", rain: "15% Rain", condition: "☀️ Sunny", advisory: "Apply 1% Potassium Nitrate" },
                    { day: "Day 7", temp: "35°C / 25°C", rain: "0% Rain", condition: "☀️ Clear Skies", advisory: "Standard drip watering" }
                  ].map((d, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs font-bold border border-slate-100">
                      <span className="w-28 text-slate-900 font-extrabold">{d.day}</span>
                      <span className="w-24 text-slate-600">{d.temp}</span>
                      <span className="w-28 text-blue-700">{d.rain}</span>
                      <span className="w-36 text-slate-800">{d.condition}</span>
                      <span className="text-[11px] text-emerald-800 font-bold truncate">{d.advisory}</span>
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

      {/* FEATURE 2: AI RISK PREDICTION BREAKDOWN MODAL */}
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
                    AI Climate Risk Prediction Breakdown <span className="text-xs font-bold text-slate-500">(धोका अंदाज)</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Agro-Climate Vulnerability Scorecard for {vName}</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              {/* Overall Risk Score */}
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-center">
                <span className="text-xs font-black text-amber-900 uppercase block">Overall Climate Risk Index (एकूण हवामान धोका)</span>
                <span className="text-3xl font-black text-amber-700">{riskMetrics ? riskMetrics.overallRiskScore : '68'}/100</span>
                <p className="text-xs text-amber-800 font-bold mt-1">Moderate Climate Vulnerability Zone — Drought & Heatwave Surveillance Active</p>
              </div>

              {/* Sub Indices Progress Bars */}
              <div className="space-y-3 text-xs font-bold">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-800">Drought Index (दुष्काळ धोका)</span>
                    <span className="text-amber-700 font-black">{riskMetrics?.subIndices?.droughtIndex || '62'}/100</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${riskMetrics?.subIndices?.droughtIndex || 62}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-800">Heatwave Index (उष्णता ताण)</span>
                    <span className="text-orange-700 font-black">{riskMetrics?.subIndices?.heatwaveIndex || '74'}/100</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${riskMetrics?.subIndices?.heatwaveIndex || 74}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-800">Pest Threat Index (कीड उपद्रव)</span>
                    <span className="text-purple-700 font-black">{riskMetrics?.subIndices?.pestIndex || '58'}/100</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${riskMetrics?.subIndices?.pestIndex || 58}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-800">Flood Hazard Index (पूर धोका)</span>
                    <span className="text-blue-700 font-black">{riskMetrics?.subIndices?.floodIndex || '35'}/100</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${riskMetrics?.subIndices?.floodIndex || 35}%` }} />
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
                    Crop-Specific AI Advisory <span className="text-xs font-bold text-slate-500">(पिकानुसार कृषी सल्ला)</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Customized farming strategy for {cropName} in {vName}</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-xs font-medium leading-relaxed">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <h4 className="font-black text-emerald-900 text-sm mb-1">🌱 Seed Variety & Sowing Strategy</h4>
                <p className="text-slate-800">Plant certified short-duration varieties (Phule Samrudhi / JS 20-34). Treat seeds with *Trichoderma Viride* (10g/kg) 24h prior to sowing.</p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl">
                <h4 className="font-black text-blue-900 text-sm mb-1">💧 Micro-Irrigation & Mulching</h4>
                <p className="text-slate-800">Apply Drip Irrigation strictly between 6 PM to 8 AM. Spread dry sugarcane leaf mulch (5 tonnes/ha) to conserve soil moisture by 35%.</p>
              </div>

              <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl">
                <h4 className="font-black text-purple-900 text-sm mb-1">🐛 Organic Pest Control Spray</h4>
                <p className="text-slate-800">Install 10 Yellow Sticky Traps per acre. Spray 5% Organic Neem Seed Kernel Extract (NSKE) at 30 days crop stage.</p>
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

      {/* FEATURE 4: HARVEST PLANNING & MANDI REALIZATION MODAL */}
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
                    Harvest Planning & APMC Mandi Realization <span className="text-xs font-bold text-slate-500">(काढणी व बाजार)</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Post-Harvest Strategy for Maximum Returns in {vName}</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs font-medium leading-relaxed">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <h4 className="font-black text-slate-900 text-sm mb-1">🌾 Optimum Moisture Harvesting Window</h4>
                <p className="text-slate-700">Harvest crops when grain moisture drops to 12-14% (for Soybean/Wheat) or when fruits reach 80% color maturity to minimize post-harvest shattering loss.</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <h4 className="font-black text-slate-900 text-sm mb-1">📊 Sorting & A-Grade Quality Realization</h4>
                <p className="text-slate-700">Clean, dry, and grade your produce into A, B, C quality bins before taking it to APMC Mandi to fetch 15-20% higher market price per quintal!</p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl">
                <h4 className="font-black text-amber-900 text-sm mb-1">📱 APMC Mandi Rates Tracking</h4>
                <p className="text-amber-800 font-bold">Check live daily market rates on Agmarknet portal before selling to middlemen traders!</p>
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
                    Active Emergency Weather Alerts <span className="text-xs font-bold text-slate-500">(इशारा संदेश)</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">IMD Warning & Crop Insurance Trigger for {vName}</p>
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
                  <h4 className="font-black text-red-900 text-sm">⚠️ Heatwave Warning Alert (उष्णतेचा इशारा)</h4>
                  <p className="text-red-800 mt-1">Temperature expected to cross 38°C over next 48 hours. Irrigate crops in the evening after 6 PM to prevent flower dropping.</p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl flex items-start space-x-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-black text-amber-900 text-sm">🛡️ PMFBY Crop Insurance 72-Hour Claim Rule</h4>
                  <p className="text-amber-800 mt-1">If unseasonal rain or hailstorm damages your field, call toll-free <strong>1800-180-1551</strong> within 72 hours with photos to claim compensation!</p>
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
                    10-Year Historical Weather Trends <span className="text-xs font-bold text-slate-500">(मागील हवामान)</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Decadal Monsoon & Groundwater Analysis for {vName}</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs font-medium leading-relaxed">
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl">
                <h4 className="font-black text-purple-900 text-sm mb-1">🌧️ 10-Year Annual Rainfall Pattern</h4>
                <p className="text-purple-800">Average monsoon rainfall in {dName} has fluctuated between 580mm to 820mm over the last 10 years, with a 12-day delay in monsoon arrival trend.</p>
              </div>

              <div className="p-3 bg-teal-50 border border-teal-200 rounded-2xl">
                <h4 className="font-black text-teal-900 text-sm mb-1">💧 Groundwater Depth History (CGWB)</h4>
                <p className="text-teal-800">Groundwater depth in {vName} currently stands at 14.8 meters. Shifting to micro-irrigation is recommended to sustain tube wells.</p>
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
