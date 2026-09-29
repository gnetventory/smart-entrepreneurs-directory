import React, { useState } from 'react';
import {
  MessageCircle,
  Trash2,
  Edit2,
  MapPin,
  Copy,
  Check,
  Building2,
  Search,
  Handshake,
  Linkedin,
  CreditCard,
  Sparkles,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  getInitials,
  getAvatarGradient,
  buildWhatsAppUrl,
  timeAgo,
  isStale,
  copyToClipboard,
  isValidLinkedInUrl,
  formatLinkedInUrl,
  getLinkedInHandle,
} from '../../utils/helpers';
import { STAGES, getCountryFlag } from '../../utils/constants';
import { deleteMember } from '../../utils/storage';
import { pushMemberDeleteToSheets } from '../../utils/sheetsSync';
import { useApp } from '../../contexts/AppContext';
import { isAdminSession } from '../../utils/session';
import Modal from '../common/Modal';
import BusinessCardModal from '../businesscard/BusinessCardModal';
import EditMemberModal from '../parser/EditMemberModal';

export default function ProfileCard({
  member,
  onDeleted,
  onUpdated,
  compact = false,
  synergyScore = null,
}) {
  const { notify } = useApp();
  const [showDetail, setShowDetail] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [copied, setCopied] = useState(false);

  const isAdmin = isAdminSession();
  const stage = STAGES[member.stage] || STAGES.idea;
  const initials = getInitials(member.name);
  const gradient = getAvatarGradient(member.name);
  const waUrl = isAdmin ? buildWhatsAppUrl(member.phone) : null;
  const flag = getCountryFlag(member.location?.country);

  const isLinkedInValid = isValidLinkedInUrl(member.linkedin);
  const linkedInHref = isLinkedInValid ? formatLinkedInUrl(member.linkedin) : null;
  const linkedInHandle = getLinkedInHandle(member.linkedin);

  const handleDelete = () => {
    deleteMember(member.id);
    pushMemberDeleteToSheets(member, 'Deleted by Admin in Web App');
    onDeleted?.(member.id);
    notify('Member removed from directory');
    setConfirmDelete(false);
  };

  const handleCopyName = (e) => {
    e.stopPropagation();
    copyToClipboard(member.name);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    notify(`Copied "${member.name}" to clipboard`);
  };

  // Split comma or newline separated items into clean executive bullet points
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
      : [member.location?.district || member.location?.city, member.location?.country]
          .filter(Boolean)
          .join(', ')
          .toUpperCase();

  return (
    <>
      {/* ── Main Executive Profile Card Container ─────────────────────────────── */}
      <div
        onClick={() => setShowDetail(true)}
        className="group relative bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-card hover:shadow-card-hover hover:-translate-y-1 hover:border-orange-300 dark:hover:border-orange-800/60 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
      >
        {/* Top Accent Line */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-orange-400 group-hover:h-1.5 transition-all duration-200" />

        <div className="p-5 space-y-4 flex-1">
          {/* ── 1. Top Ribbon: Stage Pill + Location Micro-Badge + Quick Channels ── */}
          <div className="flex items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-800/80 pb-3 flex-wrap">
            <div className="flex items-center gap-2">
              {/* Stage Badge */}
              <span
                className={`badge ${stage.bg} ${stage.text} border ${stage.border} text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 shadow-2xs`}
              >
                {stage.icon} {stage.label}
              </span>

              {/* Location Micro-Badge */}
              {locationLabel && (
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1 bg-stone-100 dark:bg-stone-800/80 px-2 py-0.5 rounded-md">
                  <span>{flag}</span>
                  <span className="truncate max-w-[130px]">{locationLabel}</span>
                </span>
              )}
            </div>

            {/* Quick Primary Channels in Header */}
            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              {/* LinkedIn Button (Active or Shaded) */}
              {isLinkedInValid ? (
                <a
                  href={linkedInHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all shadow-2xs"
                  title={`Open LinkedIn (in/${linkedInHandle})`}
                >
                  <Linkedin size={13} />
                </a>
              ) : member.linkedin ? (
                <span
                  className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed opacity-60"
                  title="LinkedIn link is improperly formatted"
                >
                  <Linkedin size={13} />
                </span>
              ) : null}

              {/* WhatsApp Button */}
              {waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white transition-all shadow-2xs"
                  title="Direct WhatsApp Chat"
                >
                  <MessageCircle size={13} />
                </a>
              )}

              {synergyScore !== null && (
                <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                  ⚡ {synergyScore}% Match
                </span>
              )}
            </div>
          </div>

          {/* ── 2. The Executive Identity Block ─────────────────────────────────── */}
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-sm border border-stone-200/50 dark:border-stone-700`}
              >
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-black text-stone-900 dark:text-stone-100 text-base leading-tight truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs font-bold text-stone-600 dark:text-stone-300 truncate">
                  {member.role || 'Founder & CEO'}{' '}
                  {member.business ? `@ ${member.business.split(' ')[0]}` : ''}
                </p>
              </div>
            </div>

            {/* 1-Line Pitch (Clean clamp with uniform height) */}
            {member.business ? (
              <p className="text-xs text-stone-700 dark:text-stone-300 font-medium italic pt-1.5 leading-relaxed line-clamp-2 min-h-[34px]">
                "{member.business}"
              </p>
            ) : (
              <div className="min-h-[34px]" />
            )}
          </div>

          {/* ── 3. Dual-Tone Value Blocks ("Offer vs. Seek") ────────────────────── */}
          {!compact && (offeringItems.length > 0 || seekingItems.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {/* OFFERING (Green Tint Box) */}
              <div className="bg-emerald-50/70 dark:bg-emerald-950/25 border border-emerald-200/70 dark:border-emerald-900/40 rounded-xl p-2.5 space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
                  <Handshake size={11} className="text-emerald-600" /> OFFERING
                </span>
                {offeringItems.length > 0 ? (
                  <ul className="text-[11px] text-emerald-950 dark:text-emerald-200 font-medium space-y-0.5 leading-snug">
                    {offeringItems.map((item, idx) => (
                      <li key={idx} className="truncate flex items-start gap-1">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span className="truncate">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[10px] text-stone-400 italic">General mentorship</p>
                )}
              </div>

              {/* SEEKING (Blue/Amber Tint Box) */}
              <div className="bg-sky-50/70 dark:bg-sky-950/25 border border-sky-200/70 dark:border-sky-900/40 rounded-xl p-2.5 space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-sky-800 dark:text-sky-400 flex items-center gap-1">
                  <Search size={11} className="text-sky-600" /> SEEKING
                </span>
                {seekingItems.length > 0 ? (
                  <ul className="text-[11px] text-sky-950 dark:text-sky-200 font-medium space-y-0.5 leading-snug">
                    {seekingItems.map((item, idx) => (
                      <li key={idx} className="truncate flex items-start gap-1">
                        <span className="text-sky-500 font-bold">•</span>
                        <span className="truncate">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[10px] text-stone-400 italic">Strategic connections</p>
                )}
              </div>
            </div>
          )}

          {/* ── 4. Tag Footer (Rounded Industry Pills) ──────────────────────────── */}
          {Array.isArray(member.tags) && member.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {member.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10px] font-bold border border-stone-200/80 dark:border-stone-700"
                >
                  {tag}
                </span>
              ))}
              {member.tags.length > 3 && (
                <span className="px-1.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-500 text-[10px] font-bold">
                  +{member.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── 5. Action Bar at Bottom ─────────────────────────────────────────── */}
        <div
          className="px-4 py-3 border-t border-stone-100 dark:border-stone-800 bg-[#FAFAF7] dark:bg-stone-950/60 flex items-center justify-between gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCard(true)}
              className="text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <CreditCard size={14} className="text-orange-500" /> Digital Card
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyName}
              className="btn-accent text-xs py-1.5 px-3 rounded-lg font-bold flex items-center gap-1"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy Contact'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Detailed Modal ────────────────────────────────────────────────────── */}
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title={member.name} size="md">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-black text-2xl flex-shrink-0 shadow-md`}
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-black text-stone-900 dark:text-white tracking-tight">
                  {member.name}
                </h2>
                <span
                  className={`badge ${stage.bg} ${stage.text} border ${stage.border} text-xs px-2.5 py-0.5 font-bold`}
                >
                  {stage.icon} {stage.label}
                </span>
              </div>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {member.role}
              </p>
              {locationLabel && (
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 flex items-center gap-1 font-semibold">
                  <MapPin size={12} />
                  {flag} {locationLabel}
                </p>
              )}
            </div>
          </div>

          {member.business && (
            <div className="card p-4 space-y-1 bg-[#FAF8F5] dark:bg-stone-950">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <Building2 size={13} /> Executive Pitch & Project
              </span>
              <p className="text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                {member.business}
              </p>
            </div>
          )}

          {(member.lookingFor || member.canHelp) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {member.lookingFor && (
                <div className="bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-700 dark:text-sky-400 flex items-center gap-1">
                    <Search size={12} /> Seeking / Looking For
                  </span>
                  <p className="text-xs text-sky-950 dark:text-sky-200 leading-relaxed font-medium">
                    {member.lookingFor}
                  </p>
                </div>
              )}
              {member.canHelp && (
                <div className="bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <Handshake size={12} /> Offering / Can Help With
                  </span>
                  <p className="text-xs text-emerald-950 dark:text-emerald-200 leading-relaxed font-medium">
                    {member.canHelp}
                  </p>
                </div>
              )}
            </div>
          )}

          {Array.isArray(member.tags) && member.tags.length > 0 && (
            <div className="space-y-1.5">
              <span className="label">Industry & Skills Tags</span>
              <div className="flex flex-wrap gap-1.5">
                {member.tags.map((t) => (
                  <span
                    key={t}
                    className="badge bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold border border-stone-200 dark:border-stone-700 text-xs"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Bar inside Modal */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <button onClick={() => setShowCard(true)} className="btn-secondary text-xs font-bold">
                <CreditCard size={14} /> Open Digital Pass
              </button>
              {isLinkedInValid && (
                <a
                  href={linkedInHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-xs font-bold text-blue-600 dark:text-blue-400"
                >
                  <Linkedin size={14} /> LinkedIn Profile
                </a>
              )}
            </div>

            {isAdmin && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowEdit(true)}
                  className="btn-secondary text-xs font-bold"
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="btn-ghost text-rose-600 hover:bg-rose-50 text-xs font-bold"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Business Card Modal */}
      {showCard && (
        <BusinessCardModal member={member} isOpen={showCard} onClose={() => setShowCard(false)} />
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

      {/* Delete Confirmation */}
      {confirmDelete && (
        <Modal
          isOpen={confirmDelete}
          onClose={() => setConfirmDelete(false)}
          title="Remove Member"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-sm font-semibold text-stone-600 dark:text-stone-300">
              Are you sure you want to remove <strong>{member.name}</strong> from the directory?
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmDelete(false)} className="btn-secondary text-xs">
                Cancel
              </button>
              <button onClick={handleDelete} className="btn-danger text-xs">
                Yes, Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
