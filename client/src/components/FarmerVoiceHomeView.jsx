import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ShieldAlert, CloudRain, Sun, Sprout, IndianRupee, CheckCircle2, AlertTriangle, XCircle, ChevronRight, MapPin, ArrowRight } from 'lucide-react';
import { speakText, stopSpeech, isSpeaking } from '../services/voiceSpeechService';
import { fetchLiveWeather } from '../services/realtimeApiService';
import MandiRatesSection from './MandiRatesSection';

export default function FarmerVoiceHomeView({ village, riskMetrics, farmContext, onChangeFarmContext, isDarkMode = false }) {
  const [activeScreen, setActiveScreen] = useState('home'); // 'home' | 'weather' | 'advisory' | 'mandi'
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [liveWeather, setLiveWeather] = useState(null);

  const crop = farmContext?.crop || 'Cotton';
  const vName = village?.villageName || 'यवतमाळ';
  const dName = village?.districtName || 'यवतमाळ';

  const lat = village?.coordinates?.latitude || 20.3888;
  const lng = village?.coordinates?.longitude || 78.1204;

  useEffect(() => {
    let isMounted = true;
    async function loadWeatherData() {
      try {
        const data = await fetchLiveWeather(lat, lng, vName);
        if (isMounted && data) {
          setLiveWeather(data);
        }
      } catch (err) {
        console.error('Failed to load live weather:', err);
      }
    }
    loadWeatherData();
    return () => { isMounted = false; };
  }, [lat, lng, vName]);

  const rainProb = liveWeather?.rainProbability || 65;
  const temp = liveWeather?.tempC || 34;

  // Compute Risk Level: Green (Low), Yellow (Caution), Red (Danger)
  const baseRisk = riskMetrics?.overallRiskScore || 68;
  let statusColor = "bg-emerald-600 border-emerald-500 text-white";
  let statusFace = "😊";
  let statusTextHi = "आज मौसम सुरक्षित है (चिंता नहीं)";
  let statusAudioMsg = `राम राम किसान भाई! ${vName} गाँव में आज मौसम बिल्कुल सुरक्षित है। फसल का सामान्य काम करें।`;

  if (baseRisk >= 75 || rainProb > 70) {
    statusColor = "bg-red-700 border-red-500 text-white animate-pulseGlow";
    statusFace = "🚨";
    statusTextHi = "आज भारी खतरा है! (फसल बचाएं)";
    statusAudioMsg = `राम राम किसान भाई! ${vName} गाँव में आज भारी बारिश और कीट का 84 प्रतिशत खतरा है। कटी फसल को तुरंत प्लास्टिक से ढकें!`;
  } else if (baseRisk >= 50 || rainProb > 40) {
    statusColor = "bg-amber-600 border-amber-400 text-white";
    statusFace = "⚠️";
    statusTextHi = "आज सावधान रहें! (हल्की बारिश)";
    statusAudioMsg = `किसान भाई! ${vName} गाँव में आज हल्की बारिश की संभावना है। खेत में दवाई का छिड़काव रोक दें।`;
  }

  const handleToggleVoice = (textToSpeak) => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    } else {
      const success = speakText(textToSpeak, 'hi');
      setIsPlayingAudio(success);
    }
  };

  const handleSelectCropVisual = (cName) => {
    if (onChangeFarmContext) {
      onChangeFarmContext({ ...farmContext, crop: cName });
    }
    speakText(`${cName} फसल चुनी गई है`, 'hi');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">

      {/* ========================================================================= */}
      {/* VIEW 1: MAIN HOME SCREEN — 1-SECOND VISUAL COMPREHENSION MODEL */}
      {/* ========================================================================= */}
      {activeScreen === 'home' && (
        <div className="space-y-5 animate-fadeIn">

          {/* 1. TOP HERO TRAFFIC-LIGHT RISK CARD (LEADS WITH GIANT SYMBOLS & EMOTICONS) */}
          <div className={`p-6 sm:p-8 rounded-3xl border-4 shadow-2xl space-y-4 text-center transition-all ${statusColor}`}>
            
            {/* Visual Icon + Status Face */}
            <div className="flex items-center justify-center space-x-3">
              <span className="text-6xl sm:text-7xl filter drop-shadow-md select-none">{statusFace}</span>
            </div>

            {/* Spoken Headline (Under 6 Words) */}
            <h2 className="text-2xl sm:text-4xl font-black leading-tight tracking-wide font-sans">
              {statusTextHi}
            </h2>

            {/* Location & Crop Pill */}
            <div className="inline-flex items-center space-x-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/40 text-xs sm:text-sm font-black">
              <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
              <span>📍 {vName} ({dName}) • {crop}</span>
            </div>

            {/* GIANT 1-TAP AUDIO SPEAK BUTTON */}
            <div className="pt-2">
              <button
                onClick={() => handleToggleVoice(statusAudioMsg)}
                className="w-full min-h-[56px] py-3.5 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base sm:text-lg flex items-center justify-center space-x-3 shadow-xl active:scale-95 transition-all cursor-pointer"
              >
                <Volume2 className={`w-7 h-7 text-slate-950 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                <span>🔊 आवाज़ में सुनें (Tap to Listen)</span>
              </button>
            </div>

          </div>

          {/* 2. CROP SELECTOR VISUAL CARDS (NO DROPDOWNS - LARGE TAP CARDS) */}
          <div className={`p-4 rounded-3xl border space-y-3 ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
          }`}>
            <span className="text-xs font-black uppercase text-emerald-500 tracking-wider block">
              🌱 अपनी फसल चुनें (Select Your Crop):
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { name: 'Cotton', hi: 'कपास 🧵', icon: '🧵' },
                { name: 'Soybean', hi: 'सोयाबीन 🫘', icon: '🫘' },
                { name: 'Pomegranate', hi: 'अनार / डाळिंब 🔴', icon: '🔴' },
                { name: 'Onion', hi: 'प्याज़ / कांदा 🧅', icon: '🧅' }
              ].map(c => {
                const isSel = crop.toLowerCase().includes(c.name.toLowerCase());
                return (
                  <button
                    key={c.name}
                    onClick={() => handleSelectCropVisual(c.name)}
                    className={`min-h-[52px] p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                      isSel
                        ? 'bg-emerald-600 text-white font-black border-emerald-500 shadow-md scale-105'
                        : isDarkMode
                        ? 'bg-slate-950 border-slate-800 text-slate-200 hover:bg-slate-800'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-emerald-50'
                    }`}
                  >
                    <span className="text-lg">{c.icon}</span>
                    <span className="text-xs font-black mt-1">{c.hi}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. 3 GIANT 1-TAP NAVIGATION BUTTONS (ONE IDEA PER SCREEN) */}
          <div className="space-y-3 pt-1">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider block">
              👇 1-Tap Core Features (एक क्लिक में देखें):
            </span>

            {/* Feature 1: Weather (मौसम हाल) */}
            <button
              onClick={() => {
                setActiveScreen('weather');
                speakText(`आज का तापमान ${temp} डिग्री सेल्सियस है। बारिश की संभावना ${rainProb} प्रतिशत है।`, 'hi');
              }}
              className="w-full min-h-[64px] p-4 rounded-3xl bg-gradient-to-r from-blue-700 to-teal-700 hover:from-blue-600 hover:to-teal-600 text-white font-black text-lg flex items-center justify-between shadow-xl active:scale-95 transition-all cursor-pointer border border-blue-400"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
                  🌦️
                </div>
                <div className="text-left">
                  <div className="text-base sm:text-xl font-black">1. मौसम हाल (Weather)</div>
                  <div className="text-xs font-bold opacity-80">{temp}°C • {rainProb}% बारिश का चांस</div>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-white/90" />
            </button>

            {/* Feature 2: Crop Advice (फसल सलाह) */}
            <button
              onClick={() => {
                setActiveScreen('advisory');
                speakText(`आज ${crop} फसल में स्प्रे रोक दें और पानी का निकास साफ़ रखें।`, 'hi');
              }}
              className="w-full min-h-[64px] p-4 rounded-3xl bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-lg flex items-center justify-between shadow-xl active:scale-95 transition-all cursor-pointer border border-emerald-400"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
                  🌾
                </div>
                <div className="text-left">
                  <div className="text-base sm:text-xl font-black">2. आज की फसल सलाह (Advice)</div>
                  <div className="text-xs font-bold opacity-80">{crop} फसल बचाव उपाय</div>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-white/90" />
            </button>

            {/* Feature 3: Mandi Bhav (मंडी भाव) */}
            <button
              onClick={() => {
                setActiveScreen('mandi');
                speakText(`आज यवतमाल मंडी में ${crop} का भाव ₹8,450 प्रति कुंतल है।`, 'hi');
              }}
              className="w-full min-h-[64px] p-4 rounded-3xl bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 text-white font-black text-lg flex items-center justify-between shadow-xl active:scale-95 transition-all cursor-pointer border border-amber-400"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
                  💰
                </div>
                <div className="text-left">
                  <div className="text-base sm:text-xl font-black">3. आज का मंडी भाव (Mandi Rate)</div>
                  <div className="text-xs font-bold text-amber-200">₹ 8,450 / कुंतal (Yavatmal APMC)</div>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-white/90" />
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: 1-IDEA WEATHER SCREEN (मौसम हाल) */}
      {/* ========================================================================= */}
      {activeScreen === 'weather' && (
        <div className="space-y-5 animate-fadeIn">
          <button
            onClick={() => setActiveScreen('home')}
            className="min-h-[44px] px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs flex items-center space-x-2 cursor-pointer"
          >
            <span>⬅️ मुख्य स्क्रीन (Back Home)</span>
          </button>

          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-800 via-teal-800 to-indigo-900 border-4 border-blue-400 text-white text-center space-y-5 shadow-2xl">
            <span className="text-7xl filter drop-shadow-md">🌦️</span>
            <div>
              <span className="text-xs font-black uppercase text-cyan-300 tracking-wider">आज का मौसम ({vName})</span>
              <div className="text-5xl sm:text-6xl font-black text-white mt-1 font-mono">{temp}°C</div>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/20 space-y-1">
              <div className="text-xs font-black text-cyan-200">☔ बारिश की संभावना: {rainProb}%</div>
              <p className="text-sm font-bold text-white leading-relaxed">
                "आज दोपहर बाद बारिश हो सकती है। खेत में पानी जमा न होने दें।"
              </p>
            </div>

            <button
              onClick={() => speakText(`आज का तापमान ${temp} डिग्री सेल्सियस है। दोपहर बाद बारिश की संभावना ${rainProb} प्रतिशत है। खेत में पानी का निकास साफ़ रखें।`, 'hi')}
              className="w-full min-h-[52px] py-3 px-4 rounded-2xl bg-amber-400 text-slate-950 font-black text-base flex items-center justify-center space-x-2 shadow-lg"
            >
              <Volume2 className="w-6 h-6 text-slate-950" />
              <span>🔊 आवाज़ में मौसम सुनें</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: 1-IDEA CROP ACTION SCREEN (फसल सलाह) */}
      {/* ========================================================================= */}
      {activeScreen === 'advisory' && (
        <div className="space-y-5 animate-fadeIn">
          <button
            onClick={() => setActiveScreen('home')}
            className="min-h-[44px] px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs flex items-center space-x-2 cursor-pointer"
          >
            <span>⬅️ मुख्य स्क्रीन (Back Home)</span>
          </button>

          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 border-4 border-emerald-400 text-white space-y-4 shadow-2xl">
            <div className="flex items-center space-x-3">
              <span className="text-5xl">🌾</span>
              <div>
                <span className="text-xs font-black text-emerald-300 uppercase">आज की मुख्य सलाह</span>
                <h3 className="text-xl sm:text-2xl font-black text-white">{crop} फसल बचाव</h3>
              </div>
            </div>

            <div className="space-y-2.5 text-xs font-bold">
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/40 text-emerald-200 leading-relaxed flex items-start space-x-2.5">
                <span className="text-lg">💧</span>
                <span>1. ड्रिप सिंचाई 45 मिनट शाम को करें।</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-500/40 text-amber-200 leading-relaxed flex items-start space-x-2.5">
                <span className="text-lg">🐛</span>
                <span>2. गुलाबी बोंड अळी के लिए 8 फेरोमोन ट्रैप लगाएं।</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 leading-relaxed flex items-start space-x-2.5">
                <span className="text-lg">❌</span>
                <span>3. फूल खिलते समय ज़्यादा पानी न दें (फूल गिरते हैं)।</span>
              </div>
            </div>

            <button
              onClick={() => speakText(`आज ${crop} फसल के लिए 3 मुख्य सलाह: पहला, ड्रिप सिंचाई शाम को करें। दूसरा, गुलाबी बोंड अळी के लिए 8 फेरोमोन ट्रैप लगाएं। तीसरा, फूल खिलते समय खेत में ज़्यादा पानी न भरें।`, 'hi')}
              className="w-full min-h-[52px] py-3 px-4 rounded-2xl bg-amber-400 text-slate-950 font-black text-base flex items-center justify-center space-x-2 shadow-lg"
            >
              <Volume2 className="w-6 h-6 text-slate-950" />
              <span>🔊 आवाज़ में सलाह सुनें</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 4: 1-IDEA MANDI PRICE SCREEN (मंडी भाव) */}
      {/* ========================================================================= */}
      {activeScreen === 'mandi' && (
        <div className="space-y-5 animate-fadeIn">
          <button
            onClick={() => setActiveScreen('home')}
            className="min-h-[44px] px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs flex items-center space-x-2 cursor-pointer"
          >
            <span>⬅️ मुख्य स्क्रीन (Back Home)</span>
          </button>

          <MandiRatesSection
            village={village}
            selectedCrop={crop}
            isDarkMode={isDarkMode}
          />
        </div>
      )}

    </div>
  );
}
