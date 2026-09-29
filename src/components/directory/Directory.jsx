import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  LayoutGrid,
  Radio,
  Table as TableIcon,
  Sparkles,
  SlidersHorizontal,
  Users,
  ArrowUpDown,
  ChevronDown,
  Building2,
  MapPin,
  Linkedin,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  ShieldAlert,
  Check,
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import {
  memberMatchesSearch,
  buildWhatsAppUrl,
  getInitials,
  getAvatarGradient,
  isValidLinkedInUrl,
  formatLinkedInUrl,
  getLinkedInHandle,
} from '../../utils/helpers';
import { STAGES, STAGE_OPTIONS, getCountryFlag } from '../../utils/constants';
import { useDebounce } from '../../utils/useDebounce';
import { computeMemberSynergy } from '../../utils/executiveAnalytics';
import { isAdminSession } from '../../utils/session';
import ProfileCard from './ProfileCard';
import EmptyState from './EmptyState';

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
  } = useApp();

  const [tagFilter, setTagFilter] = useState('');
  const [radarTargetId, setRadarTargetId] = useState(members[0]?.id || '');
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  const isAdmin = isAdminSession();
  const debouncedSearch = useDebounce(searchQuery, 150);

  // All Industry Tags
  const allTags = useMemo(() => {
    const tagSet = new Set();
    members.forEach((m) => {
      if (Array.isArray(m.tags)) {
        m.tags.forEach((t) => tagSet.add(t));
      }
    });
    return Array.from(tagSet).sort();
  }, [members]);

  // Selected Target Member for Matchmaker Radar View
  const targetMember = useMemo(() => {
    return members.find((m) => m.id === radarTargetId) || members[0] || null;
  }, [members, radarTargetId]);

  // Filtered & Sorted Members
  const filteredMembers = useMemo(() => {
    let result = Array.isArray(members) ? [...members] : [];

    // Stage filter
    if (stageFilter !== 'all') {
      result = result.filter((m) => m.stage === stageFilter);
    }

    // Tag filter
    if (tagFilter) {
      result = result.filter((m) => Array.isArray(m.tags) && m.tags.includes(tagFilter));
    }

    // Search query
    if (debouncedSearch) {
      result = result.filter((m) => memberMatchesSearch(m, debouncedSearch));
    }

    // If Radar View, sort by Synergy Match Score relative to target
    if (viewMode === 'radar' && targetMember) {
      result = result
        .filter((m) => m.id !== targetMember.id)
        .map((m) => ({
          ...m,
          synergyScore: computeMemberSynergy(targetMember, m),
        }))
        .sort((a, b) => b.synergyScore - a.synergyScore);
    } else {
      // Standard sorting
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
    }

    return result;
  }, [
    members,
    stageFilter,
    tagFilter,
    debouncedSearch,
    viewMode,
    targetMember,
    sortField,
    sortDir,
  ]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl">
      {/* ── Control Card: Title + Mode Toggle + Search + Filters ─────────────── */}
      <div className="card p-5 sm:p-6 space-y-5 bg-white dark:bg-stone-900 border-stone-200/90 dark:border-stone-800">
        {/* Top Header Row with Multi-Modal View Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <Users className="text-emerald-600 dark:text-emerald-400" size={24} />
              Executive Directory
            </h2>
            <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-0.5">
              Displaying{' '}
              <strong className="text-emerald-600 dark:text-emerald-400">
                {filteredMembers.length}
              </strong>{' '}
              of <strong className="text-stone-900 dark:text-stone-200">{members.length}</strong>{' '}
              verified senior operators & founders
            </p>
          </div>

          {/* ── Multi-Modal Viewing Options Toggle (3 Modes) ──────────────────── */}
          <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-2xl border border-stone-200 dark:border-stone-700 self-start md:self-auto">
            {/* 1. Grid View */}
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'grid' || !viewMode || (viewMode !== 'radar' && viewMode !== 'table')
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
              title="Standard visual executive profile cards"
            >
              <LayoutGrid size={14} /> Grid View
            </button>

            {/* 2. Matchmaker Radar View */}
            <button
              onClick={() => setViewMode('radar')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'radar'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
              title="Ranked by Synergy Match Score with target founder"
            >
              <Radio size={14} /> Match Radar
            </button>

            {/* 3. Compact Executive Table View */}
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
              title="High-density scannable table for rapid screening"
            >
              <TableIcon size={14} /> Compact Table
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, company, role, need, offer, location or tags..."
            className="input pl-10 py-3 text-sm rounded-xl"
          />
        </div>

        {/* Filter Badges & Industry Selector */}
        <div className="flex items-center gap-2 flex-wrap pt-0.5">
          <span className="text-xs font-extrabold text-stone-500 dark:text-stone-400 uppercase tracking-widest flex items-center gap-1 mr-1">
            <Filter size={13} className="text-orange-500" /> Stage:
          </span>

          {['all', ...STAGE_OPTIONS].map((s) => {
            const stage = STAGES[s];
            const isActive = stageFilter === s;
            return (
              <button
                key={s}
                onClick={() => setStageFilter(s)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                  isActive
                    ? s === 'all'
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 border-stone-900 shadow-sm'
                      : `${stage.bg} ${stage.text} ${stage.border} shadow-sm ring-1 ring-offset-1`
                    : 'bg-white dark:bg-stone-950 text-stone-700 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:border-stone-400'
                }`}
              >
                {s === 'all' ? '✨ All Stages' : `${stage.icon} ${stage.label}`}
              </button>
            );
          })}

          {/* Industry Tag Selector */}
          {allTags.length > 0 && (
            <div className="ml-auto flex items-center gap-1.5">
              <span className="text-xs font-extrabold text-stone-500 dark:text-stone-400 uppercase tracking-widest flex items-center gap-1">
                <SlidersHorizontal size={13} /> Vertical:
              </span>
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="text-xs font-bold bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl px-3 py-1.5 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-xs"
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

      {/* ── Matchmaker Radar Target Selector (Only shown in Radar View) ──────── */}
      {viewMode === 'radar' && targetMember && (
        <div className="card p-5 bg-gradient-to-r from-orange-50 via-amber-50/40 to-white dark:from-orange-950/30 dark:via-stone-900 dark:to-stone-900 border-orange-200 dark:border-orange-900/50 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-orange-500 text-white font-bold">
                <Radio size={18} />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-stone-900 dark:text-stone-100">
                  Synergy Matchmaker Radar
                </h3>
                <p className="text-xs text-stone-500 font-medium">
                  Ordering directory by bilateral capability match score with selected founder:
                </p>
              </div>
            </div>

            {/* Target Member Picker */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-500">Matching for:</span>
              <select
                value={radarTargetId}
                onChange={(e) => setRadarTargetId(e.target.value)}
                className="input text-xs font-bold py-1.5 px-3 bg-white dark:bg-stone-900"
              >
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role || 'Founder'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Target Summary Strip */}
          <div className="p-3 bg-white/90 dark:bg-stone-900/90 rounded-xl border border-stone-200/80 dark:border-stone-800 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-stone-900 dark:text-stone-100">
                👤 {targetMember.name}
              </span>
              <span className="text-stone-400">|</span>
              <span className="text-sky-700 dark:text-sky-400 font-semibold">
                🔍 Seeking: {targetMember.lookingFor || 'General Connections'}
              </span>
              <span className="text-stone-400">|</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                🤝 Offering: {targetMember.canHelp || 'Mentorship'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Multi-Modal Body Render ───────────────────────────────────────────── */}
      {members.length === 0 ? (
        <EmptyState />
      ) : filteredMembers.length === 0 ? (
        <EmptyState isFiltered />
      ) : viewMode === 'table' ? (
        /* ── 3. Compact Executive Table View ───────────────────────────────── */
        <div className="card overflow-hidden bg-white dark:bg-stone-900 border-stone-200/90 dark:border-stone-800 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-950/60 text-[10px] font-black uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-1">
                      Founder / Executive <ArrowUpDown size={11} />
                    </div>
                  </th>
                  <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('role')}>
                    <div className="flex items-center gap-1">
                      Role & Venture <ArrowUpDown size={11} />
                    </div>
                  </th>
                  <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('stage')}>
                    <div className="flex items-center gap-1">
                      Stage <ArrowUpDown size={11} />
                    </div>
                  </th>
                  <th className="py-3 px-4 cursor-pointer" onClick={() => handleSort('location')}>
                    <div className="flex items-center gap-1">
                      Location <ArrowUpDown size={11} />
                    </div>
                  </th>
                  <th className="py-3 px-4">Offering / Seeking</th>
                  <th className="py-3 px-4 text-right">Direct Channels</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800/80 text-xs">
                {filteredMembers.map((m) => {
                  const stage = STAGES[m.stage] || STAGES.idea;
                  const waUrl = isAdmin ? buildWhatsAppUrl(m.phone) : null;
                  const isLinkedInValid = isValidLinkedInUrl(m.linkedin);
                  const linkedInHref = isLinkedInValid ? formatLinkedInUrl(m.linkedin) : null;
                  const linkedInLabel = getLinkedInHandle(m.linkedin);
                  const locLabel =
                    typeof m.location === 'string'
                      ? m.location
                      : [m.location?.city, m.location?.country].filter(Boolean).join(', ');

                  return (
                    <tr
                      key={m.id}
                      className="hover:bg-stone-50/80 dark:hover:bg-stone-800/40 transition-colors"
                    >
                      {/* Name & Avatar */}
                      <td className="py-3 px-4 font-extrabold text-stone-900 dark:text-stone-100">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getAvatarGradient(m.name)} text-white font-bold text-xs flex items-center justify-center flex-shrink-0`}
                          >
                            {getInitials(m.name)}
                          </div>
                          <div>
                            <span className="block font-black">{m.name}</span>
                            {isLinkedInValid && (
                              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                                in/{linkedInLabel}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Role & Company */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-stone-800 dark:text-stone-200 block">
                          {m.role || 'Founder'}
                        </span>
                        <span className="text-[11px] text-stone-500 truncate max-w-[180px] block">
                          {m.business || '—'}
                        </span>
                      </td>

                      {/* Stage Pill */}
                      <td className="py-3 px-4">
                        <span
                          className={`badge ${stage.bg} ${stage.text} border ${stage.border} text-[10px] font-bold px-2 py-0.5`}
                        >
                          {stage.icon} {stage.label}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-4 font-medium text-stone-600 dark:text-stone-300">
                        {getCountryFlag(m.location?.country)} {locLabel || 'Global'}
                      </td>

                      {/* Offering / Seeking summary */}
                      <td className="py-3 px-4 max-w-xs">
                        {m.lookingFor && (
                          <div className="text-[11px] text-sky-700 dark:text-sky-400 truncate">
                            <strong>Need:</strong> {m.lookingFor}
                          </div>
                        )}
                        {m.canHelp && (
                          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 truncate">
                            <strong>Offer:</strong> {m.canHelp}
                          </div>
                        )}
                      </td>

                      {/* Action Links */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {isLinkedInValid ? (
                            <a
                              href={linkedInHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-2xs"
                              title="Open LinkedIn Profile"
                            >
                              <Linkedin size={13} />
                            </a>
                          ) : m.linkedin ? (
                            /* Shaded/muted icon when LinkedIn text exists but is invalid */
                            <span
                              className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed opacity-60"
                              title="LinkedIn link is not properly formatted"
                            >
                              <Linkedin size={13} />
                            </span>
                          ) : null}

                          {waUrl && (
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-2xs"
                              title="Direct WhatsApp"
                            >
                              <MessageCircle size={13} />
                            </a>
                          )}
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
        /* ── 1. & 2. Grid View & Matchmaker Radar View ───────────────────────── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map((m) => (
            <ProfileCard
              key={m.id}
              member={m}
              synergyScore={m.synergyScore !== undefined ? m.synergyScore : null}
              onDeleted={refreshMembers}
              onUpdated={refreshMembers}
            />
          ))}
        </div>
      )}
    </div>
  );
}
