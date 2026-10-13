import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { channels } from '../data/metrics';

function ChannelTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-card-hover dark:border-slate-700 dark:bg-slate-900">
      <p className="text-xs font-medium text-slate-400">{d.name}</p>
      <p className="font-display text-lg font-bold tabular-nums text-slate-900 dark:text-white">
        {d.signups.toLocaleString('en-US')}
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400">signups, trailing 90 days</p>
    </div>
  );
}

export default function ChannelChart() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.25, ease: 'easeOut' }}
      className="card-surface flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6 dark:border-slate-800 dark:bg-slate-900"
    >
      <h2 className="font-display text-base font-bold tracking-tight text-slate-900 dark:text-white">
        Signups by channel
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">Where new trials come from</p>

      <div className="mt-4 h-64 w-full flex-1 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={channels} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} barCategoryGap="28%">
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-800" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: 'currentColor' }}
              className="text-slate-400"
              interval={0}
              angle={-18}
              dy={8}
              height={52}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: 'currentColor' }}
              className="text-slate-400"
              tickFormatter={(v) => `${Math.round(v / 1000)}k`}
              width={40}
            />
            <Tooltip content={<ChannelTooltip />} cursor={{ fill: 'currentColor' }} wrapperClassName="[&_.recharts-tooltip-cursor]:text-slate-100 dark:[&_.recharts-tooltip-cursor]:text-slate-800" />
            <Bar dataKey="signups" radius={[8, 8, 4, 4]}>
              {channels.map((c) => (
                <Cell key={c.name} fill={c.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
        {channels.map((c) => (
          <span key={c.name} className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.fill }} />
            {c.name}
          </span>
        ))}
      </div>
    </motion.section>
  );
}
