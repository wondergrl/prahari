import React, { useState } from 'react';
import { Brain, TrendingUp, BarChart2, Shield, ChevronRight, Info, RefreshCw } from 'lucide-react';
import { mlPredict, getActuarialSummary, MODEL_METADATA, FEATURES } from '../utils/mlEngine';
import { CITIES } from '../utils/mockData';

const TABS = ['ML Model', 'SHAP Values', 'Actuarial', 'Model Card'];

export default function MLModel({ navigate, dark, worker }) {
  const [tab, setTab] = useState('ML Model');
  const [inputs, setInputs] = useState({
    city: worker?.city || 'Bengaluru',
    yearsExp: worker?.yearsExp || '2',
    vehicleType: worker?.vehicleType || 'Motorcycle',
    claimsFreeWeeks: 0,
    adverseWeather: false,
    tier: worker?.tier || 'standard',
  });
  const [running, setRunning] = useState(false);
  const [result,  setResult]  = useState(() => mlPredict({ ...{
    city:'Bengaluru', yearsExp:'2', vehicleType:'Motorcycle',
    claimsFreeWeeks:0, adverseWeather:false, tier:'standard',
  }}));

  const actData = getActuarialSummary();

  const set = (k, v) => setInputs(p => ({ ...p, [k]: v }));

  const runModel = () => {
    setRunning(true);
    setTimeout(() => { setResult(mlPredict(inputs)); setRunning(false); }, 900);
  };

  const muted = dark ? 'text-gray-400' : 'text-gray-500';
  const cardC = dark ? 'glass-card'    : 'light-card';
  const divid = dark ? 'border-white/5' : 'border-gray-100';

  const maxShap = Math.max(...(result?.shap || []).map(s => Math.abs(s.contribution)));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Brain size={20} className="text-orange-400" />
            <h1 className="font-syne text-2xl font-bold">AI / ML Engine</h1>
          </div>
          <p className={`text-sm ${muted}`}>
            XGBoost Gradient Boosted Trees · {MODEL_METADATA.features} features · AUC {MODEL_METADATA.testAUC}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={tab === t ? 'btn-primary btn-sm text-xs' : 'btn-ghost btn-sm text-xs'}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab: ML Model ── */}
      {tab === 'ML Model' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className={`${cardC} p-7`}>
            <h3 className="font-syne font-bold mb-5">Feature Inputs</h3>
            <div className="space-y-4">
              <Row label="City / Zone" muted={muted}>
                <select className="input text-sm py-2" value={inputs.city} onChange={e => set('city', e.target.value)}>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </Row>
              <Row label="Experience" muted={muted}>
                <select className="input text-sm py-2" value={inputs.yearsExp} onChange={e => set('yearsExp', e.target.value)}>
                  {['Less than 1','1','2','3','4','5+'].map(v => <option key={v}>{v}</option>)}
                </select>
              </Row>
              <Row label="Vehicle Type" muted={muted}>
                <select className="input text-sm py-2" value={inputs.vehicleType} onChange={e => set('vehicleType', e.target.value)}>
                  {['Motorcycle','Scooter','Bicycle','On Foot'].map(v => <option key={v}>{v}</option>)}
                </select>
              </Row>
              <Row label="Coverage Tier" muted={muted}>
                <select className="input text-sm py-2" value={inputs.tier} onChange={e => set('tier', e.target.value)}>
                  {['basic','standard','premium'].map(v => <option key={v}>{v[0].toUpperCase()+v.slice(1)}</option>)}
                </select>
              </Row>
              <Row label={`Claims-Free Weeks: ${inputs.claimsFreeWeeks}`} muted={muted}>
                <input type="range" min="0" max="12" value={inputs.claimsFreeWeeks}
                  onChange={e => set('claimsFreeWeeks', +e.target.value)}
                  className="w-full accent-orange-500" />
              </Row>
              <div className={`flex items-center justify-between p-3 rounded-xl ${dark ? 'bg-white/4' : 'bg-gray-50'}`}>
                <span className="text-sm">Adverse 7-day forecast</span>
                <button onClick={() => set('adverseWeather', !inputs.adverseWeather)}
                  className={`relative w-10 h-5 rounded-full transition-all ${inputs.adverseWeather ? 'bg-orange-500' : dark ? 'bg-white/15' : 'bg-gray-300'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${inputs.adverseWeather ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
              <button onClick={runModel} disabled={running} className="btn-primary w-full">
                {running ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Running inference…</>
                ) : (
                  <><Brain size={16} />Run XGBoost Inference</>
                )}
              </button>
            </div>
          </div>

          {/* Output */}
          <div className="space-y-5">
            {/* Risk score */}
            <div className={`${cardC} p-6 text-center`}
              style={dark ? {boxShadow:'0 0 40px rgba(249,115,22,0.07)'} : {}}>
              <p className={`text-sm ${muted} mb-1`}>ML Risk Score</p>
              <div className="font-syne text-5xl font-extrabold gradient-text mb-1">
                {result.riskScore.toFixed(3)}
              </div>
              <p className={`text-xs ${muted} mb-4`}>Ensemble output (0 = safe, 1 = high risk)</p>
              <div className="flex gap-4 justify-center text-center text-sm">
                <div>
                  <div className="font-syne font-bold text-orange-400">₹{result.finalPremium}</div>
                  <div className={`text-xs ${muted}`}>Final premium</div>
                </div>
                <div>
                  <div className="font-syne font-bold">{result.zoneMultiplier}×</div>
                  <div className={`text-xs ${muted}`}>Zone multiplier</div>
                </div>
                <div>
                  <div className="font-syne font-bold">{(result.modelConfidence * 100).toFixed(1)}%</div>
                  <div className={`text-xs ${muted}`}>Confidence</div>
                </div>
              </div>
            </div>

            {/* Ensemble trees */}
            <div className={`${cardC} p-5`}>
              <h4 className="font-syne font-semibold mb-4 text-sm">Gradient Boosting — 3 Weak Learners</h4>
              {[
                { label:'Tree 1 — Flood & Drainage Split', val: result.tree1Output, desc:'Primary zone risk driver' },
                { label:'Tree 2 — Worker History Residual', val: result.tree2Output, desc:'Corrects for worker behaviour' },
                { label:'Tree 3 — Weather Fine-Tune',      val: result.tree3Output, desc:'Final ensemble output' },
              ].map((t, i) => (
                <div key={i} className={`py-3 border-b last:border-0 ${divid}`}>
                  <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="font-medium">{t.label}</span>
                    <span className="font-syne font-bold text-orange-400">{t.val.toFixed(4)}</span>
                  </div>
                  <div className={`h-1.5 rounded-full ${dark ? 'bg-white/8' : 'bg-gray-200'} mb-1`}>
                    <div className="h-1.5 rounded-full bg-orange-500 transition-all"
                      style={{width: Math.min(100, t.val * 200) + '%'}} />
                  </div>
                  <p className={`text-xs ${muted}`}>{t.desc}</p>
                </div>
              ))}
            </div>

            {/* Feature vector */}
            <div className={`${cardC} p-5`}>
              <h4 className="font-syne font-semibold mb-4 text-sm">Feature Vector (Model Input)</h4>
              <div className="space-y-1.5">
                {FEATURES.map(f => (
                  <div key={f.id} className="flex justify-between text-xs py-1">
                    <span className={muted}>{f.label}</span>
                    <span className="font-medium font-mono">
                      {typeof result.featureVector[f.id] === 'number'
                        ? result.featureVector[f.id].toFixed(3)
                        : '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: SHAP Values ── */}
      {tab === 'SHAP Values' && (
        <div className={`${cardC} p-7`}>
          <div className="mb-6">
            <h3 className="font-syne font-bold mb-1">SHAP Feature Contributions</h3>
            <p className={`text-sm ${muted}`}>
              Each bar shows how much a feature pushes the risk score UP (orange) or DOWN (green)
              relative to the population average. This is how we explain every premium to regulators.
            </p>
          </div>
          <div className="space-y-4">
            {[...result.shap].sort((a,b) => Math.abs(b.contribution) - Math.abs(a.contribution)).map(s => {
              const pct = maxShap ? Math.abs(s.contribution) / maxShap * 100 : 0;
              const positive = s.contribution > 0;
              return (
                <div key={s.id}>
                  <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="font-medium">{s.label}</span>
                    <span className={`font-mono font-bold text-xs ${positive ? 'text-red-400' : 'text-green-400'}`}>
                      {positive ? '+' : ''}{s.contribution.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`flex-1 h-3 rounded-full ${dark ? 'bg-white/6' : 'bg-gray-100'} relative`}>
                      <div className={`absolute top-0 h-3 rounded-full transition-all ${positive ? 'bg-red-500/70 left-1/2' : 'bg-green-500/70 right-1/2'}`}
                        style={{width: (pct / 2) + '%'}} />
                    </div>
                    <span className={`text-xs ${muted} w-24 text-right`}>
                      val: {result.featureVector[s.id]?.toFixed(3)}
                    </span>
                  </div>
                  <p className={`text-xs ${muted} mt-0.5`}>
                    Weight: {(s.weight * 100).toFixed(0)}% importance · {s.unit}
                  </p>
                </div>
              );
            })}
          </div>
          <div className={`mt-6 p-4 rounded-xl text-xs ${dark ? 'bg-blue-500/8 border border-blue-500/15' : 'bg-blue-50 border border-blue-200'} text-blue-400`}>
            <strong>Regulatory Note:</strong> SHAP values make Prahari's pricing fully explainable to IRDAI.
            Every worker can see exactly why their premium is what it is. No black box.
          </div>
        </div>
      )}

      {/* ── Tab: Actuarial ── */}
      {tab === 'Actuarial' && (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label:'Loss Ratio',         value:(actData.lossRatio * 100).toFixed(1) + '%', sub:'Target < 60%',              good: actData.lossRatio < 0.60 },
              { label:'Combined Ratio',      value:(actData.combinedRatio * 100).toFixed(1) + '%', sub:'< 100% = profitable',   good: actData.combinedRatio < 1.0 },
              { label:'Reserve Adequacy',    value:actData.reserveAdequacy,                   sub:'IRDAI 3-month mandate',      good: true },
              { label:'Break-Even Premium',  value:'₹' + (actData.breakEven),                sub:'vs ₹39 base (above BEP ✓)', good: true },
            ].map((k, i) => (
              <div key={i} className={`${cardC} p-5`}>
                <div className={`text-xs ${muted} mb-1`}>{k.label}</div>
                <div className={`font-syne text-2xl font-bold mb-1 ${k.good ? 'text-green-400' : 'text-red-400'}`}>
                  {k.value}
                </div>
                <div className={`text-xs ${muted}`}>{k.sub}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* P&L */}
            <div className={`${cardC} p-6`}>
              <h3 className="font-syne font-bold mb-5">Weekly P&L Statement</h3>
              <div className="space-y-0">
                {[
                  { label:'Active Policies',       value:actData.activePolicies.toLocaleString(),   color:'' },
                  { label:'Gross Premiums Collected', value:'₹' + actData.weeklyPremiums.toLocaleString(), color:'text-green-400' },
                  { label:'Claims Paid',            value:'−₹' + actData.weeklyClaimsPaid.toLocaleString(), color:'text-red-400' },
                  { label:'Operating Expenses (28%)', value:'−₹' + Math.round(actData.weeklyPremiums * 0.28).toLocaleString(), color:'text-amber-400' },
                  { label:'Net Profit',             value:'₹' + Math.round(actData.weeklyPremiums - actData.weeklyClaimsPaid - actData.weeklyPremiums * 0.28).toLocaleString(), color:'text-orange-400' },
                ].map((r, i) => (
                  <div key={i} className={`flex justify-between py-3 border-b last:border-0 text-sm ${divid}`}>
                    <span className={muted}>{r.label}</span>
                    <span className={`font-syne font-bold ${r.color}`}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* City risk ranking */}
            <div className={`${cardC} p-6`}>
              <h3 className="font-syne font-bold mb-5">Zone Risk Ranking (ML Output)</h3>
              <div className="space-y-3">
                {actData.cityRiskRanking.map((c, i) => (
                  <div key={c.city} className="flex items-center gap-3 text-sm">
                    <span className={`w-5 text-xs font-bold ${muted}`}>{i+1}</span>
                    <span className="flex-1 font-medium">{c.city}</span>
                    <div className={`w-28 h-2 rounded-full ${dark ? 'bg-white/8' : 'bg-gray-200'}`}>
                      <div className={`h-2 rounded-full ${
                        c.score > 0.75 ? 'bg-red-500' : c.score > 0.50 ? 'bg-amber-500' : 'bg-green-500'
                      }`} style={{width: c.score * 100 + '%'}} />
                    </div>
                    <span className="text-xs font-mono w-10 text-right">{c.score.toFixed(2)}</span>
                    <span className={`text-xs w-4 ${c.trend==='↑'?'text-red-400':c.trend==='↓'?'text-green-400':muted}`}>
                      {c.trend}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reserve */}
            <div className={`${cardC} p-6 lg:col-span-2`}>
              <h3 className="font-syne font-bold mb-2">IRDAI Reserve Adequacy</h3>
              <p className={`text-xs ${muted} mb-5`}>
                IRDAI mandates insurers hold minimum 3 months of expected claims in reserve.
                Prahari's solvency margin exceeds the statutory minimum.
              </p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label:'Reserve Held',     value:'₹6,50,000', note:'Current balance' },
                  { label:'Reserve Required', value:'₹4,95,360', note:'IRDAI 12-week mandate' },
                  { label:'Solvency Margin',  value:'131.2%',     note:'> 100% required ✓' },
                ].map((r,i) => (
                  <div key={i} className={`rounded-xl p-4 text-center ${dark ? 'bg-white/4' : 'bg-gray-50 border border-gray-100'}`}>
                    <div className="font-syne font-bold text-lg text-green-400">{r.value}</div>
                    <div className="text-xs font-medium mt-1">{r.label}</div>
                    <div className={`text-xs ${muted}`}>{r.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Model Card ── */}
      {tab === 'Model Card' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className={`${cardC} p-7`}>
            <h3 className="font-syne font-bold mb-5">Model Card</h3>
            <div className="space-y-0">
              {Object.entries(MODEL_METADATA).map(([k, v]) => (
                <div key={k} className={`flex justify-between gap-4 py-3 border-b last:border-0 text-sm ${divid}`}>
                  <span className={`${muted} shrink-0`}>{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="font-medium text-right">{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <div className={`${cardC} p-6`}>
              <h4 className="font-syne font-bold mb-4">Model Performance</h4>
              {[
                { label:'Validation AUC', value:MODEL_METADATA.validationAUC, max:1, color:'green' },
                { label:'Test AUC',       value:MODEL_METADATA.testAUC,       max:1, color:'green' },
                { label:'Precision',      value:MODEL_METADATA.precision,     max:1, color:'blue'  },
                { label:'Recall',         value:MODEL_METADATA.recall,        max:1, color:'blue'  },
                { label:'F1 Score',       value:MODEL_METADATA.f1Score,       max:1, color:'amber' },
              ].map(m => (
                <div key={m.label} className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className={muted}>{m.label}</span>
                    <span className="font-syne font-bold">{m.value.toFixed(3)}</span>
                  </div>
                  <div className={`h-2 rounded-full ${dark ? 'bg-white/8' : 'bg-gray-200'}`}>
                    <div className={`h-2 rounded-full bg-${m.color}-500`}
                      style={{width: (m.value / m.max * 100) + '%'}} />
                  </div>
                </div>
              ))}
            </div>
            <div className={`${cardC} p-5`}>
              <h4 className="font-syne font-semibold mb-3 text-sm">Training Data Sources</h4>
              {[
                '14,200 synthetic worker-week records',
                'IMD rainfall data (2021–2024) — 4 cities',
                'NDMA flood alert history (district level)',
                'CPCB AQI historical records',
                'Zomato/Swiggy delivery density (anonymised)',
              ].map((d, i) => (
                <div key={i} className={`text-xs ${muted} py-1.5 border-b last:border-0 ${divid}`}>
                  · {d}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, children, muted }) {
  return (
    <div>
      <label className={`block text-xs font-medium ${muted} mb-1.5`}>{label}</label>
      {children}
    </div>
  );
}