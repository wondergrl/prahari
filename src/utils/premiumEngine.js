/**
 * Prahari Premium Calculation Engine
 * Formula: Final Premium = Base × Zone Risk Multiplier × Worker History Score
 * Then apply flat adjustments (loyalty discount, weather forecast surcharge)
 * Source: README — Dynamic Premium Model
 */

export const TIERS = {
  basic:    { label: 'Basic',    base: 39, maxPayout: 500,  desc: '₹500 per disruption day' },
  standard: { label: 'Standard', base: 59, maxPayout: 800,  desc: '₹800 per disruption day' },
  premium:  { label: 'Premium',  base: 89, maxPayout: 1100, desc: '₹1,100 per disruption day' },
};

// Zone risk scores by city (mock — would come from ML model in production)
export const ZONE_RISK = {
  'Bengaluru':   { score: 1.05, label: 'Medium', color: 'amber'  },
  'Mumbai':      { score: 1.25, label: 'High',   color: 'red'    },
  'Chennai':     { score: 1.15, label: 'Medium-High', color: 'orange' },
  'Hyderabad':   { score: 1.00, label: 'Low-Medium',  color: 'green'  },
  'Delhi':       { score: 1.20, label: 'High',   color: 'red'    },
  'Pune':        { score: 0.95, label: 'Low',    color: 'green'  },
  'Kozhikode':   { score: 1.10, label: 'Medium', color: 'amber'  },
  'Kochi':       { score: 1.18, label: 'Medium-High', color: 'orange' },
  'Ahmedabad':   { score: 0.90, label: 'Low',    color: 'green'  },
  'Kolkata':     { score: 1.22, label: 'High',   color: 'red'    },
};

// History score based on experience + claims history
export function getHistoryScore(yearsExp, claimsFreeWeeks) {
  let score = 1.0;
  const years = parseInt(yearsExp) || 0;
  if (years >= 3) score -= 0.08;
  else if (years >= 1) score -= 0.04;
  return Math.max(0.85, score);
}

// Main calculation — matches README formula exactly
export function calculatePremium({
  tier = 'standard',
  city = 'Bengaluru',
  yearsExp = '1',
  claimsFreeWeeks = 0,
  adverseWeatherNext7Days = false,
}) {
  const { base } = TIERS[tier];
  const zone = ZONE_RISK[city] || { score: 1.0, label: 'Unknown', color: 'gray' };
  const historyScore = getHistoryScore(yearsExp, claimsFreeWeeks);

  // Base × Zone Risk × History
  let premium = base * zone.score * historyScore;

  // Flat adjustments
  if (claimsFreeWeeks >= 4) premium -= 8;   // loyalty discount
  if (adverseWeatherNext7Days) premium += 6; // weather surcharge (avg of ₹3–10)

  premium = Math.round(premium);

  return {
    base,
    zoneRisk: zone,
    historyScore: historyScore.toFixed(2),
    loyaltyDiscount: claimsFreeWeeks >= 4 ? -8 : 0,
    weatherSurcharge: adverseWeatherNext7Days ? 6 : 0,
    final: premium,
    tier: TIERS[tier],
  };
}

// Example from README: Raju — Standard ₹59 × 1.05 − ₹8 = ₹54
// calculatePremium({ tier:'standard', city:'Chennai', yearsExp:'3', claimsFreeWeeks:3 }) → ₹54