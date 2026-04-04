import React, { useState, useEffect } from 'react';
import {
  Shield, CloudRain, Thermometer, Wind, Waves, AlertTriangle,
  TrendingUp, TrendingDown, Zap, MapPin, Clock, CheckCircle,
  AlertCircle, ArrowRight, RefreshCw, Activity, DollarSign
} from 'lucide-react';
import { mlPredict } from '../utils/mlEngine';

const TRIGGER_ICONS = {
  rain:    { icon: CloudRain,     label: 'Rain',     color: 'blue'   },
  heat:    { icon: Thermometer,   label: 'Heat',     color: 'red'    },
  aqi:     { icon: Wind,          label: 'AQI',      color: 'purple' },
  flood:   { icon: Waves,         label: 'Flood',    color: 'cyan'   },
  curfew:  { icon: AlertTriangle, label: 'Curfew',   color: 'amber'  },
};

// Mock real-time zone sensor data
const ZONE_SENSORS = [
  { label: 'Rainfall',    value: '8mm',    threshold: '50mm', pct: 16, status: 'safe',    icon: CloudRain,     unit: '/3hr' },
  { label: 'Temperature', value: '35°C',   threshold: '42°C', pct: 83, status: 'watch',   icon: Thermometer,   unit: '' },
  { label: 'AQI',         value: '142',    threshold: '300',  pct: 47, status: 'moderate',icon: Wind,          unit: '' },
  { label: 'Flood Risk',  value: 'Low',    threshold: 'Alert',pct: 10, status: 'safe',    icon: Waves,         unit: '' },
  { label: 'Civic',       value: 'Clear',  threshold: 'Disruption', pct: 0, status: 'safe', icon: AlertTriangle, unit: '' },
];

const ACTIVITY_FEED = [
  { time: '2 mins ago',  type: 'payout',  text: 'Zone V-23 — ₹800 payout sent to Raju Kumar',     icon: DollarSign, color: 'green' },
  { time: '14 mins ago', type: 'trigger', text: 'Trigger resolved: Rainfall dropped below 50mm',   icon: CloudRain,  color: 'blue'  },
  { time: '1 hr ago',    type: 'trigger', text: 'FIRE: Heavy rain >50mm confirmed in Zone V-23',   icon: AlertCircle,color: 'red'   },
  { time: '3 hrs ago',   type: 'policy',  text: 'Policy renewed automatically — Week 14 active',   icon: Shield,     color: 'orange'},
  { time: 'Yesterday',   type: 'ml',      text: 'ML model retrained — risk score updated to 0.612',icon: Activity,   color: 'purple'},
  { time: '2 days ago',  type: 'payout',  text: 'Zone K-11 — ₹1,100 payout (AQI trigger)',         icon: DollarSign, color: 'green' },
];

const RISK_FORECAST = [
  { day: 'Mon', risk: 0.31, label: 'Low'  },
  { day: 'Tue', risk: 0.48, label: 'Med'  },
  { day: 'Wed', risk: 0.72, label: 'High' },
  { day: 'Thu', risk: 0.65, label: 'High' },
  { day: 'Fri', risk: 0.55, label: 'Med'  },
  { day: 'Sat', risk: 0.38, label: 'Low'  },
  { day: 'Sun', risk: 0.29, label: 'Low'  },
];

const COLOR_MAP = {
  blue:   { bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   text: 'text-blue-400',   bar: 'bg-blue-500'   },
  red:    { bg: 'bg-red-500/10',    border: 'border-red-500/20',    text: 'text-red-400',    bar: 'bg-red-500'    },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', bar: 'bg-purple-500' },
  cyan:   { bg: 'bg-cyan-500/10',   border: 'border-cyan-500/20',   text: 'text-cyan-400',   bar: 'bg-cyan-500'   },
  amber:  { bg: 'bg-amber-500/10',  border: 'border-amber-500/20',  text: 'text-amber-400',  bar: 'bg-amber-400'  },
  green:  { bg: 'bg-green-500/10',  border: 'border-green-500/20',  text: 'text-green-400',  bar: 'bg-green-500'  },
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', bar: 'bg-orange-500' },
  gray:   { bg: 'bg-gray-500/10',   border: 'border-gray-500/20',   text: 'text-gray-400',   bar: 'bg-gray-400'   },
};

const STATUS_COLOR = { safe: 'green', watch: 'amber', moderate: 'amber', alert: 'red' };

