import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import VillageSelector from './components/VillageSelector';
import PlatformImpactFeatures from './components/PlatformImpactFeatures';
import FarmerSimpleView from './components/FarmerSimpleView';
import CropProfitRecommendation from './components/CropProfitRecommendation';
import FloatingAIAssistant from './components/FloatingAIAssistant';
import PrintReportModal from './components/PrintReportModal';

import { fetchHierarchy, fetchVillages, fetchVillageDetails } from './services/apiService';
import { Sprout, RefreshCw, TrendingUp, CloudRain } from 'lucide-react';

export default function App() {
  const [allVillages, setAllVillages] = useState([]);
  const [hierarchy, setHierarchy] = useState({});
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [riskMetrics, setRiskMetrics] = useState(null);
  const [currentLang, setCurrentLang] = useState('mr'); // Default to Marathi
  const [selectedCropForAdvisory, setSelectedCropForAdvisory] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('advisory'); // 'advisory' | 'profit'

  // Initial load of village database
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const hier = await fetchHierarchy();
      if (hier) setHierarchy(hier);

      const villList = await fetchVillages();
      if (villList && villList.length > 0) {
        setAllVillages(villList);
        loadVillageDetails(villList[0].id);
      }
    } catch (err) {
      console.error('Failed to initialize app data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load detailed analysis for selected village
  const loadVillageDetails = async (villageId) => {
    try {
      const data = await fetchVillageDetails(villageId);
      if (data && data.village && data.riskMetrics) {
        setSelectedVillage(data.village);
        setRiskMetrics(data.riskMetrics);
        setSelectedCropForAdvisory(data.village.primaryCrops[0]);
      }
    } catch (err) {
      console.error('Failed to load village risk metrics:', err);
    }
  };

  const handleSelectVillage = (villageObj) => {
    loadVillageDetails(villageObj.id);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-emerald-500 selection:text-white">
      
      {/* 1. Minimal Top Header */}
      <Navbar
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        activeVillage={selectedVillage}
      />

      {/* 2. Main Minimalist 1-Page Layout */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
        
        {/* Village Selection Menu */}
        <VillageSelector
          villages={allVillages}
          hierarchy={hierarchy}
          selectedVillage={selectedVillage}
          onSelectVillage={handleSelectVillage}
          currentLang={currentLang}
        />

        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="w-9 h-9 text-emerald-600 animate-spin mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800">Loading Agricultural Database...</h3>
          </div>
        ) : selectedVillage && riskMetrics ? (
          <div className="space-y-6">
            
            {/* A. FEATURE SLIDE BAR & EXPECTED OUTCOMES */}
            <PlatformImpactFeatures
              village={selectedVillage}
              riskMetrics={riskMetrics}
            />

            {/* B. MAIN PAGE NAVIGATION TAB BAR (ADVISORY VS PROFIT TAB) */}
            <div className="flex items-center justify-center p-1.5 bg-slate-200/80 rounded-2xl border border-slate-300 max-w-md mx-auto shadow-inner">
              <button
                onClick={() => setActiveTab('advisory')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center space-x-2 transition-all duration-300 cursor-pointer ${
                  activeTab === 'advisory'
                    ? 'bg-emerald-600 text-white shadow-md scale-[1.02]'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <CloudRain className="w-4 h-4" />
                <span>Weather & Advisory (हवामान सल्ला)</span>
              </button>

              <button
                onClick={() => setActiveTab('profit')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center space-x-2 transition-all duration-300 cursor-pointer ${
                  activeTab === 'profit'
                    ? 'bg-emerald-600 text-white shadow-md scale-[1.02]'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-amber-300" />
                <span>Crop Profit (नफा शिफारस)</span>
              </button>
            </div>

            {/* C. DYNAMIC TAB VIEW DISPLAY */}
            {activeTab === 'advisory' ? (
              <div className="animate-fadeIn">
                <FarmerSimpleView
                  village={selectedVillage}
                  riskMetrics={riskMetrics}
                  onSelectCrop={(crop) => setSelectedCropForAdvisory(crop)}
                  currentLang={currentLang}
                />
              </div>
            ) : (
              <div className="animate-fadeIn">
                <CropProfitRecommendation
                  village={selectedVillage}
                  riskMetrics={riskMetrics}
                  onSelectCrop={(crop) => setSelectedCropForAdvisory(crop)}
                  currentLang={currentLang}
                />
              </div>
            )}

          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">
            Select a village to view climate risk advisory.
          </div>
        )}

      </main>

      {/* Floating AI Assistant Button & Chat Popup (Bottom Right) */}
      {selectedVillage && riskMetrics && (
        <FloatingAIAssistant
          village={selectedVillage}
          riskMetrics={riskMetrics}
          currentLang={currentLang}
        />
      )}

      {/* Simple Footer */}
      <footer className="bg-white border-t border-slate-200 py-5 px-4 text-center text-xs text-slate-500 mt-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span className="font-extrabold text-slate-800">KrishiDrishti AI</span>
            <span>— Simple AI Agriculture Climate Advisory</span>
          </div>
          <div>
            ICAR • IMD Baseline • CGWB Groundwater Data
          </div>
        </div>
      </footer>

      {/* Printable Report Modal */}
      {isReportModalOpen && (
        <PrintReportModal
          village={selectedVillage}
          riskMetrics={riskMetrics}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}

    </div>
  );
}
