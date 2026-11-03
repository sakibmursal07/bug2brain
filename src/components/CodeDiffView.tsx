import React, { useState } from 'react';
import { Columns, Eye, Check, Copy, Sparkles, AlertOctagon } from 'lucide-react';
import { SupportedLanguage } from '../types';

interface CodeDiffViewProps {
  originalCode: string;
  correctedCode: string;
  language: SupportedLanguage;
}

export const CodeDiffView: React.FC<CodeDiffViewProps> = ({
  originalCode,
  correctedCode,
  language
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'tabs'>('split');
  const [activeTab, setActiveTab] = useState<'corrected' | 'original'>('corrected');
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedCorrected, setCopiedCorrected] = useState(false);

  const copyCode = (text: string, type: 'original' | 'corrected') => {
    navigator.clipboard.writeText(text);
    if (type === 'original') {
      setCopiedOriginal(true);
      setTimeout(() => setCopiedOriginal(false), 2000);
    } else {
      setCopiedCorrected(true);
      setTimeout(() => setCopiedCorrected(false), 2000);
    }
  };

  const renderCodeBlock = (code: string, isCorrected: boolean) => {
    const lines = code.split('\n');
    return (
      <div className="flex font-mono text-xs sm:text-sm leading-6 overflow-x-auto min-h-[200px]">
        {/* Line numbers */}
        <div className="select-none py-3 px-3 bg-slate-950/90 text-slate-600 text-right font-mono border-r border-slate-800 flex flex-col min-w-[40px]">
          {lines.map((_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
        </div>
        {/* Code Content */}
        <div className="p-3 flex-1 overflow-x-auto whitespace-pre">
          {lines.map((line, idx) => {
            const isHighlight = isCorrected && (
              line.includes('if (') || 
              line.includes('Optional') || 
              line.includes('??') || 
              line.includes('?.') ||
              line.includes('enumerate') ||
              line.includes('.back()') ||
              line.includes('// Added') ||
              line.includes('// Guard') ||
              line.includes('// Safe')
            );
            return (
              <div 
                key={idx} 
                className={`${isHighlight ? 'bg-emerald-500/10 text-emerald-200 px-1 -mx-1 rounded' : 'text-slate-200'}`}
              >
                {line || ' '}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
      {/* Diff Toolbar */}
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Interactive Code Comparison
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
            {language}
          </span>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
              viewMode === 'split' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Side by Side</span>
            <span className="sm:hidden">Split</span>
          </button>
          <button
            onClick={() => setViewMode('tabs')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
              viewMode === 'tabs' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Tabbed</span>
          </button>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'split' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          {/* Left: Original with Bug */}
          <div className="flex flex-col">
            <div className="px-4 py-2 border-b border-slate-800/80 bg-rose-950/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-rose-400 font-semibold">
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Original (Buggy Code)</span>
              </div>
              <button
                onClick={() => copyCode(originalCode, 'original')}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
                title="Copy original code"
              >
                {copiedOriginal ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            {renderCodeBlock(originalCode, false)}
          </div>

          {/* Right: Corrected */}
          <div className="flex flex-col">
            <div className="px-4 py-2 border-b border-slate-800/80 bg-emerald-950/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Corrected Solution</span>
              </div>
              <button
                onClick={() => copyCode(correctedCode, 'corrected')}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
                title="Copy corrected code"
              >
                {copiedCorrected ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            {renderCodeBlock(correctedCode, true)}
          </div>
        </div>
      ) : (
        <div>
          {/* Tab buttons */}
          <div className="flex border-b border-slate-800 bg-slate-900/40 px-4 pt-2 gap-2 text-xs">
            <button
              onClick={() => setActiveTab('corrected')}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold border-t border-x transition-all ${
                activeTab === 'corrected'
                  ? 'bg-slate-950 text-emerald-400 border-slate-800 border-b-transparent -mb-[1px]'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Corrected Solution (Recommended)</span>
            </button>
            <button
              onClick={() => setActiveTab('original')}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold border-t border-x transition-all ${
                activeTab === 'original'
                  ? 'bg-slate-950 text-rose-400 border-slate-800 border-b-transparent -mb-[1px]'
                  : 'text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Original (With Bug)</span>
            </button>
          </div>

          <div className="p-1">
            {activeTab === 'corrected' 
              ? renderCodeBlock(correctedCode, true)
              : renderCodeBlock(originalCode, false)}
          </div>
        </div>
      )}
    </div>
  );
};
