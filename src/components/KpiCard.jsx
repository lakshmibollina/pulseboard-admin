import { motion } from 'framer-motion';
import { Line, LineChart, ResponsiveContainer } from 'recharts';
import AnimatedNumber from './AnimatedNumber';
import { Icons } from './icons';

export default function KpiCard({ label, value, format, delta, spark, note, invert = false, delay = 0 }) {
  const good = invert ? delta <= 0 : delta >= 0;
  const Arrow = delta >= 0 ? Icons.arrowUp : Icons.arrowDown;
  const sparkData = spark.map((v, i) => ({ i, v }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="card-surface group rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-shadow duration-300 hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <span
          className={[
            'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums',
            good
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
              : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
          ].join(' ')}
        >
          <Arrow className="h-3.5 w-3.5" />
          {Math.abs(delta).toFixed(1)}%
        </span>
      </div>

      <p className="mt-2 font-display text-[2rem] font-bold leading-none tracking-tight text-slate-900 tabular-nums dark:text-white">
        <AnimatedNumber value={value} format={format} />
      </p>

      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-xs text-slate-400 dark:text-slate-500">{note}</p>
        <div className="h-10 w-28 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
              <Line
                type="monotone"
                dataKey="v"
                stroke={good ? '#10b981' : '#f43f5e'}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
