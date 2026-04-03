import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Info, FileText } from 'lucide-react';

const EXCLUSIONS = [
  {
    category: 'War & Civil Unrest',
    icon: '⚔️',
    color: 'red',
    mandatory: true,
    items: [
      { excluded: true,  text: 'Armed conflict, war, invasion, or acts of foreign enemy' },
      { excluded: true,  text: 'Military coups, insurrection, or rebellion' },
      { excluded: true,  text: 'Nuclear, chemical, or biological warfare' },
      { excluded: false, text: 'Civic disruption / local bandh (Trigger 5 — COVERED)' },
    ],
  },
  {
    category: 'Pandemic & Epidemic',
    icon: '🦠',
    color: 'purple',
    mandatory: true,
    items: [
      { excluded: true,  text: 'WHO-declared pandemics (e.g. COVID-19 category events)' },
      { excluded: true,  text: 'Government-mandated lockdowns due to epidemic spread' },
      { excluded: true,  text: 'Biological or chemical contamination events' },
      { excluded: false, text: 'AQI > 300 from pollution (Trigger 3 — COVERED as separate trigger)' },
    ],
  },
  {
    category: 'Pre-existing Conditions',
    icon: '📋',
    color: 'amber',
    mandatory: false,
    items: [
      { excluded: true,  text: 'Zones with active flood alerts at policy inception' },
      { excluded: true,  text: 'Ongoing curfew at time of policy purchase' },
      { excluded: true,  text: 'Declared disaster zones at registration date' },
      { excluded: false, text: 'Zones with past history of flooding (risk-priced, covered)' },
    ],
  },
  {
    category: 'Health & Accident',
    icon: '🏥',
    color: 'blue',
    mandatory: false,
    items: [
      { excluded: true,  text: 'Personal injury, illness, or hospitalisation' },
      { excluded: true,  text: 'Vehicle damage or third-party liability' },
      { excluded: true,  text: 'Road accidents or collision events' },
      { excluded: false, text: 'Income loss due to weather (Triggers 1–5 — COVERED)' },
    ],
  },
  {
    category: 'Intentional Acts',
    icon: '🚫',
    color: 'orange',
    mandatory: true,
    items: [
      { excluded: true,  text: 'Self-inflicted income loss (deliberately refusing orders)' },
      { excluded: true,  text: 'Colluding to fabricate disruption events (fraud)' },
      { excluded: true,  text: 'GPS spoofing or identity fraud — permanent blacklist' },
      { excluded: false, text: 'Genuine forced stoppage due to parametric trigger (COVERED)' },
    ],
  },
  {
    category: 'Political & Regulatory',
    icon: '🏛️',
    color: 'cyan',
    mandatory: false,
    items: [
      { excluded: true,  text: 'Platform deactivation or account ban by Zomato/Swiggy' },
      { excluded: true,  text: 'Policy changes by delivery platforms (payment cuts etc.)' },
      { excluded: true,  text: 'Regulatory shutdown of gig economy platforms' },
      { excluded: false, text: 'Government-declared weather emergency in zone (COVERED)' },
    ],
  },
];

const WAITING_PERIODS = [
  { trigger:'Heavy Rainfall',   period:'None (immediate)',          note:'Data-verified, no waiting period' },
  { trigger:'Extreme Heat',     period:'2 hours continuous',        note:'Must sustain 42°C+ for ≥ 2 hrs' },
  { trigger:'Severe AQI',       period:'None (immediate)',          note:'Reading above 300 fires instantly' },
  { trigger:'Flash Flood',      period:'None (IMD alert-based)',    note:'IMD district alert fires trigger' },
  { trigger:'Civic Disruption', period:'30 minutes post-detection', note:'Avoids short traffic anomalies' },
];

const IRDAI_COMPLIANCE = [
  { clause:'Section 64VB — Premium in advance', status:'Compliant', note:'Weekly premium collected before coverage starts' },
  { clause:'Section 101A — Solvency margin',    status:'Compliant', note:'Reserve held ≥ 130% of 3-month claims' },
  { clause:'IRDAI (Micro-Insurance) Regs 2015', status:'Compliant', note:'Max sum insured ₹50,000 per event — within limit' },
  { clause:'Grievance redressal (IGMS)',         status:'Compliant', note:'Appeal process within 4 hours per README spec' },
  { clause:'KYC norms — Aadhaar eKYC',          status:'Compliant', note:'Aadhaar + phone OTP at registration' },
  { clause:'Exclusion disclosure at point of sale', status:'Compliant', note:'This page shown during onboarding Step 3' },
];

const COLOR = {
  red:    'bg-red-500/8    border-red-500/20    text-red-400',
  purple: 'bg-purple-500/8 border-purple-500/20 text-purple-400',
  amber:  'bg-amber-500/8  border-amber-500/20  text-amber-400',
  blue:   'bg-blue-500/8   border-blue-500/20   text-blue-400',
  orange: 'bg-orange-500/8 border-orange-500/20 text-orange-400',
  cyan:   'bg-cyan-500/8   border-cyan-500/20   text-cyan-400',
};

