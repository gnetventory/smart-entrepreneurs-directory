import React, { useState } from 'react';
import { Sparkles, MessageCircle, UserCheck, AlertCircle, Copy } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { generateMatches, generateOutreachMessage } from '../../utils/gemini';
import { getInitials, getAvatarGradient, buildWhatsAppUrl } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../common/Modal';

export default function AIMatchmaker() {
  const { members, apiKey, notify } = useApp();
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [outreachModal, setOutreachModal] = useState({ isOpen: false, match: null, message: '', loading: false });

  const targetMember = members.find((m) => m.id === selectedMemberId);

  const handleFindMatches = async () => {
    if (!targetMember || !apiKey) return;
    setLoading(true);
    setMatches([]);
    try {
      const results = await generateMatches(targetMember, members);
      setMatches(results);
      if (results.length === 0) {
        notify('No suitable matches found in the current directory', 'info');
      }
    } catch (err) {
      console.error(err);
      notify('Matchmaking failed: ' + (err.message || 'Check Gemini API Key'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenOutreach = async (matchItem) => {
    setOutreachModal({ isOpen: true, match: matchItem.member, message: '', loading: true });
    try {
      const msg = await generateOutreachMessage(targetMember, matchItem.member);
      setOutreachModal((prev) => ({ ...prev, message: msg, loading: false }));
    } catch (err) {
      console.error(err);
      setOutreachModal((prev) => ({
        ...prev,
        message: `Hi ${matchItem.member.name}, I saw your profile in the Entrepreneurs Directory! I run ${targetMember.business} and would love to connect.`,
        loading: false,
      }));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      {/* Header Banner */}
      <div className="card p-6 sm:p-8 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-500/30">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-600 text-white rounded-2xl flex-shrink-0 shadow-sm">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white tracking-tight">AI Collaboration Matchmaker</h2>
            <p className="text-sm font-semibold text-stone-600 dark:text-stone-400 mt-0.5">
              Select a member profile to generate top 5 personalized "You Should Meet..." peer recommendations.
            </p>
          </div>
        </div>
      </div>

      {!apiKey && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-3 text-sm font-semibold text-amber-900 dark:text-amber-300">
          <AlertCircle size={18} />
          AI Matchmaking requires a Gemini API Key in Admin → Settings.
        </div>
      )}

      {/* Select member dropdown */}
      <div className="card p-6 sm:p-8 space-y-5">
        <div>
          <label className="label">Select Member to Match</label>
          <select
            value={selectedMemberId}
            onChange={(e) => { setSelectedMemberId(e.target.value); setMatches([]); }}
            className="input text-base font-bold py-3.5"
          >
            <option value="">-- Choose a member profile --</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.role} · {m.location?.city || m.location?.country || 'Global'})
              </option>
            ))}
          </select>
        </div>

        {targetMember && (
          <div className="p-5 bg-stone-50 dark:bg-stone-950 rounded-2xl text-sm space-y-2 border border-stone-200 dark:border-stone-800">
            <div className="font-extrabold text-stone-900 dark:text-stone-100 text-base">Selected Profile: {targetMember.name}</div>
            <p className="text-stone-700 dark:text-stone-300 font-semibold"><strong className="text-sky-700 dark:text-sky-400">Looking For:</strong> {targetMember.lookingFor || 'Not specified'}</p>
            <p className="text-stone-700 dark:text-stone-300 font-semibold"><strong className="text-emerald-700 dark:text-emerald-400">Can Help With:</strong> {targetMember.canHelp || 'Not specified'}</p>
          </div>
        )}

        <button
          onClick={handleFindMatches}
          disabled={loading || !selectedMemberId || !apiKey}
          className="btn-primary"
        >
          {loading ? <LoadingSpinner size="sm" /> : <Sparkles size={18} />}
          {loading ? `Analyzing synergy across ${members.length - 1} profiles...` : 'Find Matches with AI'}
        </button>
      </div>

      {/* Match Results */}
      {matches.length > 0 && (
        <div className="space-y-4 animate-slide-up">
          <h3 className="font-extrabold text-xl text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <UserCheck className="text-emerald-600 dark:text-emerald-400" size={24} /> Top AI Matches for {targetMember.name}
          </h3>

          <div className="space-y-4">
            {matches.map((item, idx) => {
              const m = item.member;
              const waUrl = buildWhatsAppUrl(m.phone);
              const scorePercent = (item.score / 10) * 100;
              return (
                <div key={idx} className="card p-6 space-y-4 border-l-4 border-l-emerald-500">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getAvatarGradient(m.name)} flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-sm`}>
                        {getInitials(m.name)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xl text-stone-900 dark:text-stone-100">{m.name}</h4>
                        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{m.role} · {m.location?.city}, {m.location?.country}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="badge bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 text-sm font-extrabold px-3 py-1">
                        {item.score}/10 Match Score
                      </span>
                      <div className="w-24 h-1.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${scorePercent}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl text-sm space-y-1.5 border border-emerald-200 dark:border-emerald-500/20">
                    <div className="font-extrabold text-emerald-900 dark:text-emerald-300">💡 Synergy: {item.headline}</div>
                    <p className="text-emerald-950 dark:text-emerald-200 leading-relaxed font-semibold">{item.reason}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
                    <div className="text-sm font-semibold text-stone-600 dark:text-stone-400">
                      💼 {m.business}
                    </div>
                    <button
                      onClick={() => handleOpenOutreach(item)}
                      className="btn-primary text-xs py-2 px-4"
                    >
                      <MessageCircle size={15} /> Draft AI WhatsApp Outreach
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Outreach Modal */}
      <Modal
        isOpen={outreachModal.isOpen}
        onClose={() => setOutreachModal({ isOpen: false, match: null, message: '', loading: false })}
        title={`Draft Intro Message to ${outreachModal.match?.name}`}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-xs font-semibold text-stone-500">
            Gemini drafted this personalized outreach message based on your mutual needs and offers:
          </p>

          {outreachModal.loading ? (
            <div className="py-8 flex justify-center">
              <LoadingSpinner text="Drafting personalized message..." />
            </div>
          ) : (
            <textarea
              rows={6}
              value={outreachModal.message}
              onChange={(e) => setOutreachModal((prev) => ({ ...prev, message: e.target.value }))}
              className="input font-mono text-sm leading-relaxed"
            />
          )}

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                navigator.clipboard.writeText(outreachModal.message);
                notify('Message copied to clipboard!');
              }}
              className="btn-secondary text-xs"
            >
              <Copy size={15} /> Copy Message
            </button>
            {buildWhatsAppUrl(outreachModal.match?.phone) && (
              <a
                href={`${buildWhatsAppUrl(outreachModal.match?.phone)}?text=${encodeURIComponent(outreachModal.message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs"
              >
                <MessageCircle size={15} /> Send on WhatsApp
              </a>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
