# Prahari — Hyperlocal Parametric Insurance for Food Delivery Workers

**Prahari** (प्रहरी) = Guardian in Sanskrit. We protect the income of India's food delivery workers during disruptions.

## The Problem

5 million delivery partners in India lose 20-30% of monthly income when bad weather hits. They can't work, they lose earnings, and they have **no safety net**. 

Existing insurance? It treats the entire city as one zone. Raju works 5km away from a waterlogging hotspot, but because his "zone" flooded somewhere, he gets no payout. Another worker drowns in income loss but can't claim because they're 2km away from the weather station reading. 

**It's broken.**

## Our Solution

We divide cities into **500m micro-zones** (H3 hexagonal cells). Each cell has its own flood risk score, drainage quality, terrain data. When heavy rain hits **Zone V-23 specifically**, workers in that zone get paid within 90 minutes. Workers elsewhere aren't affected.

Plus: we use ML to calculate fair premiums. Raju's zone is safe from flooding → he pays less than someone in a flood-prone area. No guessing. No flat rates.

## How It Works

**Worker Journey:**
1. Register (takes 2 minutes)
2. AI calculates your weekly premium based on your zone & experience
3. You get a policy with 5 parametric triggers
4. When extreme weather hits **your zone**:
   - System detects it (15-min polls from weather APIs)
   - Validates you're in that zone via GPS
   - Checks 6 fraud signals in parallel
   - Pays you automatically
5. Next week, renew (same process, premium might adjust based on weather forecast)

**No forms. No claim processing. Just data → payout.**

## What We Built

### Registration (Multi-step onboarding)
Workers sign up in 4 steps: personal info → work details → zone detection → review & activate. Saves their city, platform (Zomato/Swiggy), experience level, vehicle type, and preferred coverage tier.

### AI Premium Calculator
Uses XGBoost (gradient boosted trees) to calculate weekly premiums based on 10 factors:
- Zone flood history (3 years)
- Drainage quality  
- Terrain elevation
- Worker experience
- 7-day weather forecast
- Claims history (zone level)
- Plus adjustments for loyalty

**Example:** Raju gets ₹54/week instead of flat ₹59 because his zone is safer and he's experienced.

### 5 Parametric Triggers (Automated)
When these fire in a worker's zone, claims initiate automatically:
- Heavy Rainfall (>50mm/hr)
- Extreme Heat (>42°C)
- Severe AQI (>300)
- Flash Flood Alert (IMD warning)
- Civic Disruption (traffic anomalies + news keywords)

All pulled from real APIs (OpenWeatherMap, AQICN) every 15 minutes. Zone-specific, not city-wide.

### 6-Signal Fraud Detection
Before paying, we verify 6 independent signals:
1. GPS confirms worker is in the disrupted zone
2. Accelerometer shows they're actually riding (not at home spoofing location)
3. Cell towers independently verify location
4. Battery state is realistic (not fully charged like a spoofing rig)
5. Delivery app shows active session during the disruption
6. Worker has delivery history in this zone (not a stranger claiming false disruption)

**Need 4+ signals to auto-approve.** It's simple: harder to coordinate fraud than to do honest work.

### Zero-Touch Claims
Disruption detected → GPS check → 6-signal fraud stack → Auto-approved. UPI payout within 90 minutes. Worker doesn't do anything except receive money.

## Tech Stack

- **Frontend:** React + Tailwind CSS (runs on http://localhost:3001)
- **ML Engine:** JavaScript XGBoost simulation (gradient boosted trees with SHAP explainability)
- **APIs:** OpenWeatherMap, AQICN (real); traffic/news (mocked)
- **Deployment:** Ready for Vercel

## Running It

```bash
npm install
npm start
# Goes to http://localhost:3001
```

Quick walkthrough:
1. Click "Get Started"
2. Register as a delivery worker
3. Check Dashboard (see your AI-calculated premium and risk score)
4. Go to Triggers (see all 5 armed and monitoring)
5. Click "Simulate Fire" on any trigger to watch it activate
6. Go to Claims → run the fraud detection simulation
7. Watch all 6 signals light up green = auto-approved

## The Math

**Premiums** (Weekly)
- Basic: ₹39 (₹500 max payout per day)
- Standard: ₹59 (₹800 max payout per day)
- Premium: ₹89 (₹1,100 max payout per day)

Each adjusts based on AI risk score (zone safety, worker history, weather forecast).

**Actuarial Health**
- We pay out 41.9% of premiums as claims (healthy, < 60% target)
- Combined ratio is 69.9% (profitable, below 100%)
- Reserves exceed IRDAI 3-month mandate

## Why Prahari Wins

| | Prahari | Everyone Else |
|---|---|---|
| Granularity | 500m micro-zones | City-level |
| Premium | AI-personalized | Flat or generic |
| Triggers | 5 automated, zone-specific | Manual, city-wide |
| Fraud Check | 6-signal stack | GPS only |
| Payout | <90min, automatic | Days/weeks |

## File Structure

```
src/
├── pages/
│   ├── Landing.js
│   ├── Register.js (onboarding)
│   ├── Dashboard.js (home page + AI model)
│   ├── Premium.js (calculator)
│   ├── Policy.js (active policy & renewal)
│   ├── Claims.js (history + simulation)
│   ├── Triggers.js (monitoring & fire simulation)
│   ├── MLModel.js (model details, SHAP, actuarial metrics)
│   ├── ZoneMap.js
│   └── Exclusions.js
├── components/
│   └── Navbar.js
├── utils/
│   ├── mlEngine.js (XGBoost ensemble)
│   ├── premiumEngine.js (dynamic pricing)
│   ├── fraudEngine.js (6-signal detection)
│   └── mockData.js (mock workers, claims, triggers)
└── App.js
```

## Next Steps

**Phase 3** (coming soon):
- Advanced anomaly detection for fraud rings
- Real Razorpay payment integration
- Insurer dashboard with predictive analytics
- Worker app with earnings protection forecasts

---

Built by **Syntax Squad** for **Guidewire DEVTrails 2026**

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
