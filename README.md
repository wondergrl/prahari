# 🛡️ Prahari — Hyperlocal Parametric Income Insurance for Food Delivery Workers

> *Prahari (प्रहरी) — Sanskrit/Hindi for "Guardian." We guard the income of India's food delivery workers, one micro-zone at a time.*

---

## 🚨 The Problem

India has over 5 million food delivery partners working for Zomato and Swiggy. When extreme weather hits — heavy rain, floods, severe heat — these workers cannot ride and lose 20–30% of their monthly income overnight.

**But here is the broken reality of existing solutions:**

When the IMD declares "heavy rainfall in Bangalore," the entire city gets treated as one disrupted zone. In reality, the Koramangala underpass floods while Indiranagar 5km away is perfectly rideable. A worker near the underpass loses their entire day's income. A worker in Indiranagar does not.

Yet both pay the same premium. Both get the same (non-existent) payout. That is not insurance — that is a lottery.

**Prahari fixes this with hyperlocal micro-zone intelligence.**

---

## 💡 Our Unique Angle — Micro-Zone Insurance

Most platforms insure at the city level. **Prahari insures at the 500m × 500m hexagonal grid cell level.**

Every delivery zone in a city is divided into hexagonal micro-cells. Each cell has its own:
- Historical flood/waterlogging risk score
- Drainage quality index
- Altitude and terrain data
- Road blockage frequency
- Past disruption event history

A worker's weekly premium and payout eligibility is tied to **their specific cell**, not the city average. A worker in a historically safe zone pays less. A worker in a flood-prone zone pays slightly more — but gets faster, more accurate payouts when disruption hits their exact zone.

**This is the first parametric insurance platform in India to operate at sub-pincode resolution.**

---

## 👤 Persona — The Prahari User

**Name:** Raju, 28, Zomato delivery partner, Bengaluru  
**Earnings:** ₹800–1,100/day across 8–10 hours of active delivery  
**Zone:** Operates within a 3–4km radius from his home in Velachery  
**Problem:** Every monsoon, 2–3 days per month are completely lost due to waterlogging near his pickup zones  
**Current safety net:** None  

### User Scenarios

**Scenario 1 — Heavy Rain Event**  
It is a Tuesday evening. IMD issues a heavy rainfall warning for Chennai. Prahari's trigger monitor detects that Raju's micro-zone (Cell V-23, Velachery) has recorded 58mm of rainfall in the past hour — crossing the trigger threshold of 50mm. Raju's GPS confirms he was active in that zone. Within 90 minutes, ₹320 is credited to his UPI wallet automatically. No form. No claim. No waiting.

**Scenario 2 — Extreme Heat Advisory**  
A heat wave pushes temperatures to 44°C in Raju's zone. The trigger fires automatically. Since Raju opted for the heat coverage add-on during onboarding, he receives a partial payout for the hours he could not safely ride.

**Scenario 3 — Unplanned Curfew/Bandh**  
A local strike closes roads in Raju's zone for 6 hours. Prahari detects zone-level traffic anomaly via the traffic API and cross-references a news API for curfew confirmation. Claim is auto-initiated.

---

## 🗺️ Application Workflow

```
Worker Onboarding
      ↓
Zone Mapping (GPS auto-detects worker's primary delivery micro-zone)
      ↓
Risk Profiling (AI scores the zone: flood history, terrain, drainage)
      ↓
Weekly Policy Creation (dynamic premium shown, worker pays via UPI)
      ↓
Active Coverage Period (7 days)
      ↓
Real-Time Trigger Monitoring (weather + traffic + news APIs polled every 15 mins)
      ↓
Disruption Detected in Worker's Zone?
      ├── YES → GPS validation → Fraud check → Auto claim initiated → Instant UPI payout
      └── NO  → Coverage continues, monitoring resumes
      ↓
End of Week → Policy renewal prompt → New premium calculated
```

---

## 💰 Weekly Premium Model

Prahari uses a **dynamic AI-driven weekly pricing model** structured as follows:

### Base Premium
| Coverage Tier | Weekly Premium | Max Weekly Payout |
|---|---|---|
| Basic | ₹39/week | ₹500/disruption day |
| Standard | ₹59/week | ₹800/disruption day |
| Premium | ₹89/week | ₹1,100/disruption day |

