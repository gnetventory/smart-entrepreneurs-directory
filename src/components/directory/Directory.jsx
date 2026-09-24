import React, { useState, useMemo } from 'react';
import { Search, Filter, LayoutGrid, Columns, Sparkles, SlidersHorizontal, Users } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { memberMatchesSearch } from '../../utils/helpers';
import { STAGES, STAGE_OPTIONS } from '../../utils/constants';
import { useDebounce } from '../../utils/useDebounce';
import ProfileCard from './ProfileCard';
import EmptyState from './EmptyState';

export default function Directory() {
  const { members, refreshMembers, searchQuery, setSearchQuery, stageFilter, setStageFilter, viewMode, setViewMode } = useApp();
  const [tagFilter, setTagFilter] = useState('');

  // Debounce search query to avoid expensive re-filtering on every single keystroke
  const debouncedSearch = useDebounce(searchQuery, 150);

  const filteredMembers = useMemo(() => {
    let result = members;
    if (stageFilter !== 'all') result = result.filter((m) => m.stage === stageFilter);
    if (tagFilter) result = result.filter((m) => m.tags?.includes(tagFilter));
    if (debouncedSearch) result = result.filter((m) => memberMatchesSearch(m, debouncedSearch));
    return result;
  }, [members, stageFilter, tagFilter, debouncedSearch]);

  const allTags = useMemo(() => {
    const tagSet = new Set();
    members.forEach((m) => m.tags?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [members]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner & Control Card */}
      <div className="card p-5 sm:p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <Users className="text-emerald-600 dark:text-emerald-400" size={24} /> Community Member Directory
            </h2>
            <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-0.5">
              Showing <span className="text-emerald-600 dark:text-emerald-400 font-bold">{filteredMembers.length}</span> of <span className="text-stone-900 dark:text-stone-200 font-bold">{members.length}</span> global entrepreneurs
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-950 p-1 rounded-xl border border-stone-200 dark:border-stone-800 self-start md:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-stone-950 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid size={15} /> Grid View
            </button>
            <button
              onClick={() => setViewMode('matchmaker')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'matchmaker'
                  ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-stone-950 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <Columns size={15} /> Matchmaker Split
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
            placeholder="Search entrepreneurs by name, business, skills, city, country..."
            className="input pl-10 py-3 text-sm rounded-xl"
          />
        </div>

        {/* Stage Filter Pills & Tags */}
        <div className="flex items-center gap-2 flex-wrap pt-0.5">
          <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest flex items-center gap-1 mr-1">
            <Filter size={13} /> Stage:
          </span>
          {['all', ...STAGE_OPTIONS].map((s) => {
            const stage = STAGES[s];
            const isActive = stageFilter === s;
            return (
              <button
                key={s}
                onClick={() => setStageFilter(s)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                  isActive
                    ? s === 'all'
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 border-stone-900 shadow-sm'
                      : `${stage.bg} ${stage.text} ${stage.border} shadow-sm`
                    : 'bg-white dark:bg-stone-950 text-stone-700 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                {s === 'all' ? '✨ All Stages' : `${stage.icon} ${stage.label}`}
              </button>
            );
          })}

          {/* Industry Tag Selector */}
          {allTags.length > 0 && (
            <div className="ml-auto flex items-center gap-1.5">
              <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest flex items-center gap-1">
                <SlidersHorizontal size={13} /> Industry:
              </span>
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="text-xs font-semibold bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-lg px-2.5 py-1.5 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
              >
                <option value="">All Industries ({allTags.length})</option>
                {allTags.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid View */}
      {members.length === 0 ? (
        <EmptyState />
      ) : filteredMembers.length === 0 ? (
        <EmptyState isFiltered />
      ) : viewMode === 'matchmaker' ? (
        <MatchmakerLayout members={filteredMembers} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map((m) => (
            <ProfileCard key={m.id} member={m} onDeleted={refreshMembers} onUpdated={refreshMembers} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Split Matchmaker Layout ───────────────────────────────────────────────
function MatchmakerLayout({ members }) {
  return (
    <div className="space-y-5">
      <div className="card p-4 flex items-center gap-3 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60">
        <Sparkles size={20} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
        <p className="text-xs font-semibold text-stone-800 dark:text-stone-200 leading-relaxed">
          <strong>Matchmaker Split View:</strong> Compare community <strong>Needs</strong> on the left directly against <strong>Offers</strong> on the right to discover instant collaboration opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Needs Column */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-sky-700 dark:text-sky-400 px-1 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            🔍 Community Needs ({members.filter(m => m.lookingFor).length})
          </h3>
          {members.filter(m => m.lookingFor).map((m) => (
            <div key={m.id} className="card p-4 space-y-2 border-l-4 border-l-sky-500">
              <div className="flex items-center gap-2.5 mb-1">
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${getAvatarGradient(m.name)} flex items-center justify-center text-white text-[11px] font-bold`}>
                  {getInitials(m.name)}
                </div>
                <div>
                  <span className="text-sm font-bold text-stone-900 dark:text-stone-100">{m.name}</span>
                  <span className="text-xs text-stone-500 dark:text-stone-400 ml-1.5 font-medium">({m.role})</span>
                </div>
              </div>
              <p className="text-xs text-sky-950 dark:text-sky-200 leading-relaxed font-medium">{m.lookingFor}</p>
            </div>
          ))}
        </div>

        {/* Offers Column */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 px-1 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            🤝 Community Offers ({members.filter(m => m.canHelp).length})
          </h3>
          {members.filter(m => m.canHelp).map((m) => (
            <div key={m.id} className="card p-5 space-y-2 border-l-4 border-l-emerald-500">
              <div className="flex items-center gap-2.5 mb-1">
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${getAvatarGradient(m.name)} flex items-center justify-center text-white text-[11px] font-bold`}>
                  {getInitials(m.name)}
                </div>
                <div>
                  <span className="text-sm font-bold text-stone-900 dark:text-stone-100">{m.name}</span>
                  <span className="text-xs text-stone-500 dark:text-stone-400 ml-1.5 font-medium">({m.role})</span>
                </div>
              </div>
              <p className="text-xs text-emerald-950 dark:text-emerald-200 leading-relaxed font-medium">{m.canHelp}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getInitials(name = '') { return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2); }
function getAvatarGradient(name = '') {
  const g = ['from-emerald-500 to-teal-600','from-blue-500 to-indigo-600','from-purple-500 to-violet-600','from-amber-500 to-orange-600'];
  return g[name.charCodeAt(0) % g.length];
}
