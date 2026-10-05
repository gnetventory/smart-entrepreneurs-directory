import React from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function Header() {
  const { darkMode, toggleDarkMode, apiKey, sidebarOpen, setSidebarOpen } = useApp();

  return (
    <header className="sticky top-0 z-40 transition-colors">
      {/* Main header bar */}
      <div className="bg-[#FAFAF7]/95 dark:bg-stone-950/95 backdrop-blur-md border-b-[1.5px] border-stone-300 dark:border-stone-800 px-4 sm:px-8 py-3">
        <div className="flex items-center gap-4 max-w-[1800px] mx-auto">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-xl bg-white dark:bg-stone-900 border-[1.5px] border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 hover:border-orange-600 dark:hover:border-orange-500 hover:text-orange-600 transition-all shadow-tactile-sm dark:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Navigation"
          >
            {sidebarOpen ? <X size={19} /> : <Menu size={19} />}
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            {/* Logo mark: emerald with tactile border */}
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white border-[1.5px] border-emerald-800 dark:border-emerald-500 shadow-tactile-sm dark:shadow-none">
                <span className="text-xl font-black leading-none">🚀</span>
              </div>
              {/* Terracotta accent dot */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-600 rounded-full border-2 border-[#FAFAF7] dark:border-stone-950 shadow-xs" />
            </div>

            <div>
              <h1 className="text-[17px] font-black text-stone-950 dark:text-white tracking-tight leading-none flex items-center gap-2 font-display">
                SMART DIRECTORY
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 border-[1.5px] border-orange-300 dark:border-orange-800 font-mono font-bold uppercase tracking-wider">
                  v1.11
                </span>
              </h1>
              <p className="text-[12.5px] text-stone-600 dark:text-stone-400 font-medium mt-0.5">
                Global WhatsApp Entrepreneurs Network
              </p>
            </div>
          </div>

          <div className="flex-1" />

          {/* AI Status pill */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-stone-900 border-[1.5px] border-stone-300 dark:border-stone-800 text-[13px] font-bold shadow-tactile-sm dark:shadow-none transition-all">
            <div
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                apiKey
                  ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                  : 'bg-orange-500 animate-pulse'
              }`}
            />
            <span className="text-stone-800 dark:text-stone-200">
              {apiKey ? 'AI Engine Active' : 'Manual Mode'}
            </span>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border-[1.5px] border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:border-orange-600 dark:hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 shadow-tactile-sm dark:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all"
            title="Toggle dark/light mode"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? (
              <Sun size={17} className="text-amber-400" />
            ) : (
              <Moon size={17} className="text-stone-900" />
            )}
          </button>
        </div>
      </div>

      {/* Thin terracotta accent line at the very bottom of header */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-orange-600/50 to-transparent dark:via-orange-500/30" />
    </header>
  );
}
