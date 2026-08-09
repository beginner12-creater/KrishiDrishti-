import React, { useState } from 'react';
import { Sprout, Droplets, Bug, Sun, PhoneCall, Volume2, ArrowRight, Sparkles, VolumeX } from 'lucide-react';

export default function FarmerSimpleView({ village, riskMetrics, onSelectCrop }) {
  const [selectedCrop, setSelectedCrop] = useState(village?.primaryCrops[0] || 'Cotton');
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!village || !riskMetrics) return null;

  const { overallRiskScore, subIndices, cropVulnerability } = riskMetrics;

  // Simple Clean Status Badge for Farmers
  const getSimpleStatus = (score) => {
    if (score >= 70) return { title: '🔴 HIGH RISK (धोका)', color: 'Red', text: 'Weather warning! Follow protection steps below.' };
    if (score >= 45) return { title: '🟡 MODERATE RISK (काळजी घ्या)', color: 'Yellow', text: 'Take simple precautions for your crops.' };
    return { title: '🟢 GOOD CONDITIONS (सुरक्षित)', color: 'Green', text: 'Weather is good. Follow regular crop care.' };
  };

  const status = getSimpleStatus(overallRiskScore);

  // Non-Technical, Simple Voice Assistant for Farmers
  const handleReadAloud = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Generate simple non-technical speech text
    let simpleVoiceText = "";
    
    if (overallRiskScore >= 70) {
      simpleVoiceText = `Hello Farmer brother! In ${village.villageName} village today, climate risk is high. For your ${selectedCrop} crop, irrigate only in early morning or evening. Spray Neem oil for pests, and stay alert. Thank you!`;
    } else if (overallRiskScore >= 45) {
      simpleVoiceText = `Hello Farmer brother! In ${village.villageName} village, weather requires care. For ${selectedCrop}, give light watering in evening and check leaves for pests. Thank you!`;
    } else {
      simpleVoiceText = `Hello Farmer brother! In ${village.villageName} village, weather is good today. Give normal water to your ${selectedCrop} crop and ensure proper field care. Thank you!`;
    }

    const utterance = new SpeechSynthesisUtterance(simpleVoiceText);
    utterance.rate = 0.85; // Slightly slower, easy to hear
    utterance.pitch = 1.0;
    
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const cropInfo = cropVulnerability.find(c => c.cropName === selectedCrop) || cropVulnerability[0];

  return (
    <div className="space-y-6">
      
      {/* 1. WEATHER STATUS BANNER */}
      <div className="bg-slate-900 border-2 border-slate-800 p-6 sm:p-8 rounded-3xl shadow-xl transition-all">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase tracking-widest">
                शेतकरी सल्ला / किसान सलाह
              </span>
              <span className="text-xs font-semibold text-slate-400">📍 {village.villageName} ({village.districtName})</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight my-1 text-slate-100">
              {status.title}
            </h2>
            <p className="text-sm sm:text-base font-medium text-slate-300 mt-1">
              {status.text}
            </p>
          </div>

          {/* Simple Voice Button */}
          <button
            onClick={handleReadAloud}
            className={`flex items-center space-x-2.5 px-6 py-3.5 rounded-2xl font-black text-sm transition-all shrink-0 active:scale-95 shadow-xl ${
              isSpeaking
                ? 'bg-rose-500 text-slate-950 animate-pulse'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            <span>{isSpeaking ? 'Stop Voice (आवाज बंद करा)' : '🔊 Listen Voice (ऐका / सुनें)'}</span>
          </button>
        </div>

        {/* Quick Simple Weather Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800 text-xs sm:text-sm font-bold">
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 flex items-center space-x-3">
            <Sun className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400">Drought (दुष्काळ)</div>
              <div className="text-base font-extrabold text-slate-100">{subIndices.droughtIndex > 60 ? 'HIGH' : 'LOW'}</div>
            </div>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 flex items-center space-x-3">
            <Droplets className="w-6 h-6 text-cyan-400 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400">Water (पाणी)</div>
              <div className="text-base font-extrabold text-slate-100">{village.groundwaterStatus.split(' ')[0]}</div>
            </div>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 flex items-center space-x-3">
            <Bug className="w-6 h-6 text-purple-400 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400">Pest Risk (कीड)</div>
              <div className="text-base font-extrabold text-slate-100">{subIndices.pestIndex > 60 ? 'HIGH' : 'SAFE'}</div>
            </div>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 flex items-center space-x-3">
            <Sprout className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400">Rainfall (पाऊस)</div>
              <div className="text-base font-extrabold text-slate-100">{village.annualRainfallNormal} mm</div>
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

      {/* 3. NON-TECHNICAL 4-STEP ACTION PLAN FOR FARMERS */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 sm:p-6 rounded-3xl shadow-xl space-y-4">
        <h3 className="text-base sm:text-lg font-black text-slate-100 mb-1 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-400" />
          Key Farmer Actions for {selectedCrop} (सोपे उपाय):
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Step 1: Watering */}
          <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black text-base">
                1
              </div>
              <h4 className="text-sm font-extrabold text-slate-100">💧 Watering (पाणी कसे द्यावे)</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800/80">
              {subIndices.droughtIndex > 50
                ? 'Give water only in early morning or evening. Cover soil around roots with dry grass.'
                : 'Water your crops normally. Do not flood the roots.'}
            </p>
          </div>

          {/* Step 2: Soil & Fertilizer */}
          <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-base">
                2
              </div>
              <h4 className="text-sm font-extrabold text-slate-100">🌱 Leaf & Soil Protection (झाडांची काळजी)</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800/80">
              Spray 1% Potassium Nitrate (KNO3) during hot afternoon hours to keep crop leaves green and fresh.
            </p>
          </div>

          {/* Step 3: Pest Control */}
          <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-base">
                3
              </div>
              <h4 className="text-sm font-extrabold text-slate-100">🐛 Simple Insect Spray (कीड नियंत्रण)</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800/80">
              Hang yellow sticky cards in field. Spray 5% organic Neem seed extract to stop insects.
            </p>
          </div>

          {/* Step 4: Crop Insurance */}
          <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-black text-base">
                4
              </div>
              <h4 className="text-sm font-extrabold text-slate-100">🛡️ Crop Insurance (पिक विमा मदत)</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800/80">
              If rain or drought damages your crop, inform your bank or call **1800-180-1551** within 72 hours.
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
