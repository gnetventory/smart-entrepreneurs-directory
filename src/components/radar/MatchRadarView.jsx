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
import { enhancedMemberMatchesSearch } from '../../utils/searchEngine';
import ProfileCard from '../directory/ProfileCard';
import EmptyState from '../directory/EmptyState';
import ScoreExplainerModal from '../common/ScoreExplainerModal';

export default function MatchRadarView() {
  const { activeMembers: members, refreshMembers } = useApp();
  const [targetMemberId, setTargetMemberId] = useState(members[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [explainingCandidate, setExplainingCandidate] = useState(null);

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

    // Apply search with multilingual stemming
    if (debouncedSearch) {
      list = list.filter((m) => enhancedMemberMatchesSearch(m, debouncedSearch));
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
      {/* ── Frozen Sticky Top Container: Match Radar Header + Controls ────────── */}
      <div className="sticky top-[66px] z-20 space-y-3 bg-[#FAFAF7]/95 dark:bg-stone-950/95 backdrop-blur-md pb-2 pt-1 transition-colors">
        {/* Header Ribbon */}
        <div className="card p-3.5 sm:p-4 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border-orange-200/80 dark:border-orange-900/40 rounded-2xl shadow-sm flex items-center justify-between flex-wrap gap-2">
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 text-[11px] font-bold border border-orange-200 dark:border-orange-800">
              <Radio size={12} className="animate-pulse text-orange-600" />
              Ecosystem Match Radar
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
              Synergy & Complementarity Radar
            </h1>
          </div>

          <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
            Calculating bilateral reciprocity across {members.length} founders
          </span>
        </div>

        {/* Control Card: Target Founder + Search + Filters + Thresholds */}
        <div className="card p-3.5 sm:p-4 space-y-3 bg-white/95 dark:bg-stone-900/95 border border-stone-200/90 dark:border-stone-800 shadow-md">
          {/* Top Row: Target Founder Selector */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 border-b border-stone-100 dark:border-stone-800 pb-2.5">
            <div className="flex items-center gap-2 shrink-0">
              <Target size={15} className="text-orange-600 shrink-0" />
              <span className="text-[11.5px] font-black uppercase tracking-wider text-stone-900 dark:text-stone-100">
                Matching Against:
              </span>
            </div>

            <div className="flex-1 max-w-xl">
              <select
                value={targetMemberId}
                onChange={(e) => setTargetMemberId(e.target.value)}
                className="w-full text-xs font-bold bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl p-2 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500/40 cursor-pointer"
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
                  className={`badge ${targetStage.bg} ${targetStage.text} text-[10px] font-bold px-2 py-0.5 border ${targetStage.border}`}
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
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <div className="relative flex-1 w-full">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Filter potential partners for ${targetMember?.name || 'target founder'}...`}
                className="input pl-10 py-1.5 text-xs font-medium rounded-xl w-full"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-0.5 sm:pb-0">
              <span className="text-[10.5px] font-extrabold text-stone-500 uppercase tracking-wider mr-1 shrink-0">
                <Filter size={11} className="inline text-orange-600" /> Stage:
              </span>
              {['all', ...STAGE_OPTIONS].map((s) => {
                const stage = STAGES[s];
                const isActive = stageFilter === s;
                return (
                  <button
                    key={s}
                    onClick={() => setStageFilter(s)}
                    className={`px-2 py-1 rounded-xl text-xs font-bold transition-all shrink-0 border cursor-pointer ${
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
              <span className="text-[10.5px] font-bold text-stone-500 uppercase tracking-wider">
                Synergy Level:
              </span>
              <button
                onClick={() => setMinMatchThreshold(0)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  minMatchThreshold === 0
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                All Related
              </button>
              <button
                onClick={() => setMinMatchThreshold(40)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  minMatchThreshold === 40
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                Strong (40%+)
              </button>
              <button
                onClick={() => setMinMatchThreshold(60)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
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
        <div className="space-y-4">
          <div className="p-3 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-200/80 dark:border-orange-900/40 rounded-xl flex items-center justify-between text-xs text-stone-700 dark:text-stone-300">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-orange-500" />
              <span>
                Found <strong>{rankedMembers.length}</strong> complementary founders for{' '}
                <strong>{targetMember?.name}</strong>.
              </span>
            </div>
            <span className="text-[11px] text-stone-500 font-medium">
              Click any match to inspect reciprocity & score breakdown
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rankedMembers.map((m) => (
              <div key={m.id} className="relative group/radar">
                <ProfileCard
                  member={m}
                  synergyScore={m.synergyScore}
                  onDeleted={refreshMembers}
                  onUpdated={refreshMembers}
                />
                {/* 1-Click Synergy Breakdown Trigger */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExplainingCandidate(m);
                  }}
                  className="absolute top-4 left-18 z-10 px-2 py-0.5 rounded-md bg-orange-600 hover:bg-orange-700 text-white font-mono font-black text-[9.5px] shadow-sm transition-all cursor-pointer flex items-center gap-1 opacity-90 group-hover/radar:opacity-100"
                  title="View AI Matchmaker Synergy Breakdown"
                >
                  <Sparkles size={10} />
                  <span>Breakdown</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── AI Synergy Explainer Modal ────────────────────────────────────────── */}
      {explainingCandidate && (
        <ScoreExplainerModal
          isOpen={Boolean(explainingCandidate)}
          onClose={() => setExplainingCandidate(null)}
          type="synergy_match"
          targetMember={targetMember}
          candidateMember={explainingCandidate}
        />
      )}
    </div>
  );
}
