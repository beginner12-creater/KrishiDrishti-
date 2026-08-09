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
import AuthModal from './components/AuthModal';

import { fetchHierarchy, fetchVillages, fetchVillageDetails } from './services/apiService';
import { t } from './data/translations';
import { Sprout, RefreshCw, ArrowLeft } from 'lucide-react';

export default function App() {
  const [allVillages, setAllVillages] = useState([]);
  const [hierarchy, setHierarchy] = useState({});
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [riskMetrics, setRiskMetrics] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'profit' | 'advisory' | 'map' | 'compare' | 'chat'
  const [viewMode, setViewMode] = useState('farmer'); // 'farmer' | 'detailed'
  const [currentLang, setCurrentLang] = useState('mr'); // Default to Marathi
  const [selectedCropForAdvisory, setSelectedCropForAdvisory] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);
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

  // Handle clicking "Get Full Advisory Guide" from Profit Cards or Crop Matrix
  const handleSelectCropForAdvisory = (cropName) => {
    setSelectedCropForAdvisory(cropName);
    setViewMode('detailed');
    setActiveTab('advisory');
  };

  const handleBackToFarmerHome = () => {
    setViewMode('farmer');
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-emerald-500 selection:text-white pb-16 md:pb-0">
      
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
        user={user}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={() => setUser(null)}
      />

      {/* Main Container Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        {/* Village Location Selector Banner */}
        <VillageSelector
          villages={allVillages}
          hierarchy={hierarchy}
          selectedVillage={selectedVillage}
          onSelectVillage={handleSelectVillage}
          currentLang={currentLang}
        />

        {loading ? (
          <div className="py-24 text-center">
            <RefreshCw className="w-10 h-10 text-emerald-600 animate-spin mx-auto mb-4" />
            <h3 className="text-base font-bold text-slate-800">Loading Indian Agricultural Climate Database...</h3>
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
                  currentLang={currentLang}
                />
                
                {/* Profit Maximizing Crop Suggestions */}
                <CropProfitRecommendation
                  village={selectedVillage}
                  riskMetrics={riskMetrics}
                  onSelectCrop={handleSelectCropForAdvisory}
                  currentLang={currentLang}
                />
              </div>
            ) : (
              /* DETAILED AGRONOMIST MODE */
              <div>
                
                {/* Prominent Back Button to Farmer Home on Every Sub-Tab */}
                <div className="mb-4">
                  <button
                    onClick={handleBackToFarmerHome}
                    className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-emerald-700 hover:bg-slate-100 font-extrabold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t('backToFarmerHome', currentLang)}</span>
                  </button>
                </div>

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
                    currentLang={currentLang}
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
                  <KrishiMitrChat
                    village={selectedVillage}
                    riskMetrics={riskMetrics}
                    currentLang={currentLang}
                  />
                )}
              </div>
            )}

          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">
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
        currentLang={currentLang}
      />

      {/* Footer Banner */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500 mb-12 md:mb-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-800">KrishiDrishti AI</span>
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

      {/* User Login Modal with Google Sign-In & Mobile OTP */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(loggedInUser) => setUser(loggedInUser)}
      />

    </div>
  );
}
