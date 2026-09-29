/* eslint-disable no-unused-vars */
import { STORAGE_KEYS, SEED_MEMBERS } from './constants';
import { generateId } from './helpers';

// ─── Module-level cache (fast synchronous access) ─────────────────────────────
let _membersCache = null;
let _exchangeCache = null;

export function invalidateMembersCache() {
  _membersCache = null;
  _exchangeCache = null;
}

function notifyStorageChange() {
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('sed_storage_updated', { detail: { key: STORAGE_KEYS.MEMBERS } })
      );
    }
  } catch {
    // ignore
  }
}

// Background sync to disk via Vite middleware
async function pushToDisk(payload) {
  try {
    if (typeof fetch !== 'undefined') {
      await fetch('/api/storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
  } catch {
    // Server not available (offline or static build) — localStorage handles persistence
  }
}

export async function syncFromDisk() {
  try {
    if (typeof fetch !== 'undefined') {
      const res = await fetch('/api/storage');
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object') {
          if (Array.isArray(data.members)) {
            _membersCache = data.members;
            localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(data.members));
          }
          if (Array.isArray(data.tombstones)) {
            localStorage.setItem(STORAGE_KEYS.TOMBSTONES, JSON.stringify(data.tombstones));
          }
          if (data.sheetsConfig && typeof data.sheetsConfig === 'object') {
            localStorage.setItem(STORAGE_KEYS.SHEETS_CONFIG, JSON.stringify(data.sheetsConfig));
          }
          if (data.adminPIN) {
            localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, data.adminPIN);
          }
          if (data.apiKey) {
            localStorage.setItem(STORAGE_KEYS.API_KEY, data.apiKey);
          }
          localStorage.setItem('sed_initialized', 'true');
          notifyStorageChange();
          return data;
        }
      }
    }
  } catch {
    // ignore
  }
  return null;
}

// ─── Members ──────────────────────────────────────────────────────────────────
export function getMembers() {
  if (_membersCache !== null) return _membersCache;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    if (!raw) {
      _membersCache = [];
      return _membersCache;
    }
    const parsed = JSON.parse(raw);
    _membersCache = Array.isArray(parsed) ? parsed : [];
    return _membersCache;
  } catch {
    _membersCache = [];
    return _membersCache;
  }
}

export function saveMembers(members) {
  const safeList = Array.isArray(members) ? members : [];
  _membersCache = safeList;
  localStorage.setItem('sed_initialized', 'true');
  localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(safeList));
  notifyStorageChange();
  pushToDisk({ members: safeList });
}

export function addMember(memberData) {
  const members = getMembers();
  const member = {
    ...memberData,
    id: memberData.id || generateId(),
    createdAt: memberData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const updated = [member, ...members];
  saveMembers(updated);
  return member;
}

export function addMembers(newMembers) {
  const existing = getMembers();
  const existingNames = new Set(existing.map((m) => m.name?.toLowerCase().trim()));
  const toAdd = (newMembers || [])
    .filter((m) => m && m.name && !existingNames.has(m.name.toLowerCase().trim()))
    .map((m) => ({
      ...m,
      id: m.id || generateId(),
      createdAt: m.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  const merged = [...toAdd, ...existing];
  saveMembers(merged);
  return toAdd;
}

export function updateMember(id, updates) {
  const members = getMembers();
  const idx = members.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  const updatedMember = {
    ...members[idx],
    ...updates,
    locallyEdited: true,
    updatedAt: new Date().toISOString(),
  };
  members[idx] = updatedMember;
  saveMembers([...members]);
  return members[idx];
}

export function deleteMember(id) {
  const members = getMembers();
  const target = members.find((m) => m.id === id);
  if (target) {
    // Record tombstone to permanently prevent resurrection during Google Sheets sync
    if (target.name) addTombstone(target.name.trim().toLowerCase());
    if (target.id) addTombstone(target.id);
    if (target.sheetRowIndex) addTombstone(`sheet-row-${target.sheetRowIndex}`);
  }
  const filtered = members.filter((m) => m.id !== id);
  saveMembers(filtered);
}

export function getMember(id) {
  return getMembers().find((m) => m.id === id) || null;
}

// ─── Load Sample Demo Profiles (Explicit Admin Trigger) ──────────────────────
export function loadDemoSeedData() {
  saveMembers(SEED_MEMBERS);
  return SEED_MEMBERS;
}

// ─── API Key ──────────────────────────────────────────────────────────────────
export function getAPIKey() {
  return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
}

export function saveAPIKey(key) {
  const clean = (key || '').trim();
  localStorage.setItem(STORAGE_KEYS.API_KEY, clean);
  pushToDisk({ apiKey: clean });
}

export function clearAPIKey() {
  localStorage.removeItem(STORAGE_KEYS.API_KEY);
  pushToDisk({ apiKey: '' });
}

// ─── Dark Mode ────────────────────────────────────────────────────────────────
export function getDarkMode() {
  const stored = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
  if (stored !== null) return stored === 'true';
  return window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : true;
}

export function saveDarkMode(isDark) {
  localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(isDark));
  pushToDisk({ darkMode: isDark });
}

// ─── Admin PIN ────────────────────────────────────────────────────────────────
const DEFAULT_PIN_HASH = '0ad56b7d42b80f306a24b61853ecb571e83411f6c0dd5c06c998d9e1c3eecf87'; // 1234

export function getAdminPIN() {
  return localStorage.getItem(STORAGE_KEYS.ADMIN_PIN) || DEFAULT_PIN_HASH;
}

export function saveAdminPIN(pinHash) {
  const safeHash = pinHash || DEFAULT_PIN_HASH;
  localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, safeHash);
  pushToDisk({ adminPIN: safeHash });
  notifyStorageChange();
}

export function clearAdminPIN() {
  localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, DEFAULT_PIN_HASH);
  pushToDisk({ adminPIN: DEFAULT_PIN_HASH });
  notifyStorageChange();
}

// ─── Map Configuration ────────────────────────────────────────────────────────
export function getMapConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MAP_CONFIG);
    if (!raw) {
      return {
        provider: 'carto_voyager',
        apiKey: '',
        styleId: 'mapbox/streets-v12',
        customTileUrl: '',
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      provider: 'carto_voyager',
      apiKey: '',
      styleId: 'mapbox/streets-v12',
      customTileUrl: '',
    };
  }
}

