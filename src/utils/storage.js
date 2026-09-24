import { STORAGE_KEYS, SEED_MEMBERS } from './constants';
import { generateId } from './helpers';

// ─── Module-level cache (eliminates redundant JSON.parse on every call) ──────
let _membersCache = null;
let _exchangeCache = null;

// ─── Members ──────────────────────────────────────────────────────────────────
export function getMembers() {
  if (_membersCache) return _membersCache;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    if (!raw) {
      // First run: load seed data
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(SEED_MEMBERS));
      _membersCache = SEED_MEMBERS;
      return _membersCache;
    }
    _membersCache = JSON.parse(raw);
    return _membersCache;
  } catch {
    _membersCache = SEED_MEMBERS;
    return _membersCache;
  }
}

export function saveMembers(members) {
  _membersCache = members; // update cache synchronously
  localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
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
  const toAdd = newMembers
    .filter((m) => m.name && !existingNames.has(m.name.toLowerCase().trim()))
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
  members[idx] = { ...members[idx], ...updates, updatedAt: new Date().toISOString() };
  saveMembers(members);
  return members[idx];
}

export function deleteMember(id) {
  const members = getMembers().filter((m) => m.id !== id);
  saveMembers(members);
}

export function getMember(id) {
  return getMembers().find((m) => m.id === id) || null;
}

// ─── Skills Exchange Posts ────────────────────────────────────────────────────
export function getExchangePosts() {
  if (_exchangeCache) return _exchangeCache;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXCHANGE);
    if (!raw) {
      _exchangeCache = [];
      return _exchangeCache;
    }
    const posts = JSON.parse(raw);
    // Filter out expired (30-day) posts
    const now = Date.now();
    _exchangeCache = posts.filter((p) => new Date(p.expiresAt).getTime() > now);
    return _exchangeCache;
  } catch {
    _exchangeCache = [];
    return _exchangeCache;
  }
}

export function saveExchangePosts(posts) {
  _exchangeCache = posts; // update cache
  localStorage.setItem(STORAGE_KEYS.EXCHANGE, JSON.stringify(posts));
}

export function addExchangePost(postData) {
  const posts = getExchangePosts();
  const expiresAt = new Date(Date.now() + 30 * 864e5).toISOString();
  const post = {
    ...postData,
    id: generateId(),
    createdAt: new Date().toISOString(),
    expiresAt,
  };
  const updated = [post, ...posts];
  saveExchangePosts(updated);
  return post;
}

export function deleteExchangePost(id) {
  const posts = getExchangePosts().filter((p) => p.id !== id);
  saveExchangePosts(posts);
}

// ─── API Key ──────────────────────────────────────────────────────────────────
export function getAPIKey() {
  return localStorage.getItem(STORAGE_KEYS.API_KEY) || import.meta.env.VITE_GEMINI_API_KEY || '';
}

export function saveAPIKey(key) {
  localStorage.setItem(STORAGE_KEYS.API_KEY, key);
}

// ─── Dark Mode ────────────────────────────────────────────────────────────────
export function getDarkMode() {
  const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
  return saved === null ? false : saved === 'true'; // Default: light mode
}

export function saveDarkMode(val) {
  localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(val));
}

// ─── Admin PIN ────────────────────────────────────────────────────────────────
export function getAdminPIN() {
  return localStorage.getItem(STORAGE_KEYS.ADMIN_PIN) || '';
}

export function saveAdminPIN(hash) {
  localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, hash);
}

export function clearAdminPIN() {
  localStorage.removeItem(STORAGE_KEYS.ADMIN_PIN);
}

// ─── Full Export / Import ────────────────────────────────────────────────────
export function exportAllData() {
  return {
    exportedAt: new Date().toISOString(),
    version: '1.0',
    members: getMembers(),
    exchangePosts: getExchangePosts(),
  };
}

export function importAllData(data, mode = 'merge') {
  if (mode === 'replace') {
    saveMembers(data.members || []);
    saveExchangePosts(data.exchangePosts || []);
  } else {
    addMembers(data.members || []);
    const existingPosts = getExchangePosts();
    const existingIds = new Set(existingPosts.map((p) => p.id));
    const newPosts = (data.exchangePosts || []).filter((p) => !existingIds.has(p.id));
    saveExchangePosts([...newPosts, ...existingPosts]);
  }
}

export function clearAllData() {
  _membersCache = null;
  _exchangeCache = null;
  localStorage.removeItem(STORAGE_KEYS.MEMBERS);
  localStorage.removeItem(STORAGE_KEYS.EXCHANGE);
}
