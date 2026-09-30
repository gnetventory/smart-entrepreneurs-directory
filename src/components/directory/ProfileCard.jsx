import React, { useState } from 'react';
import {
  MessageCircle,
  Trash2,
  Edit2,
  MapPin,
  Building2,
  Search,
  Handshake,
  Linkedin,
  CreditCard,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  Download,
  Share2,
  Phone,
  Mail,
  UserCheck,
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
  downloadVCardFile,
} from '../../utils/helpers';
import { STAGES, getCountryFlag } from '../../utils/constants';
import { deleteMember } from '../../utils/storage';
import { pushMemberDeleteToSheets } from '../../utils/sheetsSync';
import { useApp } from '../../contexts/AppContext';
import { isAdminSession } from '../../utils/session';
import { QRCodeSVG } from '../common/QRCodeSVG';
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
  const [showQRModal, setShowQRModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isAdmin = isAdminSession();
  const stage = STAGES[member.stage] || STAGES.idea;
  const initials = getInitials(member.name);
  const gradient = getAvatarGradient(member.name);
  const waUrl = member.phone ? buildWhatsAppUrl(member.phone) : null;
  const flag = getCountryFlag(member.location?.country);

  const isLinkedInValid = isValidLinkedInUrl(member.linkedin);
  const linkedInHref = isLinkedInValid ? formatLinkedInUrl(member.linkedin) : null;
  const linkedInHandle = getLinkedInHandle(member.linkedin);

  // Stage Header Gradient Accent Bar Palette
  const stageHeaderGradients = {
    idea: 'from-amber-500 via-yellow-400 to-orange-500',
    starting: 'from-emerald-500 via-teal-400 to-cyan-500',
    running: 'from-emerald-500 via-teal-400 to-amber-500',
    growing: 'from-indigo-500 via-purple-500 to-pink-500',
  };
  const accentGradient = stageHeaderGradients[member.stage] || stageHeaderGradients.starting;

  const handleDelete = () => {
    deleteMember(member.id);
    pushMemberDeleteToSheets(member, 'Deleted by Admin in Web App');
    onDeleted?.(member.id);
    notify('Member removed from directory');
    setConfirmDelete(false);
  };

  const handleDownloadVCard = (e) => {
    e.stopPropagation();
    downloadVCardFile(member);
    notify(`Saved ${member.name}'s contact card (.vcf)`);
  };

  const handleOpenQR = (e) => {
    e.stopPropagation();
    setShowQRModal(true);
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

  // QR Value payload (direct vCard or profile deep link)
  const qrContactPayload = `MECARD:N:${member.name};ORG:${member.business || 'Alliance Network'};TEL:${member.phone || ''};EMAIL:${member.email || ''};URL:${linkedInHref || ''};;`;

  return (
    <>
      {/* ── Executive Fintech x Multi-Hue Bento Hybrid Card ────────────────── */}
      <div
        onClick={() => setShowDetail(true)}
        className="group relative bg-white dark:bg-gradient-to-b dark:from-[#161A24] dark:to-[#0E1118] rounded-3xl border border-stone-200 dark:border-white/10 hover:border-emerald-600 dark:hover:border-emerald-500/50 p-5 space-y-3.5 transition-all duration-300 flex flex-col justify-between shadow-md hover:shadow-xl dark:shadow-2xl cursor-pointer overflow-hidden"
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 relative z-10">
          {/* ── Top Status Ribbon & Location ──────────────────────────────── */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${stage.bg} ${stage.text} border ${stage.border || 'border-stone-300 dark:border-stone-700'}`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {stage.label} · {stage.tenure || 'Active'}
            </span>
            {locationLabel && (
              <span className="text-[11px] font-bold text-stone-500 dark:text-stone-300 flex items-center gap-1">
                <span>{flag}</span> {locationLabel}
              </span>
            )}
          </div>

          {/* ── 1. Founder Identity Box (Editorial Fintech) ───────────────── */}
          <div className="bg-[#F8FAFC] dark:bg-white/[0.04] border border-[#E2E8F0] dark:border-white/12 rounded-2xl p-4 flex items-center gap-4">
            {/* Circular Avatar with crisp depth shadow */}
            <div
              className={`w-12 h-12 rounded-full aspect-square bg-gradient-to-br ${gradient} text-white font-black text-xl flex items-center justify-center shrink-0 shadow-md ring-2 ring-emerald-500/30`}
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-black text-stone-900 dark:text-white truncate tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {member.name}
                </h3>
                <span title="Verified Member" className="text-emerald-500 shrink-0">
                  <CheckCircle2 size={16} />
                </span>
                {synergyScore !== null && (
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 shrink-0">
                    ⚡ {synergyScore}%
                  </span>
                )}
              </div>
              <p className="text-xs font-bold text-stone-600 dark:text-emerald-400 truncate">
                {member.role || 'Founder & Leader'}
              </p>
              {Array.isArray(member.tags) && member.tags.length > 0 && (
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-stone-700 dark:text-stone-200 bg-stone-200/80 dark:bg-white/10 border border-stone-300/80 dark:border-white/15 px-2 py-0.5 rounded-md mt-0.5 truncate max-w-[200px]">
                  {member.tags[0]}
                </span>
              )}
            </div>
          </div>

          {/* ── 2. Warm Amber Pitch Box (with Vertical Gold Accent Border) ── */}
          <div className="bg-amber-50/70 dark:bg-amber-950/25 border border-amber-200/80 dark:border-amber-500/30 border-l-4 border-l-amber-500 rounded-2xl p-3.5 space-y-1 min-h-[58px] flex flex-col justify-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400 flex items-center gap-1">
              <span>🚀</span> VENTURE PITCH
            </span>
            <p className="text-xs sm:text-[13px] text-stone-800 dark:text-white font-semibold italic leading-relaxed line-clamp-2">
              {member.business
                ? `"${member.business}"`
                : 'Open to explore strategic alliances and collaborations.'}
            </p>
          </div>

          {/* ── 3. Lower 3-Box Sub-grid: [Tenure] [Offering] [Looking For] ─── */}
          <div className="grid grid-cols-3 gap-2 text-left items-stretch">
            {/* Box 1: Violet Stage / Tenure */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50/60 dark:from-purple-500/16 dark:to-indigo-500/6 border border-purple-200 dark:border-purple-500/40 rounded-2xl p-3 flex flex-col justify-between min-h-[84px]">
              <span className="text-[9px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300">
                TENURE
              </span>
              <div className="mt-auto pt-1">
                <span className="text-[11px] font-black text-purple-950 dark:text-white block leading-tight">
                  {stage.tenure || 'Active'}
                </span>
                <span className="text-[9px] font-bold text-purple-700 dark:text-purple-300 block mt-0.5">
                  {stage.label}
                </span>
              </div>
            </div>

            {/* Box 2: Mint Offering */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50/60 dark:from-emerald-500/16 dark:to-teal-500/6 border border-emerald-200 dark:border-emerald-500/38 rounded-2xl p-3 flex flex-col justify-between min-h-[84px]">
              <span className="text-[9px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                OFFERING
              </span>
              <p className="text-[11px] text-emerald-950 dark:text-white font-bold leading-snug mt-auto pt-1 line-clamp-2">
                {offeringItems.length > 0 ? offeringItems.join(', ') : 'General Expertise'}
              </p>
            </div>

            {/* Box 3: Sky Looking For */}
            <div className="bg-gradient-to-br from-sky-50 to-cyan-50/60 dark:from-sky-500/16 dark:to-sky-500/6 border border-sky-200 dark:border-sky-500/38 rounded-2xl p-3 flex flex-col justify-between min-h-[84px]">
              <span className="text-[9px] font-black uppercase tracking-wider text-sky-700 dark:text-sky-300">
                LOOKING FOR
              </span>
              <p className="text-[11px] text-sky-950 dark:text-white font-bold leading-snug mt-auto pt-1 line-clamp-2">
                {seekingItems.length > 0 ? seekingItems.join(', ') : 'Synergies'}
              </p>
            </div>
          </div>
        </div>

        {/* ── 4. Bottom Action Bar: LinkedIn | Email | Save Contact ────────── */}
        <div
          className="bg-[#F8FAFC] dark:bg-white/[0.04] border border-[#E2E8F0] dark:border-white/12 rounded-2xl p-1.5 grid grid-cols-3 gap-1 mt-1 relative z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* LinkedIn */}
          {isLinkedInValid ? (
            <a
              href={linkedInHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all text-center group/btn"
              title={`Open LinkedIn (in/${linkedInHandle})`}
            >
              <Linkedin size={16} className="mb-1" />
              <span className="text-[9px] font-black uppercase tracking-wider text-stone-600 dark:text-stone-300 group-hover/btn:text-blue-700 dark:group-hover/btn:text-white">
                LINKEDIN
              </span>
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl text-stone-400 dark:text-stone-500 opacity-40 cursor-not-allowed text-center"
              title="LinkedIn not provided"
            >
              <Linkedin size={16} className="mb-1" />
              <span className="text-[9px] font-black uppercase tracking-wider">LINKEDIN</span>
            </button>
          )}

          {/* Email */}
          {member.email ? (
            <a
              href={`mailto:${member.email}`}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-all text-center group/btn"
              title={`Send Email to ${member.email}`}
            >
              <Mail size={16} className="mb-1" />
              <span className="text-[9px] font-black uppercase tracking-wider text-stone-600 dark:text-stone-300 group-hover/btn:text-emerald-700 dark:group-hover/btn:text-white">
                EMAIL
              </span>
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl text-stone-400 dark:text-stone-500 opacity-40 cursor-not-allowed text-center"
              title="Email not provided"
            >
              <Mail size={16} className="mb-1" />
              <span className="text-[9px] font-black uppercase tracking-wider">EMAIL</span>
            </button>
          )}

          {/* Save Contact */}
          <button
            type="button"
            onClick={handleDownloadVCard}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 transition-all text-center group/btn cursor-pointer"
            title="Download .vcf Contact Card"
          >
            <Download size={16} className="mb-1" />
            <span className="text-[9px] font-black uppercase tracking-wider text-stone-600 dark:text-stone-300 group-hover/btn:text-emerald-700 dark:group-hover/btn:text-white">
              SAVE CONTACT
            </span>
          </button>
        </div>
      </div>

      {/* ── Interactive QR Code Modal Dialog ─────────────────────────────────── */}
      {showQRModal && (
        <Modal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          title="Instant Phone Contact QR"
          size="sm"
        >
          <div className="text-center space-y-4 p-2">
            <div className="p-4 bg-white rounded-2xl inline-block border-2 border-stone-800 shadow-xl mx-auto">
              <QRCodeSVG value={qrContactPayload} size={180} />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-stone-900 dark:text-stone-100">
                {member.name}
              </h4>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {member.role}
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Scan with your iPhone or Android camera to instantly add this founder to your
                address book.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleDownloadVCard}
                className="btn-primary text-xs flex-1 py-2 font-bold justify-center"
              >
                <Download size={13} /> Download .vcf
              </button>
              <button
                type="button"
                onClick={() => setShowQRModal(false)}
                className="btn-secondary text-xs px-4 py-2 font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Space-Optimized Detailed Dossier Modal ───────────────────────────── */}
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title={member.name} size="md">
        <div className="space-y-4">
          {/* 1. Profile Identity Header */}
          <div className="flex items-center gap-3.5 bg-stone-50 dark:bg-white/[0.03] p-3.5 rounded-2xl border border-stone-200 dark:border-white/10">
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-black text-2xl flex-shrink-0 shadow-md ring-2 ring-emerald-500/30`}
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-stone-900 dark:text-white tracking-tight">
                  {member.name}
                </h2>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${stage.bg} ${stage.text} border ${stage.border || 'border-stone-300 dark:border-stone-700'}`}
                >
                  {stage.icon} {stage.label} · {stage.tenure || 'Active'}
                </span>
              </div>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {member.role || 'Founder & Leader'}
              </p>
              {locationLabel && (
                <p className="text-xs text-stone-500 dark:text-stone-400 font-semibold flex items-center gap-1">
                  <MapPin size={12} />
                  {flag} {locationLabel}
                </p>
              )}
            </div>
          </div>

          {/* 2. Executive Pitch Box */}
          {member.business ? (
            <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/30 border-l-4 border-l-amber-500 rounded-2xl p-3.5 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400 flex items-center gap-1">
                <span>🚀</span> Executive Pitch & Project
              </span>
              <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-100 italic font-medium leading-relaxed">
                "{member.business}"
              </p>
            </div>
          ) : (
            <div className="bg-stone-50 dark:bg-white/[0.02] border border-stone-200 dark:border-white/10 rounded-2xl p-3 text-xs text-stone-400 italic">
              Ready to collaborate and build alliances.
            </div>
          )}

          {/* 3. Dual Value Exchange Grid (Compact) */}
          {(member.lookingFor || member.canHelp) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {member.canHelp && (
                <div className="bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-3 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                    <span>🤝</span> Offering / Can Help With
                  </span>
                  <p className="text-stone-800 dark:text-stone-200 font-medium leading-snug">
                    {member.canHelp}
                  </p>
                </div>
              )}
              {member.lookingFor && (
                <div className="bg-sky-50/80 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-500/30 rounded-2xl p-3 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-sky-800 dark:text-sky-300 flex items-center gap-1">
                    <span>🔍</span> Seeking / Looking For
                  </span>
                  <p className="text-stone-800 dark:text-stone-200 font-medium leading-snug">
                    {member.lookingFor}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 4. Industry & Skills Tags */}
          {Array.isArray(member.tags) && member.tags.length > 0 && (
            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-500 dark:text-stone-400">
                Industry & Skills
              </span>
              <div className="flex flex-wrap gap-1.5">
                {member.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-white/5 text-stone-700 dark:text-stone-300 font-bold border border-stone-200 dark:border-white/10 text-xs"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 5. Modal Action Bar */}
          <div className="pt-3 border-t border-stone-200 dark:border-white/10 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={handleDownloadVCard} className="btn-primary text-xs font-bold py-2">
                <Download size={13} /> Save Contact (.vcf)
              </button>
              <button
                onClick={() => setShowCard(true)}
                className="btn-secondary text-xs font-bold py-2"
              >
                <CreditCard size={13} /> Open Pass
              </button>
              {isLinkedInValid && (
                <a
                  href={linkedInHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-xs font-bold py-2 text-blue-600 dark:text-blue-400"
                >
                  <Linkedin size={13} /> LinkedIn
                </a>
              )}
            </div>

            {isAdmin && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowEdit(true)}
                  className="btn-secondary text-xs font-bold py-2"
                >
                  <Edit2 size={13} /> Edit
                </button>
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="btn-ghost text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold py-2"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Full Business Card Modal */}
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
