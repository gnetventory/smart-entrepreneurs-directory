import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  LayoutGrid,
  Table as TableIcon,
  SlidersHorizontal,
  Users,
  Linkedin,
  MessageCircle,
  Trash2,
  Eye,
  ExternalLink,
  Download,
  CheckCircle2,
  FileText,
  Star,
  Sparkles,
  Dices,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import {
  memberMatchesSearch,
  buildWhatsAppUrl,
  getInitials,
  getAvatarGradient,
  isValidLinkedInUrl,
  formatLinkedInUrl,
  downloadVCardFile,
  getMemberWebsites,
} from '../../utils/helpers';
import { STAGES, STAGE_OPTIONS, getCountryFlag, GOOGLE_FORM_URL } from '../../utils/constants';
import { deleteMember } from '../../utils/storage';
import { pushMemberDeleteToSheets } from '../../utils/sheetsSync';
import { useDebounce } from '../../utils/useDebounce';
import { isAdminSession } from '../../utils/session';
import {
  getBookmarkedIds,
  getRandomSynergyFounder,
  isMemberBookmarked,
  toggleBookmarkId,
} from '../../utils/psychologyHelpers';
import ProfileCard from './ProfileCard';
import EmptyState from './EmptyState';
import Modal from '../common/Modal';
import EditMemberModal from '../parser/EditMemberModal';

