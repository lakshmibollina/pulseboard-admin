// ---------------------------------------------------------------------------
// metrics.js — deterministic, seeded demo data for the Pulseboard dashboard.
// A mulberry32 PRNG with a fixed seed keeps every build pixel-stable.
// ---------------------------------------------------------------------------

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(20261013);

const fmt = (d) =>
  d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const fullFmt = (d) =>
  d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

// ------------------------------ Daily series ------------------------------

const DAYS = 90;
const today = new Date();
today.setHours(0, 0, 0, 0);

export const dailyMetrics = Array.from({ length: DAYS }, (_, i) => {
  const date = new Date(today);
  date.setDate(date.getDate() - (DAYS - 1 - i));

  // Realistic growth: revenue ramps from ~$9.5k/day to ~$15.5k/day with
  // weekly seasonality (weekend dips) and gentle noise.
  const progress = i / (DAYS - 1);
  const weekly = 1 - 0.16 * [1, 0.72, 0.6, 0.66, 0.74, 0.9, 1][date.getDay()];
  const base = 9800 + progress * 5600;
  const noise = 1 + (rng() - 0.5) * 0.14;
  const revenue = Math.round(base * weekly * noise);

  const users = Math.round(24500 + progress * 11800 + (rng() - 0.5) * 900);
  const signups = Math.round(96 + progress * 74 + (rng() - 0.5) * 38);
  const sessions = Math.round(users * (1.6 + (rng() - 0.5) * 0.3));

  return { date: fmt(date), fullDate: fullFmt(date), revenue, users, signups, sessions };
});

// --------------------------- Channel breakdown ----------------------------

export const channels = [
  { name: 'Organic', signups: 12480, fill: '#6366f1' },
  { name: 'Paid', signups: 9630, fill: '#0ea5e9' },
  { name: 'Referral', signups: 7410, fill: '#10b981' },
  { name: 'Social', signups: 5980, fill: '#f59e0b' },
  { name: 'Email', signups: 4320, fill: '#8b5cf6' },
];

// ------------------------------- Customers --------------------------------

const firstNames = [
  'Ava', 'Liam', 'Maya', 'Noah', 'Sofia', 'Ethan', 'Priya', 'Lucas',
  'Emma', 'Oliver', 'Aria', 'Mateo', 'Zoe', 'Daniel', 'Hannah', 'Leo',
  'Ivy', 'Gabriel', 'Nora', 'Owen', 'Lily', 'Elias', 'Chloe', 'Adam',
  'Ruby', 'Nathan', 'Ella', 'Henry', 'Stella', 'Victor', 'Grace', 'Omar',
  'Lucy', 'Isaac', 'Willow', 'Theo', 'Aurora', 'Felix', 'Daisy', 'Marcus',
];

const lastNames = [
  'Sharma', 'Nguyen', 'Garcia', 'Kim', 'Patel', 'Rossi', 'Muller', 'Dubois',
  'Tanaka', 'Khan', 'Silva', 'Costa', 'Weber', 'Fischer', 'Santos', 'Larsen',
  'Chen', 'Okafor', 'Haddad', 'Novak', 'Ali', 'Bakshi', 'Moreau', 'Lindqvist',
  'Petrov', 'Kowalski', 'Reyes', 'Adeyemi', 'Fernandes', 'Bose', 'Hoffman',
  'Ito', 'Marsh', 'Dutta', 'Vargas', 'Singh', 'Osei', 'Lund', 'Bianchi', 'Cho',
];

const companies = [
  'Nimbus Labs', 'Brightline Co', 'Forge & Field', 'Quantia', 'Northwind Analytics',
  'Velvet Cart', 'Cloudberry HQ', 'Pixelforge', 'Loopwork', 'Stratos Pay',
  'Honeydesk', 'Redwood Retail', 'Beacon CRM', 'Silverpine Health', 'Driftly',
  'Kite & Anchor', 'Moonshot Media', 'Cinderbox', 'Fleetfox Logistics', 'Plumline',
  'Tidepool Studio', 'Ironclad AI', 'Sunbeam Solar', 'Copperline', 'Fern & Fable',
  'Aeropeek', 'Grain & Grind', 'Lumen Legal', 'Patchwork POS', 'Voyager Travel',
  'Kindred Care', 'Optiq Systems', 'Bloombox', 'Harborlight', 'Zephyr Ops',
  'Maple & Main', 'Crestview Edu', 'Alto Athletics', 'Pinecone Dev', 'Orbitly',
];

const plans = ['Starter', 'Growth', 'Scale', 'Enterprise'];
const statuses = ['active', 'active', 'active', 'active', 'trialing', 'trialing', 'past_due', 'churned'];
const countries = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Netherlands',
  'Australia', 'Singapore', 'India', 'Brazil', 'Spain', 'Ireland',
];

