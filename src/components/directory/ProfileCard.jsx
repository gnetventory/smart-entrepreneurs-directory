import React, { useState } from 'react';
import { MessageCircle, Trash2, Edit2, AlertCircle, MapPin, Copy, Building2, Search, Handshake } from 'lucide-react';
import { getInitials, getAvatarGradient, buildWhatsAppUrl, timeAgo, isStale, copyToClipboard } from '../../utils/helpers';
import { STAGES, getCountryFlag } from '../../utils/constants';
import { deleteMember } from '../../utils/storage';
import { useApp } from '../../contexts/AppContext';
import Modal from '../common/Modal';
import BusinessCardModal from '../businesscard/BusinessCardModal';
import EditMemberModal from '../parser/EditMemberModal';

export default function ProfileCard({ member, onDeleted, onUpdated, compact = false }) {
  const { notify } = useApp();
  const [showDetail, setShowDetail] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const stage = STAGES[member.stage] || STAGES.idea;
  const initials = getInitials(member.name);
  const gradient = getAvatarGradient(member.name);
  const waUrl = buildWhatsAppUrl(member.phone);
  const stale = isStale(member.updatedAt);
  const flag = getCountryFlag(member.location?.country);

  const handleDelete = () => {
    deleteMember(member.id);
    notify(`${member.name} removed from directory`, 'success');
    onDeleted?.();
    setConfirmDelete(false);
    setShowDetail(false);
  };

  const handleCopyName = async () => {
    await copyToClipboard(member.name);
    notify('Name copied to clipboard!');
  };

  return (
    <>
      {/* Main Profile Card */}
      <div
        className="card-hover overflow-hidden flex flex-col justify-between"
        onClick={() => setShowDetail(true)}
      >
        {/* Stale banner */}
        {stale && (
          <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200 dark:border-amber-800">
            <AlertCircle size={13} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300">Profile needs refresh (90+ days)</span>
          </div>
        )}

        <div className="p-5 space-y-4">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-extrabold text-lg flex-shrink-0 shadow-sm`}>
                {initials}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base truncate">
                  {member.name}
                </h3>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 truncate">{member.role}</p>
                {member.location?.country && (
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 flex items-center gap-1 font-medium">
                    <span>{flag}</span>
                    <span className="truncate">{[member.location.city, member.location.country].filter(Boolean).join(', ')}</span>
                  </p>
                )}
              </div>
            </div>
            <span className={`badge ${stage.bg} ${stage.text} border ${stage.border} text-[11px] px-2.5 py-0.5 font-semibold flex-shrink-0`}>
              {stage.icon} {stage.label}
            </span>
          </div>

          {/* Business Pitch Box */}
          {member.business && (
            <div className="bg-stone-50 dark:bg-stone-950/60 rounded-xl p-3 border border-stone-200/80 dark:border-stone-800">
              <p className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                <Building2 size={12} className="text-emerald-600 dark:text-emerald-400" /> Business / Project
              </p>
              <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed font-medium line-clamp-2">
                {member.business}
              </p>
            </div>
          )}

          {/* Tags */}
          {member.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {member.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="px-2.5 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-full text-[11px] font-semibold border border-stone-200 dark:border-stone-700">
                  {tag}
                </span>
              ))}
              {member.tags.length > 4 && (
                <span className="px-2 py-0.5 bg-stone-200/60 dark:bg-stone-800/50 text-stone-600 dark:text-stone-400 rounded-full text-[11px] font-semibold">
                  +{member.tags.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Needs & Offers Grid */}
          {!compact && (
            <div className="space-y-2 pt-0.5">
              {member.lookingFor && (
                <div className="bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-800/60 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                    <Search size={12} /> Looking For
                  </p>
                  <p className="text-xs text-sky-950 dark:text-sky-200 line-clamp-2 leading-relaxed font-medium">{member.lookingFor}</p>
                </div>
              )}
              {member.canHelp && (
                <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                    <Handshake size={12} /> Can Help With
                  </p>
                  <p className="text-xs text-emerald-950 dark:text-emerald-200 line-clamp-2 leading-relaxed font-medium">{member.canHelp}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer CTA Bar */}
        <div className="px-5 py-3 border-t border-stone-200/80 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-950/40 flex items-center justify-between">
          <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">{timeAgo(member.createdAt)}</span>
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {waUrl ? (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs py-1.5 px-3"
              >
                <MessageCircle size={14} />
                WhatsApp
              </a>
            ) : (
              <button
                onClick={handleCopyName}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                <Copy size={12} />
                Copy Name
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title={member.name} size="md">
        <div className="space-y-5">
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-md`}>
              {initials}
            </div>
            <div className="space-y-0.5">
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">{member.name}</h2>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{member.role}</p>
              {member.location?.country && (
                <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 pt-0.5 font-medium">
                  <MapPin size={13} />
                  {flag} {[member.location.city, member.location.country].filter(Boolean).join(', ')}
                </p>
              )}
              <div className="pt-1.5">
                <span className={`badge ${stage.bg} ${stage.text} border ${stage.border} text-xs px-2.5 py-0.5 font-semibold`}>
                  {stage.icon} {stage.label}
                </span>
              </div>
            </div>
          </div>

          {member.business && (
            <div className="card p-4 bg-stone-50 dark:bg-stone-950/60 border-stone-200 dark:border-stone-800">
              <p className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-1">Business / Project</p>
              <p className="text-sm text-stone-900 dark:text-stone-200 leading-relaxed font-medium">{member.business}</p>
            </div>
          )}

          {member.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {member.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-300 rounded-full text-xs font-semibold border border-stone-200 dark:border-stone-700">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-3">
            {member.lookingFor && (
              <div className="bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60 rounded-xl p-4 space-y-1">
                <p className="text-[10px] font-bold text-sky-700 dark:text-sky-400 uppercase tracking-widest">🔍 Looking For</p>
                <p className="text-xs text-sky-950 dark:text-sky-200 leading-relaxed font-medium">{member.lookingFor}</p>
              </div>
            )}
            {member.canHelp && (
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-4 space-y-1">
                <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">🤝 Can Help With</p>
                <p className="text-xs text-emerald-950 dark:text-emerald-200 leading-relaxed font-medium">{member.canHelp}</p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-3 border-t border-stone-200 dark:border-stone-800">
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs"
              >
                <MessageCircle size={15} />
                Connect on WhatsApp
              </a>
            )}
            <button onClick={() => { setShowDetail(false); setShowCard(true); }} className="btn-secondary text-xs">
              🎴 Business Card
            </button>
            <button onClick={() => { setShowDetail(false); setShowEdit(true); }} className="btn-ghost text-xs">
              <Edit2 size={15} /> Edit
            </button>
            <button onClick={() => setConfirmDelete(true)} className="btn-ghost text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 text-xs">
              <Trash2 size={15} /> Delete
            </button>
          </div>

          {confirmDelete && (
            <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-500/30 rounded-xl p-3.5 space-y-2">
              <p className="text-xs font-bold text-rose-800 dark:text-rose-300">Are you sure you want to delete {member.name}?</p>
              <div className="flex gap-2">
                <button onClick={handleDelete} className="btn-danger text-xs py-1.5 px-3">Yes, Delete</button>
                <button onClick={() => setConfirmDelete(false)} className="btn-secondary text-xs py-1.5 px-3">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      <BusinessCardModal member={member} isOpen={showCard} onClose={() => setShowCard(false)} />
      {showEdit && (
        <EditMemberModal
          member={member}
          isOpen={showEdit}
          onClose={() => setShowEdit(false)}
          onSaved={(updated) => { onUpdated?.(updated); setShowEdit(false); }}
        />
      )}
    </>
  );
}
