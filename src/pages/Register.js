import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, Shield, CheckCircle, MapPin, User, Briefcase, Eye } from 'lucide-react';
import { calculatePremium, TIERS, ZONE_RISK } from '../utils/premiumEngine';
import { CITIES } from '../utils/mockData';

const STEP_LABELS = ['Personal Info', 'Work Details', 'Zone Mapping', 'Review & Activate'];

export default function Register({ navigate, dark, setWorker }) {
  const [step,    setStep]    = useState(0);
  const [done,    setDone]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [form,    setForm]    = useState({
    name: '', phone: '', aadhaar: '', email: '',
    platform: 'Zomato', vehicleType: 'Motorcycle', yearsExp: '2',
    tier: 'standard', city: 'Bengaluru', agreedToTerms: false,
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const muted = dark ? 'text-gray-400' : 'text-gray-500';
  const cardC = dark ? 'glass-card' : 'light-card';

  const calc = calculatePremium({
    tier: form.tier, city: form.city, yearsExp: form.yearsExp, claimsFreeWeeks: 0,
  });

  const zoneInfo = ZONE_RISK[form.city] || { score: 1.0, label: 'Unknown', color: 'gray' };

  const handleActivate = () => {
    setLoading(true);
    setTimeout(() => {
      const workerId = 'WRK-' + form.name.slice(0,3).toUpperCase().replace(/[^A-Z]/g,'X') + Math.floor(Math.random()*900+100);
      setWorker({
        ...form,
        id: workerId,
        premium: calc.final,
        zone: 'V-' + Math.floor(Math.random()*90+10),
        zoneId: '8b1f8d' + Math.random().toString(16).slice(2,10),
        coverageActive: true,
        claimsFreeWeeks: 0,
        trustScore: 88,
        joinedDate: new Date().toISOString().slice(0,10),
      });
      setLoading(false);
      setDone(true);
    }, 2000);
  };

  if (done) return <SuccessScreen form={form} calc={calc} navigate={navigate} dark={dark} />;

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-lg mx-auto">

        {/* Back */}
        <button onClick={() => step === 0 ? navigate('landing') : setStep(step - 1)}
          className={`flex items-center gap-2 text-sm ${muted} hover:text-orange-400 mb-8 transition-colors`}>
          <ArrowLeft size={15} />
          {step === 0 ? 'Back to home' : 'Previous step'}
        </button>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-3">
            {STEP_LABELS.map((l, i) => (
              <div key={i} className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-all
                  ${i < step  ? 'bg-green-500 text-white'
                  : i === step ? 'bg-orange-500 text-white glow-sm'
                  : dark       ? 'bg-white/8 text-gray-500'
                  :              'bg-gray-200 text-gray-400'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-xs text-center leading-tight hidden sm:block
                  ${i === step ? 'text-orange-400' : muted}`}>
                  {l}
                </span>
              </div>
            ))}
          </div>
          <div className={`h-1 rounded-full ${dark ? 'bg-white/8' : 'bg-gray-200'}`}>
            <div className="h-1 rounded-full bg-orange-500 transition-all duration-500"
              style={{ width: `${(step / (STEP_LABELS.length - 1)) * 100}%` }} />
          </div>
        </div>

        <div className={`${cardC} p-8`}>

          {/* ── Step 0: Personal ── */}
          {step === 0 && (
            <StepSection title="Personal Information" sub="Your basic details for the insurance policy." muted={muted}>
              <Field label="Full Name" muted={muted}>
                <input className="input" placeholder="e.g. Raju Kumar"
                  value={form.name} onChange={e => set('name', e.target.value)} />
              </Field>
              <Field label="Phone Number" muted={muted}>
                <input className="input" placeholder="+91 98765 43210" type="tel"
                  value={form.phone} onChange={e => set('phone', e.target.value)} />
              </Field>
              <Field label="Aadhaar Number" muted={muted}>
                <input className="input" placeholder="XXXX XXXX XXXX" maxLength="14"
                  value={form.aadhaar} onChange={e => set('aadhaar', e.target.value)} />
              </Field>
              <Field label="Email (optional)" muted={muted}>
                <input className="input" placeholder="raju@email.com" type="email"
                  value={form.email} onChange={e => set('email', e.target.value)} />
              </Field>
            </StepSection>
          )}

          {/* ── Step 1: Work Details ── */}
          {step === 1 && (
            <StepSection title="Work Details" sub="These factors influence your dynamic premium." muted={muted}>
              <Field label="Delivery Platform" muted={muted}>
                <div className="flex gap-3">
                  {['Zomato', 'Swiggy', 'Both'].map(p => (
                    <button key={p} onClick={() => set('platform', p)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all
                        ${form.platform === p
                          ? 'border-orange-500 bg-orange-500/15 text-orange-400'
                          : dark ? 'border-white/10 text-gray-400 hover:border-white/20'
                          :       'border-gray-300 text-gray-600 hover:border-gray-400'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Vehicle Type" muted={muted}>
                <select className="input" value={form.vehicleType} onChange={e => set('vehicleType', e.target.value)}>
                  {['Motorcycle', 'Scooter', 'Bicycle', 'On Foot'].map(v => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </Field>
              <Field label="Years of Experience" muted={muted}>
                <select className="input" value={form.yearsExp} onChange={e => set('yearsExp', e.target.value)}>
                  {['Less than 1','1','2','3','4','5+'].map(v => <option key={v}>{v}</option>)}
                </select>
              </Field>
              <Field label="Coverage Tier" muted={muted}>
                <div className="flex flex-col gap-2">
                  {Object.entries(TIERS).map(([key, t]) => (
                    <button key={key} onClick={() => set('tier', key)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all
                        ${form.tier === key
                          ? 'border-orange-500 bg-orange-500/10'
                          : dark ? 'border-white/8 hover:border-white/15' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                          ${form.tier === key ? 'border-orange-500' : 'border-gray-500'}`}>
                          {form.tier === key && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                        </div>
                        <span className="font-medium">{t.label}</span>
                        <span className={muted}>— ₹{t.base}/week base</span>
                      </div>
                      <span className="text-green-400 text-xs">Max ₹{t.maxPayout}/day</span>
                    </button>
                  ))}
                </div>
              </Field>
              <div className={`rounded-xl p-4 ${dark ? 'bg-orange-500/5 border border-orange-500/15' : 'bg-orange-50 border border-orange-200'}`}>
                <p className="text-xs text-orange-400">
                  💡 More experience = lower premium. Your final price = Base × Zone Risk × Your History Score.
                  The example in our README: Standard ₹59 × 1.05 zone − ₹8 loyalty = <strong>₹54/week.</strong>
                </p>
              </div>
            </StepSection>
          )}

          {/* ── Step 2: Zone Mapping ── */}
          {step === 2 && (
            <StepSection title="Zone Mapping" sub="GPS auto-detects your 500m H3 delivery micro-zone." muted={muted}>
              <Field label="Your City" muted={muted}>
                <select className="input" value={form.city} onChange={e => set('city', e.target.value)}>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>

              {/* Zone visual */}
              <div className={`rounded-xl p-5 ${dark ? 'bg-[#1c2340] border border-white/8' : 'bg-gray-50 border border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin size={15} className="text-orange-400" />
                    <span className="text-sm font-medium">Detected Zone</span>
                  </div>
                  <span className="badge badge-green text-xs">● Live GPS</span>
                </div>

                {/* Hex grid */}
                <div className="flex justify-center items-center gap-2 my-5 flex-wrap">
                  {[...Array(7)].map((_, i) => (
                    <div key={i}
                      className="hex-cell w-12 h-14 flex items-center justify-center text-xs"
                      style={{
                        background: i === 3
                          ? 'rgba(249,115,22,0.65)'
                          : dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                        color: i === 3 ? 'white' : 'transparent',
                      }}>
                      {i === 3 ? '📍' : '·'}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Zone Cell',     'V-23 (' + form.city.slice(0,3).toUpperCase() + ')'],
                    ['H3 Resolution', 'Level 11 — 500m'],
                    ['Risk Level',    zoneInfo.label],
                    ['Risk Score',    zoneInfo.score.toFixed(2) + '× multiplier'],
                    ['Zone Type',     'Urban Delivery Zone'],
                    ['Drainage Index','0.68 (moderate)'],
                  ].map(([k, v]) => (
                    <div key={k} className={`rounded-lg p-3 ${dark ? 'bg-white/4' : 'bg-white border border-gray-100'}`}>
                      <div className={`text-xs ${muted} mb-0.5`}>{k}</div>
                      <div className="text-sm font-medium">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </StepSection>
          )}

          {/* ── Step 3: Review ── */}
          {step === 3 && (
            <StepSection title="Review & Activate" sub="Confirm your details before coverage begins." muted={muted}>
              <div className={`rounded-xl divide-y ${dark ? 'divide-white/5 bg-white/4' : 'divide-gray-100 bg-gray-50'}`}>
                {[
                  ['Name',     form.name     || '—'],
                  ['Phone',    form.phone    || '—'],
                  ['Platform', form.platform],
                  ['Vehicle',  form.vehicleType],
                  ['City',     form.city],
                  ['Zone',     'V-23 (' + form.city + ')'],
                  ['Tier',     TIERS[form.tier]?.label],
                  ['Experience', form.yearsExp + ' yr(s)'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between px-4 py-3 text-sm">
                    <span className={muted}>{k}</span>
                    <span className="font-medium">{v}</span>
                  </div>
                ))}
              </div>

              {/* Premium breakdown */}
              <div className={`rounded-xl p-5 border ${dark ? 'border-orange-500/25 bg-orange-500/5' : 'border-orange-200 bg-orange-50'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-syne font-bold">Your Weekly Premium</span>
                  <span className="font-syne font-extrabold text-2xl text-orange-400">₹{calc.final}</span>
                </div>
                <div className={`text-xs ${muted} space-y-1`}>
                  <div className="flex justify-between">
                    <span>Base ({TIERS[form.tier]?.label})</span><span>₹{calc.base}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Zone Risk ({form.city})</span><span>× {calc.zoneRisk.score.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Worker History Score</span><span>× {calc.historyScore}</span>
                  </div>
                  {calc.loyaltyDiscount !== 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Loyalty Discount</span><span>₹{calc.loyaltyDiscount}</span>
                    </div>
                  )}
                  <div className={`flex justify-between pt-2 border-t font-medium ${dark ? 'border-white/10' : 'border-orange-200'}`}>
                    <span>Max Payout</span>
                    <span className="text-green-400">₹{TIERS[form.tier]?.maxPayout}/disruption day</span>
                  </div>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1 accent-orange-500"
                  checked={form.agreedToTerms}
                  onChange={e => set('agreedToTerms', e.target.checked)} />
                <span className={`text-sm ${muted}`}>
                  I agree to Prahari's terms of service and consent to parametric claim processing
                  based on real-time weather and civic data from OpenWeatherMap, AQICN, and IMD feeds.
                </span>
              </label>
            </StepSection>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step < 3 ? (
              <button onClick={() => setStep(step + 1)}
                className="btn-primary flex-1">
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={handleActivate}
                disabled={loading || !form.agreedToTerms}
                className={`btn-primary flex-1 ${(!form.agreedToTerms && !loading) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Activating Coverage…
                  </>
                ) : (
                  <><Shield size={16} /> Activate Coverage</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepSection({ title, sub, children, muted }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-syne text-xl font-bold mb-1">{title}</h2>
        <p className={`text-sm ${muted}`}>{sub}</p>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children, muted }) {
  return (
    <div>
      <label className={`block text-sm font-medium mb-1.5 ${muted}`}>{label}</label>
      {children}
    </div>
  );
}

function SuccessScreen({ form, calc, navigate, dark }) {
  const muted = dark ? 'text-gray-400' : 'text-gray-500';
  const cardC = dark ? 'glass-card' : 'light-card';
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className={`${cardC} p-10 max-w-md w-full text-center`}>
        <div className="w-20 h-20 rounded-full bg-green-500/12 border border-green-500/25 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-400" />
        </div>
        <h2 className="font-syne text-2xl font-bold mb-2">You're Covered! 🎉</h2>
        <p className={`${muted} mb-1`}>Welcome to Prahari, <strong>{form.name || 'Delivery Partner'}</strong></p>
        <p className={`${muted} text-sm mb-7`}>Your weekly premium: <span className="text-orange-400 font-bold text-xl">₹{calc.final}</span></p>

        <div className={`rounded-xl mb-7 overflow-hidden ${dark ? 'bg-white/4 border border-white/8' : 'bg-gray-50 border border-gray-200'}`}>
          <div className="px-4 py-2 border-b border-white/5 text-xs font-syne font-semibold text-orange-400 uppercase tracking-wider text-left">
            Policy Summary
          </div>
          {[
            ['Tier',        TIERS[form.tier]?.label + ' Coverage'],
            ['Zone',        'V-23, ' + form.city],
            ['Triggers',    '5 parametric triggers active'],
            ['Max Payout',  '₹' + TIERS[form.tier]?.maxPayout + '/disruption day'],
            ['Payout Time', 'Within 90 minutes · Auto UPI'],
            ['Renewal',     'Every 7 days · Auto-debit'],
          ].map(([k, v]) => (
            <div key={k} className={`flex justify-between px-4 py-3 text-sm border-b last:border-0 ${dark ? 'border-white/5' : 'border-gray-100'}`}>
              <span className={muted}>{k}</span>
              <span className="font-medium text-right">{v}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={() => navigate('dashboard')} className="btn-primary flex-1">
            Go to Dashboard <ChevronRight size={16} />
          </button>
          <button onClick={() => navigate('triggers')} className="btn-ghost flex-1">
            View Triggers
          </button>
        </div>
      </div>
    </div>
  );
}