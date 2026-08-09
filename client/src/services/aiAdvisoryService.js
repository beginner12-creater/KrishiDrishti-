// AI Agricultural Advisory Generator Engine (Client-side)

export function generateAIAdvisory(village, riskMetrics, selectedCrop = null, lang = "en") {
  const primaryCrop = selectedCrop || village.primaryCrops[0];
  const { overallRiskScore, subIndices } = riskMetrics;

  const isDroughtProne = subIndices.droughtIndex > 55;
  const isHeatProne = subIndices.heatwaveIndex > 60;
  const isFloodProne = subIndices.floodIndex > 55;

  const advisories = [];

  // Pillar 1: Crop Variety & Sowing Window Strategy
  let sowingRecommendation = "";
  if (isDroughtProne) {
    sowingRecommendation = `For ${primaryCrop} in ${village.villageName}, adopt short-duration, drought-tolerant varieties (e.g., DBW-303, JS 20-34, or Phule Samrudhi). Delay sowing by 10-14 days if monsoon onset is delayed by >2 weeks. Consider intercropping with Pigeonpea or Pearl Millet (2:1 ratio) to cushion climate risk.`;
  } else if (isFloodProne) {
    sowingRecommendation = `Select submergence-tolerant crop cultivars (e.g., Swarna-Sub1 for Paddy or waterlogging-resistant Maize hybrids). Prepare raised seedbeds (Broad Bed Furrow system) with deep drainage channels.`;
  } else {
    sowingRecommendation = `Opt for high-yielding certified seeds treated with Azotobacter and Trichoderma. Maintain optimum seed rate (30-35 kg/acre) and seed spacing to maximize canopy micro-climate resilience.`;
  }

  advisories.push({
    id: "p1-sowing",
    category: "Sowing & Variety Selection",
    icon: "Sprout",
    urgency: overallRiskScore > 70 ? "HIGH" : "MEDIUM",
    title: `Adaptive Crop & Sowing Strategy for ${primaryCrop}`,
    summary: sowingRecommendation,
    actionItems: [
      "Use certified climate-resilient seeds with 95%+ germination rate",
      "Treat seeds with Rhizobium / Trichoderma Viride (10g/kg seed) 24h prior to sowing",
      "Adopt line sowing with 45cm row spacing for enhanced aeration and soil moisture retention"
    ]
  });

  // Pillar 2: Micro-Irrigation & Water Conservation
  let waterStrategy = "";
  if (subIndices.droughtIndex > 50 || village.groundwaterStatus.includes("Critical") || village.groundwaterStatus.includes("Over-Exploited")) {
    waterStrategy = `Groundwater level is at ${village.groundwaterStatus}. Shift immediately from flood irrigation to Drip / Micro-sprinkler systems. Apply straw mulching (5 tonnes/ha) between rows to retain soil moisture by 35% and lower soil temperature by 4°C during peak heatwaves.`;
  } else {
    waterStrategy = `Follow Alternate Wetting & Drying (AWD) cycle. Irrigate only during critical growth stages (Tillering, Flowering, Grain Filling). Construct Farm Ponds (Khet Talav) for supplementary emergency protective irrigation.`;
  }

  advisories.push({
    id: "p2-water",
    category: "Smart Water Management",
    icon: "Droplets",
    urgency: isDroughtProne ? "CRITICAL" : "MEDIUM",
    title: "Precision Irrigation & Moisture Conservation",
    summary: waterStrategy,
    actionItems: [
      "Schedule irrigation strictly between 6 PM - 8 AM to minimize evapotranspiration losses",
      "Apply 1% Potassium Nitrate (KNO3) foliar spray during dry spells to enhance stomatal control",
      "Leverage 55% PMKSY government subsidy for micro-irrigation installation"
    ]
  });

  // Pillar 3: Soil Health & Stress Management
  advisories.push({
    id: "p3-soil",
    category: "Soil Health & Nutrient Management",
    icon: "Mountain",
    urgency: "MEDIUM",
    title: "Organic Carbon & Micronutrient Replenishment",
    summary: `Current soil organic carbon is ${village.organicCarbon} in ${village.soilType}. Soil degradation reduces water-holding capacity. Apply 5 tonnes of Farm Yard Manure (FYM) or Neem-coated compost per hectare along with Bio-char amendment.`,
    actionItems: [
      "Incorporate Zinc Sulphate (25 kg/ha) and Boron (10 kg/ha) to prevent heat-induced pollen sterility",
      "Practice zero-tillage or shallow conservation tillage to prevent soil compaction",
      "Incorporate green manure crops (Dhaincha / Sunnhemp) prior to main crop season"
    ]
  });

  // Pillar 4: Integrated Pest & Disease Alert (IPM)
  let pestAlert = "";
  if (subIndices.pestIndex > 65) {
    pestAlert = `High temperature and relative humidity favor pest outbreaks (${village.majorHazards.join(", ")}). Immediate preventative pest surveillance required in ${village.villageName}.`;
  } else {
    pestAlert = `Moderate pest threat monitored. Standard IPM practices and sticky traps recommended.`;
  }

  advisories.push({
    id: "p4-pest",
    category: "Pest & Disease Advisory",
    icon: "Bug",
    urgency: subIndices.pestIndex > 65 ? "HIGH" : "LOW",
    title: "Integrated Pest Management (IPM) Warning",
    summary: pestAlert,
    actionItems: [
      "Install yellow and blue sticky traps (10 traps/acre) & Pheromone traps for early pest detection",
      "Spray 5% Neem Seed Kernel Extract (NSKE) at early crop stage as a bio-repellent",
      "Avoid excess Nitrogen fertilizer application which attracts sucking pests during humid spells"
    ]
  });

  // Pillar 5: PMFBY Crop Insurance & Government Scheme Triggers
  advisories.push({
    id: "p5-finance",
    category: "Insurance & Scheme Guidance",
    icon: "ShieldAlert",
    urgency: "HIGH",
    title: "PMFBY Insurance Claim & Subsidy Triggers",
    summary: `Based on predicted weather anomalies in ${village.districtName} district, farmers are advised to update their PMFBY crop insurance enrolment before cut-off date. Extreme rainfall or >21 consecutive dry days trigger localized calamity payouts under PMFBY guidelines.`,
    actionItems: [
      "Notify insurance representative or CSC within 72 hours of localized flood/drought damage",
      "Apply for Sub-Mission on Agricultural Mechanization (SMAM) 40% subsidy for tractor implements",
      "Register on PM-KISAN portal for direct financial safety-net transfers"
    ]
  });

  return {
    villageId: village.id,
    villageName: village.villageName,
    districtName: village.districtName,
    stateName: village.stateName,
    primaryCrop,
    generatedAt: new Date().toISOString(),
    overallRiskScore,
    advisories
  };
}

