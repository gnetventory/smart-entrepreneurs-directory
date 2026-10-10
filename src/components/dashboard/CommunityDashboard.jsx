import React, { useMemo, useState, useEffect } from 'react';
import {
  Users,
  Sparkles,
  ArrowRight,
  MapPin,
  Briefcase,
  Zap,
  Layers,
  Target,
  Flame,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Eye,
  Handshake,
  Download,
  Linkedin,
  TrendingUp,
  RefreshCw,
  Clock,
  Send,
  Calendar,
  CalendarPlus,
  Video,
  Building2,
  Navigation,
  Share2,
  Tag,
  UserCheck,
  AlertCircle,
  HelpCircle,
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
  downloadVCardFile,
  getMemberWebsites,
  parseMemberName,
} from '../../utils/helpers';
import {
  INITIAL_COMMUNITY_EVENTS,
  generateGoogleCalendarUrl,
  getSavedRsvps,
  toggleEventRsvp,
} from '../../utils/eventsData';
import Modal from '../common/Modal';

// High-resolution founder headshot portrait URLs
const FOUNDER_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=240&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=240&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=240&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=240&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=240&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=240&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=240&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=240&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=240&auto=format&fit=crop&q=80',
];

function getMemberHeadshot(member, index = 0) {
  const seed = (member?.id || member?.name || `${index}`)
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return FOUNDER_AVATARS[seed % FOUNDER_AVATARS.length];
}

