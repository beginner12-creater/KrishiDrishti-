import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import VillageSelector from './components/VillageSelector';
import PlatformImpactFeatures from './components/PlatformImpactFeatures';
import FarmerSimpleView from './components/FarmerSimpleView';
import CropProfitRecommendation from './components/CropProfitRecommendation';
import FloatingAIAssistant from './components/FloatingAIAssistant';
import PrintReportModal from './components/PrintReportModal';

import { fetchHierarchy, fetchVillages, fetchVillageDetails } from './services/apiService';
import { Sprout, RefreshCw, TrendingUp, CloudRain, Sun, Moon } from 'lucide-react';

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

  // Dark/Light Mode Theme & Hourly Climate Background Engine
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('krishidrishti_theme') === 'dark';
  });
  const [currentHour, setCurrentHour] = useState(() => new Date().getHours());

  // Sync hour of day every 60 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHour(new Date().getHours());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Sync dark mode class on HTML root element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('krishidrishti_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('krishidrishti_theme', 'light');
    }
  }, [isDarkMode]);

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

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Compute Dynamic Hourly Background Gradient & Hover Animations
  const getHourlyBackgroundGradient = () => {
    if (isDarkMode) {
      if (currentHour >= 5 && currentHour < 8) {
        return 'bg-gradient-to-br from-amber-950 via-slate-950 to-rose-950 text-slate-100'; // Sunrise Dark
      }
      if (currentHour >= 8 && currentHour < 17) {
        return 'bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 text-slate-100'; // Daytime Dark
      }
      if (currentHour >= 17 && currentHour < 20) {
        return 'bg-gradient-to-br from-purple-950 via-slate-950 to-amber-950 text-slate-100'; // Sunset Dark
      }
      return 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-slate-100'; // Night Dark
    } else {
      if (currentHour >= 5 && currentHour < 8) {
        return 'bg-gradient-to-br from-amber-100 via-rose-50 to-emerald-50 text-slate-900'; // Sunrise Light
      }
      if (currentHour >= 8 && currentHour < 17) {
        return 'bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 text-slate-900'; // Daytime Light
      }
      if (currentHour >= 17 && currentHour < 20) {
        return 'bg-gradient-to-br from-orange-100 via-purple-50 to-amber-50 text-slate-900'; // Sunset Light
      }
      return 'bg-gradient-to-br from-slate-200 via-indigo-50 to-slate-100 text-slate-900'; // Night Light
    }
  };

  return (
    <div className={`min-h-screen flex flex-col selection:bg-emerald-500 selection:text-white transition-colors duration-700 relative overflow-x-hidden ${getHourlyBackgroundGradient()}`}>
      
      {/* Dynamic Background Micro Particles / Hover Shimmer */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="w-[600px] h-[600px] rounded-full bg-emerald-500/20 blur-3xl absolute -top-40 -left-40 animate-pulse" />
        <div className="w-[500px] h-[500px] rounded-full bg-teal-500/20 blur-3xl absolute top-1/2 -right-40 animate-float" />
      </div>

      {/* 1. Minimal Top Header */}
      <Navbar
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        activeVillage={selectedVillage}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        currentHour={currentHour}
      />

      {/* 2. Main Minimalist 1-Page Layout */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6 relative z-10">
        
        {/* Village Selection Menu */}
        <VillageSelector
          villages={allVillages}
          hierarchy={hierarchy}
          selectedVillage={selectedVillage}
          onSelectVillage={handleSelectVillage}
          currentLang={currentLang}
          isDarkMode={isDarkMode}
        />

        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="w-9 h-9 text-emerald-500 animate-spin mx-auto mb-3" />
            <h3 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Loading Agricultural Database...</h3>
          </div>
        ) : selectedVillage && riskMetrics ? (
          <div className="space-y-6">
            
            {/* A. FEATURE SLIDE BAR & EXPECTED OUTCOMES */}
            <PlatformImpactFeatures
              village={selectedVillage}
              riskMetrics={riskMetrics}
              selectedCrop={selectedCropForAdvisory}
              isDarkMode={isDarkMode}
            />

            {/* B. MAIN DUAL VIEW NAVIGATION TABS (SIMPLE FARMER VIEW vs PROFIT ESTIMATOR) */}
            <div className={`p-1.5 rounded-2xl border flex items-center gap-2 shadow-xs transition-colors duration-300 ${
              isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <button
                onClick={() => setActiveTab('advisory')}
                className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  activeTab === 'advisory'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Sprout className="w-4 h-4 text-emerald-300 shrink-0" />
                <span className="truncate">Farmer Dashboard (शेतकरी माहिती)</span>
              </button>

              <button
                onClick={() => setActiveTab('profit')}
                className={`flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  activeTab === 'profit'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="truncate">Crop Profit Estimator (उत्पन्न गणित)</span>
              </button>
            </div>

            {/* C. ACTIVE VIEW TAB RENDERING */}
            {activeTab === 'advisory' ? (
              <FarmerSimpleView
                village={selectedVillage}
                riskMetrics={riskMetrics}
                selectedCrop={selectedCropForAdvisory}
                onSelectCrop={(crop) => setSelectedCropForAdvisory(crop)}
                currentLang={currentLang}
                isDarkMode={isDarkMode}
              />
            ) : (
              <CropProfitRecommendation
                village={selectedVillage}
                riskMetrics={riskMetrics}
                currentLang={currentLang}
                isDarkMode={isDarkMode}
              />
            )}

          </div>
        ) : (
          <div className="py-16 text-center text-slate-500 font-bold text-sm">
            Select a village above to begin analysis.
          </div>
        )}

      </main>

      {/* 3. FLOATING AI ASSISTANT CHATBOT */}
      <FloatingAIAssistant
        village={selectedVillage}
        riskMetrics={riskMetrics}
        currentLang={currentLang}
        isDarkMode={isDarkMode}
      />

      {/* 4. PRINT REPORT MODAL */}
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
