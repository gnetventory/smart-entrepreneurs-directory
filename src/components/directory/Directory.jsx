import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  LayoutGrid,
  Table as TableIcon,
  SlidersHorizontal,
  Users,
  Linkedin,
  MessageCircle,
  Trash2,
  Eye,
  ExternalLink,
  Download,
  CreditCard,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import {
  memberMatchesSearch,
  buildWhatsAppUrl,
  getInitials,
  getAvatarGradient,
  isValidLinkedInUrl,
  formatLinkedInUrl,
  getLinkedInHandle,
  downloadVCardFile,
} from '../../utils/helpers';
import { STAGES, STAGE_OPTIONS, getCountryFlag, GOOGLE_FORM_URL } from '../../utils/constants';
import { deleteMember } from '../../utils/storage';
import { pushMemberDeleteToSheets } from '../../utils/sheetsSync';
import { useDebounce } from '../../utils/useDebounce';
import { isAdminSession } from '../../utils/session';
import ProfileCard from './ProfileCard';
import EmptyState from './EmptyState';
import Modal from '../common/Modal';
import BusinessCardModal from '../businesscard/BusinessCardModal';
import EditMemberModal from '../parser/EditMemberModal';

export default function Directory() {
  const {
    activeMembers: members,
    refreshMembers,
    searchQuery,
    setSearchQuery,
    stageFilter,
    setStageFilter,
    viewMode,
    setViewMode,
    notify,
  } = useApp();

  const [tagFilter, setTagFilter] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  const isAdmin = isAdminSession();

  // Modal states for Compact Table view
  const [detailMember, setDetailMember] = useState(null);
  const [passMember, setPassMember] = useState(null);
  const [editMember, setEditMember] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);

  const debouncedSearch = useDebounce(searchQuery, 150);

  // All Unique Industry Tags
  const allTags = useMemo(() => {
    const tagSet = new Set();
    members.forEach((m) => {
      if (Array.isArray(m.tags)) {
        m.tags.forEach((t) => tagSet.add(t));
      }
    });
    return Array.from(tagSet).sort();
  }, [members]);

  // Filtered & Sorted Members
  const filteredMembers = useMemo(() => {
    let result = Array.isArray(members) ? [...members] : [];

    // Stage filter
    if (stageFilter !== 'all') {
      result = result.filter((m) => m.stage === stageFilter);
    }

    // Tag filter
    if (tagFilter) {
      result = result.filter((m) => Array.isArray(m.tags) && m.tags.includes(tagFilter));
    }

    // Search query
    if (debouncedSearch) {
      result = result.filter((m) => memberMatchesSearch(m, debouncedSearch));
    }

    // Standard sorting
    result.sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';
      if (sortField === 'location') {
        valA =
          typeof a.location === 'string'
            ? a.location
            : `${a.location?.city || ''} ${a.location?.country || ''}`;
        valB =
          typeof b.location === 'string'
            ? b.location
            : `${b.location?.city || ''} ${b.location?.country || ''}`;
      }
      if (typeof valA === 'string') {
        const comp = valA.localeCompare(valB);
        return sortDir === 'asc' ? comp : -comp;
      }
      return sortDir === 'asc' ? (valA || 0) - (valB || 0) : (valB || 0) - (valA || 0);
    });

    return result;
  }, [members, stageFilter, tagFilter, debouncedSearch, sortField, sortDir]);

  const handleDeleteMember = () => {
    if (!memberToDelete) return;
    deleteMember(memberToDelete.id);
    pushMemberDeleteToSheets(memberToDelete, 'Deleted by User in Web App');
    refreshMembers();
    notify(`Removed ${memberToDelete.name} from directory`);
    setMemberToDelete(null);
  };

  const handleDownloadVCard = (e, m) => {
    e?.stopPropagation?.();
    downloadVCardFile(m, isAdmin);
    notify(`Saved ${m.name}'s contact card (.vcf)`);
  };

  return (
    <div className="space-y-5 animate-fade-in max-w-7xl pb-12">
      {/* ── Official Google Form Intake & Profile Update Banner ──────────────── */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white rounded-2xl p-4 sm:p-5 border border-stone-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center shrink-0 text-xl font-bold">
            📝
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight flex items-center gap-2">
              Need to update your business profile or looking-for request?
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Official Intake
              </span>
            </h3>
            <p className="text-xs text-stone-300 font-medium mt-0.5">
              Submit edits or register new ventures via our verified Google Form. Changes sync
              directly to the directory.
            </p>
          </div>
        </div>

        <a
          href={GOOGLE_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-extrabold tracking-wide shadow-md hover:shadow-orange-500/20 transition-all shrink-0 active:scale-95"
        >
          <span>Update My Profile</span>
          <ExternalLink size={14} />
        </a>
      </div>

      {/* ── Frozen Sticky Control Card: Title + Mode Toggle + Search + Filters ─────────────── */}
      <div className="sticky top-[61px] z-20 card p-4 sm:p-5 space-y-4 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-stone-200/90 dark:border-stone-800 shadow-md">
        {/* Top Header Row with View Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-950 dark:text-white tracking-tight flex items-center gap-2.5 font-display">
              <Users className="text-orange-600 dark:text-orange-400" size={24} />
              Community Directory
            </h2>
            <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 mt-0.5">
              Displaying{' '}
              <strong className="text-stone-900 dark:text-stone-100 font-bold">
                {filteredMembers.length}
              </strong>{' '}
              of{' '}
              <strong className="text-stone-900 dark:text-stone-100 font-bold">
                {members.length}
              </strong>{' '}
              verified founders, leaders & professionals
            </p>
          </div>

          {/* ── View Toggle (Grid vs Compact Table) ─────────────────────────── */}
          <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-200 dark:border-stone-700 self-start md:self-auto shadow-xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode !== 'table'
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
              }`}
              title="Standard visual executive profile cards"
            >
              <LayoutGrid size={14} /> Grid View
            </button>

            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
              }`}
              title="High-density scannable table"
            >
              <TableIcon size={14} /> Compact Table
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, company, role, need, offer, location or tags..."
            className="input pl-10 py-2.5 text-xs font-medium rounded-xl border border-stone-300 dark:border-stone-700 focus:border-orange-500 w-full"
          />
        </div>

        {/* Filter Badges & Industry Selector */}
        <div className="flex items-center gap-2 flex-wrap pt-0.5">
          <span className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Filter size={12} className="text-orange-600" /> Stage:
          </span>

          {['all', ...STAGE_OPTIONS].map((s) => {
            const stage = STAGES[s];
            const isActive = stageFilter === s;
            return (
              <button
                key={s}
                onClick={() => setStageFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  isActive
                    ? s === 'all'
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 border-stone-900 dark:border-white shadow-xs'
                      : `${stage.bg} ${stage.text} ${stage.border} shadow-xs ring-1 ring-offset-1`
                    : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-stone-400'
                }`}
              >
                {s === 'all' ? '✨ All Stages' : `${stage.icon} ${stage.label}`}
              </button>
            );
          })}

          {/* Industry Tag Selector */}
          {allTags.length > 0 && (
            <div className="ml-auto flex items-center gap-1.5">
              <span className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                <SlidersHorizontal size={12} /> Sector:
              </span>
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="text-xs font-bold bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-1.5 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-orange-500/40 cursor-pointer"
              >
                <option value="">All Sectors ({allTags.length})</option>
                {allTags.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* ── View Output ──────────────────────────────────────────────────────── */}
      {filteredMembers.length === 0 ? (
        <EmptyState />
      ) : viewMode === 'table' ? (
        /* ── Compact Table View ─────────────────────────────────────────────── */
        <div className="bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 dark:bg-stone-850 border-b border-stone-200/80 dark:border-stone-800 text-[11px] uppercase tracking-wider font-extrabold text-stone-500">
                  <th className="py-3.5 px-4">Member / Name</th>
                  <th className="py-3.5 px-4">Role & Venture</th>
                  <th className="py-3.5 px-4">Stage</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Needs & Offers</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
                {filteredMembers.map((m) => {
                  const stage = STAGES[m.stage] || STAGES.idea;
                  const initials = getInitials(m.name);
                  const gradient = getAvatarGradient(m.name);
                  const isLinkedInValid = isValidLinkedInUrl(m.linkedin);
                  const linkedInHref = isLinkedInValid ? formatLinkedInUrl(m.linkedin) : null;
                  const waUrl = buildWhatsAppUrl(m.phone);
                  const locLabel =
                    typeof m.location === 'string'
                      ? m.location
                      : [m.location?.city, m.location?.country].filter(Boolean).join(', ');

                  return (
                    <tr
                      key={m.id}
                      onClick={() => setDetailMember(m)}
                      className="hover:bg-orange-50/40 dark:hover:bg-orange-950/20 cursor-pointer transition-colors"
                    >
                      {/* Member / Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs`}
                          >
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <span className="font-extrabold text-stone-900 dark:text-stone-100 block text-sm truncate hover:text-orange-600 transition-colors">
                              {m.name}
                            </span>
                            {isAdmin && m.phone && (
                              <span className="text-[11px] text-stone-400 font-mono block">
                                {m.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Role & Company */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-stone-800 dark:text-stone-200 block text-xs truncate max-w-[200px]">
                          {m.role || 'Member'}
                        </span>
                        <span className="text-[11px] text-stone-500 truncate max-w-[200px] block">
                          {m.business || '—'}
                        </span>
                      </td>

                      {/* Stage Pill */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`badge ${stage.bg} ${stage.text} border ${stage.border} text-[10.5px] font-bold px-2 py-0.5`}
                        >
                          {stage.icon} {stage.label}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 font-medium text-stone-600 dark:text-stone-300 text-xs">
                        {getCountryFlag(m.location?.country)} {locLabel || 'Global'}
                      </td>

                      {/* Needs & Offers */}
                      <td className="py-3.5 px-4 max-w-xs truncate">
                        {m.lookingFor && (
                          <div className="text-[11px] text-blue-700 dark:text-blue-300 truncate">
                            <strong>Need:</strong> {m.lookingFor}
                          </div>
                        )}
                        {m.canHelp && (
                          <div className="text-[11px] text-emerald-700 dark:text-emerald-300 truncate">
                            <strong>Offer:</strong> {m.canHelp}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-1.5">
                          {isLinkedInValid && (
                            <a
                              href={linkedInHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 hover:bg-blue-600 hover:text-white transition-all"
                              title="LinkedIn"
                            >
                              <Linkedin size={13} />
                            </a>
                          )}
                          {isAdmin && waUrl && (
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all"
                              title="Admin: WhatsApp"
                            >
                              <MessageCircle size={13} />
                            </a>
                          )}
                          <button
                            onClick={() => setDetailMember(m)}
                            className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 font-bold"
                            title="View Full Profile"
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            onClick={() => setMemberToDelete(m)}
                            className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-600 hover:text-white transition-all"
                            title="Delete Member"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ── Grid View ──────────────────────────────────────────────────────── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map((m) => (
            <ProfileCard
              key={m.id}
              member={m}
              onDeleted={refreshMembers}
              onUpdated={refreshMembers}
            />
          ))}
        </div>
      )}

      {/* ── Detail Modal for Table View Row Clicks ──────────────────────────── */}
      {detailMember && (
        <Modal
          isOpen={!!detailMember}
          onClose={() => setDetailMember(null)}
          title="Business Profile Details"
          size="lg"
        >
          <div className="space-y-5 text-stone-900 dark:text-stone-100 text-xs">
            <div className="flex items-start justify-between gap-4 p-4 bg-stone-50 dark:bg-stone-800/80 rounded-2xl border border-stone-200/80 dark:border-stone-700">
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getAvatarGradient(detailMember.name)} text-white font-black text-xl flex items-center justify-center shrink-0 shadow-md`}
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
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${STAGES[detailMember.stage]?.bg} ${STAGES[detailMember.stage]?.text} ${STAGES[detailMember.stage]?.border}`}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 space-y-2">
                <h4 className="font-extrabold text-blue-900 dark:text-blue-300 text-xs uppercase tracking-wider">
                  🎯 Looking For / Needs:
                </h4>
                <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                  {detailMember.lookingFor || 'Open to general business synergies and connections.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 space-y-2">
                <h4 className="font-extrabold text-emerald-900 dark:text-emerald-300 text-xs uppercase tracking-wider">
                  💡 Can Help With / Offering:
                </h4>
                <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                  {detailMember.canHelp || 'Industry insights, advisory, and networking support.'}
                </p>
              </div>
            </div>

            {/* Links & Action Bar */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleDownloadVCard(e, detailMember)}
                  className="btn-primary text-xs font-bold py-2"
                >
                  <Download size={13} /> Save Contact (.vcf)
                </button>
                <button
                  onClick={() => setPassMember(detailMember)}
                  className="btn-secondary text-xs font-bold py-2"
                >
                  <CreditCard size={13} /> Business Pass
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditMember(detailMember)}
                  className="btn-secondary text-xs font-bold py-2"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    setMemberToDelete(detailMember);
                    setDetailMember(null);
                  }}
                  className="btn-danger text-xs font-bold py-2"
                >
                  <Trash2 size={13} /> Delete Profile
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Full Pass Modal */}
      {passMember && (
        <BusinessCardModal
          member={passMember}
          isOpen={!!passMember}
          onClose={() => setPassMember(null)}
        />
      )}

      {/* Edit Modal */}
      {editMember && (
        <EditMemberModal
          member={editMember}
          isOpen={!!editMember}
          onClose={() => setEditMember(null)}
          onSaved={() => {
            refreshMembers();
            setEditMember(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {memberToDelete && (
        <Modal
          isOpen={!!memberToDelete}
          onClose={() => setMemberToDelete(null)}
          title="Remove Member from Directory"
          size="sm"
        >
          <div className="space-y-4 text-xs">
            <p className="font-semibold text-stone-700 dark:text-stone-300 leading-relaxed">
              Are you sure you want to permanently remove <strong>{memberToDelete.name}</strong>{' '}
              from the directory?
            </p>
            <p className="text-[11px] text-stone-500">
              A deletion tombstone will be recorded so that automated Google Sheets sync will never
              resurrect this deleted record.
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setMemberToDelete(null)}
                className="btn-secondary text-xs py-2 px-3"
              >
                Cancel
              </button>
              <button onClick={handleDeleteMember} className="btn-danger text-xs py-2 px-4">
                Yes, Delete Profile
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
