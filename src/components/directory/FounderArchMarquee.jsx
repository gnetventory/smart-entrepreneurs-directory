import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Target,
  Mail,
  X,
  ExternalLink,
  ChevronRight,
  Download,
  Linkedin,
  MessageCircle,
  Flame,
  ArrowDownRight,
  Filter,
  Star,
  CheckCircle2,
} from 'lucide-react';
import {
  getInitials,
  parseMemberName,
  downloadVCardFile,
  getMemberWebsites,
  isValidLinkedInUrl,
  formatLinkedInUrl,
  buildWhatsAppUrl,
  getAvatarGradient,
} from '../../utils/helpers';
import { STAGES, getCountryFlag } from '../../utils/constants';
import { useApp } from '../../contexts/AppContext';
import { isMemberBookmarked, toggleBookmarkId } from '../../utils/psychologyHelpers';
import { explainProfileStrength } from '../../utils/explainability';
import Modal from '../common/Modal';
import ScoreExplainerModal from '../common/ScoreExplainerModal';


// Extract concise Superpower headline
function extractSuperpower(member) {
  if (member.canHelp && member.canHelp.trim()) {
    const firstOffer = member.canHelp.split(/[,;\n•·]/)[0].trim();
    if (firstOffer.length > 2 && firstOffer.length < 40) return firstOffer;
  }
  if (member.role && member.role.trim()) {
    const roleClean = member.role.split(/[&—–-]/)[0].trim();
    if (roleClean.length < 35) return roleClean;
  }
  if (Array.isArray(member.tags) && member.tags.length > 0) {
    return `${member.tags[0]} Strategy`;
  }
  return 'Strategic Growth & Execution';
}

// Extract concise Immediate Roadblock headline
function extractRoadblock(member) {
  if (member.lookingFor && member.lookingFor.trim()) {
    const firstNeed = member.lookingFor.split(/[,;\n•·]/)[0].trim();
    if (firstNeed.length > 2 && firstNeed.length < 45) return firstNeed;
  }
  if (member.stage === 'starting') return 'Seeking Early Strategic Partners';
  if (member.stage === 'running') return 'Scaling Commercial Infrastructure';
  if (member.stage === 'growing') return 'Expanding Into New Export Markets';
  return 'Strategic Growth Partnerships';
}

function memberTextCorpus(m) {
  return [
    m.lookingFor || '',
    m.canHelp || '',
    m.business || '',
    m.role || '',
    (m.tags || []).join(' '),
    m.notes || '',
    (m.seeking || []).join(' '),
    (m.offering || []).join(' '),
  ]
    .join(' ')
    .toLowerCase();
}

// Comprehensive Semantic Matchers for LENS 1: ROADBLOCKS & NEEDS
const NEED_MATCHERS = {
  all: () => true,
  cofounder: (m) => {
    const text = (m.lookingFor || '' + (m.seeking || []).join(' ')).toLowerCase();
    const tags = (m.tags || []).join(' ').toLowerCase();
    return (
      text.includes('شريك') ||
      text.includes('شراكة') ||
      text.includes('تأسيس') ||
      text.includes('co-founder') ||
      text.includes('cofounder') ||
      text.includes('partner') ||
      tags.includes('cofounder')
    );
  },
  capital: (m) => {
    const text = (m.lookingFor || '' + (m.seeking || []).join(' ')).toLowerCase();
    const tags = (m.tags || []).join(' ').toLowerCase();
    return (
      text.includes('تمويل') ||
      text.includes('استثمار') ||
      text.includes('مستثمر') ||
      text.includes('جولة') ||
      text.includes('invest') ||
      text.includes('funding') ||
      text.includes('capital') ||
      text.includes('angel') ||
      text.includes('seed') ||
      tags.includes('funding') ||
      tags.includes('investment')
    );
  },
  export: (m) => {
    const text = memberTextCorpus(m);
    return (
      text.includes('تصدير') ||
      text.includes('شحن') ||
      text.includes('توسع') ||
      text.includes('جمارك') ||
      text.includes('الخليج') ||
      text.includes('السعودية') ||
      text.includes('الإمارات') ||
      text.includes('export') ||
      text.includes('logistics') ||
      text.includes('gulf') ||
      text.includes('ksa') ||
      text.includes('trade')
    );
  },
  b2b_sales: (m) => {
    const text = (m.lookingFor || '').toLowerCase();
    return (
      text.includes('عملاء') ||
      text.includes('توزيع') ||
      text.includes('موزع') ||
      text.includes('تسويق') ||
      text.includes('تعاقد') ||
      text.includes('b2b') ||
      text.includes('sales') ||
      text.includes('clients') ||
      text.includes('distribution')
    );
  },
  sos: (m) => {
    const text = memberTextCorpus(m);
    return (
      text.includes('عاجل') ||
      text.includes('ضروري') ||
      text.includes('sos') ||
      text.includes('urgent') ||
      text.includes('blocker') ||
      text.includes('مساعدة') ||
      text.includes('48h')
    );
  },
};

