import { useCallback, useEffect, useState } from 'react';
import { Icons } from './icons';

const STORAGE_KEY = 'pulseboard-theme';

function getInitial() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    /* ignore */
  }
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getInitial);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:text-amber-500 hover:shadow-card-hover active:translate-y-0 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-amber-300"
    >
      {theme === 'dark' ? <Icons.sun className="h-5 w-5" /> : <Icons.moon className="h-5 w-5" />}
    </button>
  );
}
