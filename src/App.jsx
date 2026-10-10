import React from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Directory from './components/directory/Directory';
import MatchRadarView from './components/radar/MatchRadarView';
import WorldMapView from './components/map/WorldMapView';
import CommunityDashboard from './components/dashboard/CommunityDashboard';
import { useApp } from './contexts/AppContext';

export default function App() {
  const { activeTab, notification, setActiveTab } = useApp();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <CommunityDashboard />;
      case 'directory':
        return <Directory />;
      case 'radar':
        return <MatchRadarView />;
      case 'map':
        return <WorldMapView />;
      default:
        return <CommunityDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200">
      {notification && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold flex items-center gap-2.5 animate-slide-up border ${
            notification.type === 'error'
              ? 'bg-rose-600 text-white border-rose-500'
              : notification.type === 'warning'
                ? 'bg-amber-500 text-stone-950 border-amber-400'
                : 'bg-emerald-600 text-white border-emerald-500'
          }`}
        >
          <span>{notification.message}</span>
        </div>
      )}
      <Header />
      <div className="flex-1 flex items-start max-w-[1800px] w-full mx-auto px-4 sm:px-6 lg:px-10 gap-8">
        <Sidebar />
        <main className="flex-1 min-w-0 py-6 sm:py-8">{renderTabContent()}</main>
      </div>
    </div>
  );
}