// Comprehensive Semantic Matchers for LENS 2: SUPERPOWERS & SKILLS
const SUPERPOWER_MATCHERS = {
  all: () => true,
  growth: (m) => {
    const text = (m.canHelp || '' + m.role + (m.tags || []).join(' ')).toLowerCase();
    return (
      text.includes('تسويق') ||
      text.includes('محتوى') ||
      text.includes('إعلانات') ||
      text.includes('نمو') ||
      text.includes('marketing') ||
      text.includes('growth') ||
      text.includes('ads') ||
      text.includes('content') ||
      text.includes('seo') ||
      text.includes('branding')
    );
  },
  tech_ai: (m) => {
    const text = (m.canHelp || '' + m.role + (m.tags || []).join(' ')).toLowerCase();
    return (
      text.includes('برمجة') ||
      text.includes('تطوير') ||
      text.includes('ذكاء اصطناعي') ||
      text.includes('أتمتة') ||
      text.includes('tech') ||
      text.includes('ai') ||
      text.includes('software') ||
      text.includes('edtech') ||
      text.includes('data') ||
      text.includes('code') ||
      text.includes('app')
    );
  },
  commercial: (m) => {
    const text = (m.canHelp || '' + m.role + (m.tags || []).join(' ')).toLowerCase();
    return (
      text.includes('تطوير أعمال') ||
      text.includes('استشارات') ||
      text.includes('بنية تجارية') ||
      text.includes('business development') ||
      text.includes('consulting') ||
      text.includes('commercial') ||
      text.includes('strategy') ||
      text.includes('advisory') ||
      text.includes('sales')
    );
  },
  finance_legal: (m) => {
    const text = (m.canHelp || '' + m.role + (m.tags || []).join(' ')).toLowerCase();
    return (
      text.includes('محاسبة') ||
      text.includes('ضرائب') ||
      text.includes('قانون') ||
      text.includes('عقود') ||
      text.includes('تأسيس') ||
      text.includes('مالية') ||
      text.includes('accounting') ||
      text.includes('tax') ||
      text.includes('finance') ||
      text.includes('legal') ||
      text.includes('cfo') ||
      text.includes('audit')
    );
  },
  supply_ops: (m) => {
    const text = (m.canHelp || '' + m.role + (m.tags || []).join(' ')).toLowerCase();
    return (
      text.includes('تصنيع') ||
      text.includes('سلاسل إمداد') ||
      text.includes('عمليات') ||
      text.includes('تخزين') ||
      text.includes('شحن') ||
      text.includes('supply chain') ||
      text.includes('manufacturing') ||
      text.includes('operations') ||
      text.includes('logistics') ||
      text.includes('warehousing')
    );
  },
};

