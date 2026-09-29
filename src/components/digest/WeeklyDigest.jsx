import React, { useState } from 'react';
import { FileText, Copy, Sparkles, Check, Send } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { generateWeeklyDigest } from '../../utils/gemini';
import { isWithinDays, copyToClipboard } from '../../utils/helpers';
import LoadingSpinner from '../common/LoadingSpinner';

export default function WeeklyDigest() {
  const { activeMembers: members, apiKey, notify } = useApp();
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [digestText, setDigestText] = useState('');
  const [copied, setCopied] = useState(false);

  const recentMembers = members.filter((m) => isWithinDays(m.createdAt, days));

  const handleGenerate = async () => {
    if (recentMembers.length === 0) {
      notify(`No new members added in the last ${days} days`, 'warning');
      return;
    }
    setLoading(true);
    try {
      if (apiKey) {
        const text = await generateWeeklyDigest(recentMembers, `${days} days`);
        setDigestText(text);
      } else {
        const lines = [
          `🌟 *NEW MEMBERS ROUNDUP (Last ${days} Days)* 🌟\n`,
          `Welcome our newest entrepreneurs to the community! Take a moment to reach out:\n`,
        ];
        recentMembers.forEach((m) => {
          lines.push(
            `• *${m.name}* (${m.location?.city || m.location?.country || 'Global'}) — _${m.role}_`
          );
          if (m.lookingFor) lines.push(`  🔍 LF: ${m.lookingFor}`);
          lines.push('');
        });
        lines.push('💬 Say hello and explore synergies in our community directory!');
        setDigestText(lines.join('\n'));
      }
    } catch (err) {
      console.error(err);
      notify('Failed to generate digest text', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await copyToClipboard(digestText);
    setCopied(true);
    notify('Weekly digest copied! Ready to paste into WhatsApp');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="card p-6 sm:p-8 bg-gradient-to-r from-emerald-500/10 via-blue-500/5 to-transparent border-emerald-500/30">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-600 text-white rounded-2xl flex-shrink-0 shadow-lg shadow-emerald-600/20">
            <FileText size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              WhatsApp Weekly Digest Generator
            </h2>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
              Auto-generate formatted WhatsApp announcement messages listing new community members
              for your group chat.
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="card p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <label className="label mb-0">Period:</label>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="input py-2 px-4 text-sm font-bold w-auto"
            >
              <option value={7}>Last 7 Days</option>
              <option value={14}>Last 14 Days</option>
              <option value={30}>Last 30 Days</option>
            </select>
          </div>

          <div className="text-sm font-bold text-slate-600 dark:text-slate-400">
            Found{' '}
            <strong className="text-emerald-600 dark:text-emerald-400">
              {recentMembers.length}
            </strong>{' '}
            new member(s)
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || recentMembers.length === 0}
          className="btn-primary"
        >
          {loading ? <LoadingSpinner size="sm" /> : <Sparkles size={18} />}
          {loading ? 'Formatting Digest with AI...' : 'Generate WhatsApp Digest Message'}
        </button>
      </div>

      {/* Digest Output */}
      {digestText && (
        <div className="card p-6 sm:p-8 space-y-5 animate-slide-up">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3 className="font-extrabold text-base uppercase tracking-wider text-slate-900 dark:text-slate-100">
              📲 Ready-to-Post WhatsApp Message
            </h3>
            <button onClick={handleCopy} className="btn-primary text-xs py-2 px-4">
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied to Clipboard!' : 'Copy WhatsApp Format'}
            </button>
          </div>

          <textarea
            rows={11}
            value={digestText}
            onChange={(e) => setDigestText(e.target.value)}
            className="input font-mono text-sm leading-relaxed p-5 bg-slate-950/90 text-slate-100"
          />
        </div>
      )}
    </div>
  );
}
