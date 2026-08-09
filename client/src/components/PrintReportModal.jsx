import React from 'react';
import { X, Printer, Download, ShieldCheck, Sprout, MapPin, Calendar, FileText, ArrowLeft } from 'lucide-react';

export default function PrintReportModal({ village, riskMetrics, onClose }) {
  if (!village || !riskMetrics) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border border-slate-200 w-full max-w-3xl rounded-3xl p-5 sm:p-7 shadow-2xl relative my-8 text-slate-900 print:bg-white print:text-black print:p-0 print:border-none print:shadow-none">
        
        {/* Action Header (Hidden during print) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-slate-200 print:hidden">
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition-all border border-slate-200 shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-600" />
              <span>← Back to App (मागे जा)</span>
            </button>
            <h3 className="text-sm sm:text-base font-black text-slate-900">
              Village Climate Audit Report
            </h3>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF (प्रिन्ट करा)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-900 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all border border-slate-200 cursor-pointer"
              title="Close Report"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE REPORT DOCUMENT BODY */}
        <div className="space-y-6">
          
          {/* Header Banner */}
          <div className="border-b-2 border-emerald-600 pb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <Sprout className="w-7 h-7 text-emerald-600 print:text-emerald-700" />
                <h1 className="text-xl font-black text-slate-900">
                  KrishiDrishti AI — Climate Audit Report
                </h1>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-1">
                National Agricultural Climate Vulnerability & Resilience Framework
              </p>
            </div>
            <div className="text-right text-xs text-slate-600">
              <div>Date Generated: <strong className="text-slate-900">{new Date().toLocaleDateString('en-IN')}</strong></div>
              <div>Report ID: <span className="font-mono text-emerald-700 font-bold">{village.id}</span></div>
            </div>
          </div>

          {/* Village Profile Table */}
          <div className="bg-slate-50 print:bg-slate-100 p-4 rounded-2xl border border-slate-200 print:border-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 font-bold block text-[11px]">VILLAGE (गाव)</span>
              <strong className="text-emerald-800 text-sm font-black">{village.villageName}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[11px]">BLOCK / TEHSIL (तालुका)</span>
              <strong className="text-slate-900 text-sm font-extrabold">{village.blockName}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[11px]">DISTRICT & STATE (जिल्हा व राज्य)</span>
              <strong className="text-slate-900 text-sm font-extrabold">{village.districtName}, {village.stateName}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-bold block text-[11px]">PINCODE (पिनकोड)</span>
              <strong className="text-slate-900 text-sm font-extrabold">{village.pincode}</strong>
            </div>
          </div>

          {/* Climate Risk Assessment Scorecard */}
          <div className="border border-slate-200 print:border-slate-300 rounded-2xl p-4 bg-slate-50 print:bg-slate-50">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider mb-3">
              1. Multi-Hazard Climate Risk Scorecard (हवामान धोका गुण)
            </h3>
            
            <div className="flex items-center justify-between p-3.5 bg-white print:bg-white rounded-xl border border-slate-200 print:border-slate-300 mb-4 shadow-xs">
              <div>
                <span className="text-xs text-slate-600 font-bold">Composite Risk Score</span>
                <div className="text-3xl font-black" style={{ color: riskMetrics.riskBadgeColor }}>
                  {riskMetrics.overallRiskScore} / 100
                </div>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase" style={{ backgroundColor: `${riskMetrics.riskBadgeColor}15`, color: riskMetrics.riskBadgeColor, border: `1px solid ${riskMetrics.riskBadgeColor}40` }}>
                  {riskMetrics.riskCategory}
                </span>
                <p className="text-[11px] text-slate-600 font-medium mt-1">Based on 5 multi-hazard parameters</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center shadow-xs">
                <span className="text-[10px] text-slate-500 font-bold">Drought Index</span>
                <div className="font-black text-amber-700 text-sm">{riskMetrics.subIndices.droughtIndex}%</div>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center shadow-xs">
                <span className="text-[10px] text-slate-500 font-bold">Heat Stress</span>
                <div className="font-black text-rose-700 text-sm">{riskMetrics.subIndices.heatwaveIndex}%</div>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center shadow-xs">
                <span className="text-[10px] text-slate-500 font-bold">Flood Hazard</span>
                <div className="font-black text-cyan-700 text-sm">{riskMetrics.subIndices.floodIndex}%</div>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center shadow-xs">
                <span className="text-[10px] text-slate-500 font-bold">Pest Threat</span>
                <div className="font-black text-purple-700 text-sm">{riskMetrics.subIndices.pestIndex}%</div>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-center col-span-2 sm:col-span-1 shadow-xs">
                <span className="text-[10px] text-slate-500 font-bold">Groundwater/Soil</span>
                <div className="font-black text-emerald-700 text-sm">{riskMetrics.subIndices.soilIndex}%</div>
              </div>
            </div>
          </div>

          {/* Agronomic Baseline & Recommended Actions */}
          <div className="border border-slate-200 print:border-slate-300 rounded-2xl p-4 bg-slate-50 text-xs space-y-3">
            <h3 className="font-black text-slate-700 uppercase tracking-wider text-[11px]">
              2. Baseline Parameters & Mandatory Resilience Actions (महत्त्वाचे उपाय)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="font-black text-emerald-800">Primary Crops Analyzed:</div>
                <div className="text-slate-900 font-bold mt-0.5">{village.primaryCrops.join(', ')}</div>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="font-black text-emerald-800">Soil & Water Table:</div>
                <div className="text-slate-900 font-bold mt-0.5">{village.soilType} • GW: {village.groundwaterStatus}</div>
              </div>
            </div>

            <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200">
              <div className="font-black text-emerald-900 mb-1">Key Panchayat Level Interventions:</div>
              <ul className="list-disc list-inside space-y-1 text-slate-800 font-medium">
                <li>Deploy micro-irrigation systems (Drip / Sprinkler) across non-irrigated farmland.</li>
                <li>Ensure early PMFBY crop insurance enrolment prior to Kharif/Rabi sowing cut-off dates.</li>
                <li>Establish community Seed Banks for drought-tolerant crop cultivars.</li>
                <li>Conduct rainwater harvesting recharge pit construction under MGNREGA.</li>
              </ul>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="pt-4 border-t border-slate-200 print:border-slate-300 flex items-center justify-between text-[10px] text-slate-500">
            <div>Verified by KrishiDrishti AI Engine • Indian Council of Agricultural Research (ICAR) Agro-Zone Guidelines</div>
            <div>Page 1 of 1</div>
          </div>

        </div>

        {/* Action Footer (Hidden during print) */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs transition-all border border-slate-200 cursor-pointer flex items-center justify-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-600" />
            <span>← Back to App (मागे जा / बंद करा)</span>
          </button>

          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all shadow-sm cursor-pointer flex items-center justify-center space-x-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Download PDF (प्रिन्ट करा)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
