import React, { useState, useRef } from 'react';
import { CloudRain, ShieldCheck, Sprout, Calendar, Bell, LineChart, Star, Sparkles, X, ArrowRight, ChevronLeft, ChevronRight, Thermometer, Droplets, Wind, AlertTriangle, ShieldAlert, Satellite, MapPin, Cpu, CheckCircle } from 'lucide-react';

export default function PlatformImpactFeatures({ village, riskMetrics, selectedCrop, isDarkMode = false }) {
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
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 border border-teal-500/40 p-3.5 sm:p-4 rounded-3xl text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transform hover:scale-[1.005] transition-all">
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
      <div className={`rounded-3xl p-4 sm:p-5 shadow-sm border relative overflow-hidden transition-all duration-500 ${
        isDarkMode
          ? 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
          : 'glass-card border-slate-200/80 text-slate-900'
      }`}>
        <div className="flex items-center justify-between mb-3.5 relative z-10 gap-2">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
            </div>
            <div className="min-w-0">
              <h2 className={`text-xs sm:text-base font-black leading-tight break-words ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Platform Features Slide Bar <span className="text-[11px] sm:text-xs font-bold text-emerald-500 block sm:inline">(वैशिष्ट्ये स्लाइड बार)</span>
              </h2>
              <p className={`text-[10px] sm:text-[11px] font-medium truncate mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Slide to launch 6 climate tools for <strong>{vName}</strong>
              </p>
            </div>
          </div>

          {/* Slider Arrows */}
          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={() => scrollSlider('left', sliderRef)}
              className={`p-1.5 sm:p-2 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95 ${
                isDarkMode ? 'bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white' : 'bg-slate-100 hover:bg-emerald-600 text-slate-700 hover:text-white'
              }`}
              aria-label="Previous Feature Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollSlider('right', sliderRef)}
              className={`p-1.5 sm:p-2 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95 ${
                isDarkMode ? 'bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white' : 'bg-slate-100 hover:bg-emerald-600 text-slate-700 hover:text-white'
              }`}
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
                className={`snap-start shrink-0 w-60 sm:w-72 border p-3 sm:p-3.5 rounded-2xl flex items-center justify-between transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl cursor-pointer text-left group bg-gradient-to-r ${feat.bgGradient} ${
                  isDarkMode
                    ? 'bg-slate-950/80 border-slate-800 hover:border-emerald-400 hover:shadow-emerald-950/50'
                    : 'glass-panel border-slate-200/80 hover:border-emerald-500'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl border flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-slate-900 border-slate-700 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white'
                      : 'bg-white border-slate-200 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white'
                  }`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className={`text-xs sm:text-sm font-black leading-tight truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{feat.title}</h3>
                    <p className={`text-[10px] font-bold truncate mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{feat.subtitle}</p>
                    <span className="inline-block mt-1 text-[9px] bg-emerald-500/20 text-emerald-300 font-black px-2 py-0.5 rounded-md border border-emerald-500/30">
                      {feat.badge}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0 ml-1" />
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. EXPECTED OUTCOMES SLIDE BAR */}
      <div className={`rounded-3xl p-4 sm:p-5 shadow-sm border relative overflow-hidden transition-all duration-500 ${
        isDarkMode
          ? 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
          : 'glass-card border-slate-200/80 text-slate-900'
      }`}>
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-emerald-400 font-bold" />
            </div>
            <div>
              <h2 className={`text-xs sm:text-sm font-black leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Expected Outcomes <span className="text-[10px] sm:text-[11px] font-bold text-emerald-500">(अपेक्षित फायदे)</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={() => scrollSlider('left', outcomeSliderRef)}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                isDarkMode ? 'bg-slate-800 hover:bg-emerald-600 text-white' : 'bg-slate-100 hover:bg-emerald-600 text-slate-700 hover:text-white'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => scrollSlider('right', outcomeSliderRef)}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                isDarkMode ? 'bg-slate-800 hover:bg-emerald-600 text-white' : 'bg-slate-100 hover:bg-emerald-600 text-slate-700 hover:text-white'
              }`}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div
          ref={outcomeSliderRef}
          className="flex space-x-2.5 overflow-x-auto scrollbar-none snap-x py-1 scroll-smooth"
        >
          {outcomes.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModal(item.id)}
                className={`snap-start shrink-0 px-3 py-2 rounded-2xl border text-xs font-bold flex items-center space-x-2 transition-all transform hover:scale-105 cursor-pointer whitespace-nowrap shadow-2xs ${
                  isDarkMode
                    ? 'bg-slate-950/80 border-slate-800 text-emerald-300 hover:border-emerald-500'
                    : item.color
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.text}</span>
                <span className="opacity-80 text-[11px]">({item.textMr})</span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
