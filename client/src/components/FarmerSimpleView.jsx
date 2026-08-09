import React, { useState } from 'react';
import { Sprout, Droplets, Bug, Sun, PhoneCall, Volume2, VolumeX, ArrowRight, Sparkles, Play, Pause, Globe } from 'lucide-react';

export default function FarmerSimpleView({ village, riskMetrics, onSelectCrop }) {
  const [selectedCrop, setSelectedCrop] = useState(village?.primaryCrops[0] || 'Cotton');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceLang, setVoiceLang] = useState('mr'); // 'mr' | 'hi' | 'en'
  const [speechSpeed, setSpeechSpeed] = useState(0.85);

  if (!village || !riskMetrics) return null;

  const { overallRiskScore, subIndices } = riskMetrics;

  // Clean Weather Status Card
  const getSimpleStatus = (score) => {
    if (score >= 70) return { title: '🔴 HIGH RISK (धोका)', desc: 'Weather alert! Take crop protection steps below.' };
    if (score >= 45) return { title: '🟡 MODERATE RISK (काळजी घ्या)', desc: 'Weather requires care. Follow simple crop advice.' };
    return { title: '🟢 GOOD CONDITIONS (सुरक्षित)', desc: 'Weather is favorable. Regular crop care recommended.' };
  };

  const status = getSimpleStatus(overallRiskScore);

  // Dynamic Crop-Specific 4-Step Actions Engine
  const getCropSpecificActions = (cropName) => {
    const name = cropName.toLowerCase();

    if (name.includes('cotton') || name.includes('कापूस')) {
      return {
        water: "Give light water during flowering & boll formation. Keep soil drained.",
        fertilizer: "Spray 1% MgSO4 + 19:19:19 to keep leaves green and stop reddening.",
        pest: "Hang 8 Pink Bollworm traps/acre. Spray 5% organic Neem seed extract.",
        insurance: "Inform bank within 72 hours if unseasonal rain damages open cotton."
      };
    }
    if (name.includes('soybean') || name.includes('सोयाबीन')) {
      return {
        water: "Irrigate during pod initiation and pod filling stage if rain delays.",
        fertilizer: "Spray 2% DAP or Potassium Nitrate at pod stage for bigger seeds.",
        pest: "Watch for Girdle Beetle. Spray Chlorantraniliprole 18.5% SC (3ml/10L).",
        insurance: "Inform bank within 72 hours if drought causes pod shedding."
      };
    }
    if (name.includes('sugarcane') || name.includes('ऊस')) {
      return {
        water: "Drip irrigate every 4-6 days. Cover soil with dry trash to save water.",
        fertilizer: "Apply Zinc Sulphate + Ferrous Sulphate to prevent yellow leaves.",
        pest: "Release Trichogramma parasite cards against Early Shoot Borer.",
        insurance: "Report flood waterlogging (>48 hours) to bank for insurance."
      };
    }
    if (name.includes('pomegranate') || name.includes('डाळिंब') || name.includes('अनार')) {
      return {
        water: "Give 20-30 liters water/tree/day through drip. Avoid irregular watering.",
        fertilizer: "Spray Calcium Nitrate (3g/L) + Boron (1g/L) to prevent fruit cracking.",
        pest: "Spray Copper Oxychloride (2.5g/L) for Bacterial Oily Spot (Telya).",
        insurance: "Report hailstorms within 72 hours if fruit skins are damaged."
      };
    }
    if (name.includes('onion') || name.includes('कांदा')) {
      return {
        water: "Stop watering 15 days before harvest for longer storage life.",
        fertilizer: "Apply Sulphur 80% (3g/L) for dark red onion color and pungency.",
        pest: "Spray Fipronil 5% SC (2ml/L) for Thrips. Hang yellow sticky cards.",
        insurance: "Report unseasonal rain rotting harvested onions in field within 72h."
      };
    }
    if (name.includes('grape') || name.includes('द्राक्ष') || name.includes('अंगूर')) {
      return {
        water: "Regulate drip watering strictly according to berry development stage.",
        fertilizer: "Spray Gibberellic Acid (GA3) for uniform berry elongation.",
        pest: "Spray Potassium Bicarbonate (5g/L) for Downy Mildew disease.",
        insurance: "Claim insurance if Oct-Nov unseasonal rains damage grape bunches."
      };
    }

    // Default fallback advice
    return {
      water: `Provide protective irrigation during flowering & fruiting of ${cropName}.`,
      fertilizer: `Spray 1% Potassium Nitrate (KNO3) during hot dry spells to protect leaves.`,
      pest: `Install 8 Sticky Traps per acre and spray 5% organic Neem seed extract.`,
      insurance: `Inform bank or call toll-free 1800-180-1551 within 72 hours if weather damages crop.`
    };
  };

  const currentActions = getCropSpecificActions(selectedCrop);

  // Get simple language script for Voice Panel
  const getVoiceScript = () => {
    if (voiceLang === 'mr') {
      return `नमस्कार शेतकरी बंधूंनो! ${village.villageName} गावात आज हवामान ${overallRiskScore > 65 ? 'धोकादायक' : 'सुरक्षित'} आहे. ${selectedCrop} पिकाला: ${currentActions.water} धन्यवाद!`;
    } else if (voiceLang === 'hi') {
      return `नमस्कार किसान भाइयों! ${village.villageName} गाँव में आज मौसम ${overallRiskScore > 65 ? 'जोखिम भरा' : 'सुरक्षित'} है। ${selectedCrop} फसल के लिए: ${currentActions.water} धन्यवाद!`;
    } else {
      return `Hello Farmer brother! In ${village.villageName} village today, climate conditions are ${overallRiskScore > 65 ? 'risky' : 'good'}. For your ${selectedCrop} crop: ${currentActions.water} Thank you!`;
    }
  };

  const scriptText = getVoiceScript();

  // Voice Speech Function
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(scriptText);
    utterance.rate = speechSpeed;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCropButtonClick = (crop) => {
    setSelectedCrop(crop);
    if (onSelectCrop) onSelectCrop(crop);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. FRONT AI VOICE PANEL HERO BANNER */}
      <div className="bg-slate-900 border border-slate-800 p-5 sm:p-7 rounded-3xl shadow-xl space-y-5">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase tracking-wider">
                🌾 शेतकरी मार्गदर्शक / Farmer Guide
              </span>
              <span className="text-xs font-semibold text-slate-400">📍 {village.villageName} ({village.districtName})</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-100">
              {status.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              {status.desc}
            </p>
          </div>

          {/* Language & Speed Selector */}
          <div className="flex items-center space-x-2 bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs shrink-0">
            <div className="flex items-center space-x-1">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={voiceLang}
                onChange={(e) => setVoiceLang(e.target.value)}
                className="bg-transparent text-slate-200 font-bold focus:outline-none cursor-pointer text-xs"
              >
                <option value="mr">मराठी</option>
                <option value="hi">हिन्दी</option>
                <option value="en">English</option>
              </select>
            </div>
            <span className="text-slate-700">|</span>
            <select
              value={speechSpeed}
              onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
              className="bg-transparent text-slate-200 font-bold focus:outline-none cursor-pointer text-xs"
            >
              <option value="0.7">Slow</option>
              <option value="0.85">Normal</option>
              <option value="1.0">Fast</option>
            </select>
          </div>
        </div>

        {/* Audio Transcript & Big Play Button */}
        <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-2 flex-1 w-full">
            <div className="flex items-center space-x-1.5 h-6">
              {[40, 70, 30, 90, 50, 80, 40, 60, 100, 50, 70, 30].map((h, i) => (
                <div
                  key={i}
                  style={{ height: isSpeaking ? `${h}%` : '30%' }}
                  className={`w-1.5 rounded-full transition-all duration-300 ${
                    isSpeaking ? 'bg-emerald-400 animate-pulse' : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>

            <p className="text-xs sm:text-sm font-medium text-slate-200 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
              "{scriptText}"
            </p>
          </div>

          <button
            onClick={handleToggleSpeech}
            className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-extrabold text-sm transition-all flex items-center justify-center space-x-2 shrink-0 shadow-md ${
              isSpeaking
                ? 'bg-rose-500 hover:bg-rose-400 text-slate-950 animate-pulse'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            {isSpeaking ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isSpeaking ? 'Stop Voice' : '▶ 🔊 सल्ला ऐका (Listen Audio)'}</span>
          </button>
        </div>

        {/* Quick Weather Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-bold pt-1">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center space-x-2.5">
            <Sun className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400">Drought (दुष्काळ)</div>
              <div className="text-sm font-black text-slate-100">{subIndices.droughtIndex > 60 ? 'HIGH' : 'LOW'}</div>
            </div>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center space-x-2.5">
            <Droplets className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400">Water (पाणी)</div>
              <div className="text-sm font-black text-slate-100">{village.groundwaterStatus.split(' ')[0]}</div>
            </div>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center space-x-2.5">
            <Bug className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400">Pest Risk (कीड)</div>
              <div className="text-sm font-black text-slate-100">{subIndices.pestIndex > 60 ? 'HIGH' : 'SAFE'}</div>
            </div>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center space-x-2.5">
            <Sprout className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400">Rainfall (पाऊस)</div>
              <div className="text-sm font-black text-slate-100">{village.annualRainfallNormal} mm</div>
            </div>
          </div>
        </div>

      </div>

      {/* 2. CHOOSE CROP */}
      <div className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-3xl shadow-xl">
        <h3 className="text-base sm:text-lg font-black text-slate-100 mb-3 flex items-center gap-2">
          <Sprout className="w-5 h-5 text-emerald-400" />
          Select Your Crop (आपले पीक निवडा):
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {village.primaryCrops.map(crop => {
            const isSelected = selectedCrop === crop;
            return (
              <button
                key={crop}
                onClick={() => handleCropButtonClick(crop)}
                className={`p-3.5 rounded-2xl text-left border transition-all min-h-[75px] flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-md scale-[1.02]'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-200 border-slate-800'
                }`}
              >
                <div className="text-[10px] font-semibold opacity-80 uppercase tracking-wider">Crop</div>
                <div className="text-sm font-extrabold">{crop}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. DYNAMIC 4-STEP ACTION PLAN FOR SELECTED CROP */}
      <div className="bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-3xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Key Actions for <span className="text-emerald-400 underline decoration-emerald-500/50">{selectedCrop}</span> (उपाय):
          </h3>
          <span className="text-xs bg-emerald-950 text-emerald-400 px-3 py-0.5 rounded-full border border-emerald-800 font-bold hidden sm:inline">
            Advice for {selectedCrop}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          
          {/* Step 1: Watering */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black text-sm">
                1
              </div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-100">💧 Watering ({selectedCrop} पाणी)</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
              {currentActions.water}
            </p>
          </div>

          {/* Step 2: Soil & Fertilizer */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-sm">
                2
              </div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-100">🌱 Soil & Spray ({selectedCrop} खत फवारणी)</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
              {currentActions.fertilizer}
            </p>
          </div>

          {/* Step 3: Pest Control */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-sm">
                3
              </div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-100">🐛 Insect Spray ({selectedCrop} कीड नियंत्रण)</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
              {currentActions.pest}
            </p>
          </div>

          {/* Step 4: Crop Insurance */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-black text-sm">
                4
              </div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-100">🛡️ Crop Insurance ({selectedCrop} पिक विमा)</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
              {currentActions.insurance}
            </p>
          </div>

        </div>
      </div>

      {/* 4. HELPLINE CARD */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-5 rounded-3xl text-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-950 text-emerald-400 flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-black">Kisan Call Centre Helpline (किसान हेल्पलाइन)</h4>
            <p className="text-xs font-semibold text-emerald-950">Free Government Helpline for Farmers</p>
          </div>
        </div>

        <a
          href="tel:18001801551"
          className="px-5 py-2.5 bg-slate-950 text-emerald-400 font-extrabold text-xs rounded-xl shadow-md hover:bg-slate-900 transition-all shrink-0 flex items-center space-x-2"
        >
          <span>Call 1800-180-1551</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

    </div>
  );
}