const LENS_CONFIG = {
  needs: {
    id: 'needs',
    title: 'Filter by Urgent Roadblock / Need',
    subtitle: 'Find founders you can help, partner with, or invest in',
    icon: Target,
    tags: [
      { id: 'all', label: 'All Active Needs', icon: '✨', matcher: NEED_MATCHERS.all },
      { id: 'cofounder', label: 'Seeking Co-Founders', icon: '🤝', matcher: NEED_MATCHERS.cofounder, searchKey: 'شريك' },
      { id: 'capital', label: 'Raising Capital', icon: '💸', matcher: NEED_MATCHERS.capital, searchKey: 'استثمار' },
      { id: 'export', label: 'Export & Expansion', icon: '🌍', matcher: NEED_MATCHERS.export, searchKey: 'تصدير' },
      { id: 'b2b_sales', label: 'B2B Distribution & Sales', icon: '📦', matcher: NEED_MATCHERS.b2b_sales, searchKey: 'توزيع' },
      { id: 'sos', label: 'Urgent 48h Asks', icon: '🚨', matcher: NEED_MATCHERS.sos, searchKey: 'urgent' },
    ],
  },
  superpowers: {
    id: 'superpowers',
    title: 'Filter by Superpower / Skill',
    subtitle: 'Find mentors, technical partners, and strategic service providers',
    icon: Zap,
    tags: [
      { id: 'all', label: 'All Superpowers', icon: '✨', matcher: SUPERPOWER_MATCHERS.all },
      { id: 'growth', label: 'Growth & Marketing', icon: '🚀', matcher: SUPERPOWER_MATCHERS.growth, searchKey: 'تسويق' },
      { id: 'tech_ai', label: 'Tech, AI & Software', icon: '💻', matcher: SUPERPOWER_MATCHERS.tech_ai, searchKey: 'tech' },
      { id: 'commercial', label: 'Sales & Commercial Infra', icon: '🏢', matcher: SUPERPOWER_MATCHERS.commercial, searchKey: 'استشارات' },
      { id: 'finance_legal', label: 'Tax, Finance & Legal', icon: '⚖️', matcher: SUPERPOWER_MATCHERS.finance_legal, searchKey: 'محاسبة' },
      { id: 'supply_ops', label: 'Operations & Supply Chain', icon: '🏭', matcher: SUPERPOWER_MATCHERS.supply_ops, searchKey: 'logistics' },
    ],
  },
};

const ARCH_PALETTES = [
  {
    heroBg: 'bg-gradient-to-b from-emerald-50 via-teal-50/70 to-white dark:from-stone-900 dark:via-emerald-950/30 dark:to-stone-900',
    lightBorder: 'border-emerald-400',
    darkBorder: 'dark:border-emerald-500',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    avatarRing: 'ring-emerald-400',
    superpowerBadge: 'bg-emerald-600 text-white',
    roadblockBox: 'bg-white/95 dark:bg-stone-850 border-emerald-200/90 dark:border-emerald-800/80',
  },
  {
    heroBg: 'bg-gradient-to-b from-amber-50 via-orange-50/70 to-white dark:from-stone-900 dark:via-amber-950/30 dark:to-stone-900',
    lightBorder: 'border-amber-400',
    darkBorder: 'dark:border-amber-500',
    glowColor: 'rgba(245, 158, 11, 0.45)',
    avatarRing: 'ring-amber-400',
    superpowerBadge: 'bg-amber-600 text-white',
    roadblockBox: 'bg-white/95 dark:bg-stone-850 border-amber-200/90 dark:border-amber-800/80',
  },
  {
    heroBg: 'bg-gradient-to-b from-sky-50 via-indigo-50/70 to-white dark:from-stone-900 dark:via-indigo-950/30 dark:to-stone-900',
    lightBorder: 'border-sky-400',
    darkBorder: 'dark:border-sky-500',
    glowColor: 'rgba(56, 189, 248, 0.45)',
    avatarRing: 'ring-sky-400',
    superpowerBadge: 'bg-sky-600 text-white',
    roadblockBox: 'bg-white/95 dark:bg-stone-850 border-sky-200/90 dark:border-sky-800/80',
  },
  {
    heroBg: 'bg-gradient-to-b from-rose-50 via-pink-50/70 to-white dark:from-stone-900 dark:via-rose-950/30 dark:to-stone-900',
    lightBorder: 'border-rose-400',
    darkBorder: 'dark:border-rose-500',
    glowColor: 'rgba(244, 63, 94, 0.45)',
    avatarRing: 'ring-rose-400',
    superpowerBadge: 'bg-rose-600 text-white',
    roadblockBox: 'bg-white/95 dark:bg-stone-850 border-rose-200/90 dark:border-rose-800/80',
  },
  {
    heroBg: 'bg-gradient-to-b from-purple-50 via-violet-50/70 to-white dark:from-stone-900 dark:via-purple-950/30 dark:to-stone-900',
    lightBorder: 'border-purple-400',
    darkBorder: 'dark:border-purple-500',
    glowColor: 'rgba(168, 85, 247, 0.45)',
    avatarRing: 'ring-purple-400',
    superpowerBadge: 'bg-purple-600 text-white',
    roadblockBox: 'bg-white/95 dark:bg-stone-850 border-purple-200/90 dark:border-purple-800/80',
  },
];

