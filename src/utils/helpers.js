/* eslint-disable no-unused-vars, no-useless-escape */
import { AVATAR_GRADIENTS, STAGES } from './constants';
import { formatDistanceToNow, differenceInDays } from 'date-fns';

// ─── Avatar ────────────────────────────────────────────────────────────────────
export function getInitials(name = '') {
  if (!name || typeof name !== 'string') return '??';
  return (
    name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '??'
  );
}

export function getAvatarGradient(name = '') {
  if (!name || typeof name !== 'string') return AVATAR_GRADIENTS[0];
  const idx = name.charCodeAt(0) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[idx];
}

// ─── Dates ─────────────────────────────────────────────────────────────────────
export function timeAgo(dateStr) {
  try {
    if (!dateStr) return 'recently';
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return 'recently';
  }
}

export function isStale(dateStr, thresholdDays = 90) {
  try {
    if (!dateStr) return false;
    return differenceInDays(new Date(), new Date(dateStr)) >= thresholdDays;
  } catch {
    return false;
  }
}

export function daysSince(dateStr) {
  try {
    if (!dateStr) return 0;
    return differenceInDays(new Date(), new Date(dateStr));
  } catch {
    return 0;
  }
}

// ─── Stage helpers ─────────────────────────────────────────────────────────────
export function getStage(stageKey) {
  return STAGES[stageKey] || STAGES.idea;
}

// ─── Phone number normalizer & WhatsApp ────────────────────────────────────────
export function normalizePhone(phone = '') {
  if (!phone || typeof phone !== 'string') return '';
  return phone.replace(/[\s\-().+]/g, '');
}

export function buildWhatsAppUrl(phone = '', name = '') {
  const num = normalizePhone(phone);
  if (!num || num.length < 5) return null;
  return `https://wa.me/${num}`;
}

// ─── LinkedIn Validation & Normalization ───────────────────────────────────────
const INVALID_LINKEDIN_VALUES = new Set([
  'none',
  'n/a',
  'na',
  'no',
  'null',
  'undefined',
  'false',
  '0',
  'test',
  'hnaklinked',
  'linkedin',
  'profile',
]);

export function isValidLinkedInUrl(url = '') {
  if (!url || typeof url !== 'string') return false;
  const clean = url.trim().toLowerCase().replace(/^@/, '');
  if (clean.length < 3 || INVALID_LINKEDIN_VALUES.has(clean)) return false;
  // Valid if it looks like a url or a valid profile handle
  return /^[a-zA-Z0-9_\-\.\/:]+$/.test(clean);
}

export function formatLinkedInUrl(url = '') {
  if (!isValidLinkedInUrl(url)) return null;
  const clean = url.trim().replace(/^@/, '');

  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }
  if (clean.startsWith('linkedin.com/') || clean.startsWith('www.linkedin.com/')) {
    return `https://${clean}`;
  }
  if (clean.startsWith('in/')) {
    return `https://linkedin.com/${clean}`;
  }
  return `https://linkedin.com/in/${clean}`;
}

export function getLinkedInHandle(url = '') {
  if (!isValidLinkedInUrl(url)) return null;
  const clean = url
    .trim()
    .replace(/^https?:\/\/(www\.)?linkedin\.com\/(in\/)?/, '')
    .replace(/\/$/, '');
  return clean || null;
}

// ─── Search helpers ───────────────────────────────────────────────────────────
export function memberMatchesSearch(member, query) {
  if (!query || !query.trim()) return true;
  const q = query.toLowerCase().trim();
  const locStr =
    typeof member.location === 'string'
      ? member.location.toLowerCase()
      : `${member.location?.city || ''} ${member.location?.district || ''} ${member.location?.country || ''}`.toLowerCase();

  return (
    member.name?.toLowerCase().includes(q) ||
    member.role?.toLowerCase().includes(q) ||
    member.business?.toLowerCase().includes(q) ||
    member.canHelp?.toLowerCase().includes(q) ||
    member.lookingFor?.toLowerCase().includes(q) ||
    member.linkedin?.toLowerCase().includes(q) ||
    member.tags?.some((t) => t.toLowerCase().includes(q)) ||
    locStr.includes(q)
  );
}

// ─── Unique ID ────────────────────────────────────────────────────────────────
export function generateId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// ─── Copy to clipboard ────────────────────────────────────────────────────────
export async function copyToClipboard(text) {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fallback
  }
  return false;
}

// ─── Date formatting ─────────────────────────────────────────────────────────
export function formatDate(dateStr) {
  try {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

// ─── PIN hashing ──────────────────────────────────────────────────────────────
function simpleHash(str) {
  let h1 = 0xdeadbeef ^ 0,
    h2 = 0x41c6ce57 ^ 0;
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

export function isWithinDays(dateStr, days) {
  try {
    if (!dateStr) return false;
    return differenceInDays(new Date(), new Date(dateStr)) <= days;
  } catch {
    return false;
  }
}

// ─── Digital Business Card & vCard Generation ─────────────────────────────────
export function generateVCard(member) {
  if (!member) return '';
  const name = member.name || 'Founder';
  const role = member.role || 'Entrepreneur';
  const business = member.business ? member.business.split('\n')[0] : 'Alliance Network';
  const phone = member.phone || '';
  const email = member.email || '';
  const linkedin = member.linkedin || '';
  const city =
    typeof member.location === 'string'
      ? member.location
      : member.location?.city || member.location?.district || '';
  const country = typeof member.location === 'object' ? member.location?.country || '' : '';
  const location = [city, country].filter(Boolean).join(', ');

  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${name}`,
    `TITLE:${role}`,
    `ORG:${business}`,
    phone ? `TEL;TYPE=CELL:${phone}` : '',
    email ? `EMAIL:${email}` : '',
    linkedin ? `URL:${linkedin}` : '',
    location ? `ADR;TYPE=WORK:;;${city};;;;${country}` : '',
    `NOTE:Member of Smart Entrepreneurs Directory`,
    'END:VCARD',
  ]
    .filter(Boolean)
    .join('\r\n');

  return vcard;
}

export function downloadVCardFile(member) {
  if (!member) return;
  const vcardText = generateVCard(member);
  const blob = new Blob([vcardText], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeName = (member.name || 'Member').replace(/[^a-zA-Z0-9_\-]/g, '_');
  link.href = url;
  link.setAttribute('download', `${safeName}_Contact.vcf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
