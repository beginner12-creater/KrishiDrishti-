import React, { useState, useEffect } from 'react';
import { ShieldAlert, Sprout, Droplets, Mountain, Bug, FileCheck, CheckSquare, Square, RefreshCw, Sparkles, ChevronRight } from 'lucide-react';

export default function AIAdvisorySection({ village, riskMetrics, selectedCrop, onSelectCrop }) {
  const [advisoryData, setAdvisoryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [completedItems, setCompletedItems] = useState({});

  useEffect(() => {
    if (village) {
      fetchAIAdvisory(selectedCrop || village.primaryCrops[0]);
    }
  }, [village, selectedCrop]);

  const fetchAIAdvisory = async (crop) => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai-advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          villageId: village.id,
          selectedCrop: crop,
          lang: 'en'
        })
      });
      const data = await res.json();
      if (data.advisoryReport) {
        setAdvisoryData(data.advisoryReport);
      }
    } catch (err) {
      console.error('Failed to fetch AI advisory:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCheck = (itemId) => {
    setCompletedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  if (!village || !riskMetrics) return null;

  const getUrgencyBadge = (urgency) => {
    if (urgency === 'CRITICAL' || urgency === 'HIGH') {
      return 'bg-rose-950/80 text-rose-300 border-rose-800/80';
    }
    if (urgency === 'MEDIUM') {
      return 'bg-amber-950/80 text-amber-300 border-amber-800/80';
    }
    return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80';
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Sprout': return <Sprout className="w-5 h-5 text-emerald-400" />;
      case 'Droplets': return <Droplets className="w-5 h-5 text-cyan-400" />;
      case 'Mountain': return <Mountain className="w-5 h-5 text-amber-400" />;
      case 'Bug': return <Bug className="w-5 h-5 text-purple-400" />;
      default: return <ShieldAlert className="w-5 h-5 text-rose-400" />;
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 mb-6 shadow-xl relative">
      
      {/* Header & Crop Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-lg font-bold text-slate-100">
              5-Pillar Agricultural Climate Advisory Engine
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Actionable climate mitigation & crop protection plan for <strong className="text-slate-200">{village.villageName}</strong> ({village.districtName}, {village.stateName})
          </p>
        </div>

        {/* Crop Selector Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto py-1">
          <span className="text-xs text-slate-400 font-semibold shrink-0">Target Crop:</span>
          {village.primaryCrops.map(crop => (
            <button
              key={crop}
              onClick={() => onSelectCrop(crop)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                (selectedCrop || village.primaryCrops[0]) === crop
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {crop}
            </button>
          ))}
          <button
            onClick={() => fetchAIAdvisory(selectedCrop || village.primaryCrops[0])}
            disabled={loading}
            className="p-1.5 rounded-xl bg-slate-800 text-emerald-400 hover:bg-slate-700 transition-all border border-slate-700 disabled:opacity-50"
            title="Re-synthesis AI Advisory"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Advisory Content Cards */}
      {loading ? (
        <div className="py-16 text-center">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-200">Synthesizing AI Agricultural Advisory...</p>
          <p className="text-xs text-slate-500 mt-1">Processing village soil data, weather anomaly models, and pest forecast index</p>
        </div>
      ) : advisoryData ? (
        <div className="mt-6 space-y-4">
          {advisoryData.advisories.map((adv) => (
            <div
              key={adv.id}
              className="glass-card p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    {getIcon(adv.icon)}
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                      {adv.category}
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-100">{adv.title}</h3>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider self-start sm:self-auto ${getUrgencyBadge(adv.urgency)}`}>
                  {adv.urgency} Urgency
                </span>
              </div>

              {/* Summary Text */}
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 mb-4">
                {adv.summary}
              </p>

              {/* Action Checklist */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-400" /> Agronomic Action Checklist
                </h4>
                <div className="space-y-2">
                  {adv.actionItems.map((item, iIdx) => {
                    const itemId = `${adv.id}-${iIdx}`;
                    const isDone = !!completedItems[itemId];
                    return (
                      <div
                        key={iIdx}
                        onClick={() => toggleCheck(itemId)}
                        className={`flex items-start space-x-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                          isDone
                            ? 'bg-emerald-950/20 border-emerald-900/50 text-slate-400 line-through'
                            : 'bg-slate-900/40 border-slate-800/80 text-slate-200 hover:bg-slate-900/80'
                        }`}
                      >
                        {isDone ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                        )}
                        <span>{item}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
