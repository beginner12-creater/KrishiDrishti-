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

// OUT-OF-THE-BOX SMART KRISHI MITR AI CONVERSATIONAL ENGINE
export function answerKrishiMitrQuery(query, village, riskMetrics) {
  const qLower = query.toLowerCase();
  const vName = village ? village.villageName : "your village";
  const dName = village ? village.districtName : "your district";
  const cropsStr = village ? village.primaryCrops.join(", ") : "Cotton, Soybean, Sugarcane, Pomegranate, Onion";
  const waterStatus = village ? village.groundwaterStatus : "Semi-Critical";
  const soilType = village ? village.soilType : "Medium Black Vertisol";

  // 1. PROFIT & HIGH RETURN CROPS (OUT-OF-THE-BOX PROFIT ADVICE)
  if (qLower.includes("profit") || qLower.includes("money") || qLower.includes("earn") || qLower.includes("income") || qLower.includes("नफा") || qLower.includes("कमाई")) {
    return `💰 Out-of-the-Box High Profit Strategy for ${vName}:
1. High-Value Horticulture: Shift 1-2 acres to Bhagwa Pomegranate ( Net Profit: ₹2.2 - ₹3.5 Lakhs/acre) or Export Grapes (Net Profit: ₹3.0 - ₹4.5 Lakhs/acre).
2. Dragon Fruit (Kamalam): Requires 60% less water than sugarcane, yields for 20+ years, Net Profit ₹3.5 - ₹5.0 Lakhs/acre.
3. High-Density Intercropping: Plant Turmeric + Maize or Onion + Cotton intercropping to double your income per acre.
4. Market Timing: Use e-NAM portal to check APMC mandi rates across ${dName} and avoid distress sales during peak harvest glut.`;
  }

  // 2. ORGANIC / ZERO COST NATURAL FARMING (JEEVAMRUT HACKS)
  if (qLower.includes("organic") || qLower.includes("jeevamrut") || qLower.includes("natural") || qLower.includes("जैविक") || qLower.includes("सेंद्रिय") || qLower.includes("zero cost")) {
    return `🌱 Out-of-the-Box Zero-Cost Natural Farming Hack for ${vName}:
1. 200-Litre Jeevamrut Formula: Mix 10kg Desi Cow Dung + 10L Cow Urine + 2kg Jaggery + 2kg Gram Flour (Besan) + 1 handful fertile farm soil in 200L water. Ferment for 48 hours.
2. Application: Apply via Drip or irrigation water twice a month. It multiplies beneficial soil micro-organisms by 100x and saves ₹4,000/acre on chemical urea/DAP!
3. Ghanjeevamrut Dry Fertilizer: Mix 100kg dried cow dung with 10L Jeevamrut, dry in shade, and use as basal dose before sowing.`;
  }

  // 3. WATER CONSERVATION & DRIP IRRIGATION HACKS
  if (qLower.includes("water") || qLower.includes("irrigation") || qLower.includes("drought") || qLower.includes("पाणी") || qLower.includes("सिंचन") || qLower.includes("दुष्काळ")) {
    return `💧 Smart Water-Saving Hacks for ${vName} (Groundwater: ${waterStatus}):
1. Sugarcane Trash Mulching: Spread 3-5 inches of dry sugarcane trash between rows. Reduces water evaporation by 45% and keeps soil 4°C cooler.
2. Anti-Transpirant Spray: Spray 1% Potassium Nitrate (KNO3) or 5% Kaolin clay during dry spells to close plant leaf stomata and prevent wilting.
3. Micro-Drip 55-80% Subsidy: Apply for PMKSY subsidy through your Tehsil Krishi Officer for 16mm inline drip laterals.
4. Khet Talav (Farm Pond): Construct a 30m x 30m plastic-lined farm pond to store 15-20 lakh liters of rainwater for emergency protective watering.`;
  }

  // 4. PEST CONTROL & INSECT HACKS (IPM BIOLOGY)
  if (qLower.includes("pest") || qLower.includes("disease") || qLower.includes("worm") || qLower.includes("bug") || qLower.includes("कीड") || qLower.includes("रोग") || qLower.includes("फवारणी")) {
    return `🐛 Smart Bio-Pest Control Advice for ${vName}:
1. Pink Bollworm in Cotton: Hang 8 Pheromone traps/acre. Spray 5% Neem Seed Kernel Extract (NSKE 50,000 PPM) at early stage.
2. Sucking Pests (Thrips/Whitefly): Install 10 Yellow Sticky Cards + 10 Blue Sticky Cards per acre. Cost is under ₹200/acre.
3. Biological Army: Release Trichogramma parasite cards (2 cards/acre) to destroy stem borer eggs naturally without harmful chemicals.
4. Organic Bio-Fungicide: Spray Trichoderma Viride (5g/L) + Pseudomonas fluorescens to prevent root rot & wilt.`;
  }

  // 5. GOVERNMENT SCHEMES & SUBSIDIES (PMFBY, PM-KISAN, KCC, PM KUSUM)
  if (qLower.includes("scheme") || qLower.includes("subsidy") || qLower.includes("pmfby") || qLower.includes("insurance") || qLower.includes("kisan") || qLower.includes("योजना") || qLower.includes("अनुदान") || qLower.includes("विमा")) {
    return `📜 Government Subsidies & Insurance Triggers for ${vName}:
1. PMFBY Crop Insurance 72h Rule: If unseasonal rain, hailstorm, or flood damages crops, report loss to insurance toll-free 1800-180-1551 or bank within 72 hours with photos.
2. PM-KUSUM Solar Water Pump: Get 90% government subsidy (Central 30% + State 60%) to install 3HP/5HP Solar Irrigation Pump.
3. KCC Kisan Credit Card: Get up to ₹3 Lakh crop loan at 4% effective interest rate with prompt repayment rebate.
4. SMAM Tractor Implement Subsidy: 40% to 50% subsidy for Rotavator, Seed Drill, and Harvesters via MahaDBT portal.`;
  }

  // 6. SOIL HEALTH & FERTILIZER MATH
  if (qLower.includes("soil") || qLower.includes("fertilizer") || qLower.includes("urea") || qLower.includes("dap") || qLower.includes("माती") || qLower.includes("खत")) {
    return `🌱 Soil Health & Fertilizer Dose Math for ${vName} (${soilType}):
1. Soil Carbon Boost: Incorporate green manure crop (Dhaincha / Sunnhemp) for 45 days before main crop, then plow into soil. Adds 15-20kg Nitrogen naturally.
2. Balanced NPK Ratio: Avoid excess Urea. Use 19:19:19 foliar spray (5g/L) at vegetative stage and 0:52:34 at flowering stage for 25% higher yield.
3. Micronutrient Trick: Apply Zinc Sulphate (25kg/ha) + Boron (10kg/ha) to stop blossom drop and fruit cracking.`;
  }

  // 7. CROP SELECTION & SOWING WINDOW
  if (qLower.includes("crop") || qLower.includes("sow") || qLower.includes("plant") || qLower.includes("पीक") || qLower.includes("पेरणी")) {
    return `🌾 Optimized Crop Strategy for ${vName} (${dName}):
Primary Crops: ${cropsStr}.
1. Delayed Monsoon Plan: If rain delays by 15 days, switch from long-duration crops to short-duration Bajra (Phule Maha Shakti), Soybean (JS 20-34), or Pigeonpea.
2. Intercropping Profit Formula: Cotton + Pigeonpea (6:1 ratio) or Soybean + Pigeonpea (4:2 ratio) provides double protection against weather failure!`;
  }

  // DEFAULT COMPREHENSIVE OUT-OF-THE-BOX ANSWER
  return `🌾 Out-of-the-Box Krishi Mitr Advisory for ${vName} (${dName}):
• Climate Vulnerability Index: ${riskMetrics ? riskMetrics.overallRiskScore : '45'}/100.
• Recommended Crop Strategy: Focus on high-profit alternative crops (${cropsStr}), install Drip Irrigation with 55% PMKSY subsidy, and apply 200L Jeevamrut to cut chemical fertilizer costs by ₹4,000/acre.
• Call Kisan Call Centre at 1800-180-1551 for free expert telephone advice!`;
}
