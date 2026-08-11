import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import VillageSelector from './components/VillageSelector';
import PlatformImpactFeatures from './components/PlatformImpactFeatures';
import FarmerSimpleView from './components/FarmerSimpleView';
import CropProfitRecommendation from './components/CropProfitRecommendation';
import KrishiMitrChat from './components/KrishiMitrChat';
import FloatingAIAssistant from './components/FloatingAIAssistant';
import PrintReportModal from './components/PrintReportModal';

import { fetchHierarchy, fetchVillages, fetchVillageDetails } from './services/apiService';
import { Sprout, RefreshCw } from 'lucide-react';

export default function App() {
  const [allVillages, setAllVillages] = useState([]);
  const [hierarchy, setHierarchy] = useState({});
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [riskMetrics, setRiskMetrics] = useState(null);
  const [currentLang, setCurrentLang] = useState('mr'); // Default to Marathi
  const [selectedCropForAdvisory, setSelectedCropForAdvisory] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

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
            
            {/* A. EXPECTED OUTCOMES & CORE FEATURES HUB */}
            <PlatformImpactFeatures
              village={selectedVillage}
              riskMetrics={riskMetrics}
            />

            {/* B. HYPERLOCAL WEATHER & 4-STEP FARMER CROP ACTION PLAN */}
            <FarmerSimpleView
              village={selectedVillage}
              riskMetrics={riskMetrics}
              onSelectCrop={(crop) => setSelectedCropForAdvisory(crop)}
              currentLang={currentLang}
            />
            
            {/* C. TOP PROFIT CROPS RECOMMENDATION */}
            <CropProfitRecommendation
              village={selectedVillage}
              riskMetrics={riskMetrics}
              onSelectCrop={(crop) => setSelectedCropForAdvisory(crop)}
              currentLang={currentLang}
            />

            {/* D. KRISHI MITR AI CHAT ASSISTANT */}
            <KrishiMitrChat
              village={selectedVillage}
              riskMetrics={riskMetrics}
              currentLang={currentLang}
            />

          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">
            Select a village to view climate risk advisory.
          </div>
        )}

      </main>

      {/* Floating AI Assistant Button */}
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
