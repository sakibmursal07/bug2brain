import React, { useState } from 'react';
import { 
  X, 
  Key, 
  Palette, 
  Volume2, 
  VolumeX, 
  Download, 
  Upload, 
  FileText, 
  Printer, 
  ShieldCheck, 
  ExternalLink, 
  Check, 
  Trash2,
  Sparkles
} from 'lucide-react';
import { MistakeRecord } from '../types';
import { getStoredApiKey, getStoredModel, setStoredApiKey, setStoredModel } from '../services/storageService';
import { AppTheme, applyThemeClass, getStoredTheme } from './ThemeCustomizer';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasApiKey: boolean;
  onKeySaved: () => void;
  isSpeechActive: boolean;
  onToggleSpeech: () => void;
  history: MistakeRecord[];
  onImportHistory: (imported: MistakeRecord[]) => void;
  onThemeChanged: (theme: AppTheme) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  hasApiKey,
  onKeySaved,
  isSpeechActive,
  onToggleSpeech,
  history,
  onImportHistory,
  onThemeChanged
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'ai' | 'backup'>('general');
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [model, setModel] = useState(getStoredModel());
  const [currentTheme, setCurrentTheme] = useState<AppTheme>(getStoredTheme());
  const [isSaved, setIsSaved] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

  if (!isOpen) return null;

  const handleSaveApiKey = () => {
    setStoredApiKey(apiKey);
    setStoredModel(model);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onKeySaved();
    }, 600);
  };

  const handleClearApiKey = () => {
    setStoredApiKey('');
    setApiKey('');
    onKeySaved();
  };

  const handleSelectTheme = (themeId: AppTheme) => {
    setCurrentTheme(themeId);
    applyThemeClass(themeId);
    onThemeChanged(themeId);
  };

  const generateMarkdownGuide = () => {
    let md = `# 🧠 Bug2Brain — Personal Error Revision Sheet\n\n`;
    md += `*Generated on ${new Date().toLocaleDateString()} | Total Errors Logged: ${history.length}*\n\n---\n\n`;

    if (history.length === 0) {
      md += `*No mistakes logged yet. Analyze an error in the Inspector to populate your study sheet!*\n`;
      return md;
    }

    history.forEach((record, index) => {
      md += `## ${index + 1}. [${record.language.toUpperCase()}] ${record.title}\n\n`;
      md += `**Category:** ${record.errorCategory} | **Status:** ${record.mastered ? 'Mastered' : 'In Practice'}\n\n`;
      md += `### Why It Failed\n${record.summary}\n\n`;
      md += `### Buggy Code\n\`\`\`${record.language}\n${record.originalCode}\n\`\`\`\n\n`;
      md += `### Corrected Solution\n\`\`\`${record.language}\n${record.correctedCode}\n\`\`\`\n\n`;
      md += `---\n\n`;
    });

    return md;
  };

  const handleDownloadMarkdown = () => {
    const text = generateMarkdownGuide();
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Bug2Brain-Study-Guide-${Date.now()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJson = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bug2brain-backup-${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            onImportHistory(parsed);
            alert(`Imported ${parsed.length} mistake records.`);
          } else {
            alert('Invalid backup file.');
          }
        } catch {
          alert('Failed to parse backup JSON.');
        }
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div>
            <h3 className="text-base font-bold text-white">Settings & Preferences</h3>
            <p className="text-xs text-slate-400">Manage appearance, AI engine, and data backups</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Pills */}
        <div className="flex border-b border-slate-800 bg-slate-950/20 px-6 gap-2 text-xs pt-2">
          <button
            onClick={() => setActiveTab('general')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-all ${
              activeTab === 'general'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Appearance & Audio
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'ai'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Gemini AI Engine</span>
            {hasApiKey && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-all ${
              activeTab === 'backup'
                ? 'border-indigo-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Data & Study Sheet
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* Theme Selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Workspace Theme</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'midnight', name: 'Midnight Indigo', desc: 'Classic dark IDE' },
                    { id: 'cyberpunk', name: 'Cyberpunk Neon', desc: 'Vibrant violet & pink' },
                    { id: 'matrix', name: 'Matrix Terminal', desc: 'Phosphor hacker green' },
                    { id: 'nordic', name: 'Nordic Frost', desc: 'Arctic cyan & slate' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleSelectTheme(t.id as AppTheme)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        currentTheme === t.id
                          ? 'border-indigo-500 bg-indigo-950/30 text-white ring-1 ring-indigo-500'
                          : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{t.name}</div>
                      <div className="text-[11px] text-slate-500">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Audio Toggle */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    {isSpeechActive ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                    <span>Voice Narration (Text-to-Speech)</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Read explanations aloud using your browser's speech synthesizer
                  </p>
                </div>
                <button
                  onClick={onToggleSpeech}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    isSpeechActive
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {isSpeechActive ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Secure & Private</span>
                </div>
                <p className="text-slate-400">
                  Your key is stored only in your local browser storage. If left empty, Bug2Brain uses the built-in dynamic local analysis engine.
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
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono text-white placeholder-slate-600 outline-none pr-10"
                  />
                  <Key className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Need a free key?</span>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium hover:underline"
                  >
                    <span>Get free key from Google AI Studio</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Model Engine
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 outline-none cursor-pointer"
                >
                  <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended — Deep reasoning)</option>
                  <option value="gemini-3.5-flash-lite">gemini-3.5-flash-lite (Fastest execution)</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-2">
                {apiKey ? (
                  <button
                    onClick={handleClearApiKey}
                    className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Key</span>
                  </button>
                ) : <span />}

                <button
                  onClick={handleSaveApiKey}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30"
                >
                  {isSaved ? <Check className="w-3.5 h-3.5" /> : null}
                  <span>{isSaved ? 'Saved!' : 'Save Key'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Revision Study Sheet (.md)</h4>
                  <p className="text-xs text-slate-400">Download formatted notes of all your recorded errors</p>
                </div>
                <button
                  onClick={handleDownloadMarkdown}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Download .md</span>
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">JSON Error Backup</h4>
                  <p className="text-xs text-slate-400">Export or restore your full Mistake DNA history</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportJson}
                    className="p-2 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                    title="Export JSON"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <label className="p-2 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer" title="Import JSON">
                    <Upload className="w-4 h-4" />
                    <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/60 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
