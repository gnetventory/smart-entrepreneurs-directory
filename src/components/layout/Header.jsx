import React from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function Header() {
  const { darkMode, toggleDarkMode, apiKey, sidebarOpen, setSidebarOpen } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-stone-50/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 px-4 sm:px-8 py-3.5 transition-colors">
      <div className="flex items-center gap-4 max-w-[1800px] mx-auto">
        {/* Mobile menu toggle */}
        <button
          className="lg:hidden p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white transition-colors"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-xl font-black shadow-sm">
            🚀
          </div>
          <div>
            <h1 className="text-lg font-bold text-stone-900 dark:text-white tracking-tight flex items-center gap-2">
              SMART DIRECTORY <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-mono font-semibold">v1.0</span>
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Global Entrepreneurs WhatsApp Community</p>
          </div>
        </div>

        <div className="flex-1" />

        {/* Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-semibold">
          <div className={`w-2 h-2 rounded-full ${apiKey ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
          <span className="text-stone-700 dark:text-stone-300">{apiKey ? 'AI Engine Active' : 'Offline / Manual Mode'}</span>
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
          title="Toggle dark mode"
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
        </button>
      </div>
    </header>
  );
}
