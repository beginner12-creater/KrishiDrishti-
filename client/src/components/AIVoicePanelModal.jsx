import React, { useState } from 'react';
import { Volume2, VolumeX, X, Mic, Play, Pause, Globe, Sparkles, Sprout } from 'lucide-react';

export default function AIVoicePanelModal({ village, riskMetrics, onClose }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('mr'); // 'mr' | 'hi' | 'en'
  const [speechSpeed, setSpeechSpeed] = useState(0.85);

  if (!village || !riskMetrics) return null;

  const { overallRiskScore, cropVulnerability } = riskMetrics;
  const currentCrop = village.primaryCrops[0] || 'Cotton';

  // Enjoyable & Pleasant Speech Script
  const getSpeechScript = () => {
    if (selectedLanguage === 'mr') {
      return `नमस्कार शेतकरी दादा! 🙏 ${village.villageName} गावात आज हवामान ${overallRiskScore > 65 ? 'थोडे काळजीचे' : 'उत्तम आणि छान'} आहे! आपल्या ${currentCrop} पिकाला संध्याकाळी थंड हवेत हलके पाणी द्या. जैविक कडुनिंब फवारणी करा आणि निश्चिंत राहा! तुमची शेती सुफलाम होवो! धन्यवाद! 🌾`;
    } else if (selectedLanguage === 'hi') {
      return `नमस्कार किसान भाई! 🙏 ${village.villageName} गाँव में आज मौसम ${overallRiskScore > 65 ? 'सावधानी का' : 'बहुत ही बढ़िया'} है! अपनी ${currentCrop} फसल को शाम के समय पानी दें। हल्की जैविक नीम फवारणी करें और खुश रहें! आपकी फसल लहराएगी! धन्यवाद! 🌾`;
    } else {
      return `Hello Farmer Brother! 🙏 Weather in ${village.villageName} village today is ${overallRiskScore > 65 ? 'requiring care' : 'favorable and good'}! Irrigate your ${currentCrop} crop in the gentle evening breeze. Apply organic neem spray and enjoy a joyful harvest! Thank you! 🌾`;
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
    utterance.pitch = 1.05; // Cheerful natural pitch
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5 animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black shrink-0">
              <Volume2 className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5">
                Krishi Mitr AI Voice Panel
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">Voice AI</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">Audio Farmer Advisory for {village.villageName}</p>
            </div>
          </div>

          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Animated Voice Wave Indicator */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-4 shadow-xs">
          <div className="flex items-center justify-center space-x-1.5 h-12">
            {[40, 70, 30, 90, 50, 80, 40, 60, 100, 50].map((h, i) => (
              <div
                key={i}
                style={{ height: isSpeaking ? `${h}%` : '20%' }}
                className={`w-1.5 rounded-full transition-all duration-300 ${
                  isSpeaking ? 'bg-emerald-600 animate-pulse' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>

          <p className="text-sm font-bold text-slate-900 leading-relaxed px-2 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            "{scriptText}"
          </p>
        </div>

        {/* Voice Controls: Language & Speed */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-emerald-600" /> Language (भाषा)
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-bold focus:outline-none"
            >
              <option value="mr">मराठी (Marathi)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Voice Speed (वेग)</label>
            <select
              value={speechSpeed}
              onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 font-bold focus:outline-none"
            >
              <option value="0.7">Slow (हळू)</option>
              <option value="0.85">Normal (छान)</option>
              <option value="1.0">Fast (जलद)</option>
            </select>
          </div>
        </div>

        {/* Main Big Voice Play Button */}
        <button
          onClick={toggleSpeech}
          className={`w-full py-4 rounded-2xl font-black text-base transition-all flex items-center justify-center space-x-2 shadow-md cursor-pointer ${
            isSpeaking
              ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          {isSpeaking ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          <span>{isSpeaking ? 'Stop Voice Advice (आवाज थांबवा)' : '▶ Play Voice Advice (ऐका / सुनें)'}</span>
        </button>

      </div>
    </div>
  );
}
