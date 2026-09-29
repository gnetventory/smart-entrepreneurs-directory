// ─── Admin Session Helpers ────────────────────────────────────────────────────
// Shared between the public app and the admin entry point.
// The session token can only be SET from the admin portal (admin.html).
// In the public app this will always return false, effectively hiding
// all sensitive data (phone numbers, WhatsApp links) from public viewers.

const SESSION_KEY = 'sed_admin_session';
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes

export function isAdminSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const { grantedAt } = JSON.parse(raw);
    if (Date.now() - grantedAt > SESSION_TTL_MS) {
      sessionStorage.removeItem(SESSION_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function grantAdminSession() {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ grantedAt: Date.now() }));
}

export function revokeAdminSession() {
  sessionStorage.removeItem(SESSION_KEY);
}