export default function Directory() {
  const {
    activeMembers: members,
    refreshMembers,
    searchQuery,
    setSearchQuery,
    stageFilter,
    setStageFilter,
    viewMode,
    setViewMode,
    notify,
  } = useApp();

  const [tagFilter, setTagFilter] = useState('');
  const [smartPreset, setSmartPreset] = useState('all'); // 'all' | 'saved' | 'partners' | 'growing' | 'export'
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  // Serendipity Dice State
  const [serendipityFounder, setSerendipityFounder] = useState(null);
  const [isRollingDice, setIsRollingDice] = useState(false);

  const isAdmin = isAdminSession();

  // Modal states for Compact Table view
  const [detailMember, setDetailMember] = useState(null);
  const [editMember, setEditMember] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);

  const debouncedSearch = useDebounce(searchQuery, 150);

  // Bookmarked IDs
  const bookmarkedIds = useMemo(() => getBookmarkedIds(), [members, smartPreset]);

  // All Unique Industry Tags
  const allTags = useMemo(() => {
    const tagSet = new Set();
    members.forEach((m) => {
      if (Array.isArray(m.tags)) {
        m.tags.forEach((t) => tagSet.add(t));
      }
    });
    return Array.from(tagSet).sort();
  }, [members]);

  // Smart Preset Counts
  const presetCounts = useMemo(() => {
    const safeMembers = Array.isArray(members) ? members : [];
    const saved = safeMembers.filter((m) => isMemberBookmarked(m.id)).length;
    const partners = safeMembers.filter(
      (m) =>
        m.lookingFor?.toLowerCase().includes('شراك') ||
        m.lookingFor?.toLowerCase().includes('partner') ||
        m.lookingFor?.toLowerCase().includes('تعاون')
    ).length;
    const growing = safeMembers.filter((m) => m.stage === 'growing' || m.stage === 'running').length;
    const exportCount = safeMembers.filter(
      (m) =>
        m.tags?.some((t) => t.toLowerCase().includes('export')) ||
        m.business?.toLowerCase().includes('export') ||
        m.canHelp?.toLowerCase().includes('تصدير') ||
        m.lookingFor?.toLowerCase().includes('تصدير')
    ).length;

    return { saved, partners, growing, exportCount };
  }, [members]);

  // Filtered & Sorted Members
  const filteredMembers = useMemo(() => {
    let result = Array.isArray(members) ? [...members] : [];

    // 1. Smart Presets
    if (smartPreset === 'saved') {
      result = result.filter((m) => isMemberBookmarked(m.id));
    } else if (smartPreset === 'partners') {
      result = result.filter(
        (m) =>
          m.lookingFor?.toLowerCase().includes('شراك') ||
          m.lookingFor?.toLowerCase().includes('partner') ||
          m.lookingFor?.toLowerCase().includes('تعاون')
      );
    } else if (smartPreset === 'growing') {
      result = result.filter((m) => m.stage === 'growing' || m.stage === 'running');
    } else if (smartPreset === 'export') {
      result = result.filter(
        (m) =>
          m.tags?.some((t) => t.toLowerCase().includes('export')) ||
          m.business?.toLowerCase().includes('export') ||
          m.canHelp?.toLowerCase().includes('تصدير') ||
          m.lookingFor?.toLowerCase().includes('تصدير')
      );
    }

    // 2. Stage filter
    if (stageFilter !== 'all') {
      result = result.filter((m) => m.stage === stageFilter);
    }

    // 3. Tag filter
    if (tagFilter) {
      result = result.filter((m) => Array.isArray(m.tags) && m.tags.includes(tagFilter));
    }

    // 4. Search query
    if (debouncedSearch) {
      result = result.filter((m) => memberMatchesSearch(m, debouncedSearch));
    }

    // 5. Standard sorting
    result.sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';
      if (sortField === 'location') {
        valA =
          typeof a.location === 'string'
            ? a.location
            : `${a.location?.city || ''} ${a.location?.country || ''}`;
        valB =
          typeof b.location === 'string'
            ? b.location
            : `${b.location?.city || ''} ${b.location?.country || ''}`;
      }
      if (typeof valA === 'string') {
        const comp = valA.localeCompare(valB);
        return sortDir === 'asc' ? comp : -comp;
      }
      return sortDir === 'asc' ? (valA || 0) - (valB || 0) : (valB || 0) - (valA || 0);
    });

    return result;
  }, [members, smartPreset, stageFilter, tagFilter, debouncedSearch, sortField, sortDir]);

  const handleRollSerendipity = () => {
    setIsRollingDice(true);
    setTimeout(() => {
      const luckyFounder = getRandomSynergyFounder(members);
      setSerendipityFounder(luckyFounder);
      setIsRollingDice(false);
    }, 450);
  };

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setStageFilter('all');
    setTagFilter('');
    setSmartPreset('all');
  };

  const handleDeleteMember = () => {
    if (!memberToDelete) return;
    deleteMember(memberToDelete.id);
    pushMemberDeleteToSheets(memberToDelete, 'Deleted by User in Web App');
    refreshMembers();
    notify(`Removed ${memberToDelete.name} from directory`);
    setMemberToDelete(null);
  };

  const handleDownloadVCard = (e, m) => {
    e?.stopPropagation?.();
    downloadVCardFile(m, isAdmin);
    notify(`Saved ${m.name}'s contact card (.vcf)`);
  };

  return (
    <div className="space-y-5 animate-fade-in max-w-7xl pb-12">
      {/* ── Frozen Sticky Top Container: Intake Banner + Directory Controls ──── */}
      <div className="sticky top-[66px] z-20 space-y-3 bg-[#FAFAF7]/95 dark:bg-stone-950/95 backdrop-blur-md pb-2 pt-1 transition-colors">
        {/* Official Google Form Intake & Profile Update Banner */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white rounded-2xl p-3.5 sm:p-4 border border-stone-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center shrink-0 text-lg font-bold">
              📝
            </div>
            <div>
              <h3 className="font-extrabold text-xs sm:text-sm text-white tracking-tight flex items-center gap-2">
                Need to update your business profile or looking-for request?
                <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Official Intake
                </span>
              </h3>
              <p className="text-[11px] text-stone-300 font-medium mt-0.5">
                Submit edits or register new ventures via our verified Google Form.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Serendipity Dice Button */}
            <button
              onClick={handleRollSerendipity}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold border border-white/15 backdrop-blur-md shadow-sm transition-all cursor-pointer active:scale-95"
              title="Roll the Serendipity Dice for a surprise synergy match!"
            >
              <Dices size={15} className={`text-orange-400 ${isRollingDice ? 'animate-spin' : ''}`} />
              <span>Surprise Synergy</span>
            </button>

            <a
              href={GOOGLE_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-extrabold tracking-wide shadow-md hover:shadow-orange-500/20 transition-all cursor-pointer active:scale-95"
            >
              <span>Update Profile</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Directory Control Card: Title + Mode Toggle + Search + Filters */}
        <div className="card p-3.5 sm:p-4 space-y-3 bg-white/95 dark:bg-stone-900/95 border border-stone-200/90 dark:border-stone-800 shadow-md">
          {/* Top Header Row with View Switcher */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 border-b border-stone-100 dark:border-stone-800 pb-2.5">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-stone-950 dark:text-white tracking-tight flex items-center gap-2 font-display">
                <Users className="text-orange-600 dark:text-orange-400" size={20} />
                Community Directory
              </h2>
              <p className="text-[11.5px] font-semibold text-stone-500 dark:text-stone-400 mt-0.5">
                Revealing{' '}
                <strong className="text-stone-900 dark:text-stone-100 font-bold">
                  {filteredMembers.length}
                </strong>{' '}
                of{' '}
                <strong className="text-stone-900 dark:text-stone-100 font-bold">
                  {members.length}
                </strong>{' '}
                verified founders, leaders & ventures
              </p>
            </div>

            {/* View Toggle & Clear Filters */}
            <div className="flex items-center gap-2">
              {(smartPreset !== 'all' || stageFilter !== 'all' || tagFilter || searchQuery) && (
                <button
                  onClick={handleClearAllFilters}
                  className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 cursor-pointer mr-2"
                >
                  <RotateCcw size={12} /> Clear filters
                </button>
              )}

              <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700 self-start md:self-auto shadow-xs">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode !== 'table'
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
                  }`}
                  title="Standard visual executive profile cards"
                >
                  <LayoutGrid size={13} /> Grid View
                </button>

                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'table'
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
                  }`}
                  title="High-density scannable table"
                >
                  <TableIcon size={13} /> Compact Table
                </button>
              </div>
            </div>
          </div>

          {/* 1-Tap Smart Default Discovery Presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 flex items-center gap-1 shrink-0">
              <Sparkles size={11} className="text-orange-500" /> Presets:
            </span>

            <button
              onClick={() => setSmartPreset('all')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all shrink-0 cursor-pointer ${
                smartPreset === 'all'
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 border-stone-900'
                  : 'bg-stone-50 dark:bg-stone-850 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-orange-300'
              }`}
            >
              All Founders ({members.length})
            </button>

            <button
              onClick={() => setSmartPreset('saved')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                smartPreset === 'saved'
                  ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                  : 'bg-amber-50/50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60 hover:border-amber-400'
              }`}
            >
              <Star size={11} className={smartPreset === 'saved' ? 'fill-white' : 'fill-amber-500 text-amber-500'} />
              <span>Saved Watchlist</span>
              <span className="text-[9.5px] font-mono px-1 rounded bg-black/10">{presetCounts.saved}</span>
            </button>

            <button
              onClick={() => setSmartPreset('partners')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                smartPreset === 'partners'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-blue-50/50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/60 hover:border-blue-400'
              }`}
            >
              <span>🤝 Partnerships</span>
              <span className="text-[9.5px] font-mono px-1 rounded bg-black/10">{presetCounts.partners}</span>
            </button>

            <button
              onClick={() => setSmartPreset('growing')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                smartPreset === 'growing'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60 hover:border-emerald-400'
              }`}
            >
              <span>🚀 Scaling</span>
              <span className="text-[9.5px] font-mono px-1 rounded bg-black/10">{presetCounts.growing}</span>
            </button>

            <button
              onClick={() => setSmartPreset('export')}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                smartPreset === 'export'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                  : 'bg-purple-50/50 dark:bg-purple-950/30 text-purple-800 dark:text-purple-300 border-purple-200/80 dark:border-purple-800/60 hover:border-purple-400'
              }`}
            >
              <span>🌍 Exporters</span>
              <span className="text-[9.5px] font-mono px-1 rounded bg-black/10">{presetCounts.exportCount}</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, company, role, need, offer, location or tags..."
              className="input pl-10 py-2 text-xs font-medium rounded-xl border border-stone-300 dark:border-stone-700 focus:border-orange-500 w-full"
            />
          </div>

          {/* Filter Badges & Industry Selector */}
          <div className="flex items-center gap-2 flex-wrap pt-0.5">
            <span className="text-[10.5px] font-extrabold text-stone-500 uppercase tracking-wider flex items-center gap-1 mr-1">
              <Filter size={11} className="text-orange-600" /> Stage:
            </span>

            {['all', ...STAGE_OPTIONS].map((s) => {
              const stage = STAGES[s];
              const isActive = stageFilter === s;
              return (
                <button
                  key={s}
                  onClick={() => setStageFilter(s)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    isActive
                      ? s === 'all'
                        ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 border-stone-900 dark:border-white shadow-xs'
                        : `${stage.bg} ${stage.text} ${stage.border} shadow-xs ring-1 ring-offset-1`
                      : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-stone-400'
                  }`}
                >
                  {s === 'all' ? '✨ All Stages' : `${stage.icon} ${stage.label}`}
                </button>
              );
            })}

            {/* Industry Tag Selector */}
            {allTags.length > 0 && (
              <div className="ml-auto flex items-center gap-1.5">
                <span className="text-[10.5px] font-extrabold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                  <SlidersHorizontal size={11} /> Sector:
                </span>
                <select
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className="text-xs font-bold bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-2.5 py-1 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500/40 cursor-pointer"
                >
                  <option value="">All Sectors ({allTags.length})</option>
                  {allTags.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── View Output ──────────────────────────────────────────────────────── */}
      {filteredMembers.length === 0 ? (
        <EmptyState />
      ) : viewMode === 'table' ? (
        /* ── Compact Table View ─────────────────────────────────────────────── */
        <div className="bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 dark:bg-stone-850 border-b border-stone-200/80 dark:border-stone-800 text-[11px] uppercase tracking-wider font-extrabold text-stone-500">
                  <th className="py-3.5 px-4">Member / Name</th>
                  <th className="py-3.5 px-4">Role & Venture</th>
                  <th className="py-3.5 px-4">Stage</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Needs & Offers</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
                {filteredMembers.map((m) => {
                  const stage = STAGES[m.stage] || STAGES.idea;
                  const initials = getInitials(m.name);
                  const gradient = getAvatarGradient(m.name);
                  const isLinkedInValid = isValidLinkedInUrl(m.linkedin);
                  const linkedInHref = isLinkedInValid ? formatLinkedInUrl(m.linkedin) : null;
                  const waUrl = buildWhatsAppUrl(m.phone);
                  const websites = getMemberWebsites(m);
                  const isSaved = isMemberBookmarked(m.id);
                  const locLabel =
                    typeof m.location === 'string'
                      ? m.location
                      : [m.location?.city, m.location?.country].filter(Boolean).join(', ');

                  return (
                    <tr
                      key={m.id}
                      onClick={() => setDetailMember(m)}
                      className="hover:bg-orange-50/40 dark:hover:bg-orange-950/20 cursor-pointer transition-colors"
                    >
                      {/* Member / Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}
                          >
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-stone-900 dark:text-stone-100 block text-sm truncate hover:text-orange-600 transition-colors">
                                {m.name}
                              </span>
                              {isSaved && <Star size={12} className="fill-amber-500 text-amber-500 shrink-0" />}
                            </div>
                            {isAdmin && m.phone && (
                              <span className="text-[11px] text-stone-400 font-mono block">
                                {m.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Role & Company */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-stone-800 dark:text-stone-200 block text-xs truncate max-w-[200px]">
                          {m.role || 'Member'}
                        </span>
                        <span className="text-[11px] text-stone-500 truncate max-w-[200px] block">
                          {m.business || '—'}
                        </span>
                      </td>

                      {/* Stage Pill */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`badge ${stage.bg} ${stage.text} border ${stage.border} text-[10.5px] font-bold px-2 py-0.5`}
                        >
                          {stage.icon} {stage.label}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 font-medium text-stone-600 dark:text-stone-300 text-xs">
                        {getCountryFlag(m.location?.country)} {locLabel || 'Global'}
                      </td>

                      {/* Needs & Offers */}
                      <td className="py-3.5 px-4 max-w-xs truncate">
                        {m.lookingFor && (
                          <div className="text-[11px] text-blue-700 dark:text-blue-300 truncate">
                            <strong>Need:</strong> {m.lookingFor}
                          </div>
                        )}
                        {m.canHelp && (
                          <div className="text-[11px] text-emerald-700 dark:text-emerald-300 truncate">
                            <strong>Offer:</strong> {m.canHelp}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-1.5">
                          {/* Bookmark Toggle */}
                          <button
                            onClick={() => {
                              const isNow = toggleBookmarkId(m.id);
                              refreshMembers();
                              notify(isNow ? `⭐ Saved ${m.name}` : `Removed ${m.name}`);
                            }}
                            className={`p-1.5 rounded-lg transition-all ${
                              isSaved
                                ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                                : 'text-stone-300 hover:text-amber-500'
                            }`}
                            title="Toggle Watchlist"
                          >
                            <Star size={13} className={isSaved ? 'fill-amber-500' : ''} />
                          </button>

                          {isLinkedInValid && (
                            <a
                              href={linkedInHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                              title="LinkedIn"
                            >
                              <Linkedin size={13} />
                            </a>
                          )}
                          {websites.map((w, idx) => (
                            <a
                              key={`${w.url}-${idx}`}
                              href={w.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-800 hover:text-white transition-all"
                              title={`Visit ${w.label} (${w.url})`}
                            >
                              <ExternalLink size={13} />
                            </a>
                          ))}
                          <button
                            onClick={() => setDetailMember(m)}
                            className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 font-bold cursor-pointer"
                            title="View Full Profile"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            onClick={() => setMemberToDelete(m)}
                            className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                            title="Delete Member"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ── Grid View ──────────────────────────────────────────────────────── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map((m) => (
            <ProfileCard
              key={m.id}
              member={m}
              onDeleted={refreshMembers}
              onUpdated={refreshMembers}
            />
          ))}
        </div>
      )}

      {/* ── 🎲 Serendipity Dice Discovery Modal ───────────────────────────────── */}
      {serendipityFounder && (
        <Modal
          isOpen={!!serendipityFounder}
          onClose={() => setSerendipityFounder(null)}
          title="✨ Serendipity Founder Spotlight"
          size="md"
        >
          <div className="space-y-4 text-xs text-stone-900 dark:text-stone-100">
            <div className="p-4 bg-gradient-to-r from-emerald-800 via-teal-800 to-stone-900 text-white rounded-2xl flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getAvatarGradient(
                    serendipityFounder.name
                  )} text-white font-black text-base flex items-center justify-center shrink-0 ring-2 ring-white/30`}
                >
                  {getInitials(serendipityFounder.name)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-base text-white">
                      {serendipityFounder.name}
                    </h3>
                  </div>
                  <p className="text-xs font-bold text-orange-300">
                    {serendipityFounder.role || 'Founder'}
                  </p>
                  <p className="text-[11px] text-emerald-200 truncate max-w-[220px]">
                    🏢 {serendipityFounder.business}
                  </p>
                </div>
              </div>

              <button
                onClick={handleRollSerendipity}
                className="px-3 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
              >
                <Dices size={14} className={isRollingDice ? 'animate-spin' : ''} />
                <span>Re-Roll</span>
              </button>
            </div>

            {/* Need & Offer Breakdown */}
            <div className="space-y-2">
              {serendipityFounder.lookingFor && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-xl">
                  <span className="font-extrabold text-blue-900 dark:text-blue-300 block text-[11px] uppercase mb-0.5">
                    🎯 Looking For:
                  </span>
                  <p className="text-xs text-stone-800 dark:text-stone-200 font-medium">
                    {serendipityFounder.lookingFor}
                  </p>
                </div>
              )}

              {serendipityFounder.canHelp && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl">
                  <span className="font-extrabold text-emerald-900 dark:text-emerald-300 block text-[11px] uppercase mb-0.5">
                    💡 Superpower / Can Help:
                  </span>
                  <p className="text-xs text-stone-800 dark:text-stone-200 font-medium">
                    {serendipityFounder.canHelp}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex items-center justify-between border-t border-stone-200 dark:border-stone-800">
              <button
                onClick={() => {
                  setDetailMember(serendipityFounder);
                  setSerendipityFounder(null);
                }}
                className="btn-primary text-xs py-2 px-4"
              >
                View Full Profile & Resources ➔
              </button>
              <button
                onClick={() => setSerendipityFounder(null)}
                className="btn-secondary text-xs py-2 px-3"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Detail Modal for Table View Row Clicks ──────────────────────────── */}
      {detailMember && (
        <Modal
          isOpen={!!detailMember}
          onClose={() => setDetailMember(null)}
          title="Business Profile Details"
          size="lg"
        >
          <div className="space-y-5 text-stone-900 dark:text-stone-100 text-xs">
            <div className="flex items-start justify-between gap-4 p-4 bg-stone-50 dark:bg-stone-800/80 rounded-2xl border border-stone-200/80 dark:border-stone-700">
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getAvatarGradient(
                    detailMember.name
                  )} text-white font-black text-xl flex items-center justify-center shrink-0 shadow-md`}
                >
                  {getInitials(detailMember.name)}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-stone-950 dark:text-white">
                    {detailMember.name}
                  </h3>
                  <p className="text-xs font-bold text-orange-600 dark:text-orange-400">
                    {detailMember.role || 'Member'}
                  </p>
                  {detailMember.business && (
                    <p className="text-xs text-stone-600 dark:text-stone-300 font-semibold mt-0.5">
                      🏢 {detailMember.business}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    STAGES[detailMember.stage]?.bg
                  } ${STAGES[detailMember.stage]?.text} ${STAGES[detailMember.stage]?.border}`}
                >
                  {STAGES[detailMember.stage]?.icon} {STAGES[detailMember.stage]?.label}
                </span>
                {detailMember.location && (
                  <span className="text-[11px] font-semibold text-stone-500">
                    {getCountryFlag(detailMember.location?.country)}{' '}
                    {typeof detailMember.location === 'string'
                      ? detailMember.location
                      : [detailMember.location?.city, detailMember.location?.country]
                          .filter(Boolean)
                          .join(', ')}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 space-y-2">
                <h4 className="font-extrabold text-blue-900 dark:text-blue-300 text-xs uppercase tracking-wider">
                  🎯 Looking For / Needs:
                </h4>
                <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                  {detailMember.lookingFor || 'Open to general business synergies and connections.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 space-y-2">
                <h4 className="font-extrabold text-emerald-900 dark:text-emerald-300 text-xs uppercase tracking-wider">
                  💡 Can Help With / Offering:
                </h4>
                <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                  {detailMember.canHelp || 'Industry insights, advisory, and networking support.'}
                </p>
              </div>
            </div>

            {/* Links & Resources */}
            {(() => {
              const dWebsites = getMemberWebsites(detailMember);
              const dLinkedInValid = isValidLinkedInUrl(detailMember.linkedin);
              const dLinkedInHref = dLinkedInValid
                ? formatLinkedInUrl(detailMember.linkedin)
                : null;
              const dWaUrl = buildWhatsAppUrl(detailMember.phone);

              if (
                dWebsites.length === 0 &&
                !dLinkedInValid &&
                (!isAdmin || !dWaUrl) &&
                (!detailMember.catalogues || detailMember.catalogues.length === 0)
              ) {
                return null;
              }

              return (
                <div className="p-3.5 bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-200 dark:border-stone-750 space-y-2">
                  <h4 className="font-bold text-[11px] uppercase tracking-wider text-stone-500">
                    Verified Links & Resources
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {dLinkedInValid && (
                      <a
                        href={dLinkedInHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold hover:bg-blue-600 hover:text-white transition-all"
                      >
                        <Linkedin size={13} /> LinkedIn Profile
                      </a>
                    )}
                    {isAdmin && dWaUrl && (
                      <a
                        href={dWaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold hover:bg-emerald-600 hover:text-white transition-all"
                      >
                        <MessageCircle size={13} /> Admin: Direct WhatsApp
                      </a>
                    )}
                    {dWebsites.map((w, idx) => (
                      <a
                        key={`${w.url}-${idx}`}
                        href={w.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 font-bold hover:bg-stone-800 hover:text-white transition-all"
                        title={w.url}
                      >
                        <ExternalLink size={13} />
                        <span>{w.label || `Website ${idx + 1}`}</span>
                      </a>
                    ))}
                    {Array.isArray(detailMember.catalogues) &&
                      detailMember.catalogues.map((cat, idx) => (
                        <a
                          key={idx}
                          href={cat}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-bold hover:bg-purple-600 hover:text-white transition-all"
                        >
                          <FileText size={13} /> Catalogue #{idx + 1}
                        </a>
                      ))}
                  </div>
                </div>
              );
            })()}

            {/* Links & Action Bar */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleDownloadVCard(e, detailMember)}
                  className="btn-primary text-xs font-bold py-2"
                >
                  <Download size={13} /> Save Contact (.vcf)
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditMember(detailMember)}
                  className="btn-secondary text-xs font-bold py-2"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    setMemberToDelete(detailMember);
                    setDetailMember(null);
                  }}
                  className="btn-danger text-xs font-bold py-2"
                >
                  <Trash2 size={13} /> Delete Profile
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {editMember && (
        <EditMemberModal
          member={editMember}
          isOpen={!!editMember}
          onClose={() => setEditMember(null)}
          onSaved={() => {
            refreshMembers();
            setEditMember(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {memberToDelete && (
        <Modal
          isOpen={!!memberToDelete}
          onClose={() => setMemberToDelete(null)}
          title="Remove Member from Directory"
          size="sm"
        >
          <div className="space-y-4 text-xs">
            <p className="font-semibold text-stone-700 dark:text-stone-300 leading-relaxed">
              Are you sure you want to permanently remove <strong>{memberToDelete.name}</strong>{' '}
              from the directory?
            </p>
            <p className="text-[11px] text-stone-500">
              A deletion tombstone will be recorded so that automated Google Sheets sync will never
              resurrect this deleted record.
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setMemberToDelete(null)}
                className="btn-secondary text-xs py-2 px-3"
              >
                Cancel
              </button>
              <button onClick={handleDeleteMember} className="btn-danger text-xs py-2 px-4">
                Yes, Delete Profile
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