const WAVE_TIERS = ['h-[415px]', 'h-[385px] mt-4', 'h-[365px] mt-8'];

export default function FounderArchMarquee({ members = [] }) {
  const { setSearchQuery, notify } = useApp();
  const [activeLens, setActiveLens] = useState('needs'); // 'needs' | 'superpowers'
  const [activeTagId, setActiveTagId] = useState('all');
  const [selectedFounder, setSelectedFounder] = useState(null);
  const [showScoreExplainer, setShowScoreExplainer] = useState(false);
  const [modalBookmarked, setModalBookmarked] = useState(false);

  const currentLensConfig = LENS_CONFIG[activeLens];

  useEffect(() => {
    if (selectedFounder) {
      setModalBookmarked(isMemberBookmarked(selectedFounder.id));
    }
  }, [selectedFounder]);

  const handleToggleModalBookmark = () => {
    if (!selectedFounder) return;
    const isNow = toggleBookmarkId(selectedFounder.id);
    setModalBookmarked(isNow);
    notify(isNow ? `⭐ Saved ${selectedFounder.name} to Watchlist` : `Removed ${selectedFounder.name}`);
  };

  const handleModalDownloadVCard = () => {
    if (!selectedFounder) return;
    downloadVCardFile(selectedFounder, false);
    notify(`Saved ${selectedFounder.name}'s contact card (.vcf)`);
  };

  // Calculate live dynamic counts for every tag under current lens
  const tagCounts = useMemo(() => {
    const counts = {};
    if (!Array.isArray(members)) return counts;

    currentLensConfig.tags.forEach((tag) => {
      counts[tag.id] = members.filter((m) => tag.matcher(m)).length;
    });
    return counts;
  }, [members, currentLensConfig]);

  // Filter members for the marquee
  const filteredMembers = useMemo(() => {
    if (!Array.isArray(members) || members.length === 0) return [];
    const currentTag = currentLensConfig.tags.find((t) => t.id === activeTagId);
    if (!currentTag || currentTag.id === 'all') return members;
    return members.filter((m) => currentTag.matcher(m));
  }, [members, currentLensConfig, activeTagId]);

  const marqueeCards = useMemo(() => {
    if (filteredMembers.length === 0) return [];
    let list = [...filteredMembers];
    while (list.length < 16) {
      list = [...list, ...filteredMembers];
    }
    return list.slice(0, 24);
  }, [filteredMembers]);

  const handleCardClick = (member) => {
    setSelectedFounder(member);
  };

  const handleApplyToDirectory = (searchKey, label) => {
    if (searchKey) {
      setSearchQuery(searchKey);
      notify(`🔍 Applied "${label}" filter to Community Directory below`);
      const searchElem = document.querySelector('input[placeholder*="Search founders"]');
      if (searchElem) {
        searchElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        searchElem.focus();
      }
    }
  };

  if (!members || members.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden pt-6 pb-10 mb-8 rounded-3xl bg-gradient-to-b from-white/90 via-emerald-50/20 to-[#FAFAF7] dark:from-stone-900/90 dark:via-stone-950 dark:to-stone-950 border border-emerald-100/80 dark:border-stone-800 shadow-[0_4px_30px_rgba(16,185,129,0.05)]">
      
      {/* ── Ambient Background Glow & Network Lines ──── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-1/4 w-[500px] h-[300px] bg-gradient-to-tr from-amber-400/20 to-orange-400/15 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-[500px] h-[300px] bg-gradient-to-br from-emerald-400/20 to-teal-400/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[250px] bg-gradient-to-r from-purple-400/10 via-pink-400/10 to-amber-400/10 rounded-full blur-3xl" />
        
        <svg className="w-full h-full opacity-20 dark:opacity-25" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="warm-network-mesh" width="180" height="140" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="2" className="fill-amber-500/70" />
              <circle cx="110" cy="50" r="2.5" className="fill-emerald-500/80" />
              <circle cx="150" cy="110" r="2" className="fill-teal-500/70" />
              <circle cx="60" cy="120" r="2" className="fill-orange-500/70" />
              <path
                d="M30 30 C 70 40, 90 20, 110 50 S 140 80, 150 110 S 90 140, 60 120 Z"
                className="stroke-stone-400 dark:stroke-stone-600"
                strokeWidth="0.8"
                fill="none"
                strokeDasharray="4 4"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#warm-network-mesh)" />
        </svg>
      </div>

      {/* Top Value Banner & Dual-Lens Intent Engine */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6 relative z-10 space-y-4">
        
        {/* Header Row: Title & Dual-Lens Segment Selector */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-emerald-100/80 dark:border-stone-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-100/90 to-orange-100/90 dark:from-amber-950/70 dark:to-orange-950/70 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-bold mb-2 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
              <span>Smart Matchmaker Engine • Dual-Lens Community Intent</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
              Connect by Superpower & Immediate Roadblock
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-stone-300 mt-1 max-w-2xl leading-relaxed">
              {currentLensConfig.subtitle}. Hover to pause carousel • Click to connect directly.
            </p>
          </div>

          {/* Lens Selector Toggle */}
          <div className="flex items-center p-1.5 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md rounded-2xl border border-emerald-200/80 dark:border-stone-700 shadow-sm shrink-0 self-start lg:self-auto">
            <button
              onClick={() => {
                setActiveLens('needs');
                setActiveTagId('all');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeLens === 'needs'
                  ? 'bg-gradient-to-r from-rose-500 to-amber-600 text-white shadow-sm ring-1 ring-white/20'
                  : 'text-slate-600 dark:text-stone-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Target size={14} />
              <span>🎯 By Roadblock & Need</span>
            </button>

            <button
              onClick={() => {
                setActiveLens('superpowers');
                setActiveTagId('all');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeLens === 'superpowers'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm ring-1 ring-white/20'
                  : 'text-slate-600 dark:text-stone-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Zap size={14} />
              <span>⚡ By Superpower & Offer</span>
            </button>
          </div>
        </div>

        {/* Dynamic Tag Pills with Real Live Counts */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
              <Filter size={12} className="text-emerald-600" />
              {activeLens === 'needs' ? 'Needs:' : 'Skills:'}
            </span>

            {currentLensConfig.tags.map((tag) => {
              const count = tagCounts[tag.id] ?? 0;
              const isActive = activeTagId === tag.id;

              return (
                <button
                  key={tag.id}
                  onClick={() => setActiveTagId(tag.id)}
                  className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs ${
                    isActive
                      ? activeLens === 'needs'
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md ring-2 ring-amber-400'
                        : 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400'
                      : 'bg-white/90 dark:bg-stone-900/90 text-slate-700 dark:text-stone-300 border border-emerald-200/70 dark:border-stone-800 hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-stone-800'
                  }`}
                >
                  <span>{tag.icon}</span>
                  <span>{tag.label}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.2 rounded-full font-extrabold ${
                      isActive
                        ? 'bg-white/20 text-white dark:bg-black/20 dark:text-slate-900'
                        : 'bg-emerald-50 dark:bg-stone-800 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-stone-700'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick 1-Click Sync with Directory Below */}
          {activeTagId !== 'all' && (
            <button
              onClick={() => {
                const currentTag = currentLensConfig.tags.find((t) => t.id === activeTagId);
                if (currentTag?.searchKey) {
                  handleApplyToDirectory(currentTag.searchKey, currentTag.label);
                }
              }}
              className="text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-2xs cursor-pointer transition-all hover:scale-102"
              title="Apply this exact filter to the main directory grid below"
            >
              <span>Sync to Directory below</span>
              <ArrowDownRight size={13} />
            </button>
          )}
        </div>

      </div>

      {/* HORIZONTAL CONTINUOUS MARQUEE */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Soft edge blur gradients */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-[#FAFAF7] dark:from-stone-950 via-[#FAFAF7]/90 dark:via-stone-950/90 to-transparent z-20" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-[#FAFAF7] dark:from-stone-950 via-[#FAFAF7]/90 dark:via-stone-950/90 to-transparent z-20" />

        <div
          className="flex gap-6 w-max animate-marquee items-end pb-4 px-6"
          style={{
            animation: 'marqueeGlide 44s linear infinite',
          }}
        >
          {marqueeCards.map((member, index) => {
            const palette = ARCH_PALETTES[index % ARCH_PALETTES.length];
            const waveTier = WAVE_TIERS[index % WAVE_TIERS.length];
            const initials = getInitials(member.name);
            const gradient = getAvatarGradient(member.name);
            const { english, arabic, primary } = parseMemberName(member.name);
            const role = member.role || 'Founder';
            const superpower = extractSuperpower(member);
            const roadblock = extractRoadblock(member);
            const isCenterFocusTier = index % 3 === 0;

            return (
              <div
                key={`${member.id}-${index}`}
                onClick={() => handleCardClick(member)}
                className={`group cursor-pointer flex-shrink-0 w-[265px] sm:w-[280px] ${waveTier} flex flex-col justify-between p-5 pt-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-3 ${palette.heroBg} border-2 ${palette.lightBorder} ${palette.darkBorder} ${
                  isCenterFocusTier
                    ? 'shadow-[0_16px_40px_rgba(16,185,129,0.22)] ring-2 ring-emerald-400/40'
                    : 'shadow-[0_6px_24px_rgba(0,0,0,0.06)]'
                }`}
                style={{
                  borderTopLeftRadius: '140px',
                  borderTopRightRadius: '140px',
                  borderBottomLeftRadius: '28px',
                  borderBottomRightRadius: '28px',
                  transform: 'translateZ(0)',
                  willChange: 'transform',
                  backfaceVisibility: 'hidden',
                }}
              >
                {/* Ambient Glow */}
                <div
                  className="pointer-events-none absolute -inset-1 rounded-[inherit] opacity-70 group-hover:opacity-100 transition-opacity -z-10"
                  style={{
                    boxShadow: `0 14px 36px -4px ${palette.glowColor}`,
                  }}
                />

                {/* 1. TOP ZONE: High-Contrast Superpower Headline */}
                <div className="text-center relative z-10 flex flex-col items-center">
                  
                  {/* High-Contrast Superpower Top Badge */}
                  <div className={`w-full py-1.5 px-3 rounded-2xl shadow-xs flex items-center justify-center gap-1.5 mb-2.5 ${palette.superpowerBadge}`}>
                    <Zap className="w-3.5 h-3.5 fill-white shrink-0" />
                    <span className="text-[10.5px] font-extrabold uppercase tracking-wide truncate">
                      {superpower}
                    </span>
                  </div>

                  {/* Founder Name */}
                  <div className="w-full px-1">
                    {english ? (
                      <h4 className="font-extrabold text-[14px] sm:text-[15px] tracking-tight uppercase text-slate-900 dark:text-white font-display truncate leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {english}
                      </h4>
                    ) : (
                      <h4 className="font-extrabold text-[14px] sm:text-[15px] tracking-tight text-slate-900 dark:text-white font-display truncate leading-tight" dir="rtl">
                        {arabic || primary}
                      </h4>
                    )}

                    {/* Arabic Subtitle */}
                    {english && arabic && (
                      <p className="text-[11.5px] font-bold text-slate-800 dark:text-stone-200 truncate mt-0.5" dir="rtl">
                        {arabic}
                      </p>
                    )}

                    {/* Role / Venture */}
                    <p className="text-[11px] font-semibold text-slate-600 dark:text-stone-400 truncate mt-0.5">
                      {role}
                    </p>
                  </div>
                </div>

                {/* 2. CENTER ZONE: Stylized Founder Initials Avatar with Live Status Dot */}
                <div className="my-auto flex flex-col items-center justify-center relative z-10 py-1">
                  <div className="relative group-hover:scale-105 transition-transform duration-200">
                    <div className={`w-20 h-20 rounded-full p-1 bg-white dark:bg-stone-900 shadow-md ring-4 ${palette.avatarRing}`}>
                      <div className={`w-full h-full rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-black text-xl tracking-wider shadow-inner`}>
                        {initials}
                      </div>
                    </div>

                    {/* Verified Live Syndicate Status Dot */}
                    <span
                      className="absolute bottom-0 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-stone-900 shadow-sm"
                      title="Verified Active Founder"
                    />
                  </div>
                </div>

                {/* 3. BOTTOM ZONE: High-Contrast Immediate Roadblock Callout */}
                <div className={`rounded-2xl p-2.5 border shadow-xs relative z-10 group-hover:border-emerald-500 transition-colors ${palette.roadblockBox}`}>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1">
                      <span>🆘</span>
                      <span>ROADBLOCK:</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all" />
                  </div>
                  <p className="text-[11.5px] text-slate-900 dark:text-stone-100 font-bold leading-snug line-clamp-2" dir="auto">
                    {roadblock}
                  </p>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Keyframes for Continuous Marquee Gliding */}
      <style>{`
        @keyframes marqueeGlide {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-marquee {
          backface-visibility: hidden;
          perspective: 1000px;
        }
        .animate-marquee:hover {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* ── RICH VERIFIED MEMBER DETAIL MODAL (Matching Directory Profile Modal) ──── */}
      {selectedFounder && (
        <Modal
          isOpen={!!selectedFounder}
          onClose={() => setSelectedFounder(null)}
          title="Verified Member Profile & Synergy Details"
          size="lg"
        >
          {(() => {
            const member = selectedFounder;
            const { english, arabic, primary } = parseMemberName(member.name);
            const stage = STAGES[member.stage] || STAGES.idea;
            const initials = getInitials(member.name);
            const gradient = getAvatarGradient(member.name);
            const flag = getCountryFlag(member.location?.country);
            const websites = getMemberWebsites(member);
            const isLinkedInValid = isValidLinkedInUrl(member.linkedin);
            const linkedInHref = isLinkedInValid ? formatLinkedInUrl(member.linkedin) : null;
            const waUrl = buildWhatsAppUrl(member.phone);
            const profileStrength = explainProfileStrength(member);

            const locationLabel =
              typeof member.location === 'string'
                ? member.location
                : [member.location?.city || member.location?.district, member.location?.country]
                    .filter(Boolean)
                    .join(', ');

            return (
              <div className="space-y-5 text-stone-900 dark:text-stone-100 text-xs">
                {/* Header Card in Modal */}
                <div className="flex items-start justify-between gap-4 p-5 bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-white dark:from-stone-800 dark:to-stone-900 rounded-3xl border border-emerald-200/80 dark:border-stone-700 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} text-white font-black text-xl flex items-center justify-center shrink-0 shadow-md ring-2 ring-white dark:ring-stone-700`}
                    >
                      {initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        {english ? (
                          <h3 className="text-lg font-extrabold text-stone-950 dark:text-white">
                            {english}
                          </h3>
                        ) : (
                          <h3 className="text-lg font-extrabold text-stone-950 dark:text-white" dir="rtl">
                            {arabic || primary}
                          </h3>
                        )}
                        <button
                          onClick={handleToggleModalBookmark}
                          className={`p-1 rounded-md ${
                            modalBookmarked ? 'text-amber-500' : 'text-stone-300 hover:text-amber-500'
                          }`}
                          title={modalBookmarked ? 'Saved in Watchlist' : 'Save to Watchlist'}
                        >
                          <Star size={16} className={modalBookmarked ? 'fill-amber-500' : ''} />
                        </button>
                      </div>
                      {english && arabic && (
                        <p className="text-xs font-bold text-stone-700 dark:text-stone-300 mt-0.5" dir="rtl">
                          {arabic}
                        </p>
                      )}
                      <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                        {member.role || 'Member'}
                      </p>
                      {member.business && (
                        <p className="text-xs text-stone-600 dark:text-stone-300 font-semibold mt-0.5">
                          🏢 {member.business}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${stage.bg} ${stage.text} ${stage.border}`}
                    >
                      {stage.icon} {stage.label}
                    </span>
                    {locationLabel && (
                      <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">
                        {flag} {locationLabel}
                      </span>
                    )}
                  </div>
                </div>

                {/* Endowed Progress Profile Strength Ribbon */}
                <div className="p-4 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white rounded-2xl border border-stone-800 shadow-md space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{profileStrength.tier.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black tracking-wide block text-white">
                            {profileStrength.tier.name}
                          </span>
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.2 rounded-full border ${profileStrength.tier.color}`}
                          >
                            Tier {profileStrength.tier.level}
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400 font-medium">
                          Ecosystem Readiness & Discovery Tier
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setShowScoreExplainer(true)}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-300 border border-white/15 text-[10.5px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>📊 Why this score?</span>
                      </button>
                      <div className="text-right">
                        <span className="text-base font-mono font-black text-emerald-400 block leading-none">
                          {profileStrength.score}%
                        </span>
                        <span className="text-[9px] text-stone-400 uppercase tracking-wider font-bold">
                          Score
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Endowed Progress Bar */}
                  <div className="space-y-1">
                    <div className="h-2 rounded-full bg-stone-800 overflow-hidden border border-stone-700">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 via-teal-400 to-emerald-500 transition-all duration-700"
                        style={{ width: `${profileStrength.score}%` }}
                      />
                    </div>
                    <p className="text-[10.5px] text-stone-400 italic">
                      💡 {profileStrength.nextMilestoneTip}
                    </p>
                  </div>
                </div>

                {/* Bento Sub-Cards for Detail Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {member.lookingFor && (
                    <div className="p-3.5 bg-amber-50/80 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-900/50 space-y-1">
                      <span className="font-bold text-amber-900 dark:text-amber-300 text-xs uppercase tracking-wider block">
                        🎯 Looking For (Immediate Roadblock)
                      </span>
                      <p className="text-stone-800 dark:text-stone-200 text-xs leading-relaxed" dir="auto">
                        {member.lookingFor}
                      </p>
                    </div>
                  )}

                  {member.canHelp && (
                    <div className="p-3.5 bg-emerald-50/80 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 space-y-1">
                      <span className="font-bold text-emerald-900 dark:text-emerald-300 text-xs uppercase tracking-wider block">
                        💡 Can Help With (Core Superpower)
                      </span>
                      <p className="text-stone-800 dark:text-stone-200 text-xs leading-relaxed" dir="auto">
                        {member.canHelp}
                      </p>
                    </div>
                  )}
                </div>

                {/* Original Intake Submission Text */}
                {member.originalText && (
                  <div className="p-3.5 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-1">
                    <span className="font-bold text-stone-500 text-[11px] uppercase tracking-wider block">
                      📝 Original Community Bio
                    </span>
                    <p className="text-stone-700 dark:text-stone-300 text-xs whitespace-pre-wrap leading-relaxed" dir="auto">
                      {member.originalText}
                    </p>
                  </div>
                )}

                {/* Action buttons inside modal */}
                <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleModalDownloadVCard}
                      className="px-3 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-800 dark:text-stone-200 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Download size={14} />
                      <span>Save Contact Card (.vcf)</span>
                    </button>

                    {isLinkedInValid && (
                      <a
                        href={linkedInHref}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-colors"
                        title="LinkedIn"
                      >
                        <Linkedin size={15} />
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedFounder(null)}
                    className="px-4 py-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-xl font-bold text-xs hover:opacity-90 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}

      {/* Score Explainer Sub-Modal */}
      {showScoreExplainer && selectedFounder && (
        <ScoreExplainerModal
          isOpen={showScoreExplainer}
          onClose={() => setShowScoreExplainer(false)}
          member={selectedFounder}
        />
      )}

    </section>
  );
}
