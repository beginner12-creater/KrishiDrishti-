import React from 'react';
import { CloudRain, ShieldCheck, Sprout, Calendar, Bell, LineChart, CheckCircle2, Star, Sparkles } from 'lucide-react';

export default function PlatformImpactFeatures({ village, riskMetrics }) {
  const outcomes = [
    { text: "Early weather alerts", textMr: "वेळेवर हवामान इशारा", icon: Bell, color: "text-amber-600 bg-amber-50" },
    { text: "Reduced crop losses", textMr: "पिकांचे नुकसान टाळा", icon: ShieldCheck, color: "text-emerald-600 bg-emerald-50" },
    { text: "Climate-resilient farming", textMr: "हवामान-सक्षम शेती", icon: Sprout, color: "text-teal-600 bg-teal-50" },
    { text: "Improved crop planning", textMr: "उत्तम पीक नियोजन", icon: Calendar, color: "text-blue-600 bg-blue-50" },
    { text: "Better disaster preparedness", textMr: "आपत्ती पूर्वतयारी", icon: LineChart, color: "text-purple-600 bg-purple-50" }
  ];

  const features = [
    { title: "Hyperlocal weather forecasts", subtitle: "तालुका-स्तरीय अचूक हवामान", icon: CloudRain },
    { title: "AI risk prediction", subtitle: "कृत्रिम बुद्धिमत्ता धोका अंदाज", icon: LineChart },
    { title: "Crop-specific advisories", subtitle: "पिकानुसार कृषी सल्ला", icon: Sprout },
    { title: "Harvest planning", subtitle: "काढणी व बाजार नियोजन", icon: Calendar },
    { title: "Alert notifications", subtitle: "इशारा संदेश", icon: Bell },
    { title: "Historical weather analysis", subtitle: "मागील हवामान विश्लेषण", icon: ShieldCheck }
  ];

  return (
    <div className="space-y-6 mb-6">
      
      {/* 1. EXPECTED OUTCOMES CARD */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center space-x-2.5 mb-4">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-emerald-700 font-bold" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
              Expected Outcomes <span className="text-xs font-bold text-slate-500">(अपेक्षित फायदे)</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">Benefits for farmers in {village ? village.villageName : 'your village'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {outcomes.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 p-3.5 rounded-2xl flex items-center space-x-3 transition-all"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                  <Icon className="w-4 h-4 font-bold" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900 leading-tight">{item.text}</h3>
                  <p className="text-[10px] text-slate-500 font-bold mt-0.5">{item.textMr}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. CORE PLATFORM FEATURES CARD */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center space-x-2.5 mb-4">
          <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center">
            <Star className="w-4 h-4 text-teal-700 font-bold" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
              Core Platform Features <span className="text-xs font-bold text-slate-500">(मुख्य वैशिष्ट्ये)</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">Smart climate tools designed for simple farmer understanding</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 p-4 rounded-2xl flex items-center space-x-3.5 transition-all"
              >
                <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 text-emerald-700 shadow-2xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">{feat.title}</h3>
                  <p className="text-[11px] text-slate-500 font-bold mt-0.5">{feat.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
