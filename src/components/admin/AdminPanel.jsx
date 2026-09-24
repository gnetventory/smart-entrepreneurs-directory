import React, { useState, useEffect } from 'react';
import { Settings, Download, Upload, Shield, AlertTriangle, Key, Trash2, Check, Lock, Unlock, AlertCircle, Clock } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { exportAllData, importAllData, clearAllData, getAdminPIN, saveAdminPIN, clearAdminPIN } from '../../utils/storage';
import { isStale, downloadJSON, hashPIN, verifyPIN } from '../../utils/helpers';
import Modal from '../common/Modal';

// ─── Session & Rate-Limit Helpers ────────────────────────────────────────────
const SESSION_KEY = 'sed_admin_session';
const ATTEMPT_KEY = 'sed_admin_attempts';
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000; // 5 minutes

function getSessionState() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const { grantedAt } = JSON.parse(raw);
    if (Date.now() - grantedAt > SESSION_TTL_MS) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return { grantedAt };
  } catch {
    return null;
  }
}

function grantSession() {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ grantedAt: Date.now() }));
}

function revokeSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

function getAttemptState() {
  try {
    const raw = sessionStorage.getItem(ATTEMPT_KEY);
    return raw ? JSON.parse(raw) : { count: 0, lockedUntil: 0 };
  } catch {
    return { count: 0, lockedUntil: 0 };
  }
}

function recordFailedAttempt() {
  const state = getAttemptState();
  const newCount = state.count + 1;
  const lockedUntil = newCount >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_MS : state.lockedUntil;
  sessionStorage.setItem(ATTEMPT_KEY, JSON.stringify({ count: newCount, lockedUntil }));
  return { count: newCount, lockedUntil };
}

function resetAttempts() {
  sessionStorage.removeItem(ATTEMPT_KEY);
}

function getLockoutRemaining() {
  const { lockedUntil } = getAttemptState();
  const remaining = lockedUntil - Date.now();
  return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
}