export default function Exclusions({ dark }) {
  const [expanded, setExpanded] = useState(null);

  const muted = dark ? 'text-gray-400' : 'text-gray-500';
  const cardC = dark ? 'glass-card'    : 'light-card';
  const divid = dark ? 'border-white/5' : 'border-gray-100';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <FileText size={20} className="text-orange-400" />
          <h1 className="font-syne text-2xl font-bold">Coverage Exclusions & Policy Terms</h1>
        </div>
        <p className={`text-sm ${muted}`}>
          Prahari is an income-loss parametric insurance product. Understanding what is NOT covered
          is as important as what is. All exclusions comply with IRDAI regulations.
        </p>
      </div>

      {/* What Prahari covers - quick summary */}
      <div className={`${cardC} p-6 mb-8 border-l-4 border-orange-500`}>
        <h3 className="font-syne font-bold mb-3">What Prahari Covers — In Plain English</h3>
        <p className={`text-sm ${muted} mb-4`}>
          Prahari covers <strong>only income loss</strong> caused by the 5 parametric triggers
          in your registered micro-zone. It does not cover health, vehicle, accident, or any other category.
          No trigger = no claim. Trigger fires = automatic payout. Simple.
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            '✅ Heavy Rain income loss',
            '✅ Extreme Heat income loss',
            '✅ Hazardous AQI income loss',
            '✅ Flash Flood income loss',
            '✅ Civic Disruption income loss',
            '❌ Health / accidents',
            '❌ Vehicle damage',
            '❌ War / pandemic',
            '❌ Platform policy changes',
          ].map((t, i) => (
            <span key={i} className={`text-xs px-3 py-1.5 rounded-full border font-medium
              ${t.startsWith('✅')
                ? dark ? 'bg-green-500/8 border-green-500/20 text-green-400' : 'bg-green-50 border-green-200 text-green-700'
                : dark ? 'bg-red-500/8 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-700'
              }`}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Exclusions grid */}
      <h2 className="font-syne font-bold text-lg mb-4">Mandatory & Contractual Exclusions</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {EXCLUSIONS.map((ex, i) => (
          <div key={i} className={`${cardC} p-5 border cursor-pointer ${COLOR[ex.color]} transition-all`}
            onClick={() => setExpanded(expanded === i ? null : i)}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">{ex.icon}</span>
                <div>
                  <h3 className="font-syne font-semibold text-sm">{ex.category}</h3>
                  {ex.mandatory && (
                    <span className={`text-xs ${COLOR[ex.color].split(' ')[2]}`}>Mandatory IRDAI exclusion</span>
                  )}
                </div>
              </div>
              <span className={`text-xs ${muted}`}>{expanded === i ? '▲' : '▼'}</span>
            </div>
            {expanded === i && (
              <div className="space-y-2 mt-3 border-t pt-3" style={{borderColor:'rgba(255,255,255,0.08)'}}>
                {ex.items.map((item, j) => (
                  <div key={j} className="flex items-start gap-2 text-xs">
                    {item.excluded
                      ? <XCircle size={13} className="text-red-400 shrink-0 mt-0.5" />
                      : <CheckCircle size={13} className="text-green-400 shrink-0 mt-0.5" />
                    }
                    <span className={muted}>{item.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Waiting periods */}
      <div className={`${cardC} p-6 mb-8`}>
        <h2 className="font-syne font-bold mb-1">Trigger Waiting Periods</h2>
        <p className={`text-sm ${muted} mb-5`}>To prevent gaming, some triggers require a sustained reading before firing.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b ${divid}`}>
                {['Trigger','Waiting Period','Notes'].map(h => (
                  <th key={h} className={`text-left py-2 pr-4 text-xs font-semibold uppercase tracking-wide ${muted}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {WAITING_PERIODS.map((w, i) => (
                <tr key={i} className={`border-b last:border-0 ${divid}`}>
                  <td className="py-3 pr-4 font-medium">{w.trigger}</td>
                  <td className="py-3 pr-4 text-orange-400 font-syne font-semibold text-xs">{w.period}</td>
                  <td className={`py-3 text-xs ${muted}`}>{w.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* IRDAI Compliance */}
      <div className={`${cardC} p-6`}>
        <div className="flex items-center gap-2 mb-5">
          <Shield size={18} className="text-green-400" />
          <h2 className="font-syne font-bold">IRDAI Regulatory Compliance</h2>
          <span className="badge badge-green text-xs ml-auto">All compliant</span>
        </div>
        <div className="space-y-0">
          {IRDAI_COMPLIANCE.map((c, i) => (
            <div key={i} className={`flex items-start gap-4 py-3.5 border-b last:border-0 ${divid}`}>
              <CheckCircle size={16} className="text-green-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-medium text-sm">{c.clause}</div>
                <div className={`text-xs ${muted} mt-0.5`}>{c.note}</div>
              </div>
              <span className="badge badge-green text-xs shrink-0">{c.status}</span>
            </div>
          ))}
        </div>
        <div className={`mt-5 p-4 rounded-xl text-xs ${dark ? 'bg-blue-500/8 border border-blue-500/15 text-blue-400' : 'bg-blue-50 border border-blue-200 text-blue-700'}`}>
          <strong>Disclaimer:</strong> Prahari operates under IRDAI's Micro-Insurance Products Regulations 2015.
          Maximum sum insured per event: ₹1,100 (Premium tier). No life or health coverage is provided.
          This product is designed specifically for income protection of gig economy workers.
        </div>
      </div>
    </div>
  );
}