import React, { useState, useEffect } from 'react';
import { RefreshCw, Zap, CheckCircle, AlertTriangle, Eye } from 'lucide-react';
import { MOCK_TRIGGERS } from '../utils/mockData';

const STATUS_STYLE = {
  FIRED:      { cls:'bg-red-500/12   border-red-500/25   text-red-400',   dot:'bg-red-500',    label:'FIRED'      },
  MONITORING: { cls:'bg-amber-500/12 border-amber-500/25 text-amber-400', dot:'bg-amber-500',  label:'MONITORING' },
  SAFE:       { cls:'bg-green-500/12 border-green-500/25 text-green-400', dot:'bg-green-500',  label:'SAFE'       },
};

const TRIGGER_COLOR = {
  blue:   'border-blue-500/20   bg-blue-500/5',
  red:    'border-red-500/20    bg-red-500/5',
  purple: 'border-purple-500/20 bg-purple-500/5',
  cyan:   'border-cyan-500/20   bg-cyan-500/5',
  amber:  'border-amber-500/20  bg-amber-500/5',
};

export default function Triggers({ navigate, dark, worker }) {
  const [triggers,      setTriggers]      = useState(MOCK_TRIGGERS);
  const [lastRefresh,   setLastRefresh]   = useState(new Date());
  const [refreshing,    setRefreshing]    = useState(false);
  const [simFiring,     setSimFiring]     = useState(null); // trigger id being simulated
  const [payoutShown,   setPayoutShown]   = useState(null);
  const [countdown,     setCountdown]     = useState(null);

  const muted = dark ? 'text-gray-400' : 'text-gray-500';
  const cardC = dark ? 'glass-card'    : 'light-card';

  // Poll every 15s (mock)
  useEffect(() => {
    const t = setInterval(() => {
      setLastRefresh(new Date());
    }, 15000);
    return () => clearInterval(t);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false); setLastRefresh(new Date()); }, 1200);
  };

  const simulateFire = (id) => {
    setSimFiring(id);
    setCountdown(5);
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timer);
          setTriggers(prev => prev.map(t => t.id === id ? { ...t, status:'FIRED' } : t));
          setSimFiring(null);
          setCountdown(null);
          setPayoutShown(id);
          setTimeout(() => setPayoutShown(null), 5000);
          return null;
        }
        return c - 1;
      });
    }, 1000);
  };

  const resetTrigger = (id) => {
    setTriggers(prev => prev.map(t => {
      const orig = MOCK_TRIGGERS.find(o => o.id === id);
      return t.id === id ? { ...orig } : t;
    }));
  };

  const firedCount = triggers.filter(t => t.status === 'FIRED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-syne text-2xl font-bold mb-1">Parametric Trigger Monitor</h1>
          <p className={`text-sm ${muted}`}>
            Zone V-23 · {worker?.city || 'Bengaluru'} · Polled every 15 minutes
          </p>
        </div>
        <div className="flex items-center gap-3">
          {firedCount > 0 && (
            <div className="badge badge-red animate-pulse-slow">
              ⚡ {firedCount} trigger{firedCount>1?'s':''} fired
            </div>
          )}
          <button onClick={handleRefresh}
            className={`btn-ghost btn-sm flex items-center gap-2 text-sm ${refreshing ? 'opacity-60' : ''}`}>
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
          <div className={`text-xs ${muted}`}>
            Last: {lastRefresh.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Payout banner */}
      {payoutShown && (
        <div className="mb-6 p-4 rounded-xl bg-green-500/12 border border-green-500/25 text-green-400
          flex items-center gap-3 animate-pulse">
          <CheckCircle size={20} />
          <div>
            <span className="font-syne font-bold">Auto-Claim Initiated! </span>
            <span className="text-sm">GPS validation running. UPI payout will arrive within 90 minutes.</span>
          </div>
        </div>
      )}

      {/* Trigger grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
        {triggers.map(t => {
          const ss  = STATUS_STYLE[t.status];
          const isFiring = simFiring === t.id;
          return (
            <div key={t.id}
              className={`${cardC} p-6 border transition-all ${
                t.status === 'FIRED' ? 'border-red-500/30 glow-sm' : TRIGGER_COLOR[t.color]
              }`}
              style={t.status==='FIRED' && dark ? {boxShadow:'0 0 20px rgba(239,68,68,0.12)'} : {}}>

              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{t.icon}</span>
                  <div>
                    <h3 className="font-syne font-semibold text-sm">{t.name}</h3>
                    <p className={`text-xs ${muted}`}>{t.source}</p>
                  </div>
                </div>
                <div className={`badge border text-xs ${ss.cls}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${ss.dot} ${t.status==='FIRED' ? 'animate-ping' : ''}`} />
                  {ss.label}
                </div>
              </div>

              {/* Reading */}
              <div className={`rounded-xl p-3 mb-4 ${dark ? 'bg-white/4' : 'bg-gray-50 border border-gray-100'}`}>
                <div className="flex justify-between items-center text-sm">
                  <span className={muted}>Current Reading</span>
                  <span className={`font-syne font-bold ${t.status==='FIRED' ? 'text-red-400' : ''}`}>
                    {t.current}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm mt-1">
                  <span className={muted}>Trigger Threshold</span>
                  <span className="font-medium">{t.threshold}</span>
                </div>
              </div>

              <p className={`text-xs ${muted} mb-4 leading-relaxed`}>{t.description}</p>

              {/* Action */}
              {t.status === 'FIRED' ? (
                <div className="flex gap-2">
                  <button onClick={() => navigate('claims')} className="btn-primary btn-sm flex-1 text-xs">
                    <Zap size={12} /> View Claim
                  </button>
                  <button onClick={() => resetTrigger(t.id)} className="btn-ghost btn-sm text-xs px-3">
                    Reset
                  </button>
                </div>
              ) : isFiring ? (
                <div className={`text-center py-2 rounded-xl text-sm font-medium ${dark ? 'bg-orange-500/10' : 'bg-orange-50'} text-orange-400`}>
                  Firing in {countdown}s…
                </div>
              ) : (
                <button onClick={() => simulateFire(t.id)}
                  className="w-full btn-ghost btn-sm text-xs flex items-center justify-center gap-1.5">
                  <Eye size={12} /> Simulate Fire
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* How triggers work */}
      <div className={`${cardC} p-6`}>
        <h3 className="font-syne font-bold mb-5">How Parametric Triggers Work</h3>
        <div className="grid md:grid-cols-5 gap-4">
          {[
            { icon:'📡', step:'API Poll',        desc:'OpenWeatherMap, AQICN, IMD polled every 15 minutes' },
            { icon:'📍', step:'Zone Check',      desc:'Does the reading exceed threshold in Cell V-23 specifically?' },
            { icon:'✅', step:'GPS Validation',  desc:'Is the workers GPS confirmed inside the triggered zone?' },
            { icon:'🔍', step:'Fraud Detection', desc:'6-signal stack cross-referenced. Confidence score assigned.' },
            { icon:'💸', step:'UPI Payout',      desc:'Approved claims paid to worker UPI within 90 minutes.' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="font-syne font-semibold text-xs mb-1">{s.step}</div>
              <div className={`text-xs ${muted} leading-relaxed`}>{s.desc}</div>
              {i < 4 && (
                <div className="hidden md:block text-orange-400 text-xl absolute right-0 top-1/2 -translate-y-1/2">›</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}