export function saveMapConfig(config) {
  const safe = {
    provider: config?.provider || 'carto_voyager',
    apiKey: (config?.apiKey || '').trim(),
    styleId: (config?.styleId || 'mapbox/streets-v12').trim(),
    customTileUrl: (config?.customTileUrl || '').trim(),
  };
  localStorage.setItem(STORAGE_KEYS.MAP_CONFIG, JSON.stringify(safe));
  pushToDisk({ mapConfig: safe });
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sed_map_config_updated', { detail: safe }));
  }
  return safe;
}

// ─── Full Backup Export / Import ─────────────────────────────────────────────
export function exportAllData() {
  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    members: getMembers(),
  };
}

export function importAllData(data, mode = 'merge') {
  if (!data || typeof data !== 'object') throw new Error('Invalid backup file');

  const incomingMembers = data.members || (Array.isArray(data) ? data : []);

  if (mode === 'replace') {
    saveMembers(incomingMembers);
  } else {
    // Merge mode: add new members by unique ID or Name
    const existing = getMembers();
    const existingIds = new Set(existing.map((m) => m.id));
    const newItems = incomingMembers.filter((m) => !existingIds.has(m.id));
    saveMembers([...existing, ...newItems]);
  }
}

export function clearAllData() {
  _membersCache = [];
  _exchangeCache = [];
  localStorage.setItem('sed_initialized', 'true');
  localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify([]));
  notifyStorageChange();
  pushToDisk({ members: [] });
}

// ─── Google Sheets Sync Configuration ────────────────────────────────────────
const DEFAULT_SHEETS_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SHEETS_URL) ||
  'https://script.google.com/macros/s/AKfycbw4LsEO25x4cShDWg8nI6DSwqURApEB9aMNgT6nb7rPGRkOxlS2nP144PxJLtO6eR9F8Q/exec';

export function getSheetsConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SHEETS_CONFIG);
    if (!raw) {
      return {
        apiUrl: DEFAULT_SHEETS_URL,
        autoSync: false,
        lastSyncAt: null,
        lastSyncStatus: null,
      };
    }
    const parsed = JSON.parse(raw);
    // Always ensure a URL is present even if stored config has empty string
    if (!parsed.apiUrl) parsed.apiUrl = DEFAULT_SHEETS_URL;
    return parsed;
  } catch {
    return {
      apiUrl: DEFAULT_SHEETS_URL,
      autoSync: false,
      lastSyncAt: null,
      lastSyncStatus: null,
    };
  }
}

export function saveSheetsConfig(config) {
  const safe = {
    apiUrl: (config?.apiUrl || '').trim(),
    autoSync: Boolean(config?.autoSync),
    lastSyncAt: config?.lastSyncAt || null,
    lastSyncStatus: config?.lastSyncStatus || null,
  };
  localStorage.setItem(STORAGE_KEYS.SHEETS_CONFIG, JSON.stringify(safe));
  pushToDisk({ sheetsConfig: safe });
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sed_sheets_config_updated', { detail: safe }));
  }
  return safe;
}

// ─── Tombstones (Permanent Deletion Memory for Google Sheets Sync) ───────────
export function getTombstones() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TOMBSTONES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addTombstone(tombstoneKey) {
  if (!tombstoneKey || typeof tombstoneKey !== 'string') return;
  const clean = tombstoneKey.trim().toLowerCase();
  const current = getTombstones();
  if (!current.includes(clean)) {
    const updated = [...current, clean];
    localStorage.setItem(STORAGE_KEYS.TOMBSTONES, JSON.stringify(updated));
    pushToDisk({ tombstones: updated });
  }
}

export function removeTombstone(tombstoneKey) {
  if (!tombstoneKey) return;
  const clean = String(tombstoneKey).trim().toLowerCase();
  const current = getTombstones();
  const updated = current.filter((k) => k !== clean);
  localStorage.setItem(STORAGE_KEYS.TOMBSTONES, JSON.stringify(updated));
  pushToDisk({ tombstones: updated });
}

export function clearTombstones() {
  localStorage.setItem(STORAGE_KEYS.TOMBSTONES, JSON.stringify([]));
  pushToDisk({ tombstones: [] });
}

// ─── Admin Notification Email ─────────────────────────────────────────────────
export function getAdminEmail() {
  try {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_EMAIL) || '';
  } catch {
    return '';
  }
}

export function saveAdminEmail(email) {
  const safe = String(email || '').trim();
  localStorage.setItem(STORAGE_KEYS.ADMIN_EMAIL, safe);
  pushToDisk({ adminEmail: safe });
  return safe;
}
