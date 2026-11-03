import React, { useState } from 'react';
import { X, Key, ShieldCheck, ExternalLink, Sparkles, Check, Trash2 } from 'lucide-react';
import { getStoredApiKey, getStoredModel, setStoredApiKey, setStoredModel } from '../services/storageService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeySaved }) => {
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [model, setModel] = useState(getStoredModel());
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setStoredApiKey(apiKey);
    setStoredModel(model);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onKeySaved();
      onClose();
    }, 600);
  };

  const handleClear = () => {
    setStoredApiKey('');
    setApiKey('');
    onKeySaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Gemini API Settings</h3>
              <p className="text-xs text-slate-400">Power custom real-time error breakdowns</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Direct Browser Security</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Your API key stays stored solely inside your local browser storage. It is never logged or sent to any third-party server.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-slate-950 border border-slate-750 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all pr-10 font-mono"
              />
              <Key className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500">Need a free key?</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium hover:underline"
              >
                <span>Get key from Google AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Model Preference
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-3.5 py-2 text-sm text-slate-200 outline-none cursor-pointer"
            >
              <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended — Fast & Deep Reasoning)</option>
              <option value="gemini-3.5-flash-lite">gemini-3.5-flash-lite (Ultra-fast & Lightweight)</option>
            </select>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
          {apiKey ? (
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 px-2.5 py-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Key</span>
            </button>
          ) : (
            <span className="text-xs text-slate-500 italic">No key = Offline demo presets</span>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-lg ${
                isSaved
                  ? 'bg-emerald-600'
                  : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95 shadow-indigo-500/25'
              }`}
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Key</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
