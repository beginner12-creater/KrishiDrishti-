import React, { useState, useEffect } from 'react';
import { compareVillages } from '../services/apiService';
import { GitCompare, Sun, Flame, Droplets, Bug, Trash2 } from 'lucide-react';

export default function VillageCompare({ allVillages, defaultVillage }) {
  const [selectedVillageIds, setSelectedVillageIds] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (defaultVillage && selectedVillageIds.length === 0) {
      const defaultOther = allVillages.find(v => v.id !== defaultVillage.id) || allVillages[1];
      setSelectedVillageIds([defaultVillage.id, defaultOther?.id].filter(Boolean));
    }
  }, [defaultVillage, allVillages]);

  useEffect(() => {
    if (selectedVillageIds.length > 0) {
      fetchComparison();
    }
  }, [selectedVillageIds]);

  const fetchComparison = async () => {
    setLoading(true);
    try {
      const comp = await compareVillages(selectedVillageIds);
      if (comp) {
        setComparisonData(comp);
      }
    } catch (err) {
      console.error('Failed to compare villages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVillage = (vId) => {
    if (!vId || selectedVillageIds.includes(vId) || selectedVillageIds.length >= 3) return;
    setSelectedVillageIds(prev => [...prev, vId]);
  };

  const handleRemoveVillage = (vId) => {
    setSelectedVillageIds(prev => prev.filter(id => id !== vId));
  };

  return (
    <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800/80 mb-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-emerald-400" />
            Side-by-Side Indian Village Climate Risk Comparison
          </h3>
          <p className="text-xs text-slate-400">
            Compare agrarian vulnerability, groundwater stress, and hazard indices across up to 3 villages
          </p>
        </div>

        {selectedVillageIds.length < 3 && (
          <div className="flex items-center space-x-2">
            <select
              onChange={(e) => handleAddVillage(e.target.value)}
              value=""
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="">+ Add Village to Compare ({3 - selectedVillageIds.length} left)</option>
              {allVillages
                .filter(v => !selectedVillageIds.includes(v.id))
                .map(v => (
                  <option key={v.id} value={v.id}>
                    {v.villageName} ({v.districtName}, {v.stateName})
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">
          Comparing village climate risks...
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {comparisonData.map(({ village, riskMetrics }) => (
            <div key={village.id} className="glass-card p-5 rounded-xl border border-slate-800 relative flex flex-col justify-between">
              
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-extrabold text-slate-100">{village.villageName}</h4>
                    <p className="text-xs text-slate-400">{village.districtName}, <span className="text-emerald-400 font-semibold">{village.stateName}</span></p>
                  </div>
                  {selectedVillageIds.length > 1 && (
                    <button
                      onClick={() => handleRemoveVillage(village.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-all"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="my-4 p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
                  <span className="text-xs text-slate-400 block font-medium">Agri Climate Risk Index</span>
                  <div className="text-3xl font-extrabold my-1" style={{ color: riskMetrics.riskBadgeColor }}>
                    {riskMetrics.overallRiskScore} / 100
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${riskMetrics.riskBadgeColor}20`, color: riskMetrics.riskBadgeColor }}>
                    {riskMetrics.riskCategory}
                  </span>
                </div>

                <div className="space-y-2 text-xs mb-4">
                  <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded-lg">
                    <span className="text-slate-400 flex items-center gap-1.5"><Sun className="w-3.5 h-3.5 text-amber-400" /> Drought Risk:</span>
                    <span className="font-bold text-amber-400">{riskMetrics.subIndices.droughtIndex}%</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded-lg">
                    <span className="text-slate-400 flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-rose-400" /> Heat Stress:</span>
                    <span className="font-bold text-rose-400">{riskMetrics.subIndices.heatwaveIndex}%</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded-lg">
                    <span className="text-slate-400 flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5 text-cyan-400" /> Flood Risk:</span>
                    <span className="font-bold text-cyan-400">{riskMetrics.subIndices.floodIndex}%</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded-lg">
                    <span className="text-slate-400 flex items-center gap-1.5"><Bug className="w-3.5 h-3.5 text-purple-400" /> Pest Threat:</span>
                    <span className="font-bold text-purple-400">{riskMetrics.subIndices.pestIndex}%</span>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3 text-xs space-y-1.5 text-slate-300">
                  <div>Soil: <strong className="text-slate-100">{village.soilType}</strong></div>
                  <div>Groundwater: <strong className="text-amber-400">{village.groundwaterStatus}</strong></div>
                  <div>Normal Rainfall: <strong>{village.annualRainfallNormal} mm/yr</strong></div>
                  <div>Primary Crops: <span className="text-emerald-300 font-medium">{village.primaryCrops.join(', ')}</span></div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