### Dynamic Adjustment Factors (AI-driven)

The final premium = Base Premium × Zone Risk Multiplier × Worker History Score

| Factor | Effect on Premium |
|---|---|
| Zone Risk Score (low) | −₹5 to −₹12/week |
| Zone Risk Score (high) | +₹5 to +₹15/week |
| No claims in last 4 weeks | −₹8/week loyalty discount |
| New worker (no history) | Neutral — starts at base |
| Adverse weather forecast next 7 days | +₹3 to +₹10/week |

### Example
Raju operates in Zone V-23 (medium risk). He is on Standard tier (₹59 base). His zone risk multiplier is 1.05. He has had no claims in 3 weeks (−₹8 discount). His premium this week = ₹59 × 1.05 − ₹8 = **₹53.95 → rounded to ₹54/week.**

---

## ⚡ Parametric Triggers (5 Auto-Triggers)

These are the only events that initiate a claim. All are **loss of income triggers only** — no health, vehicle, or accident coverage.

| Trigger | Threshold | Data Source |
|---|---|---|
| Heavy Rainfall | > 50mm/hr in worker's micro-zone | OpenWeatherMap API |
| Extreme Heat | > 42°C sustained for 2+ hours | OpenWeatherMap API |
| Severe Pollution (AQI) | AQI > 300 in zone | AQICN free API |
| Flash Flood / Waterlogging Alert | IMD alert for worker's district | IMD RSS feed / mock |
| Civic Disruption (Curfew/Bandh) | Zone-level traffic anomaly + news keyword match | Mock traffic API + NewsAPI |

### Why Hyperlocal Triggers Beat City-Level Triggers
Standard insurance fires when "Chennai has heavy rain." Prahari fires only when **Cell V-23 specifically** crosses the threshold. This means:
- Fewer false payouts (workers in unaffected zones do not get paid)
- Fewer missed payouts (workers in affected zones always get paid)
- Fraud is structurally harder (GPS must confirm presence in disrupted cell)

---

## 🤖 AI/ML Integration Plan

### 1. Dynamic Premium Calculation (Risk Scoring Model)
- **Input features:** Zone flood history (3 years), terrain elevation, drainage complaints data, historical claim frequency per cell, 7-day weather forecast
- **Model:** Gradient Boosted Trees (XGBoost) — lightweight, explainable, fast to train
- **Output:** Zone Risk Score (0.8 to 1.4 multiplier on base premium)
- **Retraining:** Weekly, as new weather and claim data comes in

### 2. Fraud Detection Model
- **GPS validation:** Worker's GPS coordinates during disruption window must fall within the triggered micro-zone. Spoofing detection via movement pattern analysis (stationary phone claiming active delivery = flagged)
- **Anomaly detection:** Isolation Forest model flags claims that deviate from the worker's historical pattern
- **Duplicate prevention:** Hash-based deduplication on worker ID + zone ID + event timestamp
- **Cross-reference check:** Claim event must match an active trigger event in the system — no trigger, no claim

### 3. Predictive Risk Modelling
- 7-day ahead weather risk forecast per zone displayed on worker dashboard
- Workers can see "High disruption risk next week" and pre-activate coverage accordingly
- Insurer admin dashboard shows predicted claim volume for next week based on weather models

---

