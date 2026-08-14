import React, { useState, useEffect } from 'react';
import { Radio, Send, CheckCircle, Smartphone, AlertTriangle, X, ShieldAlert, Sparkles, RefreshCw, PhoneCall, Wifi } from 'lucide-react';

export default function CellTowerSMSBroadcastModal({ village, riskMetrics, selectedCrop, onClose, isDarkMode = false }) {
  const vName = village ? village.villageName : 'Selected Village';
  const dName = village ? village.districtName : 'Selected District';
  const bName = village ? village.blockName : 'Selected Taluka';
  const crop = selectedCrop || (village?.primaryCrops ? village.primaryCrops[0] : 'Cotton');

  const seed = hashString(village?.id || 'v1');
  const farmerCount = Math.round(850 + (seed % 450)); // e.g. 1,120 farmers in tower range
  const towerId = `BSNL-JIO-MH-${(seed % 800) + 100}`;
  const signalDb = -64 - (seed % 12); // -64 dBm 4G LTE

  // SMS Alert Templates
  const alertTemplates = [
    {
      id: 'rain',
      title: '🌧️ Heavy Rain Warning (वादळी पाऊस)',
      message: `🚨 [कृषिदृष्टी इशारा] ${vName} (${bName}) परिसरात पुढील २४ तासांत वादळी पाऊस शक्यता. कापूस व सोयाबीन पीक ताडपत्रीने झाका! - कृषी विभाग`,
      badge: 'Urgent Alert'
    },
    {
      id: 'pest',
      title: '🐛 Pest Spray Alert (कीड नियंत्रण)',
      message: `⚠️ [कीड इशारा] ${vName} मधील ${crop} पिकावर गुलाबी बोंड अळीचा धोका. ५% निंबोळी अर्क (NSKE) फवारणी करा. - KrishiDrishti AI`,
      badge: 'Crop Protection'
    },
    {
      id: 'heatwave',
      title: '☀️ Heatwave & Water Tip (उष्माघात सल्ला)',
      message: `☀️ [पाणी सल्ला] ${vName} मधील तापमानात वाढ. ${crop} पिकाला संध्याकाळी ठिबकद्वारे पाणी द्या. - हवामान केंद्र`,
      badge: 'Weather Advisory'
    },
    {
      id: 'mandi',
      title: '💰 Mandi Price Alert (बाजारभाव माहिती)',
      message: `💰 [बाजारभाव] ${dName} APMC मधील आजचा ${crop} उच्चतम दर ₹ 8,250/क्विंटल नोंदवला गेला आहे. - मंडी अपडेट`,
      badge: 'Market Rate'
    }
  ];

  const [selectedTemplate, setSelectedTemplate] = useState(alertTemplates[0]);
  const [customText, setCustomText] = useState(alertTemplates[0].message);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastProgress, setBroadcastProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [liveLog, setLiveLog] = useState([]);

  // Generate Sample Farmer Phone Roster for Live Dispatch Log
  const farmerNames = [
    'Dnyaneshwar M. (ज्ञानेश्वर)', 'Ramesh Patil (रमेश)', 'Savitri Bai (सावित्रीबाई)',
    'Subhash Shinde (सुभाष)', 'Ananda Gawande (आनंदा)', 'Prakash Rathod (प्रकाश)',
    'Sunita Deshmukh (सुनिता)', 'Vishnu Jadhav (विष्णू)', 'Ganesh More (गणेश)',
    'Eknath Kadam (एकनाथ)', 'Santosh Wagh (संतोष)', 'Lakshman Bhosale (लक्ष्मण)'
  ];

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setCustomText(template.message);
  };

  const handleStartBroadcast = () => {
    setIsBroadcasting(true);
    setBroadcastProgress(0);
    setIsCompleted(false);
    setLiveLog([]);

    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 15) + 10;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setIsBroadcasting(false);
        setIsCompleted(true);
      }
      setBroadcastProgress(current);

      // Append live farmer dispatch log
      const randomName = farmerNames[Math.floor(Math.random() * farmerNames.length)];
      const randomNum = `+91 ${Math.floor(70000 + Math.random() * 29999)} ${Math.floor(10000 + Math.random() * 89999)}`;
      
      setLiveLog(prev => [
        { name: randomName, number: randomNum, time: new Date().toLocaleTimeString() },
        ...prev.slice(0, 5)
      ]);

    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className={`border w-full max-w-3xl rounded-3xl p-5 sm:p-7 shadow-2xl relative my-6 transition-all ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 mb-5">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md animate-pulse">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-black flex items-center gap-2">
                Cell Tower Geo-Broadcast SMS Hub (सेल टॉवर मेसेज केंद्र)
              </h3>
              <p className="text-xs text-emerald-500 font-bold mt-0.5">
                Connected to Nearest Cell Tower: <strong className="text-amber-400">{towerId}</strong> ({vName})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isDarkMode ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. TOWER STATUS & CONNECTED FARMERS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5 text-xs">
          <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Cell Tower ID</span>
            <div className="text-sm font-black text-emerald-400 mt-0.5 truncate">{towerId}</div>
          </div>
          <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Farmers in Radius</span>
            <div className="text-sm font-black text-amber-400 mt-0.5">{farmerCount.toLocaleString('en-IN')} Handsets</div>
          </div>
          <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Signal Strength</span>
            <div className="text-sm font-black text-cyan-400 mt-0.5">{signalDb} dBm (4G LTE)</div>
          </div>
          <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Coverage Grid</span>
            <div className="text-sm font-black text-purple-400 mt-0.5">15 km Radius ({vName})</div>
          </div>
        </div>

        {/* 2. SELECT EMERGENCY ALERT MESSAGE TEMPLATE */}
        <div className="space-y-3 mb-5">
          <label className="text-xs font-black uppercase tracking-wider text-emerald-500 block">
            Select SMS Alert Template (संदेश प्रकार निवडा):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {alertTemplates.map(t => (
              <button
                key={t.id}
                onClick={() => handleSelectTemplate(t)}
                className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all cursor-pointer ${
                  selectedTemplate.id === t.id
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                    : isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-emerald-500' : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-emerald-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span>{t.title}</span>
                  <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-md font-black">{t.badge}</span>
                </div>
                <p className="text-[11px] opacity-80 line-clamp-2">{t.message}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 3. MESSAGE COMPOSER & MOBILE NOTIFICATION PREVIEW */}
        <div className="space-y-3 mb-5">
          <label className="text-xs font-black uppercase tracking-wider text-emerald-500 block">
            SMS Message Text (मोबाईलवर पाठवला जाणारा मेसेज):
          </label>
          <textarea
            rows={3}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            className={`w-full p-3 rounded-2xl border text-xs font-bold focus:outline-none focus:border-emerald-500 ${
              isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          />
        </div>

        {/* 4. LIVE BROADCAST ANIMATION & DISPATCH LOG */}
        {isBroadcasting && (
          <div className="space-y-3 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-white mb-5 animate-slideUp">
            <div className="flex items-center justify-between text-xs font-black">
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
                Broadcasting SMS via {towerId}...
              </span>
              <span className="text-emerald-400">{Math.round((broadcastProgress / 100) * farmerCount)} / {farmerCount} Delivered ({broadcastProgress}%)</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                style={{ width: `${broadcastProgress}%` }}
              />
            </div>

            {/* Live Farmer Roster Log */}
            <div className="space-y-1 text-[11px] font-bold font-mono">
              {liveLog.map((log, i) => (
                <div key={i} className="flex items-center justify-between text-slate-300 border-b border-white/10 pb-1">
                  <span>📱 {log.number} ({log.name})</span>
                  <span className="text-emerald-400">DELIVERED ✅ [{log.time}]</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. SUCCESS CONFIRMATION BADGE */}
        {isCompleted && (
          <div className="p-4 rounded-2xl bg-emerald-600 text-white flex items-center justify-between shadow-lg mb-5 animate-slideUp">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-emerald-200 shrink-0" />
              <div>
                <h4 className="font-black text-sm">Emergency Alert Broadcast Successful!</h4>
                <p className="text-xs text-emerald-100 font-bold">
                  Sent to all <strong>{farmerCount.toLocaleString('en-IN')} farmers</strong> in {vName} tower radius.
                </p>
              </div>
            </div>
            <span className="text-xs bg-white text-emerald-950 font-black px-3 py-1.5 rounded-xl uppercase shadow-xs">
              100% Sent
            </span>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Close
          </button>
          <button
            onClick={handleStartBroadcast}
            disabled={isBroadcasting}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center space-x-2 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4 text-white" />
            <span>{isBroadcasting ? 'Broadcasting SMS...' : `Broadcast SMS to ${farmerCount.toLocaleString('en-IN')} Farmers`}</span>
          </button>
        </div>

      </div>
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
