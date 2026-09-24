import React, { useMemo } from 'react';
import { BarChart3, Users, Rocket, Globe, Tag, Sparkles } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { STAGES } from '../../utils/constants';

export default function CommunityDashboard() {
  const { members } = useApp();

  const stats = useMemo(() => {
    const total = members.length;
    const stages = { idea: 0, starting: 0, running: 0, growing: 0 };
    const countries = {};
    const tagCounts = {};

    members.forEach((m) => {
      if (stages[m.stage] !== undefined) stages[m.stage]++;
      const c = m.location?.country || 'Unknown';
      countries[c] = (countries[c] || 0) + 1;
      m.tags?.forEach((t) => {
        tagCounts[t] = (tagCounts[t] || 0) + 1;
      });
    });

    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const topCountries = Object.entries(countries)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return { total, stages, topTags, topCountries };
  }, [members]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="card p-6 sm:p-8 bg-gradient-to-r from-purple-500/10 via-emerald-500/5 to-transparent border-purple-500/30">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-600 text-white rounded-2xl flex-shrink-0 shadow-lg shadow-purple-600/20">
            <BarChart3 size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Community Intelligence Analytics</h2>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
              Live zero-cost metrics computed from local browser storage to help admins curate events & partnerships.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total Members</span>
            <Users size={20} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 font-display">{stats.total}</div>
        </div>

        <div className="card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Countries</span>
            <Globe size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 font-display">{stats.topCountries.length}</div>
        </div>

        <div className="card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Running / Growing</span>
            <Rocket size={20} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 font-display">
            {stats.stages.running + stats.stages.growing}
          </div>
        </div>

        <div className="card p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Top Industry</span>
            <Tag size={20} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-display truncate">
            {stats.topTags[0]?.[0] || 'N/A'}
          </div>
        </div>
      </div>

      {/* Distribution Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Stage Breakdown */}
        <div className="card p-6 sm:p-8 space-y-5">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            📊 Business Stage Distribution
          </h3>

          <div className="space-y-4">
            {Object.entries(STAGES).map(([key, stage]) => {
              const count = stats.stages[key] || 0;
              const percent = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-800 dark:text-slate-200">
                      {stage.icon} {stage.label}
                    </span>
                    <span className="font-mono text-slate-600 dark:text-slate-400">{count} ({percent}%)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 dark:bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-slate-800">
                    <div
                      className={`h-full rounded-full ${stage.bg.replace('/20', '')}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Industry Skills / Tags */}
        <div className="card p-6 sm:p-8 space-y-5">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            🏷️ Top Skills & Industries
          </h3>

          <div className="flex flex-wrap gap-2.5">
            {stats.topTags.map(([tag, count]) => (
              <div
                key={tag}
                className="card px-4 py-2.5 flex items-center gap-2.5 bg-slate-100 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-sm font-bold"
              >
                <span className="text-slate-800 dark:text-slate-200">{tag}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 font-mono text-xs font-bold">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
