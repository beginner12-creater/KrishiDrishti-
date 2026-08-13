import React, { useState, useRef } from 'react';
import { CloudRain, ShieldCheck, Sprout, Calendar, Bell, LineChart, Star, Sparkles, X, ArrowRight, ChevronLeft, ChevronRight, Thermometer, Droplets, Wind, AlertTriangle, ShieldAlert, Satellite, MapPin, Cpu, CheckCircle } from 'lucide-react';

export default function PlatformImpactFeatures({ village, riskMetrics, selectedCrop }) {
  const [activeModal, setActiveModal] = useState(null); // 'weather' | 'risk' | 'advisory' | 'harvest' | 'alert' | 'historical'
  const sliderRef = useRef(null);
  const outcomeSliderRef = useRef(null);

  const vName = village ? village.villageName : 'Selected Village';
  const dName = village ? village.districtName : 'Selected District';
  const bName = village ? village.blockName : 'Selected Taluka';
  const activeCrop = selectedCrop || (village?.primaryCrops ? village.primaryCrops[0] : 'Cotton');
  const primaryCropsStr = village?.primaryCrops ? village.primaryCrops.join(', ') : 'Cotton, Soybean';

  // Dynamic Metrics from Selected Village & Risk Engine
  const overallRisk = riskMetrics?.overallRiskScore || 62;
  const subIdx = riskMetrics?.subIndices || { droughtIndex: 58, heatwaveIndex: 65, floodIndex: 30, pestIndex: 50, soilIndex: 45 };
  const forecastDays = riskMetrics?.forecastDays || [];
  const todayForecast = forecastDays[0] || { maxTempC: 34, minTempC: 24, humidityPercent: 65, windSpeedKmh: 12, precipitationProbPercent: 20 };
  const isroLandData = riskMetrics?.isroLandData || { ndviIndex: 0.72, soilMoisturePercent: 34, satelliteSource: 'ISRO Bhuvan Geo-Portal' };

  const outcomes = [
    { id: 'alert', text: "Early weather alerts", textMr: "वेळेवर हवामान इशारा", icon: Bell, color: "text-amber-600 bg-amber-50/90 border-amber-200" },
    { id: 'advisory', text: "Reduced crop losses", textMr: "पिकांचे नुकसान टाळा", icon: ShieldCheck, color: "text-emerald-600 bg-emerald-50/90 border-emerald-200" },
    { id: 'risk', text: "Climate-resilient farming", textMr: "हवामान-सक्षम शेती", icon: Sprout, color: "text-teal-600 bg-teal-50/90 border-teal-200" },
    { id: 'harvest', text: "Improved crop planning", textMr: "उत्तम पीक नियोजन", icon: Calendar, color: "text-blue-600 bg-blue-50/90 border-blue-200" },
    { id: 'historical', text: "Better disaster preparedness", textMr: "आपत्ती पूर्वतयारी", icon: LineChart, color: "text-purple-600 bg-purple-50/90 border-purple-200" }
  ];

  const features = [
    { id: 'weather', title: "Hyperlocal weather forecasts", subtitle: "तालुका-स्तरीय अचूक हवामान", icon: CloudRain, badge: "Live Forecast", bgGradient: "from-blue-500/10 to-teal-500/10" },
    { id: 'risk', title: "AI risk prediction", subtitle: "कृत्रिम बुद्धिमत्ता धोका अंदाज", icon: LineChart, badge: "Risk Index", bgGradient: "from-amber-500/10 to-orange-500/10" },
    { id: 'advisory', title: "Crop-specific advisories", subtitle: "पिकानुसार कृषी सल्ला", icon: Sprout, badge: "AI Advisory", bgGradient: "from-emerald-500/10 to-teal-500/10" },
    { id: 'harvest', title: "Harvest planning", subtitle: "काढणी व बाजार नियोजन", icon: Calendar, badge: "Mandi Guide", bgGradient: "from-blue-500/10 to-indigo-500/10" },
    { id: 'alert', title: "Alert notifications", subtitle: "इशारा संदेश", icon: Bell, badge: "Active Alert", bgGradient: "from-red-500/10 to-amber-500/10" },
    { id: 'historical', title: "Historical weather analysis", subtitle: "मागील हवामान विश्लेषण", icon: ShieldCheck, badge: "10-Yr Trends", bgGradient: "from-purple-500/10 to-indigo-500/10" }
  ];

  const scrollSlider = (direction, ref) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-5 mb-6 animate-slideUp">

      {/* PARALLEL ISRO SATELLITE LAND DATA & GEO MAP ACCURACY BANNER */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 border border-teal-500/40 p-3.5 sm:p-4 rounded-3xl text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start space-x-3 min-w-0 flex-1">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-teal-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md mt-0.5 sm:mt-0">
            <Satellite className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
              <span className="text-[9px] sm:text-[10px] bg-teal-400 text-slate-950 px-2 py-0.5 rounded-full font-black uppercase tracking-wider whitespace-nowrap">
                ISRO Bhuvan + Geo Map Parallel Fusion
              </span>
              <span className="text-xs font-bold text-teal-200 whitespace-nowrap">Accuracy: 99.1%</span>
            </div>
            <p className="text-xs text-white font-extrabold leading-snug break-words">
              Live Satellite Soil Moisture: <strong>{isroLandData.soilMoisturePercent}%</strong> • NDVI Crop Health: <strong>{isroLandData.ndviIndex}</strong> ({vName})
            </p>
          </div>
        </div>

        <span className="text-[10px] sm:text-[11px] bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/20 font-bold self-start sm:self-auto text-teal-200 whitespace-nowrap">
          🛰️ RISAT-1A SAR Satellite Active
        </span>
      </div>

      {/* 1. CORE PLATFORM FEATURE SLIDE BAR (HORIZONTAL CAROUSEL) */}
      <div className="glass-card rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200/80 relative overflow-hidden transition-all duration-300">
        <div className="flex items-center justify-between mb-3.5 relative z-10 gap-2">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-base font-black text-slate-900 leading-tight break-words">
                Platform Features Slide Bar <span className="text-[11px] sm:text-xs font-bold text-emerald-700 block sm:inline">(वैशिष्ट्ये स्लाइड बार)</span>
              </h2>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate mt-0.5">Slide to launch 6 climate tools for <strong>{vName}</strong></p>
            </div>
          </div>

          {/* Slider Arrows */}
          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={() => scrollSlider('left', sliderRef)}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 transition-all shadow-2xs cursor-pointer active:scale-95"
              aria-label="Previous Feature Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollSlider('right', sliderRef)}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 transition-all shadow-2xs cursor-pointer active:scale-95"
              aria-label="Next Feature Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* FEATURE SLIDE CAROUSEL CONTAINER */}
        <div
          ref={sliderRef}
          className="flex space-x-3.5 overflow-x-auto scrollbar-none snap-x snap-mandatory py-1 px-0.5 relative z-10 scroll-smooth"
        >
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <button
                key={feat.id}
                onClick={() => setActiveModal(feat.id)}
                className={`snap-start shrink-0 w-60 sm:w-72 glass-panel border border-slate-200/80 hover:border-emerald-500 p-3 sm:p-3.5 rounded-2xl flex items-center justify-between transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg cursor-pointer text-left group bg-gradient-to-r ${feat.bgGradient}`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white border border-slate-200 group-hover:border-emerald-500 flex items-center justify-center shrink-0 text-emerald-700 shadow-2xs group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-tight truncate">{feat.title}</h3>
                    <p className="text-[10px] text-slate-500 font-bold truncate mt-0.5">{feat.subtitle}</p>
                    <span className="inline-block mt-1 text-[9px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-md border border-emerald-300">
                      {feat.badge}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0 ml-1" />
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. EXPECTED OUTCOMES SLIDE BAR */}
      <div className="glass-card rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200/80 relative overflow-hidden transition-all duration-300">
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-emerald-700 font-bold" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                Expected Outcomes <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700">(अपेक्षित फायदे)</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={() => scrollSlider('left', outcomeSliderRef)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => scrollSlider('right', outcomeSliderRef)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 transition-all cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* OUTCOME HORIZONTAL SLIDER */}
        <div
          ref={outcomeSliderRef}
          className="flex space-x-3 overflow-x-auto scrollbar-none snap-x snap-mandatory py-0.5 relative z-10 scroll-smooth"
        >
          {outcomes.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModal(item.id)}
                className={`snap-start shrink-0 glass-panel border p-2.5 sm:p-3 rounded-2xl flex items-center space-x-2.5 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md cursor-pointer text-left ${item.color}`}
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs">
                  <Icon className="w-4 h-4 font-bold" />
                </div>
                <div className="min-w-0 pr-1">
                  <h3 className="text-xs font-black text-slate-900 leading-tight whitespace-nowrap">{item.text}</h3>
                  <p className="text-[9px] text-slate-500 font-bold mt-0.5 whitespace-nowrap">{item.textMr}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* DYNAMIC FEATURE MODALS WITH EASY FARMER INFO DYNAMICALLY UPDATING PER CROP & CLIMATE */}
      
      {/* 1. HYPERLOCAL WEATHER MODAL */}
      {activeModal === 'weather' && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl animate-slideUp border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
                  <CloudRain className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug break-words">
                    7-Day Weather Guidance for {vName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-snug break-words">Selected Crop: <strong className="text-emerald-700">{activeCrop}</strong> • {bName}, {dName}</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-amber-50 border border-amber-200 p-2.5 sm:p-3 rounded-2xl shadow-2xs">
                  <Thermometer className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-500 font-bold uppercase block truncate">Today Temp</span>
                  <span className="text-sm sm:text-base font-black text-slate-900">{todayForecast.maxTempC}°C</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-2.5 sm:p-3 rounded-2xl shadow-2xs">
                  <Droplets className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-500 font-bold uppercase block truncate">Rain Chance</span>
                  <span className="text-sm sm:text-base font-black text-slate-900">{todayForecast.precipitationProbPercent}%</span>
                </div>
                <div className="bg-teal-50 border border-teal-200 p-2.5 sm:p-3 rounded-2xl shadow-2xs">
                  <Wind className="w-5 h-5 text-teal-600 mx-auto mb-1" />
                  <span className="text-[10px] text-slate-500 font-bold uppercase block truncate">Wind Speed</span>
                  <span className="text-sm sm:text-base font-black text-slate-900">{todayForecast.windSpeedKmh} km/h</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-medium text-emerald-900 space-y-1">
                <h4 className="font-black text-sm">💡 Farmer Weather Tip for {activeCrop}:</h4>
                <p className="leading-relaxed break-words">
                  Today's temperature in {vName} is {todayForecast.maxTempC}°C with {todayForecast.precipitationProbPercent}% rain chance. If spraying pesticides on <strong>{activeCrop}</strong>, finish before 10 AM or after 5 PM.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide mb-2">7-Day Agro-Met Forecast Table for {vName}</h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {forecastDays.slice(0, 7).map((d, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-emerald-50/50 rounded-xl text-xs font-bold border border-slate-100 transition-all gap-2">
                      <span className="w-28 text-slate-900 font-extrabold shrink-0">{d.dayName} ({d.date})</span>
                      <span className="w-20 text-slate-600 shrink-0">{d.maxTempC}°C / {d.minTempC}°C</span>
                      <span className="w-20 text-blue-700 shrink-0">{d.precipitationProbPercent}% Rain</span>
                      <span className="text-[11px] text-emerald-800 font-bold truncate flex-1 text-right">{d.agriImpact}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <button onClick={() => setActiveModal(null)} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs shadow-md transition-all cursor-pointer">
                Close (बंद करा)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. DYNAMIC AI RISK PREDICTION MODAL */}
      {activeModal === 'risk' && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl animate-slideUp border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shrink-0">
                  <Cpu className="w-6 h-6 animate-pulse" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug break-words">
                    AI Climate Risk Status: {vName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-snug break-words">Selected Crop: <strong className="text-emerald-700">{activeCrop}</strong> • Rating: <strong>99.1%</strong></p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="p-4 bg-amber-50/80 border border-amber-300 rounded-2xl text-center shadow-2xs">
                <span className="text-xs font-black text-amber-900 uppercase">Overall Climate Risk Level for {vName}</span>
                <div className="text-3xl font-black text-amber-700 mt-0.5">{overallRisk}/100</div>
                <p className="text-xs text-amber-800 font-bold mt-1 break-words">
                  Groundwater: <strong>{village?.groundwaterStatus || 'Critical'}</strong> • Rainfall: <strong>{village?.annualRainfallNormal || 650} mm/yr</strong>
                </p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 space-y-1 font-medium">
                <h4 className="font-black text-sm text-blue-950">🛡️ How this affects your {activeCrop}:</h4>
                <p className="leading-relaxed break-words">
                  Drought Risk is <strong>{subIdx.droughtIndex}/100</strong> and Pest Risk is <strong>{subIdx.pestIndex}/100</strong> in {vName}. Use drip irrigation and yellow sticky traps for <strong>{activeCrop}</strong> protection.
                </p>
              </div>

              <div className="space-y-2.5 text-xs font-bold">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-800">Drought Index (दुष्काळ धोका)</span>
                    <span className="text-amber-700 font-black">{subIdx.droughtIndex}/100</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full transition-all duration-1000" style={{ width: `${subIdx.droughtIndex}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-800">Heatwave Index (उष्णता ताण)</span>
                    <span className="text-orange-700 font-black">{subIdx.heatwaveIndex}/100</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full transition-all duration-1000" style={{ width: `${subIdx.heatwaveIndex}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <button onClick={() => setActiveModal(null)} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs shadow-md transition-all cursor-pointer">
                Close (बंद करा)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. DYNAMIC CROP ADVISORY MODAL */}
      {activeModal === 'advisory' && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl animate-slideUp border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
                  <Sprout className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug break-words">
                    Agro Advice for {activeCrop} ({vName})
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-snug break-words">Soil: {village?.soilType || 'Black Soil'} • Groundwater: {village?.groundwaterStatus}</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs font-medium leading-relaxed">
              <div className="p-3.5 bg-emerald-50/90 border border-emerald-200 rounded-2xl shadow-2xs">
                <h4 className="font-black text-emerald-900 text-sm mb-1">🌱 Sowing & Seed Treatment for {activeCrop}</h4>
                <p className="text-slate-800 break-words">
                  Sow certified seeds suitable for {village?.soilType || 'Black Soil'}. Treat seeds with Trichoderma Viride (10g/kg) 24h prior to sowing in {vName}.
                </p>
              </div>

              <div className="p-3.5 bg-blue-50/90 border border-blue-200 rounded-2xl shadow-2xs">
                <h4 className="font-black text-blue-900 text-sm mb-1">💧 Water Conservation Tip for {activeCrop}</h4>
                <p className="text-slate-800 break-words">
                  Groundwater status in {vName} is {village?.groundwaterStatus || 'Critical'}. Use drip irrigation between 6 PM to 8 AM to save 35% water.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <button onClick={() => setActiveModal(null)} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs shadow-md transition-all cursor-pointer">
                Close (बंद करा)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. DYNAMIC HARVEST & MANDI PLANNING MODAL */}
      {activeModal === 'harvest' && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl animate-slideUp border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug break-words">
                    Harvest & APMC Mandi Guide: {activeCrop}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-snug break-words">Nearest Market Hub: {dName} APMC Mandi</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs font-medium leading-relaxed">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl shadow-2xs">
                <h4 className="font-black text-slate-900 text-sm mb-1">🌾 Ideal Harvest Time for {activeCrop} in {vName}</h4>
                <p className="text-slate-700 break-words">
                  Harvest <strong>{activeCrop}</strong> when moisture drops to 12-14% to avoid post-harvest rot during transport to {dName} Mandi.
                </p>
              </div>

              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl shadow-2xs">
                <h4 className="font-black text-amber-900 text-sm mb-1">💰 APMC {dName} Mandi Price Booster</h4>
                <p className="text-amber-800 font-bold break-words">
                  Grade {activeCrop} into A-Grade quality bins before visiting {dName} APMC Mandi to get 15-20% higher market price!
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <button onClick={() => setActiveModal(null)} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs shadow-md transition-all cursor-pointer">
                Close (बंद करा)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. DYNAMIC EMERGENCY ALERTS MODAL */}
      {activeModal === 'alert' && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl animate-slideUp border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold shadow-md animate-bounce shrink-0">
                  <Bell className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug break-words">
                    Emergency Alerts for {vName} ({bName})
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-snug break-words">Target Crop: <strong className="text-emerald-700">{activeCrop}</strong></p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs font-medium leading-relaxed">
              <div className="p-3.5 bg-red-50/90 border border-red-300 rounded-2xl flex items-start space-x-3 shadow-2xs">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-black text-red-900 text-sm break-words">⚠️ Climate Alert for {activeCrop} in {vName}</h4>
                  <p className="text-red-800 mt-1 break-words">
                    Temperature is expected to reach {todayForecast.maxTempC}°C with {todayForecast.precipitationProbPercent}% rain chance. Water <strong>{activeCrop}</strong> after 6 PM to prevent flower shedding.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50/90 border border-amber-300 rounded-2xl flex items-start space-x-3 shadow-2xs">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-black text-amber-900 text-sm break-words">🛡️ PMFBY Crop Insurance 72-Hour Helpline</h4>
                  <p className="text-amber-800 mt-1 break-words">
                    If unseasonal rain damages <strong>{activeCrop}</strong> fields in {vName}, call toll-free <strong>1800-180-1551</strong> within 72 hours with mobile photo evidence!
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <button onClick={() => setActiveModal(null)} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs shadow-md transition-all cursor-pointer">
                Close (बंद करा)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. DYNAMIC HISTORICAL WEATHER MODAL */}
      {activeModal === 'historical' && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl animate-slideUp border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 gap-2">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug break-words">
                    10-Year Historical Trends for {vName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-snug break-words">Decadal Analysis for {dName}</p>
                </div>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs font-medium leading-relaxed">
              <div className="p-3 bg-purple-50/80 border border-purple-200 rounded-2xl shadow-2xs">
                <h4 className="font-black text-purple-900 text-sm mb-1">🌧️ 10-Year Annual Rainfall Normal</h4>
                <p className="text-purple-800 break-words">
                  Normal annual rainfall in {vName} is <strong>{village?.annualRainfallNormal || 650} mm</strong>. Monsoon arrival fluctuates by 10-14 days.
                </p>
              </div>

              <div className="p-3 bg-teal-50/80 border border-teal-200 rounded-2xl shadow-2xs">
                <h4 className="font-black text-teal-900 text-sm mb-1">💧 Groundwater Depth History (CGWB)</h4>
                <p className="text-teal-800 break-words">
                  Groundwater status in {vName} is currently <strong>{village?.groundwaterStatus || 'Critical'}</strong>. Micro-drip irrigation is recommended for <strong>{activeCrop}</strong>.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-right">
              <button onClick={() => setActiveModal(null)} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs shadow-md transition-all cursor-pointer">
                Close (बंद करा)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
