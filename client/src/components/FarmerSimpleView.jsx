import React, { useState } from 'react';
import { Sprout, Droplets, ShieldAlert, Bug, Sun, CheckCircle2, PhoneCall, Volume2, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

export default function FarmerSimpleView({ village, riskMetrics, onSelectCrop }) {
  const [selectedCrop, setSelectedCrop] = useState(village?.primaryCrops[0] || 'Cotton');
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!village || !riskMetrics) return null;

  const { overallRiskScore, riskCategory, subIndices, cropVulnerability } = riskMetrics;

  // Simple Risk Status Badge for Farmers
  const getSimpleStatus = (score) => {
    if (score >= 70) return { title: '🔴 HIGH RISK (धोका / खतरा)', bg: 'bg-rose-950/90 border-rose-600 text-rose-200', text: 'Needs Immediate Care! Follow 4-step advice below.' };
    if (score >= 45) return { title: '🟡 MODERATE RISK (काळजी घ्या / ध्यान दें)', bg: 'bg-amber-950/90 border-amber-600 text-amber-200', text: 'Take preventive measures for your crops.' };
    return { title: '🟢 GOOD CONDITIONS (सुरक्षित / सुरक्षित)', bg: 'bg-emerald-950/90 border-emerald-600 text-emerald-200', text: 'Weather is favorable. Follow normal irrigation schedule.' };
  };

  const status = getSimpleStatus(overallRiskScore);

  // Text-to-speech for farmers (Native Browser Speech)
  const handleReadAloud = (textToRead) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const cropInfo = cropVulnerability.find(c => c.cropName === selectedCrop) || cropVulnerability[0];

  return (
    <div className="space-y-6">
      
      {/* 1. BIG SIMPLE WEATHER & RISK STATUS BANNER FOR FARMERS */}
      <div className={`p-6 sm:p-8 rounded-3xl border-2 shadow-2xl transition-all ${status.bg}`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-black/40 uppercase tracking-widest text-slate-100">
                शेतकरी सल्ला / किसान सलाह
              </span>
              <span className="text-xs font-semibold opacity-90">📍 {village.villageName} ({village.districtName})</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight my-1">
              {status.title}
            </h2>
            <p className="text-sm sm:text-base font-medium opacity-90 mt-1">
              {status.text}
            </p>
          </div>

          {/* Voice Read Aloud Button for Farmers */}
          <button
            onClick={() => handleReadAloud(`Namaste. In ${village.villageName}, current weather risk level is ${status.title}. Recommended advice for ${selectedCrop}: ${cropInfo?.resilienceTip}`)}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-white text-slate-950 font-black text-sm shadow-xl hover:bg-slate-100 transition-all shrink-0 active:scale-95"
          >
            <Volume2 className={`w-5 h-5 text-emerald-600 ${isSpeaking ? 'animate-pulse' : ''}`} />
            <span>{isSpeaking ? 'Stop Voice (आवाज बंद करा)' : 'Listen Voice Advice (ऐका / सुनें)'}</span>
          </button>
        </div>

        {/* Quick Hazard Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs sm:text-sm font-bold">
          <div className="bg-black/30 p-3 rounded-2xl border border-white/10 flex items-center space-x-2">
            <Sun className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-[11px] opacity-80">Drought (दुष्काळ)</div>
              <div className="text-base font-extrabold">{subIndices.droughtIndex > 60 ? 'HIGH' : 'LOW'}</div>
            </div>
          </div>
          <div className="bg-black/30 p-3 rounded-2xl border border-white/10 flex items-center space-x-2">
            <Droplets className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <div className="text-[11px] opacity-80">Water (पाणी स्थिति)</div>
              <div className="text-base font-extrabold">{village.groundwaterStatus.split(' ')[0]}</div>
            </div>
          </div>
          <div className="bg-black/30 p-3 rounded-2xl border border-white/10 flex items-center space-x-2">
            <Bug className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <div className="text-[11px] opacity-80">Pests (कीड धोका)</div>
              <div className="text-base font-extrabold">{subIndices.pestIndex > 60 ? 'HIGH' : 'SAFE'}</div>
            </div>
          </div>
          <div className="bg-black/30 p-3 rounded-2xl border border-white/10 flex items-center space-x-2">
            <Sprout className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[11px] opacity-80">Rain (पाऊस)</div>
              <div className="text-base font-extrabold">{village.annualRainfallNormal} mm</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CHOOSE YOUR CROP (आपले पीक निवडा / अपनी फसल चुनें) */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl">
        <h3 className="text-base sm:text-lg font-black text-slate-100 mb-3 flex items-center gap-2">
          <Sprout className="w-6 h-6 text-emerald-400" />
          Step 1: Choose Your Crop (आपले पीक निवडा / अपनी फसल चुनें)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {village.primaryCrops.map(crop => {
            const isSelected = selectedCrop === crop;
            return (
              <button
                key={crop}
                onClick={() => {
                  setSelectedCrop(crop);
                  onSelectCrop(crop);
                }}
                className={`p-4 rounded-2xl text-left border-2 transition-all flex flex-col justify-between min-h-[90px] ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-lg scale-[1.02]'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-800'
                }`}
              >
                <div className="text-xs font-semibold opacity-80">Fasal / Crop</div>
                <div className="text-base font-extrabold mt-1">{crop}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SIMPLE 4-STEP FARMER ACTION PLAN (4 महत्त्वाचे उपाय) */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-base sm:text-lg font-black text-slate-100 mb-1 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-400" />
          Step 2: 4 Simple Action Steps for {selectedCrop} (शेतातील महत्त्वाचे उपाय)
        </h3>
        <p className="text-xs text-slate-400 mb-4">Follow these simple steps in your farm today to protect your crops</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Step A: Watering */}
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black text-lg">
                1
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-100">💧 Watering & Irrigation (पाणी व्यवस्थापन)</h4>
                <p className="text-xs text-slate-400">Moisture protection for roots</p>
              </div>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              {subIndices.droughtIndex > 50
                ? 'Irrigate only during evening or early morning (6 PM - 8 AM). Use straw mulching between crop rows to save 35% water.'
                : 'Follow normal irrigation schedule. Avoid over-watering to prevent root rot.'}
            </p>
          </div>

          {/* Step B: Fertilizer */}
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-lg">
                2
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-100">🌱 Soil & Fertilizer (खत आणि माती)</h4>
                <p className="text-xs text-slate-400">Nutrient spray for crop strength</p>
              </div>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              Apply 1% Potassium Nitrate (KNO3) foliar spray during hot afternoon dry spells to protect crop leaves from heat stress.
            </p>
          </div>

          {/* Step C: Pest Control */}
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-lg">
                3
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-100">🐛 Pest & Disease Protection (कीड नियंत्रण)</h4>
                <p className="text-xs text-slate-400">Biological pest control</p>
              </div>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              {cropInfo?.resilienceTip || 'Install 8-10 Pheromone & Yellow Sticky Traps per acre. Spray 5% Neem Seed Kernel Extract (NSKE).'}
            </p>
          </div>

          {/* Step D: Crop Insurance */}
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-black text-lg">
                4
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-100">🛡️ Crop Insurance PMFBY (पिक विमा मदत)</h4>
                <p className="text-xs text-slate-400">Financial safety helpline</p>
              </div>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              In case of unseasonal rain or drought damage, inform your bank or call toll-free **1800-180-1551** within 72 hours with geotagged farm photos.
            </p>
          </div>

        </div>
      </div>

      {/* 4. FARMER HELPLINE CARD */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 rounded-3xl text-slate-950 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-950 text-emerald-400 flex items-center justify-center shrink-0">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-black">Kisan Call Centre Helpline (किसान हेल्पलाइन)</h4>
            <p className="text-xs font-semibold text-emerald-950">Free Government Agricultural Advisory Helpline for Farmers</p>
          </div>
        </div>

        <a
          href="tel:18001801551"
          className="px-6 py-3 bg-slate-950 text-emerald-400 font-black text-sm rounded-2xl shadow-xl hover:bg-slate-900 transition-all shrink-0 flex items-center space-x-2"
        >
          <span>Call 1800-180-1551</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

    </div>
  );
}
