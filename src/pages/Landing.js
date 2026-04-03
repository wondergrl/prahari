import React, { useState, useEffect, useRef } from 'react';
import {
  Shield, CloudRain, Thermometer, Wind, Waves, AlertTriangle,
  ArrowRight, CheckCircle, Users, Zap, MapPin, Star, ChevronDown,
  Play, Clock, TrendingUp, Award
} from 'lucide-react';

const TRIGGERS = [
  { icon: CloudRain,    label: 'Heavy Rainfall',     threshold: '>50mm/3hr',  payout:'₹500–1,100', color:'blue',   desc:'Monsoon flooding events' },
  { icon: Thermometer,  label: 'Extreme Heat',        threshold: '>42°C',      payout:'₹500–1,100', color:'red',    desc:'Summer heatwave days' },
  { icon: Wind,         label: 'Severe AQI',          threshold: '>300 AQI',   payout:'₹500–1,100', color:'purple', desc:'Hazardous air quality' },
  { icon: Waves,        label: 'Flash Flood',          threshold: 'IMD Alert',  payout:'₹500–1,100', color:'cyan',   desc:'District-level flood alerts' },
  { icon: AlertTriangle,label: 'Civic Disruption',    threshold: 'Detected',   payout:'₹500–1,100', color:'amber',  desc:'Bandh / curfew events' },
];

const STATS = [
  { value:'₹39',    label:'Starting premium',  sub:'per week'        },
  { value:'90min',  label:'Payout speed',       sub:'post trigger'    },
  { value:'500m',   label:'Zone precision',     sub:'H3 hexagon'      },
  { value:'0',      label:'Claims to file',     sub:'fully automatic' },
];

const STEPS = [
  { n:'01', title:'Register in 4 steps',     body:'Aadhaar eKYC, vehicle type, city zone selection — done in under 3 minutes.' },
  { n:'02', title:'Zone auto-detected',       body:'GPS pins your 500m H3 hexagonal micro-zone. AI calculates your personalised weekly premium.' },
  { n:'03', title:'Coverage starts',          body:'UPI payment deducted. Policy active immediately. All 5 triggers armed.' },
  { n:'04', title:'Trigger fires → payout',   body:'Parametric data confirmed → UPI payout in 90 minutes. Zero forms, zero calls.' },
];

const TIERS = [
  { name:'Basic',    price:39,  payout:500,  color:'gray',   features:['All 5 triggers','500m zone','UPI payout','Basic SHAP report'] },
  { name:'Standard', price:59,  payout:800,  color:'orange', features:['All 5 triggers','500m zone','UPI payout','Full SHAP report','Priority queue'], popular:true },
  { name:'Premium',  price:89,  payout:1100, color:'amber',  features:['All 5 triggers','500m zone','UPI payout','Full SHAP report','Priority queue','₹200 medical add-on'] },
];

const TEAM = [
  'Syntax Squad', 'Guidewire DEVTrails 2026 — Phase 2',
];

function TriggerCard({ icon: Icon, label, threshold, payout, color, desc, delay }) {
  const colorMap = {
    blue:   'bg-blue-500/10   border-blue-500/20   text-blue-400',
    red:    'bg-red-500/10    border-red-500/20    text-red-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    cyan:   'bg-cyan-500/10   border-cyan-500/20   text-cyan-400',
    amber:  'bg-amber-500/10  border-amber-500/20  text-amber-400',
  };
  return (
    <div className={`glass-card p-5 border ${colorMap[color]} group hover:scale-105 transition-all duration-300`}
         style={{animationDelay:`${delay}ms`}}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colorMap[color]}`}>
        <Icon size={20} />
      </div>
      <div className="font-syne font-bold text-sm mb-1">{label}</div>
      <div className="text-xs text-gray-400 mb-3">{desc}</div>
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${colorMap[color]}`}>{threshold}</span>
        <span className="text-xs text-gray-400">→ <span className="text-orange-400 font-bold">{payout}</span></span>
      </div>
    </div>
  );
}

// Animated counter hook
function useCounter(end, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
}

