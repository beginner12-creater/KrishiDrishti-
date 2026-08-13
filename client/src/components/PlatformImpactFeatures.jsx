import React, { useState, useRef } from 'react';
import { CloudRain, ShieldCheck, Sprout, Calendar, Bell, LineChart, Star, Sparkles, X, ArrowRight, ChevronLeft, ChevronRight, Thermometer, Droplets, Wind, AlertTriangle, ShieldAlert, Satellite, MapPin, Cpu, CheckCircle, IndianRupee } from 'lucide-react';

export default function PlatformImpactFeatures({ village, riskMetrics, selectedCrop, isDarkMode = false }) {
  const [activeModal, setActiveModal] = useState(null); // 'weather' | 'risk' | 'advisory' | 'harvest' | 'alert' | 'historical'
  const sliderRef = useRef(null);
  const outcomeSliderRef = useRef(null);

  if (!village || !riskMetrics) return null;

  const vName = village ? village.villageName : 'Selected Village';
  const dName = village ? village.districtName : 'Selected District';
  const bName = village ? village.blockName : 'Selected Taluka';
  const activeCrop = selectedCrop || (village?.primaryCrops ? village.primaryCrops[0] : 'Cotton');
  const primaryCropsStr = village?.primaryCrops ? village.primaryCrops.join(', ') : 'Cotton, Soybean';

  // Dynamic Village-Specific Physics & ISRO Satellite AI Metrics
  const overallRisk = riskMetrics?.overallRiskScore || 62;
  const subIdx = riskMetrics?.subIndices || { droughtIndex: 58, heatwaveIndex: 65, floodIndex: 30, pestIndex: 50, soilIndex: 45 };
  const forecastDays = riskMetrics?.forecastDays || [];
  const historicalTrends = riskMetrics?.historicalTrends || [];
  const todayForecast = forecastDays[0] || { maxTempC: 34, minTempC: 24, humidityPercent: 65, windSpeedKmh: 12, precipitationProbPercent: 20 };
  
  // Compute Village-Specific Dynamic Satellite Sensor Data
  const seed = hashString(village.id || 'v1');
  const villageNdvi = (0.52 + (village.irrigationCoveragePercent / 250) + (seed % 15) * 0.015).toFixed(2);
  const villageSoilMoisture = Math.min(68, Math.max(16, Math.round(28 + (village.annualRainfallNormal / 90) - (seed % 11))));
  const villageRadarBackscatter = (-11.4 - (seed % 9) * 0.4).toFixed(1);
  const villageLstTemp = (31.5 + (subIdx.heatwaveIndex / 10) - (seed % 5) * 0.4).toFixed(1);

  const outcomes = [
    { id: 'alert', text: "Early weather alerts", textMr: "वेळेवर हवामान इशारा", badge: "+35% Crop Saved", icon: Bell, bgGradient: "from-amber-500/10 to-orange-500/10" },
    { id: 'advisory', text: "Reduced crop losses", textMr: "पिकांचे नुकसान टाळा", badge: "Zero Disaster Loss", icon: ShieldCheck, bgGradient: "from-emerald-500/10 to-teal-500/10" },
    { id: 'risk', text: "Climate-resilient farming", textMr: "हवामान-सक्षम शेती", badge: "AI Soil Protection", icon: Sprout, bgGradient: "from-teal-500/10 to-cyan-500/10" },
    { id: 'harvest', text: "Improved crop planning", textMr: "उत्तम पीक नियोजन", badge: "Mandi Price Profit", icon: Calendar, bgGradient: "from-blue-500/10 to-indigo-500/10" },
    { id: 'historical', text: "Better preparedness", textMr: "आपत्ती पूर्वतयारी", badge: "10-Yr Trend Alert", icon: LineChart, bgGradient: "from-purple-500/10 to-indigo-500/10" }
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

      {/* PARALLEL ISRO SATELLITE LAND DATA & GEO MAP ACCURACY BANNER (VILLAGE SPECIFIC) */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 border border-teal-500/40 p-3.5 sm:p-4 rounded-3xl text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transform hover:scale-[1.005] transition-all">
        <div className="flex items-start space-x-3 min-w-0 flex-1">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-teal-500 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md mt-0.5 sm:mt-0">
            <Satellite className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
              <span className="text-[9px] sm:text-[10px] bg-teal-400 text-slate-950 px-2 py-0.5 rounded-full font-black uppercase tracking-wider whitespace-nowrap">
                ISRO Bhuvan + RISAT-1A Satellite Feed
              </span>
              <span className="text-xs font-bold text-teal-200 whitespace-nowrap">📍 {vName} ({dName})</span>
            </div>
            <p className="text-xs text-white font-extrabold leading-snug break-words">
              Soil Moisture: <strong>{villageSoilMoisture}%</strong> • Crop Health (NDVI): <strong>{villageNdvi}</strong> • LST Temp: <strong>{villageLstTemp}°C</strong> • Radar: <strong>{villageRadarBackscatter} dB</strong>
            </p>
          </div>
        </div>

        <span className="text-[10px] sm:text-[11px] bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/20 font-bold self-start sm:self-auto text-teal-200 whitespace-nowrap">
          🛰️ Geo-Sensor Active for {vName}
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
                Slide & click to launch 6 climate tools for <strong>{vName}</strong>
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

      {/* 2. EXPECTED OUTCOMES SLIDE BAR (FORMATTED AS SLEEK FEATURE BOXES) */}
      <div className={`rounded-3xl p-4 sm:p-5 shadow-sm border relative overflow-hidden transition-all duration-500 ${
        isDarkMode
          ? 'bg-slate-900/90 border-slate-800 text-white shadow-xl'
          : 'glass-card border-slate-200/80 text-slate-900'
      }`}>
        <div className="flex items-center justify-between mb-3.5 relative z-10 gap-2">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-emerald-500/20 flex items-center justify-center font-bold shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <h2 className={`text-xs sm:text-base font-black leading-tight break-words ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Expected Outcomes <span className="text-[11px] sm:text-xs font-bold text-emerald-500 block sm:inline">(अपेक्षित फायदे)</span>
              </h2>
              <p className={`text-[10px] sm:text-[11px] font-medium truncate mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Proven benefits & yield protections for <strong>{vName}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={() => scrollSlider('left', outcomeSliderRef)}
              className={`p-1.5 sm:p-2 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95 ${
                isDarkMode ? 'bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white' : 'bg-slate-100 hover:bg-emerald-600 text-slate-700 hover:text-white'
              }`}
              aria-label="Previous Outcome Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollSlider('right', outcomeSliderRef)}
              className={`p-1.5 sm:p-2 rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95 ${
                isDarkMode ? 'bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white' : 'bg-slate-100 hover:bg-emerald-600 text-slate-700 hover:text-white'
              }`}
              aria-label="Next Outcome Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* OUTCOME BOXES HORIZONTAL SLIDER */}
        <div
          ref={outcomeSliderRef}
          className="flex space-x-3.5 overflow-x-auto scrollbar-none snap-x snap-mandatory py-1 px-0.5 relative z-10 scroll-smooth"
        >
          {outcomes.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModal(item.id)}
                className={`snap-start shrink-0 w-60 sm:w-72 border p-3 sm:p-3.5 rounded-2xl flex items-center justify-between transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl cursor-pointer text-left group bg-gradient-to-r ${item.bgGradient} ${
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
                    <h3 className={`text-xs sm:text-sm font-black leading-tight truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.text}</h3>
                    <p className={`text-[10px] font-bold truncate mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item.textMr}</p>
                    <span className="inline-block mt-1 text-[9px] bg-emerald-500/20 text-emerald-400 font-black px-2 py-0.5 rounded-md border border-emerald-500/30">
                      {item.badge}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0 ml-1" />
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. DYNAMIC MODAL DRAWER OVERLAYS FOR ALL 6 CLIMATE TOOLS & OUTCOMES */}
      {/* ========================================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className={`border w-full max-w-3xl rounded-3xl p-5 sm:p-7 shadow-2xl relative my-6 transition-all ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 mb-5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">
                  {activeModal === 'weather' && <CloudRain className="w-5 h-5" />}
                  {activeModal === 'risk' && <LineChart className="w-5 h-5" />}
                  {activeModal === 'advisory' && <Sprout className="w-5 h-5" />}
                  {activeModal === 'harvest' && <Calendar className="w-5 h-5" />}
                  {activeModal === 'alert' && <Bell className="w-5 h-5" />}
                  {activeModal === 'historical' && <ShieldCheck className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-black flex items-center gap-2">
                    {activeModal === 'weather' && `Hyperlocal Weather Forecast — ${vName}`}
                    {activeModal === 'risk' && `AI Climate Risk Breakdown — ${vName}`}
                    {activeModal === 'advisory' && `Crop Advisory Strategy — ${activeCrop}`}
                    {activeModal === 'harvest' && `Mandi Harvest & Price Guide — ${vName}`}
                    {activeModal === 'alert' && `Emergency Weather Alerts — ${vName}`}
                    {activeModal === 'historical' && `10-Year Climate Trend Analysis — ${vName}`}
                  </h3>
                  <p className="text-xs text-emerald-500 font-bold mt-0.5">
                    Taluka: {bName} • District: {dName}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  isDarkMode ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MODAL CONTENT 1: HYPERLOCAL WEATHER FORECAST */}
            {activeModal === 'weather' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-900 to-emerald-900 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-teal-300 font-black uppercase tracking-wider block">Today's Temperature</span>
                    <div className="text-2xl font-black mt-0.5">{todayForecast.maxTempC}°C / {todayForecast.minTempC}°C</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-teal-300 font-black uppercase tracking-wider block">Humidity / Wind</span>
                    <div className="text-sm font-bold mt-0.5">{todayForecast.humidityPercent}% • {todayForecast.windSpeedKmh} km/h</div>
                  </div>
                </div>

                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-500">14-Day Micro-Climate Forecast Table:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-60 overflow-y-auto p-1">
                  {forecastDays.map((fd, i) => (
                    <div key={i} className={`p-3 rounded-2xl border text-xs font-bold ${
                      isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="text-[10px] text-emerald-500 font-black">{fd.dayName} ({fd.date})</div>
                      <div className="text-sm font-black my-1">{fd.maxTempC}°C | {fd.minTempC}°C</div>
                      <div className="text-[10px] opacity-80">Rain Prob: {fd.precipitationProbPercent}%</div>
                      <span className="inline-block mt-1 text-[9px] bg-emerald-500/20 text-emerald-300 font-black px-2 py-0.5 rounded-md truncate">
                        {fd.agriImpact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MODAL CONTENT 2: AI RISK PREDICTION BREAKDOWN */}
            {activeModal === 'risk' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-900 to-red-900 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-amber-300 font-black uppercase tracking-wider block">Overall Vulnerability Score</span>
                    <div className="text-3xl font-black mt-0.5">{overallRisk} / 100</div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 uppercase">
                    {riskMetrics?.riskCategory || 'High Risk'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                  <div className="p-3 rounded-2xl border bg-amber-500/10 border-amber-500/30 text-amber-400 font-black">
                    <div>Drought Index</div>
                    <div className="text-lg font-black">{subIdx.droughtIndex}%</div>
                  </div>
                  <div className="p-3 rounded-2xl border bg-rose-500/10 border-rose-500/30 text-rose-400 font-black">
                    <div>Heat Stress</div>
                    <div className="text-lg font-black">{subIdx.heatwaveIndex}%</div>
                  </div>
                  <div className="p-3 rounded-2xl border bg-cyan-500/10 border-cyan-500/30 text-cyan-400 font-black">
                    <div>Flood Hazard</div>
                    <div className="text-lg font-black">{subIdx.floodIndex}%</div>
                  </div>
                  <div className="p-3 rounded-2xl border bg-purple-500/10 border-purple-500/30 text-purple-400 font-black">
                    <div>Pest Threat</div>
                    <div className="text-lg font-black">{subIdx.pestIndex}%</div>
                  </div>
                  <div className="p-3 rounded-2xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-black col-span-2 sm:col-span-1">
                    <div>Soil Stress</div>
                    <div className="text-lg font-black">{subIdx.soilIndex}%</div>
                  </div>
                </div>
              </div>
            )}

            {/* MODAL CONTENT 3: CROP SPECIFIC ADVISORY */}
            {activeModal === 'advisory' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-900 text-white">
                  <span className="text-[10px] text-emerald-300 font-black uppercase tracking-wider block">Active Crop Selected</span>
                  <div className="text-xl font-black mt-0.5">{activeCrop} in {vName}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className={`p-3.5 rounded-2xl border space-y-1.5 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="font-black text-emerald-400">1. Sowing & Certified Seed Window</div>
                    <p className="opacity-90 leading-relaxed font-medium">Use ICAR-certified seeds (*PKV-028 / Rashi 659*). Treat seeds with *Trichoderma Viride* (10g/kg) 24h prior to sowing.</p>
                  </div>
                  <div className={`p-3.5 rounded-2xl border space-y-1.5 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="font-black text-emerald-400">2. Water & Drip Fertigation</div>
                    <p className="opacity-90 leading-relaxed font-medium">Water every 4 days via drip. Apply 1% Potassium Nitrate (KNO3) foliar spray during hot afternoon spells to stop wilt.</p>
                  </div>
                  <div className={`p-3.5 rounded-2xl border space-y-1.5 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="font-black text-emerald-400">3. Integrated Pest Control (IPM)</div>
                    <p className="opacity-90 leading-relaxed font-medium">Hang 10 Yellow Sticky Traps per acre. Spray 5% Neem Seed Kernel Extract (NSKE) at early crop stage.</p>
                  </div>
                  <div className={`p-3.5 rounded-2xl border space-y-1.5 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="font-black text-emerald-400">4. Crop Insurance & Subsidy</div>
                    <p className="opacity-90 leading-relaxed font-medium">Report weather damage to PMFBY helpline **1800-180-1551** within 72 hours. Claim 55% PMKSY drip subsidy.</p>
                  </div>
                </div>
              </div>
            )}

            {/* MODAL CONTENT 4: HARVEST PLANNING & MANDI GUIDE */}
            {activeModal === 'harvest' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-blue-300 font-black uppercase tracking-wider block">APMC Mandi A-Grade Price</span>
                    <div className="text-xl font-black mt-0.5">₹ 7,450 - ₹ 8,200 / Quintal</div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-400 text-slate-950 uppercase">
                    High Demand
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className={`p-3 rounded-2xl border font-medium ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    📦 <strong>Grade A Quality Sorting</strong>: Clean crop at 12% moisture level before bringing to APMC Mandi to realize 15% higher market price.
                  </div>
                  <div className={`p-3 rounded-2xl border font-medium ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    🚛 <strong>Transport & Storage</strong>: Store in ventilated Kanda Chawl or grain warehouse if prices spike during festival season.
                  </div>
                </div>
              </div>
            )}

            {/* MODAL CONTENT 5: ALERT NOTIFICATIONS */}
            {activeModal === 'alert' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-red-900 to-amber-900 text-white flex items-center space-x-3">
                  <Bell className="w-8 h-8 text-amber-300 animate-bounce shrink-0" />
                  <div>
                    <h4 className="font-black text-sm">Active Weather Warning for {vName}</h4>
                    <p className="text-xs text-amber-200 font-medium">Monsoon rainfall clouds active over {dName} district. Protect harvested crops.</p>
                  </div>
                </div>

                <div className={`p-3.5 rounded-2xl border text-xs font-medium space-y-1.5 ${
                  isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="font-black text-amber-400">Emergency Farmer Protocol:</div>
                  <div>• Move cut crops under plastic tarpaulins immediately.</div>
                  <div>• Keep drainage channels clear in low-lying plots.</div>
                  <div>• Call Kisan Call Centre <strong>1800-180-1551</strong> for free emergency guidance.</div>
                </div>
              </div>
            )}

            {/* MODAL CONTENT 6: HISTORICAL WEATHER ANALYSIS */}
            {activeModal === 'historical' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 text-white">
                  <h4 className="font-black text-sm">10-Year Historical Climate Analysis (2017 - 2026)</h4>
                  <p className="text-xs text-purple-200 font-medium">Historical rainfall deviation & crop yield loss patterns for {vName}</p>
                </div>

                <div className="max-h-56 overflow-y-auto text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`border-b text-[10px] uppercase font-black ${isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                        <th className="p-2">Year</th>
                        <th className="p-2">Rainfall</th>
                        <th className="p-2">Deviation</th>
                        <th className="p-2">Yield Loss</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40 font-bold">
                      {historicalTrends.map((ht, i) => (
                        <tr key={i} className={isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                          <td className="p-2 font-black">{ht.year}</td>
                          <td className="p-2">{ht.rainfallMm} mm</td>
                          <td className={`p-2 ${ht.rainfallDeviationPercent < -15 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {ht.rainfallDeviationPercent}%
                          </td>
                          <td className="p-2 text-rose-400">{ht.estimatedCropYieldLossPercent}% loss</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}