const planMrr = { Starter: [49, 99], Growth: [249, 499], Scale: [999, 1999], Enterprise: [4999, 14999] };

export const customers = Array.from({ length: 40 }, (_, i) => {
  const plan = plans[Math.floor(rng() * plans.length)];
  const status = statuses[Math.floor(rng() * statuses.length)];
  const [lo, hi] = planMrr[plan];
  const mrr = status === 'trialing' ? 0 : Math.round(lo + rng() * (hi - lo));
  const signupDate = new Date(today);
  signupDate.setDate(signupDate.getDate() - Math.floor(rng() * 365));

  return {
    id: `CUS-${String(1042 + i).padStart(4, '0')}`,
    name: `${firstNames[i]} ${lastNames[i]}`,
    company: companies[i],
    plan,
    mrr,
    status,
    signupDate: fullFmt(signupDate),
    signupTs: signupDate.getTime(),
    country: countries[Math.floor(rng() * countries.length)],
  };
});

// --------------------------------- KPIs -----------------------------------
// Anchors are window-independent; kpisForRange(R) re-derives every KPI from
// the selected window so the 7D/30D/90D switcher drives the KPI cards too.
// For R = 30 every ratio below is exactly 1, so the default view is
// unchanged.

const last30 = dailyMetrics.slice(-30);
const prev30 = dailyMetrics.slice(-60, -30);

const sum = (arr, key) => arr.reduce((a, b) => a + b[key], 0);
const avg = (arr, key) => sum(arr, key) / arr.length;
const pct = (cur, prev) => ((cur - prev) / prev) * 100;

const totalMrr = sum(customers.filter((c) => c.status !== 'churned'), 'mrr');
const activeUsers = last30[last30.length - 1].users;
const churnedCount = customers.filter((c) => c.status === 'churned').length;
const churnRate = (churnedCount / customers.length) * 100;
const trialing = customers.filter((c) => c.status === 'trialing').length;
const converted = customers.filter((c) => c.status === 'active' && c.plan !== 'Starter').length;
const trialConversion = (converted / Math.max(trialing + converted, 1)) * 100;

export function kpisForRange(R) {
  const cur = dailyMetrics.slice(-R);
  // Compare against the preceding window; for 90D (longer than half the
  // series) compare the two halves of the visible window instead.
  const prev = R <= 45 ? dailyMetrics.slice(-2 * R, -R) : dailyMetrics.slice(-90, -45);

  // Window intensity relative to the 30-day baseline — 1 when R === 30.
  const revRatio = avg(cur, 'revenue') / avg(last30, 'revenue');
  const userRatio = avg(cur, 'users') / avg(last30, 'users');
  const signupRatio = avg(cur, 'signups') / avg(last30, 'signups');

  return [
    {
      id: 'mrr',
      label: 'Monthly recurring revenue',
      value: totalMrr * revRatio,
      format: (v) => `$${Math.round(v).toLocaleString('en-US')}`,
      delta: pct(avg(cur, 'revenue'), avg(prev, 'revenue')),
      spark: cur.slice(-14).map((d) => d.revenue),
      note: `vs. previous ${R} days`,
    },
    {
      id: 'users',
      label: 'Active users',
      value: activeUsers * userRatio,
      format: (v) => Math.round(v).toLocaleString('en-US'),
      delta: pct(avg(cur, 'users'), avg(prev, 'users')),
      spark: cur.slice(-14).map((d) => d.users),
      note: `daily active, last ${R} days`,
    },
    {
      id: 'churn',
      label: 'Churn rate',
      value: churnRate * (1 + (1 - signupRatio) * 0.5),
      format: (v) => `${v.toFixed(1)}%`,
      delta: -pct(avg(cur, 'signups'), avg(prev, 'signups')) / 4,
      invert: true, // a drop in churn is good
      spark: cur.slice(-14).map((d) => 4.4 - d.signups / 220),
      note: 'accounts churned / total',
    },
    {
      id: 'trial',
      label: 'Trial conversion',
      value: trialConversion * (1 + (signupRatio - 1) * 0.5),
      format: (v) => `${v.toFixed(1)}%`,
      delta: pct(avg(cur, 'signups'), avg(prev, 'signups')) / 6,
      spark: cur.slice(-14).map((d) => 18 + d.signups / 90),
      note: 'trial to paid, trailing 90 days',
    },
  ];
}

export const kpis = kpisForRange(30);

// --------------------------------- Nav ------------------------------------

export const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'customers', label: 'Customers' },
  { id: 'revenue', label: 'Revenue' },
  { id: 'reports', label: 'Reports' },
  { id: 'settings', label: 'Settings' },
];
