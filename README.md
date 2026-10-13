# Pulseboard Admin — SaaS Analytics Dashboard

A portfolio-grade, interactive SaaS admin dashboard built with React 18 + Vite.
Bright, airy light theme by default (Linear/Stripe-style polish) with an optional
dark mode toggle — persistent via `localStorage`.

## Features

- **Collapsible sidebar** — wide with labels ↔ narrow icon-only, smooth spring
  width transition, active-item highlight pill, and a mobile overlay drawer.
- **Topbar** — per-page title, global search wired to the customers table, date
  display, notification bell, theme toggle, and avatar.
- **KPI cards** — MRR, active users, churn rate, trial conversion; delta badges
  (up/down with color), and recharts sparklines.
- **Revenue chart** — recharts AreaChart with a working 7D / 30D / 90D time-range
  switcher that re-slices the underlying series, gradient fill, custom tooltip.
- **Channel chart** — recharts BarChart of signups by channel with rounded bars
  and a legend.
- **Customers table** — sortable columns (click any header to toggle asc/desc),
  live text filtering (topbar search + responsive inline search), status pills
  (active / trialing / past due / churned), and pagination (8 rows/page).
- **Theme toggle** — flips Tailwind's `dark` class on `<html>`, persisted in
  `localStorage`, no flash on reload (inline script in `index.html`).
- **Seeded demo data** — 90 days of deterministic revenue/users/signups
  (mulberry32 PRNG) plus 40 believable customer rows.

## Tech stack

React 18 · Vite 6 · Tailwind CSS 3 (class-based dark mode) · framer-motion ·
recharts · Google Fonts (Sora display + Inter body). No other UI libraries.

## Run it

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build (outputs to dist/)
npm run preview  # serve the production build
```

## Structure

```
analytics-dashboard/
├── index.html
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── data/metrics.js        # seeded demo metrics + customers
│   └── components/
│       ├── icons.jsx          # inline SVG icon set
│       ├── Sidebar.jsx
│       ├── Topbar.jsx
│       ├── ThemeToggle.jsx
│       ├── KpiCard.jsx
│       ├── RevenueChart.jsx
│       ├── ChannelChart.jsx
│       └── DataTable.jsx
└── package.json
```
