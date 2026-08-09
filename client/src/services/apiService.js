import { VILLAGES_DATABASE } from '../data/villages.js';
import { calculateVillageClimateRisk } from './riskEngine.js';
import { generateAIAdvisory, answerKrishiMitrQuery } from './aiAdvisoryService.js';

export async function fetchHierarchy() {
  try {
    const res = await fetch('/api/villages/hierarchy');
    if (res.ok) {
      const data = await res.json();
      if (data.hierarchy) return data.hierarchy;
    }
  } catch (e) {
    console.log('[KrishiDrishti AI] Client fallback active for hierarchy');
  }

  // Client-side fallback hierarchy
  const hierarchy = {};
  VILLAGES_DATABASE.forEach(v => {
    if (!hierarchy[v.stateName]) hierarchy[v.stateName] = {};
    if (!hierarchy[v.stateName][v.districtName]) hierarchy[v.stateName][v.districtName] = {};
    if (!hierarchy[v.stateName][v.districtName][v.blockName]) hierarchy[v.stateName][v.districtName][v.blockName] = [];
    hierarchy[v.stateName][v.districtName][v.blockName].push({
      id: v.id,
      name: v.villageName,
      pincode: v.pincode,
      crops: v.primaryCrops
    });
  });
  return hierarchy;
}

export async function fetchVillages(query = '') {
  try {
    const url = query ? `/api/villages?q=${encodeURIComponent(query)}` : '/api/villages';
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.villages) return data.villages;
    }
  } catch (e) {
    console.log('[KrishiDrishti AI] Client fallback active for villages');
  }

  // Client-side fallback filter
  if (!query) return VILLAGES_DATABASE;
  const q = query.toLowerCase();
  return VILLAGES_DATABASE.filter(v =>
    v.villageName.toLowerCase().includes(q) ||
    v.districtName.toLowerCase().includes(q) ||
    v.stateName.toLowerCase().includes(q) ||
    v.blockName.toLowerCase().includes(q) ||
    v.pincode.includes(q) ||
    v.primaryCrops.some(c => c.toLowerCase().includes(q))
  );
}

export async function fetchVillageDetails(villageId) {
  try {
    const res = await fetch(`/api/villages/${villageId}`);
    if (res.ok) {
      const data = await res.json();
      if (data.village && data.riskMetrics) return data;
    }
  } catch (e) {
    console.log('[KrishiDrishti AI] Client fallback active for village details');
  }

  // Client-side calculation fallback
  const village = VILLAGES_DATABASE.find(v => v.id === villageId) || VILLAGES_DATABASE[0];
  const riskMetrics = calculateVillageClimateRisk(village);
  return { village, riskMetrics };
}

export async function generateAdvisory(villageId, selectedCrop, lang = 'en') {
  try {
    const res = await fetch('/api/ai-advisory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ villageId, selectedCrop, lang })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.advisoryReport) return data.advisoryReport;
    }
  } catch (e) {
    console.log('[KrishiDrishti AI] Client fallback active for AI Advisory');
  }

  // Client-side AI advisory fallback
  const village = VILLAGES_DATABASE.find(v => v.id === villageId) || VILLAGES_DATABASE[0];
  const riskMetrics = calculateVillageClimateRisk(village);
  return generateAIAdvisory(village, riskMetrics, selectedCrop, lang);
}

export async function sendChatMessage(message, villageId) {
  try {
    const res = await fetch('/api/krishi-mitr/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, villageId })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.reply) return data.reply;
    }
  } catch (e) {
    console.log('[KrishiDrishti AI] Client fallback active for Chatbot');
  }

  // Client-side chatbot fallback
  const village = VILLAGES_DATABASE.find(v => v.id === villageId) || VILLAGES_DATABASE[0];
  const riskMetrics = calculateVillageClimateRisk(village);
  return answerKrishiMitrQuery(message || '', village, riskMetrics);
}

export async function compareVillages(villageIds) {
  try {
    const res = await fetch('/api/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ villageIds })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.comparison) return data.comparison;
    }
  } catch (e) {
    console.log('[KrishiDrishti AI] Client fallback active for comparison');
  }

  // Client-side comparison fallback
  return villageIds.map(id => {
    const v = VILLAGES_DATABASE.find(item => item.id === id);
    if (!v) return null;
    const metrics = calculateVillageClimateRisk(v);
    return { village: v, riskMetrics: metrics };
  }).filter(Boolean);
}
