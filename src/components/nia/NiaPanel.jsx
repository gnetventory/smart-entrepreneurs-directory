import React, { useState } from 'react';
import {
  Settings,
  Download,
  Upload,
  Shield,
  AlertTriangle,
  Key,
  Trash2,
  Check,
  Lock,
  AlertCircle,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Database,
  Map,
  FileSpreadsheet,
  Copy,
  Code2,
  CheckCircle2,
  Loader2,
  ListFilter,
  RotateCcw,
  Bell,
  UserCheck,
  UserX,
  Clock,
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import {
  exportAllData,
  importAllData,
  clearAllData,
  getNiaPIN,
  saveNiaPIN,
  clearNiaPIN,
  loadDemoSeedData,
  getSheetsConfig,
  saveSheetsConfig,
  getTombstones,
  removeTombstone,
  clearTombstones,
  getNiaEmail,
  saveNiaEmail,
  updateMember,
  deleteMember,
} from '../../utils/storage';
import {
  syncFromGoogleSheets,
  testSheetsConnection,
  getGoogleAppsScriptCode,
  pushAdminConfigToSheets,
  approveMember,
  rejectMember,
} from '../../utils/sheetsSync';
import { MAP_TILE_PRESETS } from '../../utils/constants';
import { downloadJSON, hashPIN, copyToClipboard } from '../../utils/helpers';
import { revokeNiaSession } from '../../utils/session';
import Modal from '../common/Modal';
import AIMatchmaker from '../matchmaker/AIMatchmaker';

export default function NiaPanel({ onLock }) {
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

  // ── Google Sheets Sync States ──────────────────────────────────────────────
  const [sheetsConfig, setSheetsConfigState] = useState(getSheetsConfig());
  const [apiUrlInput, setApiUrlInput] = useState(sheetsConfig?.apiUrl || '');
  const [isTestingSheets, setIsTestingSheets] = useState(false);
  const [isSyncingSheets, setIsSyncingSheets] = useState(false);
  const [sheetsTestFeedback, setSheetsTestFeedback] = useState(null);
  const [showAppsScriptModal, setShowAppsScriptModal] = useState(false);
  const [showTombstonesModal, setShowTombstonesModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [tombstonesList, setTombstonesList] = useState(getTombstones());

  // ── NIA Email / Notification States ────────────────────────────────────────
  const [niaEmailInput, setNiaEmailInput] = useState(getNiaEmail());
  const [isPushingEmail, setIsPushingEmail] = useState(false);
  const [emailPushFeedback, setEmailPushFeedback] = useState(null);
  const [showAdminAIMatchmaker, setShowAdminAIMatchmaker] = useState(false);

  // ── Pending Approvals ────────────────────────────────────────────────────
  const pendingMembers = members.filter((m) => m.status === 'pending');
  const [approvingId, setApprovingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);

  const handleLock = () => {
    revokeNiaSession();
    onLock?.();
  };

  const handleSaveKey = (e) => {
    e.preventDefault();
    updateApiKey(keyInput.trim());
    notify('Gemini API key saved to disk!');
  };

  const handleSaveSheetsConfig = (e) => {
    e?.preventDefault();
    const updated = saveSheetsConfig({
      ...sheetsConfig,
      apiUrl: apiUrlInput.trim(),
    });
    setSheetsConfigState(updated);
    notify('Google Sheets Webhook URL saved!');
  };

  const handleTestSheets = async () => {
    if (!apiUrlInput.trim()) {
      notify('Please enter a Google Apps Script Web App URL', 'warning');
      return;
    }
    setIsTestingSheets(true);
    setSheetsTestFeedback(null);
    try {
      const res = await testSheetsConnection(apiUrlInput.trim());
      setSheetsTestFeedback({
        success: true,
        message: `Connected! Found ${res.totalRows} submission row(s).`,
      });
      notify(`Connection successful! ${res.totalRows} row(s) detected.`);
      handleSaveSheetsConfig();
    } catch (err) {
      setSheetsTestFeedback({ success: false, message: err.message });
      notify('Connection failed — verify your Apps Script deployment', 'error');
    } finally {
      setIsTestingSheets(false);
    }
  };

  const handleSyncSheetsNow = async () => {
    if (!apiUrlInput.trim()) {
      notify('Configure Google Sheets Web App URL first', 'warning');
      return;
    }
    setIsSyncingSheets(true);
    try {
      handleSaveSheetsConfig();
      const result = await syncFromGoogleSheets();
      if (result.success) {
        refreshMembers();
        setSheetsConfigState(getSheetsConfig());
        notify(
          `Synced with Google Sheets: +${result.addedCount} new, ${result.updatedCount} updated, ${result.ignoredTombstoneCount} deleted ignored!`
        );
      } else {
        notify(`Sync failed: ${result.error}`, 'error');
      }
    } catch (err) {
      notify(`Sync error: ${err.message}`, 'error');
    } finally {
      setIsSyncingSheets(false);
    }
  };

  const handleCopyAppsScript = () => {
    const code = getGoogleAppsScriptCode();
    copyToClipboard(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
    notify('Google Apps Script code copied to clipboard!');
  };

  const handleRemoveTombstone = (key) => {
    removeTombstone(key);
    const updated = getTombstones();
    setTombstonesList(updated);
    notify(`Restored "${key}" to allowed sync list`);
  };

  const handleClearAllTombstones = () => {
    clearTombstones();
    setTombstonesList([]);
    notify('All deletion tombstones cleared');
  };

  const handleSaveNiaEmail = async (e) => {
    e?.preventDefault();
    if (!niaEmailInput.trim()) {
      notify('Please enter a valid email address', 'warning');
      return;
    }
    saveNiaEmail(niaEmailInput.trim());
    setIsPushingEmail(true);
    setEmailPushFeedback(null);
    try {
      const result = await pushAdminConfigToSheets({ adminEmail: niaEmailInput.trim() });
      if (result?.success) {
        setEmailPushFeedback({ success: true, message: 'Email saved & pushed to Apps Script ✓' });
        notify("NIA email saved! You'll receive notifications on new form submissions.");
      } else {
        setEmailPushFeedback({
          success: false,
          message: result?.error || 'Push failed — check your Apps Script URL',
        });
        notify('Email saved locally but failed to push to Apps Script', 'warning');
      }
    } catch {
      setEmailPushFeedback({ success: false, message: 'Network error — email saved locally only' });
    } finally {
      setIsPushingEmail(false);
    }
  };

  const handleApproveMember = async (member) => {
    setApprovingId(member.id);
    try {
      updateMember(member.id, { status: 'active', appStatus: 'APPROVED' });
      await approveMember(member);
      refreshMembers();
      notify(`✅ ${member.name} approved and is now visible in the public directory!`);
    } catch (err) {
      notify(`Failed to approve: ${err.message}`, 'error');
    } finally {
      setApprovingId(null);
    }
  };

  const handleApproveAndReplace = async (pendingMember, existingMember) => {
    setApprovingId(pendingMember.id);
    try {
      const updatedFields = {
        name: pendingMember.name || existingMember.name,
        role: pendingMember.role || existingMember.role,
        business: pendingMember.business || existingMember.business,
        stage: pendingMember.stage || existingMember.stage,
        lookingFor: pendingMember.lookingFor || existingMember.lookingFor,
        canHelp: pendingMember.canHelp || existingMember.canHelp,
        location: pendingMember.location || existingMember.location,
        phone: pendingMember.phone || existingMember.phone,
        email: pendingMember.email || existingMember.email,
        linkedin: pendingMember.linkedin || existingMember.linkedin,
        website: pendingMember.website || existingMember.website,
        instagram: pendingMember.instagram || existingMember.instagram,
        tags: pendingMember.tags?.length ? pendingMember.tags : existingMember.tags,
        status: 'active',
        appStatus: 'APPROVED_UPDATE',
        formTimestamp: pendingMember.formTimestamp || pendingMember.createdAt,
        updatedAt: new Date().toISOString(),
      };

      updateMember(existingMember.id, updatedFields);
      deleteMember(pendingMember.id);

      await approveMember({ ...existingMember, ...updatedFields });
      refreshMembers();
      notify(`✅ Updated and replaced ${existingMember.name}'s profile in the directory!`);
    } catch (err) {
      notify(`Failed to update profile: ${err.message}`, 'error');
    } finally {
      setApprovingId(null);
    }
  };

  const handleRejectMember = async (member) => {
    setRejectingId(member.id);
    try {
      updateMember(member.id, { status: 'rejected', appStatus: 'REJECTED' });
      await rejectMember(member, 'Rejected in NIA Portal');
      refreshMembers();
      notify(`❌ ${member.name} rejected and removed from directory.`, 'warning');
    } catch (err) {
      notify(`Failed to reject: ${err.message}`, 'error');
    } finally {
      setRejectingId(null);
    }
  };

  const handleExport = () => setShowExportWarning(true);

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

  const handleLoadDemoProfiles = () => {
    loadDemoSeedData();
    refreshMembers();
    notify('Sample demo profiles loaded successfully!');
  };

  const handleClearAll = () => {
    if (deleteConfirmText.trim().toUpperCase() !== 'DELETE') return;
    clearAllData();
    refreshMembers();
    notify('All directory data permanently erased from disk and browser', 'warning');
    setShowDeleteConfirm(false);
    setDeleteConfirmText('');
  };

  const handleChangePIN = async (e) => {
    e.preventDefault();
    if (newPinInput.length < 4) {
      setPinError('PIN must be at least 4 characters.');
      return;
    }
    if (newPinInput !== confirmPinInput) {
      setPinError('PINs do not match.');
      return;
    }
    try {
      const hash = await hashPIN(newPinInput);
      saveNiaPIN(hash);
      setShowChangePIN(false);
      setNewPinInput('');
      setConfirmPinInput('');
      setPinError('');
      notify('NIA PIN permanently updated on disk!');
    } catch (err) {
      setPinError('Failed to change PIN: ' + err.message);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* ── Top Header Banner (Compact & High Impact Anti-Slop) ──────────────── */}
      <div className="card p-5 sm:p-6 bg-stone-950 text-white border-[1.5px] border-stone-800 shadow-tactile dark:shadow-tactile-dark flex items-center justify-between gap-4 flex-wrap relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-orange-600/20 via-emerald-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="p-3 bg-emerald-600 rounded-2xl flex-shrink-0 border-[1.5px] border-emerald-400 shadow-tactile-sm">
            <Settings size={22} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight font-display text-white">
                NIA & Data Governance
              </h2>
              <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Persistent Disk DB
              </span>
            </div>
            <p className="text-xs text-stone-300 font-medium mt-0.5">
              Manage database state, Google Sheets 2-way sync, security PIN, and backups.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 relative z-10">
          <a
            href="/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-xs py-2 px-3.5 font-bold shadow-tactile-sm"
          >
            <ExternalLink size={13} /> Public Directory
          </a>
          <button
            onClick={handleLock}
            className="btn-accent text-xs py-2 px-3.5 font-bold shadow-tactile-sm"
          >
            <Lock size={13} /> Lock Session
          </button>
        </div>
      </div>

      {/* ── 2-Column Administrative Grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Section 1: Google Sheets & Google Forms 2-Way Live Sync */}
        <div className="card p-5 space-y-3.5 md:col-span-2 border-emerald-200/80 dark:border-emerald-900/50 bg-gradient-to-b from-emerald-50/20 to-transparent dark:from-emerald-950/10">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2.5 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <h3 className="section-title text-sm">
                <FileSpreadsheet size={16} className="text-emerald-600 dark:text-emerald-400" />
                Google Forms & Sheets 2-Way Live Sync
              </h3>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Audit Trail Active
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAppsScriptModal(true)}
                className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Code2 size={13} /> Get Apps Script Code
              </button>
              <span className="text-stone-300 dark:text-stone-700">|</span>
              <button
                type="button"
                onClick={() => {
                  setTombstonesList(getTombstones());
                  setShowTombstonesModal(true);
                }}
                className="text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 flex items-center gap-1 cursor-pointer"
              >
                <ListFilter size={13} /> Deleted Records ({getTombstones().length})
              </button>
            </div>
          </div>

          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
            Live 2-way bridge between your Google Form submissions sheet and the directory. In-app
            edits and deletions automatically record status (<code>EDITED_IN_APP</code> /{' '}
            <code>DELETED</code>), timestamps, and audit notes in the Google Sheet, while deleted
            profiles are permanently prevented from resurrecting.
          </p>

          <div className="space-y-3 pt-1">
            <div>
              <label className="label text-[10px]">Google Apps Script Web App URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={apiUrlInput}
                  onChange={(e) => setApiUrlInput(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="input font-mono text-xs py-2 flex-1"
                />
                <button
                  type="button"
                  onClick={handleTestSheets}
                  disabled={isTestingSheets || !apiUrlInput.trim()}
                  className="btn-secondary text-xs py-2 px-3 font-bold"
                >
                  {isTestingSheets ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <RefreshCw size={13} />
                  )}
                  {isTestingSheets ? 'Testing...' : 'Test URL'}
                </button>
              </div>
            </div>

            {sheetsTestFeedback && (
              <div
                className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  sheetsTestFeedback.success
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                    : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                }`}
              >
                {sheetsTestFeedback.success ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <AlertCircle size={14} />
                )}
                <span>{sheetsTestFeedback.message}</span>
              </div>
            )}

            <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-stone-100 dark:border-stone-800/80">
              <div className="text-[11px] text-stone-500">
                {sheetsConfig?.lastSyncAt ? (
                  <span>
                    Last synced:{' '}
                    <strong>{new Date(sheetsConfig.lastSyncAt).toLocaleString()}</strong>
                  </span>
                ) : (
                  <span>Never synced with Google Sheets</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveSheetsConfig}
                  className="btn-secondary text-xs py-2 px-3 font-bold"
                >
                  Save URL
                </button>
                <button
                  type="button"
                  onClick={handleSyncSheetsNow}
                  disabled={isSyncingSheets || !apiUrlInput.trim()}
                  className="btn-primary text-xs py-2 px-4 font-bold"
                >
                  {isSyncingSheets ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <RefreshCw size={14} />
                  )}
                  {isSyncingSheets ? 'Syncing Submissions...' : 'Sync Form Submissions Now'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Email Notifications & NIA Email */}
        <div className="card p-5 space-y-3.5 border-blue-200/80 dark:border-blue-900/50 bg-gradient-to-b from-blue-50/20 to-transparent dark:from-blue-950/10">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2.5">
            <h3 className="section-title text-sm">
              <Bell size={15} className="text-blue-600 dark:text-blue-400" />
              Email Notifications
            </h3>
            <span
              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${getNiaEmail() ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300' : 'bg-stone-100 dark:bg-stone-800 text-stone-500'}`}
            >
              {getNiaEmail() ? 'Active' : 'Not Set'}
            </span>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
            Receive an email alert whenever a new member submits the Google Form. Requires the{' '}
            <code>onFormSubmit</code> trigger to be set up in Apps Script.
          </p>
          <form onSubmit={handleSaveNiaEmail} className="space-y-3 pt-1">
            <div>
              <label className="label text-[10px]">NIA Notification Email</label>
              <input
                type="email"
                value={niaEmailInput}
                onChange={(e) => setNiaEmailInput(e.target.value)}
                placeholder="you@example.com"
                className="input text-xs py-2"
              />
            </div>
            {emailPushFeedback && (
              <div
                className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  emailPushFeedback.success
                    ? 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                    : 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                }`}
              >
                {emailPushFeedback.success ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                <span>{emailPushFeedback.message}</span>
              </div>
            )}
            <button
              type="submit"
              disabled={isPushingEmail || !niaEmailInput.trim()}
              className="btn-primary text-xs w-full py-2 font-bold justify-center"
            >
              {isPushingEmail ? <Loader2 size={13} className="animate-spin" /> : <Bell size={13} />}
              {isPushingEmail ? 'Saving & Pushing...' : 'Save & Push to Apps Script'}
            </button>
          </form>
          <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
            <strong className="text-stone-700 dark:text-stone-300">
              ⚡ One-time trigger setup:
            </strong>{' '}
            After saving your email, go to Apps Script → Triggers (clock icon) → + Add Trigger →{' '}
            <code>onFormSubmit</code> → On form submit → Save.
          </div>
        </div>

        {/* Section 3: Pending Approvals */}
        <div className="card p-5 space-y-3.5 border-amber-200/80 dark:border-amber-900/50 bg-gradient-to-b from-amber-50/20 to-transparent dark:from-amber-950/10">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2.5">
            <h3 className="section-title text-sm">
              <Clock size={15} className="text-amber-600 dark:text-amber-400" />
              Pending Approvals
            </h3>
            <span
              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                pendingMembers.length > 0
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 animate-pulse'
                  : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              {pendingMembers.length > 0 ? `${pendingMembers.length} Pending` : 'All Clear'}
            </span>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400 font-medium">
            New form submissions wait here before appearing in the public directory. Review and
            approve or reject each one.
          </p>

          {pendingMembers.length === 0 ? (
            <div className="p-4 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-center text-stone-400 text-xs">
              <CheckCircle2 size={20} className="mx-auto mb-2 text-emerald-500" />
              No pending submissions — all clear!
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {pendingMembers.map((member) => {
                const existingMatch = members.find(
                  (m) =>
                    m.id !== member.id &&
                    m.status !== 'pending' &&
                    m.status !== 'rejected' &&
                    ((m.name &&
                      member.name &&
                      m.name.trim().toLowerCase() === member.name.trim().toLowerCase()) ||
                      (m.phone &&
                        member.phone &&
                        m.phone.replace(/\D/g, '') === member.phone.replace(/\D/g, '') &&
                        m.phone.replace(/\D/g, '').length >= 8) ||
                      (m.linkedin &&
                        member.linkedin &&
                        m.linkedin.toLowerCase().includes(member.linkedin.toLowerCase())))
                );

                return (
                  <div
                    key={member.id}
                    className={`p-3.5 bg-white dark:bg-stone-900 rounded-xl space-y-2.5 border ${
                      existingMatch
                        ? 'border-blue-300 dark:border-blue-800/80 ring-1 ring-blue-400/20'
                        : 'border-amber-200 dark:border-amber-900/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                          {member.name}
                        </p>
                        <p className="text-[11px] text-stone-500 truncate">
                          {member.role} {member.location?.city ? `· ${member.location.city}` : ''}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          existingMatch
                            ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {existingMatch ? 'PROFILE UPDATE' : 'NEW SUBMISSION'}
                      </span>
                    </div>

                    {existingMatch && (
                      <div className="p-2 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 rounded-lg text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-blue-800 dark:text-blue-300 text-[11px]">
                          <RotateCcw size={12} />
                          <span>Existing Member Detected: {existingMatch.name}</span>
                        </div>
                        <p className="text-[10px] text-blue-700 dark:text-blue-300/80 leading-relaxed">
                          Approving will update their existing directory profile and replace
                          outdated details.
                        </p>
                      </div>
                    )}

                    {member.business && (
                      <p className="text-[11px] text-stone-600 dark:text-stone-400 line-clamp-2">
                        {member.business}
                      </p>
                    )}

                    <div className="flex gap-2 pt-1 flex-wrap">
                      {existingMatch ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleApproveAndReplace(member, existingMatch)}
                            disabled={approvingId === member.id || rejectingId === member.id}
                            className="btn-primary text-[11px] py-1.5 px-3 flex-1 font-bold justify-center bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            {approvingId === member.id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <RotateCcw size={12} />
                            )}
                            Approve & Replace Old Profile
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApproveMember(member)}
                            disabled={approvingId === member.id || rejectingId === member.id}
                            className="btn-secondary text-[11px] py-1.5 px-2.5 font-bold justify-center"
                            title="Approve as separate new entry"
                          >
                            New Entry
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleApproveMember(member)}
                          disabled={approvingId === member.id || rejectingId === member.id}
                          className="btn-primary text-[11px] py-1.5 px-3 flex-1 font-bold justify-center"
                        >
                          {approvingId === member.id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <UserCheck size={12} />
                          )}
                          Approve
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRejectMember(member)}
                        disabled={approvingId === member.id || rejectingId === member.id}
                        className="btn-danger text-[11px] py-1.5 px-3 font-bold justify-center"
                      >
                        {rejectingId === member.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          <UserX size={12} />
                        )}
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 4: Gemini AI API Key */}
        <div className="card p-5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2.5">
            <h3 className="section-title text-sm">
              <Key size={15} className="text-orange-500" />
              Gemini AI Integration
            </h3>
            <span
              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${apiKey ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300'}`}
            >
              {apiKey ? 'Configured' : 'Missing'}
            </span>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
            Powers the semantic matchmaker and outreach icebreaker generator. Free key from{' '}
            <a
              href="https://aistudio.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 font-bold underline"
            >
              aistudio.google.com
            </a>
            .
          </p>
          <form onSubmit={handleSaveKey} className="space-y-3 pt-1">
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Paste Gemini API Key (AIzaSy...)"
              className="input font-mono text-xs py-2"
            />
            <div className="flex gap-2">
              <button type="submit" className="btn-primary text-xs flex-1 py-2 font-bold">
                <Check size={14} /> Save Gemini Key
              </button>
              {apiKey && (
                <button
                  type="button"
                  onClick={() => {
                    updateApiKey('');
                    setKeyInput('');
                    notify('API key removed');
                  }}
                  className="btn-secondary text-xs py-2"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Section 5: Map Provider & Tile API Configuration */}
        <div className="card p-5 space-y-3.5 border-emerald-200/80 dark:border-emerald-900/50 bg-gradient-to-b from-emerald-50/20 to-transparent dark:from-emerald-950/10">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2.5">
            <h3 className="section-title text-sm">
              <Map size={15} className="text-emerald-600 dark:text-emerald-400" />
              Alliance Atlas Cartography
            </h3>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              Esri World Street Map Active
            </span>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
            High-resolution global & Egyptian cartography powered by Esri World Street Map. 100%
            free, zero external API keys needed, and zero rate limits or watermarks.
          </p>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 font-semibold space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Check size={14} className="text-emerald-600" /> Fully Optimized & Active
            </div>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-300">
              Worldwide vector street layer calibrated for Egypt hubs and MENA ecosystem density.
            </div>
          </div>
        </div>

        {/* Section 6: Security & NIA PIN */}
        <div className="card p-5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2.5">
            <h3 className="section-title text-sm">
              <Shield size={15} className="text-orange-500" />
              NIA Security PIN
            </h3>
            <span className="text-[10px] font-black uppercase text-stone-400">SHA-256 Hashed</span>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
            Your PIN protects the NIA module. Sessions auto-expire after 30 minutes of inactivity.
          </p>
          <div className="flex gap-2.5 pt-2">
            <button
              onClick={() => setShowChangePIN(true)}
              className="btn-secondary text-xs flex-1 py-2 font-bold cursor-pointer"
            >
              <Shield size={14} /> Change NIA PIN
            </button>
            <button
              onClick={() => {
                clearNiaPIN();
                notify('NIA PIN reset to default: 1234');
              }}
              className="btn-ghost text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs py-2 cursor-pointer"
            >
              Reset to 1234
            </button>
          </div>
        </div>

        {/* Section 7: Data Management & Backups */}
        <div className="card p-5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2.5">
            <h3 className="section-title text-sm">
              <Database size={15} className="text-orange-500" />
              Backup & JSON Migration
            </h3>
            <span className="text-xs font-mono font-bold text-stone-500">
              {members.length} records
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={handleExport}
              className="btn-secondary text-xs py-2.5 flex-1 font-bold"
            >
              <Download size={14} /> Export Backup
            </button>
            <label className="btn-secondary text-xs py-2.5 flex-1 font-bold justify-center cursor-pointer">
              <Upload size={14} /> Import Backup
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-stone-500 pt-1">
            <span>Import Mode:</span>
            <label className="inline-flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="mode"
                checked={importMode === 'merge'}
                onChange={() => setImportMode('merge')}
              />{' '}
              Merge
            </label>
            <label className="inline-flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="mode"
                checked={importMode === 'replace'}
                onChange={() => setImportMode('replace')}
              />{' '}
              Replace All
            </label>
          </div>
        </div>

        {/* Section 8: AI Semantic Matchmaker & Contextual WhatsApp Outreach */}
        <div className="card p-5 space-y-4 md:col-span-2 border-emerald-200/80 dark:border-emerald-900/50 bg-gradient-to-b from-emerald-50/20 to-transparent dark:from-emerald-950/10">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2.5 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <h3 className="section-title text-sm">
                <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400" />
                AI Semantic Matchmaker & WhatsApp Icebreaker Engine
              </h3>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                NIA Exclusive
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowAdminAIMatchmaker(!showAdminAIMatchmaker)}
              className="btn-secondary text-xs py-1.5 px-3 font-bold"
            >
              {showAdminAIMatchmaker ? 'Hide Matchmaker' : 'Open AI Matchmaker Assistant ➔'}
            </button>
          </div>

          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
            Run deep semantic AI evaluations powered by Gemini LLM across all founder bios to
            uncover subtle synergies, bilateral business opportunities, and automatically generate
            tailored WhatsApp introductory icebreakers.
          </p>

          {showAdminAIMatchmaker && (
            <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
              <AIMatchmaker />
            </div>
          )}
        </div>

        {/* Section 9: Sample Demo Data & Seeding */}
        <div className="card p-5 space-y-3.5 md:col-span-2">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-2.5">
            <h3 className="section-title text-sm">
              <Sparkles size={15} className="text-orange-500" />
              Demo Data Seeding
            </h3>
            <span className="text-[10px] font-bold text-stone-400">Optional</span>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
            Populate sample Egyptian startup founders into the directory to test the Map, Radar, and
            Matchmaker.
          </p>
          <button
            onClick={handleLoadDemoProfiles}
            className="btn-secondary text-xs py-2.5 w-full font-bold justify-center text-emerald-700 dark:text-emerald-400"
          >
            <Sparkles size={14} /> Load Sample Demo Profiles
          </button>
        </div>
      </div>

      {/* ── Section 10: Danger Zone (Erase All) ─────────────────────────────────── */}
      <div className="card p-5 border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-black text-rose-700 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle size={15} /> Danger Zone — Permanent Database Wipe
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
              Irrevocably erases all {members.length} founder profiles from persistent disk storage
              and browser cache.
            </p>
          </div>
          <button
            onClick={() => {
              setDeleteConfirmText('');
              setShowDeleteConfirm(true);
            }}
            className="btn-danger text-xs py-2 px-4 font-bold"
          >
            <Trash2 size={13} /> Clear All Directory Data
          </button>
        </div>
      </div>

      {/* ── Modals ───────────────────────────────────────────────────────────── */}
      {/* Google Apps Script Modal */}
      <Modal
        isOpen={showAppsScriptModal}
        onClose={() => setShowAppsScriptModal(false)}
        title="Google Apps Script 2-Way Sync Setup"
        size="lg"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-xl space-y-1.5 text-stone-700 dark:text-stone-300 font-medium">
            <p className="font-extrabold text-stone-900 dark:text-stone-100">
              Step-by-Step Deployment Guide:
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li>
                Open the <strong>Google Sheet</strong> connected to your Google Form.
              </li>
              <li>
                Click <strong>Extensions</strong> &gt; <strong>Apps Script</strong>.
              </li>
              <li>
                Replace existing code in <code>Code.gs</code> with the snippet below.
              </li>
              <li>
                Click <strong>Deploy</strong> &gt; <strong>New deployment</strong>.
              </li>
              <li>
                Select type: <strong>Web app</strong>. Execute as: <strong>Me</strong>. Who has
                access: <strong>Anyone</strong>.
              </li>
              <li>
                Click <strong>Deploy</strong>, grant permission, and paste the generated{' '}
                <strong>Web App URL</strong> into the NIA Portal above.
              </li>
            </ol>
          </div>

          <div className="relative">
            <div className="flex items-center justify-between bg-stone-900 text-stone-300 px-3 py-1.5 rounded-t-xl text-[11px] font-mono">
              <span>Code.gs</span>
              <button
                type="button"
                onClick={handleCopyAppsScript}
                className="btn-accent text-[10px] py-1 px-2.5 font-bold flex items-center gap-1"
              >
                {copiedCode ? <Check size={12} /> : <Copy size={12} />}
                {copiedCode ? 'Copied Script!' : 'Copy Code.gs'}
              </button>
            </div>
            <textarea
              readOnly
              rows={12}
              value={getGoogleAppsScriptCode()}
              className="w-full bg-stone-950 text-emerald-400 font-mono text-[11px] p-3 rounded-b-xl border border-stone-800 focus:outline-none select-all"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={() => setShowAppsScriptModal(false)}
              className="btn-secondary text-xs py-1.5 px-4"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>

      {/* Deleted Records / Tombstones Manager Modal */}
      <Modal
        isOpen={showTombstonesModal}
        onClose={() => setShowTombstonesModal(false)}
        title="Deleted Form Submissions (Tombstones)"
        size="md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
            These records were deleted in the web app and are permanently prevented from
            resurrecting when pulling from Google Sheets.
          </p>

          {tombstonesList.length === 0 ? (
            <div className="p-4 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-center text-stone-400">
              No active tombstones. All Google Sheet rows will be imported.
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {tombstonesList.map((key) => (
                <div
                  key={key}
                  className="p-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl flex items-center justify-between gap-2"
                >
                  <span className="font-mono font-bold text-stone-800 dark:text-stone-200 truncate">
                    {key}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTombstone(key)}
                    className="btn-ghost text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-[11px] py-1 px-2 font-bold flex items-center gap-1"
                    title="Allow re-importing this record"
                  >
                    <RotateCcw size={12} /> Allow Re-import
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
            {tombstonesList.length > 0 && (
              <button
                type="button"
                onClick={handleClearAllTombstones}
                className="btn-ghost text-rose-600 hover:bg-rose-50 text-xs font-bold"
              >
                Clear All Tombstones
              </button>
            )}
            <div className="flex-1" />
            <button
              onClick={() => setShowTombstonesModal(false)}
              className="btn-secondary text-xs py-1.5 px-4"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Export Confirmation */}
      <Modal
        isOpen={showExportWarning}
        onClose={() => setShowExportWarning(false)}
        title="Export Full Database"
        size="sm"
      >
        <div className="space-y-4 text-xs">
          <p className="text-stone-600 dark:text-stone-300 leading-relaxed font-medium">
            This will download a full unencrypted JSON backup containing all member profiles.
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowExportWarning(false)}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              Cancel
            </button>
            <button onClick={doExport} className="btn-primary text-xs py-1.5 px-3">
              Download JSON
            </button>
          </div>
        </div>
      </Modal>

      {/* Clear All Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirm Permanent Database Wipe"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-xs font-semibold text-rose-700 dark:text-rose-400">
            This action will permanently delete all {members.length} members from persistent disk
            storage.
          </p>
          <div>
            <label className="label text-[10px]">Type DELETE to confirm:</label>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE"
              className="input font-mono text-xs py-2"
              autoFocus
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setShowDeleteConfirm(false);
                setDeleteConfirmText('');
              }}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              Cancel
            </button>
            <button
              onClick={handleClearAll}
              disabled={deleteConfirmText.trim().toUpperCase() !== 'DELETE'}
              className="btn-danger text-xs py-1.5 px-3 font-bold"
            >
              Yes, Erase Everything
            </button>
          </div>
        </div>
      </Modal>

      {/* Change PIN Modal */}
      <Modal
        isOpen={showChangePIN}
        onClose={() => {
          setShowChangePIN(false);
          setNewPinInput('');
          setConfirmPinInput('');
          setPinError('');
        }}
        title="Update NIA Security PIN"
        size="sm"
      >
        <form onSubmit={handleChangePIN} className="space-y-3">
          <div>
            <label className="label text-[10px]">New PIN (min 4 characters)</label>
            <input
              type="password"
              value={newPinInput}
              onChange={(e) => setNewPinInput(e.target.value)}
              placeholder="New PIN"
              className="input text-xs py-2"
              autoFocus
            />
          </div>
          <div>
            <label className="label text-[10px]">Confirm New PIN</label>
            <input
              type="password"
              value={confirmPinInput}
              onChange={(e) => setConfirmPinInput(e.target.value)}
              placeholder="Confirm PIN"
              className="input text-xs py-2"
            />
          </div>
          {pinError && <p className="text-xs text-rose-600 font-bold">{pinError}</p>}
          <div className="flex gap-2 justify-end pt-1">
            <button
              type="button"
              onClick={() => setShowChangePIN(false)}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary text-xs py-1.5 px-3">
              Save PIN
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
