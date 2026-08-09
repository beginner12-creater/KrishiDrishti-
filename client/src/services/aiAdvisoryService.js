// AI Agricultural Advisory Generator Engine & Krishi Mitr Conversational Assistant with Official AI Integration

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

// OFFICIAL KRISHI MITR CONVERSATIONAL ENGINE
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
              text: `You are Krishi Mitr AI (कृषि मित्र), a warm, friendly, non-technical Indian digital agronomist for farmers in ${vName}, ${dName}, Maharashtra. 
              Crops in village: ${cropsStr}.

              STRICT RULES:
              1. Never mention or refer to Gemini, Google, or any underlying model name in your response. Identify purely as Krishi Mitr (कृषि मित्र).
              2. If the user's question is about agriculture, crops, how to grow any plant, seeds, saplings, weather, soil, fertilizers, pests, market rates, or government schemes, give a simple 4-step answer in warm Indian language.
              3. If the user asks a non-agricultural question (sports, movies, politics, coding, general trivia), politely decline in Indian language saying you only answer farming & agricultural questions.
              
              User Question: "${query}"`
            }]
          }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          // Strip any unexpected Gemini references
          return rawText.replace(/gemini/gi, 'Krishi Mitr AI').replace(/google/gi, 'Krishi Mitr');
        }
      }
    } catch (err) {
      console.warn("API call failed, switching to local Krishi Mitr Agro engine:", err);
    }
  }

  // LOCAL AGRO ENGINE (RUNS IF NO KEY IS SET OR AS INSTANT FALLBACK)

  // 1. FRIENDLY GREETINGS & DAILY GESTURES
  if (qLower.includes("how are you") || qLower.includes("kaise ho") || qLower.includes("kase aahat") || qLower.includes("कसे आहात") || qLower.includes("कैसे हो") || qLower.includes("how r u")) {
    return `Namaste Kisan Bhai! 🙏 I am doing great and feeling happy to talk to you! 😊 

How is your day going on your farm in ${vName}? How are your crops doing today? 🌾 Tell me, how can I help you today?`;
  }

  if (qLower.includes("hello") || qLower.includes("hi") || qLower.includes("hey") || qLower.includes("namaste") || qLower.includes("नमस्कार") || qLower.includes("नमस्ते") || qLower.includes("ram ram") || qLower.includes("राम राम")) {
    return `Namaste! Ram Ram Kisan Bhai! 🙏 Welcome! 😊 

I hope you and your family are healthy and happy today! Weather in ${vName} is looking good for farm work. What crop advice or help do you need today?`;
  }

  if (qLower.includes("good morning") || qLower.includes("subhashok") || qLower.includes("शुभ प्रभात") || qLower.includes("शुभ सकाळ")) {
    return `Good Morning Kisan Mitra! ☀️ Shubh Prabhat! 

May your hard work today bring a golden harvest to your farm in ${vName}! Have you checked your crop watering today? How can I assist you this morning?`;
  }

  if (qLower.includes("thank") || qLower.includes("dhanyawad") || qLower.includes("thanks") || qLower.includes("धन्यवाद") || qLower.includes("आभार")) {
    return `You are most welcome Kisan Bhai! 🙏 

It is my honor to help hard-working farmers like you. Feel free to ask me anytime about crops, water, or fertilizers. May God bless your harvest! 🌾✨`;
  }

  if (qLower.includes("who are you") || qLower.includes("your name") || qLower.includes("tumhi kon") || qLower.includes("तुम कौन हो") || qLower.includes("तू कोण आहेस")) {
    return `Namaste! 🙏 I am Krishi Mitr AI (कृषि मित्र) — your personal digital agronomist created to help farmers in ${vName} and across India with simple, practical crop advice!`;
  }

  // 2. SPECIFIC SEED VARIETY & SAPLING NURSERY ADVISORY ENGINE
  if (qLower.includes("seed") || qLower.includes("variety") || qLower.includes("sapling") || qLower.includes("nursery") || qLower.includes("बियाणे") || qLower.includes("वाण") || qLower.includes("रोप") || qLower.includes("बीज")) {
    let rawPlant = qLower.replace("seed", "").replace("variety", "").replace("sapling", "").replace("nursery", "").replace("best", "").replace("which", "").replace("type", "").replace("of", "").replace("for", "").replace("बियाणे", "").replace("वाण", "").replace("रोप", "").trim();
    const plantName = rawPlant ? (rawPlant.charAt(0).toUpperCase() + rawPlant.slice(1)) : "your crop";

    let seedRecommendation = "";
    if (plantName.toLowerCase().includes("cotton") || plantName.toLowerCase().includes("कापूस")) {
      seedRecommendation = "• Top Certified Seeds: PKV-028, Rashi 659 BG-II, or Ajit 155.\n• Germination Rate: Buy certified blue-tag seeds with 90%+ germination.";
    } else if (plantName.toLowerCase().includes("soybean") || plantName.toLowerCase().includes("सोयाबीन")) {
      seedRecommendation = "• Top Certified Seeds: Phule Samrudhi (KDS 753), JS 20-34, or MACS 1407.\n• Seed Treatment: Treat seeds with Rhizobium culture + Trichoderma (10g/kg).";
    } else if (plantName.toLowerCase().includes("tomato") || plantName.toLowerCase().includes("टोमॅटो")) {
      seedRecommendation = "• Top Hybrid Seeds & Saplings: Syngenta Abhinav, Arka Rakshak, or US 1080.\n• Sapling Tip: Buy 25-30 day old healthy nursery seedling saplings with 4-5 true leaves.";
    } else if (plantName.toLowerCase().includes("pomegranate") || plantName.toLowerCase().includes("डाळिंब")) {
      seedRecommendation = "• Top Graft Sapling Variety: Bhagwa (Super Bhagwa) tissue-culture graft saplings.\n• Nursery Tip: Purchase 9-12 month old certified disease-free air-layered saplings.";
    } else if (plantName.toLowerCase().includes("mango") || plantName.toLowerCase().includes("आंबा")) {
      seedRecommendation = "• Top Graft Saplings: Kesar Mango, Alphonso (Hapus), or Dasheri grafted saplings.\n• Sapling Tip: Plant 1-year old stone-grafted sapling during monsoon with 10m x 10m spacing.";
    } else {
      seedRecommendation = `• Top Certified Seeds & Hybrid Varieties: ICAR/MPKV Certified High-Yielding Hybrid Varieties for ${plantName}.\n• Seed Treatment: Treat seeds with Azotobacter & Trichoderma Viride (10g/kg) 24h before sowing.\n• Sapling Nursery Tip: Select 30-day-old vigorous saplings with strong root ball from government certified nursery.`;
    }

    return `Namaste Kisan Bhai! 🙏 Recommended **Seed Varieties & Sapling Guide** for **${plantName}** in ${vName}:

🌾 **Certified Seed Variety Recommendations (उत्तम बियाणे वाण)**:
${seedRecommendation}

💡 **Smart Nursery & Sowing Tips (महत्त्वाचा सल्ला)**:
1. Always purchase seeds/saplings from Government Krishi Vigyan Kendra (KVK) or licensed Krishi Seva Kendra to avoid spurious duplicate seeds.
2. Conduct a quick seed germination test in moist cloth before sowing in your field! 🌾✨`;
  }

  // 3. HOW TO GROW ANY PLANT TUTORIAL ENGINE
  if (qLower.includes("grow") || qLower.includes("plant") || qLower.includes("cultivate") || qLower.includes("उगवावे") || qLower.includes("लागवड") || qLower.includes("खेती")) {
    let rawPlant = qLower.replace("how to grow", "").replace("how to plant", "").replace("how to cultivate", "").replace("grow", "").replace("plant", "").replace("कसे उगवावे", "").replace("की खेती कैसे करें", "").trim();
    const plantName = rawPlant ? (rawPlant.charAt(0).toUpperCase() + rawPlant.slice(1)) : "your chosen plant";

    return `Namaste Kisan Bhai! 🙏 Here is a simple 4-step guide on **How to Grow ${plantName}** in ${vName}:

1. 🌍 Soil & Sun (माती व हवामान):
   - ${plantName} grows best in well-drained loamy or black soil with organic compost. Needs 6-8 hours of daily sunlight.

2. 🌱 Sowing & Seed Variety (बियाणे वाण व अंतर):
   - Use MPKV/ICAR certified hybrid seed varieties or healthy 30-day-old nursery saplings. Treat seeds with Trichoderma (10g/kg). Keep proper distance between rows.

3. 💧 Watering & Fertilizer (पाणी व खत):
   - Irrigate every 4-6 days using drip irrigation. Apply Organic FYM manure + 1% Potassium Nitrate during flowering.

4. 🐛 Insect Protection (कीड नियंत्रण):
   - Put yellow sticky traps in the field and spray 5% Organic Neem Water once every 15 days to keep pests away.

Your ${plantName} harvest will be healthy and profitable! 🌾✨`;
  }

  // 4. CHECK IF QUERY IS RELATED TO AGRICULTURE & FARMING
  const agriKeywords = [
    "crop", "farm", "weather", "rain", "water", "drought", "flood", "soil", "fertilizer", "urea", "dap",
    "pest", "bug", "disease", "spray", "insect", "mulch", "harvest", "sow", "seed", "mandi", "price",
    "profit", "yield", "acre", "hektare", "land", "jeevamrut", "organic", "cotton", "sugarcane", "soybean",
    "onion", "grapes", "pomegranate", "bajra", "rice", "paddy", "wheat", "turmeric", "mango", "cashew",
    "insurance", "pmfby", "subsidy", "kisan", "scheme", "helpline", "icar", "imd", "irrigation", "drip",
    "sprinkler", "monsoon", "kharif", "rabi", "summer", "temperature", "heatwave", "yellow", "leaf",
    "पेरणी", "पाणी", "खत", "फवारणी", "कीड", "रोग", "पिक", "शेती", "दुष्काळ", "पाऊस", "बाजारभाव", "उत्पन्न",
    "कापूस", "ऊस", "सोयाबीन", "कांदा", "द्राक्ष", "डाळिंब", "हळद", "बाजरी", "गहू", "विमा", "योजना", "अनुदान"
  ];

  const isAgriRelated = agriKeywords.some(kw => qLower.includes(kw));

  // IF QUESTION IS NON-AGRICULTURAL -> POLITELY DECLINE AND ASK FOR AGRI QUESTIONS
  if (!isAgriRelated) {
    return `Namaste Kisan Bhai! 🙏 I am Krishi Mitr (कृषि मित्र), a specialized Digital Farming & Agricultural AI Assistant. 

🌾 I can answer any question on:
1. Certified Seed Varieties & Nursery Saplings (e.g., "Best seed for Tomato", "Sapling variety for Mango")
2. How to grow any plant / crop / fruit / vegetable (e.g., "How to grow Tomato")
3. Rain, Weather & Drought Forecasts
4. Organic Jeevamrut & Fertilizers
5. Insect & Pest Control Sprays
6. Crop Profit & APMC Mandi Rates
7. Government Subsidies & PMFBY Insurance

Please ask me about seeds, saplings, or any crop question! 🚜✨`;
  }

  // 5. COMPREHENSIVE AGRICULTURAL KNOWLEDGE BASE ANSWERS

  // A. PROFIT & HIGH RETURN CROPS
  if (qLower.includes("profit") || qLower.includes("money") || qLower.includes("earn") || qLower.includes("income") || qLower.includes("नफा") || qLower.includes("कमाई")) {
    return `Namaste Farmer Brother! 🙏 In ${vName}, here is how you can earn maximum profit from your land without stress:

1. 🍇 High-Value Fruit Crops: If you plant Bhagwa Pomegranate or Grapes, you can earn ₹2 Lakh to ₹4 Lakh per acre every year!
2. 🌵 Dragon Fruit (Kamalam): Requires very little water, gives fruit for 20 years, and sells at high market rates.
3. 🌿 Smart Intercropping: Plant Turmeric with Maize or Onion with Cotton. If one crop has bad weather, the second crop protects your income!
4. 📱 APMC Mandi Tip: Always check market prices on your phone before selling so buyers give you top rates!`;
  }

  // B. ORGANIC & ZERO COST JEEVAMRUT
  if (qLower.includes("organic") || qLower.includes("jeevamrut") || qLower.includes("natural") || qLower.includes("जैविक") || qLower.includes("सेंद्रिय") || qLower.includes("zero cost")) {
    return `Namaste! 🙏 You can easily save ₹4,000 per acre on chemical fertilizers using simple home-made Jeevamrut:

1. 🥣 Home Recipe: Take 10kg fresh cow dung + 10 liters cow urine + 2kg jaggery (गुळ) + 2kg besan (बेसन) + 1 handful farm soil in 200 liters of water.
2. ⏳ Wait 2 Days: Stir it twice daily with a wooden stick for 2 days.
3. 💧 Give with Water: Give this Jeevamrut with your drip or watering channel twice a month. Your soil will become soft, fertile, and full of natural earthworms!`;
  }

  // DEFAULT AGRICULTURAL RESPONSE
  return `Namaste Farmer Brother! 🙏 For ${vName} (${dName}), overall agricultural conditions are good. 

Key Advice: Focus on Drip Irrigation, spray organic Neem extract for insect control, and call Kisan Helpline at 1800-180-1551 anytime for free agricultural advice! Ask me about certified seeds, saplings, or how to grow any plant! 🌾`;
}
