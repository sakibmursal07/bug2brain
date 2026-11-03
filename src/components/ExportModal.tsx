import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  Upload, 
  Printer, 
  BookMarked,
  Sparkles 
} from 'lucide-react';
import { MistakeRecord } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: MistakeRecord[];
  onImportHistory: (imported: MistakeRecord[]) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  history,
  onImportHistory
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'studyGuide' | 'backup'>('studyGuide');

  if (!isOpen) return null;

  const generateMarkdownGuide = () => {
    let md = `# 🧠 Bug2Brain — Personal Error Revision Sheet\n\n`;
    md += `*Generated on ${new Date().toLocaleDateString()} | Total Errors Logged: ${history.length}*\n\n`;
    md += `> "A programmer who understands their errors never makes the same mistake twice."\n\n---\n\n`;

    if (history.length === 0) {
      md += `*No mistakes logged yet. Analyze an error in the Inspector to populate your study sheet!*\n`;
      return md;
    }

    history.forEach((record, index) => {
      md += `## ${index + 1}. [${record.language.toUpperCase()}] ${record.title}\n\n`;
      md += `**Category:** ${record.errorCategory}  \n`;
      md += `**Status:** ${record.mastered ? '✅ Mastered' : '⏳ In Practice'}\n\n`;
      md += `### Why It Failed (Summary)\n${record.summary}\n\n`;
      md += `### Buggy Code\n\`\`\`${record.language}\n${record.originalCode}\n\`\`\`\n\n`;
      md += `### Corrected Solution\n\`\`\`${record.language}\n${record.correctedCode}\n\`\`\`\n\n`;
      md += `---\n\n`;
    });

    return md;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdownGuide());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            alert(`Successfully imported ${parsed.length} mistake records!`);
            onClose();
          } else {
            alert('Invalid backup file format.');
          }
        } catch (err) {
          alert('Failed to parse backup JSON file.');
        }
      };
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Study Sheet & Journal Sync</h3>
              <p className="text-xs text-slate-400">Export revision cheat sheets or backup your error history</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 gap-3 text-xs">
          <button
            onClick={() => setActiveTab('studyGuide')}
            className={`py-3 font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'studyGuide'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Revision Cheat Sheet ({history.length} errors)</span>
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`py-3 font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'backup'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>JSON Backup & Sync</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'studyGuide' ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-400">
                  Formatted for Notion, Obsidian, GitHub, or Print
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-950 text-slate-300 border border-slate-800 hover:text-white hover:border-slate-700"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                  <button
                    onClick={handleCopyMarkdown}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-950 text-slate-300 border border-slate-800 hover:text-white hover:border-slate-700"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
                  </button>
                  <button
                    onClick={handleDownloadMarkdown}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .md</span>
                  </button>
                </div>
              </div>

              {/* Markdown Preview Area */}
              <div className="rounded-xl border border-slate-850 bg-slate-950 p-4 font-mono text-xs text-slate-300 max-h-80 overflow-y-auto whitespace-pre leading-relaxed select-text">
                {generateMarkdownGuide()}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-slate-850 bg-slate-950/60 space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-indigo-400" />
                  <span>Export JSON Backup</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Download all your recorded coding mistakes and mastery statistics as an offline JSON backup.
                </p>
                <button
                  onClick={handleExportJson}
                  className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white text-xs font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Backup ({history.length} records)</span>
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-850 bg-slate-950/60 space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Restore from Backup</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Select a previously downloaded Bug2Brain JSON backup to restore your history.
                </p>
                <label className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload JSON File</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJson}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/60 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
