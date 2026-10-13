import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { customers } from '../data/metrics';
import { Icons } from './icons';

const PAGE_SIZE = 8;

const COLUMNS = [
  { id: 'name', label: 'Customer' },
  { id: 'plan', label: 'Plan' },
  { id: 'mrr', label: 'MRR', numeric: true },
  { id: 'status', label: 'Status' },
  { id: 'signupTs', label: 'Signed up' },
  { id: 'country', label: 'Country' },
];

const STATUS_STYLES = {
  active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  trialing: 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400',
  past_due: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  churned: 'bg-slate-100 text-slate-500 dark:bg-slate-500/10 dark:text-slate-400',
};

const STATUS_LABELS = {
  active: 'Active',
  trialing: 'Trialing',
  past_due: 'Past due',
  churned: 'Churned',
};

function matches(row, query) {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  return [row.name, row.company, row.id, row.plan, row.country, STATUS_LABELS[row.status]]
    .join(' ')
    .toLowerCase()
    .includes(q);
}

export default function DataTable({ search }) {
  const [sortKey, setSortKey] = useState('signupTs');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(0);

  // Reset to first page whenever the filter changes
  useEffect(() => {
    setPage(0);
  }, [search]);

  const filtered = useMemo(() => customers.filter((c) => matches(c, search)), [search]);

  const sorted = useMemo(() => {
    const rows = [...filtered];
    rows.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp =
        typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return rows;
  }, [filtered, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const rows = sorted.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'name' || key === 'country' || key === 'plan' ? 'asc' : 'desc');
    }
    setPage(0);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.35, ease: 'easeOut' }}
      className="card-surface overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 p-5 pb-3 sm:px-6">
        <div>
          <h2 className="font-display text-base font-bold tracking-tight text-slate-900 dark:text-white">
            Customers
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {sorted.length} of {customers.length} accounts
            {search.trim() && (
              <>
                {' '}matching <span className="font-medium text-slate-700 dark:text-slate-200">“{search.trim()}”</span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Horizontal scroll on small screens */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-y border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/40">
              {COLUMNS.map((col) => {
                const activeCol = sortKey === col.id;
                return (
                  <th key={col.id} scope="col" className="px-4 py-3 sm:px-6">
                    <button
                      type="button"
                      onClick={() => toggleSort(col.id)}
                      aria-label={`Sort by ${col.label} ${activeCol && sortDir === 'asc' ? 'descending' : 'ascending'}`}
                      className={[
                        'group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition-colors',
                        activeCol
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200',
                        col.numeric ? 'flex-row-reverse' : '',
                      ].join(' ')}
                    >
                      {col.label}
                      <span
                        className={[
                          'transition-opacity',
                          activeCol ? 'opacity-100' : 'opacity-0 group-hover:opacity-60',
                        ].join(' ')}
                      >
                        {activeCol && sortDir === 'asc' ? (
                          <Icons.chevronDown className="h-3.5 w-3.5 rotate-180" />
                        ) : (
                          <Icons.chevronDown className="h-3.5 w-3.5" />
                        )}
                      </span>
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-slate-100 transition-colors last:border-0 hover:bg-indigo-50/50 dark:border-slate-800 dark:hover:bg-slate-800/50"
              >
                <td className="px-4 py-3.5 sm:px-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 font-display text-xs font-bold text-indigo-700 dark:from-indigo-500/20 dark:to-violet-500/20 dark:text-indigo-300">
                      {row.name.split(' ').map((w) => w[0]).join('')}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-800 dark:text-slate-100">{row.name}</p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">{row.company}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 sm:px-6">
                  <span className="font-medium text-slate-700 dark:text-slate-200">{row.plan}</span>
                </td>
                <td className="px-4 py-3.5 text-right tabular-nums sm:px-6">
                  <span className="font-semibold text-slate-800 dark:text-slate-100">
                    ${row.mrr.toLocaleString('en-US')}
                  </span>
                  <span className="text-xs text-slate-400">/mo</span>
                </td>
                <td className="px-4 py-3.5 sm:px-6">
                  <span
                    className={[
                      'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
                      STATUS_STYLES[row.status],
                    ].join(' ')}
                  >
                    {STATUS_LABELS[row.status]}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-slate-600 dark:text-slate-300 sm:px-6">
                  {row.signupDate}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-slate-600 dark:text-slate-300 sm:px-6">
                  {row.country}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-6 py-12 text-center">
                  <p className="font-display text-sm font-semibold text-slate-700 dark:text-slate-200">
                    No customers match your search
                  </p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Try a different name, company, plan, or country.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3.5 sm:px-6 dark:border-slate-800">
        <p className="text-xs text-slate-500 tabular-nums dark:text-slate-400">
          Page {safePage + 1} of {pageCount}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={safePage === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 shadow-card transition hover:-translate-y-0.5 hover:text-slate-900 hover:shadow-card-hover active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-card dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            <Icons.chevronLeft className="h-4 w-4" />
            Prev
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={safePage === pageCount - 1}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 shadow-card transition hover:-translate-y-0.5 hover:text-slate-900 hover:shadow-card-hover active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-card dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            Next
            <Icons.chevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.section>
  );
}
