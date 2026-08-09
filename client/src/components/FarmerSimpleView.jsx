import React, { useState } from 'react';
import { Sprout, Droplets, Bug, Sun, PhoneCall, Volume2, VolumeX, ArrowRight, Sparkles, Play, Pause, Globe } from 'lucide-react';

export default function FarmerSimpleView({ village, riskMetrics, onSelectCrop }) {
  const [selectedCrop, setSelectedCrop] = useState(village?.primaryCrops[0] || 'Cotton');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceLang, setVoiceLang] = useState('mr'); // 'mr' | 'hi' | 'en'
  const [speechSpeed, setSpeechSpeed] = useState(0.85);

  if (!village || !riskMetrics) return null;

  const { overallRiskScore, subIndices, cropVulnerability } = riskMetrics;

  // Simple Clean Status Badge for Farmers
  const getSimpleStatus = (score) => {
    if (score >= 70) return { title: '🔴 HIGH RISK (धोका)', text: 'Weather warning! Follow protection steps below.' };
    if (score >= 45) return { title: '🟡 MODERATE RISK (काळजी घ्या)', text: 'Take simple precautions for your crops.' };
    return { title: '🟢 GOOD CONDITIONS (सुरक्षित)', text: 'Weather is good. Follow regular crop care.' };
  };

  const status = getSimpleStatus(overallRiskScore);

  // Dynamic Crop-Specific 4-Step Actions Engine
  const getCropSpecificActions = (cropName) => {
    const name = cropName.toLowerCase();

    if (name.includes('cotton') || name.includes('कापूस')) {
      return {
        water: "Irrigate during square formation & boll opening. Avoid waterlogging in heavy black soil.",
        fertilizer: "Spray 1% Magnesium Sulphate (MgSO4) + 19:19:19 to prevent leaf reddening (Lalya disease).",
        pest: "Install 8 Pink Bollworm pheromone traps/acre. Spray 5% Neem seed kernel extract (NSKE).",
        insurance: "Inform bank within 72h if unseasonal rain damages open cotton bolls in the field."
      };
    }
    if (name.includes('soybean') || name.includes('सोयाबीन')) {
      return {
        water: "Critical irrigation during pod initiation and pod filling stage during monsoon dry spells.",
        fertilizer: "Spray 2% DAP or Potassium Nitrate (13:0:45) at pod development to increase grain weight.",
        pest: "Watch for Girdle Beetle & Stem Fly. Spray Chlorantraniliprole 18.5% SC (3ml/10L).",
        insurance: "Trigger PMFBY insurance claim if dry spell causes severe pod shedding."
      };
    }
    if (name.includes('sugarcane') || name.includes('ऊस')) {
      return {
        water: "Drip irrigate every 4-6 days. Trash mulching between rows saves 40% water.",
        fertilizer: "Apply Zinc Sulphate (25kg/ha) + Ferrous Sulphate to correct iron chlorosis in ratoon cane.",
        pest: "Release Trichogramma chilonis parasite cards (2 cards/acre) against Early Shoot Borer.",
        insurance: "Report flood inundation submergence (>48h) to bank for crop insurance claim."
      };
    }
    if (name.includes('pomegranate') || name.includes('डाळिंब') || name.includes('अनार')) {
      return {
        water: "Drip irrigate 20-30 liters/tree/day during fruit development. Avoid irregular watering.",
        fertilizer: "Spray Calcium Nitrate (3g/L) + Boron (1g/L) to prevent fruit cracking during harvest.",
        pest: "Spray Streptocycline (0.5g/L) + Copper Oxychloride (2.5g/L) for Bacterial Oily Spot (Telya).",
        insurance: "Claim weather-based crop insurance if hailstorms crack or damage fruit skins."
      };
    }
    if (name.includes('onion') || name.includes('कांदा')) {
      return {
        water: "Stop irrigation 15 days before harvesting to improve onion bulb storage and shelf life.",
        fertilizer: "Apply Sulphur 80% WDG (3g/L) for dark red color, pungency, and disease protection.",
        pest: "Spray Fipronil 5% SC (2ml/L) for Thrips control. Hang yellow & blue sticky traps.",
        insurance: "Report unseasonal harvest rain that rots harvested onions in field within 72 hours."
      };
    }
    if (name.includes('grape') || name.includes('द्राक्ष') || name.includes('अंगूर')) {
      return {
        water: "Micro-drip irrigation regulated strictly according to cane maturity and berry diameter.",
        fertilizer: "Spray Gibberellic Acid (GA3) for uniform berry elongation and bunch development.",
        pest: "Spray Potassium Bicarbonate (5g/L) for Downy Mildew & Powdery Mildew protection.",
        insurance: "Trigger crop insurance claim for unseasonal Oct-Nov rainfall or frost damage."
      };
    }
    if (name.includes('tomato') || name.includes('टोमॅटो')) {
      return {
        water: "Maintain steady soil moisture using drip lines to prevent Blossom End Rot disease.",
        fertilizer: "Spray Calcium Boron (1.5ml/L) to strengthen fruit walls and prevent fruit cracking.",
        pest: "Install Pheromone traps for Tomato Pinworm (Tuta absoluta) and yellow traps for Whitefly.",
        insurance: "Report heavy rain or early blight outbreak damage to insurance officer within 72h."
      };
    }
    if (name.includes('paddy') || name.includes('rice') || name.includes('भात') || name.includes('धान')) {
      return {
        water: "Maintain 2-5cm standing water during tillering & flowering. Drain field 10 days before harvest.",
        fertilizer: "Apply Zinc Sulphate (25kg/ha) baseline to prevent Khaira disease in young rice seedlings.",
        pest: "Use light traps for Stem Borer and spray Buprofezin 25% SC for Brown Plant Hopper (BPH).",
        insurance: "Claim PMFBY insurance if floods submerge paddy nursery for more than 5 consecutive days."
      };
    }
    if (name.includes('banana') || name.includes('केळी')) {
      return {
        water: "Provide 20-25 liters water/plant/day through drip. Mulch with sugarcane trash around base.",
        fertilizer: "Spray 1% Potassium Nitrate on banana bunches after flower emergence for bigger fingers.",
        pest: "Inject Phorate granules into pseudostem to prevent Banana Stem Weevil damage.",
        insurance: "Trigger crop insurance claim within 72h if summer windstorms blow down trees."
      };
    }

    // Default fallback advice
    return {
      water: `Provide protective irrigation during critical flowering & grain formation stages of ${cropName}.`,
      fertilizer: `Spray 1% Potassium Nitrate (KNO3) during hot dry spells to protect ${cropName} leaves.`,
      pest: `Install 8-10 Sticky Traps per acre and spray 5% organic Neem seed extract against sucking pests.`,
      insurance: `Inform bank or call toll-free 1800-180-1551 within 72 hours if weather damages ${cropName}.`
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
      
      {/* 1. FRONT EMBEDDED AI VOICE PANEL HERO SECTION */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/40 border-2 border-emerald-500/40 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6 relative overflow-hidden">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Krishi AI Voice Assistant
              </span>
              <span className="text-xs font-semibold text-slate-400">📍 {village.villageName} ({village.districtName})</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-100">
              {status.title}
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              {status.text}
            </p>
          </div>

          {/* Language & Speed Selector Pills */}
          <div className="flex items-center space-x-2 bg-slate-950 p-2 rounded-2xl border border-slate-800 text-xs shrink-0">
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

        {/* Animated Sound Wave Visualizer & Live Transcript */}
        <div className="bg-slate-950 p-5 sm:p-6 rounded-2xl border border-slate-800/90 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-3 flex-1 w-full">
            <div className="flex items-center space-x-1.5 h-8">
              {[40, 70, 30, 90, 50, 80, 40, 60, 100, 50, 70, 30, 90, 40, 80].map((h, i) => (
                <div
                  key={i}
                  style={{ height: isSpeaking ? `${h}%` : '25%' }}
                  className={`w-1.5 rounded-full transition-all duration-300 ${
                    isSpeaking ? 'bg-emerald-400 animate-pulse' : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>

            <p className="text-sm font-semibold text-slate-200 leading-relaxed bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
              "{scriptText}"
            </p>
          </div>

          {/* Prominent Play Voice Button */}
          <button
            onClick={handleToggleSpeech}
            className={`w-full md:w-auto px-8 py-4 rounded-2xl font-black text-base transition-all flex items-center justify-center space-x-2 shrink-0 shadow-xl ${
              isSpeaking
                ? 'bg-rose-500 hover:bg-rose-400 text-slate-950 animate-pulse'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            {isSpeaking ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            <span>{isSpeaking ? 'Stop Voice' : '▶ Listen Voice (ऐका)'}</span>
          </button>
        </div>

        {/* Quick Weather Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm font-bold pt-2">
          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 flex items-center space-x-3">
            <Sun className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400">Drought (दुष्काळ)</div>
              <div className="text-base font-extrabold text-slate-100">{subIndices.droughtIndex > 60 ? 'HIGH' : 'LOW'}</div>
            </div>
          </div>
          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 flex items-center space-x-3">
            <Droplets className="w-6 h-6 text-cyan-400 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400">Water (पाणी)</div>
              <div className="text-base font-extrabold text-slate-100">{village.groundwaterStatus.split(' ')[0]}</div>
            </div>
          </div>
          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 flex items-center space-x-3">
            <Bug className="w-6 h-6 text-purple-400 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400">Pest Risk (कीड)</div>
              <div className="text-base font-extrabold text-slate-100">{subIndices.pestIndex > 60 ? 'HIGH' : 'SAFE'}</div>
            </div>
          </div>
          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 flex items-center space-x-3">
            <Sprout className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[11px] text-slate-400">Rainfall (पाऊस)</div>
              <div className="text-base font-extrabold text-slate-100">{village.annualRainfallNormal} mm</div>
            </div>
          </div>
        </div>

      </div>

      {/* 2. CHOOSE CROP (STAYS ON SAME PAGE, NO REDIRECT!) */}
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
                onClick={() => handleCropButtonClick(crop)}
                className={`p-4 rounded-2xl text-left border-2 transition-all min-h-[85px] flex flex-col justify-between cursor-pointer ${
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

      {/* 3. DYNAMIC 4-STEP ACTION PLAN FOR SELECTED CROP (UPDATES ON SAME PAGE!) */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 sm:p-6 rounded-3xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            Key Actions for <span className="text-emerald-400 underline decoration-emerald-500/50">{selectedCrop}</span> (उपाय):
          </h3>
          <span className="text-xs bg-emerald-950 text-emerald-400 px-3 py-1 rounded-full border border-emerald-800 font-bold hidden sm:inline">
            Advice for {selectedCrop}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Step 1: Watering */}
          <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black text-base">
                1
              </div>
              <h4 className="text-sm font-extrabold text-slate-100">💧 Watering ({selectedCrop} पाणी)</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3.5 rounded-xl border border-slate-800/80">
              {currentActions.water}
            </p>
          </div>

          {/* Step 2: Soil & Fertilizer */}
          <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-base">
                2
              </div>
              <h4 className="text-sm font-extrabold text-slate-100">🌱 Soil & Spray ({selectedCrop} खत फवारणी)</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3.5 rounded-xl border border-slate-800/80">
              {currentActions.fertilizer}
            </p>
          </div>

          {/* Step 3: Pest Control */}
          <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-base">
                3
              </div>
              <h4 className="text-sm font-extrabold text-slate-100">🐛 Insect Spray ({selectedCrop} कीड नियंत्रण)</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3.5 rounded-xl border border-slate-800/80">
              {currentActions.pest}
            </p>
          </div>

          {/* Step 4: Crop Insurance */}
          <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-black text-base">
                4
              </div>
              <h4 className="text-sm font-extrabold text-slate-100">🛡️ Crop Insurance ({selectedCrop} पिक विमा)</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3.5 rounded-xl border border-slate-800/80">
              {currentActions.insurance}
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
