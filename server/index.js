import express from 'express';
import cors from 'cors';
import { VILLAGES_DATABASE } from './data/villages.js';
import { calculateVillageClimateRisk } from './services/riskEngine.js';
import { generateAIAdvisory, answerKrishiMitrQuery } from './services/aiAdvisoryService.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'KrishiDrishti AI - Indian Agriculture Climate Risk Advisory',
    timestamp: new Date().toISOString()
  });
});

// 2. Hierarchy tree for State -> District -> Block -> Village Cascading Selectors
app.get('/api/villages/hierarchy', (req, res) => {
  const hierarchy = {};

  VILLAGES_DATABASE.forEach(v => {
    if (!hierarchy[v.stateName]) {
      hierarchy[v.stateName] = {};
    }
    if (!hierarchy[v.stateName][v.districtName]) {
      hierarchy[v.stateName][v.districtName] = {};
    }
    if (!hierarchy[v.stateName][v.districtName][v.blockName]) {
      hierarchy[v.stateName][v.districtName][v.blockName] = [];
    }
    hierarchy[v.stateName][v.districtName][v.blockName].push({
      id: v.id,
      name: v.villageName,
      pincode: v.pincode,
      crops: v.primaryCrops
    });
  });

  res.json({ hierarchy });
});

// 3. Search and filter villages
app.get('/api/villages', (req, res) => {
  const { q, state, district } = req.query;
  let results = VILLAGES_DATABASE;

  if (state) {
    results = results.filter(v => v.stateName.toLowerCase() === state.toLowerCase());
  }

  if (district) {
    results = results.filter(v => v.districtName.toLowerCase() === district.toLowerCase());
  }

  if (q) {
    const query = q.toLowerCase();
    results = results.filter(v =>
      v.villageName.toLowerCase().includes(query) ||
      v.districtName.toLowerCase().includes(query) ||
      v.stateName.toLowerCase().includes(query) ||
      v.blockName.toLowerCase().includes(query) ||
      v.pincode.includes(query) ||
      v.primaryCrops.some(c => c.toLowerCase().includes(query))
    );
  }

  res.json({
    count: results.length,
    villages: results
  });
});

// 4. Get specific village full climate risk analysis
app.get('/api/villages/:id', (req, res) => {
  const village = VILLAGES_DATABASE.find(v => v.id === req.params.id);
  if (!village) {
    return res.status(404).json({ error: 'Village not found' });
  }

  const riskMetrics = calculateVillageClimateRisk(village);

  res.json({
    village,
    riskMetrics
  });
});

// 5. Generate localized AI Advisory
app.post('/api/ai-advisory', (req, res) => {
  const { villageId, selectedCrop, lang } = req.body;
  const village = VILLAGES_DATABASE.find(v => v.id === villageId);

  if (!village) {
    return res.status(404).json({ error: 'Village not found' });
  }

  const riskMetrics = calculateVillageClimateRisk(village);
  const advisoryReport = generateAIAdvisory(village, riskMetrics, selectedCrop, lang);

  res.json({ advisoryReport });
});

// 6. Krishi Mitr AI Chatbot Query
app.post('/api/krishi-mitr/chat', (req, res) => {
  const { message, villageId } = req.body;
  const village = VILLAGES_DATABASE.find(v => v.id === villageId) || VILLAGES_DATABASE[0];

  const riskMetrics = calculateVillageClimateRisk(village);
  const reply = answerKrishiMitrQuery(message || '', village, riskMetrics);

  res.json({
    reply,
    villageName: village.villageName,
    districtName: village.districtName,
    timestamp: new Date().toISOString()
  });
});

// 7. Village Side-by-Side Comparison
app.post('/api/compare', (req, res) => {
  const { villageIds } = req.body;
  if (!Array.isArray(villageIds) || villageIds.length === 0) {
    return res.status(400).json({ error: 'Please provide array of villageIds' });
  }

  const comparison = villageIds.map(id => {
    const v = VILLAGES_DATABASE.find(item => item.id === id);
    if (!v) return null;
    const metrics = calculateVillageClimateRisk(v);
    return {
      village: v,
      riskMetrics: metrics
    };
  }).filter(Boolean);

  res.json({ comparison });
});

app.listen(PORT, () => {
  console.log(`[KrishiDrishti AI Server] Running on http://localhost:${PORT}`);
});
