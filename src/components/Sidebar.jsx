import { motion } from 'framer-motion';
import { Icons } from './icons';
import { navItems } from '../data/metrics';

const NAV_META = {
  overview: { icon: Icons.overview },
  analytics: { icon: Icons.analytics },
  customers: { icon: Icons.customers },
  revenue: { icon: Icons.revenue },
  reports: { icon: Icons.reports },
  settings: { icon: Icons.settings },
};

export default function Sidebar({ collapsed, onToggle, active, onNavigate, mobileOpen, onCloseMobile }) {
  const width = collapsed ? 76 : 248;

  return (
    <>
      {/* Mobile scrim */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <motion.aside
        initial={false}
        animate={{ width }}
        transition={{ type: 'spring', stiffness: 320, damping: 34 }}
        className={[
          'sidebar-surface fixed inset-y-0 left-0 z-40 flex flex-col overflow-hidden',
          'border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0',
        ].join(' ')}
      >
        {/* Brand */}
        <div className="flex h-16 shrink-0 items-center gap-3 px-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-card">
            <Icons.bolt className="h-5 w-5" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 }}
              className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white"
            >
              Pulseboard
            </motion.span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1.5 px-3 py-4">
          {!collapsed && (
            <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
              Workspace
            </p>
          )}
          {navItems.map((item) => {
            const Icon = NAV_META[item.id]?.icon ?? Icons.overview;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                title={collapsed ? item.label : undefined}
                className={[
                  'group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  collapsed ? 'justify-center' : '',
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100',
                ].join(' ')}
              >
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 rounded-xl border border-indigo-200/60 dark:border-indigo-400/20"
                    transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                  />
                )}
                <span
                  className={[
                    'relative shrink-0 transition-transform duration-200 group-hover:scale-110',
                    isActive ? 'text-indigo-600 dark:text-indigo-400' : '',
                  ].join(' ')}
                >
                  <Icon className="h-5 w-5" />
                </span>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="relative whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Upgrade card (hidden when collapsed) */}
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-3 mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 p-4 text-white shadow-card"
          >
            <p className="font-display text-sm font-semibold">Scale plan</p>
            <p className="mt-1 text-xs text-indigo-100">
              You are using 68% of your event quota this month.
            </p>
            <button
              type="button"
              className="mt-3 w-full rounded-lg bg-white/95 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-white active:scale-[0.98]"
            >
              Manage billing
            </button>
          </motion.div>
        )}

        {/* Collapse toggle */}
        <div className="shrink-0 border-t border-slate-200 p-3 dark:border-slate-800">
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 lg:flex"
          >
            <span className={collapsed ? 'rotate-180' : ''} style={{ transition: 'transform 0.25s ease' }}>
              <Icons.chevronLeft className="h-5 w-5" />
            </span>
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
