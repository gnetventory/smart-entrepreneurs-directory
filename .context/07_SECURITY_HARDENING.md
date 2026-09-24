# 07 · SECURITY HARDENING
> Smart Entrepreneurs Directory — Auth Flows, Data Safety & Secret Management  
> Architecture: Client-side only (no backend server)

---

## Threat Model

Given the architecture (no server, all data in localStorage), the threat surface is narrow but specific:

| Threat | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Admin PIN brute force | Medium | High (data deletion) | Rate limit attempts, lockout |
| API key exposure in localStorage | Medium | Medium (API quota abuse) | Key stored locally, never transmitted |
| API key in source code | High | High | Env var only, gitignore .env |
| XSS via parsed member data | Low | High | Sanitize all user inputs before render |
| Data loss (accidental clear) | Medium | High | Confirmation dialogs, export reminders |
| Shared device access | Medium | Medium | Session timeout, PIN requirement |
| Supply chain (npm packages) | Low | High | Lock versions, periodic audit |

---

## Admin Authentication

### Current Implementation
- PIN stored in `localStorage` as key `sed_admin_pin`
- PIN format: raw string (❌ **no hashing currently — SECURITY GAP**)
- No session expiry
- No lockout after failed attempts

### Required Hardening

#### 1. Hash the PIN before storage
```javascript
// Use Web Crypto API — available in all modern browsers, no package needed
async function hashPIN(pin) {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + 'sed-salt-2024'); // domain-specific salt
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPIN(inputPin, storedHash) {
  const inputHash = await hashPIN(inputPin);
  return inputHash === storedHash;
}
```

#### 2. Failed attempt rate limiting
```javascript
// Track attempts in sessionStorage (resets on tab close)
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000; // 5 minutes

function getAttemptState() {
  return JSON.parse(sessionStorage.getItem('sed_admin_attempts') || '{"count":0,"lockedUntil":0}');
}
```

#### 3. Session timeout
```javascript
// Admin session expires after 30 minutes of inactivity
const ADMIN_SESSION_TTL = 30 * 60 * 1000;
// Store: { grantedAt: timestamp } in sessionStorage (tab-scoped)
```

---

## API Key Management

### Current Implementation
- Key entered in Admin Panel UI
- Saved to `localStorage` key `sed_gemini_api_key`
- Also readable from `VITE_GEMINI_API_KEY` env var

### Security Rules

1. **Never hardcode the API key** in source files
2. **Never commit `.env`** — `.gitignore` must include `.env`
3. **Key is never sent to a third-party** — only to `generativelanguage.googleapis.com`
4. **Display masking:** In UI, show only last 4 chars: `••••••••Xk3f`
5. **Key rotation guidance:** Provide a "Clear Key" button in Admin → Settings

### .gitignore Enforcement
```gitignore
.env
.env.local
.env.*.local
dist/
node_modules/
```

---

## Input Sanitization

All text ingested from user input (parse textarea, bulk chat paste) must be sanitized before rendering in React.

### Rules
1. **React handles most XSS** — never use `dangerouslySetInnerHTML` with unsanitized content
2. **Emoji rendering:** Use plain text only — no `innerHTML` insertions
3. **URL fields (if added):** Validate with `URL` constructor before rendering as links
4. **Phone numbers:** Strip non-digit characters before storing; only display formatted

```javascript
// Safe phone sanitization
function sanitizePhone(raw) {
  return raw.replace(/[^\d+\-\s()]/g, '').trim().slice(0, 20);
}

// Safe URL validation
function isSafeURL(str) {
  try {
    const url = new URL(str);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}
```

---

## Data Export Security

- JSON export contains all member data including phone numbers
- **Warning:** Treat exports as sensitive PII (Personally Identifiable Information)
- Recommended: Add a warning dialog before export: _"This file contains personal information. Store securely."_
- Future consideration: Encrypt export with a password using Web Crypto AES-GCM

---

## Privacy Considerations (GDPR-Adjacent)

Even without a server, best practices apply:

| Principle | Implementation |
|---|---|
| **Data minimization** | Only collect what the community template asks for |
| **Right to erasure** | Admin can delete any member; Clear All Data wipes everything |
| **Transparency** | First-run notice: "All data stored locally on this device" |
| **No tracking** | No analytics, no cookies, no external data transmission except Gemini API calls |

---

## Gemini API Call Privacy

When the AI features are used, the following is sent to Google's servers:
- Raw introduction text (for parsing)
- Member summaries (for matchmaking)
- Member names and descriptions (for digest generation)

**Guidance for users:**
> ⚠️ AI features send member data to Google's Gemini API. Ensure your community members consent to this usage. For maximum privacy, use the local rule-based parser (no API call required).

---

## Secret Management Checklist

- [ ] `.env` is in `.gitignore` ✅ (confirmed present)
- [ ] `.env.example` has placeholder values only ✅
- [ ] No hardcoded API keys in source ✅ (verified in gemini.js)
- [ ] Admin PIN is hashed before storage 🔴 (NOT implemented — top priority)
- [ ] Failed login rate limiting 🔴 (NOT implemented)
- [ ] Admin session TTL 🔴 (NOT implemented)
- [ ] Export PII warning dialog 🟡 (recommended)
- [ ] Input sanitization for phone/URL fields 🟡 (partial)
