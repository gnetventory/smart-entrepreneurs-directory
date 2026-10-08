import React, { useState, useEffect } from 'react';
import {
  Trash2,
  Edit2,
  MapPin,
  Linkedin,
  CheckCircle2,
  Download,
  Mail,
  ExternalLink,
  MessageCircle,
  Sparkles,
  FileText,
  Tag,
  Phone,
  Star,
  Copy,
  Check,
  Award,
} from 'lucide-react';
import {
  getInitials,
  getAvatarGradient,
  isValidLinkedInUrl,
  formatLinkedInUrl,
  getLinkedInHandle,
  buildWhatsAppUrl,
  downloadVCardFile,
  getMemberWebsites,
} from '../../utils/helpers';
import { STAGES, getCountryFlag } from '../../utils/constants';
import { deleteMember } from '../../utils/storage';
import { pushMemberDeleteToSheets } from '../../utils/sheetsSync';
import { useApp } from '../../contexts/AppContext';
import { isAdminSession } from '../../utils/session';
import {
  calculateProfileStrength,
  isMemberBookmarked,
  toggleBookmarkId,
  generateWhatsAppWarmIntro,
} from '../../utils/psychologyHelpers';
import { explainProfileStrength } from '../../utils/explainability';
import Modal from '../common/Modal';
import EditMemberModal from '../parser/EditMemberModal';
import ScoreExplainerModal from '../common/ScoreExplainerModal';

