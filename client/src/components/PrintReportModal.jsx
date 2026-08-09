import React from 'react';
import { X, Printer, Download, ShieldCheck, Sprout, MapPin, Calendar, FileText } from 'lucide-react';

export default function PrintReportModal({ village, riskMetrics, onClose }) {
  if (!village || !riskMetrics) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl p-6 shadow-2xl relative my-8 text-slate-100 print:bg-white print:text-black print:p-0 print:border-none print:shadow-none">
        
        {/* Action Header (Hidden during print) */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800 print:hidden">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">Village Climate Audit & Resilience Report</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE REPORT DOCUMENT BODY */}
        <div className="space-y-6">
          
          {/* Header Banner */}
          <div className="border-b-2 border-emerald-500 pb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <Sprout className="w-7 h-7 text-emerald-500 print:text-emerald-700" />
                <h1 className="text-xl font-extrabold text-slate-100 print:text-slate-900">
                  KrishiDrishti AI — Climate Audit Report
                </h1>
              </div>
              <p className="text-xs text-slate-400 print:text-slate-600 mt-1">
                National Agricultural Climate Vulnerability & Resilience Framework
              </p>
            </div>
            <div className="text-right text-xs text-slate-400 print:text-slate-600">
              <div>Date Generated: <strong className="text-slate-200 print:text-slate-900">{new Date().toLocaleDateString('en-IN')}</strong></div>
              <div>Report ID: <span className="font-mono text-emerald-400 print:text-emerald-700">{village.id}</span></div>
            </div>
          </div>

          {/* Village Profile Table */}
          <div className="bg-slate-950/60 print:bg-slate-100 p-4 rounded-xl border border-slate-800 print:border-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 print:text-slate-500 font-semibold block text-[11px]">VILLAGE</span>
              <strong className="text-emerald-400 print:text-slate-900 text-sm">{village.villageName}</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-500 font-semibold block text-[11px]">BLOCK / TEHSIL</span>
              <strong className="text-slate-200 print:text-slate-900 text-sm">{village.blockName}</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-500 font-semibold block text-[11px]">DISTRICT & STATE</span>
              <strong className="text-slate-200 print:text-slate-900 text-sm">{village.districtName}, {village.stateName}</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-500 font-semibold block text-[11px]">PINCODE</span>
              <strong className="text-slate-200 print:text-slate-900 text-sm">{village.pincode}</strong>
            </div>
          </div>

          {/* Climate Risk Assessment Scorecard */}
          <div className="border border-slate-800 print:border-slate-300 rounded-xl p-4 bg-slate-900/40 print:bg-slate-50">
            <h3 className="text-xs font-bold text-slate-400 print:text-slate-700 uppercase tracking-wider mb-3">
              1. Multi-Hazard Climate Risk Scorecard
            </h3>
            
            <div className="flex items-center justify-between p-3 bg-slate-950 print:bg-white rounded-xl border border-slate-800 print:border-slate-300 mb-4">
              <div>
                <span className="text-xs text-slate-400 print:text-slate-600 font-medium">Composite Risk Score</span>
                <div className="text-3xl font-extrabold" style={{ color: riskMetrics.riskBadgeColor }}>
                  {riskMetrics.overallRiskScore} / 100
                </div>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase" style={{ backgroundColor: `${riskMetrics.riskBadgeColor}20`, color: riskMetrics.riskBadgeColor, border: `1px solid ${riskMetrics.riskBadgeColor}50` }}>
                  {riskMetrics.riskCategory}
                </span>
                <p className="text-[11px] text-slate-400 print:text-slate-600 mt-1">Based on 5 multi-hazard parameters</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              <div className="p-2 bg-slate-950/60 print:bg-white rounded border border-slate-800 print:border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 print:text-slate-600">Drought Index</span>
                <div className="font-bold text-amber-400 print:text-amber-700 text-sm">{riskMetrics.subIndices.droughtIndex}%</div>
              </div>
              <div className="p-2 bg-slate-950/60 print:bg-white rounded border border-slate-800 print:border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 print:text-slate-600">Heat Stress</span>
                <div className="font-bold text-rose-400 print:text-rose-700 text-sm">{riskMetrics.subIndices.heatwaveIndex}%</div>
              </div>
              <div className="p-2 bg-slate-950/60 print:bg-white rounded border border-slate-800 print:border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 print:text-slate-600">Flood Hazard</span>
                <div className="font-bold text-cyan-400 print:text-cyan-700 text-sm">{riskMetrics.subIndices.floodIndex}%</div>
              </div>
              <div className="p-2 bg-slate-950/60 print:bg-white rounded border border-slate-800 print:border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 print:text-slate-600">Pest Threat</span>
                <div className="font-bold text-purple-400 print:text-purple-700 text-sm">{riskMetrics.subIndices.pestIndex}%</div>
              </div>
              <div className="p-2 bg-slate-950/60 print:bg-white rounded border border-slate-800 print:border-slate-200 text-center col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 print:text-slate-600">Groundwater/Soil</span>
                <div className="font-bold text-emerald-400 print:text-emerald-700 text-sm">{riskMetrics.subIndices.soilIndex}%</div>
              </div>
            </div>
          </div>

          {/* Agronomic Baseline & Recommended Actions */}
          <div className="border border-slate-800 print:border-slate-300 rounded-xl p-4 bg-slate-900/40 print:bg-slate-50 text-xs space-y-3">
            <h3 className="font-bold text-slate-400 print:text-slate-700 uppercase tracking-wider text-[11px]">
              2. Baseline Parameters & Mandatory Resilience Actions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-2.5 bg-slate-950/60 print:bg-white rounded-lg border border-slate-800 print:border-slate-200">
                <div className="font-semibold text-emerald-400 print:text-emerald-800">Primary Crops Analyzed:</div>
                <div className="text-slate-200 print:text-slate-800 font-medium mt-0.5">{village.primaryCrops.join(', ')}</div>
              </div>
              <div className="p-2.5 bg-slate-950/60 print:bg-white rounded-lg border border-slate-800 print:border-slate-200">
                <div className="font-semibold text-emerald-400 print:text-emerald-800">Soil & Water Table:</div>
                <div className="text-slate-200 print:text-slate-800 font-medium mt-0.5">{village.soilType} • GW: {village.groundwaterStatus}</div>
              </div>
            </div>

            <div className="bg-emerald-950/20 print:bg-emerald-50 p-3 rounded-lg border border-emerald-900/40 print:border-emerald-200">
              <div className="font-bold text-emerald-400 print:text-emerald-900 mb-1">Key Panchayat Level Interventions:</div>
              <ul className="list-disc list-inside space-y-1 text-slate-300 print:text-slate-800">
                <li>Deploy micro-irrigation systems (Drip / Sprinkler) across non-irrigated farmland.</li>
                <li>Ensure early PMFBY crop insurance enrolment prior to Kharif/Rabi sowing cut-off dates.</li>
                <li>Establish community Seed Banks for drought-tolerant crop cultivars.</li>
                <li>Conduct rainwater harvesting recharge pit construction under MGNREGA.</li>
              </ul>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="pt-4 border-t border-slate-800 print:border-slate-300 flex items-center justify-between text-[10px] text-slate-500 print:text-slate-600">
            <div>Verified by KrishiDrishti AI Engine • Indian Council of Agricultural Research (ICAR) Agro-Zone Guidelines</div>
            <div>Page 1 of 1</div>
          </div>

        </div>

      </div>
    </div>
  );
}