export default function CommunityDashboard() {
  const { activeMembers: members, setActiveTab, setSearchQuery, notify } = useApp();
  
  // Events filter & RSVP state
  const [eventFilter, setEventFilter] = useState('all'); // 'all' | 'offline' | 'online'
  const [userRsvps, setUserRsvps] = useState([]);
  const [eventsList] = useState(INITIAL_COMMUNITY_EVENTS);

  // Interactive Modals State
  const [detailMember, setDetailMember] = useState(null);
  const [bilateralPairing, setBilateralPairing] = useState(null);
  const [introLanguage, setIntroLanguage] = useState('ar');
  const [copiedIntro, setCopiedIntro] = useState(false);

  const isAdmin = isAdminSession();
  const analytics = useMemo(() => computeExecutiveAnalytics(members), [members]);

  // Load saved RSVPs on mount
  useEffect(() => {
    setUserRsvps(getSavedRsvps());
  }, []);

  const handleToggleRsvp = (eventId, eventTitle) => {
    const isNowRsvped = toggleEventRsvp(eventId);
    setUserRsvps(getSavedRsvps());
    if (isNowRsvped) {
      notify(`🎉 You are attending "${eventTitle}"!`);
    } else {
      notify(`RSVP cancelled for "${eventTitle}"`);
    }
  };

  // Next spotlight gathering
  const spotlightEvent = useMemo(() => {
    return eventsList.find((e) => e.featured) || eventsList[0];
  }, [eventsList]);

  // Filtered list of upcoming events
  const filteredEvents = useMemo(() => {
    if (eventFilter === 'offline') {
      return eventsList.filter((e) => e.format === 'offline');
    }
    if (eventFilter === 'online') {
      return eventsList.filter((e) => e.format === 'online');
    }
    return eventsList;
  }, [eventsList, eventFilter]);

  const inPersonCount = useMemo(() => eventsList.filter((e) => e.format === 'offline').length, [eventsList]);
  const onlineCount = useMemo(() => eventsList.filter((e) => e.format === 'online').length, [eventsList]);

  const handleOpenBilateralModal = (pairing) => {
    setBilateralPairing(pairing);
    setCopiedIntro(false);
  };

  const generateBilateralMessage = (pair, lang = 'ar') => {
    if (!pair) return '';
    const nameA = pair.memberA.name.split(' ')[0];
    const nameB = pair.memberB.name.split(' ')[0];
    const bizA = pair.memberA.business || pair.memberA.role;
    const bizB = pair.memberB.business || pair.memberB.role;

    if (lang === 'ar') {
      return `السلام عليكم أستاذ ${nameA} وأستاذ ${nameB}، تحياتي لكما من مجتمع رواد الأعمال Smart Directory.\n\nيسعدني تعريفكما ببعض لوجود فرص تعاون وتكامل واعدة بين مشروع ${bizA} ومشروع ${bizB}.\n\nأترك لكما المجال للتواصل وبحث الشراكة والتعاون المشترك. بالتوفيق والنجاح الدائم!`;
    }

    return `Hello ${nameA} and ${nameB}, warm greetings from the Smart Directory community!\n\nI wanted to connect you both seeing potential synergies and collaboration opportunities between ${bizA} and ${bizB}.\n\nConnecting you here to explore partnerships and mutual support. Wishing you both continued success!`;
  };

  const handleCopyBilateralMessage = () => {
    const text = generateBilateralMessage(bilateralPairing, introLanguage);
    navigator.clipboard.writeText(text);
    setCopiedIntro(true);
    notify('📋 Intro text copied to clipboard!');
    setTimeout(() => setCopiedIntro(false), 2000);
  };

  // Stage progress bar percentages calculation
  const stageStats = useMemo(() => {
    const counts = analytics.stageCounts || { idea: 0, starting: 0, running: 0, growing: 0 };
    const total = Math.max(1, analytics.total);
    return {
      ideaPct: Math.round((counts.idea / total) * 100),
      startingPct: Math.round((counts.starting / total) * 100),
      runningPct: Math.round((counts.running / total) * 100),
      growingPct: Math.round((counts.growing / total) * 100),
      counts,
    };
  }, [analytics]);

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12">
      
      {/* ── 1. COMMUNITY SNAPSHOT HEADER BANNER ──── */}
      <div className="rounded-3xl p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white border border-slate-700/80 shadow-xl relative overflow-hidden">
        {/* Subtle Ambient Background Mesh */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/15 via-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-emerald-400 text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Community Snapshot • Curated by BGM</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
              Who Needs What & Gaps We Can Fill Together
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              A transparent, peer-driven snapshot of member ventures, current requests, capability shortages, and upcoming gatherings.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('directory')}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer hover:scale-102"
            >
              <Users size={15} />
              <span>Browse All Members</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. GROUNDED COMMUNITY KPI RIBBON ──── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Community Members */}
        <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-slate-200/90 dark:border-stone-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-stone-400">
              Community Members
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <Users size={16} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl font-black text-slate-900 dark:text-white font-display">
                {analytics.total}
              </span>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                +{analytics.monthlyVelocity} recent joins
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-stone-400 font-medium mt-1">
              Founders across Egypt & regional hubs
            </p>
          </div>
        </div>

        {/* KPI 2: Reciprocal Fit Rate */}
        <div className="relative p-5 rounded-3xl bg-white dark:bg-stone-900 border border-amber-200/90 dark:border-stone-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3 overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-bold text-slate-500 dark:text-stone-400">
              Reciprocal Fit Rate
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              <Sparkles size={16} />
            </div>
          </div>
          <div className="relative z-10">
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl font-black text-amber-600 dark:text-amber-400 font-display">
                {analytics.synergyIndex}%
              </span>
              <span className="text-[11px] font-bold text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-300 dark:border-amber-800">
                Complementary Needs
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-stone-400 font-medium mt-1">
              Members with reciprocal needs & offers
            </p>
          </div>
        </div>

        {/* KPI 3: Active Requests & Skills */}
        <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-slate-200/90 dark:border-stone-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-stone-400">
              Active Needs & Skills
            </span>
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800">
              <Target size={16} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-sky-600 dark:text-sky-400 font-display">
                {analytics.activeAsksCount}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-stone-400">
                needs ↔ <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{analytics.activeOffersCount}</strong> offers
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-stone-400 font-medium mt-1">
              Specific requests listed by members
            </p>
          </div>
        </div>

        {/* KPI 4: Stage Composition */}
        <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-slate-200/90 dark:border-stone-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-stone-400">
              Venture Stage Breakdown
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              <Layers size={16} />
            </div>
          </div>

          <div>
            <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-stone-800 flex overflow-hidden border border-slate-200 dark:border-stone-700 shadow-2xs mb-2">
              <div
                className="bg-blue-500 h-full transition-all duration-500"
                style={{ width: `${stageStats.ideaPct}%` }}
                title={`Idea: ${stageStats.counts.idea} (${stageStats.ideaPct}%)`}
              />
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${stageStats.startingPct}%` }}
                title={`Starting: ${stageStats.counts.starting} (${stageStats.startingPct}%)`}
              />
              <div
                className="bg-amber-500 h-full transition-all duration-500"
                style={{ width: `${stageStats.runningPct}%` }}
                title={`Running: ${stageStats.counts.running} (${stageStats.runningPct}%)`}
              />
              <div
                className="bg-purple-600 h-full transition-all duration-500"
                style={{ width: `${stageStats.growingPct}%` }}
                title={`Scaling: ${stageStats.counts.growing} (${stageStats.growingPct}%)`}
              />
            </div>

            <div className="grid grid-cols-4 gap-1 text-[11px] font-semibold text-center">
              <span className="text-blue-700 dark:text-blue-400">Idea {stageStats.counts.idea}</span>
              <span className="text-emerald-700 dark:text-emerald-400">Start {stageStats.counts.starting}</span>
              <span className="text-amber-700 dark:text-amber-400">Run {stageStats.counts.running}</span>
              <span className="text-purple-700 dark:text-purple-400">Scale {stageStats.counts.growing}</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── 3. TODAY'S CURATED PAIRINGS (Admin Only) ───── */}
      {isAdmin && analytics.curatedPairings.length > 0 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-slate-200/90 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 dark:border-stone-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-bold text-xs shadow-md shadow-amber-500/20">
                <Handshake size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Curated Intro Suggestions (Admin)
                </h3>
                <p className="text-xs text-slate-500 dark:text-stone-400 font-medium">
                  High-reciprocity pairings where one member directly needs what another offers.
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-xl border border-emerald-300 dark:border-emerald-800">
              ⚡ 3 Suggestions Ready
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {analytics.curatedPairings.map((pairing, idx) => (
              <div
                key={pairing.id}
                className="p-5 rounded-3xl border border-slate-200/90 dark:border-stone-800 bg-[#FAFAF7] dark:bg-stone-850 hover:border-amber-400/80 transition-all flex flex-col justify-between space-y-4 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    {pairing.score}% Match
                  </span>
                  <span className="text-xs text-slate-500 dark:text-stone-400 font-medium">
                    Mutual Fit
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 items-center">
                  <div
                    onClick={() => setDetailMember(pairing.memberA)}
                    className="p-3 rounded-2xl bg-white dark:bg-stone-900 border border-slate-200 dark:border-stone-750 cursor-pointer hover:border-emerald-500 transition-all flex flex-col items-center text-center space-y-1.5"
                  >
                    <img
                      src={getMemberHeadshot(pairing.memberA, idx)}
                      alt={pairing.memberA.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-400 shadow-xs"
                    />
                    <div className="font-extrabold text-xs text-slate-900 dark:text-white truncate w-full">
                      {pairing.memberA.name}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate w-full">
                      {pairing.memberA.business || pairing.memberA.role}
                    </div>
                  </div>

                  <div
                    onClick={() => setDetailMember(pairing.memberB)}
                    className="p-3 rounded-2xl bg-white dark:bg-stone-900 border border-slate-200 dark:border-stone-750 cursor-pointer hover:border-emerald-500 transition-all flex flex-col items-center text-center space-y-1.5"
                  >
                    <img
                      src={getMemberHeadshot(pairing.memberB, idx + 1)}
                      alt={pairing.memberB.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-amber-400 shadow-xs"
                    />
                    <div className="font-extrabold text-xs text-slate-900 dark:text-white truncate w-full">
                      {pairing.memberB.name}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate w-full">
                      {pairing.memberB.business || pairing.memberB.role}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/50 text-xs text-emerald-950 dark:text-emerald-100 leading-snug font-medium">
                  💡 {pairing.rationale}
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-slate-200 dark:border-stone-800">
                  <button
                    onClick={() => handleOpenBilateralModal(pairing)}
                    className="flex-1 py-2 px-3 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-slate-900 flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
                  >
                    <Handshake size={14} />
                    <span>Copy Intro Message</span>
                  </button>
                  <button
                    onClick={() => setDetailMember(pairing.memberA)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-stone-800 text-slate-700 dark:text-stone-300 hover:bg-slate-200 transition cursor-pointer"
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

      {/* ── 4. WHO NEEDS WHAT & GAPS WE CAN FILL TOGETHER ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Supply vs Demand Breakdown */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-stone-900 border border-slate-200/90 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 dark:border-stone-800 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 font-display">
                <Flame size={18} className="text-orange-500" />
                Who Needs What: Community Supply & Demand
              </h3>
              <p className="text-xs text-slate-500 dark:text-stone-400 font-medium">
                Comparing what members are asking for (Left) vs what members offer (Right).
              </p>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-stone-800 text-slate-600 dark:text-stone-300 font-bold">
              {analytics.matrix.length} Areas
            </span>
          </div>

          <div className="space-y-3.5 pt-1">
            {analytics.matrix.map((row) => {
              const isDeficit = row.gap > 0;
              const isSurplus = row.gap < 0;

              return (
                <div key={row.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{row.icon}</span>
                      <span>{row.label}</span>
                    </span>

                    <div>
                      {isDeficit ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FEF2F2] dark:bg-rose-950/50 text-[#991B1B] dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                          Need: {row.demand} vs Offer: {row.supply} (Shortage: {row.gap})
                        </span>
                      ) : isSurplus ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#ECFDF5] dark:bg-emerald-950/50 text-[#065F46] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                          Surplus capacity (+{Math.abs(row.gap)})
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-slate-400">Balanced</span>
                      )}
                    </div>
                  </div>

                  {/* Diverging Bar Container */}
                  <div className="grid grid-cols-2 gap-2 items-center bg-slate-50 dark:bg-stone-850 p-2 rounded-2xl border border-slate-100 dark:border-stone-800">
                    {/* Left: Demand */}
                    <div className="flex items-center justify-end gap-2 pr-1 border-r border-slate-300 dark:border-stone-700">
                      <span className="text-xs font-bold text-sky-700 dark:text-sky-400">
                        {row.demand} seeking ({row.demandPct}%)
                      </span>
                      <div className="w-24 sm:w-32 h-2.5 bg-slate-200 dark:bg-stone-800 rounded-full overflow-hidden flex justify-end">
                        <div
                          className="h-full bg-sky-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, row.demandPct * 1.6)}%` }}
                        />
                      </div>
                    </div>

                    {/* Right: Supply */}
                    <div className="flex items-center justify-start gap-2 pl-1">
                      <div className="w-24 sm:w-32 h-2.5 bg-slate-200 dark:bg-stone-800 rounded-full overflow-hidden flex justify-start">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, row.supplyPct * 1.6)}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        {row.supply} offering ({row.supplyPct}%)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Gaps We Can Fill Together & Next Gathering */}
        <div className="space-y-4">
          
          {/* Card A: Gaps We Can Fill Together */}
          <div className="p-5 rounded-3xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/90 dark:border-amber-900/40 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold shadow-xs">
                <AlertCircle size={15} />
              </span>
              <div>
                <h4 className="text-sm font-extrabold text-amber-950 dark:text-amber-200">
                  Gaps We Can Fill Together
                </h4>
                <p className="text-[11px] text-amber-800/80 dark:text-amber-300">
                  Areas where our members have the biggest unmet needs:
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div className="p-2.5 rounded-xl bg-white/90 dark:bg-stone-850 border border-amber-200/70 dark:border-stone-800 flex items-start gap-2">
                <span className="text-base">🤝</span>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    B2B Distribution & Deals (Shortage: 25)
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-stone-400">
                    38 founders looking for commercial channels & B2B pilot partners.
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/90 dark:bg-stone-850 border border-amber-200/70 dark:border-stone-800 flex items-start gap-2">
                <span className="text-base">💰</span>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    Funding & Angel Investors (Shortage: 16)
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-stone-400">
                    31 founders seeking pre-seed & seed angel investors.
                  </p>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/90 dark:bg-stone-850 border border-amber-200/70 dark:border-stone-800 flex items-start gap-2">
                <span className="text-base">💻</span>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    Tech & Co-Founders (Shortage: 9)
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-stone-400">
                    28 founders seeking software architects, CTOs & technical talent.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-amber-900/90 dark:text-amber-300 font-medium bg-amber-100/60 dark:bg-amber-900/30 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800">
              💡 <em>Have connections or expertise in these areas? Share your knowledge with fellow community members.</em>
            </div>
          </div>

          {/* Card B: Next Spotlight Gathering */}
          {spotlightEvent && (
            <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-slate-200/90 dark:border-stone-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-stone-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold">
                    <Calendar size={13} />
                  </span>
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                    Next Community Gathering
                  </span>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  spotlightEvent.format === 'offline'
                    ? 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950 dark:text-orange-300'
                    : 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950 dark:text-sky-300'
                }`}>
                  {spotlightEvent.format === 'offline' ? '🏛️ In-Person' : '🌐 Virtual'}
                </span>
              </div>

              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-slate-950 dark:text-white leading-snug">
                  {spotlightEvent.title}
                </h4>
                <div className="text-xs text-slate-500 dark:text-stone-400 font-medium mt-1 flex items-center gap-1.5">
                  <Clock size={12} className="text-amber-500 shrink-0" />
                  <span>{spotlightEvent.displayDate} • {spotlightEvent.time}</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-stone-400 font-medium mt-0.5 flex items-center gap-1.5">
                  <MapPin size={12} className="text-emerald-500 shrink-0" />
                  <span className="truncate">{spotlightEvent.location}</span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-stone-800">
                <a
                  href={generateGoogleCalendarUrl(spotlightEvent)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <CalendarPlus size={13} />
                  <span>Add to Cal</span>
                </a>

                <button
                  onClick={() => handleToggleRsvp(spotlightEvent.id, spotlightEvent.title)}
                  className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                    userRsvps.includes(spotlightEvent.id)
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                      : 'bg-white dark:bg-stone-800 text-slate-700 dark:text-stone-300 border-slate-200 dark:border-stone-700 hover:border-emerald-400'
                  }`}
                >
                  <UserCheck size={13} className={userRsvps.includes(spotlightEvent.id) ? 'text-emerald-600' : ''} />
                  <span>{userRsvps.includes(spotlightEvent.id) ? 'Attending' : 'RSVP'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ── 5. REGIONAL HUBS & INDUSTRY SECTORS ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Regional Hubs */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-slate-200/90 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-stone-800 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 font-display">
              <MapPin size={17} className="text-orange-500" />
              Regional Corridors & Hubs
            </h3>
            <button
              onClick={() => setActiveTab('map')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Open Atlas <ArrowRight size={12} />
            </button>
          </div>

          <div className="space-y-3">
            {analytics.topDistricts.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-800 dark:text-stone-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {item.name}
                  </span>
                  <span className="text-slate-500 dark:text-stone-400">
                    {item.count} founders ({item.pct}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Industry Domains */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-slate-200/90 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-stone-800 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 font-display">
              <Briefcase size={17} className="text-orange-500" />
              Industry Sectors & Verticals
            </h3>
            <span className="text-xs text-slate-400 font-bold">
              {analytics.topIndustries.length} Sectors
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {analytics.topIndustries.map((ind, idx) => (
              <button
                key={ind.name}
                onClick={() => {
                  setSearchQuery(ind.name);
                  setActiveTab('directory');
                }}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-2xs hover:scale-102 ${
                  idx === 0
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
                    : 'bg-white dark:bg-stone-800 text-slate-700 dark:text-stone-300 border-slate-200 dark:border-stone-700 hover:border-emerald-400'
                }`}
              >
                <span>{ind.name}</span>
                <span className="px-1.5 py-0.2 rounded-md bg-slate-200/80 dark:bg-stone-700 font-mono text-[10px]">
                  {ind.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 6. UPCOMING COMMUNITY EVENTS & GATHERINGS HUB ───────────────── */}
      <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-slate-200/90 dark:border-stone-800 shadow-sm space-y-5">
        
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-100 dark:border-stone-800 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 font-display">
              <Calendar size={18} className="text-emerald-600" />
              Upcoming Community Gatherings & Masterminds
            </h3>
            <p className="text-xs text-slate-500 dark:text-stone-400 font-medium mt-0.5">
              In-person founder breakfasts, angel mixers, and virtual learning sessions for Smart Directory members.
            </p>
          </div>

          {/* Event Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-stone-800 p-1 rounded-2xl border border-slate-200 dark:border-stone-700">
            <button
              onClick={() => setEventFilter('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                eventFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-stone-300 hover:text-slate-900'
              }`}
            >
              All Gatherings ({eventsList.length})
            </button>
            <button
              onClick={() => setEventFilter('offline')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                eventFilter === 'offline'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-stone-300 hover:text-orange-600'
              }`}
            >
              🏛️ In-Person ({inPersonCount})
            </button>
            <button
              onClick={() => setEventFilter('online')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                eventFilter === 'online'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-stone-300 hover:text-sky-600'
              }`}
            >
              🌐 Virtual ({onlineCount})
            </button>
          </div>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredEvents.map((evt) => {
            const isRsvped = userRsvps.includes(evt.id);
            const isOffline = evt.format === 'offline';

            return (
              <div
                key={evt.id}
                className="p-5 rounded-3xl border border-slate-200/90 dark:border-stone-800 bg-gradient-to-b from-white to-slate-50/50 dark:from-stone-850 dark:to-stone-900 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all space-y-4 shadow-xs hover:shadow-lg group flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        isOffline
                          ? 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800'
                          : 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800'
                      }`}
                    >
                      {isOffline ? '🏛️ In-Person Gathering' : '🌐 Virtual Masterclass'}
                    </span>

                    <span className="text-xs font-bold text-slate-500 dark:text-stone-400 bg-slate-100 dark:bg-stone-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-stone-700">
                      {evt.category}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors leading-snug">
                      {evt.title}
                    </h4>
                    {evt.titleAr && (
                      <p className="text-xs text-slate-600 dark:text-stone-400 font-bold mt-0.5" dir="rtl">
                        {evt.titleAr}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-stone-800/60 p-3 rounded-2xl border border-slate-100 dark:border-stone-750">
                    <div className="flex items-center gap-2 text-slate-800 dark:text-stone-200 font-bold">
                      <Clock size={14} className="text-amber-500 shrink-0" />
                      <span>{evt.displayDate}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 dark:text-stone-400 font-medium">
                      {isOffline ? (
                        <MapPin size={14} className="text-emerald-500 shrink-0" />
                      ) : (
                        <Video size={14} className="text-sky-500 shrink-0" />
                      )}
                      <span className="truncate">{evt.location}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-stone-300 leading-relaxed font-medium">
                    {evt.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {evt.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-stone-800 text-slate-700 dark:text-stone-300 border border-slate-200 dark:border-stone-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-stone-800 text-xs">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={evt.hostAvatar}
                        alt={evt.hostName}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-400"
                      />
                      <div>
                        <div className="font-extrabold text-xs text-slate-900 dark:text-white">
                          {evt.hostName}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-stone-400">
                          {evt.hostRole}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-700 dark:text-stone-300">
                        {evt.attendeesCount} / {evt.capacity} Attending
                      </span>
                      <div className="w-20 h-1.5 bg-slate-200 dark:bg-stone-750 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${Math.min(100, (evt.attendeesCount / evt.capacity) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Actions Toolbar */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-stone-800 text-xs">
                  <a
                    href={generateGoogleCalendarUrl(evt)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                    title="Add event to Google Calendar"
                  >
                    <CalendarPlus size={13} />
                    <span>Add to Google Cal</span>
                  </a>

                  <button
                    onClick={() => handleToggleRsvp(evt.id, evt.title)}
                    className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                      isRsvped
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 shadow-xs'
                        : 'bg-white dark:bg-stone-800 text-slate-700 dark:text-stone-300 border-slate-200 dark:border-stone-700 hover:border-emerald-400'
                    }`}
                  >
                    <UserCheck size={13} className={isRsvped ? 'text-emerald-600' : ''} />
                    <span>{isRsvped ? '✓ Attending' : 'RSVP: Attending'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* ── 7. BILATERAL INTRO MODAL (Admin) ─────────────── */}
      {bilateralPairing && (
        <Modal
          isOpen={!!bilateralPairing}
          onClose={() => setBilateralPairing(null)}
          title="Curated Member Introduction"
          size="md"
        >
          <div className="space-y-4 text-xs text-slate-900 dark:text-white">
            <div className="flex items-center justify-between p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800">
              <div className="font-extrabold text-emerald-900 dark:text-emerald-200">
                Mutual Complementarity: {bilateralPairing.score || 90}%
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIntroLanguage('ar')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    introLanguage === 'ar' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white text-slate-700'
                  }`}
                >
                  العربية
                </button>
                <button
                  onClick={() => setIntroLanguage('en')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    introLanguage === 'en' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white text-slate-700'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-stone-850 rounded-2xl border border-slate-200 dark:border-stone-700 font-mono text-[11.5px] leading-relaxed whitespace-pre-wrap">
              {generateBilateralMessage(bilateralPairing, introLanguage)}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={handleCopyBilateralMessage}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                {copiedIntro ? <Check size={14} className="text-white" /> : <Copy size={14} />}
                <span>{copiedIntro ? 'Copied!' : 'Copy Intro Text'}</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── 8. MEMBER DETAIL MODAL ─────────────────────────────── */}
      {detailMember && (
        <Modal
          isOpen={!!detailMember}
          onClose={() => setDetailMember(null)}
          title="Community Member Profile"
          size="lg"
        >
          {(() => {
            const member = detailMember;
            const { english, arabic, primary } = parseMemberName(member.name);
            const stage = STAGES[member.stage] || STAGES.idea;
            const initials = getInitials(member.name);
            const gradient = getAvatarGradient(member.name);
            const flag = getCountryFlag(member.location?.country);
            const websites = getMemberWebsites(member);
            const isLinkedInValid = isValidLinkedInUrl(member.linkedin);
            const linkedInHref = isLinkedInValid ? formatLinkedInUrl(member.linkedin) : null;

            return (
              <div className="space-y-5 text-slate-900 dark:text-stone-100 text-xs">
                <div className="flex items-start justify-between gap-4 p-5 bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-white dark:from-stone-800 dark:to-stone-900 rounded-3xl border border-emerald-200/80 dark:border-stone-700 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} text-white font-black text-xl flex items-center justify-center shrink-0 shadow-md ring-2 ring-white dark:ring-stone-700`}
                    >
                      {initials}
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-950 dark:text-white">
                        {english || arabic || primary}
                      </h3>
                      {english && arabic && (
                        <p className="text-xs font-bold text-slate-700 dark:text-stone-300 mt-0.5" dir="rtl">
                          {arabic}
                        </p>
                      )}
                      <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                        {member.role || 'Member'}
                      </p>
                      {member.business && member.business !== member.role && (
                        <p className="text-xs text-slate-600 dark:text-stone-300 font-semibold mt-0.5">
                          🏢 {member.business}
                        </p>
                      )}
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${stage.bg} ${stage.text} ${stage.border}`}
                  >
                    {stage.icon} {stage.label}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {member.lookingFor && (
                    <div className="p-4 bg-amber-50/80 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900/50 space-y-1">
                      <span className="font-bold text-amber-900 dark:text-amber-300 text-xs uppercase tracking-wider block">
                        🎯 Looking For (Need)
                      </span>
                      <p className="text-slate-800 dark:text-stone-200 text-xs leading-relaxed" dir="auto">
                        {member.lookingFor}
                      </p>
                    </div>
                  )}

                  {member.canHelp && (
                    <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 space-y-1">
                      <span className="font-bold text-emerald-900 dark:text-emerald-300 text-xs uppercase tracking-wider block">
                        💡 Can Help With (Skill / Offer)
                      </span>
                      <p className="text-slate-800 dark:text-stone-200 text-xs leading-relaxed" dir="auto">
                        {member.canHelp}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        downloadVCardFile(member, false);
                        notify(`Saved ${member.name}'s contact card`);
                      }}
                      className="px-3.5 py-2 bg-slate-100 dark:bg-stone-800 hover:bg-slate-200 text-slate-800 dark:text-stone-200 rounded-xl font-bold text-xs flex items-center gap-1.5 transition"
                    >
                      <Download size={14} />
                      <span>Save Contact (.vcf)</span>
                    </button>

                    {isLinkedInValid && (
                      <a
                        href={linkedInHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-600 hover:text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition border border-blue-200 dark:border-blue-800"
                      >
                        <Linkedin size={14} />
                        <span>LinkedIn</span>
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => setDetailMember(null)}
                    className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-xs hover:opacity-90 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}

    </div>
  );
}
