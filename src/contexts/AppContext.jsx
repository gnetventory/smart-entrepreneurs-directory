import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getMembers, saveMembers, getAPIKey, saveAPIKey, getDarkMode, saveDarkMode, getExchangePosts } from '../utils/storage';
import { initGemini } from '../utils/gemini';

// ─── Context Definitions ──────────────────────────────────────────────────────
const MembersContext = createContext(null);
const UIContext = createContext(null);
const FiltersContext = createContext(null);

// ─── AppProvider (composes all three) ────────────────────────────────────────
export function AppProvider({ children }) {
  // ── Data layer ───────────────────────────────────────────────────────────
  const [members, setMembersState] = useState([]);
  const [exchangePosts, setExchangePosts] = useState([]);

  // ── UI layer ─────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('directory');
  const [darkMode, setDarkMode] = useState(true);
  const [apiKey, setApiKeyState] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState(null); // { type, message }

  // ── Filter layer ─────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'matchmaker'

  // Initialize on mount & Fetch remote members from Google Sheets API
  useEffect(() => {
    const dm = getDarkMode();
    setDarkMode(dm);
    document.documentElement.classList.toggle('dark', dm);

    const key = getAPIKey();
    setApiKeyState(key);
    if (key) initGemini(key);

    // Initial load: Local storage madhun instant display sathi data ghya
    setMembersState(getMembers());
    setExchangePosts(getExchangePosts());

    // Step 2.2: Google Sheets API kadhun latest members fetch kara
    const fetchMembersFromSheets = async () => {
      const apiUrl = import.meta.env.VITE_SHEETS_API_URL;
      if (!apiUrl) return;

      try {
        const response = await fetch(apiUrl);
        const remoteMembers = await response.json();

        if (Array.isArray(remoteMembers) && remoteMembers.length > 0) {
          // Local storage update kara
          saveMembers(remoteMembers);
          // State update kara mhanje UI la fresh data disel
          setMembersState(remoteMembers);
        }
      } catch (error) {
        console.error("Google Sheets kadhun members fetch kartana error aala:", error);
      }
    };

    fetchMembersFromSheets();
  }, []);

  // ── Members actions ────────────────────────────────────────────────────
  const refreshMembers = useCallback(() => {
    setMembersState(getMembers());
  }, []);

  const refreshExchange = useCallback(() => {
    setExchangePosts(getExchangePosts());
  }, []);

  // ── UI actions ─────────────────────────────────────────────────────────
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      saveDarkMode(next);
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  }, []);

  const updateApiKey = useCallback((key) => {
    saveAPIKey(key);
    setApiKeyState(key);
    initGemini(key);
  }, []);

  const notify = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  }, []);

  // ── Stable context values (memoized to prevent unnecessary re-renders) ──
  const membersValue = useMemo(() => ({
    members,
    setMembersState,
    exchangePosts,
    refreshMembers,
    refreshExchange,
  }), [members, exchangePosts, refreshMembers, refreshExchange]);

  const uiValue = useMemo(() => ({
    activeTab,
    setActiveTab,
    darkMode,
    toggleDarkMode,
    apiKey,
    updateApiKey,
    sidebarOpen,
    setSidebarOpen,
    notification,
    notify,
  }), [activeTab, darkMode, toggleDarkMode, apiKey, updateApiKey, sidebarOpen, notification, notify]);

  const filtersValue = useMemo(() => ({
    searchQuery,
    setSearchQuery,
    stageFilter,
    setStageFilter,
    viewMode,
    setViewMode,
  }), [searchQuery, stageFilter, viewMode]);

  return (
    <MembersContext.Provider value={membersValue}>
      <UIContext.Provider value={uiValue}>
        <FiltersContext.Provider value={filtersValue}>
          {children}
        </FiltersContext.Provider>
      </UIContext.Provider>
    </MembersContext.Provider>
  );
}

// ─── Hooks ────────────────────────────────────────────────────────────────────
export function useMembers() {
  const ctx = useContext(MembersContext);
  if (!ctx) throw new Error('useMembers must be used within AppProvider');
  return ctx;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within AppProvider');
  return ctx;
}

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error('useFilters must be used within AppProvider');
  return ctx;
}

// ─── Legacy useApp hook (backward compat — aggregates all three) ──────────────
export function useApp() {
  const members = useMembers();
  const ui = useUI();
  const filters = useFilters();
  return { ...members, ...ui, ...filters };
}