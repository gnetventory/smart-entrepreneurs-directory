import React, { useState } from 'react';
import { Sparkles, FileText, Upload, Check, AlertCircle, RefreshCw, UserPlus } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { parseIntro, bulkParseChat } from '../../utils/gemini';
import { addMembers } from '../../utils/storage';
import IntroGuide from '../guide/IntroGuide';
import ManualForm from './ManualForm';
import LoadingSpinner from '../common/LoadingSpinner';

export default function AIParser() {
  const { apiKey, notify, refreshMembers, setActiveTab } = useApp();
  const [mode, setMode] = useState('single'); // 'single' | 'bulk' | 'manual'
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsedResult, setParsedResult] = useState(null);
  const [bulkResults, setBulkResults] = useState([]);
  const [error, setError] = useState(null);

  const handleParseSingle = async () => {
    if (!rawText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await parseIntro(rawText);
      setParsedResult({ ...data, originalText: rawText });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to parse text. Please check your Gemini API key in Settings or try manual entry.');
    } finally {
      setLoading(false);
    }
  };

  const handleParseBulk = async () => {
    if (!rawText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const results = await bulkParseChat(rawText);
      setBulkResults(results);
      if (results.length === 0) {
        notify('No introduction messages detected in the text', 'warning');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Bulk parsing failed. Check your API key or input format.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBulk = () => {
    if (bulkResults.length === 0) return;
    const added = addMembers(bulkResults);
    refreshMembers();
    notify(`Imported ${added.length} new member profiles! 🎉`);
    setBulkResults([]);
    setRawText('');
    setActiveTab('directory');
  };

  const handleUseTemplate = (template) => {
    setRawText(template);
    setMode('single');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Intro Guide */}
      <IntroGuide onUseTemplate={handleUseTemplate} />

      {/* Tabs & Form Card */}
      <div className="card p-6 sm:p-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4 overflow-x-auto">
          <button
            onClick={() => { setMode('single'); setParsedResult(null); setError(null); }}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-extrabold transition-all whitespace-nowrap ${
              mode === 'single'
                ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Sparkles size={18} /> Single Intro AI Parser
          </button>
          <button
            onClick={() => { setMode('bulk'); setBulkResults([]); setError(null); }}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-extrabold transition-all whitespace-nowrap ${
              mode === 'bulk'
                ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Upload size={18} /> Bulk Chat Import (AI)
          </button>
          <button
            onClick={() => { setMode('manual'); setError(null); }}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-extrabold transition-all whitespace-nowrap ${
              mode === 'manual'
                ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <UserPlus size={18} /> Manual Form
          </button>
        </div>

        {/* API Warning if not set */}
        {!apiKey && mode !== 'manual' && (
          <div className="p-5 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl flex items-start gap-3.5">
            <AlertCircle className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm font-semibold text-amber-900 dark:text-amber-300 leading-relaxed">
              <strong>Gemini API Key Required for AI Features:</strong> Get a free key at{' '}
              <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="underline font-extrabold">
                aistudio.google.com
              </a>{' '}
              and save it in <strong>Admin → Settings</strong>. Or use the <strong>Manual Form</strong> tab above offline without a key!
            </div>
          </div>
        )}

        {error && (
          <div className="p-5 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-2xl text-sm font-semibold text-rose-800 dark:text-rose-300">
            {error}
          </div>
        )}

        {/* Mode 1: Single AI Parser */}
        {mode === 'single' && (
          <div className="space-y-5">
            <div>
              <label className="label">Paste WhatsApp Introduction Text</label>
              <textarea
                rows={7}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste member introduction text here — even if grammar is broken, incomplete, or written in another language! AI will clean and translate it."
                className="input resize-none font-mono text-sm leading-relaxed p-4"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleParseSingle}
                disabled={loading || !rawText.trim() || !apiKey}
                className="btn-primary"
              >
                {loading ? <LoadingSpinner size="sm" /> : <Sparkles size={18} />}
                {loading ? 'AI Parsing & Cleaning...' : 'Parse & Clean with AI'}
              </button>
              {rawText && (
                <button onClick={() => setRawText('')} className="btn-secondary">
                  Clear Text
                </button>
              )}
            </div>

            {/* Parsed Result Review */}
            {parsedResult && (
              <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-slide-up">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-xl text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Check className="text-emerald-500" size={22} /> Review AI Parsed Profile
                  </h3>
                  <span className="text-xs font-semibold text-slate-500">Review & edit before adding</span>
                </div>
                <ManualForm
                  initialData={parsedResult}
                  onSaved={() => {
                    setParsedResult(null);
                    setRawText('');
                    setActiveTab('directory');
                  }}
                  onCancel={() => setParsedResult(null)}
                />
              </div>
            )}
          </div>
        )}

        {/* Mode 2: Bulk Chat Import */}
        {mode === 'bulk' && (
          <div className="space-y-5">
            <div>
              <label className="label">Paste Exported WhatsApp Chat Log (.txt text)</label>
              <textarea
                rows={9}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste your exported WhatsApp chat history here. AI will scan through messages and extract all member introductions automatically!"
                className="input resize-none font-mono text-sm leading-relaxed p-4"
              />
            </div>

            <button
              onClick={handleParseBulk}
              disabled={loading || !rawText.trim() || !apiKey}
              className="btn-primary"
            >
              {loading ? <LoadingSpinner size="sm" /> : <Upload size={18} />}
              {loading ? 'AI Scanning Chat Log...' : 'Scan Chat & Extract Intros'}
            </button>

            {/* Bulk Results Preview */}
            {bulkResults.length > 0 && (
              <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6 animate-slide-up">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <h3 className="font-extrabold text-xl text-slate-900 dark:text-slate-100">
                    Extracted {bulkResults.length} Member Profiles
                  </h3>
                  <button onClick={handleSaveBulk} className="btn-primary">
                    <Check size={18} /> Import All ({bulkResults.length}) to Directory
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto p-1">
                  {bulkResults.map((res, idx) => (
                    <div key={idx} className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm space-y-2">
                      <div className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                        <span>{res.name || 'Unnamed Member'}</span>
                        <span className="badge bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 font-bold">{res.stage}</span>
                      </div>
                      <p className="text-emerald-600 dark:text-emerald-400 font-bold">{res.role}</p>
                      <p className="text-slate-700 dark:text-slate-300 font-medium">💼 {res.business}</p>
                      {res.location?.country && <p className="text-slate-500 font-semibold">📍 {res.location.city}, {res.location.country}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mode 3: Manual Form */}
        {mode === 'manual' && (
          <ManualForm
            onSaved={() => setActiveTab('directory')}
          />
        )}
      </div>
    </div>
  );
}