// ─── PIN Gate Component ───────────────────────────────────────────────────────
function PINGate({ onUnlocked, hasPIN }) {
  const [pinInput, setPinInput] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [lockdownSecs, setLockdownSecs] = useState(getLockoutRemaining());
  const [loading, setLoading] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (lockdownSecs <= 0) return;
    const timer = setInterval(() => {
      const remaining = getLockoutRemaining();
      setLockdownSecs(remaining);
      if (remaining <= 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [lockdownSecs]);

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (lockdownSecs > 0) return;
    setLoading(true);
    setError('');
    try {
      const storedHash = getAdminPIN();
      const ok = await verifyPIN(pinInput, storedHash);
      if (ok) {
        resetAttempts();
        grantSession();
        onUnlocked();
      } else {
        const { count, lockedUntil } = recordFailedAttempt();
        if (lockedUntil > Date.now()) {
          setLockdownSecs(Math.ceil((lockedUntil - Date.now()) / 1000));
          setError(`Too many attempts. Locked for 5 minutes.`);
        } else {
          setError(`Incorrect PIN. ${MAX_ATTEMPTS - count} attempt(s) remaining.`);
        }
        setPinInput('');
      }
    } catch (err) {
      console.error(err);
      setError('Verification error: ' + (err.message || 'Error checking PIN'));
    } finally {
      setLoading(false);
    }
  };

  const handleSetPIN = async (e) => {
    e.preventDefault();
    if (newPin.length < 4) { setError('PIN must be at least 4 characters.'); return; }
    if (newPin !== confirmPin) { setError('PINs do not match.'); return; }
    setLoading(true);
    setError('');
    try {
      const hash = await hashPIN(newPin);
      saveAdminPIN(hash);
      resetAttempts();
      grantSession();
      onUnlocked();
    } catch (err) {
      console.error(err);
      setError('Failed to set PIN: ' + (err.message || 'Error creating PIN hash'));
    } finally {
      setLoading(false);
    }
  };

  if (!hasPIN) {
    return (
      <div className="max-w-md mx-auto">
        <div className="card p-8 space-y-6 border-emerald-200 dark:border-emerald-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl">
              <Shield size={22} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 dark:text-stone-100">Set Admin PIN</h3>
              <p className="text-sm text-stone-500 dark:text-stone-400">Create a PIN to protect admin functions</p>
            </div>
          </div>
          <form onSubmit={handleSetPIN} className="space-y-4">
            <div>
              <label className="label">New PIN (min 4 characters)</label>
              <input
                type="password"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="Enter new PIN"
                className="input"
                autoFocus
              />
            </div>
            <div>
              <label className="label">Confirm PIN</label>
              <input
                type="password"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="Repeat PIN"
                className="input"
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-sm text-rose-600 dark:text-rose-400 font-semibold">
                <AlertCircle size={15} /> {error}
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Securing...' : 'Set PIN & Enter Admin'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-stone-100 dark:bg-stone-800 rounded-xl">
            <Lock size={22} className="text-stone-600 dark:text-stone-400" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 dark:text-stone-100">Admin Access Required</h3>
            <p className="text-sm text-stone-500 dark:text-stone-400">Enter your admin PIN to continue</p>
          </div>
        </div>

        {lockdownSecs > 0 ? (
          <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-500/30 rounded-xl flex items-center gap-3">
            <Clock size={18} className="text-rose-600 dark:text-rose-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-rose-700 dark:text-rose-300">Too many failed attempts</p>
              <p className="text-xs text-rose-600 dark:text-rose-400">Locked for {lockdownSecs}s</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="label">Admin PIN</label>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN"
                className="input"
                autoFocus
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-sm text-rose-600 dark:text-rose-400 font-semibold">
                <AlertCircle size={15} /> {error}
              </div>
            )}
            <button type="submit" disabled={loading || !pinInput} className="btn-primary w-full">
              {loading ? 'Verifying...' : <><Unlock size={16} /> Unlock Admin Panel</>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Main Admin Panel ─────────────────────────────────────────────────────────
export default function AdminPanel() {
  const { apiKey, updateApiKey, members, refreshMembers, notify } = useApp();
  const [keyInput, setKeyInput] = useState(apiKey);
  const [importMode, setImportMode] = useState('merge');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showExportWarning, setShowExportWarning] = useState(false);
  const [showChangePIN, setShowChangePIN] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [unlocked, setUnlocked] = useState(!!getSessionState());

  const hasPIN = !!getAdminPIN();
  const staleMembers = members.filter((m) => isStale(m.updatedAt));

  // Refresh session check on mount
  useEffect(() => {
    setUnlocked(!!getSessionState());
  }, []);

  const handleLock = () => {
    revokeSession();
    setUnlocked(false);
  };

  const handleSaveKey = (e) => {
    e.preventDefault();
    updateApiKey(keyInput.trim());
    notify('Gemini API key saved!');
  };

  const handleExport = () => {
    setShowExportWarning(true);
  };

  const doExport = () => {
    const data = exportAllData();
    downloadJSON(data, `smart_directory_backup_${new Date().toISOString().slice(0, 10)}.json`);
    localStorage.setItem('sed_last_export', new Date().toISOString());
    setShowExportWarning(false);
    notify('Exported JSON backup! Store it securely.');
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const json = JSON.parse(evt.target.result);
        if (!json.members && !Array.isArray(json)) throw new Error('Invalid JSON structure');
        importAllData(json, importMode);
        refreshMembers();
        notify(`Data imported successfully (${importMode} mode)! 🎉`);
      } catch (err) {
        console.error(err);
        notify('Failed to parse JSON file — check file format', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAll = () => {
    if (deleteConfirmText !== 'DELETE') return;
    clearAllData();
    refreshMembers();
    notify('All directory data cleared', 'warning');
    setShowDeleteConfirm(false);
    setDeleteConfirmText('');
  };

  const handleChangePIN = async (e) => {
    e.preventDefault();
    if (newPinInput.length < 4) { setPinError('PIN must be at least 4 characters.'); return; }
    if (newPinInput !== confirmPinInput) { setPinError('PINs do not match.'); return; }
    try {
      const hash = await hashPIN(newPinInput);
      saveAdminPIN(hash);
      setShowChangePIN(false);
      setNewPinInput('');
      setConfirmPinInput('');
      setPinError('');
      notify('Admin PIN updated successfully!');
    } catch (err) {
      console.error(err);
      setPinError('Failed to change PIN: ' + err.message);
    }
  };

  // Show PIN gate if not unlocked
  if (!unlocked) {
    return (
      <div className="space-y-6 animate-fade-in max-w-5xl">
        <div className="card p-6 sm:p-8 bg-gradient-to-r from-stone-900 to-stone-950 text-white border-stone-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500 text-stone-950 rounded-2xl flex-shrink-0 shadow-lg">
              <Settings size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">Admin Settings & Data Management</h2>
              <p className="text-sm font-semibold text-stone-400 mt-0.5">
                Manage your API key, backups, and directory settings.
              </p>
            </div>
          </div>
        </div>
        <PINGate hasPIN={hasPIN} onUnlocked={() => { setUnlocked(true); notify('Admin unlocked!', 'success'); }} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Header Banner */}
      <div className="card p-6 sm:p-8 bg-gradient-to-r from-stone-900 to-stone-950 text-white border-stone-800">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500 text-stone-950 rounded-2xl flex-shrink-0 shadow-lg">
              <Settings size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">Admin Settings & Data Management</h2>
              <p className="text-sm font-semibold text-stone-400 mt-0.5">
                {members.length} members · {staleMembers.length} stale profiles
              </p>
            </div>
          </div>
          <button onClick={handleLock} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-sm font-semibold transition-colors">
            <Lock size={15} /> Lock Panel
          </button>
        </div>
      </div>

      {/* 1. API Key Settings */}
      <div className="card p-6 sm:p-8 space-y-4">
        <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2">
          <Key size={18} className="text-emerald-600 dark:text-emerald-400" /> Google Gemini API Key
        </h3>
        <p className="text-sm font-semibold text-stone-600 dark:text-stone-400">
          Your key is saved only in your browser's local storage and never sent to any central database.
        </p>
        <form onSubmit={handleSaveKey} className="flex gap-3">
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="AIzaSy..."
            className="input font-mono text-sm flex-1"
          />
          <button type="submit" className="btn-primary text-sm">
            Save Key
          </button>
        </form>
        {apiKey && (
          <p className="text-xs text-stone-500 font-semibold">
            Current key: <span className="font-mono">••••••••{apiKey.slice(-4)}</span>
          </p>
        )}
        <div className="text-xs font-bold text-stone-500">
          Need a free key?{' '}
          <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 font-extrabold underline">
            aistudio.google.com
          </a>
        </div>
      </div>

      {/* 2. Backup & Restore */}
      <div className="card p-6 sm:p-8 space-y-5">
        <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2">
          <Download size={18} className="text-sky-600 dark:text-sky-400" /> Backup & Restore (JSON)
        </h3>
        <p className="text-sm font-semibold text-stone-600 dark:text-stone-400">
          Export all directory profiles to a JSON file or import backups.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div className="p-6 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4">
            <h4 className="font-extrabold text-sm text-stone-900 dark:text-stone-100 uppercase">Export Backup</h4>
            <p className="text-xs font-semibold text-stone-500">Download complete directory dataset as JSON.</p>
            <button onClick={handleExport} className="btn-primary w-full justify-center text-sm">
              <Download size={16} /> Download JSON Backup
            </button>
          </div>

          <div className="p-6 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4">
            <h4 className="font-extrabold text-sm text-stone-900 dark:text-stone-100 uppercase">Import Data</h4>
            <div className="flex gap-4 mb-2">
              <label className="flex items-center gap-2 text-xs font-bold text-stone-700 dark:text-stone-300 cursor-pointer">
                <input type="radio" name="mode" checked={importMode === 'merge'} onChange={() => setImportMode('merge')} /> Merge
              </label>
              <label className="flex items-center gap-2 text-xs font-bold text-stone-700 dark:text-stone-300 cursor-pointer">
                <input type="radio" name="mode" checked={importMode === 'replace'} onChange={() => setImportMode('replace')} /> Replace All
              </label>
            </div>
            <label className="btn-secondary w-full justify-center cursor-pointer text-sm">
              <Upload size={16} /> Select JSON File
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>
          </div>
        </div>
      </div>

      {/* 3. PIN Management */}
      <div className="card p-6 sm:p-8 space-y-4">
        <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2">
          <Shield size={18} className="text-violet-600 dark:text-violet-400" /> Admin PIN Management
        </h3>
        <p className="text-sm font-semibold text-stone-600 dark:text-stone-400">
          Your PIN is hashed and stored locally in your browser.
          Sessions expire after 30 minutes of inactivity.
        </p>
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => setShowChangePIN(true)} className="btn-secondary text-sm">
            <Shield size={15} /> Change PIN
          </button>
          <button
            onClick={() => { clearAdminPIN(); revokeSession(); setUnlocked(false); notify('Admin PIN removed', 'warning'); }}
            className="btn-ghost text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-sm"
          >
            <Trash2 size={15} /> Remove PIN
          </button>
        </div>
      </div>

      {/* 4. Staleness Monitoring */}
      <div className="card p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" /> Profile Staleness Alerts (90+ Days)
          </h3>
          <span className="badge bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400 font-extrabold text-xs px-3.5 py-1">
            {staleMembers.length} Outdated
          </span>
        </div>

        {staleMembers.length === 0 ? (
          <div className="p-5 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-sm font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-2">
            <Check size={16} /> All directory profiles are fresh and up to date!
          </div>
        ) : (
          <div className="space-y-3 max-h-56 overflow-y-auto">
            {staleMembers.map((m) => (
              <div key={m.id} className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center justify-between text-sm">
                <div>
                  <span className="font-extrabold text-stone-900 dark:text-stone-100">{m.name}</span>
                  <span className="text-stone-500 font-semibold ml-2">({m.role})</span>
                </div>
                <span className="text-amber-700 dark:text-amber-400 font-mono text-xs font-bold">
                  {new Date(m.updatedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Danger Zone */}
      <div className="card p-6 sm:p-8 border-rose-300 dark:border-rose-500/30 space-y-4">
        <h3 className="font-extrabold text-base text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-2">
          <Trash2 size={18} /> Danger Zone
        </h3>
        <p className="text-sm font-semibold text-stone-600 dark:text-stone-400">
          Reset browser local storage and erase all stored member profiles. This cannot be undone.
        </p>
        <button onClick={() => setShowDeleteConfirm(true)} className="btn-danger text-sm">
          Clear All Directory Data
        </button>
      </div>

      {/* Export PII Warning Modal */}
      <Modal isOpen={showExportWarning} onClose={() => setShowExportWarning(false)} title="Export Data — Privacy Notice" size="sm">
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-500/30 rounded-xl flex items-start gap-3">
            <AlertCircle size={18} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900 dark:text-amber-200">
              <p className="font-bold mb-1">This file contains personal information</p>
              <p className="font-semibold">The exported JSON includes names, phone numbers, business details, and locations of community members. Please store this file securely and do not share it publicly.</p>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowExportWarning(false)} className="btn-secondary text-sm">Cancel</button>
            <button onClick={doExport} className="btn-primary text-sm">
              <Download size={15} /> I understand, export now
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteConfirm} onClose={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); }} title="Confirm Delete All Data" size="sm">
        <div className="space-y-4">
          <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-500/30 rounded-xl">
            <p className="text-sm font-bold text-rose-800 dark:text-rose-300">
              This will permanently delete all {members.length} member profiles from browser storage. This action cannot be undone.
            </p>
          </div>
          <div>
            <label className="label">Type DELETE to confirm</label>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE"
              className="input font-mono"
              autoFocus
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(''); }} className="btn-secondary text-sm">Cancel</button>
            <button onClick={handleClearAll} disabled={deleteConfirmText !== 'DELETE'} className="btn-danger text-sm">
              Yes, Delete Everything
            </button>
          </div>
        </div>
      </Modal>

      {/* Change PIN Modal */}
      <Modal isOpen={showChangePIN} onClose={() => { setShowChangePIN(false); setNewPinInput(''); setConfirmPinInput(''); setPinError(''); }} title="Change Admin PIN" size="sm">
        <form onSubmit={handleChangePIN} className="space-y-4">
          <div>
            <label className="label">New PIN (min 4 characters)</label>
            <input
              type="password"
              value={newPinInput}
              onChange={(e) => setNewPinInput(e.target.value)}
              placeholder="New PIN"
              className="input"
              autoFocus
            />
          </div>
          <div>
            <label className="label">Confirm New PIN</label>
            <input
              type="password"
              value={confirmPinInput}
              onChange={(e) => setConfirmPinInput(e.target.value)}
              placeholder="Repeat PIN"
              className="input"
            />
          </div>
          {pinError && (
            <div className="flex items-center gap-2 text-sm text-rose-600 dark:text-rose-400 font-semibold">
              <AlertCircle size={15} /> {pinError}
            </div>
          )}
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setShowChangePIN(false)} className="btn-secondary text-sm">Cancel</button>
            <button type="submit" className="btn-primary text-sm">Update PIN</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
