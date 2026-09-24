import React, { useState } from 'react';
import { CreditCard, Download, UserCheck } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import BusinessCardModal from './BusinessCardModal';
import { getInitials, getAvatarGradient } from '../../utils/helpers';
import { STAGES, getCountryFlag } from '../../utils/constants';

export default function BusinessCardPage() {
  const { members } = useApp();
  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id || '');
  const [showModal, setShowModal] = useState(false);

  const selectedMember = members.find((m) => m.id === selectedMemberId) || members[0];

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Header Banner */}
      <div className="card p-6 sm:p-8 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-500/30">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-600 text-white rounded-2xl flex-shrink-0 shadow-lg shadow-emerald-600/20">
            <CreditCard size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              Digital Business Card Generator
            </h2>
            <p className="text-sm font-semibold text-stone-600 dark:text-stone-400 mt-0.5">
              Select any member profile to preview and download a high-resolution PNG business card.
            </p>
          </div>
        </div>
      </div>

      {/* Select Member Dropdown & Preview */}
      <div className="card p-6 sm:p-8 space-y-6">
        <div>
          <label className="label">Select Member</label>
          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            className="input text-base font-bold py-3.5"
          >
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.role} · {m.location?.city || m.location?.country || 'Global'})
              </option>
            ))}
          </select>
        </div>

        {selectedMember && (
          <div className="p-6 bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-4">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getAvatarGradient(selectedMember.name)} flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-md`}>
                {getInitials(selectedMember.name)}
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-stone-900 dark:text-stone-100">
                  {selectedMember.name}
                </h3>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {selectedMember.role}
                </p>
                {selectedMember.location?.country && (
                  <p className="text-xs text-stone-500 mt-0.5">
                    {getCountryFlag(selectedMember.location.country)} {[selectedMember.location.city, selectedMember.location.country].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="btn-primary text-sm"
            >
              <CreditCard size={16} /> Generate & Download Card (PNG)
            </button>
          </div>
        )}
      </div>

      {selectedMember && (
        <BusinessCardModal
          member={selectedMember}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
