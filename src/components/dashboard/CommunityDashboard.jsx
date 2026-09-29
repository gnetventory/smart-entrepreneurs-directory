import React, { useMemo, useState } from 'react';
import {
  Users,
  Sparkles,
  TrendingUp,
  ArrowRight,
  MapPin,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  Filter,
  Search,
  Zap,
  Layers,
  MessageSquare,
  Handshake,
  Target,
  ShieldAlert,
  Building2,
  Globe,
  Flame,
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { STAGES, getCountryFlag } from '../../utils/constants';
import { computeExecutiveAnalytics } from '../../utils/executiveAnalytics';
import { buildWhatsAppUrl } from '../../utils/helpers';
import { isAdminSession } from '../../utils/session';

export default function CommunityDashboard() {
  const { activeMembers: members, setActiveTab, setSearchQuery, setStageFilter } = useApp();
  const [streamFilter, setStreamFilter] = useState('all'); // 'all' | 'need' | 'offer'
  const [selectedVertical, setSelectedVertical] = useState('all');
  const isAdmin = isAdminSession();

  const analytics = useMemo(() => computeExecutiveAnalytics(members), [members]);

  const filteredStream = useMemo(() => {
    let list = analytics.highIntentStream;
    if (streamFilter !== 'all') {
      list = list.filter((item) => item.type === streamFilter);
    }
    if (selectedVertical !== 'all') {
      list = list.filter((item) => item.verticals.includes(selectedVertical));
    }
    return list.slice(0, 8);
  }, [analytics.highIntentStream, streamFilter, selectedVertical]);

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* ── 1. Executive Top Hero (Compact & High Impact) ───────────────────── */}
      <div className="card p-5 sm:p-6 bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 text-white border-stone-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-orange-500/15 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-stone-800/90 border border-stone-700 text-orange-300 text-[10px] font-extrabold uppercase tracking-widest">
              <Zap size={12} className="text-orange-400" /> Executive Command Center
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight font-display text-white">
              Ecosystem Velocity & Matchmaking Intelligence
            </h1>
            <p className="text-xs text-stone-300 font-medium">
              High-density visibility into deal flow, supply/demand gaps, and live collaboration
              asks.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveTab('directory')}
              className="btn-accent px-4 py-2 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/20"
            >
              <Users size={14} /> Browse Directory <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. EXECUTIVE KPI RIBBON (Top-Level Intelligence) ────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Verified Members & Growth Velocity */}
        <div className="card p-4 space-y-2 border-l-4 border-l-emerald-500 bg-white dark:bg-stone-900">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
            <span className="text-[10px] font-black uppercase tracking-widest">
              Ecosystem Scale
            </span>
            <div className="p-1 rounded-md bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <Users size={14} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 font-display">
              {analytics.total}
            </span>
            <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
              +{analytics.monthlyVelocity} this month
            </span>
          </div>
          <p className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">
            Verified active founders & operators
          </p>
        </div>

        {/* Card 2: Synergy Density Rate */}
        <div className="card p-4 space-y-2 border-l-4 border-l-orange-500 bg-white dark:bg-stone-900">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
            <span className="text-[10px] font-black uppercase tracking-widest">
              Synergy Density Rate
            </span>
            <div className="p-1 rounded-md bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400">
              <Sparkles size={14} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-orange-600 dark:text-orange-400 font-display">
              {analytics.synergyIndex}%
            </span>
            <span className="text-[9px] font-bold text-stone-500 uppercase tracking-wide">
              Network Liquidity
            </span>
          </div>
          <p className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">
            Founders with active matching capability in network
          </p>
        </div>

        {/* Card 3: Active Asks Ticker */}
        <div className="card p-4 space-y-2 border-l-4 border-l-sky-500 bg-white dark:bg-stone-900">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
            <span className="text-[10px] font-black uppercase tracking-widest">Active Asks</span>
            <div className="p-1 rounded-md bg-sky-100 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
              <Target size={14} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-sky-600 dark:text-sky-400 font-display">
              {analytics.activeAsksCount}
            </span>
            <span className="text-[11px] font-bold text-stone-500">
              vs {analytics.activeOffersCount} offers
            </span>
          </div>
          <p className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">
            Unresolved assistance & partnership requests
          </p>
        </div>

        {/* Card 4: Stage Ratio */}
        <div className="card p-4 space-y-2 border-l-4 border-l-indigo-500 bg-white dark:bg-stone-900">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
            <span className="text-[10px] font-black uppercase tracking-widest">Stage Ratio</span>
            <div className="p-1 rounded-md bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <Layers size={14} />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100 font-display font-mono">
            {analytics.stageRatios}
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-stone-500">
            <span>💡{analytics.stageCounts.idea}</span>
            <span>·</span>
            <span className="text-emerald-600">🌱{analytics.stageCounts.starting}</span>
            <span>·</span>
            <span className="text-amber-600">⚙️{analytics.stageCounts.running}</span>
            <span>·</span>
            <span className="text-indigo-600">🚀{analytics.stageCounts.growing}</span>
          </div>
        </div>
      </div>

      {/* ── 3. THE SUPPLY/DEMAND MATCHMAKING ENGINE & NETWORK GAPS ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: The Gives vs Gets Heatmap Table */}
        <div className="lg:col-span-2 card p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-stone-200/80 dark:border-stone-800 pb-3">
            <div>
              <h3 className="section-title text-sm">
                <Flame size={16} className="text-orange-500" />
                The Supply / Demand Matchmaking Engine
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                Comparing community demand ("Looking For") directly against community supply ("Can
                Offer").
              </p>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-mono font-bold">
              {analytics.matrix.length} Verticals
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200/60 dark:border-stone-800 text-[10px] font-black uppercase tracking-wider text-stone-400">
                  <th className="pb-2.5">Capability Vertical</th>
                  <th className="pb-2.5 text-sky-600 dark:text-sky-400">Seeking (Demand)</th>
                  <th className="pb-2.5 text-emerald-600 dark:text-emerald-400">
                    Offering (Supply)
                  </th>
                  <th className="pb-2.5 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
                {analytics.matrix.map((row) => {
                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-stone-50/80 dark:hover:bg-stone-800/40 transition-colors"
                    >
                      <td className="py-2.5 font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                        <span>{row.icon}</span>
                        <span>{row.label}</span>
                      </td>

                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-sky-500 rounded-full"
                              style={{ width: `${Math.min(100, row.demandPct * 1.5)}%` }}
                            />
                          </div>
                          <span className="font-mono font-extrabold text-sky-700 dark:text-sky-400 text-[11px]">
                            {row.demand} ({row.demandPct}%)
                          </span>
                        </div>
                      </td>

                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${Math.min(100, row.supplyPct * 1.5)}%` }}
                            />
                          </div>
                          <span className="font-mono font-extrabold text-emerald-700 dark:text-emerald-400 text-[11px]">
                            {row.supply} ({row.supplyPct}%)
                          </span>
                        </div>
                      </td>

                      <td className="py-2.5 text-right">
                        {row.status === 'deficit' ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                            Shortage ({row.gap})
                          </span>
                        ) : row.status === 'surplus' ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            Surplus (+{Math.abs(row.gap)})
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-stone-400">Balanced</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Network Gap Alerts */}
        <div className="card p-5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800 pb-3">
            <h3 className="section-title text-sm">
              <ShieldAlert size={16} className="text-orange-500" />
              Network Gaps & Alerts
            </h3>
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300">
              AI Insight
            </span>
          </div>

          <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
            {analytics.networkGaps.length === 0 ? (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                ✅ Community supply and demand are balanced across all verticals!
              </div>
            ) : (
              analytics.networkGaps.map((gap, idx) => {
                const isCritical = gap.severity === 'high';
                const isOpportunity = gap.severity === 'opportunity';
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs space-y-1 ${
                      isCritical
                        ? 'bg-rose-50/90 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200'
                        : isOpportunity
                          ? 'bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200'
                          : 'bg-amber-50/90 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between font-black uppercase tracking-wider text-[9px]">
                      <span className="flex items-center gap-1">
                        <span>{gap.icon}</span> {gap.vertical}
                      </span>
                      <span>
                        {isCritical ? '⚠️ Deficit' : isOpportunity ? '✨ Surplus' : '⚡ Shortage'}
                      </span>
                    </div>
                    <p className="font-semibold leading-snug">{gap.message}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── 4. STRATEGIC DIRECTORY ANALYTICS ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Geographic Hub Density */}
        <div className="card p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800 pb-2.5">
            <h3 className="section-title text-sm">
              <MapPin size={15} className="text-orange-500" />
              Geographic Concentration
            </h3>
            <button
              onClick={() => setActiveTab('map')}
              className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-0.5"
            >
              View Map <ArrowRight size={11} />
            </button>
          </div>

          <div className="space-y-2">
            {analytics.topDistricts.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {item.name}
                  </span>
                  <span className="font-mono text-stone-500">
                    {item.count} founders ({item.pct}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Industry Domain Clustering */}
        <div className="card p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800 pb-2.5">
            <h3 className="section-title text-sm">
              <Briefcase size={15} className="text-orange-500" />
              Industry Domains
            </h3>
            <span className="text-xs text-stone-400 font-mono font-bold">
              {analytics.topIndustries.length} Sectors
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {analytics.topIndustries.map((ind, idx) => (
              <button
                key={ind.name}
                onClick={() => {
                  setSearchQuery(ind.name);
                  setActiveTab('directory');
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  idx === 0
                    ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800/60 shadow-xs'
                    : 'bg-stone-50 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-orange-300'
                }`}
              >
                <span>{ind.name}</span>
                <span className="px-1 py-0.2 rounded bg-stone-200 dark:bg-stone-700 font-mono text-[9px]">
                  {ind.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 5. HIGH-INTENT "NEED / OFFER" STREAM ────────────────────────────── */}
      <div className="card p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-stone-200/80 dark:border-stone-800 pb-3">
          <div>
            <h3 className="section-title text-sm">
              <Target size={16} className="text-orange-500" />
              Live High-Intent Need & Offer Stream
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
              Actionable requests for immediate deals, co-founders, capital, and capabilities.
            </p>
          </div>

          {/* Stream Filter Pills */}
          <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-0.5 rounded-xl">
            <button
              onClick={() => setStreamFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                streamFilter === 'all'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              All ({analytics.highIntentStream.length})
            </button>
            <button
              onClick={() => setStreamFilter('need')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                streamFilter === 'need'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              🎯 Needs ({analytics.activeAsksCount})
            </button>
            <button
              onClick={() => setStreamFilter('offer')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                streamFilter === 'offer'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              🤝 Offers ({analytics.activeOffersCount})
            </button>
          </div>
        </div>

        {/* Stream Item Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredStream.length === 0 ? (
            <div className="col-span-2 text-center py-6 text-xs text-stone-400 font-medium">
              No active signals in this filter view.
            </div>
          ) : (
            filteredStream.map((item) => {
              const isNeed = item.type === 'need';
              const stage = STAGES[item.memberStage] || STAGES.idea;
              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border transition-all space-y-2.5 ${
                    isNeed
                      ? 'bg-sky-50/50 dark:bg-sky-950/20 border-sky-200/80 dark:border-sky-900/40 border-l-4 border-l-sky-500'
                      : 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/40 border-l-4 border-l-emerald-500'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span
                        className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.2 rounded ${
                          isNeed
                            ? 'bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-300'
                            : 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300'
                        }`}
                      >
                        {isNeed ? '🎯 Seeking' : '🤝 Offering'}
                      </span>
                      <h4 className="font-extrabold text-xs text-stone-900 dark:text-stone-100 mt-1">
                        {item.memberName}
                      </h4>
                      <p className="text-[10px] text-stone-500 font-medium">
                        {item.memberRole} ·{' '}
                        {typeof item.memberLocation === 'string'
                          ? item.memberLocation
                          : item.memberLocation?.city || 'Egypt'}
                      </p>
                    </div>

                    <span
                      className={`badge ${stage.bg} ${stage.text} border ${stage.border} text-[9px] font-bold px-1.5 py-0.2`}
                    >
                      {stage.icon} {stage.label}
                    </span>
                  </div>

                  <p className="text-xs text-stone-800 dark:text-stone-200 font-semibold leading-relaxed bg-white/70 dark:bg-stone-900/60 p-2 rounded-lg border border-stone-200/50 dark:border-stone-800">
                    "{item.text}"
                  </p>

                  <div className="flex items-center justify-between pt-0.5">
                    <div className="flex flex-wrap gap-1">
                      {item.verticals.map((v) => (
                        <span
                          key={v}
                          className="text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                        >
                          #{v}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setSearchQuery(item.memberName);
                        setActiveTab('directory');
                      }}
                      className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-0.5"
                    >
                      Connect <ArrowRight size={11} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
