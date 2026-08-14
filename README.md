# 🌾 KrishiDrishti AI (कृषिदृष्टी AI)
> **Indian Agriculture Climate Risk & Profit Advisory Platform**  
> *Hyperlocal Climate Risk Intelligence, ISRO Bhuvan Satellite Feeds, APMC Mandi Rates, and Cell Tower Emergency SMS Geo-Broadcast.*

[![Live Demo](https://img.shields.io/badge/Production_Live-https%3A%2F%2Frishidrishti--ai.vercel.app-emerald?style=for-the-badge&logo=vercel)](https://rishidrishti-ai.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-KrishiDrishti-- Repository-blue?style=for-the-badge&logo=github)](https://github.com/beginner12-creater/KrishiDrishti-)
[![License](https://img.shields.io/badge/License-MIT-teal?style=for-the-badge)](LICENSE)

---

## 🌐 Live Application & GitHub Repository
- 🚀 **Live Production Application**: [https://rishidrishti-ai.vercel.app](https://rishidrishti-ai.vercel.app)
- 🐙 **GitHub Source Repository**: [https://github.com/beginner12-creater/KrishiDrishti-](https://github.com/beginner12-creater/KrishiDrishti-)

---

## 🌟 Key Platform Features

### 1. 📍 Hyperlocal Micro-Climate Village Intelligence
- Cascading hierarchy selection for **States, Districts, Blocks/Talukas, and Villages** across India.
- Quick search by **Village Name, Taluka, District, Pincode, or Crop**.

### 2. 🌧️ Real-Time Weather REST API Integration
- 100% live satellite weather feed powered by **Open-Meteo REST API**.
- Fetches live **Temperature (°C)**, **Precipitation Probability (%)**, **Wind Speed (km/h)**, and **Weather Condition Descriptions**.

### 3. 🛰️ ISRO Bhuvan & RISAT-1A Satellite Feeds
- Village-specific micro-climate sensor calculations:
  - **Soil Moisture (%)**
  - **Normalized Difference Vegetation Index (NDVI)**
  - **Land Surface Temperature (LST °C)**
  - **Radar Backscatter (dB)**

### 4. 📡 Cell Tower Geo-Broadcast SMS Alert Hub
- Automatically connects to nearest **BSNL / Jio 4G LTE cell tower grid** (e.g. `BSNL-JIO-MH-402`).
- Calculates signal strength (`-64 dBm`) and connected farmer handsets in 15 km coverage radius.
- Includes **User Mobile Device Verification** (enter 10-digit phone number to receive live API transaction SMS logs & WebPush notifications).
- Pre-built emergency Marathi SMS templates for **Heavy Rain**, **Pest Spray Alerts**, **Heatwaves**, and **Mandi Prices**.

### 5. 💰 Dynamic Regional APMC Mandi Price Calculator
- Real-time market prices, daily trend percentages (`+2.4% / -1.1%`), and Government Minimum Support Prices (MSP) tailored per crop and district APMC yards.

### 6. 🌾 100% Crop-Specific 4-Step Advisory Plans
- Step-by-step ICAR-certified advisory guides for **all major crops**:
  - ☁️ **Cotton (कापूस)**
  - 🫘 **Soybean (सोयाबीन)**
  - 🍇 **Dragon Fruit / Kamalam (कमलम)**
  - 🔴 **Pomegranate (डाळिंब)**
  - 🟡 **Turmeric (हळद)**
  - 🧅 **Onion (कांदा)**
  - 🍇 **Grapes (द्राक्ष)**
  - 🌾 **Bajra (बाजरी)**
  - 🌾 **Wheat (गहू)**
  - 🌾 **Rice (तांदूळ)**
  - 🎋 **Sugarcane (ऊस)**
- Covers 4 critical areas: **1. Water Management**, **2. Soil & Fertilizer Spray**, **3. Insect & Pest Control**, **4. PMFBY Crop Insurance Claim**.

### 7. 📈 AI Crop Profit Maximizer
- Net profit per acre calculations (`₹ 1,80,000 - ₹ 3,20,000 / Acre`).
- Mobile-optimized **4-crop stage pagination** line bar.
- Instant **Advisory Guide Modal Popup** on every crop card.

### 8. 📊 Clean Inline Expected Outcomes Reports
- Inline yield protection metrics (`+35% Yield Saved`, `Zero Disaster Loss`, `100% PMFBY Safety Net`) with zero intrusive popup alert dialogs.

### 9. 🌓 Hourly Background Rotator & Dark/Light Mode
- Auto-rotates ambient background gradients based on local hour (Sunrise 5-8 AM, Daytime 8 AM-5 PM, Sunset 5-8 PM, Night 8 PM-5 AM).
- Sun/Moon theme switcher with persistent dark mode contrast.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 + Vite |
| **Styling & Design System** | TailwindCSS + Vanilla CSS HSL Glassmorphic System |
| **Icons** | Lucide React |
| **Backend API** | Node.js + Express.js (Vercel Serverless Functions) |
| **Live Weather API** | Open-Meteo REST API (Free Satellite Forecast) |
| **SMS Gateway API** | Fast2SMS REST API / Cell Tower Geo-Broadcast Gateway |
| **Deployment Platform** | Vercel Production Infrastructure |

---

## 📁 Repository Directory Structure

```text
climate-risk-india/
├── api/
│   └── index.js                      # Vercel Serverless Express API Handler
├── client/
│   ├── index.html                    # Single Page Web App Entry
│   ├── package.json                  # Client Dependencies (React, Vite, Lucide)
│   └── src/
│       ├── App.jsx                   # Main React App Container & Hourly Theme Engine
│       ├── main.jsx                  # React DOM Renderer
│       ├── components/
│       │   ├── Navbar.jsx            # Top Navigation Bar & Dark/Light Toggle
│       │   ├── VillageSelector.jsx   # Micro-Climate Village Cascade Dropdown
│       │   ├── FarmerSimpleView.jsx  # 4-Step Crop Advisory & Live Weather
│       │   ├── CropProfitRecommendation.jsx # AI Crop Profit Estimator & Modal
│       │   ├── PlatformImpactFeatures.jsx   # ISRO Feed, Features & Inline Outcomes
│       │   └── CellTowerSMSBroadcastModal.jsx # Cell Tower SMS Broadcast Engine
│       ├── data/
│       │   ├── villages.js           # Comprehensive Indian Villages Database
│       │   └── translations.js       # Multilingual Dictionary
│       └── services/
│           └── realtimeApiService.js # Open-Meteo & Fast2SMS REST API Integrations
├── server/
│   ├── index.js                      # Express Dev Server
│   ├── data/                         # Server Data Files
│   └── services/                     # Climate Physics & AI Risk Calculator Engines
├── README.md                         # Project Documentation
└── vercel.json                       # Vercel Deployment Configuration
```

---

## 🚀 Local Development Setup Guide

### 1. Clone the GitHub Repository:
```bash
git clone https://github.com/beginner12-creater/KrishiDrishti-.git
cd KrishiDrishti-
```

### 2. Install Client Dependencies:
```bash
cd client
npm install
```

### 3. Run Development Dev Server:
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Build Production Bundle:
```bash
npm run build
```

---

## 📄 License
This project is licensed under the MIT License — feel free to use and contribute to agricultural climate safety in India!

---
*Created with ❤️ for Indian Farmers & Climate Resilience.*
