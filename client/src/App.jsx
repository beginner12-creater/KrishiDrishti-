import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import VillageSelector from './components/VillageSelector';
import RiskSummaryCards from './components/RiskSummaryCards';
import ClimateCharts from './components/ClimateCharts';
import CropVulnerabilityMatrix from './components/CropVulnerabilityMatrix';
import AIAdvisorySection from './components/AIAdvisorySection';
import InteractiveMap from './components/InteractiveMap';
import KrishiMitrChat from './components/KrishiMitrChat';
import VillageCompare from './components/VillageCompare';
import PrintReportModal from './components/PrintReportModal';
import FarmerSimpleView from './components/FarmerSimpleView';
import CropProfitRecommendation from './components/CropProfitRecommendation';
import BottomNavBar from './components/BottomNavBar';
import AIVoicePanelModal from './components/AIVoicePanelModal';

import { fetchHierarchy, fetchVillages, fetchVillageDetails } from './services/apiService';
import { Sprout, RefreshCw } from 'lucide-react';

export default function App() {
  const [allVillages, setAllVillages] = useState([]);
  const [hierarchy, setHierarchy] = useState({});
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [riskMetrics, setRiskMetrics] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'profit' | 'advisory' | 'map' | 'compare' | 'chat'
  const [viewMode, setViewMode] = useState('farmer'); // 'farmer' | 'detailed'
  const [currentLang, setCurrentLang] = useState('en');
  const [selectedCropForAdvisory, setSelectedCropForAdvisory] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isVoicePanelOpen, setIsVoicePanelOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Initial load of village database and hierarchy
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

  // 2. Load detailed analysis for a selected village
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

  const handleSelectCropForAdvisory = (cropName) => {
    setSelectedCropForAdvisory(cropName);
    setActiveTab('advisory');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950 pb-16 md:pb-0">
      
      {/* Top Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        activeVillage={selectedVillage}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenVoicePanel={() => setIsVoicePanelOpen(true)}
      />

      {/* Main Container Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        {/* Village Location Selector Banner */}
        <VillageSelector
          villages={allVillages}
          hierarchy={hierarchy}
          selectedVillage={selectedVillage}
          onSelectVillage={handleSelectVillage}
        />

        {loading ? (
          <div className="py-24 text-center">
            <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin mx-auto mb-4" />
            <h3 className="text-base font-bold text-slate-200">Loading Indian Agricultural Climate Database...</h3>
            <p className="text-xs text-slate-500 mt-1">Connecting to risk index calculator & agro-met forecast engine</p>
          </div>
        ) : selectedVillage && riskMetrics ? (
          <div>
            
            {/* FARMER SIMPLE MODE (DEFAULT EASY VIEW FOR FARMERS) */}
            {viewMode === 'farmer' ? (
              <div className="space-y-6">
                <FarmerSimpleView
                  village={selectedVillage}
                  riskMetrics={riskMetrics}
                  onSelectCrop={(crop) => setSelectedCropForAdvisory(crop)}
                />
                
                {/* Profit Maximizing Crop Suggestions */}
                <CropProfitRecommendation
                  village={selectedVillage}
                  riskMetrics={riskMetrics}
                  onSelectCrop={handleSelectCropForAdvisory}
                />
              </div>
            ) : (
              /* DETAILED AGRONOMIST MODE */
              <div>
                {/* TAB 1: DASHBOARD VIEW */}
                {activeTab === 'dashboard' && (
                  <div>
                    <RiskSummaryCards village={selectedVillage} riskMetrics={riskMetrics} />
                    <ClimateCharts village={selectedVillage} riskMetrics={riskMetrics} />
                    <CropVulnerabilityMatrix
                      village={selectedVillage}
                      riskMetrics={riskMetrics}
                      onSelectCropForAdvisory={handleSelectCropForAdvisory}
                    />
                  </div>
                )}

                {/* SEPARATE TAB 2: PROFIT CROPS */}
                {activeTab === 'profit' && (
                  <CropProfitRecommendation
                    village={selectedVillage}
                    riskMetrics={riskMetrics}
                    onSelectCrop={handleSelectCropForAdvisory}
                  />
                )}

                {/* TAB 3: AI ADVISORY VIEW */}
                {activeTab === 'advisory' && (
                  <AIAdvisorySection
                    village={selectedVillage}
                    riskMetrics={riskMetrics}
                    selectedCrop={selectedCropForAdvisory}
                    onSelectCrop={(crop) => setSelectedCropForAdvisory(crop)}
                  />
                )}

                {/* TAB 4: GEO MAP VIEW */}
                {activeTab === 'map' && (
                  <div>
                    <InteractiveMap village={selectedVillage} riskMetrics={riskMetrics} />
                    <RiskSummaryCards village={selectedVillage} riskMetrics={riskMetrics} />
                  </div>
                )}

                {/* TAB 5: COMPARE VILLAGES VIEW */}
                {activeTab === 'compare' && (
                  <VillageCompare
                    allVillages={allVillages}
                    defaultVillage={selectedVillage}
                  />
                )}

                {/* TAB 6: KRISHI MITR AI CHATBOT */}
                {activeTab === 'chat' && (
                  <KrishiMitrChat village={selectedVillage} riskMetrics={riskMetrics} />
                )}
              </div>
            )}

          </div>
        ) : (
          <div className="text-center py-20 text-slate-400">
            Select a village to view climate risk advisory.
          </div>
        )}

      </main>

      {/* YouTube-style Mobile Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenVoicePanel={() => setIsVoicePanelOpen(true)}
      />

      {/* Dedicated AI Voice Panel Modal */}
      {isVoicePanelOpen && (
        <AIVoicePanelModal
          village={selectedVillage}
          riskMetrics={riskMetrics}
          onClose={() => setIsVoicePanelOpen(false)}
        />
      )}

      {/* Footer Banner */}
      <footer className="glass-panel border-t border-slate-800/80 py-6 px-4 text-center text-xs text-slate-500 mb-12 md:mb-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-300">KrishiDrishti AI</span>
            <span>— AI Agricultural Climate Vulnerability & Resilience Platform</span>
          </div>
          <div>
            Data Sources: ICAR Agro-Climatic Zones • IMD Weather Baseline • Central Ground Water Board (CGWB)
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
