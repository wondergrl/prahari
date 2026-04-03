/**
 * Prahari Fraud Detection Engine
 * 6-signal verification stack — from README anti-spoofing section
 * A claim needs ≥ 4 of 6 signals to auto-approve
 */

export const SIGNALS = [
  {
    id: 'gps',
    label: 'GPS Coordinates',
    desc: 'Worker inside disrupted micro-zone',
    spoofNote: 'Easy to fake alone — not sufficient by itself',
  },
  {
    id: 'accelerometer',
    label: 'Motion Data',
    desc: 'Phone movement matches active riding pattern',
    spoofNote: 'Stationary phone during claim = flagged',
  },
  {
    id: 'cellTower',
    label: 'Cell Tower Triangulation',
    desc: 'Cell towers confirm location independently of GPS',
    spoofNote: 'Cannot spoof network towers',
  },
  {
    id: 'battery',
    label: 'Battery & Charging State',
    desc: 'Riders in rain rarely have phone charging',
    spoofNote: 'Spoofing rigs are often plugged in',
  },
  {
    id: 'appActivity',
    label: 'App Activity Pattern',
    desc: 'Delivery app shows active session during event',
    spoofNote: 'Fake GPS produces no real orders',
  },
  {
    id: 'zoneHistory',
    label: 'Zone Delivery History',
    desc: "Worker's past 30 days of routes include this zone",
    spoofNote: 'New actor in zone is statistically suspicious',
  },
];

// Simulate signal verification (in production these come from device APIs)
export function runFraudCheck(worker) {
  const signals = {};
  let score = 0;

  // GPS — passes if worker registered in this city
  signals.gps = { pass: true, detail: 'Worker coordinates within Zone V-23 boundary' };
  score++;

  // Accelerometer — passes for experienced workers
  const exp = parseInt(worker?.yearsExp) || 0;
  signals.accelerometer = exp >= 1
    ? { pass: true,  detail: 'Movement pattern consistent with motorcycle delivery' }
    : { pass: false, detail: 'Insufficient motion data — first delivery detected' };
  if (signals.accelerometer.pass) score++;

  // Cell tower — always passes in demo (real device signal)
  signals.cellTower = { pass: true, detail: 'Tower triangulation confirms Koramangala sector' };
  score++;

  // Battery — random realistic result
  const batteryOk = Math.random() > 0.25;
  signals.battery = batteryOk
    ? { pass: true,  detail: 'Phone at 34% battery, not charging — consistent with field use' }
    : { pass: false, detail: 'Phone detected as charging — flagged for review' };
  if (signals.battery.pass) score++;

  // App activity — passes if worker has active policy
  const hasPolicy = !!worker;
  signals.appActivity = hasPolicy
    ? { pass: true,  detail: 'Zomato app active session logged during trigger window' }
    : { pass: false, detail: 'No delivery app session found during event window' };
  if (signals.appActivity.pass) score++;

  // Zone history — passes for workers with some experience
  signals.zoneHistory = exp >= 1
    ? { pass: true,  detail: 'Worker has 23 deliveries in this zone over past 30 days' }
    : { pass: false, detail: 'No prior delivery history in this micro-zone' };
  if (signals.zoneHistory.pass) score++;

  // Confidence tier — from README
  let confidence, action, workerMessage, color;
  if (score >= 4) {
    confidence = 'High';
    action = 'Auto-approve — instant payout';
    workerMessage = 'Your claim has been verified and approved!';
    color = 'green';
  } else if (score >= 2) {
    confidence = 'Medium';
    action = 'Soft flag — payout held 2 hours, auto-released if no anomaly';
    workerMessage = 'Verifying your claim… payment will arrive within 2 hours.';
    color = 'amber';
  } else {
    confidence = 'Low';
    action = 'Hard flag — manual review within 4 hours';
    workerMessage = 'Your claim needs additional verification. You\'ll hear from us in 4 hours.';
    color = 'red';
  }

  return { signals, score, confidence, action, workerMessage, color };
}