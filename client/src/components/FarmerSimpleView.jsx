import React, { useState } from 'react';
import { Sprout, Droplets, Bug, Sun, PhoneCall, Volume2, ArrowRight, Sparkles } from 'lucide-react';

export default function FarmerSimpleView({ village, riskMetrics, onSelectCrop }) {
  const [selectedCrop, setSelectedCrop] = useState(village?.primaryCrops[0] || 'Cotton');
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!village || !riskMetrics) return null;

  const { overallRiskScore, subIndices, cropVulnerability } = riskMetrics;

  // Simple Clean Status Badge for Farmers
  const getSimpleStatus = (score) => {
    if (score >= 70) return { title: '🔴 HIGH RISK (धोका)', bg: 'bg-rose-950/90 border-rose-600 text-rose-200', text: 'Needs Immediate Care! Follow 4-step advice below.' };
    if (score >= 45) return { title: '🟡 MODERATE RISK (काळजी घ्या)', bg: 'bg-amber-950/90 border-amber-600 text-amber-200', text: 'Take preventive measures for your crops.' };
    return { title: '🟢 GOOD CONDITIONS (सुरक्षित)', bg: 'bg-emerald-950/90 border-emerald-600 text-emerald-200', text: 'Weather is favorable. Follow normal irrigation schedule.' };
  };

  const status = getSimpleStatus(overallRiskScore);

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
      
      {/* 1. WEATHER STATUS BANNER */}
      <div className={`p-6 sm:p-8 rounded-3xl border-2 shadow-xl transition-all ${status.bg}`}>
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

          <button
            onClick={() => handleReadAloud(`Namaste. In ${village.villageName}, current weather risk level is ${status.title}. Recommended advice for ${selectedCrop}: ${cropInfo?.resilienceTip}`)}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-white text-slate-950 font-black text-sm shadow-xl hover:bg-slate-100 transition-all shrink-0 active:scale-95"
          >
            <Volume2 className={`w-5 h-5 text-emerald-600 ${isSpeaking ? 'animate-pulse' : ''}`} />
            <span>{isSpeaking ? 'Stop Voice' : '🔊 Listen Advice (ऐका / सुनें)'}</span>
          </button>
        </div>

        {/* Quick Weather Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs sm:text-sm font-bold">
          <div className="bg-black/30 p-3.5 rounded-2xl border border-white/10 flex items-center space-x-3">
            <Sun className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <div className="text-[11px] opacity-80">Drought (दुष्काळ)</div>
              <div className="text-base font-extrabold">{subIndices.droughtIndex > 60 ? 'HIGH' : 'LOW'}</div>
            </div>
          </div>
          <div className="bg-black/30 p-3.5 rounded-2xl border border-white/10 flex items-center space-x-3">
            <Droplets className="w-6 h-6 text-cyan-400 shrink-0" />
            <div>
              <div className="text-[11px] opacity-80">Water (पाणी)</div>
              <div className="text-base font-extrabold">{village.groundwaterStatus.split(' ')[0]}</div>
            </div>
          </div>
          <div className="bg-black/30 p-3.5 rounded-2xl border border-white/10 flex items-center space-x-3">
            <Bug className="w-6 h-6 text-purple-400 shrink-0" />
            <div>
              <div className="text-[11px] opacity-80">Pest (कीड)</div>
              <div className="text-base font-extrabold">{subIndices.pestIndex > 60 ? 'HIGH' : 'SAFE'}</div>
            </div>
          </div>
          <div className="bg-black/30 p-3.5 rounded-2xl border border-white/10 flex items-center space-x-3">
            <Sprout className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[11px] opacity-80">Rain (पाऊस)</div>
              <div className="text-base font-extrabold">{village.annualRainfallNormal} mm</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CHOOSE CROP */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 sm:p-6 rounded-3xl shadow-xl">
        <h3 className="text-base sm:text-lg font-black text-slate-100 mb-3 flex items-center gap-2">
          <Sprout className="w-6 h-6 text-emerald-400" />
          Select Your Crop (आपले पीक निवडा):
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
                className={`p-4 rounded-2xl text-left border-2 transition-all min-h-[85px] flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-lg scale-[1.02]'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-200 border-slate-800'
                }`}
              >
                <div className="text-[11px] font-semibold opacity-80">Crop</div>
                <div className="text-base font-extrabold">{crop}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. 4-STEP ACTION PLAN FOR FARMERS */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 sm:p-6 rounded-3xl shadow-xl space-y-4">
        <h3 className="text-base sm:text-lg font-black text-slate-100 mb-1 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-400" />
          4 Action Steps for {selectedCrop} (शेतातील उपाय):
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Step 1 */}
          <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black text-base">
                1
              </div>
              <h4 className="text-sm font-extrabold text-slate-100">💧 Watering (पाणी व्यवस्थापन)</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800/80">
              {subIndices.droughtIndex > 50
                ? 'Irrigate evening or early morning (6 PM - 8 AM). Use straw mulching to save 35% water.'
                : 'Follow normal irrigation schedule. Avoid excess watering.'}
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-base">
                2
              </div>
              <h4 className="text-sm font-extrabold text-slate-100">🌱 Soil & Fertilizer (खत आणि माती)</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800/80">
              Apply 1% Potassium Nitrate (KNO3) foliar spray during hot afternoon dry spells to protect leaves from heat.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-base">
                3
              </div>
              <h4 className="text-sm font-extrabold text-slate-100">🐛 Pest Control (कीड नियंत्रण)</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800/80">
              {cropInfo?.resilienceTip || 'Install 8-10 Sticky Traps per acre. Spray 5% Neem Seed Kernel Extract (NSKE).'}
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-black text-base">
                4
              </div>
              <h4 className="text-sm font-extrabold text-slate-100">🛡️ Crop Insurance (पिक विमा)</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800/80">
              In case of drought/flood damage, inform your bank or call toll-free **1800-180-1551** within 72 hours.
            </p>
          </div>

        </div>
      </div>

      {/* 4. HELPLINE CARD */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 rounded-3xl text-slate-950 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-950 text-emerald-400 flex items-center justify-center shrink-0">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-black">Kisan Call Centre Helpline (किसान हेल्पलाइन)</h4>
            <p className="text-xs font-semibold text-emerald-950">Free Government Helpline for Farmers</p>
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
