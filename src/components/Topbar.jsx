import ThemeToggle from './ThemeToggle';
import { Icons } from './icons';

const PAGE_TITLES = {
  overview: { title: 'Overview', subtitle: 'Your business at a glance' },
  analytics: { title: 'Analytics', subtitle: 'Traffic, engagement and cohorts' },
  customers: { title: 'Customers', subtitle: 'Accounts, plans and billing health' },
  revenue: { title: 'Revenue', subtitle: 'MRR, expansion and recognition' },
  reports: { title: 'Reports', subtitle: 'Scheduled exports and board packs' },
  settings: { title: 'Settings', subtitle: 'Workspace, team and integrations' },
};

export default function Topbar({ page, search, onSearchChange, onMenuClick, onOpenPalette }) {
  const meta = PAGE_TITLES[page] ?? PAGE_TITLES.overview;
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const isMac = typeof navigator !== 'undefined' && /mac/i.test(navigator.platform ?? '');

  return (
    <header className="topbar-surface sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        {/* Mobile menu */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-card transition hover:text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 lg:hidden"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-5 w-5">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        {/* Title */}
        <div className="min-w-0">
          <h1 className="truncate font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">
            {meta.title}
          </h1>
          <p className="hidden truncate text-xs text-slate-500 dark:text-slate-400 sm:block">
            {meta.subtitle}
          </p>
        </div>

        <div className="flex-1" />

        {/* Command palette trigger */}
        <button
          type="button"
          onClick={onOpenPalette}
          aria-label="Open command palette (Ctrl or Cmd K)"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white/70 py-2.5 pl-3 pr-2 text-sm text-slate-400 shadow-card backdrop-blur transition hover:border-slate-300 hover:text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:hover:border-slate-600 dark:hover:text-slate-300"
        >
          <Icons.search className="h-4 w-4" />
          <span className="hidden lg:inline">Search…</span>
          <kbd className="hidden rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[11px] font-semibold text-slate-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-400 md:inline-block">
            {isMac ? '⌘K' : 'Ctrl K'}
          </kbd>
        </button>

        {/* Search — filters the customers table */}
        <label className="relative hidden w-64 md:block lg:w-80">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <Icons.search className="h-4 w-4" />
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search customers, companies…"
            aria-label="Search customers"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 shadow-card outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-600 dark:focus:bg-slate-800"
          />
        </label>

        {/* Date */}
        <span className="hidden whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-500 shadow-card dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 xl:block">
          {today}
        </span>

        <ThemeToggle />

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:text-indigo-600 hover:shadow-card-hover active:translate-y-0 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-indigo-300"
        >
          <Icons.bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-white bg-rose-500 dark:border-slate-900" />
          </span>
        </button>

        {/* Avatar */}
        <button
          type="button"
          aria-label="Account"
          className="flex items-center gap-2.5 rounded-xl transition hover:opacity-90 active:scale-95"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 font-display text-sm font-bold text-white shadow-card">
            LB
          </span>
          <span className="hidden text-left lg:block">
            <span className="block text-sm font-semibold leading-tight text-slate-800 dark:text-slate-100">
              Lakshmi B.
            </span>
            <span className="block text-xs leading-tight text-slate-500 dark:text-slate-400">
              Admin
            </span>
          </span>
        </button>
      </div>

      {/* Search on small screens */}
      <div className="px-4 pb-3 md:hidden">
        <label className="relative block">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <Icons.search className="h-4 w-4" />
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search customers, companies…"
            aria-label="Search customers"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </label>
      </div>
    </header>
  );
}
