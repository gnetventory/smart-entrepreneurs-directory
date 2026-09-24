import React from 'react';
import {
  Users, UserPlus, Sparkles, Globe, ArrowLeftRight,
  BarChart3, FileText, Settings, CreditCard, BookOpen
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { NAV_TABS } from '../../utils/constants';

const ICONS = {
  Users, UserPlus, Sparkles, Globe, ArrowLeftRight,
  BarChart3, FileText, Settings, CreditCard, BookOpen
};

export default function Sidebar() {
  const { activeTab, setActiveTab, members, sidebarOpen, setSidebarOpen } = useApp();

  const handleNav = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-stone-950/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed top-0 left-0 z-30 h-full w-72 
        bg-stone-50 dark:bg-stone-950/95 lg:bg-transparent border-r border-stone-200 dark:border-stone-800 lg:border-none
        flex flex-col pt-20 lg:pt-0 transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:sticky lg:top-24 lg:translate-x-0 lg:h-[calc(100vh-8rem)] lg:z-0
      `}>
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2">
          {NAV_TABS.map((tab) => {
            const Icon = ICONS[tab.icon];
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleNav(tab.id)}
                className={`
                  w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all duration-150 group
                  ${isActive
                    ? 'bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 font-bold border border-stone-200 dark:border-stone-800 shadow-sm'
                    : 'text-stone-700 dark:text-stone-400 hover:bg-stone-200/50 dark:hover:bg-stone-900/60 hover:text-stone-900 dark:hover:text-stone-100 font-semibold border border-transparent'
                  }
                `}
              >
                {Icon && (
                  <Icon
                    size={18}
                    className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-400 dark:text-stone-500 group-hover:text-stone-600 dark:group-hover:text-stone-300'}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm tracking-tight">{tab.label}</div>
                </div>
                {tab.id === 'directory' && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold border ${
                    isActive 
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' 
                      : 'bg-stone-200/70 dark:bg-stone-900 border-stone-300 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                  }`}>
                    {members.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom card */}
        <div className="mt-auto pt-4">
          <div className="card p-4 text-center bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-sm">
            <p className="text-xs font-bold text-stone-800 dark:text-stone-300 uppercase tracking-wider mb-0.5">Zero-Cost & Private</p>
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400">{members.length} active members stored locally</p>
          </div>
        </div>
      </aside>
    </>
  );
}