function KpiCard({ label, value, sub, icon: Icon, color = 'orange', trend, dark }) {
  const c = COLOR_MAP[color] || COLOR_MAP.orange;
  return (
    <div className={`glass-card p-5 ${dark ? '' : 'light-card'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.bg} border ${c.border}`}>
          <Icon size={16} className={c.text} />
        </div>
        {trend !== undefined && (
          <span className={`text-xs flex items-center gap-0.5 ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="font-syne text-2xl font-bold mb-0.5">{value}</div>
      <div className={`text-xs font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{label}</div>
      {sub && <div className={`text-xs mt-0.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{sub}</div>}
    </div>
  );
}

export default function Dashboard({ navigate, dark, worker }) {
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [mlResult] = useState(() => mlPredict({
    city: worker?.city || 'Chennai',
    yearsExp: worker?.yearsExp || '2',
    vehicleType: worker?.vehicleType || 'Motorcycle',
    claimsFreeWeeks: 0,
    adverseWeather: false,
    tier: worker?.tier || 'standard',
  }));

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => { setLastRefresh(new Date()); setRefreshing(false); }, 1200);
  };

  const muted  = dark ? 'text-gray-400' : 'text-gray-500';
  const cardC  = dark ? 'glass-card'    : 'light-card';
  const divid  = dark ? 'border-white/5': 'border-gray-100';
  const w      = worker || { name:'Raju Kumar', city:'Chennai', tier:'standard', zone:'V-23' };

  const riskColor = mlResult.riskScore > 0.6 ? 'red' : mlResult.riskScore > 0.4 ? 'amber' : 'green';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-syne text-2xl font-bold mb-1">
            Welcome back, {w.name?.split(' ')[0]} 👋
          </h1>
          <div className="flex items-center gap-3">
            <span className={`text-sm ${muted}`}>
              <MapPin size={12} className="inline mr-1" />
              Zone {w.zone || 'V-23'} · {w.city || 'Chennai'}
            </span>
            <span className="badge badge-green text-xs">Policy Active</span>
            <span className={`text-xs ${muted}`}>
              <div className="live-dot inline-flex mr-1" style={{verticalAlign:'middle'}} />
              Monitoring live
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs ${muted}`}>
            Updated {lastRefresh.toLocaleTimeString()}
          </span>
          <button onClick={refresh} className={`p-2 rounded-lg transition-all ${dark ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => navigate('triggers')} className="btn-primary btn-sm text-sm">
            View Triggers
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard label="Weekly Premium" value={`₹${mlResult.finalPremium}`}
          sub={`${w.tier || 'standard'} tier`} icon={Shield} color="orange" trend={-3} dark={dark} />
        <KpiCard label="ML Risk Score" value={mlResult.riskScore.toFixed(3)}
          sub={`${(mlResult.modelConfidence*100).toFixed(0)}% confidence`} icon={Activity}
          color={riskColor} dark={dark} />
        <KpiCard label="Max Payout" value={`₹${mlResult.maxPayout}`}
          sub="per trigger event" icon={DollarSign} color="green" dark={dark} />
        <KpiCard label="Triggers Armed" value="5 / 5"
          sub="All active in zone" icon={Zap} color="blue" dark={dark} />
      </div>

      {/* AI Model Card - Highlight ML Integration */}
      <div className={`${cardC} p-6 mb-6 border ${dark ? 'border-purple-500/15' : 'border-purple-200'}`}
        style={dark ? {boxShadow:'0 0 30px rgba(147,51,234,0.08)'} : {}}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center">
              <Activity size={18} className="text-purple-400" />
            </div>
            <div>
              <h3 className="font-syne font-bold">AI Risk Model (XGBoost Ensemble)</h3>
              <p className={`text-xs ${muted} mt-0.5`}>Gradient Boosted Tree predictions • 3-tree ensemble • SHAP explainability</p>
            </div>
          </div>
          <button onClick={() => navigate('ml')}
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors font-medium">
            View Full Model →
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Tree 1 Output', value: mlResult.tree1Output.toFixed(4), desc: 'Flood + drainage split' },
            { label: 'Tree 2 Output', value: mlResult.tree2Output.toFixed(4), desc: 'Worker history split' },
            { label: 'Tree 3 Output', value: mlResult.tree3Output.toFixed(4), desc: 'Weather fine-tuning' },
            { label: 'Final Risk', value: mlResult.riskScore.toFixed(4), desc: 'Ensemble prediction' },
          ].map((t, i) => (
            <div key={i} className={`rounded-lg p-3 ${dark ? 'bg-purple-500/8 border border-purple-500/15' : 'bg-purple-50 border border-purple-200'}`}>
              <div className={`text-xs ${muted} mb-1`}>{t.label}</div>
              <div className="font-syne font-bold text-purple-400 mb-1">{t.value}</div>
              <div className={`text-xs ${muted}`}>{t.desc}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 text-sm text-left">
          <div>
            <div className={`text-xs ${muted} mb-1`}>Zone Risk Multiplier</div>
            <div className="font-syne font-bold text-lg">{mlResult.zoneMultiplier.toFixed(3)}×</div>
            <div className={`text-xs ${muted}`}>{w.city} geographic risk</div>
          </div>
          <div>
            <div className={`text-xs ${muted} mb-1`}>History Multiplier</div>
            <div className="font-syne font-bold text-lg">{mlResult.historyMultiplier.toFixed(3)}×</div>
            <div className={`text-xs ${muted}`}>Experience + loyalty bonus</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Left: Zone live sensors */}
        <div className="lg:col-span-2 space-y-6">

          {/* Zone sensor readings */}
          <div className={`${cardC} p-6`}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-syne font-bold">Zone {w.zone || 'V-23'} Live Sensors</h3>
                <p className={`text-xs ${muted} mt-0.5`}>500m H3 hexagon · {w.city || 'Chennai'}</p>
              </div>
              <span className="badge badge-green text-xs">
                <div className="live-dot" />
                Live
              </span>
            </div>
            <div className="space-y-4">
              {ZONE_SENSORS.map((s, i) => {
                const sc = STATUS_COLOR[s.status] || 'gray';
                const cm = COLOR_MAP[sc] || COLOR_MAP.gray;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5 text-sm">
                      <div className="flex items-center gap-2">
                        <s.icon size={14} className={cm.text} />
                        <span className="font-medium">{s.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`font-syne font-bold ${cm.text}`}>{s.value}{s.unit}</span>
                        <span className={`text-xs ${muted}`}>/ {s.threshold}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${cm.bg} ${cm.text}`}>
                          {s.status}
                        </span>
                      </div>
                    </div>
                    <div className={`h-1.5 rounded-full ${dark ? 'bg-white/6' : 'bg-gray-200'}`}>
                      <div className={`h-1.5 rounded-full transition-all ${cm.bar}`}
                        style={{width: `${s.pct}%`}} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={`mt-5 flex items-center justify-between text-xs ${muted}`}>
              <span>No triggers currently active in your zone</span>
              <button onClick={() => navigate('triggers')} className="text-orange-400 hover:underline flex items-center gap-1">
                Full monitor <ArrowRight size={11} />
              </button>
            </div>
          </div>

          {/* 7-day disruption predictability */}
          <div className={`${cardC} p-6 border ${dark ? 'border-cyan-500/15' : 'border-cyan-200'}`}
            style={dark ? {boxShadow:'0 0 30px rgba(34,211,238,0.08)'} : {}}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-syne font-bold">Disruption Predictability Score</h3>
                <p className={`text-xs ${muted} mt-0.5`}>Plan your week around predicted disruptions</p>
              </div>
            </div>
            
            {/* Chart */}
            <div className="flex items-end gap-2 h-24 mb-4">
              {RISK_FORECAST.map((d, i) => {
                const color = d.risk > 0.6 ? 'bg-red-500' : d.risk > 0.45 ? 'bg-amber-500' : 'bg-green-500';
                const isHighRisk = d.risk > 0.6;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className={`text-xs font-semibold ${isHighRisk ? 'text-red-400' : ''}`}>{(d.risk * 100).toFixed(0)}%</span>
                    <div className={`w-full rounded-t-sm ${color} transition-all`}
                      style={{height: `${d.risk * 80}px`}} />
                    <span className={`text-xs font-medium ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{d.day}</span>
                  </div>
                );
              })}
            </div>

            {/* Insights */}
            <div className={`rounded-lg p-3 mb-3 ${dark ? 'bg-cyan-500/8 border border-cyan-500/20' : 'bg-cyan-50 border border-cyan-200'}`}>
              <div className="flex items-start gap-2">
                <span className="text-sm">💡</span>
                <div className="text-sm">
                  <strong className="text-cyan-400">Smart Earning Plan:</strong> Wednesday has 72% disruption risk. Focus on Monday & Tuesday (31-48% risk) for guaranteed earning days.
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className={`flex items-center gap-3 text-xs ${muted}`}>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /> Safe (&lt;45%)</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> Caution (45–60%)</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> High Risk (&gt;60%)</span>
            </div>
          </div>

          {/* ML premium breakdown */}
          <div className={`${cardC} p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-syne font-bold">Your Premium Breakdown</h3>
              <button onClick={() => navigate('ml')}
                className="text-xs text-orange-400 hover:underline flex items-center gap-1">
                AI Model <ArrowRight size={11} />
              </button>
            </div>
            <div className={`text-xs ${muted} mb-4`}>
              Formula: Base × Zone Risk Multiplier × Worker History Score
            </div>
            <div className="space-y-0">
              {[
                { label: 'Base premium',          value: `₹${mlResult.base}`,                   note: `${w.tier || 'standard'} tier`         },
                { label: 'Zone risk multiplier',  value: `${mlResult.zoneMultiplier}×`,           note: `${w.city} ML score`                  },
                { label: 'Worker history score',  value: `${mlResult.historyMultiplier}×`,        note: 'Experience + claims-free'             },
                { label: 'Final weekly premium',  value: `₹${mlResult.finalPremium}`,            note: 'Charged every Monday', bold: true     },
              ].map((r, i) => (
                <div key={i} className={`flex justify-between items-center py-2.5 border-b last:border-0 ${divid} text-sm`}>
                  <div>
                    <span className={r.bold ? 'font-semibold' : ''}>{r.label}</span>
                    <div className={`text-xs ${muted}`}>{r.note}</div>
                  </div>
                  <span className={`font-syne font-bold ${r.bold ? 'text-orange-400 text-base' : ''}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">

          {/* Policy card */}
          <div className={`${cardC} p-6 border ${dark ? 'border-orange-500/15' : 'border-orange-200'}`}
            style={dark ? {boxShadow:'0 0 30px rgba(249,115,22,0.05)'} : {}}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                <Shield size={16} className="text-orange-400" />
              </div>
              <div>
                <div className="font-syne font-bold text-sm">Active Policy</div>
                <div className={`text-xs ${muted}`}>Week 14 of current cycle</div>
              </div>
              <span className="badge badge-green text-xs ml-auto">Active</span>
            </div>
            <div className={`space-y-2 text-xs ${muted} mb-4`}>
              {[
                ['Policy ID',    '#PRH-2026-V23-0142'],
                ['Start date',   '24 Mar 2026'],
                ['Renews',       '07 Apr 2026'],
                ['Coverage',     '5 triggers, all zones'],
                ['Max payout',   `₹${mlResult.maxPayout}/trigger`],
              ].map(([k, v]) => (
                <div key={k} className={`flex justify-between py-1.5 border-b last:border-0 ${divid}`}>
                  <span>{k}</span>
                  <span className={`font-medium ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('policy')} className="btn-ghost w-full text-sm btn-sm">
              Manage Policy <ArrowRight size={13} />
            </button>
          </div>

          {/* Fraud score */}
          <div className={`${cardC} p-5`}>
            <h4 className="font-syne font-semibold text-sm mb-3">Anti-Fraud Status</h4>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-16 h-16">
                <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#22c55e" strokeWidth="3"
                    strokeDasharray={`${94 * 0.942} 100`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-syne font-bold text-sm text-green-400">94%</div>
              </div>
              <div>
                <div className="font-syne font-bold text-sm text-green-400">Trusted Worker</div>
                <div className={`text-xs ${muted}`}>6-signal verification</div>
                <div className={`text-xs ${muted}`}>Score: 940 / 1000</div>
              </div>
            </div>
            <div className="space-y-1.5">
              {['GPS verified','Motion sensors OK','Cell tower match','Battery state OK','App activity ✓','Zone history clean'].map((s, i) => (
                <div key={i} className={`flex items-center gap-2 text-xs ${muted}`}>
                  <CheckCircle size={11} className="text-green-400" />
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className={`${cardC} p-5`}>
            <h4 className="font-syne font-semibold text-sm mb-3">Quick Actions</h4>
            <div className="space-y-2">
              {[
                { label: 'View AI Model & SHAP', page: 'ml',         icon: Activity   },
                { label: 'Zone Risk Map',         page: 'zone',       icon: MapPin     },
                { label: 'Claims History',        page: 'claims',     icon: Clock      },
                { label: 'Policy Exclusions',     page: 'exclusions', icon: Shield     },
              ].map((a, i) => (
                <button key={i} onClick={() => navigate(a.page)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left
                    ${dark ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}>
                  <a.icon size={14} className="text-orange-400 shrink-0" />
                  {a.label}
                  <ArrowRight size={12} className={`ml-auto ${muted}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activity feed */}
      <div className={`${cardC} p-6 mt-6`}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-syne font-bold">Recent Activity</h3>
          <button onClick={() => navigate('claims')}
            className="text-xs text-orange-400 hover:underline flex items-center gap-1">
            All claims <ArrowRight size={11} />
          </button>
        </div>
        <div className="space-y-0">
          {ACTIVITY_FEED.map((a, i) => {
            const cm = COLOR_MAP[a.color] || COLOR_MAP.gray;
            return (
              <div key={i} className={`flex items-start gap-3 py-3 border-b last:border-0 ${divid}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${cm.bg} border ${cm.border}`}>
                  <a.icon size={12} className={cm.text} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${dark ? 'text-gray-200' : 'text-gray-700'} leading-snug`}>{a.text}</p>
                </div>
                <span className={`text-xs shrink-0 ${muted}`}>{a.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}