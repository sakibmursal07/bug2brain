import React, { useState } from 'react';
import { Copy, Check, Trash2, Code2 } from 'lucide-react';
import { SupportedLanguage } from '../types';

interface CodeEditorProps {
  value: string;
  onChange?: (val: string) => void;
  language: SupportedLanguage;
  readOnly?: boolean;
  label?: string;
  placeholder?: string;
  heightClass?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  readOnly = false,
  label,
  placeholder,
  heightClass = 'min-h-[220px]'
}) => {
  const [copied, setCopied] = useState(false);

  const lines = value ? value.split('\n') : [''];

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (onChange) onChange('');
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden shadow-inner flex flex-col">
      {/* Top toolbar */}
      <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            {label || `${language} snippet`}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-500 font-mono mr-2 hidden sm:inline">
            {lines.length} {lines.length === 1 ? 'line' : 'lines'}
          </span>

          <button
            onClick={handleCopy}
            title="Copy code"
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {!readOnly && value && (
            <button
              onClick={handleClear}
              title="Clear editor"
              className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Editor Body with Line Numbers */}
      <div className={`relative flex font-mono text-xs sm:text-sm leading-relaxed ${heightClass}`}>
        {/* Line Numbers gutter */}
        <div className="select-none py-3 px-3 bg-slate-950/90 text-slate-600 text-right font-mono border-r border-slate-850/60 flex flex-col min-w-[42px]">
          {lines.map((_, i) => (
            <span key={i} className="leading-6">
              {i + 1}
            </span>
          ))}
        </div>

        {/* Text area or read-only pre */}
        <div className="flex-1 relative overflow-auto">
          {readOnly ? (
            <pre className="p-3 text-slate-200 font-mono leading-6 overflow-x-auto m-0 whitespace-pre">
              <code>{value}</code>
            </pre>
          ) : (
            <textarea
              value={value}
              onChange={(e) => onChange && onChange(e.target.value)}
              placeholder={placeholder || 'Paste your code snippet here...'}
              spellCheck={false}
              className="w-full h-full p-3 bg-transparent text-slate-200 font-mono leading-6 outline-none resize-none placeholder-slate-600 focus:ring-0 overflow-x-auto whitespace-pre selection:bg-indigo-500/30"
              style={{ minHeight: '200px' }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
