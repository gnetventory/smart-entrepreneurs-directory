import React, { useState, useMemo } from 'react';
import {
  Radio,
  Search,
  Filter,
  Users,
  Target,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { computeMemberSynergy } from '../../utils/executiveAnalytics';
import { STAGES, STAGE_OPTIONS, getCountryFlag } from '../../utils/constants';
import { useDebounce } from '../../utils/useDebounce';
import ProfileCard from '../directory/ProfileCard';
import EmptyState from '../directory/EmptyState';

export default function MatchRadarView() {
  const { activeMembers: members, refreshMembers } = useApp();
  const [targetMemberId, setTargetMemberId] = useState(members[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');

  const debouncedSearch = useDebounce(searchQuery, 150);

  const [minMatchThreshold, setMinMatchThreshold] = useState(0); // 0: all related, 40: moderate, 60: high

  // Selected Target Founder to compare against
  const targetMember = useMemo(() => {
    return members.find((m) => m.id === targetMemberId) || members[0] || null;
  }, [members, targetMemberId]);

  // Ranked Members by Synergy Score with the Target Founder (Only Related Members)
  const rankedMembers = useMemo(() => {
    if (!targetMember) return [];

    let list = members.filter((m) => m.id !== targetMember.id);

    // Apply stage filter
    if (stageFilter !== 'all') {
      list = list.filter((m) => m.stage === stageFilter);
    }

    // Apply search
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.name?.toLowerCase().includes(q) ||
          m.business?.toLowerCase().includes(q) ||
          m.role?.toLowerCase().includes(q) ||
          m.canHelp?.toLowerCase().includes(q) ||
          m.lookingFor?.toLowerCase().includes(q)
      );
    }

    // Compute synergy scores, filter strictly to related members (>0), and sort descending
    return list
      .map((m) => ({
        ...m,
        synergyScore: computeMemberSynergy(targetMember, m),
      }))
      .filter((m) => m.synergyScore > 0 && m.synergyScore >= minMatchThreshold)
      .sort((a, b) => b.synergyScore - a.synergyScore);
  }, [members, targetMember, stageFilter, debouncedSearch, minMatchThreshold]);

  const targetFlag = getCountryFlag(targetMember?.location?.country);
  const targetStage = STAGES[targetMember?.stage] || STAGES.idea;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* ── Header Ribbon ────────────────────────────────────────────────────── */}
      <div className="card p-5 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border-orange-200/80 dark:border-orange-900/40 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 text-xs font-bold border border-orange-200 dark:border-orange-800">
            <Radio size={13} className="animate-pulse text-orange-600" />
            Ecosystem Match Radar
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Synergy & Complementarity Radar
          </h1>
          <p className="text-xs text-stone-600 dark:text-stone-400 max-w-2xl font-medium">
            Select any founder in the network to calculate cross-industry complementarities, mutual
            supply-demand matching (Needs ↔ Offers), and collaboration scores across all{' '}
            {members.length} members.
          </p>
        </div>
      </div>

      {/* ── Frozen Sticky Control Card: Target Founder + Search + Filters + Thresholds ── */}
      <div className="sticky top-[61px] z-20 card p-4 sm:p-5 space-y-3.5 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-200/90 dark:border-stone-800 shadow-md">
        {/* Top Row: Target Founder Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-orange-600 shrink-0" />
            <span className="text-xs font-black uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Matching Against:
            </span>
          </div>

          <div className="flex-1 max-w-xl">
            <select
              value={targetMemberId}
              onChange={(e) => setTargetMemberId(e.target.value)}
              className="w-full text-xs font-bold bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500/40 cursor-pointer"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — {m.business || m.role || 'Member'} (
                  {m.location?.city || m.location?.country || 'Global'})
                </option>
              ))}
            </select>
          </div>

          {targetMember && (
            <div className="flex items-center gap-1.5 shrink-0 text-xs">
              <span
                className={`badge ${targetStage.bg} ${targetStage.text} text-[10.5px] font-bold px-2.5 py-1 border ${targetStage.border}`}
              >
                {targetStage.icon} {targetStage.label}
              </span>
              <span className="text-[11px] font-semibold text-stone-500">
                {targetFlag}{' '}
                {targetMember.location?.city || targetMember.location?.country || 'Global'}
              </span>
            </div>
          )}
        </div>

        {/* Second Row: Search & Stage Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Filter potential partners for ${targetMember?.name || 'target founder'}...`}
              className="input pl-10 py-2 text-xs font-medium rounded-xl w-full"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider mr-1 shrink-0">
              <Filter size={12} className="inline text-orange-600" /> Stage:
            </span>
            {['all', ...STAGE_OPTIONS].map((s) => {
              const stage = STAGES[s];
              const isActive = stageFilter === s;
              return (
                <button
                  key={s}
                  onClick={() => setStageFilter(s)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                    isActive
                      ? s === 'all'
                        ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 border-stone-900 dark:border-white shadow-xs'
                        : `${stage.bg} ${stage.text} ${stage.border} shadow-xs ring-1 ring-offset-1`
                      : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-stone-400'
                  }`}
                >
                  {s === 'all' ? 'All' : `${stage.icon} ${stage.label}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Third Row: Matches Summary & Threshold Selector */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-stone-100 dark:border-stone-800/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300">
              Found{' '}
              <strong className="text-orange-600 dark:text-orange-400 font-extrabold text-xs sm:text-sm">
                {rankedMembers.length}
              </strong>{' '}
              synergistic partner{rankedMembers.length === 1 ? '' : 's'} for{' '}
              <strong className="text-stone-950 dark:text-white font-black">
                {targetMember?.name}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Synergy Level:
            </span>
            <button
              onClick={() => setMinMatchThreshold(0)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                minMatchThreshold === 0
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              All Related
            </button>
            <button
              onClick={() => setMinMatchThreshold(40)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                minMatchThreshold === 40
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              Strong (40%+)
            </button>
            <button
              onClick={() => setMinMatchThreshold(60)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                minMatchThreshold === 60
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              Top Matches (60%+)
            </button>
          </div>
        </div>
      </div>

      {/* ── Ranked Results Grid ──────────────────────────────────────────────── */}
      {rankedMembers.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 flex items-center justify-center text-xl">
            🎯
          </div>
          <h3 className="text-base font-extrabold text-stone-900 dark:text-stone-100">
            No Direct Synergies Found
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
            No members matched the specific sector/need criteria for{' '}
            <strong>{targetMember?.name}</strong> with the current synergy threshold. Try switching
            to <em>"All Related"</em> or choosing another founder above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rankedMembers.map((m) => (
            <ProfileCard
              key={m.id}
              member={m}
              synergyScore={m.synergyScore}
              onDeleted={refreshMembers}
              onUpdated={refreshMembers}
            />
          ))}
        </div>
      )}
    </div>
  );
}
