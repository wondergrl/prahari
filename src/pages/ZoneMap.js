import React, { useState } from 'react';
import { MapPin, Info, ChevronRight } from 'lucide-react';
import { ZONE_RISK, CITIES } from '../utils/premiumEngine';
import { CITIES as CITY_LIST } from '../utils/mockData';

const RISK_COLOR = {
  green:  { bg:'bg-green-500/20',  border:'border-green-500/40',  text:'text-green-400',  fill:'rgba(34,197,94,0.5)'   },
  amber:  { bg:'bg-amber-500/20',  border:'border-amber-500/40',  text:'text-amber-400',  fill:'rgba(251,191,36,0.5)'  },
  orange: { bg:'bg-orange-500/20', border:'border-orange-500/40', text:'text-orange-400', fill:'rgba(249,115,22,0.55)' },
  red:    { bg:'bg-red-500/20',    border:'border-red-500/40',    text:'text-red-400',    fill:'rgba(239,68,68,0.55)'  },
};

// 7-hex cluster layout positions (col, row offset)
const HEX_GRID = [
  { id:0, label:'H-21', rel:'NW',  risk:0.95, isUser:false },
  { id:1, label:'H-22', rel:'N',   risk:0.88, isUser:false },
  { id:2, label:'H-23', rel:'NE',  risk:1.05, isUser:false },
  { id:3, label:'V-23', rel:'You', risk:1.05, isUser:true  },
  { id:4, label:'V-24', rel:'SW',  risk:1.15, isUser:false },
  { id:5, label:'V-25', rel:'S',   risk:1.25, isUser:false },
  { id:6, label:'V-26', rel:'SE',  risk:0.98, isUser:false },
];

function riskColor(score) {
  if (score < 0.95) return 'green';
  if (score < 1.05) return 'amber';
  if (score < 1.20) return 'orange';
  return 'red';
}

