import React, { useState } from 'react';
import { ArrowLeftRight, Plus, Trash2, MessageCircle, Clock, Check } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { addExchangePost, deleteExchangePost } from '../../utils/storage';
import { buildWhatsAppUrl, timeAgo } from '../../utils/helpers';
import Modal from '../common/Modal';

export default function SkillsExchange() {
  const { exchangePosts, refreshExchange, members, notify } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState('need'); // 'need' | 'offer'
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorPhone, setAuthorPhone] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title.trim() || !authorName.trim()) {
      notify('Title and Name are required', 'error');
      return;
    }
    addExchangePost({ type, title, description, authorName, authorPhone });
    refreshExchange();
    notify('Skill exchange request posted!');
    setShowModal(false);
    setTitle('');
    setDescription('');
    setAuthorName('');
    setAuthorPhone('');
  };

  const handleDelete = (id) => {
    deleteExchangePost(id);
    refreshExchange();
    notify('Post deleted');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="card p-6 sm:p-8 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-500/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-600 text-white rounded-2xl flex-shrink-0 shadow-lg shadow-emerald-600/20">
              <ArrowLeftRight size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Skills & Resource Exchange Board</h2>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
                Post short-term skill swaps, quick favors, or immediate needs (time-boxed noticeboard).
              </p>
            </div>
          </div>

          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus size={18} /> Post Request / Offer
          </button>
        </div>
      </div>

      {/* Grid of posts */}
      {exchangePosts.length === 0 ? (
        <div className="card p-12 text-center space-y-4">
          <div className="text-5xl">🤲</div>
          <h3 className="font-extrabold text-xl text-slate-900 dark:text-slate-100">No active posts on the board</h3>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Be the first to post a quick need or offer (e.g. "Need logo advice for 30 mins / Can offer accounting tips").
          </p>
          <button onClick={() => setShowModal(true)} className="btn-primary mx-auto">
            Post First Exchange
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exchangePosts.map((post) => {
            const waUrl = buildWhatsAppUrl(post.authorPhone);
            const isNeed = post.type === 'need';
            return (
              <div key={post.id} className={`card p-6 space-y-4 border-l-4 ${isNeed ? 'border-l-rose-500' : 'border-l-emerald-500'}`}>
                <div className="flex items-start justify-between gap-2">
                  <span className={`badge ${isNeed ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-400' : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400'} text-xs font-extrabold px-3 py-1`}>
                    {isNeed ? '🆘 I NEED HELP WITH' : '🎁 I CAN OFFER'}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <Clock size={14} /> {timeAgo(post.createdAt)}
                  </span>
                </div>

                <h4 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">{post.title}</h4>
                {post.description && <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">{post.description}</p>}

                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 text-sm">
                  <span className="font-extrabold text-slate-900 dark:text-slate-200">👤 {post.authorName}</span>
                  <div className="flex items-center gap-2">
                    {waUrl && (
                      <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-primary text-xs py-2 px-3.5">
                        <MessageCircle size={14} /> Chat on WhatsApp
                      </a>
                    )}
                    <button onClick={() => handleDelete(post.id)} className="p-2 hover:text-rose-600 text-slate-400 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Post Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Exchange Post" size="md">
        <form onSubmit={handleCreate} className="space-y-5">
          <div>
            <label className="label">Post Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('need')}
                className={`py-3 rounded-2xl text-xs font-extrabold border transition-all ${type === 'need' ? 'bg-rose-600 text-white border-rose-600 shadow-md' : 'bg-slate-100 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-400'}`}
              >
                🆘 I Need Help
              </button>
              <button
                type="button"
                onClick={() => setType('offer')}
                className={`py-3 rounded-2xl text-xs font-extrabold border transition-all ${type === 'offer' ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-slate-100 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-400'}`}
              >
                🎁 I Can Offer Help
              </button>
            </div>
          </div>

          <div>
            <label className="label">Title / Headline *</label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Need 20 mins feedback on pitch deck" />
          </div>

          <div>
            <label className="label">Details & Context</label>
            <textarea className="input resize-none" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Explain what you need or what you're willing to trade/offer..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Your Name *</label>
              <input className="input" value={authorName} onChange={(e) => setAuthorName(e.target.value)} placeholder="Maria Silva" />
            </div>
            <div>
              <label className="label">WhatsApp Number</label>
              <input className="input" value={authorPhone} onChange={(e) => setAuthorPhone(e.target.value)} placeholder="+551199999999" />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="submit" className="btn-primary">
              <Check size={16} /> Publish to Board
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
