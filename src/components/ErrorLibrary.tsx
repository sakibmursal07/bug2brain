import React, { useState } from 'react';
import { BookOpen, ArrowRight, Sparkles, Filter, Code2, AlertCircle } from 'lucide-react';
import { PRESET_ERRORS, PresetError } from '../data/presets';
import { SupportedLanguage } from '../types';

interface ErrorLibraryProps {
  onSelectPreset: (preset: PresetError) => void;
}

export const ErrorLibrary: React.FC<ErrorLibraryProps> = ({ onSelectPreset }) => {
  const [filterLang, setFilterLang] = useState<string>('all');

  const filteredPresets = filterLang === 'all'
    ? PRESET_ERRORS
    : PRESET_ERRORS.filter(p => p.language === filterLang);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-2xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Classic Error Library
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Dissect and understand the most notorious errors every programmer encounters.
            </p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 mt-6 flex-wrap">
          <span className="text-xs text-slate-500 font-semibold flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Language:</span>
          </span>
          {['all', 'java', 'python', 'javascript', 'cpp'].map((lang) => (
            <button
              key={lang}
              onClick={() => setFilterLang(lang)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                filterLang === lang
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {lang === 'all' ? 'All Languages' : lang}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Error Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPresets.map((preset) => (
          <div
            key={preset.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between hover:border-indigo-500/50 hover:bg-slate-900/70 transition-all duration-300 group shadow-lg"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold uppercase">
                  {preset.language}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  {preset.badge}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {preset.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1 font-sans">
                  {preset.result.summary}
                </p>
              </div>

              {/* Code Preview snippet */}
              <div className="rounded-xl bg-slate-950 border border-slate-850 p-3 font-mono text-[11px] text-slate-300 overflow-hidden max-h-24 relative select-none">
                <pre className="m-0 leading-5 whitespace-pre">
                  <code>{preset.codeSnippet}</code>
                </pre>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-indigo-400 font-medium">
                {preset.result.analogy.title}
              </span>
              <button
                onClick={() => onSelectPreset(preset)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-bold transition-all"
              >
                <span>Dissect</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
