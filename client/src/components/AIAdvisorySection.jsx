import React, { useState, useEffect } from 'react';
import { generateAdvisory } from '../services/apiService';
import { ShieldAlert, Sprout, Droplets, Mountain, Bug, FileCheck, CheckSquare, Square, RefreshCw, Sparkles } from 'lucide-react';

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
      const data = await generateAdvisory(village.id, crop, 'en');
      if (data) {
        setAdvisoryData(data);
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
      return 'bg-red-100 text-red-900 border-red-300 font-bold';
    }
    if (urgency === 'MEDIUM') {
      return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
    }
    return 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Sprout': return <Sprout className="w-5 h-5 text-emerald-600" />;
      case 'Droplets': return <Droplets className="w-5 h-5 text-cyan-600" />;
      case 'Mountain': return <Mountain className="w-5 h-5 text-amber-600" />;
      case 'Bug': return <Bug className="w-5 h-5 text-purple-600" />;
      default: return <ShieldAlert className="w-5 h-5 text-rose-600" />;
    }
  };

  return (
    <div className="bg-white border border-slate-200 p-4 sm:p-6 rounded-3xl mb-6 shadow-sm relative">
      
      {/* Header & Crop Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              5-Pillar Agricultural Climate Advisory Engine
            </h2>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Actionable climate mitigation & crop protection plan for <strong className="text-slate-900">{village.villageName}</strong> ({village.districtName}, {village.stateName})
          </p>
        </div>

        {/* Crop Selector Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto py-1">
          <span className="text-xs text-slate-600 font-bold shrink-0">Target Crop:</span>
          {village.primaryCrops.map(crop => (
            <button
              key={crop}
              onClick={() => onSelectCrop(crop)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                (selectedCrop || village.primaryCrops[0]) === crop
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {crop}
            </button>
          ))}
          <button
            onClick={() => fetchAIAdvisory(selectedCrop || village.primaryCrops[0])}
            disabled={loading}
            className="p-1.5 rounded-xl bg-slate-100 text-emerald-700 hover:bg-slate-200 transition-all border border-slate-300 disabled:opacity-50 shrink-0 cursor-pointer"
            title="Re-synthesis AI Advisory"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Advisory Content Cards */}
      {loading ? (
        <div className="py-16 text-center">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-800">Synthesizing AI Agricultural Advisory...</p>
          <p className="text-xs text-slate-500 mt-1">Processing village soil data, weather anomaly models, and pest forecast index</p>
        </div>
      ) : advisoryData ? (
        <div className="mt-6 space-y-4">
          {advisoryData.advisories.map((adv) => (
            <div
              key={adv.id}
              className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 shrink-0 shadow-xs">
                    {getIcon(adv.icon)}
                  </div>
                  <div>
                    <span className="text-[11px] font-black text-emerald-700 uppercase tracking-wider">
                      {adv.category}
                    </span>
                    <h3 className="text-sm font-black text-slate-900">{adv.title}</h3>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider self-start sm:self-auto ${getUrgencyBadge(adv.urgency)}`}>
                  {adv.urgency} Urgency
                </span>
              </div>

              <p className="text-xs text-slate-800 font-medium leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200 mb-4 shadow-xs">
                {adv.summary}
              </p>

              <div>
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600" /> Agronomic Action Checklist
                </h4>
                <div className="space-y-2">
                  {adv.actionItems.map((item, iIdx) => {
                    const itemId = `${adv.id}-${iIdx}`;
                    const isDone = !!completedItems[itemId];
                    return (
                      <div
                        key={iIdx}
                        onClick={() => toggleCheck(itemId)}
                        className={`flex items-start space-x-2.5 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                          isDone
                            ? 'bg-emerald-50 border-emerald-200 text-slate-500 line-through'
                            : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        {isDone ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
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
