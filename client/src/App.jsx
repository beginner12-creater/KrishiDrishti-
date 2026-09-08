import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import VillageSelector from './components/VillageSelector';
import FarmContextIntake from './components/FarmContextIntake';
import PlatformImpactFeatures from './components/PlatformImpactFeatures';
import FarmerSimpleView from './components/FarmerSimpleView';
import CropProfitRecommendation from './components/CropProfitRecommendation';
import FarmerVoiceHomeView from './components/FarmerVoiceHomeView';
import FloatingAIAssistant from './components/FloatingAIAssistant';
import PrintReportModal from './components/PrintReportModal';
import WelcomeLanguageModal from './components/WelcomeLanguageModal';

import { fetchHierarchy, fetchVillages, fetchVillageDetails } from './services/apiService';
import { useLanguage } from './context/LanguageContext';
import { Sprout, RefreshCw, TrendingUp, Volume2, ShieldAlert } from 'lucide-react';

export default function App() {
  const { language, setLanguage, t } = useLanguage();

  const [allVillages, setAllVillages] = useState([]);
  const [hierarchy, setHierarchy] = useState({});
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [riskMetrics, setRiskMetrics] = useState(null);
  
  const [showWelcomeLangModal, setShowWelcomeLangModal] = useState(() => {
    return !localStorage.getItem('krishidrishti_lang');
  });

  const [selectedCropForAdvisory, setSelectedCropForAdvisory] = useState('Cotton');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('voice'); // 'voice' | 'advisory' | 'profit'

  // Global Mandatory Farm Context Intake State
  const [farmContext, setFarmContext] = useState({
    crop: 'Cotton',
    phenologyStage: 'Flowering & Pollination (46-75 Days)',
    soilType: 'Deep Black Clay (Regur)',
    acreage: 5.0
  });

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

  // Load initial hierarchy & default village (Yavatmal District)
  useEffect(() => {
    let isMounted = true;

    async function initializeData() {
      try {
        setLoading(true);
        const [hData, vList] = await Promise.all([
          fetchHierarchy(),
          fetchVillages()
        ]);

        if (!isMounted) return;

        setHierarchy(hData || {});
        setAllVillages(vList || []);

        if (vList && vList.length > 0) {
          const defaultV = vList.find(v => v.villageName?.includes('यवतमाळ') || v.villageName?.includes('Yavatmal')) || vList[0];
          const fullDetails = await fetchVillageDetails(defaultV.id);
          if (isMounted) {
            setSelectedVillage(fullDetails || defaultV);
            setRiskMetrics(fullDetails?.riskMetrics || null);
          }
        }
      } catch (err) {
        console.error('Failed to initialize platform data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initializeData();
    return () => { isMounted = false; };
  }, []);

  const handleSelectVillage = async (vObj) => {
    if (!vObj) return;
    try {
      setLoading(true);
      const fullDetails = await fetchVillageDetails(vObj.id);
      setSelectedVillage(fullDetails || vObj);
      setRiskMetrics(fullDetails?.riskMetrics || null);
    } catch (err) {
      console.error('Error fetching village details:', err);
      setSelectedVillage(vObj);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${
      isDarkMode
        ? 'bg-slate-950 text-slate-100'
        : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* 1. TOP STICKY NAVBAR WITH PROMINENT 3-BUTTON LANGUAGE SWITCHER */}
      <Navbar
        onOpenReportModal={() => setIsReportModalOpen(true)}
        activeVillage={selectedVillage}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(prev => !prev)}
        currentHour={currentHour}
      />

      {/* WELCOME LANGUAGE SELECTION MODAL (FIRST TIME USERS) */}
      {showWelcomeLangModal && (
        <WelcomeLanguageModal
          onSelectLanguage={(lang) => {
            setLanguage(lang);
            setShowWelcomeLangModal(false);
          }}
          isDarkMode={isDarkMode}
        />
      )}

      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-6 space-y-6">
        
        {/* 2. VILLAGE TELEMETRY & MANDATORY FARM CONTEXT INTAKE */}
        <VillageSelector
          allVillages={allVillages}
          hierarchy={hierarchy}
          selectedVillage={selectedVillage}
          onSelectVillage={handleSelectVillage}
          isDarkMode={isDarkMode}
        />

        {selectedVillage && (
          <FarmContextIntake
            farmContext={farmContext}
            onChangeFarmContext={setFarmContext}
            selectedCrop={selectedCropForAdvisory}
            onSelectCrop={setSelectedCropForAdvisory}
            isDarkMode={isDarkMode}
          />
        )}

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

            {/* B. MAIN 3 NAVIGATION TABS */}
            <div className={`p-1.5 rounded-2xl border flex items-center gap-1.5 shadow-md transition-colors duration-300 ${
              isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <button
                onClick={() => setActiveTab('voice')}
                className={`flex-1 min-h-[48px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                  activeTab === 'voice'
                    ? 'bg-amber-500 text-slate-950 shadow-lg scale-105'
                    : isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Volume2 className="w-4 h-4 text-slate-950 shrink-0 animate-bounce" />
                <span className="truncate">{t('voiceMode')}</span>
              </button>

              <button
                onClick={() => setActiveTab('advisory')}
                className={`flex-1 min-h-[48px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                  activeTab === 'advisory'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-emerald-300 shrink-0" />
                <span className="truncate">{t('decisionMode')}</span>
              </button>

              <button
                onClick={() => setActiveTab('profit')}
                className={`flex-1 min-h-[48px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                  activeTab === 'profit'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="truncate">{t('mandiMode')}</span>
              </button>
            </div>

            {/* C. ACTIVE VIEW TAB RENDERING */}
            {activeTab === 'voice' ? (
              <FarmerVoiceHomeView
                village={selectedVillage}
                riskMetrics={riskMetrics}
                farmContext={farmContext}
                onChangeFarmContext={setFarmContext}
                isDarkMode={isDarkMode}
              />
            ) : activeTab === 'advisory' ? (
              <FarmerSimpleView
                village={selectedVillage}
                riskMetrics={riskMetrics}
                selectedCrop={selectedCropForAdvisory}
                onSelectCrop={(crop) => {
                  setSelectedCropForAdvisory(crop);
                  setFarmContext(prev => ({ ...prev, crop }));
                }}
                farmContext={farmContext}
                onChangeFarmContext={setFarmContext}
                isDarkMode={isDarkMode}
              />
            ) : (
              <CropProfitRecommendation
                village={selectedVillage}
                riskMetrics={riskMetrics}
                onSelectCrop={(crop) => {
                  setSelectedCropForAdvisory(crop);
                  setFarmContext(prev => ({ ...prev, crop }));
                  setActiveTab('advisory');
                }}
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
