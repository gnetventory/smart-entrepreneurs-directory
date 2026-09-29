import React from 'react';
import {
  Users,
  UserPlus,
  Sparkles,
  Globe,
  Map,
  BarChart3,
  Settings,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { NAV_TABS } from '../../utils/constants';

const ICONS = {
  Users,
  UserPlus,
  Sparkles,
  Globe,
  Map,
  BarChart3,
};

export default function Sidebar() {
  const { activeTab, setActiveTab, activeMembers: members, sidebarOpen, setSidebarOpen } = useApp();

  const handleNav = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-stone-950/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 z-30 h-full w-64
        bg-[#FAFAF7] dark:bg-stone-950/95
        border-r border-stone-200/80 dark:border-stone-800
        lg:bg-transparent lg:border-none
        flex flex-col pt-20 pb-4 lg:pt-0
        transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:sticky lg:top-24 lg:translate-x-0 lg:h-[calc(100vh-7rem)] lg:z-0
      `}
      >
        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto pr-1 lg:pr-2">
          {NAV_TABS.map((tab) => {
            const Icon = ICONS[tab.icon];
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleNav(tab.id)}
                title={tab.description}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
                  transition-all duration-150 group relative
                  ${
                    isActive
                      ? 'bg-emerald-600 text-white font-bold shadow-sm shadow-emerald-600/20'
                      : 'text-stone-700 dark:text-stone-400 hover:bg-white dark:hover:bg-stone-900 hover:text-stone-900 dark:hover:text-stone-100 font-semibold hover:shadow-card'
                  }
                `}
              >
                {/* Orange left indicator bar for active */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-orange-400 rounded-r-full -ml-[1px]" />
                )}

                {Icon && (
                  <Icon
                    size={17}
                    className={
                      isActive
                        ? 'text-white flex-shrink-0'
                        : 'text-stone-400 dark:text-stone-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 flex-shrink-0 transition-colors'
                    }
                  />
                )}

                <div className="flex-1 min-w-0">
                  <span className="text-sm leading-none">{tab.label}</span>
                </div>

                {/* Member count badge on Directory tab */}
                {tab.id === 'directory' && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold flex-shrink-0 ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-700/30'
                    }`}
                  >
                    {members.length}
                  </span>
                )}

                {/* Dashboard "home" badge */}
                {tab.id === 'dashboard' && !isActive && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wide flex-shrink-0">
                    Home
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="pt-3 space-y-2 border-t border-stone-200/60 dark:border-stone-800 mt-3">
          {/* Community stats card */}
          <div className="card p-3.5 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp size={13} className="text-orange-500 flex-shrink-0" />
              <span className="text-[10px] font-extrabold text-stone-500 dark:text-stone-400 uppercase tracking-widest">
                Community
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-stone-900 dark:text-stone-100 font-display">
                {members.length}
              </span>
              <span className="text-xs text-stone-500 font-medium">members</span>
            </div>
            <div className="h-1 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-orange-500 transition-all duration-700"
                style={{ width: `${Math.min(100, (members.length / 200) * 100)}%` }}
              />
            </div>
          </div>

          {/* Admin link */}
          <a
            href="/admin.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] text-stone-400 dark:text-stone-600 hover:text-stone-600 dark:hover:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors font-medium"
          >
            <Settings size={12} />
            Admin Portal
          </a>
        </div>
      </aside>
    </>
  );
}
