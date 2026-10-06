import React, { useMemo, useState } from 'react';
import {
  Users,
  Sparkles,
  ArrowRight,
  MapPin,
  Briefcase,
  Zap,
  Layers,
  Target,
  ShieldAlert,
  Flame,
  MessageCircle,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Eye,
  Handshake,
  Download,
  Linkedin,
  FileText,
  Trash2,
  Edit2,
  Star,
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { STAGES, getCountryFlag } from '../../utils/constants';
import { computeExecutiveAnalytics } from '../../utils/executiveAnalytics';
import { isAdminSession } from '../../utils/session';
import {
  getInitials,
  getAvatarGradient,
  isValidLinkedInUrl,
  formatLinkedInUrl,
  buildWhatsAppUrl,
  downloadVCardFile,
  getMemberWebsites,
} from '../../utils/helpers';
import Modal from '../common/Modal';
import EditMemberModal from '../parser/EditMemberModal';

export default function CommunityDashboard() {
  const { activeMembers: members, refreshMembers, setActiveTab, setSearchQuery, notify } = useApp();
  const [streamFilter, setStreamFilter] = useState('all'); // 'all' | 'need' | 'offer'
  const [selectedVertical] = useState('all');

  // Interactive Direct-Action Modals State
  const [detailMember, setDetailMember] = useState(null);
  const [editMember, setEditMember] = useState(null);
  const [bilateralPairing, setBilateralPairing] = useState(null);
  const [introLanguage, setIntroLanguage] = useState('ar');
  const [copiedIntro, setCopiedIntro] = useState(false);

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

  const handleOpenBilateralModal = (pairing) => {
    setBilateralPairing(pairing);
    setCopiedIntro(false);
  };

  const generateBilateralMessage = (pair, lang = 'ar') => {
    if (!pair) return '';
    const nameA = pair.memberA.name.split(' ')[0];
    const nameB = pair.memberB.name.split(' ')[0];
    const bizA = pair.memberA.business;
    const bizB = pair.memberB.business;

    if (lang === 'ar') {
      return `السلام عليكم أستاذ ${nameA} وأستاذ ${nameB}، تحياتي لكما من مجتمع رواد الأعمال Smart Directory & Alliance.\n\nيسعدني جداً تعريفكما ببعض، حيث لاحظت وجود تكامل استراتيجي وفرص تعاون واعدة بين مشروع ${bizA} ومشروع ${bizB}.\n\nأترك لكما المساحة للتواصل واستكشاف مجالات الشراكة والتطوير المشترك. بالتوفيق والنجاح الدائم! ✨`;
    }

    return `Hello ${nameA} and ${nameB}, warm greetings from the Smart Directory & Alliance community!\n\nI am delighted to introduce you to each other, seeing a powerful synergistic fit and clear collaboration opportunities between ${bizA} and ${bizB}.\n\nConnecting you both here to explore potential partnerships and joint growth. Wishing you great success! ✨`;
  };

  const handleCopyBilateralMessage = () => {
    const text = generateBilateralMessage(bilateralPairing, introLanguage);
    navigator.clipboard.writeText(text);
    setCopiedIntro(true);
    notify('📋 Bilateral intro message copied to clipboard!');
    setTimeout(() => setCopiedIntro(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12">
      {/* ── Frozen Sticky Top Command Area (Hero + KPI Ribbon) ──────────────── */}
      <div className="sticky top-[66px] z-20 space-y-4 bg-[#FAFAF7]/95 dark:bg-stone-950/95 backdrop-blur-md pb-2 pt-1 transition-colors">
        {/* 1. Executive Top Hero */}
        <div className="card p-4 sm:p-5 bg-stone-950 text-white border-[1.5px] border-stone-800 shadow-tactile dark:shadow-tactile-dark relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-orange-600/20 via-emerald-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-1 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xl bg-stone-900 border-[1.5px] border-stone-700 text-orange-400 text-[10px] font-mono font-black uppercase tracking-widest">
                <Zap size={12} className="text-orange-400" /> Executive Deal-Flow Command Center
              </div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight font-display text-white">
                Ecosystem Velocity & Matchmaking Intelligence
              </h1>
              <p className="text-[11.5px] text-stone-300 font-medium leading-relaxed">
                Real-time actionable deal flow, curated bilateral introductions, and live supply/demand
                gaps across verified cohorts.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setActiveTab('directory')}
                className="btn-accent px-3.5 py-2 text-xs font-black flex items-center gap-1.5 shadow-tactile-sm cursor-pointer"
              >
                <Users size={13} /> Browse Directory <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* 2. EXECUTIVE KPI RIBBON */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Verified Members */}
          <div className="card p-3.5 space-y-1.5 border-l-4 border-l-emerald-600 bg-white dark:bg-stone-900 border-[1.5px] border-stone-300 dark:border-stone-800 shadow-tactile-sm dark:shadow-none">
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
              <span className="text-[10.5px] font-black uppercase tracking-wider font-mono">
                Ecosystem Scale
              </span>
              <div className="p-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                <Users size={13} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-stone-950 dark:text-stone-50 font-display">
                {analytics.total}
              </span>
              <span className="text-[11px] font-mono font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded-md border border-emerald-300 dark:border-emerald-800">
                +{analytics.monthlyVelocity} this month
              </span>
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-400 font-bold truncate">
              Verified active founders & operators
            </p>
          </div>

          {/* Card 2: Synergy Density Rate */}
          <div className="card p-3.5 space-y-1.5 border-l-4 border-l-orange-600 bg-white dark:bg-stone-900 border-[1.5px] border-stone-300 dark:border-stone-800 shadow-tactile-sm dark:shadow-none">
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
              <span className="text-[10.5px] font-black uppercase tracking-wider font-mono">
                Synergy Density Rate
              </span>
              <div className="p-1 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 border border-orange-300 dark:border-orange-800">
                <Sparkles size={13} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-orange-600 dark:text-orange-400 font-display">
                {analytics.synergyIndex}%
              </span>
              <span className="text-[9.5px] font-mono font-black text-stone-500 uppercase tracking-wide">
                Network Liquidity
              </span>
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-400 font-bold truncate">
              Founders with matching capability
            </p>
          </div>

          {/* Card 3: Active Asks Ticker */}
          <div className="card p-3.5 space-y-1.5 border-l-4 border-l-sky-600 bg-white dark:bg-stone-900 border-[1.5px] border-stone-300 dark:border-stone-800 shadow-tactile-sm dark:shadow-none">
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
              <span className="text-[10.5px] font-black uppercase tracking-wider font-mono">
                Active Asks
              </span>
              <div className="p-1 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 border border-sky-300 dark:border-sky-800">
                <Target size={13} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-sky-600 dark:text-sky-400 font-display">
                {analytics.activeAsksCount}
              </span>
              <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400">
                vs {analytics.activeOffersCount} offers
              </span>
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-400 font-bold truncate">
              Unresolved partnership requests
            </p>
          </div>

          {/* Card 4: Stage Ratio */}
          <div className="card p-3.5 space-y-1.5 border-l-4 border-l-indigo-600 bg-white dark:bg-stone-900 border-[1.5px] border-stone-300 dark:border-stone-800 shadow-tactile-sm dark:shadow-none">
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400">
              <span className="text-[10.5px] font-black uppercase tracking-wider font-mono">
                Stage Ratio
              </span>
              <div className="p-1 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-800">
                <Layers size={13} />
              </div>
            </div>
            <div className="text-base sm:text-lg font-black text-stone-950 dark:text-stone-50 font-display font-mono">
              {analytics.stageRatios}
            </div>
            <div className="flex items-center gap-1.5 text-[9.5px] font-bold text-stone-600 dark:text-stone-400 truncate">
              <span>💡 {analytics.stageCounts.idea}</span>
              <span>·</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-black">
                🌱 {analytics.stageCounts.starting}
              </span>
              <span>·</span>
              <span className="text-amber-700 dark:text-amber-400 font-black">
                ⚙️ {analytics.stageCounts.running}
              </span>
              <span>·</span>
              <span className="text-indigo-700 dark:text-indigo-400 font-black">
                🚀 {analytics.stageCounts.growing}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. TODAY'S CURATED MATCHMAKING QUEUE (High-Affinity Deal Flow - Admin Only) ───── */}
      {isAdmin && analytics.curatedPairings.length > 0 && (
        <div className="card p-5 sm:p-6 bg-white dark:bg-stone-900 border-[1.5px] border-stone-300 dark:border-stone-800 shadow-md space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-stone-100 dark:border-stone-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-500/30">
                <Handshake size={18} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black font-display text-stone-900 dark:text-stone-100">
                  Today's Curated Matchmaking Queue
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                  Top high-affinity bilateral founder pairings ready for warm introductions.
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-xl border border-emerald-300 dark:border-emerald-800">
              ⚡ 3 Ready-to-Bridge Deals
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {analytics.curatedPairings.map((pairing) => (
              <div
                key={pairing.id}
                className="p-4 rounded-2xl border border-stone-200/90 dark:border-stone-800 bg-[#FAFAF7] dark:bg-stone-850 hover:border-orange-400/60 dark:hover:border-orange-500/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3.5"
              >
                {/* Header Match Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-800">
                    ⚡ {pairing.score}% Match
                  </span>
                  <span className="text-[11px] font-bold text-stone-500">
                    Bilateral Synergy
                  </span>
                </div>

                {/* Dual Founder Display */}
                <div className="grid grid-cols-2 gap-2 items-center relative py-1">
                  {/* Founder A */}
                  <div
                    onClick={() => setDetailMember(pairing.memberA)}
                    className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-750 cursor-pointer hover:border-orange-400 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-black text-xs flex items-center justify-center mb-1.5">
                      {getInitials(pairing.memberA.name)}
                    </div>
                    <div className="font-extrabold text-xs text-stone-900 dark:text-stone-100 truncate">
                      {pairing.memberA.name}
                    </div>
                    <div className="text-[10px] text-stone-500 truncate">
                      {pairing.memberA.business || pairing.memberA.role}
                    </div>
                  </div>

                  {/* Founder B */}
                  <div
                    onClick={() => setDetailMember(pairing.memberB)}
                    className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-750 cursor-pointer hover:border-orange-400 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-600 to-amber-700 text-white font-black text-xs flex items-center justify-center mb-1.5">
                      {getInitials(pairing.memberB.name)}
                    </div>
                    <div className="font-extrabold text-xs text-stone-900 dark:text-stone-100 truncate">
                      {pairing.memberB.name}
                    </div>
                    <div className="text-[10px] text-stone-500 truncate">
                      {pairing.memberB.business || pairing.memberB.role}
                    </div>
                  </div>
                </div>

                {/* Mutual Rationale Bridge */}
                <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/50 text-[11.5px] text-emerald-950 dark:text-emerald-100 leading-snug font-medium">
                  💡 {pairing.rationale}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1 border-t border-stone-200 dark:border-stone-800">
                  <button
                    onClick={() => handleOpenBilateralModal(pairing)}
                    className="btn-primary text-xs py-1.5 px-3 flex-1 flex items-center justify-center gap-1.5 font-bold cursor-pointer"
                  >
                    <MessageCircle size={13} />
                    <span>Facilitate Intro</span>
                  </button>
                  <button
                    onClick={() => setDetailMember(pairing.memberA)}
                    className="p-1.5 rounded-xl bg-stone-200 dark:bg-stone-750 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors cursor-pointer"
                    title="View Profile Details"
                  >
                    <Eye size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 4. THE SUPPLY/DEMAND MATCHMAKING ENGINE & NETWORK GAPS ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: The Gives vs Gets Heatmap Table */}
        <div className="lg:col-span-2 card p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-stone-200/80 dark:border-stone-800 pb-3">
            <div>
              <h3 className="section-title text-sm">
                <Flame size={16} className="text-orange-500" />
                The Supply / Demand Matchmaking Engine
              </h3>
              <p className="text-[12.5px] text-stone-500 dark:text-stone-400 font-medium">
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

        {/* Right Col: Prescriptive Network Gap Alerts */}
        <div className="card p-5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-stone-800 pb-3">
            <h3 className="section-title text-sm">
              <ShieldAlert size={16} className="text-orange-500" />
              Prescriptive Network Gaps
            </h3>
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300">
              AI Solutions
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
                    className={`p-3 rounded-xl border text-xs space-y-1.5 ${
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

                    {/* Clickable Candidate Bridges */}
                    {gap.candidateProviders && gap.candidateProviders.length > 0 && (
                      <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold text-stone-500">Bridge with:</span>
                        {gap.candidateProviders.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => setDetailMember(p)}
                            className="px-2 py-0.5 rounded-md bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 hover:border-orange-500 text-[10px] font-bold cursor-pointer"
                          >
                            {p.name.split(' ')[0]} ➔
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── 5. STRATEGIC DIRECTORY ANALYTICS ─────────────────────────────────── */}
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
              className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              View Global Atlas <ArrowRight size={11} />
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
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
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

      {/* ── 6. DIRECT-ACTION HIGH-INTENT "NEED / OFFER" STREAM ───────────────── */}
      <div className="card p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-stone-200/80 dark:border-stone-800 pb-3">
          <div>
            <h3 className="section-title text-sm">
              <Target size={16} className="text-orange-500" />
              Live High-Intent Need & Offer Stream
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
              Click any signal to immediately open the founder's profile and initiate warm outreach.
            </p>
          </div>

          {/* Stream Filter Pills */}
          <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-0.5 rounded-xl">
            <button
              onClick={() => setStreamFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                streamFilter === 'all'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              All ({analytics.highIntentStream.length})
            </button>
            <button
              onClick={() => setStreamFilter('need')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                streamFilter === 'need'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              🎯 Needs ({analytics.activeAsksCount})
            </button>
            <button
              onClick={() => setStreamFilter('offer')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                streamFilter === 'offer'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              🤝 Offers ({analytics.activeOffersCount})
            </button>
          </div>
        </div>

        {/* Stream Item Cards with Direct Action */}
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
                  onClick={() => setDetailMember(item.member)}
                  className={`p-4 rounded-2xl border transition-all space-y-2.5 cursor-pointer hover:shadow-md ${
                    isNeed
                      ? 'bg-sky-50/50 dark:bg-sky-950/20 border-sky-200/80 dark:border-sky-900/40 border-l-4 border-l-sky-500 hover:border-sky-400'
                      : 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/40 border-l-4 border-l-emerald-500 hover:border-emerald-400'
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
                      <h4 className="font-extrabold text-sm text-stone-900 dark:text-stone-100 mt-1">
                        {item.memberName}
                      </h4>
                      <p className="text-[11px] text-stone-500 font-medium">
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

                  <p className="text-xs text-stone-800 dark:text-stone-200 font-semibold leading-relaxed bg-white/80 dark:bg-stone-900/70 p-2.5 rounded-xl border border-stone-200/60 dark:border-stone-800">
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

                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center gap-0.5">
                      View Profile & Outreach ➔
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Direct-Action Profile Details Modal ───────────────────────────────── */}
      {detailMember && (
        <Modal
          isOpen={!!detailMember}
          onClose={() => setDetailMember(null)}
          title="Founder Profile & Synergy Intelligence"
          size="lg"
        >
          <div className="space-y-5 text-stone-900 dark:text-stone-100 text-xs">
            {/* Header Card in Modal */}
            <div className="flex items-start justify-between gap-4 p-4 bg-stone-50 dark:bg-stone-800/80 rounded-2xl border border-stone-200/80 dark:border-stone-700">
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getAvatarGradient(
                    detailMember.name
                  )} text-white font-black text-xl flex items-center justify-center shrink-0 shadow-md ring-2 ring-stone-200 dark:ring-stone-700`}
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

            {/* Needs & Offers Full Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 space-y-2">
                <h4 className="font-extrabold text-blue-900 dark:text-blue-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  🎯 Looking For / Needs:
                </h4>
                <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                  {detailMember.lookingFor ||
                    'Open to general business synergies and strategic connections.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 space-y-2">
                <h4 className="font-extrabold text-emerald-900 dark:text-emerald-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  💡 Can Help With / Offering:
                </h4>
                <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                  {detailMember.canHelp || 'Industry insights, advisory, and networking support.'}
                </p>
              </div>
            </div>

            {/* Links & Verified Resources */}
            {(() => {
              const dWebsites = getMemberWebsites(detailMember);
              const dLinkedInValid = isValidLinkedInUrl(detailMember.linkedin);
              const dLinkedInHref = dLinkedInValid
                ? formatLinkedInUrl(detailMember.linkedin)
                : null;
              const dWaUrl = buildWhatsAppUrl(detailMember.phone);

              return (
                <div className="p-3.5 bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-200 dark:border-stone-750 space-y-2">
                  <h4 className="font-bold text-[11px] uppercase tracking-wider text-stone-500">
                    Verified Links & Direct Actions
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

            {/* Action Bar */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between flex-wrap gap-2">
              <button
                onClick={(e) => {
                  downloadVCardFile(detailMember, isAdmin);
                  notify(`Saved ${detailMember.name}'s contact card (.vcf)`);
                }}
                className="btn-primary text-xs font-bold py-2"
              >
                <Download size={13} /> Save Contact (.vcf)
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditMember(detailMember);
                    setDetailMember(null);
                  }}
                  className="btn-secondary text-xs font-bold py-2"
                >
                  <Edit2 size={13} /> Edit Profile
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Bilateral Introduction Facilitation Hub Modal (Admin Only) ──────────────── */}
      {isAdmin && bilateralPairing && (
        <Modal
          isOpen={!!bilateralPairing}
          onClose={() => setBilateralPairing(null)}
          title="🤝 Facilitate Bilateral Introduction"
          size="md"
        >
          <div className="space-y-4 text-xs text-stone-900 dark:text-stone-100">
            {/* Pairing Header */}
            <div className="p-3.5 bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl flex items-center justify-between shadow-md">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300 block">
                  Bilateral Introduction
                </span>
                <h4 className="text-sm font-extrabold text-white mt-0.5">
                  {bilateralPairing.memberA.name} ⇄ {bilateralPairing.memberB.name}
                </h4>
              </div>
              <span className="text-xs font-mono font-black px-2.5 py-1 rounded-lg bg-white/20 text-white border border-white/20">
                ⚡ {bilateralPairing.score}% Synergy
              </span>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Pre-Generated Introduction Message:
              </label>
              <div className="flex bg-stone-100 dark:bg-stone-800 p-0.5 rounded-lg border border-stone-200 dark:border-stone-700">
                <button
                  onClick={() => setIntroLanguage('ar')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer ${
                    introLanguage === 'ar'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-300'
                  }`}
                >
                  🇪🇬 Arabic
                </button>
                <button
                  onClick={() => setIntroLanguage('en')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer ${
                    introLanguage === 'en'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-300'
                  }`}
                >
                  🇬🇧 English
                </button>
              </div>
            </div>

            {/* Editable Bilateral Message Box */}
            <div
              dir={introLanguage === 'ar' ? 'rtl' : 'ltr'}
              className="p-3.5 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 text-xs leading-relaxed font-medium text-stone-800 dark:text-stone-200 select-all whitespace-pre-line"
            >
              {generateBilateralMessage(bilateralPairing, introLanguage)}
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between gap-2 border-t border-stone-200 dark:border-stone-800">
              <button
                onClick={handleCopyBilateralMessage}
                className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer"
              >
                {copiedIntro ? (
                  <Check size={13} className="text-emerald-600" />
                ) : (
                  <Copy size={13} />
                )}
                <span>{copiedIntro ? 'Copied to Clipboard!' : 'Copy Introduction Text'}</span>
              </button>

              <button
                onClick={() => setBilateralPairing(null)}
                className="btn-primary text-xs py-2 px-4 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Member Modal */}
      {editMember && (
        <EditMemberModal
          member={editMember}
          isOpen={!!editMember}
          onClose={() => setEditMember(null)}
          onSaved={(updated) => {
            refreshMembers();
            setEditMember(null);
          }}
        />
      )}
    </div>
  );
}
