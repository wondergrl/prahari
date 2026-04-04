# Prahari 🛡️

> **प्रहरी** (Guardian in Sanskrit) - India's first hyperlocal parametric income insurance for food delivery workers

**Built by Syntax Squad for Guidewire DEVTrails 2026 Phase 2**

---

## 🎯 The Problem

**5 million delivery workers in India lose 20-30% of monthly income when bad weather hits.**

Current insurance treats entire cities as one zone. A worker 5km away from flooding gets denied because their "zone" is fine. Another worker drowns in income loss but can't claim because they're 2km from the weather station reading.

**It's broken. We're fixing it.**

---

## 💡 Our Solution

We divide cities into **500m micro-zones** using H3 hexagonal cells. Each zone has its own:
- Flood risk score
- Drainage quality assessment  
- Historical weather patterns
- Real-time trigger monitoring

**When heavy rain hits Zone V-23 specifically**, only workers in that zone get paid within 90 minutes. No forms. No waiting. Just data → payout.

Plus: **AI calculates fair premiums**. Safe zones pay less. High-risk zones pay more. No guessing, no flat rates.

---

## ⚡ Key Features

### 1. **Disruption Predictability Score** ⭐ (Our Unique Feature)
Workers see a 7-day forecast showing which days are safe for earning:
- **Monday & Tuesday**: 31-48% risk (Safe earning days)  
- **Wednesday**: 72% risk (High disruption - plan accordingly)
- Helps workers optimize their schedules around predicted disruptions

### 2. **AI-Powered Premium Calculation**
XGBoost ensemble with 3 weak learners analyzes:
- Zone flood history (3 years)
- Drainage quality & terrain
- Worker experience level
- 7-day weather forecast
- Zone-level claims history

**Result:** Personalized weekly premiums (₹39-89) instead of flat rates.

### 3. **5 Parametric Triggers** (Real-time monitoring)
Auto-activates when these events occur in worker's zone:
- 🌧️ **Heavy Rainfall** (>50mm/hr)
- 🌡️ **Extreme Heat** (>42°C)  
- 😷 **Severe AQI** (>300)
- 🌊 **Flash Flood Alert** (IMD warnings)
- 🚨 **Civic Disruption** (traffic + news analysis)

Polled every 15 minutes from OpenWeatherMap & AQICN APIs.

### 4. **6-Signal Fraud Detection**
Before auto-payout, we verify:
1. ✅ GPS confirms location in disrupted zone
2. ✅ Accelerometer shows active riding (not spoofing at home)
3. ✅ Cell towers independently verify location
4. ✅ Battery state realistic (not fully charged like spoofing rig)
5. ✅ Delivery app shows active session
6. ✅ Worker has delivery history in this zone

**Need 4+ signals green to auto-approve.** Fraud is harder than honest work.

### 5. **Zero-Touch Claims**
```
Disruption detected → GPS check → 6-signal stack → Auto-approved → UPI payout
```
**90 minutes. No forms. No calls. Just money.**

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│  Landing │ Register │ Dashboard │ Premium │ Triggers │ Claims│
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Core Engines (JS)                         │
│  • mlEngine.js      → XGBoost premium calculation            │
│  • fraudEngine.js   → 6-signal fraud detection               │
│  • premiumEngine.js → Dynamic pricing with multipliers       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  External APIs                               │
│  • OpenWeatherMap → Real-time weather & rainfall             │
│  • AQICN          → Air quality index monitoring             │
│  • IMD            → Flash flood alerts (mocked)              │
│  • Traffic APIs   → Civic disruption detection (mocked)      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ (tested on v24.13.1)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/wondergrl/prahari.git
cd prahari

# Install dependencies
npm install

