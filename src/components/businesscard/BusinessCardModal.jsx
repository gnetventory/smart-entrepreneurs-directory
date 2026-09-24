import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Download, Share2, Sparkles } from 'lucide-react';
import Modal from '../common/Modal';
import { getInitials, getAvatarGradient } from '../../utils/helpers';
import { STAGES, getCountryFlag } from '../../utils/constants';
import { useApp } from '../../contexts/AppContext';

export default function BusinessCardModal({ member, isOpen, onClose }) {
  const { notify } = useApp();
  const cardRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  if (!member) return null;

  const stage = STAGES[member.stage] || STAGES.idea;
  const initials = getInitials(member.name);
  const gradient = getAvatarGradient(member.name);
  const flag = getCountryFlag(member.location?.country);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `${member.name.replace(/\s+/g, '_')}_BusinessCard.png`;
      link.click();
      notify('Digital business card downloaded! 🎴');
    } catch (err) {
      console.error(err);
      notify('Failed to generate business card image', 'error');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Digital Business Card" size="md">
      <div className="space-y-6">
        <p className="text-sm text-muted text-center">
          Export as high-resolution PNG card to share on LinkedIn, WhatsApp, or email signature.
        </p>

        {/* Printable Card Area */}
        <div className="flex justify-center">
          <div
            ref={cardRef}
            className="w-full max-w-md bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 text-white p-6 rounded-2xl border border-gray-800 shadow-2xl relative overflow-hidden"
          >
            {/* Background accent */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl" />

            <div className="relative z-10 space-y-4">
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-xs font-bold text-gray-950">
                    🚀
                  </div>
                  <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Smart Directory</span>
                </div>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${stage.bg} ${stage.text} border ${stage.border}`}>
                  {stage.icon} {stage.label}
                </span>
              </div>

              {/* Main Info */}
              <div className="flex items-start gap-4 pt-2">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg`}>
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-extrabold text-white truncate">{member.name}</h3>
                  <p className="text-xs text-emerald-400 font-medium truncate">{member.role}</p>
                  {member.location?.country && (
                    <p className="text-[11px] text-gray-400 mt-1">
                      {flag} {[member.location.city, member.location.country].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
              </div>

              {/* Business Description */}
              {member.business && (
                <div className="bg-gray-800/60 rounded-xl p-3 border border-gray-800">
                  <p className="text-[11px] text-gray-300 line-clamp-2 leading-relaxed">
                    💼 {member.business}
                  </p>
                </div>
              )}

              {/* Offerings snippet */}
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                {member.lookingFor && (
                  <div className="bg-blue-500/10 rounded-lg p-2 border border-blue-500/20">
                    <span className="font-bold text-blue-400 block mb-0.5">LOOKING FOR:</span>
                    <span className="text-gray-300 line-clamp-1">{member.lookingFor}</span>
                  </div>
                )}
                {member.canHelp && (
                  <div className="bg-emerald-500/10 rounded-lg p-2 border border-emerald-500/20">
                    <span className="font-bold text-emerald-400 block mb-0.5">CAN HELP WITH:</span>
                    <span className="text-gray-300 line-clamp-1">{member.canHelp}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between text-[10px] text-gray-500">
                <span>International Entrepreneurs Network</span>
                {member.phone && <span className="text-emerald-400 font-mono">{member.phone}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="flex justify-center gap-3">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="btn-primary"
          >
            <Download size={16} />
            {downloading ? 'Generating PNG...' : 'Download Card (PNG)'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
