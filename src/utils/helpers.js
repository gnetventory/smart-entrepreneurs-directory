import { AVATAR_GRADIENTS, STAGES } from './constants';
import { formatDistanceToNow, differenceInDays } from 'date-fns';

// ─── Avatar ────────────────────────────────────────────────────────────────────
export function getInitials(name = '') {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getAvatarGradient(name = '') {
  const idx = name.charCodeAt(0) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[idx];
}

// ─── Dates ─────────────────────────────────────────────────────────────────────
export function timeAgo(dateStr) {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return 'recently';
  }
}

export function isStale(dateStr, thresholdDays = 90) {
  try {
    return differenceInDays(new Date(), new Date(dateStr)) >= thresholdDays;
  } catch {
    return false;
  }
}

export function daysSince(dateStr) {
  try {
    return differenceInDays(new Date(), new Date(dateStr));
  } catch {
    return 0;
  }
}

// ─── Stage helpers ─────────────────────────────────────────────────────────────
export function getStage(stageKey) {
  return STAGES[stageKey] || STAGES.idea;
}

// ─── Phone number normalizer ──────────────────────────────────────────────────
export function normalizePhone(phone = '') {
  return phone.replace(/[\s\-().+]/g, '');
}

export function buildWhatsAppUrl(phone = '', name = '') {
  const num = normalizePhone(phone);
  if (!num) return null;
  return `https://wa.me/${num}`;
}

// ─── Search helpers ───────────────────────────────────────────────────────────
export function memberMatchesSearch(member, query) {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  return (
    member.name?.toLowerCase().includes(q) ||
    member.role?.toLowerCase().includes(q) ||
    member.business?.toLowerCase().includes(q) ||
    member.canHelp?.toLowerCase().includes(q) ||
    member.lookingFor?.toLowerCase().includes(q) ||
    member.tags?.some((t) => t.toLowerCase().includes(q)) ||
    member.location?.country?.toLowerCase().includes(q) ||
    member.location?.city?.toLowerCase().includes(q)
  );
}

// ─── Unique ID ────────────────────────────────────────────────────────────────
export function generateId() {
  return crypto && crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// ─── Copy to clipboard ────────────────────────────────────────────────────────
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// ─── Date formatting ─────────────────────────────────────────────────────────
export function formatDate(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

// ─── PIN hashing (Web Crypto API with Pure JS fallback for non-HTTPS IPs) ──────
function simpleHash(str) {
  let h1 = 0xdeadbeef ^ 0, h2 = 0x41c6ce57 ^ 0;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
}

export async function hashPIN(pin) {
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.digest) {
      const encoder = new TextEncoder();
      const data = encoder.encode(`sed-pin-salt-${pin}`);
      const hash = await crypto.subtle.digest('SHA-256', data);
      return Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    }
  } catch {
    // fallback if Web Crypto API is unavailable
  }
  return `hash-${simpleHash(`sed-pin-salt-${pin}`)}`;
}

export async function verifyPIN(pin, hash) {
  const computed = await hashPIN(pin);
  return computed === hash;
}

// ─── Export / Import ─────────────────────────────────────────────────────────
export function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Weekly date range ────────────────────────────────────────────────────────
export function getThisWeekRange() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - 7);
  return { start, end: now };
}

export function isWithinDays(dateStr, days) {
  try {
    return differenceInDays(new Date(), new Date(dateStr)) <= days;
  } catch {
    return false;
  }
}