export default function Landing({ navigate, dark }) {
  const [triggered, setTriggered] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.3 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  // Live trigger simulation
  useEffect(() => {
    const t = setTimeout(() => setTriggered(true), 3000);
    return () => clearTimeout(t);
  }, []);

  const bg = dark ? 'dark:bg-[#0a0d1a]' : 'bg-gray-50';

  return (
    <div className={`min-h-screen ${bg} hex-bg`}>

      {/* ── TOP NAV ── */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b ${dark ? 'bg-[#0a0d1a]/85 border-white/6' : 'bg-white/90 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center glow-sm">
              <Shield size={15} className="text-white" />
            </div>
            <span className="font-syne font-bold text-lg">Prahari</span>
            <span className={`hidden sm:inline text-xs px-2 py-0.5 rounded-full ml-1 ${dark ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-orange-50 text-orange-600 border border-orange-200'}`}>
              प्रहरी
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`hidden md:block text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Syntax Squad · DEVTrails 2026</span>
            <button onClick={() => navigate('register')} className="btn-primary btn-sm text-sm">
              Get Covered — ₹39/week
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative max-w-7xl mx-auto px-4 pt-20 pb-16 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-10 pointer-events-none"
          style={{background:'radial-gradient(ellipse, rgba(249,115,22,0.6) 0%, transparent 70%)'}} />

        <div className="relative text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8
            bg-orange-500/10 border border-orange-500/20 text-orange-400">
            <div className="live-dot" />
            <span>Live parametric insurance · India's first 500m micro-zone coverage</span>
          </div>

          <h1 className="font-syne text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
            Your income,
            <br />
            <span className="gradient-text">protected by data.</span>
          </h1>

          <p className={`text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
            Prahari insures Zomato & Swiggy delivery workers against income loss from rain, heat,
            floods, AQI, and curfews — at <strong className="text-orange-400">500m hexagonal precision</strong>.
            No claims. Just triggers.
          </p>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button onClick={() => navigate('register')}
              className="btn-primary text-base px-8 py-4 group">
              Start Coverage
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => navigate('ml')}
              className="btn-ghost text-base px-8 py-4 flex items-center gap-2">
              <Play size={16} />
              See AI Model
            </button>
          </div>

          {/* Live trigger demo */}
          <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-2xl text-sm transition-all duration-700
            ${triggered
              ? 'bg-green-500/10 border border-green-500/30 text-green-400'
              : dark ? 'bg-white/5 border border-white/10 text-gray-400' : 'bg-gray-100 border border-gray-200 text-gray-500'
            }`}>
            {triggered ? (
              <>
                <div className="live-dot" />
                <span className="font-medium">Trigger fired: Heavy rain detected in V-23 Velachery</span>
                <span className="font-bold">→ ₹800 payout initiated</span>
              </>
            ) : (
              <>
                <Clock size={14} className="animate-spin" style={{animationDuration:'2s'}} />
                <span>Monitoring 500m zones across 10 cities…</span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section ref={statsRef} className={`py-12 border-y ${dark ? 'border-white/5 bg-white/2' : 'border-gray-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((s, i) => (
              <div key={i} className="group">
                <div className="font-syne text-4xl font-extrabold gradient-text mb-1">{s.value}</div>
                <div className={`font-medium text-sm ${dark ? 'text-white' : 'text-gray-900'}`}>{s.label}</div>
                <div className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-4">The Problem</div>
            <h2 className="font-syne text-3xl sm:text-4xl font-bold mb-6 leading-tight">
              5 million workers.<br />
              <span className="gradient-text">Zero income protection.</span>
            </h2>
            <div className={`text-base leading-relaxed ${dark ? 'text-gray-300' : 'text-gray-600'} space-y-4`}>
              <p>
                India's food delivery workers earn ₹15,000–25,000/month, but one rainstorm can wipe out
                an entire day's income. When AQI spikes or a flood alert fires, they stop working —
                but their expenses don't stop.
              </p>
              <p>
                Existing insurance ignores gig workers, or offers city-level coverage so broad it's
                useless. <strong className="text-orange-400">Prahari is different</strong> — we insure at
                the 500m hexagonal micro-zone, so Raju in Velachery isn't grouped with someone in
                Guindy just because they're in "Chennai."
              </p>
            </div>
          </div>

          {/* Worker card — Raju */}
          <div className={`glass-card p-7 border ${dark ? 'border-orange-500/15' : 'border-orange-200'}`}
            style={dark ? {boxShadow:'0 0 50px rgba(249,115,22,0.05)'} : {}}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-syne font-bold text-2xl">
                R
              </div>
              <div>
                <div className="font-syne font-bold text-lg">Raju Kumar</div>
                <div className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Zomato Partner · Velachery, Chennai</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="badge badge-green text-xs">Standard Tier</span>
                  <span className="badge badge-blue text-xs">Zone V-23</span>
                </div>
              </div>
            </div>

            <div className={`space-y-3 text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
              <div className={`flex justify-between py-2 border-b ${dark ? 'border-white/5' : 'border-gray-100'}`}>
                <span className={dark ? 'text-gray-400' : 'text-gray-500'}>Weekly premium</span>
                <span className="font-syne font-bold text-orange-400">₹54 / week</span>
              </div>
              <div className={`flex justify-between py-2 border-b ${dark ? 'border-white/5' : 'border-gray-100'}`}>
                <span className={dark ? 'text-gray-400' : 'text-gray-500'}>Zone risk multiplier</span>
                <span className="font-medium">1.15× <span className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>(Velachery drainage)</span></span>
              </div>
              <div className={`flex justify-between py-2 border-b ${dark ? 'border-white/5' : 'border-gray-100'}`}>
                <span className={dark ? 'text-gray-400' : 'text-gray-500'}>History multiplier</span>
                <span className="font-medium">0.92× <span className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>(good record)</span></span>
              </div>
              <div className={`flex justify-between py-2 border-b ${dark ? 'border-white/5' : 'border-gray-100'}`}>
                <span className={dark ? 'text-gray-400' : 'text-gray-500'}>Max payout/trigger</span>
                <span className="font-syne font-bold text-green-400">₹800</span>
              </div>
              <div className="flex justify-between py-2">
                <span className={dark ? 'text-gray-400' : 'text-gray-500'}>Claims last 4 weeks</span>
                <span className="font-medium">0 <span className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>(no rain events)</span></span>
              </div>
            </div>

            <div className={`mt-5 p-3 rounded-xl text-xs ${dark ? 'bg-orange-500/8 border border-orange-500/15 text-orange-300' : 'bg-orange-50 border border-orange-200 text-orange-700'}`}>
              Formula: <strong>₹59 × 1.15 × 0.92 = ₹54/week</strong> · Base × Zone Risk × Worker History
            </div>
          </div>
        </div>
      </section>

      {/* ── 5 TRIGGERS ── */}
      <section className={`py-20 ${dark ? 'bg-white/1' : 'bg-gray-50'} border-y ${dark ? 'border-white/5' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-3">Parametric Triggers</div>
            <h2 className="font-syne text-3xl sm:text-4xl font-bold mb-4">5 automatic payout triggers</h2>
            <p className={`text-base max-w-xl mx-auto ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              Real-time data from IMD, OpenWeatherMap, CPCB, and NDMA.
              When a threshold is crossed in your zone, payout fires automatically.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {TRIGGERS.map((t, i) => (
              <TriggerCard key={i} {...t} delay={i * 80} />
            ))}
          </div>
          <div className={`mt-8 text-center text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            Data sources: IMD · OpenWeatherMap · CPCB AQI · NDMA Flood Alerts · Local intelligence feeds
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-3">How It Works</div>
          <h2 className="font-syne text-3xl sm:text-4xl font-bold">Zero-touch claims in 4 steps</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s, i) => (
            <div key={i} className={`glass-card p-6 relative group hover:border-orange-500/30 transition-all`}>
              <div className="font-syne text-4xl font-extrabold gradient-text mb-4">{s.n}</div>
              <h3 className="font-syne font-bold text-base mb-2">{s.title}</h3>
              <p className={`text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{s.body}</p>
              {i < 3 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-10 text-orange-400 opacity-40">
                  <ArrowRight size={16} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className={`py-20 border-y ${dark ? 'border-white/5 bg-white/1' : 'border-gray-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-3">Pricing</div>
            <h2 className="font-syne text-3xl sm:text-4xl font-bold mb-4">One price. Transparent formula.</h2>
            <p className={`text-sm max-w-lg mx-auto ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              Premium = Base × Zone Risk Multiplier (AI-computed) × Worker History Score. No surprises.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {TIERS.map((t, i) => (
              <div key={i} className={`glass-card p-7 relative flex flex-col transition-all duration-300
                ${t.popular
                  ? 'border-orange-500/40 shadow-orange-500/10 scale-105'
                  : 'hover:border-orange-500/20'
                }`}
                style={t.popular && dark ? {boxShadow:'0 0 40px rgba(249,115,22,0.08)'} : {}}>
                {t.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold bg-orange-500 text-white">
                    Most Popular
                  </div>
                )}
                <div className="mb-5">
                  <div className={`text-sm font-medium mb-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{t.name}</div>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="font-syne text-4xl font-extrabold">₹{t.price}</span>
                    <span className={`text-sm mb-1.5 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>/week</span>
                  </div>
                  <div className="text-sm text-orange-400 font-medium">Max payout: ₹{t.payout}/trigger</div>
                </div>
                <ul className="space-y-2.5 mb-7 flex-1">
                  {t.features.map((f, j) => (
                    <li key={j} className={`flex items-center gap-2 text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <CheckCircle size={14} className="text-green-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => navigate('register')}
                  className={t.popular ? 'btn-primary w-full' : 'btn-ghost w-full'}>
                  Choose {t.name}
                </button>
              </div>
            ))}
          </div>
          <p className={`text-center text-xs mt-6 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            Premiums are AI-calculated weekly. Final premium = above × zone multiplier × history score.
            IRDAI Micro-Insurance Regulations 2015 compliant.
          </p>
        </div>
      </section>

      {/* ── WHY PRAHARI ── */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-3">Technology</div>
          <h2 className="font-syne text-3xl sm:text-4xl font-bold">Built on real infrastructure</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: MapPin,      title:'Uber H3 Micro-Zones',    body:'500m hexagonal cells, not city blobs. Zone V-23 Velachery is insured separately from Zone V-24.' },
            { icon: TrendingUp,  title:'XGBoost ML Pricing',     body:'10-feature gradient boosted model. SHAP explainability. Every rupee of your premium is explained to IRDAI.' },
            { icon: Shield,      title:'6-Signal Fraud Proof',   body:'GPS + accelerometer + cell towers + battery state + app activity + zone history. Spoofing = permanent blacklist.' },
            { icon: Zap,         title:'90-Minute Payouts',      body:'Parametric data confirms → UPI transfer initiated. No adjuster. No call. No claim form. Fully automatic.' },
            { icon: Award,       title:'IRDAI Compliant',        body:'Section 64VB, 101A, KYC norms, IGMS grievance, micro-insurance regulations — all met. Not a grey-market product.' },
            { icon: Users,       title:'Built for Gig Workers',  body:'Onboarding in 3 minutes. Hindi + English UI. Designed for workers with no insurance experience.' },
          ].map((f, i) => (
            <div key={i} className={`glass-card p-6 hover:border-orange-500/20 transition-all group`}>
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4 group-hover:bg-orange-500/15 transition-all">
                <f.icon size={18} className="text-orange-400" />
              </div>
              <h3 className="font-syne font-bold mb-2 text-sm">{f.title}</h3>
              <p className={`text-sm leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className={`glass-card p-12 text-center border ${dark ? 'border-orange-500/15' : 'border-orange-200'}`}
          style={dark ? {boxShadow:'0 0 80px rgba(249,115,22,0.06)'} : {}}>
          <div className="font-syne text-3xl sm:text-4xl font-bold mb-4">
            Ready to protect your income?
          </div>
          <p className={`text-base mb-8 max-w-md mx-auto ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            Join India's first parametric micro-zone income insurance. ₹39/week. Automatic payouts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('register')} className="btn-primary text-base px-10 py-4">
              Register as a Worker
              <ArrowRight size={18} />
            </button>
            <button onClick={() => navigate('dashboard')} className="btn-ghost text-base px-10 py-4">
              View Dashboard Demo
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={`border-t py-10 ${dark ? 'border-white/5' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center">
                <Shield size={13} className="text-white" />
              </div>
              <span className="font-syne font-bold">Prahari</span>
              <span className={`text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>· प्रहरी · Guardian</span>
            </div>
            <div className={`text-xs text-center ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              Built by <strong>Syntax Squad</strong> for Guidewire DEVTrails 2026 Phase 2 ·
              IRDAI Micro-Insurance Regulations 2015 ·
              Parametric income insurance for gig workers
            </div>
            <div className="flex items-center gap-4 text-xs">
              <button onClick={() => navigate('exclusions')} className={`${dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors`}>
                Exclusions
              </button>
              <button onClick={() => navigate('ml')} className={`${dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors`}>
                AI Model
              </button>
              <button onClick={() => navigate('register')} className={`${dark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors`}>
                Register
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}