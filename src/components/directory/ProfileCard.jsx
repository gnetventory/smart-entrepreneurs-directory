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
      {/* ── Compact Space-Optimized Profile Card ────────────────────────────── */}
      <div
        onClick={() => setShowDetail(true)}
        className="group relative bg-white dark:bg-[#141722] rounded-2xl border border-stone-200/90 dark:border-stone-800 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 p-4 space-y-3 transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md cursor-pointer"
      >
        <div className="space-y-2.5">
          {/* ── Row 1: Avatar + Founder Info + Stage Pill ───────────────────── */}
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-xs`}
              >
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-extrabold text-stone-900 dark:text-stone-100 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {member.name}
                  </h3>
                  <span title="Verified Member" className="text-emerald-500 shrink-0">
                    <CheckCircle2 size={15} />
                  </span>
                  {synergyScore !== null && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 shrink-0">
                      ⚡ {synergyScore}%
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 truncate">
                  {member.role || 'Founder'}
                  {locationLabel ? ` · ${flag} ${locationLabel}` : ''}
                </p>
              </div>
            </div>

            {/* Compact Stage Pill */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${stage.bg} ${stage.text} border border-stone-200 dark:border-stone-700/80 shrink-0`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {stage.label}
            </span>
          </div>

          {/* ── Row 2: Compact Pitch Quote ──────────────────────────────────── */}
          {member.business ? (
            <p className="text-xs text-stone-700 dark:text-stone-300 font-medium leading-relaxed italic bg-stone-50/80 dark:bg-stone-800/50 px-3 py-2 rounded-xl border border-stone-100 dark:border-stone-800 line-clamp-2">
              "{member.business}"
            </p>
          ) : (
            <p className="text-xs text-stone-400 italic bg-stone-50/50 dark:bg-stone-800/30 px-3 py-1.5 rounded-xl">
              Open to network and explore synergies.
            </p>
          )}

          {/* ── Row 3: Inline Compact Offers & Needs ────────────────────────── */}
          {(offeringItems.length > 0 || seekingItems.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              {offeringItems.length > 0 && (
                <div className="flex items-center gap-1.5 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 px-2.5 py-1.5 rounded-lg border border-emerald-200/50 dark:border-emerald-800/40 min-w-0">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                    Offers:
                  </span>
                  <span className="truncate font-medium">{offeringItems.join(', ')}</span>
                </div>
              )}
              {seekingItems.length > 0 && (
                <div className="flex items-center gap-1.5 bg-sky-50/70 dark:bg-sky-950/40 text-sky-950 dark:text-sky-200 px-2.5 py-1.5 rounded-lg border border-sky-200/50 dark:border-sky-800/40 min-w-0">
                  <span className="font-bold text-sky-700 dark:text-sky-400 shrink-0">Needs:</span>
                  <span className="truncate font-medium">{seekingItems.join(', ')}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Row 4 / Footer: Tags + Fast Actions ─────────────────────────── */}
        <div
          className="pt-2.5 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Primary Tag or Count */}
          <div className="flex items-center gap-1.5 min-w-0">
            {Array.isArray(member.tags) && member.tags.length > 0 ? (
              <span className="text-[10px] font-bold text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800/90 px-2.5 py-1 rounded-md truncate max-w-[130px]">
                {member.tags[0]}
              </span>
            ) : (
              <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500">
                Directory Member
              </span>
            )}
            {Array.isArray(member.tags) && member.tags.length > 1 && (
              <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 bg-stone-50 dark:bg-stone-800/50 px-1.5 py-1 rounded-md">
                +{member.tags.length - 1}
              </span>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Direct WhatsApp */}
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-600 hover:text-white text-emerald-600 dark:text-emerald-400 transition-all"
                title="Direct WhatsApp"
              >
                <MessageCircle size={14} />
              </a>
            )}

            {/* LinkedIn */}
            {isLinkedInValid && (
              <a
                href={linkedInHref}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-blue-400 transition-all"
                title="LinkedIn Profile"
              >
                <Linkedin size={14} />
              </a>
            )}

            {/* Quick QR Code modal trigger */}
            <button
              type="button"
              onClick={handleOpenQR}
              className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-all"
              title="Show Phone QR"
            >
              <QrCode size={14} />
            </button>

            {/* 1-Click Save Contact (.vcf) */}
            <button
              type="button"
              onClick={handleDownloadVCard}
              className="px-2.5 py-1.5 rounded-lg bg-stone-900 hover:bg-black dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 text-white text-[11px] font-bold transition-all flex items-center gap-1 shadow-xs"
              title="Save Contact (.vcf)"
            >
              <Download size={12} />
              <span className="hidden sm:inline">Save</span>
            </button>
          </div>
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

      {/* ── Detailed Dossier Modal ─────────────────────────────────────────── */}
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title={member.name} size="md">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-black text-2xl flex-shrink-0 shadow-md border-2 border-stone-800`}
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
            <div className="card p-4 space-y-1 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border-2 border-stone-300 dark:border-stone-700/80">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
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
                <div className="bg-sky-50/80 dark:bg-sky-950/30 border-2 border-stone-300 dark:border-stone-700/80 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-700 dark:text-sky-400 flex items-center gap-1">
                    <Search size={12} /> Seeking / Looking For
                  </span>
                  <p className="text-xs text-sky-950 dark:text-sky-200 leading-relaxed font-medium">
                    {member.lookingFor}
                  </p>
                </div>
              )}
              {member.canHelp && (
                <div className="bg-emerald-50/80 dark:bg-emerald-950/30 border-2 border-stone-300 dark:border-stone-700/80 rounded-xl p-3.5 space-y-1">
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
                    className="badge bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold border border-stone-300 dark:border-stone-700 text-xs"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Bar inside Modal */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={handleDownloadVCard} className="btn-primary text-xs font-bold">
                <Download size={13} /> Save Contact (.vcf)
              </button>
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
                  <Linkedin size={14} /> LinkedIn
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
