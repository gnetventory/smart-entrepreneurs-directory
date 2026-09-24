import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { copyToClipboard } from '../../utils/helpers';

export default function IntroGuide({ onUseTemplate }) {
  const { notify } = useApp();
  const [isOpen, setIsOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const templateText = `- Name: Maria Silva
- What do you do?: Digital marketer & growth consultant
- Business / project: EcoDeliver – Sustainable packaging delivery startup
- Location: São Paulo, Brazil
- Where are you currently?: Starting (just launched MVP)
- What are you looking for right now?: Co-founder with technical skills or beta testers
- What can you help others with?: Social media ads, brand strategy, local supplier connections`;

  const handleCopyTemplate = async () => {
    await copyToClipboard(templateText);
    setCopied(true);
    notify('Template copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const examples = [
    { field: '1. Name', description: 'Your full name or community handle.', example: '"Maria Silva" or "Ahmed Hassan"', color: 'border-l-purple-500' },
    { field: '2. What do you do?', description: 'Your role or profession in 1 line.', example: '"I am a digital marketer" or "I build mobile apps & AI solutions"', color: 'border-l-blue-500' },
    { field: '3. Business / project', description: 'Name of your startup or project + pitch.', example: '"EcoDeliver - Sustainable packaging startup" or "Design agency"', color: 'border-l-emerald-500' },
    { field: '4. Location', description: 'Current City and Country.', example: '"Cairo, Egypt" or "São Paulo, Brazil"', color: 'border-l-teal-500' },
    { field: '5. Stage', description: 'Idea / Starting / Running / Growing', example: '"Starting (just launched MVP)" or "Growing (scaling sales)"', color: 'border-l-amber-500' },
    { field: '6. Looking for', description: 'Immediate needs (co-founder, beta testers, funding).', example: '"Looking for a technical co-founder or beta testers for app"', color: 'border-l-rose-500' },
    { field: '7. Can help with', description: 'Skills or connections you can share back.', example: '"I can help with social media ads, brand strategy, and suppliers"', color: 'border-l-indigo-500' },
  ];

  return (
    <div className="card overflow-hidden border-emerald-500/30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent hover:from-emerald-500/15 transition-colors"
      >
        <div className="flex items-center gap-4 text-left">
          <div className="p-3 bg-emerald-600 text-white rounded-2xl flex-shrink-0 shadow-lg shadow-emerald-600/20">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-lg sm:text-xl">
              "How to Write Your Intro" Guide & Community Template
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 font-semibold">
              Designed for non-native English speakers — follow these 7 simple fields to introduce yourself!
            </p>
          </div>
        </div>
        {isOpen ? <ChevronUp size={22} className="text-slate-500 dark:text-slate-400" /> : <ChevronDown size={22} className="text-slate-500 dark:text-slate-400" />}
      </button>

      {isOpen && (
        <div className="p-6 sm:p-8 border-t border-slate-200 dark:border-slate-800 space-y-6 animate-fade-in">
          {/* Template Copy Box */}
          <div className="bg-slate-950 dark:bg-slate-950 rounded-2xl p-6 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
                📋 COMMUNITY INTRO TEMPLATE (READY TO COPY & PASTE)
              </span>
              <div className="flex items-center gap-2">
                {onUseTemplate && (
                  <button
                    onClick={() => onUseTemplate(templateText)}
                    className="btn-secondary text-xs py-2 px-4"
                  >
                    Paste into AI Parser
                  </button>
                )}
                <button
                  onClick={handleCopyTemplate}
                  className="btn-primary text-xs py-2 px-4"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy Template'}
                </button>
              </div>
            </div>
            <pre className="text-sm font-mono text-slate-200 whitespace-pre-wrap leading-relaxed bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              {templateText}
            </pre>
          </div>

          {/* Examples Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">FIELD-BY-FIELD EXAMPLES:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {examples.map((ex, idx) => (
                <div key={idx} className={`p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 border-l-4 ${ex.color} space-y-2`}>
                  <h5 className="font-extrabold text-base text-slate-900 dark:text-slate-100">{ex.field}</h5>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">{ex.description}</p>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 border border-slate-200 dark:border-slate-800 shadow-xs">
                    💡 Example: {ex.example}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
