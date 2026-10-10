import React, { useState } from 'react';
import { Moon, Sun, Menu, X, Info, ShieldCheck, HeartHandshake, HelpCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import Modal from '../common/Modal';

export default function Header() {
  const { darkMode, toggleDarkMode, activeMembers: members, sidebarOpen, setSidebarOpen } = useApp();
  const [showAboutModal, setShowAboutModal] = useState(false);

  return (
    <header className="sticky top-0 z-40 transition-colors">
      {/* Main header bar */}
      <div className="bg-[#F8F9FA]/90 dark:bg-stone-950/90 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 px-4 sm:px-8 py-3.5">
        <div className="flex items-center gap-4 max-w-[1800px] mx-auto">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 hover:bg-stone-50 transition-all shadow-xs"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Navigation"
          >
            {sidebarOpen ? <X size={19} /> : <Menu size={19} />}
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <div className="relative flex-shrink-0">
              <img
                src="/bgm-logo.jpg"
                alt="BGM Logo"
                className="w-10 h-10 rounded-2xl object-cover shadow-sm border border-stone-200/80 dark:border-stone-700"
              />
              {/* Subtle emerald live accent dot */}
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-stone-950 shadow-xs" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[17px] font-extrabold text-stone-900 dark:text-white tracking-tight leading-none font-display">
                  SMART DIRECTORY
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold uppercase tracking-wider">
                  Curated by BGM
                </span>
              </div>
              <p className="text-[12px] text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                Peer-to-Peer Network of Egyptian & Regional Founders
              </p>
            </div>
          </div>

          <div className="flex-1" />

          {/* Community Active Member Status pill */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-xs font-bold shadow-xs transition-all">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
            <span className="text-stone-700 dark:text-stone-300">
              {members?.length || 138} Active Members
            </span>
          </div>

          {/* About This Initiative Button */}
          <button
            onClick={() => setShowAboutModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-700 dark:text-stone-300 hover:border-emerald-500 transition-all cursor-pointer shadow-xs"
            title="About this initiative"
          >
            <Info size={14} className="text-emerald-600 dark:text-emerald-400" />
            <span className="hidden md:inline">About</span>
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 shadow-xs transition-all cursor-pointer"
            title="Toggle dark/light mode"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? (
              <Sun size={17} className="text-amber-400" />
            ) : (
              <Moon size={17} className="text-stone-700" />
            )}
          </button>
        </div>
      </div>

      {/* ── ABOUT THIS INITIATIVE MODAL ──── */}
      {showAboutModal && (
        <Modal
          isOpen={showAboutModal}
          onClose={() => setShowAboutModal(false)}
          title="About Smart Entrepreneurs Directory"
          size="md"
        >
          <div className="space-y-4 text-xs text-stone-800 dark:text-stone-200 leading-relaxed">
            <div className="p-3.5 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200/80 dark:border-emerald-800 space-y-1">
              <div className="font-extrabold text-sm text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                <HeartHandshake size={16} className="text-emerald-600" />
                <span>Curated by BGM as a Non-Commercial Community Hub</span>
              </div>
              <p className="text-[11.5px] text-emerald-800/90 dark:text-emerald-300">
                This directory is designed strictly for peer collaboration, peer advisory, and reciprocal assistance between active entrepreneurs in Egypt, the Gulf, and the diaspora.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-emerald-600" />
                Community Principles & Rules
              </h4>
              <ul className="space-y-1.5 pl-2 list-disc list-inside text-stone-600 dark:text-stone-300 text-[11.5px]">
                <li><strong className="text-stone-800 dark:text-stone-100">No Cold Pitching:</strong> Treat fellow founders as collaborators, not a sales lead list.</li>
                <li><strong className="text-stone-800 dark:text-stone-100">Reciprocal Help:</strong> Every member is encouraged to offer guidance or introductions in areas where they have surplus experience.</li>
                <li><strong className="text-stone-800 dark:text-stone-100">Privacy & Respect:</strong> Direct phone numbers and personal contact information are kept protected for confirmed members.</li>
              </ul>
            </div>

            <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-750 text-[11px] text-stone-500 dark:text-stone-400">
              💡 <strong>Profile Updates:</strong> To update your venture information, stage, or what you are currently seeking, reach out directly to the BGM community team or submit an update request.
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowAboutModal(false)}
                className="px-4 py-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold rounded-xl transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </header>
  );
}
