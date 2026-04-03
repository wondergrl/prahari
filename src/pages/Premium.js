import React, { useState } from 'react';
import { TrendingUp, Info, ChevronRight, RefreshCw } from 'lucide-react';
import { calculatePremium, TIERS, ZONE_RISK } from '../utils/premiumEngine';
import { CITIES } from '../utils/mockData';

export default function Premium({ navigate, dark, worker }) {
  const [inputs, setInputs] = useState({
    tier: worker?.tier || 'standard',
    city: worker?.city || 'Bengaluru',
    yearsExp: worker?.yearsExp || '2',
    claimsFreeWeeks: 0,
    adverseWeather: false,
  });

  const set = (k, v) => setInputs(p => ({ ...p, [k]: v }));
  const result = calculatePremium(inputs);

  const muted = dark ? 'text-gray-400' : 'text-gray-500';
  const cardC = dark ? 'glass-card'    : 'light-card';
  const divid = dark ? 'border-white/5' : 'border-gray-100';

  // Raju example from README
  const rajuExample = calculatePremium({ tier:'standard', city:'Bengaluru', yearsExp:'3', claimsFreeWeeks:3 });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-syne text-2xl font-bold mb-1">Premium Calculator</h1>
        <p className={`text-sm ${muted}`}>
          AI-driven dynamic pricing. Formula: <span className="text-orange-400">Base × Zone Risk × Worker History ± Adjustments</span>
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* Inputs */}
        <div className={`${cardC} p-7`}>
          <h3 className="font-syne font-bold mb-6">Your Parameters</h3>

          <div className="space-y-6">
            {/* Tier */}
            <div>
              <label className={`block text-sm font-medium ${muted} mb-2`}>Coverage Tier</label>
              <div className="flex flex-col gap-2">
                {Object.entries(TIERS).map(([key, t]) => (
                  <button key={key} onClick={() => set('tier', key)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all
                      ${inputs.tier === key
                        ? 'border-orange-500 bg-orange-500/10'
                        : dark ? 'border-white/8 hover:border-white/15' : 'border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                        ${inputs.tier === key ? 'border-orange-500' : 'border-gray-500'}`}>
                        {inputs.tier === key && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                      </div>
                      <span className="font-medium">{t.label}</span>
                      <span className={muted}>₹{t.base}/wk base</span>
                    </div>
                    <span className="text-green-400 text-xs">Max ₹{t.maxPayout}/day</span>
                  </button>
                ))}
              </div>
            </div>

            {/* City */}
            <div>
              <label className={`block text-sm font-medium ${muted} mb-2`}>Your City / Zone</label>
              <select className="input" value={inputs.city} onChange={e => set('city', e.target.value)}>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <div className={`mt-2 text-xs ${muted} flex items-center gap-1`}>
                <Info size={12} />
                Zone risk for {inputs.city}: {ZONE_RISK[inputs.city]?.score.toFixed(2)}× ({ZONE_RISK[inputs.city]?.label})
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className={`block text-sm font-medium ${muted} mb-2`}>Years of Experience</label>
              <select className="input" value={inputs.yearsExp} onChange={e => set('yearsExp', e.target.value)}>
                {['Less than 1','1','2','3','4','5+'].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>

            {/* Claims-free weeks */}
            <div>
              <label className={`block text-sm font-medium ${muted} mb-2`}>
                Claims-Free Weeks (loyalty discount at 4+)
              </label>
              <div className="flex items-center gap-4">
                <input type="range" min="0" max="12" step="1"
                  value={inputs.claimsFreeWeeks}
                  onChange={e => set('claimsFreeWeeks', parseInt(e.target.value))}
                  className="flex-1 accent-orange-500" />
                <span className="w-8 text-center font-syne font-bold text-orange-400">
                  {inputs.claimsFreeWeeks}
                </span>
              </div>
              {inputs.claimsFreeWeeks >= 4 && (
                <p className="text-xs text-green-400 mt-1">✓ Loyalty discount of ₹8/week applied</p>
              )}
            </div>

            {/* Adverse weather toggle */}
            <div className={`flex items-center justify-between p-4 rounded-xl ${dark ? 'bg-white/4 border border-white/8' : 'bg-gray-50 border border-gray-200'}`}>
              <div>
                <div className="text-sm font-medium">Adverse Weather Next 7 Days</div>
                <div className={`text-xs ${muted}`}>+₹3–10 surcharge when forecast is bad</div>
              </div>
              <button onClick={() => set('adverseWeather', !inputs.adverseWeather)}
                className={`relative w-11 h-6 rounded-full transition-all ${inputs.adverseWeather ? 'bg-orange-500' : dark ? 'bg-white/15' : 'bg-gray-300'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${inputs.adverseWeather ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="space-y-5">
          {/* Big premium display */}
          <div className={`${cardC} p-7 text-center`}
            style={dark ? {boxShadow:'0 0 40px rgba(249,115,22,0.08)'} : {}}>
            <p className={`text-sm ${muted} mb-2`}>Your calculated weekly premium</p>
            <div className="font-syne text-6xl font-extrabold gradient-text mb-2">
              ₹{result.final}
            </div>
            <p className={`text-sm ${muted} mb-6`}>per week · {result.tier.label} tier</p>
            <div className="flex items-center justify-center gap-2 text-green-400 text-sm mb-6">
              <TrendingUp size={16} />
              Max payout: ₹{result.tier.maxPayout}/disruption day
            </div>

            {/* Breakdown */}
            <div className={`rounded-xl text-left divide-y ${dark ? 'divide-white/5 bg-white/4' : 'divide-gray-100 bg-gray-50'}`}>
              {[
                ['Base Premium', '₹' + result.base, ''],
                ['× Zone Risk (' + result.zoneRisk.label + ')', '× ' + result.zoneRisk.score.toFixed(2), ''],
                ['× Worker History', '× ' + result.historyScore, ''],
                ...(result.loyaltyDiscount !== 0 ? [['Loyalty Discount (4+ wks)', '−₹8', 'green']] : []),
                ...(result.weatherSurcharge !== 0 ? [['Adverse Weather Surcharge', '+₹6', 'amber']] : []),
              ].map(([k, v, accent]) => (
                <div key={k} className="flex justify-between items-center px-4 py-3 text-sm">
                  <span className={muted}>{k}</span>
                  <span className={`font-medium font-syne ${
                    accent === 'green' ? 'text-green-400' : accent === 'amber' ? 'text-amber-400' : ''
                  }`}>{v}</span>
                </div>
              ))}
              <div className={`flex justify-between items-center px-4 py-3 font-syne font-bold`}>
                <span>Final Weekly Premium</span>
                <span className="text-orange-400 text-lg">₹{result.final}</span>
              </div>
            </div>
          </div>

          {/* README example */}
          <div className={`${cardC} p-5`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">📖</span>
              <h4 className="font-syne font-semibold text-sm">README Example — Raju</h4>
            </div>
            <p className={`text-xs ${muted} mb-3 leading-relaxed`}>
              Raju operates in Zone V-23 (medium risk, Bengaluru). Standard tier (₹59 base).
              Zone risk multiplier 1.05. No claims in 3 weeks (−₹8 loyalty).
            </p>
            <div className={`rounded-lg p-3 ${dark ? 'bg-white/4' : 'bg-gray-50'} text-sm font-syne font-bold flex items-center justify-between`}>
              <span className={muted}>₹59 × 1.05 − ₹8 =</span>
              <span className="text-orange-400">₹54/week</span>
            </div>
            <button onClick={() => setInputs({ tier:'standard', city:'Bengaluru', yearsExp:'3', claimsFreeWeeks:3, adverseWeather:false })}
              className={`mt-3 w-full flex items-center justify-center gap-2 text-xs ${muted} hover:text-orange-400 transition-colors`}>
              <RefreshCw size={12} /> Load Raju's example
            </button>
          </div>

          {/* Tier comparison */}
          <div className={`${cardC} p-5`}>
            <h4 className="font-syne font-semibold mb-4 text-sm">All Tiers — Same Zone</h4>
            <div className="space-y-2">
              {Object.keys(TIERS).map(key => {
                const r = calculatePremium({ ...inputs, tier: key });
                return (
                  <div key={key} className={`flex items-center justify-between text-sm px-3 py-2 rounded-lg
                    ${inputs.tier === key ? (dark ? 'bg-orange-500/10' : 'bg-orange-50') : ''}`}>
                    <div>
                      <span className="font-medium">{TIERS[key].label}</span>
                      <span className={`text-xs ${muted} ml-2`}>max ₹{TIERS[key].maxPayout}/day</span>
                    </div>
                    <span className={`font-syne font-bold ${inputs.tier === key ? 'text-orange-400' : muted}`}>
                      ₹{r.final}/wk
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <button onClick={() => navigate('register')} className="btn-primary w-full">
            Get This Premium <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}