## 🧰 Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | React.js + Tailwind CSS | Fast to build, responsive, easy to demo |
| Backend | Node.js + Express | Lightweight REST APIs |
| Database | Firebase Firestore | Real-time, free tier, zero setup |
| Auth | Firebase Auth | Simple OTP-based login (fits gig workers) |
| Zone Mapping | Google Maps API + H3 (Uber's hex grid library) | H3 provides hexagonal micro-zone cells natively |
| Weather Triggers | OpenWeatherMap API (free tier) | Real weather data, no cost |
| AQI Trigger | AQICN API (free tier) | Real AQI data for Indian cities |
| Traffic/Civic Trigger | Mock API (simulated JSON) | Acceptable per problem statement |
| Payment Simulation | Razorpay Test Mode | Real sandbox, no actual transactions |
| ML Models | Python (scikit-learn / XGBoost) | Lightweight models, served via Flask microservice |
| Hosting | Vercel (frontend) + Render (backend) | Free tier, instant deployment |

---

## 📱 Platform Justification — Web (Mobile-Responsive)

We chose a **web-first, mobile-responsive** platform over a native mobile app for the following reasons:

1. **Demo-ability:** Judges can access the platform instantly via a URL — no APK install, no App Store approval
2. **Development speed:** A React web app with responsive design covers both desktop (admin/insurer dashboard) and mobile (worker interface) in a single codebase
3. **Real-world fit:** Zomato/Swiggy workers already use web-based tools on their phones via browser; a PWA (Progressive Web App) approach means the web app can be added to the home screen and behaves like a native app
4. **API integration ease:** Weather, maps, and payment APIs all have clean JavaScript SDKs

---

## 🗓️ Development Plan

### Phase 1 (March 4–20) — Ideation & Foundation ✅
- [x] Problem research and persona definition
- [x] Hyperlocal micro-zone concept design
- [x] Tech stack selection
- [x] Weekly premium model design
- [x] Parametric trigger definition
- [x] README and architecture documentation

### Phase 2 (March 21 – April 4) — Automation & Protection
- [ ] Worker registration and onboarding flow
- [ ] Zone detection via GPS + H3 hex grid
- [ ] AI risk scoring model (XGBoost) — initial version
- [ ] Dynamic weekly premium calculator
- [ ] Insurance policy creation and management
- [ ] 3–5 automated parametric triggers integrated
- [ ] Claims management module
- [ ] Basic fraud detection (GPS validation + duplicate check)

### Phase 3 (April 5–17) — Scale & Optimise
- [ ] Advanced fraud detection (Isolation Forest anomaly model + GPS spoofing detection)
- [ ] Instant payout simulation via Razorpay test mode
- [ ] Worker dashboard (earnings protected, coverage status, next-week risk forecast)
- [ ] Insurer/admin dashboard (loss ratios, predictive analytics, zone-level heat maps)
- [ ] Final pitch deck
- [ ] 5-minute demo video with simulated disruption event

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Delivery Partner                      │
│              (Zomato / Swiggy Rider)                     │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│               Prahari Web App (React)                    │
│   Onboarding │ Policy Management │ Dashboard │ Claims    │
└──────┬───────────────┬──────────────────┬───────────────┘
       │               │                  │
┌──────▼──────┐ ┌──────▼──────┐  ┌───────▼───────┐
│  AI Risk    │ │   Trigger   │  │    Fraud      │
│  Engine     │ │   Monitor   │  │   Detector    │
│  (XGBoost)  │ │  (15-min    │  │  (Isolation   │
│             │ │   polling)  │  │   Forest)     │
└──────┬──────┘ └──────┬──────┘  └───────┬───────┘
       │               │                  │
┌──────▼───────────────▼──────────────────▼───────────────┐
│                   External APIs                          │
│  OpenWeatherMap │ AQICN │ Mock Traffic │ Razorpay Test   │
└─────────────────────────────────────────────────────────┘
       │
┌──────▼──────────────────────────────────────────────────┐
│           Analytics Dashboard                            │
│   Worker View: Coverage status, payouts, risk forecast   │
│   Admin View: Loss ratios, zone heat maps, predictions   │
└─────────────────────────────────────────────────────────┘
```

---

## 🌟 Why Prahari Wins

| Feature | Everyone Else | Prahari |
|---|---|---|
| Insurance granularity | City-level | 500m micro-zone level |
| Premium pricing | Flat or basic zone | AI-driven per-cell risk score |
| Trigger accuracy | City-wide weather event | Cell-specific threshold crossing |
| Fraud resistance | Basic checks | GPS-in-zone proof required |
| Payout speed | Days/weeks | Under 90 minutes, automatic |
| Worker experience | Fill a form | Zero-touch, fully automatic |

---
## 👥 Team — Syntax Squad

| Name | Role |
|---|---|
| Diya S Raj | Team Lead & Product Strategist |
| Midhila M | Frontend Developer (React UI) |
| Amrita Raj | Backend Developer (Node.js + APIs) |
| Gowtham Sreekumar | AI/ML Engineer (Risk Model + Fraud Detection) |
| Vaishnav S N | Full Stack + DevOps (Firebase + Deployment) |

---

## 📎 Links

- **GitHub Repository:** *(this repo)*
- **Demo Video (Phase 1):** *[Add YouTube/Drive link here]*

---


