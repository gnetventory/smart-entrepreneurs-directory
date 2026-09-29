import React from 'react';
import { Moon, Sun, Menu, X, Zap } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function Header() {
  const { darkMode, toggleDarkMode, apiKey, sidebarOpen, setSidebarOpen } = useApp();

  return (
    <header className="sticky top-0 z-40 transition-colors">
      {/* Main header bar */}
      <div className="bg-white/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 px-4 sm:px-8 py-3">
        <div className="flex items-center gap-4 max-w-[1800px] mx-auto">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-orange-300 dark:hover:border-orange-700/40 hover:text-orange-600 transition-all"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Navigation"
          >
            {sidebarOpen ? <X size={19} /> : <Menu size={19} />}
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            {/* Logo mark: green circle with orange accent dot */}
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-sm shadow-emerald-600/30">
                <span className="text-xl font-black leading-none">🚀</span>
              </div>
              {/* Orange accent dot */}
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white dark:border-stone-950 shadow-sm" />
            </div>

            <div>
              <h1 className="text-base font-extrabold text-stone-900 dark:text-white tracking-tight leading-none flex items-center gap-2">
                SMART DIRECTORY
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-700/40 font-bold uppercase tracking-wider">
                  v1.0
                </span>
              </h1>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                Global Entrepreneurs Community
              </p>
            </div>
          </div>

          <div className="flex-1" />

          {/* AI Status pill */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-xs font-semibold transition-all">
            <div
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                apiKey
                  ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]'
                  : 'bg-orange-500 animate-pulse'
              }`}
            />
            <span className="text-stone-700 dark:text-stone-300">
              {apiKey ? 'AI Active' : 'Manual Mode'}
            </span>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-orange-300 dark:hover:border-orange-700/40 hover:text-orange-600 dark:hover:text-orange-400 transition-all"
            title="Toggle dark/light mode"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? (
              <Sun size={17} className="text-amber-500" />
            ) : (
              <Moon size={17} className="text-indigo-600" />
            )}
          </button>
        </div>
      </div>

      {/* Thin orange accent line at the very bottom of header */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent dark:via-orange-500/20" />
    </header>
  );
}
