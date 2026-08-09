// AI Agricultural Advisory Generator Engine & Krishi Mitr Conversational Assistant with Detailed Multi-Pillar Knowledge Engine

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
    sowingRecommendation = `For ${primaryCrop} in ${village.villageName}, adopt short-duration, drought-tolerant certified seed varieties (e.g., DBW-303, JS 20-34, or Phule Samrudhi). Delay sowing by 10-14 days if monsoon onset is delayed by >2 weeks. Consider intercropping with Pigeonpea or Pearl Millet (2:1 ratio) to cushion climate risk.`;
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

// COMPREHENSIVE & DETAILED KRISHI MITR CONVERSATIONAL ENGINE FOR ALL TOPICS
export async function answerKrishiMitrQuery(query, village, riskMetrics) {
  const qLower = query.toLowerCase().trim();
  const vName = village ? village.villageName : "your village";
  const dName = village ? village.districtName : "your district";
  const cropsStr = village ? village.primaryCrops.join(", ") : "Cotton, Soybean, Sugarcane, Pomegranate, Onion";

  // Check for environment API Key
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || window.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are Krishi Mitr AI (कृषि मित्र), a highly knowledgeable, warm, empathetic digital agronomy expert and advisor for farmers in ${vName}, ${dName}, Maharashtra. 

              STRICT INSTRUCTIONS:
              1. Give a VERY DETAILED, COMPREHENSIVE, THOROUGH, AND COMPLETE EXPLANATION on the user's question.
              2. Include deep step-by-step guidance, exact numerical measurements (e.g. NPK ratios, seed spacing in cm, spray dosage in ml/liter, irrigation frequencies), certified seed varieties, soil testing pH values, and market APMC price tips.
              3. Organize your detailed answer using clear numbered sections, bold headers, and bullet points.
              4. Identify purely as Krishi Mitr AI. Do not mention any underlying AI model name.
              
              User Question: "${query}"`
            }]
          }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          return rawText.replace(/gemini/gi, 'Krishi Mitr AI').replace(/google/gi, 'Krishi Mitr');
        }
      }
    } catch (err) {
      console.warn("API call failed, switching to local detailed engine:", err);
    }
  }

  // LOCAL DETAILED KNOWLEDGE ENGINE (INSTANT COMPREHENSIVE FALLBACK)

  // 1. DETAILED PLANT GROWING & CULTIVATION TUTORIAL ENGINE
  if (qLower.includes("grow") || qLower.includes("plant") || qLower.includes("cultivate") || qLower.includes("उगवावे") || qLower.includes("लागवड") || qLower.includes("खेती")) {
    let rawPlant = qLower.replace("how to grow", "").replace("how to plant", "").replace("how to cultivate", "").replace("grow", "").replace("plant", "").replace("कसे उगवावे", "").replace("की खेती कैसे करें", "").trim();
    const plantName = rawPlant ? (rawPlant.charAt(0).toUpperCase() + rawPlant.slice(1)) : "your crop";

    return `Namaste Kisan Bhai! 🙏 Here is a **Complete & Detailed Guide on How to Cultivate ${plantName}** in ${vName} (${dName}):

1. 🌍 **Soil Selection & Field Preparation (माती व रान बांधणी)**:
   - Soil Type: Medium to deep well-drained black cotton soil or fertile sandy loam with pH range of 6.5 to 7.8.
   - Field Prep: Perform 2 deep ploughings followed by harrowing. Incorporate 5 tonnes/acre of well-decomposed Farm Yard Manure (FYM) or vermicompost 15 days before planting.

2. 🌱 **Certified Seed Varieties & Germination Treatment (उत्तम बियाणे वाण व बीजप्रक्रिया)**:
   - Top Varieties: Choose ICAR/MPKV certified high-yielding hybrid varieties suitable for Maharashtra climate.
   - Seed Treatment: Treat seeds with *Trichoderma Viride* (10g/kg seed) or *Azotobacter* + *PSB* bio-fertilizers 24 hours prior to sowing to safeguard against soil-borne seedling rot and wilt.
   - Spacing: Maintain 45 cm to 60 cm row-to-row spacing and 15 cm to 20 cm plant-to-plant spacing for optimum sunlight and aeration.

3. 💧 **Precision Irrigation & Drip Schedule (पाणी व्यवस्थापन)**:
   - Irrigation System: Shift to Drip Irrigation (saves 45% water & boosts yield by 30%).
   - Watering Frequency: Irrigate every 4 to 6 days during vegetative growth and every 2 to 3 days during flowering and fruit setting stages. Avoid waterlogging at all costs.

4. 🧪 **Balanced Fertilizer & Nutrient Management (खत व्यवस्थापन)**:
   - Basal Dose: Apply N:P:K in 50:25:25 kg/acre ratio during field preparation.
   - Foliar Sprays: Spray 1% 19:19:19 water-soluble fertilizer at 30 days and 0:52:34 + Boron (1g/liter) during flower initiation to stop blossom dropping.

5. 🐛 **Integrated Pest & Disease Control (कीड व रोग नियंत्रण)**:
   - Traps: Install 10 Yellow Sticky Cards per acre for sucking pests (Aphids, Thrips, Whiteflies) and Pheromone traps for moth larvae.
   - Organic Spray: Spray 5% Neem Seed Kernel Extract (NSKE) at early stage.
   - Chemical Control: If severe thrips attack occurs, spray *Fipronil 5% SC* (2 ml/liter) or *Imidacloprid* under expert guidance.

6. 📦 **Harvesting, Storage & Market Realization (काढणी व बाजार विक्री)**:
   - Harvest when fruits/grains reach optimum maturity (80-90% color change or moisture at 12%).
   - Grade your produce into A, B, C quality grades before sending to APMC Mandi to realize 15-20% higher market price! 🌾✨`;
  }

  // 2. DETAILED SEED VARIETY & NURSERY SAPLING GUIDE
  if (qLower.includes("seed") || qLower.includes("variety") || qLower.includes("sapling") || qLower.includes("nursery") || qLower.includes("बियाणे") || qLower.includes("वाण") || qLower.includes("रोप") || qLower.includes("बीज")) {
    let rawPlant = qLower.replace("seed", "").replace("variety", "").replace("sapling", "").replace("nursery", "").replace("best", "").replace("which", "").replace("type", "").replace("of", "").replace("for", "").replace("बियाणे", "").replace("वाण", "").replace("रोप", "").trim();
    const plantName = rawPlant ? (rawPlant.charAt(0).toUpperCase() + rawPlant.slice(1)) : "your crop";

    return `Namaste Kisan Bhai! 🙏 Here is the **Comprehensive Certified Seed & Sapling Guide** for **${plantName}** in ${vName}:

🌾 **1. Certified High-Yield Seed Varieties (प्रमाणित बियाणे वाण)**:
• **Cotton (कापूस)**: PKV-028, Rashi 659 BG-II, Ajit 155, or Ankur 3028 (Yield: 12-15 quintals/acre).
• **Soybean (सोयाबीन)**: Phule Samrudhi (KDS 753), JS 20-34, MACS 1407 (Drought & disease resistant).
• **Tomato (टोमॅटो)**: Syngenta Abhinav, Arka Rakshak, US 1080 (High heat tolerance & long shelf life).
• **Pomegranate (डाळिंब)**: Bhagwa (Super Bhagwa) tissue-culture graft saplings.
• **Mango (आंबा)**: Kesar Mango, Alphonso (Hapus) stone-graft saplings.

🌱 **2. Nursery Sapling Selection Criteria (रोपवाटिका रोप निवड)**:
• Age: Nursery seedling saplings should be 25-30 days old with 4-5 healthy green true leaves.
• Graft Quality: For fruit saplings, select 9-12 month old air-layered or stone-grafted saplings with a healthy graft union and disease-free root ball.

🧪 **3. Seed Germination Test & Treatment Protocol (बीजप्रक्रिया)**:
• Test: Wrap 100 seeds in a moist cotton cloth for 48 hours. If >85 seeds germinate, the seed batch is excellent.
• Fungicide Treatment: Treat seeds with *Carbendazim + Mancozeb* (2g/kg) or *Trichoderma Viride* (10g/kg) to eliminate seed-borne fungal spores. 🌾✨`;
  }

  // 3. DETAILED PROFIT & HIGH RETURN CROPS GUIDE
  if (qLower.includes("profit") || qLower.includes("money") || qLower.includes("earn") || qLower.includes("income") || qLower.includes("नफा") || qLower.includes("कमाई")) {
    return `Namaste Farmer Brother! 🙏 Detailed Income & Profit Plan for ${vName}:

1. 🍇 **High-Value Horticulture Crops (फळबाग शेती)**:
   - **Bhagwa Pomegranate / Grapes**: Net Profit ₹2.5 Lakh to ₹4 Lakh per acre per year after Year 3.
   - **Dragon Fruit (Kamalam)**: Initial investment recovers in 2 years; yields profit for 20 years with minimal water requirement.

2. 🌿 **High-Income Cash & Spice Crops (नगदी व मसाले पिके)**:
   - **Turmeric (हळद) & Ginger (आले)**: Net Profit ₹1.5 Lakh to ₹2.5 Lakh per acre with 8-9 month crop duration.

3. 🌾 **Multi-Crop Intercropping Strategy (बहुपीक पद्धत)**:
   - Sowing **Sugarcane + Onion / Garlic** or **Cotton + Turmeric** ensures dual crop revenue and protects against total loss from extreme weather events. 🌾✨`;
  }

  // 4. GENERAL DETAILED RESPONSE FOR ANY OTHER TOPIC
  return `Namaste Kisan Bhai! 🙏 Here is a **Detailed Agricultural & Technical Analysis** for ${vName} (${dName}):

1. 🌍 **Soil & Agronomic Baseline**: Soil organic carbon in ${vName} requires regular FYM amendment. Maintain balanced NPK application based on Soil Health Card data.
2. 💧 **Smart Water Management**: Adopt Drip Fertigation & Straw Mulching to reduce evapotranspiration losses by 35%.
3. 🛡️ **Risk Protection & Schemes**: Register on PMFBY crop insurance portal and report any localized crop damage within 72 hours via Toll-Free 1800-180-1551.

Feel free to ask me for detailed growing guides, seed recommendations, or pest spray math for any specific crop! 🌾✨`;
}
