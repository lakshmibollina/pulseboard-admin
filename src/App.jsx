import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import KpiCard from './components/KpiCard';
import RevenueChart from './components/RevenueChart';
import ChannelChart from './components/ChannelChart';
import DataTable from './components/DataTable';
import { kpis, navItems } from './data/metrics';

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [page, setPage] = useState('overview');
  const [search, setSearch] = useState('');

  const sidebarOffset = collapsed ? 'lg:pl-[76px]' : 'lg:pl-[248px]';

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        active={page}
        onNavigate={setPage}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className={sidebarOffset} style={{ transition: 'padding 0.3s ease' }}>
        <Topbar
          page={page}
          search={search}
          onSearchChange={setSearch}
          onMenuClick={() => setMobileOpen(true)}
        />

        <AnimatePresence mode="wait">
          <motion.main
            key={page}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="mx-auto max-w-[1280px] space-y-5 px-4 py-6 sm:px-6"
          >
            {page === 'overview' ? (
              <>
                {/* KPI row */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {kpis.map((kpi, i) => (
                    <KpiCard key={kpi.id} {...kpi} delay={i * 0.07} />
                  ))}
                </div>

                {/* Charts row */}
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                  <div className="xl:col-span-2">
                    <RevenueChart />
                  </div>
                  <ChannelChart />
                </div>

                {/* Customers table — global search from the topbar filters it */}
                <DataTable search={search} />
              </>
            ) : (
              <PlaceholderPage page={page} onBack={() => setPage('overview')} />
            )}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}

function PlaceholderPage({ page, onBack }) {
  const item = navItems.find((n) => n.id === page);
  return (
    <section className="card-surface mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-slate-200 bg-white px-8 py-16 text-center shadow-card dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-7 w-7">
          <path d="M13 2.5 4.5 13.5H11l-1 8 8.5-11H12l1-8Z" />
        </svg>
      </div>
      <h2 className="mt-5 font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
        {item?.label ?? 'Section'}
      </h2>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        This demo builds out the Overview experience end to end. The {item?.label ?? ''} section
        would plug into the same KPI, chart, and table primitives shown above.
      </p>
      <button
        type="button"
        onClick={onBack}
        className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-card-hover active:translate-y-0"
      >
        Back to Overview
      </button>
    </section>
  );
}