export default function ProfileCard({ member, onDeleted, onUpdated, synergyScore = null }) {
  const { notify } = useApp();
  const [showDetail, setShowDetail] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showScoreExplainer, setShowScoreExplainer] = useState(false);

  // Admin-only WhatsApp Intro Hub state
  const [showAdminWAHub, setShowAdminWAHub] = useState(false);
  const [waLanguage, setWaLanguage] = useState('ar');
  const [copiedIntro, setCopiedIntro] = useState(false);

  const isAdmin = isAdminSession();
  const stage = STAGES[member.stage] || STAGES.idea;
  const initials = getInitials(member.name);
  const gradient = getAvatarGradient(member.name);
  const flag = getCountryFlag(member.location?.country);
  const websites = getMemberWebsites(member);

  const isLinkedInValid = isValidLinkedInUrl(member.linkedin);
  const linkedInHref = isLinkedInValid ? formatLinkedInUrl(member.linkedin) : null;
  const waUrl = buildWhatsAppUrl(member.phone);

  // Calculate Endowed Progress Profile Strength & Gamification Badges
  const profileStrength = explainProfileStrength(member);

  useEffect(() => {
    setBookmarked(isMemberBookmarked(member.id));
  }, [member.id]);

  const handleToggleBookmark = (e) => {
    e.stopPropagation();
    const isNowBookmarked = toggleBookmarkId(member.id);
    setBookmarked(isNowBookmarked);
    notify(
      isNowBookmarked
        ? `⭐ Added ${member.name} to your Saved Watchlist`
        : `Removed ${member.name} from Saved Watchlist`
    );
  };

  const handleDelete = () => {
    deleteMember(member.id);
    pushMemberDeleteToSheets(member, 'Deleted by User / Admin in Web App');
    onDeleted?.(member.id);
    notify(`Removed ${member.name} from directory`);
    setConfirmDelete(false);
  };

  const handleDownloadVCard = (e) => {
    e.stopPropagation();
    downloadVCardFile(member, isAdmin);
    notify(`Saved ${member.name}'s contact card (.vcf)`);
  };

  const handleOpenAdminWAHub = (e) => {
    e.stopPropagation();
    if (!isAdmin) return;
    setShowAdminWAHub(true);
  };

  const handleCopyIntro = () => {
    const text = generateWhatsAppWarmIntro(member, waLanguage);
    navigator.clipboard.writeText(text);
    setCopiedIntro(true);
    notify('📋 Warm intro copied to clipboard!');
    setTimeout(() => setCopiedIntro(false), 2000);
  };

  const handleDirectWAOutreach = () => {
    const text = generateWhatsAppWarmIntro(member, waLanguage);
    const cleanPhone = (member.phone || '').replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const parseBulletPoints = (text = '') => {
    if (!text || typeof text !== 'string' || !text.trim()) return [];
    return text
      .split(/[,;\n•·]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 1)
      .slice(0, 3);
  };

  const offeringItems = parseBulletPoints(member.canHelp);
  const seekingItems = parseBulletPoints(member.lookingFor);

  const locationLabel =
    typeof member.location === 'string'
      ? member.location.toUpperCase()
      : [member.location?.city || member.location?.district, member.location?.country]
          .filter(Boolean)
          .join(', ')
          .toUpperCase();

  return (
    <>
      {/* ── Modern Editorial Business Profile Card ─────────────────────────── */}
      <div
        onClick={() => setShowDetail(true)}
        className="group relative bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 hover:border-orange-500/60 dark:hover:border-orange-500/50 p-5 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between cursor-pointer overflow-hidden"
      >
        <div className="space-y-3.5">
          {/* 1. Header: Avatar, Name, Bookmark & Stage Actions */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-md ring-2 ring-stone-100 dark:ring-stone-800`}
              >
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-base text-stone-900 dark:text-stone-100 truncate tracking-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {member.name}
                  </h3>
                  {synergyScore !== null && (
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 shrink-0">
                      ⚡ {synergyScore}%
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-stone-600 dark:text-stone-400 truncate mt-0.5">
                  {member.role || 'Member'}
                </p>
              </div>
            </div>

            {/* Bookmark (Loss Aversion) & Stage Actions */}
            <div
              className="flex items-center gap-1.5 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Watchlist Bookmark Star */}
              <button
                onClick={handleToggleBookmark}
                className={`p-1.5 rounded-lg transition-all ${
                  bookmarked
                    ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100'
                    : 'text-stone-300 hover:text-amber-500 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
                title={bookmarked ? 'Saved to Watchlist' : 'Save connection to Watchlist'}
              >
                <Star size={14} className={bookmarked ? 'fill-amber-500' : ''} />
              </button>

              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${stage.bg} ${stage.text} ${stage.border}`}
              >
                {stage.icon} {stage.label}
              </span>

              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDelete(true);
                }}
                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Delete member profile"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* 2. Business / Venture & Location */}
          <div className="pb-3 border-b border-stone-100 dark:border-stone-800/80 space-y-1">
            <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <span className="text-stone-400">🏢</span>
              <span className="truncate">{member.business || 'Business & Venture Projects'}</span>
            </div>
            {locationLabel && (
              <div className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 flex items-center gap-1">
                <span>{flag || '📍'}</span>
                <span>{locationLabel}</span>
              </div>
            )}
          </div>

          {/* 3. Value Proposition / Bio */}
          {member.business && (
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-2">
              {member.business}
            </p>
          )}

          {/* 4. Bento Looking For & Can Help With */}
          <div className="space-y-2">
            {seekingItems.length > 0 && (
              <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-xl p-2.5 text-xs">
                <span className="font-bold text-blue-900 dark:text-blue-300 block text-[10.5px] uppercase tracking-wider mb-0.5">
                  🎯 Looking For:
                </span>
                <span className="text-blue-800 dark:text-blue-200 text-[11.5px] font-medium line-clamp-1">
                  {seekingItems.join(' · ')}
                </span>
              </div>
            )}

            {offeringItems.length > 0 && (
              <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 rounded-xl p-2.5 text-xs">
                <span className="font-bold text-emerald-900 dark:text-emerald-300 block text-[10.5px] uppercase tracking-wider mb-0.5">
                  💡 Can Help With:
                </span>
                <span className="text-emerald-800 dark:text-emerald-200 text-[11.5px] font-medium line-clamp-1">
                  {offeringItems.join(' · ')}
                </span>
              </div>
            )}
          </div>

          {/* 5. Sector Tags & Gamification Badges */}
          <div className="space-y-1.5">
            {Array.isArray(member.tags) && member.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {member.tags.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[11px] font-semibold border border-stone-200/80 dark:border-stone-700"
                  >
                    #{t}
                  </span>
                ))}
                {member.tags.length > 3 && (
                  <span className="text-[10px] font-bold text-stone-400 self-center">
                    +{member.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {profileStrength.specialBadges.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {profileStrength.specialBadges.map((b) => (
                  <span
                    key={b.id}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${b.color}`}
                    title={b.description}
                  >
                    <span>{b.icon}</span>
                    <span>{b.title}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 6. Footer Actions */}
        <div className="pt-3.5 mt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <span className="text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            View Profile ➔
          </span>

          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {isLinkedInValid && (
              <a
                href={linkedInHref}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-600 hover:text-white transition-all text-xs font-bold"
                title="Open LinkedIn"
              >
                <Linkedin size={13} />
              </a>
            )}

            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-600 hover:text-white transition-all text-xs font-bold"
                title={`Email: ${member.email}`}
              >
                <Mail size={13} />
              </a>
            )}

            {/* Admin-Only 1-Click WhatsApp Warm Intro Hub */}
            {isAdmin && member.phone && (
              <button
                onClick={handleOpenAdminWAHub}
                className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
                title="Admin: 1-Click WhatsApp Warm Intro Hub"
              >
                <MessageCircle size={13} />
                <span className="text-[10px] font-mono font-black hidden sm:inline">Intro</span>
              </button>
            )}

            {websites.map((w, idx) => (
              <a
                key={`${w.url}-${idx}`}
                href={w.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-800 hover:text-white dark:hover:bg-stone-100 dark:hover:text-stone-900 transition-all text-xs font-bold flex items-center gap-1"
                title={`Visit ${w.label} (${w.url})`}
              >
                <ExternalLink size={13} />
                {websites.length > 1 && (
                  <span className="text-[10px] font-mono max-w-[80px] truncate hidden sm:inline">
                    {w.label}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Detailed Profile Modal with Endowed Progress Meter ────────────────── */}
      <Modal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        title="Business Profile & Synergy Details"
        size="lg"
      >
        <div className="space-y-5 text-stone-900 dark:text-stone-100 text-xs">
          {/* Header Card in Modal */}
          <div className="flex items-start justify-between gap-4 p-4 bg-stone-50 dark:bg-stone-800/80 rounded-2xl border border-stone-200/80 dark:border-stone-700">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} text-white font-black text-xl flex items-center justify-center shrink-0 shadow-md ring-2 ring-stone-200 dark:ring-stone-700`}
              >
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-stone-950 dark:text-white">
                    {member.name}
                  </h3>
                  <button
                    onClick={handleToggleBookmark}
                    className={`p-1 rounded-md ${
                      bookmarked ? 'text-amber-500' : 'text-stone-300 hover:text-amber-500'
                    }`}
                    title={bookmarked ? 'Saved to Watchlist' : 'Save to Watchlist'}
                  >
                    <Star size={16} className={bookmarked ? 'fill-amber-500' : ''} />
                  </button>
                </div>
                <p className="text-xs font-bold text-orange-600 dark:text-orange-400">
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

          {/* ── Endowed Progress Profile Strength Ribbon ─────────────────────── */}
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
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-orange-300 border border-white/15 text-[10.5px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>📊 Why this score?</span>
                </button>
                <div className="text-right">
                  <span className="text-base font-mono font-black text-orange-400 block leading-none">
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
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 transition-all duration-700"
                  style={{ width: `${profileStrength.score}%` }}
                />
              </div>
            </div>

            {/* Actionable Micro-Milestones & Boost Hint */}
            <div className="text-[11px] text-orange-200/90 font-medium flex items-center gap-1.5 pt-0.5">
              <span className="text-orange-400">💡</span>
              <span>{profileStrength.boostAdvice}</span>
            </div>
          </div>

          {/* Needs & Offers Full Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 space-y-2">
              <h4 className="font-extrabold text-blue-900 dark:text-blue-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                🎯 Looking For / Needs:
              </h4>
              <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                {member.lookingFor ||
                  'Open to general business synergies and strategic connections.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 space-y-2">
              <h4 className="font-extrabold text-emerald-900 dark:text-emerald-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                💡 Can Help With / Offering:
              </h4>
              <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                {member.canHelp || 'Industry insights, advisory, and networking support.'}
              </p>
            </div>
          </div>

          {/* Links & Catalogues */}
          {(websites.length > 0 || member.catalogues?.length > 0 || isLinkedInValid || (isAdmin && waUrl)) && (
            <div className="p-3.5 bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-200 dark:border-stone-750 space-y-2">
              <h4 className="font-bold text-[11px] uppercase tracking-wider text-stone-500">
                Verified Links & Resources
              </h4>
              <div className="flex flex-wrap gap-2">
                {isLinkedInValid && (
                  <a
                    href={linkedInHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <Linkedin size={13} /> LinkedIn Profile
                  </a>
                )}
                {/* Admin-Only WhatsApp Hub Trigger */}
                {isAdmin && member.phone && (
                  <button
                    onClick={handleOpenAdminWAHub}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"
                  >
                    <MessageCircle size={13} /> Admin: 1-Click WhatsApp Warm Intro
                  </button>
                )}
                {websites.map((w, idx) => (
                  <a
                    key={`${w.url}-${idx}`}
                    href={w.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 font-bold hover:bg-stone-800 hover:text-white dark:hover:bg-stone-100 dark:hover:text-stone-900 transition-all"
                    title={w.url}
                  >
                    <ExternalLink size={13} />
                    <span>{w.label || `Website ${idx + 1}`}</span>
                  </a>
                ))}
                {Array.isArray(member.catalogues) &&
                  member.catalogues.map((cat, idx) => (
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
          )}

          {/* Tags */}
          {Array.isArray(member.tags) && member.tags.length > 0 && (
            <div>
              <h4 className="font-bold text-[11px] uppercase tracking-wider text-stone-500 mb-1.5">
                Industry Sectors & Expertise
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {member.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-semibold border border-stone-200 dark:border-stone-700 text-xs"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Bar in Modal */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <button onClick={handleDownloadVCard} className="btn-primary text-xs font-bold py-2">
                <Download size={13} /> Save Contact (.vcf)
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEdit(true)}
                className="btn-secondary text-xs font-bold py-2"
              >
                <Edit2 size={13} /> Edit Profile
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                className="btn-danger text-xs font-bold py-2"
              >
                <Trash2 size={13} /> Delete Profile
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* ── Admin-Only 1-Click WhatsApp Warm Outreach Hub Modal ──────────────── */}
      {isAdmin && showAdminWAHub && (
        <Modal
          isOpen={showAdminWAHub}
          onClose={() => setShowAdminWAHub(false)}
          title="⚡ Admin WhatsApp Warm Intro Hub"
          size="md"
        >
          <div className="space-y-4 text-xs text-stone-900 dark:text-stone-100">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-extrabold text-emerald-900 dark:text-emerald-300 block">
                  Outreach to: {member.name}
                </span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono">
                  {member.phone || 'No phone recorded'}
                </span>
              </div>
              {/* Language Switcher */}
              <div className="flex bg-white dark:bg-stone-900 p-0.5 rounded-lg border border-emerald-300 dark:border-emerald-700">
                <button
                  onClick={() => setWaLanguage('ar')}
                  className={`px-2 py-1 rounded-md text-[11px] font-bold ${
                    waLanguage === 'ar'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-300'
                  }`}
                >
                  🇪🇬 Arabic
                </button>
                <button
                  onClick={() => setWaLanguage('en')}
                  className={`px-2 py-1 rounded-md text-[11px] font-bold ${
                    waLanguage === 'en'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-stone-600 dark:text-stone-300'
                  }`}
                >
                  🇬🇧 English
                </button>
              </div>
            </div>

            {/* Generated Contextual Message Preview */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Personalized Icebreaker Message:
              </label>
              <div
                dir={waLanguage === 'ar' ? 'rtl' : 'ltr'}
                className="p-3.5 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 text-xs leading-relaxed font-medium text-stone-800 dark:text-stone-200 select-all"
              >
                {generateWhatsAppWarmIntro(member, waLanguage)}
              </div>
            </div>

            {/* Outreach Action Buttons */}
            <div className="pt-2 flex items-center justify-between gap-2 border-t border-stone-200 dark:border-stone-800">
              <button
                onClick={handleCopyIntro}
                className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
              >
                {copiedIntro ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                <span>{copiedIntro ? 'Copied to Clipboard!' : 'Copy Intro Text'}</span>
              </button>

              <button
                onClick={handleDirectWAOutreach}
                disabled={!member.phone}
                className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 border-emerald-700"
              >
                <MessageCircle size={14} />
                <span>Launch WhatsApp ➔</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <EditMemberModal
          member={member}
          isOpen={showEdit}
          onClose={() => setShowEdit(false)}
          onSaved={(updated) => {
            onUpdated?.(updated);
            setShowEdit(false);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <Modal
          isOpen={confirmDelete}
          onClose={() => setConfirmDelete(false)}
          title="Remove Member from Directory"
          size="sm"
        >
          <div className="space-y-4 text-xs">
            <p className="font-semibold text-stone-700 dark:text-stone-300 leading-relaxed">
              Are you sure you want to permanently remove <strong>{member.name}</strong> from the
              directory?
            </p>
            <p className="text-[11px] text-stone-500">
              A deletion tombstone will be recorded so that automated Google Sheets sync will never
              resurrect this deleted record.
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="btn-secondary text-xs py-2 px-3"
              >
                Cancel
              </button>
              <button onClick={handleDelete} className="btn-danger text-xs py-2 px-4">
                Yes, Delete Profile
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Score Explainer Modal */}
      {showScoreExplainer && (
        <ScoreExplainerModal
          isOpen={showScoreExplainer}
          onClose={() => setShowScoreExplainer(false)}
          type="profile_strength"
          member={member}
        />
      )}
    </>
  );
}
