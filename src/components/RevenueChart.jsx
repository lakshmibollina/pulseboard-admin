import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import AnimatedNumber from './AnimatedNumber';
import { dailyMetrics } from '../data/metrics';

const RANGES = [
  { id: 7, label: '7D' },
  { id: 30, label: '30D' },
  { id: 90, label: '90D' },
];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-card-hover dark:border-slate-700 dark:bg-slate-900">
      <p className="text-xs font-medium text-slate-400">{d.fullDate}</p>
      <p className="mt-0.5 font-display text-lg font-bold tabular-nums text-slate-900 dark:text-white">
        ${d.revenue.toLocaleString('en-US')}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {d.signups} signups · {d.users.toLocaleString('en-US')} users
      </p>
    </div>
  );
}

export default function RevenueChart({ range, onRangeChange }) {
  const data = useMemo(() => dailyMetrics.slice(-range), [range]);
  const total = data.reduce((a, b) => a + b.revenue, 0);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15, ease: 'easeOut' }}
      className="card-surface rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-bold tracking-tight text-slate-900 dark:text-white">
            Revenue
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            <AnimatedNumber
              value={total}
              format={(v) => `$${Math.round(v).toLocaleString('en-US')}`}
              className="font-display font-bold tabular-nums text-slate-800 dark:text-slate-100"
            />{' '}
            collected in the last {range} days
          </p>
        </div>

        {/* Working time-range switcher — re-slices the 90-day series */}
        <div
          role="tablist"
          aria-label="Time range"
          className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800"
        >
          {RANGES.map((r) => (
            <button
              key={r.id}
              role="tab"
              aria-selected={range === r.id}
              type="button"
              onClick={() => onRangeChange(r.id)}
              className={[
                'relative rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-colors',
                range === r.id
                  ? 'text-slate-900 dark:text-white'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200',
              ].join(' ')}
            >
              {range === r.id && (
                <motion.span
                  layoutId="range-pill"
                  className="absolute inset-0 rounded-lg bg-white shadow-card dark:bg-slate-700"
                  transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                />
              )}
              <span className="relative">{r.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 h-72 w-full sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          {/* No key={range} here on purpose: recharts tweens the Area between
              datasets on a range switch instead of remounting with a snap. */}
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.32} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-800" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: 'currentColor' }}
              className="text-slate-400"
              minTickGap={28}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: 'currentColor' }}
              className="text-slate-400"
              tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
              width={52}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#6366f1', strokeDasharray: '4 4', strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#6366f1"
              strokeWidth={2.5}
              fill="url(#revenueFill)"
              activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
              animationDuration={750}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
}
