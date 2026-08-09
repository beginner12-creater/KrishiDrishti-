import React, { useState } from 'react';
import { Volume2, VolumeX, X, Mic, Play, Pause, Globe, Sparkles, Sprout } from 'lucide-react';

export default function AIVoicePanelModal({ village, riskMetrics, onClose }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('mr'); // 'mr' | 'hi' | 'en'
  const [speechSpeed, setSpeechSpeed] = useState(0.85);

  if (!village || !riskMetrics) return null;

  const { overallRiskScore, cropVulnerability } = riskMetrics;
  const currentCrop = village.primaryCrops[0] || 'Cotton';

  // Get simple language captions
  const getSpeechScript = () => {
    if (selectedLanguage === 'mr') {
      return `नमस्कार शेतकरी बंधूंनो! ${village.villageName} गावात आज हवामान ${overallRiskScore > 65 ? 'धोकादायक' : 'सुरक्षित'} आहे. ${currentCrop} पिकाला संध्याकाळी पाणी द्या. 5 टक्के कडुनिंब अर्क फवारा. धन्यवाद!`;
    } else if (selectedLanguage === 'hi') {
      return `नमस्कार किसान भाइयों! ${village.villageName} गाँव में आज मौसम ${overallRiskScore > 65 ? 'जोखिम भरा' : 'सुरक्षित'} है। ${currentCrop} फसल को शाम को पानी दें और नीम अर्क छिड़कें। धन्यवाद!`;
    } else {
      return `Hello Farmer brother! In ${village.villageName} village today, climate conditions are ${overallRiskScore > 65 ? 'risky' : 'favorable'}. Irrigate ${currentCrop} in evening and spray organic Neem extract. Thank you!`;
    }
  };

  const scriptText = getSpeechScript();

  const toggleSpeech = () => {
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

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5 animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black shrink-0">
              <Volume2 className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-100 flex items-center gap-1.5">
                Krishi Mitr AI Voice Panel
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">Voice AI</span>
              </h3>
              <p className="text-xs text-slate-400">Audio Farmer Advisory for {village.villageName}</p>
            </div>
          </div>

          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Animated Voice Wave Indicator */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-4">
          <div className="flex items-center justify-center space-x-1.5 h-12">
            {[40, 70, 30, 90, 50, 80, 40, 60, 100, 50].map((h, i) => (
              <div
                key={i}
                style={{ height: isSpeaking ? `${h}%` : '20%' }}
                className={`w-1.5 rounded-full transition-all duration-300 ${
                  isSpeaking ? 'bg-emerald-400 animate-pulse' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>

          <p className="text-sm font-semibold text-slate-200 leading-relaxed px-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            "{scriptText}"
          </p>
        </div>

        {/* Voice Controls: Language & Speed */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 font-bold mb-1 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-emerald-400" /> Language (भाषा)
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none"
            >
              <option value="mr">मराठी (Marathi)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">Voice Speed (वेग)</label>
            <select
              value={speechSpeed}
              onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 focus:outline-none"
            >
              <option value="0.7">Slow (हळू)</option>
              <option value="0.85">Normal (सामान्य)</option>
              <option value="1.0">Fast (जलद)</option>
            </select>
          </div>
        </div>

        {/* Main Big Voice Play Button */}
        <button
          onClick={toggleSpeech}
          className={`w-full py-4 rounded-2xl font-black text-base transition-all flex items-center justify-center space-x-2 shadow-xl ${
            isSpeaking
              ? 'bg-rose-500 hover:bg-rose-400 text-slate-950 animate-pulse'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
          }`}
        >
          {isSpeaking ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          <span>{isSpeaking ? 'Stop Voice Advice (आवाज थांबवा)' : '▶ Play Voice Advice (ऐका / सुनें)'}</span>
        </button>

      </div>
    </div>
  );
}
