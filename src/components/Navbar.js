import React, { useState } from 'react';
import { Shield, Sun, Moon, Menu, X, Bell, ChevronDown } from 'lucide-react';

const NAV = [
  { id: 'dashboard',  label: 'Dashboard'  },
  { id: 'zone',       label: 'My Zone'    },
  { id: 'premium',    label: 'Premium'    },
  { id: 'policy',     label: 'Policy'     },
  { id: 'claims',     label: 'Claims'     },
  { id: 'triggers',   label: 'Triggers'   },
  { id: 'ml',         label: 'AI Model'   },
  { id: 'exclusions', label: 'Exclusions' },
];

export default function Navbar({ dark, setDark, page, navigate, worker }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors
      ${dark
        ? 'bg-[#0a0d1a]/90 border-white/6'
        : 'bg-white/90 border-gray-200 shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <button onClick={() => navigate('landing')}
          className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center glow-sm">
            <Shield size={15} className="text-white" />
          </div>
          <span className={`font-syne font-bold text-lg ${dark ? 'text-white' : 'text-gray-900'}`}>
            Prahari
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {NAV.map(n => (
            <button key={n.id} onClick={() => navigate(n.id)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all
                ${page === n.id
                  ? 'text-orange-400 bg-orange-500/10 font-medium'
                  : dark
                    ? 'text-gray-400 hover:text-white hover:bg-white/5'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}>
              {n.label}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1">
          {/* Notification */}
          <button className={`relative p-2 rounded-lg
            ${dark ? 'text-gray-400 hover:bg-white/5' : 'text-gray-500 hover:bg-gray-100'}`}>
            <Bell size={17} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-orange-500 rounded-full" />
          </button>

          {/* Theme toggle */}
          <button onClick={() => setDark(!dark)}
            className={`p-2 rounded-lg transition-all
              ${dark ? 'text-amber-400 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-100'}`}>
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Worker pill */}
          {worker ? (
            <button onClick={() => navigate('dashboard')}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl
                bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium">
              <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center
                text-white text-xs font-bold">
                {worker.name?.[0] || 'W'}
              </div>
              {worker.name?.split(' ')[0]}
              <ChevronDown size={12} />
            </button>
          ) : (
            <button onClick={() => navigate('register')}
              className="hidden md:block btn-primary btn-sm text-sm">
              Get Covered
            </button>
          )}

          {/* Mobile menu toggle */}
          <button onClick={() => setOpen(!open)}
            className={`md:hidden p-2 rounded-lg
              ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className={`md:hidden px-4 py-3 border-t flex flex-col gap-1
          ${dark ? 'bg-[#0f1326] border-white/5' : 'bg-white border-gray-100'}`}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => { navigate(n.id); setOpen(false); }}
              className={`text-left px-3 py-2.5 rounded-lg text-sm transition-all
                ${page === n.id
                  ? 'text-orange-400 bg-orange-500/10'
                  : dark ? 'text-gray-400' : 'text-gray-600'}`}>
              {n.label}
            </button>
          ))}
          {!worker && (
            <button onClick={() => { navigate('register'); setOpen(false); }}
              className="btn-primary mt-2 text-sm">
              Get Covered — ₹39/week
            </button>
          )}
        </div>
      )}
    </nav>
  );
}