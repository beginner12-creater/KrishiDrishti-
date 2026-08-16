import React, { useState } from 'react';
import { AlertTriangle, Clock, CheckSquare, Square, Radio, Send, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import CellTowerSMSBroadcastModal from './CellTowerSMSBroadcastModal';

export default function ActionTriggerDisasterProtocols({ village, riskMetrics, liveWeather, farmContext, isDarkMode = false }) {
  const [checkedTasks, setCheckedTasks] = useState({});
  const [isTowerModalOpen, setIsTowerModalOpen] = useState(false);

  if (!village || !riskMetrics) return null;

  const crop = farmContext?.crop || 'Cotton';
  const vName = village.villageName;
  const farmerCount = Math.round(850 + (hashString(village.id) % 450));

  const rainProb = liveWeather?.rainProbability || 65;
  const temp = liveWeather?.tempC || 34;

  const isExtremeRain = rainProb >= 50;
  const isExtremeHeat = temp >= 37;

  // Emergency Mitigation Protocol Data with Lead Timers & Step-by-Step Checklists
  const getDisasterProtocols = () => {
    if (isExtremeRain) {
      return {
        hazardTitle: `⚡ EXTREME MONSOON DOWNPOUR WARNING (${vName})`,
        leadTimeHours: 4,
        leadTimeText: "4 Hours Remaining before Cloudburst Downpour",
        severity: "CRITICAL HIGH",
        badgeColor: "bg-rose-500 text-slate-950 font-black",
        checklists: [
          { id: 't1', text: `Clear Broad Bed Furrow (BBF) drainage outlets in Plot B to prevent 48h waterlogging.` },
          { id: 't2', text: `Cover open cut ${crop} bolls / pods with plastic tarpaulin sheets immediately.` },
          { id: 't3', text: `Disconnect electrical motor pumps and elevated transformer lines to prevent short-circuit flooding.` },
          { id: 't4', text: `Notify Crop Insurance PMFBY representative / Kisan Call Centre (1800-180-1551) if field inundation occurs.` }
        ]
      };
    }

    if (isExtremeHeat) {
      return {
        hazardTitle: `☀️ THERMAL WAVE & EVAPOTRANSPIRATION STRESS ALERT (${vName})`,
        leadTimeHours: 6,
        leadTimeText: "6 Hours Lead Time before Afternoon Peak Thermal Stress",
        severity: "HIGH HEATWAVE",
        badgeColor: "bg-amber-400 text-slate-950 font-black",
        checklists: [
          { id: 't1', text: `Apply 1% Potassium Nitrate (KNO3) foliar spray between 6 AM - 8 AM to enhance stomatal closure.` },
          { id: 't2', text: `Deploy straw mulching (5 tonnes/ha) around ${crop} root zone to lower soil temp by 4°C.` },
          { id: 't3', text: `Drip irrigate for 45 minutes after 6:30 PM to avoid root thermal shock.` }
        ]
      };
    }

    return {
      hazardTitle: `⚠️ PREVENTATIVE CLIMATE LOSS PROTOCOL (${vName})`,
      leadTimeHours: 12,
      leadTimeText: "12 Hours Lead Time Window",
      severity: "MODERATE ADVISORY",
      badgeColor: "bg-emerald-500 text-slate-950 font-black",
      checklists: [
        { id: 't1', text: `Inspect ${crop} plots for early pink bollworm / girdle beetle symptoms.` },
        { id: 't2', text: `Maintain yellow sticky cards (10/acre) across plot boundary.` },
        { id: 't3', text: `Verify PMFBY crop insurance enrolment policy receipt status.` }
      ]
    };
  };

  const protocol = getDisasterProtocols();

  const toggleTask = (id) => {
    setCheckedTasks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checkedTasks).filter(Boolean).length;
  const totalCount = protocol.checklists.length;

  return (
    <div className={`p-4 sm:p-6 rounded-3xl border shadow-xl relative overflow-hidden transition-all duration-500 ${
      isDarkMode
        ? 'bg-slate-900/90 border-slate-800 text-white'
        : 'bg-white border-slate-200 text-slate-900'
    }`}>
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold shadow-md">
            <ShieldAlert className="w-5 h-5 text-rose-500 animate-bounce" />
          </div>
          <div>
            <h3 className="text-base sm:text-xl font-black flex items-center gap-2">
              <span>Agro-Action Triggers & Loss Prevention Protocols</span>
            </h3>
            <p className={`text-xs font-bold mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Step-by-Step Mitigation Checklist with Lead Time Timers ({vName})
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsTowerModalOpen(true)}
          className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-xl font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <Radio className="w-4 h-4 text-slate-950 animate-pulse" />
          <span>📡 Broadcast Alert to {farmerCount} Farmers</span>
        </button>
      </div>

      {/* EMERGENCY HAZARD LEAD TIME BANNER */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950 via-slate-950 to-amber-950 border border-rose-500/40 text-white mb-4 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <Clock className="w-7 h-7 text-amber-400 animate-spin shrink-0" style={{ animationDuration: '20s' }} />
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-[9px] px-2 py-0.5 rounded-md font-black uppercase ${protocol.badgeColor}`}>
                {protocol.severity}
              </span>
              <span className="text-xs font-bold text-slate-300">Lead Time Countdown</span>
            </div>
            <h4 className="text-sm sm:text-base font-black text-white mt-0.5">{protocol.hazardTitle}</h4>
          </div>
        </div>

        <div className="text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-white/20 self-start sm:self-auto">
          <span className="text-[10px] text-amber-400 uppercase font-black block">Action Window</span>
          <div className="text-sm font-black text-amber-300 font-mono">{protocol.leadTimeText}</div>
        </div>
      </div>

      {/* STEP-BY-STEP ACTION CHECKLIST */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-black text-emerald-400">
          <span>Action Mitigation Checklist ({completedCount}/{totalCount} Completed):</span>
          <span>{Math.round((completedCount / totalCount) * 100)}% Mitigation Done</span>
        </div>

        <div className="space-y-2">
          {protocol.checklists.map((item) => {
            const isDone = checkedTasks[item.id];
            return (
              <button
                key={item.id}
                onClick={() => toggleTask(item.id)}
                className={`w-full p-3 rounded-2xl border text-left text-xs font-bold transition-all flex items-start space-x-3 cursor-pointer ${
                  isDone
                    ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200 line-through opacity-80'
                    : isDarkMode
                    ? 'bg-slate-950 border-slate-800 text-slate-200 hover:border-emerald-500'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-emerald-50'
                }`}
              >
                {isDone ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                )}
                <span className="flex-1 leading-relaxed font-bold">{item.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CELL TOWER MODAL POPUP */}
      {isTowerModalOpen && (
        <CellTowerSMSBroadcastModal
          village={village}
          riskMetrics={riskMetrics}
          selectedCrop={crop}
          onClose={() => setIsTowerModalOpen(false)}
          isDarkMode={isDarkMode}
        />
      )}

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