// GEMINI-STYLE FRIENDLY, WARM, EMPATHETIC, NON-TECHNICAL CONVERSATIONAL ENGINE
export function answerKrishiMitrQuery(query, village, riskMetrics) {
  const qLower = query.toLowerCase();
  const vName = village ? village.villageName : "your village";
  const dName = village ? village.districtName : "your district";
  const cropsStr = village ? village.primaryCrops.join(", ") : "Cotton, Soybean, Sugarcane, Pomegranate, Onion";

  // 1. PROFIT & HIGH RETURN CROPS (GEMINI STYLE)
  if (qLower.includes("profit") || qLower.includes("money") || qLower.includes("earn") || qLower.includes("income") || qLower.includes("नफा") || qLower.includes("कमाई")) {
    return `Namaste Farmer Brother! 🙏 In ${vName}, here is how you can earn maximum profit from your land without stress:

1. 🍇 High-Value Fruit Crops: If you plant Bhagwa Pomegranate or Grapes, you can earn ₹2 Lakh to ₹4 Lakh per acre every year!
2. 🌵 Dragon Fruit (Kamalam): Requires very little water, gives fruit for 20 years, and sells at high market rates.
3. 🌿 Smart Intercropping: Plant Turmeric with Maize or Onion with Cotton. If one crop has bad weather, the second crop protects your income!
4. 📱 APMC Mandi Tip: Always check market prices on your phone before selling so buyers give you top rates!`;
  }

  // 2. ORGANIC / ZERO COST NATURAL FARMING (GEMINI STYLE)
  if (qLower.includes("organic") || qLower.includes("jeevamrut") || qLower.includes("natural") || qLower.includes("जैविक") || qLower.includes("सेंद्रिय") || qLower.includes("zero cost")) {
    return `Namaste! 🙏 You can easily save ₹4,000 per acre on chemical fertilizers using simple home-made Jeevamrut:

1. 🥣 Home Recipe: Take 10kg fresh cow dung + 10 liters cow urine + 2kg jaggery (गुळ) + 2kg besan (बेसन) + 1 handful farm soil in 200 liters of water.
2. ⏳ Wait 2 Days: Stir it twice daily with a wooden stick for 2 days.
3. 💧 Give with Water: Give this Jeevamrut with your drip or watering channel twice a month. Your soil will become soft, fertile, and full of natural earthworms!`;
  }

  // 3. WATER CONSERVATION & DRIP IRRIGATION HACKS (GEMINI STYLE)
  if (qLower.includes("water") || qLower.includes("irrigation") || qLower.includes("drought") || qLower.includes("पाणी") || qLower.includes("सिंचन") || qLower.includes("दुष्काळ")) {
    return `Namaste! 🙏 Water is precious in ${vName}. Here are 3 simple ways to keep your crops green during hot dry weather:

1. 🌾 Cover Soil (Mulching): Spread dry sugarcane leaves or grass between crop rows. It stops water from evaporating in the hot sun and keeps roots cool!
2. 💧 Water in Evening: Always water your crops after 6 PM or early morning when the sun is gentle.
3. 🏛️ Government Drip Subsidy: Get 55% to 80% money back from government for installing Drip Irrigation. It saves half your water!`;
  }

  // 4. PEST CONTROL & INSECT HACKS (GEMINI STYLE)
  if (qLower.includes("pest") || qLower.includes("disease") || qLower.includes("worm") || qLower.includes("bug") || qLower.includes("कीड") || qLower.includes("रोग") || qLower.includes("फवारणी")) {
    return `Namaste! 🙏 Stop dangerous insects before they hurt your crops in ${vName}:

1. 🪤 Sticky Paper Cards: Put yellow and blue sticky cards in your field. Sucking pests get stuck automatically for under ₹150!
2. 🌿 Organic Neem Spray: Boil 5kg Neem seeds or leaves in water and spray on crops. Insects hate the bitter taste and fly away!
3. 🪱 Pheromone Traps: Put 8 Pink Bollworm traps per acre in cotton fields to catch adult moths early!`;
  }

  // 5. GOVERNMENT SCHEMES & SUBSIDIES (GEMINI STYLE)
  if (qLower.includes("scheme") || qLower.includes("subsidy") || qLower.includes("pmfby") || qLower.includes("insurance") || qLower.includes("kisan") || qLower.includes("योजना") || qLower.includes("अनुदान") || qLower.includes("विमा")) {
    return `Namaste! 🙏 Here are the top government benefits every farmer in ${vName} should use:

1. 🛡️ 72-Hour Crop Insurance Rule: If heavy rain or hailstorm damages your crop, call toll-free 1800-180-1551 or inform your bank within 72 hours with mobile photos to get insurance compensation.
2. ☀️ Solar Pump Subsidy: Get 90% government subsidy on solar water pumps under PM-KUSUM scheme!
3. 💳 Kisan Credit Card (KCC): Get low-interest crop loan at just 4% interest rate per year.`;
  }

  // 6. SOIL HEALTH & FERTILIZER MATH (GEMINI STYLE)
  if (qLower.includes("soil") || qLower.includes("fertilizer") || qLower.includes("urea") || qLower.includes("dap") || qLower.includes("माती") || qLower.includes("खत")) {
    return `Namaste! 🙏 Keep your farm soil healthy and productive in ${vName}:

1. 🛑 Avoid Excess Urea: Too much urea makes crops weak and attracts insects. Use balanced organic compost and Neem-coated urea.
2. 🧄 Zinc & Boron Spray: Spraying a small dose of Zinc and Boron stops flower dropping and fruit cracking!
3. ☘️ Green Manure: Sow Dhaincha or Sunnhemp before your main crop to naturally double soil fertility.`;
  }

  // 7. CROP SELECTION & SOWING WINDOW (GEMINI STYLE)
  if (qLower.includes("crop") || qLower.includes("sow") || qLower.includes("plant") || qLower.includes("पीक") || qLower.includes("पेरणी")) {
    return `Namaste! 🙏 Best crops for ${vName} (${dName}):

Main Crops: ${cropsStr}.
1. ☀️ Delayed Rain Strategy: If monsoon is late, sow short-duration crops like Bajra, Soybean, or Turmeric which need less rain.
2. 🌾 Double Protection: Always plant 2 crops together (like Cotton + Turmeric). If weather damages one, the second crop saves your harvest!`;
  }

  // DEFAULT FRIENDLY GEMINI RESPONSE
  return `Namaste Farmer Brother! 🙏 In ${vName} (${dName}), overall climate weather is stable today. 

Key Advice: Focus on Drip Irrigation, spray organic Neem extract for insect control, and call Kisan Helpline at 1800-180-1551 anytime for free agricultural advice!`;
}