export default function ZoneMap({ navigate, dark, worker }) {
  const [city,     setCity]     = useState(worker?.city || 'Bengaluru');
  const [selected, setSelected] = useState(3); // user's hex by default

  const muted = dark ? 'text-gray-400' : 'text-gray-500';
  const cardC = dark ? 'glass-card'    : 'light-card';
  const sel   = HEX_GRID[selected];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-syne text-2xl font-bold mb-1">Zone Map</h1>
        <p className={`text-sm ${muted}`}>
          Your 500m H3 micro-zone and surrounding cells. Click any cell to see its risk profile.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Map panel */}
        <div className="lg:col-span-2">
          <div className={`${cardC} p-6`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-syne font-bold">Micro-Zone Grid</h3>
                <p className={`text-xs ${muted} mt-0.5`}>H3 Resolution Level 11 · 500m × 500m per cell</p>
              </div>
              <select className="input text-sm py-2 w-36"
                value={city} onChange={e => setCity(e.target.value)}>
                {CITY_LIST.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Hex grid */}
            <div className="flex flex-col items-center gap-1 my-8">
              {/* Row 1: 3 cells */}
              <div className="flex gap-2">
                {[0,1,2].map(i => <HexCell key={i} cell={HEX_GRID[i]} selected={selected} onSelect={setSelected} dark={dark} />)}
              </div>
              {/* Row 2: center cell */}
              <div className="flex gap-2 -mt-2">
                {[3].map(i => <HexCell key={i} cell={HEX_GRID[i]} selected={selected} onSelect={setSelected} dark={dark} big />)}
              </div>
              {/* Row 3: 3 cells */}
              <div className="flex gap-2 -mt-2">
                {[4,5,6].map(i => <HexCell key={i} cell={HEX_GRID[i]} selected={selected} onSelect={setSelected} dark={dark} />)}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 justify-center mt-6">
              {[
                { color:'green',  label:'Low Risk (< 0.95×)'     },
                { color:'amber',  label:'Medium Risk (0.95–1.05×)'},
                { color:'orange', label:'Med-High (1.05–1.20×)'  },
                { color:'red',    label:'High Risk (> 1.20×)'    },
              ].map(l => (
                <div key={l.color} className="flex items-center gap-1.5 text-xs">
                  <div className={`w-3 h-3 rounded-sm ${RISK_COLOR[l.color].bg} border ${RISK_COLOR[l.color].border}`} />
                  <span className={muted}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side panel: selected cell details */}
        <div className="space-y-5">
          <div className={`${cardC} p-6`}>
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={16} className="text-orange-400" />
              <h3 className="font-syne font-bold">Cell Details</h3>
              {sel.isUser && <span className="badge badge-orange text-xs">Your Zone</span>}
            </div>

            <div className={`rounded-xl p-4 mb-4 ${RISK_COLOR[riskColor(sel.risk)].bg} border ${RISK_COLOR[riskColor(sel.risk)].border}`}>
              <div className={`font-syne text-3xl font-extrabold ${RISK_COLOR[riskColor(sel.risk)].text} mb-1`}>
                {sel.label}
              </div>
              <div className={`text-sm ${RISK_COLOR[riskColor(sel.risk)].text}`}>
                Risk Multiplier: {sel.risk}×
              </div>
            </div>

            <div className="space-y-2">
              {[
                ['H3 Cell ID',     '8b1f8d14' + sel.id + '000ff'],
                ['Resolution',     'Level 11 (≈500m)'],
                ['Risk Score',     sel.risk.toFixed(2) + '× multiplier'],
                ['Flood Events',   Math.floor(sel.risk * 3) + ' in last 3 yrs'],
                ['Drainage Index', (1.5 - sel.risk).toFixed(2) + ' / 1.0'],
                ['Terrain',        sel.risk > 1.1 ? 'Low-lying' : 'Elevated'],
                ['Zone Type',      'Urban delivery zone'],
              ].map(([k, v]) => (
                <div key={k} className={`flex justify-between text-sm py-1.5 border-b last:border-0 ${dark ? 'border-white/5' : 'border-gray-100'}`}>
                  <span className={muted}>{k}</span>
                  <span className="font-medium text-xs text-right">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* City-wide risk table */}
          <div className={`${cardC} p-6`}>
            <h3 className="font-syne font-bold mb-4">City Risk Overview</h3>
            <div className="space-y-2">
              {Object.entries(ZONE_RISK).slice(0,6).map(([c, z]) => (
                <div key={c} className="flex items-center justify-between text-sm">
                  <span className={muted}>{c}</span>
                  <div className="flex items-center gap-2">
                    <div className={`h-1.5 rounded-full w-16 ${dark ? 'bg-white/8' : 'bg-gray-200'}`}>
                      <div className={`h-1.5 rounded-full ${
                        z.score < 0.95 ? 'bg-green-500' : z.score < 1.10 ? 'bg-amber-500' : 'bg-red-500'
                      }`} style={{width: Math.min(100, (z.score - 0.7) * 200) + '%'}} />
                    </div>
                    <span className="text-xs font-medium w-8 text-right">{z.score}×</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => navigate('premium')} className="btn-primary w-full">
            Calculate My Premium <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function HexCell({ cell, selected, onSelect, dark, big }) {
  const color = riskColor(cell.risk);
  const rc    = RISK_COLOR[color];
  const isSel = selected === cell.id;
  const size  = big ? 'w-20 h-24' : 'w-16 h-20';

  return (
    <button
      onClick={() => onSelect(cell.id)}
      className={`hex-cell ${size} flex flex-col items-center justify-center gap-0.5
        border-2 transition-all ${isSel ? 'scale-110 ' + rc.border : 'border-transparent'}
        ${cell.isUser ? rc.fill.replace('rgba','') : ''}`}
      style={{
        background: cell.isUser
          ? `rgba(249,115,22,${isSel ? '0.8' : '0.55'})`
          : isSel
            ? rc.fill
            : dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
      }}>
      <span className={`font-syne font-bold text-xs ${cell.isUser ? 'text-white' : rc.text}`}>
        {cell.label}
      </span>
      {cell.isUser && <span className="text-xs">📍</span>}
      <span className={`text-xs ${cell.isUser ? 'text-white/80' : rc.text}`}>
        {cell.risk}×
      </span>
    </button>
  );
}