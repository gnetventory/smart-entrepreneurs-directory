import React from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Directory from './components/directory/Directory';
import AIParser from './components/parser/AIParser';
import AIMatchmaker from './components/matchmaker/AIMatchmaker';
import WorldMapView from './components/map/WorldMapView';
import CommunityDashboard from './components/dashboard/CommunityDashboard';
import SkillsExchange from './components/exchange/SkillsExchange';
import WeeklyDigest from './components/digest/WeeklyDigest';
import AdminPanel from './components/admin/AdminPanel';
import BusinessCardPage from './components/businesscard/BusinessCardPage';
import IntroGuide from './components/guide/IntroGuide';
import { useApp } from './contexts/AppContext';

export default function App() {
  const { activeTab, notification, setActiveTab } = useApp();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'directory':    return <Directory />;
      case 'add':          return <AIParser />;
      case 'matchmaker':   return <AIMatchmaker />;
      case 'map':          return <WorldMapView />;
      case 'exchange':     return <SkillsExchange />;
      case 'dashboard':    return <CommunityDashboard />;
      case 'digest':       return <WeeklyDigest />;
      case 'businesscard': return <BusinessCardPage />;
      case 'guide':        return <IntroGuide onUseTemplate={() => setActiveTab('add')} />;
      case 'admin':        return <AdminPanel />;
      default:             return <Directory />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200">
      {/* Toast Notification Banner */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold flex items-center gap-2.5 animate-slide-up border ${
          notification.type === 'error'
            ? 'bg-rose-600 text-white border-rose-500'
            : notification.type === 'warning'
            ? 'bg-amber-500 text-stone-950 border-amber-400'
            : 'bg-emerald-600 text-white border-emerald-500'
        }`}>
          <span>{notification.message}</span>
        </div>
      )}

      <Header />

      <div className="flex-1 flex max-w-[1800px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 gap-8">
        <Sidebar />
        <main className="flex-1 min-w-0">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}