# Start development server
npm start
```

App runs on **http://localhost:3001**

### Test Journey (2 minutes)

1. **Register** → Click "Get Started" → Complete 4-step onboarding
2. **Dashboard** → View your AI-calculated premium & Disruption Score
3. **Triggers** → See 5 real-time monitors → Click "Simulate Fire"
4. **Claims** → Run fraud detection simulation → Watch 6 signals verify
5. **Premium Calculator** → Adjust coverage tier → See price breakdown

---

## 📊 The Math

### Premium Tiers (Weekly)
| Tier | Cost | Max Payout/Day | Best For |
|------|------|----------------|----------|
| Basic | ₹39 | ₹500 | Part-time workers |
| Standard | ₹59 | ₹800 | Full-time workers |
| Premium | ₹89 | ₹1,100 | High earners |

**Each tier adjusts ±20% based on AI risk score.**

### Actuarial Health
- **Loss Ratio**: 41.9% (premiums paid out as claims)
- **Combined Ratio**: 69.9% (profitable, <100%)
- **Reserves**: 4.2 months (exceeds IRDAI 3-month mandate)

---

## 🎯 Why Prahari Wins

| Feature | Prahari | Competitors |
|---------|---------|-------------|
| **Granularity** | 500m micro-zones (H3) | City-level |
| **Premium** | AI-personalized per zone | Flat or generic |
| **Triggers** | 5 automated, zone-specific | Manual, city-wide |
| **Fraud Prevention** | 6-signal stack | GPS only |
| **Payout Speed** | <90 minutes, automatic | Days/weeks, manual |
| **Worker Insight** | Disruption Predictability Score | None |

---

## 🗂️ Project Structure

```
prahari/
├── src/
│   ├── pages/
│   │   ├── Landing.js           # Hero page with features
│   │   ├── Register.js          # 4-step worker onboarding
│   │   ├── Dashboard.js         # Home with Disruption Score
│   │   ├── Premium.js           # AI pricing calculator
│   │   ├── Policy.js            # Active policy & renewal
│   │   ├── Claims.js            # History + fraud simulation
│   │   ├── Triggers.js          # 5 real-time monitors
│   │   ├── MLModel.js           # XGBoost details & SHAP
│   │   ├── ZoneMap.js           # H3 hexagonal visualization
│   │   └── Exclusions.js        # Coverage terms
│   ├── components/
│   │   └── Navbar.js
│   ├── utils/
│   │   ├── mlEngine.js          # XGBoost ensemble (3 trees)
│   │   ├── premiumEngine.js     # Dynamic pricing logic
│   │   ├── fraudEngine.js       # 6-signal fraud detection
│   │   └── mockData.js          # Sample workers/claims
│   └── App.js                   # Main routing
├── public/
├── package.json
└── README.md
```

---

## 🛠️ Tech Stack

**Frontend**
- React 19 (Hooks + Context)
- Tailwind CSS (Dark mode support)
- Lucide React (Icons)
- React Router v6

**AI/ML**
- XGBoost (JavaScript simulation with 3 weak learners)
- SHAP values for explainability
- Gradient boosted decision trees

**APIs**
- OpenWeatherMap (Real-time weather)
- AQICN (Air quality monitoring)
- IMD Flash Flood Alerts (Mocked for demo)
- Traffic APIs (Mocked for demo)

**Deployment Ready**
- Vercel / Netlify compatible
- Firebase Firestore schema designed
- Razorpay test mode integrated

---

## 🎬 Features Walkthrough

### Disruption Predictability Score
<img width="1101" height="423" alt="image" src="https://github.com/user-attachments/assets/07a1f7ee-225e-4609-88a7-948b07bc2a28" />


Shows workers a 7-day forecast with:
- **Safe days** (green, <50% risk)
- **Caution days** (yellow, 50-70% risk)  
- **High risk days** (red, >70% risk)

**Smart Earning Plan callout**: "Wednesday has 72% disruption risk. Focus on Monday & Tuesday (31-48% risk) for guaranteed earning days."

### XGBoost Model Transparency
<img width="1761" height="372" alt="image" src="https://github.com/user-attachments/assets/b93e1156-e3dd-4af0-8fc5-2d77e6de8d81" />


Dashboard shows:
- 3 weak learner outputs
- Final ensemble risk score (0-1)
- Zone risk multiplier
- Worker history multiplier
- Feature importance via SHAP values

### Fraud Detection in Action
<img width="1919" height="859" alt="image" src="https://github.com/user-attachments/assets/c03c4a2e-348f-48ce-be1a-d8992cf8af83" />


Real-time verification:
- GPS: ✅ Verified (in disrupted zone)
- Accelerometer: ✅ Active riding pattern
- Cell Tower: ✅ Independent location match
- Battery: ✅ Realistic drain (68%)
- App Activity: ✅ Delivery session active
- Zone History: ✅ 47 past deliveries in zone

**Confidence: HIGH → Auto-approved**

---

## 🚧 Roadmap (Phase 3)

- [ ] Advanced anomaly detection for fraud rings
- [ ] Real Razorpay payment integration
- [ ] Insurer dashboard with predictive analytics
- [ ] Worker mobile app (React Native)
- [ ] Real-time earnings protection forecasts
- [ ] Integration with Zomato/Swiggy APIs
- [ ] SMS/WhatsApp trigger alerts

---

## 👥 Team: Syntax Squad

**5 beginner developers building for Guidewire DEVTrails 2026**

- Focus: Real-world problem solving over flashy tech
- Approach: Worker-first design, not AI-first
- Goal: Protect the income of India's delivery heroes

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🙏 Acknowledgments

- **Uber H3** for hexagonal indexing system
- **OpenWeatherMap** & **AQICN** for real-time data
- **Guidewire** for organizing DEVTrails 2026
- **India's 5M delivery workers** who inspired this project

---

## 📞 Contact

- **GitHub**: [@wondergrl](https://github.com/wondergrl)
- **Project**: [Prahari Repository](https://github.com/wondergrl/prahari)
- **Hackathon**: Guidewire DEVTrails 2026 Phase 2

---

**⭐ If you find this project useful, please star the repository!**

---

*Built with ❤️ by Syntax Squad | Protecting delivery heroes, one zone at a time*
