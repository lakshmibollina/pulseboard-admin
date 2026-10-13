import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icons } from './icons';
import { customers, navItems } from '../data/metrics';

const NAV_ICONS = {
  overview: Icons.overview,
  analytics: Icons.analytics,
  customers: Icons.customers,
  revenue: Icons.revenue,
  reports: Icons.reports,
  settings: Icons.settings,
};

/**
 * Lightweight fuzzy scorer: exact > prefix > substring > subsequence.
 * Returns a positive score for a match, 0 otherwise.
 */
function fuzzyScore(query, text) {
  const q = query.trim().toLowerCase();
  const t = text.toLowerCase();
  if (!q) return 0;
  if (t === q) return 120;
  if (t.startsWith(q)) return 100;
  const at = t.indexOf(q);
  if (at !== -1) return 80 - Math.min(at, 40);
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i += 1) {
    if (t[i] === q[qi]) qi += 1;
  }
  return qi === q.length ? 30 : 0;
}

function initials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('');
}

export default function CommandPalette({ open, onClose, onSelectNav, onSelectCustomer }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const itemRefs = useRef(new Map());

  // Reset on open; focus the input for immediate typing.
  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      itemRefs.current.clear();
    }
  }, [open ]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 40);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [open ]);

  const results = useMemo(() => {
    const q = query.trim();
    const nav = navItems.map((n) => ({
      kind: 'nav',
      key: `nav-${n.id}`,
      item: n,
      score: q ? fuzzyScore(q, n.label) : 60,
    }));
    const custs = customers.map((c) => ({
      kind: 'customer',
      key: `customer-${c.id}`,
      item: c,
      score: q ? Math.max(fuzzyScore(q, c.name), fuzzyScore(q, c.company)) : 40,
    }));
    // With an empty query nav comes first (stable sort keeps insertion order).
    return [...nav, ...custs]
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 14);
  }, [query ]);

  useEffect(() => {
    setActive(0);
  }, [query ]);

  useEffect(() => {
    const node = itemRefs.current.get(results[active]?.key);
    node?.scrollIntoView({ block: 'nearest' });
  }, [active, results]);

  const choose = (result) => {
    if (!result) return;
    if (result.kind === 'nav') onSelectNav(result.item.id);
    else onSelectCustomer(result.item);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(results[active]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Command palette">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto mt-[8vh] w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:mt-[12vh]"
          >
            {/* Input */}
            <div className="flex items-center gap-3 border-b border-slate-200 px-4 dark:border-slate-800">
              <span className="shrink-0 text-slate-400">
                <Icons.search className="h-5 w-5" />
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Jump to a page or find a customer…"
                aria-label="Command palette search"
                autoComplete="off"
                spellCheck={false}
                className="w-full bg-transparent py-4 text-base text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
              />
              <kbd className="hidden shrink-0 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 sm:block">
                esc
              </kbd>
            </div>

            {/* Results */}
            <ul className="max-h-[46vh] overflow-y-auto p-2 sm:max-h-[52vh]" role="listbox" aria-label="Results">
              {results.map((r, i) => {
                const isActive = i === active;
                if (r.kind === 'nav') {
                  const Icon = NAV_ICONS[r.item.id] ?? Icons.overview;
                  return (
                    <li key={r.key} role="option" aria-selected={isActive}>
                      <button
                        ref={(el) => {
                          if (el) itemRefs.current.set(r.key, el);
                          else itemRefs.current.delete(r.key);
                        }}
                        type="button"
                        onClick={() => choose(r)}
                        onMouseMove={() => setActive(i)}
                        className={[
                          'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                          isActive ? 'bg-indigo-50 dark:bg-indigo-500/15' : 'bg-transparent',
                        ].join(' ')}
                      >
                        <span
                          className={[
                            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors',
                            isActive
                              ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300'
                              : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
                          ].join(' ')}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                            {r.item.label}
                          </span>
                          <span className="block text-xs text-slate-400 dark:text-slate-500">
                            Go to page
                          </span>
                        </span>
                        <span className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                          Page
                        </span>
                      </button>
                    </li>
                  );
                }
                const c = r.item;
                return (
                  <li key={r.key} role="option" aria-selected={isActive}>
                    <button
                      ref={(el) => {
                        if (el) itemRefs.current.set(r.key, el);
                        else itemRefs.current.delete(r.key);
                      }}
                      type="button"
                      onClick={() => choose(r)}
                      onMouseMove={() => setActive(i)}
                      className={[
                        'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                        isActive ? 'bg-indigo-50 dark:bg-indigo-500/15' : 'bg-transparent',
                      ].join(' ')}
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 font-display text-xs font-bold text-indigo-700 dark:from-indigo-500/20 dark:to-violet-500/20 dark:text-indigo-300">
                        {initials(c.name)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {c.name}
                        </span>
                        <span className="block truncate text-xs text-slate-400 dark:text-slate-500">
                          {c.company} · {c.plan}
                        </span>
                      </span>
                      <span className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                        Customer
                      </span>
                    </button>
                  </li>
                );
              })}
              {results.length === 0 && (
                <li className="px-4 py-10 text-center">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    No matches for “{query.trim()}”
                  </p>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    Try a page name, customer, or company.
                  </p>
                </li>
              )}
            </ul>

            {/* Footer hints */}
            <div className="hidden items-center gap-4 border-t border-slate-200 px-4 py-2.5 text-[11px] text-slate-400 dark:border-slate-800 dark:text-slate-500 sm:flex">
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-semibold dark:border-slate-700 dark:bg-slate-800">↑↓</kbd>
                navigate
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-semibold dark:border-slate-700 dark:bg-slate-800">↵</kbd>
                select
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-semibold dark:border-slate-700 dark:bg-slate-800">esc</kbd>
                close
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
