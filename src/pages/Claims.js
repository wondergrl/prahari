import React, { useState } from 'react';
import { Shield, CheckCircle, Clock, AlertTriangle, ChevronRight, Zap } from 'lucide-react';
import { MOCK_CLAIMS, MOCK_WORKER } from '../utils/mockData';
import { runFraudCheck, SIGNALS } from '../utils/fraudEngine';

export default function Claims({ navigate, dark, worker }) {
  const [simulating, setSimulating] = useState(false);
  const [simResult,  setSimResult]  = useState(null);
  const [activeTab,  setActiveTab]  = useState('history'); // 'history' | 'simulate'

  const w     = worker || MOCK_WORKER;
  const muted = dark ? 'text-gray-400' : 'text-gray-500';
  const cardC = dark ? 'glass-card'    : 'light-card';

  const statusMap = {
    paid:      { label:'Paid',      cls:'badge-green',  icon:<CheckCircle size={13}/> },
    reviewing: { label:'Reviewing', cls:'badge-amber',  icon:<Clock size={13}/>       },
    rejected:  { label:'Rejected',  cls:'badge-red',    icon:<AlertTriangle size={13}/> },
  };

  const handleSimulate = () => {
    setSimulating(true);
    setSimResult(null);
    setTimeout(() => {
      setSimResult(runFraudCheck(w));
      setSimulating(false);
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-syne text-2xl font-bold mb-1">Claims Management</h1>
          <p className={`text-sm ${muted}`}>Zero-touch automatic claims with 6-signal fraud verification.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('history')}
            className={activeTab==='history' ? 'btn-primary btn-sm' : 'btn-ghost btn-sm'}>
            Claim History
          </button>
          <button onClick={() => setActiveTab('simulate')}
            className={activeTab==='simulate' ? 'btn-primary btn-sm' : 'btn-ghost btn-sm'}>
            Simulate Claim
          </button>
        </div>
      </div>

      {activeTab === 'history' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {MOCK_CLAIMS.map(c => (
              <div key={c.id} className={`${cardC} p-6`}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{c.triggerIcon}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-syne font-bold">{c.trigger}</span>
                        <span className={`badge ${statusMap[c.status]?.cls} flex items-center gap-1`}>
                          {statusMap[c.status]?.icon} {statusMap[c.status]?.label}
                        </span>
                      </div>
                      <p className={`text-xs ${muted}`}>{c.id} · {c.timestamp}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-syne text-xl font-bold ${c.status==='paid' ? 'text-green-400' : muted}`}>
                      {c.status==='paid' ? '+₹'+c.amount : '₹'+c.amount}
                    </div>
                    <div className={`text-xs ${muted}`}>{c.zone}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {[
                    ['Fraud Check',   c.signals + '/6 signals passed'],
                    ['Confidence',    c.confidence],
                    ['Payout Time',   c.payoutTime],
                    ['UPI Ref',       c.upiRef || 'Pending'],
                  ].map(([k,v]) => (
                    <div key={k} className={`rounded-lg p-3 ${dark ? 'bg-white/4' : 'bg-gray-50 border border-gray-100'}`}>
                      <div className={`text-xs ${muted} mb-0.5`}>{k}</div>
                      <div className={`text-xs font-medium ${v.includes('High') ? 'text-green-400' : v.includes('Medium') ? 'text-amber-400' : ''}`}>{v}</div>
                    </div>
                  ))}
                </div>

                {/* Signal dots */}
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${muted}`}>Signals:</span>
                  {SIGNALS.map((s, i) => (
                    <div key={s.id} title={s.label}
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs
                        ${i < c.signals ? 'bg-green-500/20 text-green-400 border border-green-500/30' : dark ? 'bg-white/5 text-gray-600' : 'bg-gray-100 text-gray-400'}`}>
                      {i < c.signals ? '✓' : '·'}
                    </div>
                  ))}
                  <span className={`text-xs ml-1 ${muted}`}>{c.signals}/6 verified</span>
                </div>
              </div>
            ))}
          </div>

          {/* Summary sidebar */}
          <div className="space-y-5">
            <div className={`${cardC} p-6`}>
              <h3 className="font-syne font-bold mb-4">Claims Summary</h3>
              {[
                ['Total Claims',    '3'],
                ['Auto-Approved',   '2 (67%)'],
                ['Under Review',    '1'],
                ['Total Paid Out',  '₹1,400'],
                ['Avg Payout Time', '78 min'],
                ['Fraud Flags',     '0'],
              ].map(([k,v]) => (
                <div key={k} className={`flex justify-between py-2.5 border-b last:border-0 text-sm ${dark ? 'border-white/5' : 'border-gray-100'}`}>
                  <span className={muted}>{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>

            <div className={`${cardC} p-5`}>
              <h4 className="font-syne font-semibold mb-3 text-sm">Payout Timeline</h4>
              <div className="space-y-2 text-sm">
                {[
                  { step:'Trigger fires',    time:'T+0',      done:true  },
                  { step:'GPS validation',   time:'T+5 min',  done:true  },
                  { step:'6-signal check',   time:'T+10 min', done:true  },
                  { step:'Claim initiated',  time:'T+12 min', done:true  },
                  { step:'UPI transfer',     time:'T+90 min', done:false },
                ].map(s => (
                  <div key={s.step} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0
                      ${s.done ? 'bg-green-500/20 text-green-400 border border-green-500/30' : dark ? 'bg-white/8' : 'bg-gray-200'}`}>
                      {s.done ? '✓' : ''}
                    </div>
                    <span className={`flex-1 ${s.done ? '' : muted}`}>{s.step}</span>
                    <span className={`text-xs ${muted}`}>{s.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'simulate' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className={`${cardC} p-7`}>
            <h3 className="font-syne font-bold mb-2">Simulate Auto-Claim</h3>
            <p className={`text-sm ${muted} mb-6`}>
              This runs the full 6-signal fraud detection pipeline on your profile — the same process
              that fires automatically when a parametric trigger is detected in your zone.
            </p>

            <div className={`rounded-xl p-4 mb-6 ${dark ? 'bg-white/4 border border-white/8' : 'bg-gray-50 border border-gray-200'}`}>
              <h4 className={`text-xs uppercase tracking-wider font-semibold ${muted} mb-3`}>6 Signals Checked</h4>
              <div className="space-y-2">
                {SIGNALS.map(s => (
                  <div key={s.id} className="flex items-start gap-3 text-sm">
                    <Shield size={14} className="text-orange-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-medium">{s.label}</span>
                      <span className={`text-xs ${muted} ml-2`}>— {s.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-xl p-4 mb-6 ${dark ? 'bg-orange-500/5 border border-orange-500/15' : 'bg-orange-50 border border-orange-200'}`}>
              <p className="text-xs text-orange-400">
                ⚡ A claim passes if <strong>≥ 4 of 6 signals</strong> confirm genuine presence and activity.
                Confidence is scored: High (4–6) → auto-approve · Medium (2–3) → 2hr soft hold · Low (0–1) → manual review.
              </p>
            </div>

            <button onClick={handleSimulate} disabled={simulating} className="btn-primary w-full">
              {simulating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Running fraud check…
                </>
              ) : (
                <><Zap size={16} /> Run Fraud Detection Simulation</>
              )}
            </button>
          </div>

          {/* Result panel */}
          {simResult ? (
            <div className={`${cardC} p-7`}>
              <h3 className="font-syne font-bold mb-4">Fraud Check Result</h3>

              {/* Confidence verdict */}
              <div className={`rounded-xl p-5 mb-5 border ${
                simResult.color === 'green' ? 'bg-green-500/10 border-green-500/25' :
                simResult.color === 'amber' ? 'bg-amber-500/10 border-amber-500/25' :
                                              'bg-red-500/10   border-red-500/25'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl
                    ${simResult.color==='green' ? 'bg-green-500/20' : simResult.color==='amber' ? 'bg-amber-500/20' : 'bg-red-500/20'}`}>
                    {simResult.color==='green' ? '✅' : simResult.color==='amber' ? '⏳' : '🚨'}
                  </div>
                  <div>
                    <div className={`font-syne font-bold ${
                      simResult.color==='green' ? 'text-green-400' : simResult.color==='amber' ? 'text-amber-400' : 'text-red-400'
                    }`}>{simResult.confidence} Confidence</div>
                    <div className={`text-xs ${muted}`}>{simResult.score}/6 signals passed</div>
                  </div>
                </div>
                <p className={`text-sm ${muted}`}>{simResult.action}</p>
                <p className="text-sm mt-2 font-medium">{simResult.workerMessage}</p>
              </div>

              {/* Signal breakdown */}
              <div className="space-y-2">
                {SIGNALS.map(s => {
                  const sig = simResult.signals[s.id];
                  return (
                    <div key={s.id} className={`flex items-start gap-3 p-3 rounded-xl text-sm border ${
                      sig.pass
                        ? dark ? 'bg-green-500/5 border-green-500/15' : 'bg-green-50 border-green-200'
                        : dark ? 'bg-red-500/5   border-red-500/15'   : 'bg-red-50   border-red-200'
                    }`}>
                      <span className={sig.pass ? 'text-green-400' : 'text-red-400'}>
                        {sig.pass ? '✓' : '✗'}
                      </span>
                      <div className="flex-1">
                        <div className="font-medium text-xs mb-0.5">{s.label}</div>
                        <div className={`text-xs ${muted}`}>{sig.detail}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className={`${cardC} p-7 flex items-center justify-center`}>
              <div className="text-center">
                <div className="text-4xl mb-3">🔍</div>
                <p className={`${muted} text-sm`}>Run the simulation to see<br/>the fraud detection results.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}