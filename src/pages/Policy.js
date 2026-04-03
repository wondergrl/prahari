import React, { useState } from 'react';
import { Shield, Calendar, Zap, ChevronRight, RefreshCw, CheckCircle } from 'lucide-react';
import { MOCK_POLICIES, MOCK_WORKER } from '../utils/mockData';
import { TIERS } from '../utils/premiumEngine';

export default function Policy({ navigate, dark, worker }) {
  const [renewing, setRenewing] = useState(false);
  const [renewed,  setRenewed]  = useState(false);
  const w = worker || MOCK_WORKER;

  const muted = dark ? 'text-gray-400' : 'text-gray-500';
  const cardC = dark ? 'glass-card'    : 'light-card';

  const handleRenew = () => {
    setRenewing(true);
    setTimeout(() => { setRenewing(false); setRenewed(true); }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-syne text-2xl font-bold mb-1">Policy Management</h1>
        <p className={`text-sm ${muted}`}>Your active and past insurance policies.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">

          {/* Active policy card */}
          <div className={`${cardC} p-7`}
            style={dark ? {boxShadow:'0 0 40px rgba(249,115,22,0.06)'} : {}}>
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge badge-green">● Active Policy</span>
                </div>
                <h2 className="font-syne text-xl font-bold">POL-2026-001</h2>
                <p className={`text-sm ${muted} mt-0.5`}>Standard Coverage · Zone V-23, {w.city}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center glow-sm">
                <Shield size={26} className="text-orange-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label:'Weekly Premium', value:'₹' + (w.premium || 54), icon:'💰' },
                { label:'Max Payout',     value:'₹800/day',               icon:'⚡' },
                { label:'Coverage',       value:'5 Triggers',             icon:'🛡️' },
                { label:'Zone',           value:'V-23, ' + (w.city||'BLR'), icon:'📍' },
              ].map((k, i) => (
                <div key={i} className={`rounded-xl p-3 ${dark ? 'bg-white/4 border border-white/6' : 'bg-gray-50 border border-gray-200'}`}>
                  <div className="text-lg mb-1">{k.icon}</div>
                  <div className="font-syne font-bold text-sm">{k.value}</div>
                  <div className={`text-xs ${muted}`}>{k.label}</div>
                </div>
              ))}
            </div>

            {/* Covered triggers */}
            <div className="mb-6">
              <h4 className={`text-xs ${muted} uppercase tracking-wider font-semibold mb-3`}>Covered Parametric Triggers</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  { name:'Heavy Rainfall', threshold:'> 50mm/hr',    icon:'🌧️', active:true  },
                  { name:'Extreme Heat',   threshold:'> 42°C',        icon:'🌡️', active:true  },
                  { name:'Severe AQI',     threshold:'AQI > 300',     icon:'🌫️', active:true  },
                  { name:'Flash Flood',    threshold:'IMD Alert',     icon:'🌊', active:true  },
                  { name:'Civic Disruption',threshold:'Traffic+News', icon:'🚫', active:true  },
                ].map(t => (
                  <div key={t.name}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm ${
                      t.active
                        ? dark ? 'bg-green-500/8 border-green-500/20 text-green-400' : 'bg-green-50 border-green-200 text-green-700'
                        : dark ? 'bg-white/4 border-white/8 text-gray-500' : 'bg-gray-100 border-gray-200 text-gray-400'
                    }`}>
                    <span>{t.icon}</span>
                    <span className="font-medium text-xs">{t.name}</span>
                    <span className="text-xs opacity-60">{t.threshold}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Policy period */}
            <div className={`flex items-center gap-3 p-4 rounded-xl ${dark ? 'bg-white/4 border border-white/6' : 'bg-gray-50 border border-gray-200'}`}>
              <Calendar size={16} className="text-orange-400 shrink-0" />
              <div className="flex-1 text-sm">
                <span className={muted}>Policy Period: </span>
                <span className="font-medium">20 Mar 2026 — 27 Mar 2026</span>
                <span className={`ml-3 text-xs ${muted}`}>Renews in 1 day</span>
              </div>
            </div>

            {/* Renew */}
            {renewed ? (
              <div className="mt-5 flex items-center gap-2 justify-center text-green-400">
                <CheckCircle size={18} />
                <span className="font-syne font-semibold">Renewed for next week!</span>
              </div>
            ) : (
              <button onClick={handleRenew} disabled={renewing}
                className="btn-primary w-full mt-5">
                {renewing ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Renewing…</>
                ) : (
                  <><RefreshCw size={16} /> Renew for ₹{w.premium || 54} — Next 7 Days</>
                )}
              </button>
            )}
          </div>

          {/* Past policies */}
          <div className={`${cardC} p-6`}>
            <h3 className="font-syne font-bold mb-5">Policy History</h3>
            <div className="space-y-3">
              {MOCK_POLICIES.map(p => (
                <div key={p.id}
                  className={`flex items-center justify-between p-4 rounded-xl border ${
                    dark ? 'border-white/5 bg-white/2 hover:bg-white/4' : 'border-gray-100 hover:bg-gray-50'
                  } transition-all`}>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-syne font-semibold text-sm">{p.id}</span>
                      <span className={`badge text-xs ${p.status === 'active' ? 'badge-green' : 'badge-amber'}`}>
                        {p.status}
                      </span>
                    </div>
                    <p className={`text-xs ${muted}`}>{p.startDate} → {p.endDate} · {p.tier} · ₹{p.premium}/wk</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{p.claimsThisWeek} claim{p.claimsThisWeek !== 1 ? 's' : ''}</div>
                    <div className={`text-xs ${muted}`}>Max ₹{p.maxPayout}/day</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className={`${cardC} p-6`}>
            <h3 className="font-syne font-bold mb-4">Policy Summary</h3>
            {[
              ['Total Policies',     '2'],
              ['Total Premiums Paid','₹172'],
              ['Total Payouts',      '₹4,250'],
              ['Claim Success Rate', '100%'],
              ['Avg Payout Time',    '78 minutes'],
              ['Trust Score',        (w.trustScore||94) + '/100'],
            ].map(([k, v]) => (
              <div key={k} className={`flex justify-between text-sm py-2.5 border-b last:border-0 ${dark ? 'border-white/5' : 'border-gray-100'}`}>
                <span className={muted}>{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </div>

          <div className={`${cardC} p-5`}>
            <h4 className="font-syne font-semibold mb-3 text-sm">How Parametric Works</h4>
            <div className="space-y-3">
              {[
                { n:'1', text:'Trigger threshold crossed in your zone' },
                { n:'2', text:'GPS validation — you must be in the zone' },
                { n:'3', text:'6-signal fraud check runs automatically' },
                { n:'4', text:'Payout sent to your UPI within 90 minutes' },
              ].map(s => (
                <div key={s.n} className="flex items-start gap-3 text-sm">
                  <span className="font-syne font-bold text-orange-400 w-4 shrink-0">{s.n}</span>
                  <span className={muted}>{s.text}</span>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => navigate('triggers')} className="btn-ghost w-full">
            Live Trigger Status <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}