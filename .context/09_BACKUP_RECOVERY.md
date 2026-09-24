# 09 · BACKUP & RECOVERY
> Smart Entrepreneurs Directory — Data Snapshots, Rollback Flows & Branching Strategy

---

## Data Architecture Reality

This app stores all data in **browser localStorage** — there is no server, no database, and no automatic cloud backup. This places the **entire responsibility for data persistence on the user/admin**.

### What Can Be Lost
- All member profiles (if localStorage is cleared)
- All skills exchange posts
- Admin PIN
- API key preference
- Theme preference

---

## Backup Mechanisms

### 1. JSON Export (Built-In)

The Admin Panel exposes an `exportAllData()` function that produces:

```json
{
  "exportedAt": "2026-09-22T00:00:00.000Z",
  "version": "1.0",
  "members": [ ...Member[] ],
  "exchangePosts": [ ...SkillsExchangePost[] ]
}
```

**Export procedure:**
1. Open Admin Panel
2. Enter PIN
3. Click "Export Data" → downloads `sed-backup-[date].json`

**Recommended cadence:** Weekly for active communities, after every bulk import

---

### 2. JSON Import / Restore

**Restore procedure:**
1. Open Admin Panel → Import
2. Select backup `.json` file
3. Choose mode:
   - **Merge** — adds new members, skips name-duplicates, preserves existing data
   - **Replace** — wipes current data and loads backup exactly

---

### 3. Manual localStorage Snapshot (Developer)

For power users / developers:

```javascript
// In browser DevTools console:

// Export to clipboard
copy(localStorage.getItem('sed_members'));

// Full snapshot
const backup = {};
for (const key of Object.keys(localStorage)) {
  if (key.startsWith('sed_')) backup[key] = localStorage.getItem(key);
}
console.log(JSON.stringify(backup, null, 2));
```

---

## Recovery Scenarios

### Scenario A: Accidental "Clear All Data"

| Step | Action |
|---|---|
| 1 | Open Admin Panel |
| 2 | Import → select most recent `.json` backup |
| 3 | Choose **Replace** mode |
| 4 | Confirm — directory restored |

**Prevention:** Implement double-confirm dialog before `clearAllData()`:
```
"Are you sure? This will delete all [47] members. This cannot be undone."
[Cancel] [Type 'DELETE' to confirm]
```

---

### Scenario B: Browser Storage Cleared / New Device

1. Ensure latest backup is available (email, cloud drive, or WhatsApp to self)
2. Open app on new device
3. Admin Panel → Import → select backup file
4. Re-enter API key in Admin → Settings
5. Set PIN if desired

---

### Scenario C: Corrupt Import File

If an imported JSON is malformed:
1. The app will show an error toast: _"Import failed: invalid file format"_
2. Existing data is NOT affected (import is transactional — parse first, write only on success)
3. Try re-exporting from the source device

---

## Git Branching Strategy

For developers working on the codebase:

```
main
├── Always deployable
├── Protected: no direct commits
└── Merges only via PR with review

develop
├── Integration branch
├── Feature PRs merge here first
└── Periodic merge to main for releases

feature/[name]
├── One branch per feature or bugfix
├── Naming: feature/business-card, fix/admin-pin-hash
└── Short-lived: delete after merge

hotfix/[name]
├── Urgent production fixes
├── Branch from: main
└── Merge to: main + develop
```

---

## Disaster Recovery Runbook

### RTO (Recovery Time Objective): < 5 minutes
### RPO (Recovery Point Objective): Last export (admin-controlled)

```
1. Identify failure mode
   ├── Browser cleared → Restore from JSON backup
   ├── Corrupt state → Clear localStorage, reimport
   ├── App not loading → Check dist/ build, verify vite config
   └── API key lost → Re-enter in Admin → Settings

2. Restore procedure
   ├── Open app
   ├── Navigate to Admin Panel
   ├── Import backup file
   └── Verify member count matches pre-incident count

3. Post-recovery
   ├── Set up weekly export reminder
   ├── Consider storing backup in cloud (Google Drive, Dropbox)
   └── Document incident date and data loss window
```

---

## Recommended Enhancements

### Auto-Export Reminder
```javascript
// Check if last export was >7 days ago
const EXPORT_REMINDER_KEY = 'sed_last_export';
const daysSinceExport = () => {
  const last = localStorage.getItem(EXPORT_REMINDER_KEY);
  if (!last) return Infinity;
  return (Date.now() - new Date(last).getTime()) / 864e5;
};

// Show banner in Admin Panel if > 7 days
if (daysSinceExport() > 7) {
  showReminder('⚠️ You haven\'t exported your data in 7+ days. Export now to prevent data loss.');
}
```

### Future: Cloud Sync (Out of Scope for v1)
Options if cloud sync becomes needed:
- Firebase Realtime Database / Firestore (free tier)
- Supabase (PostgreSQL, free tier)
- GitHub Gist as storage (API-based, no cost)
- Google Drive API (user owns their data)
