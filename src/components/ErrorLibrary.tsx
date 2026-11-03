import React, { useState } from 'react';
import { ArrowRight, Search, Filter } from 'lucide-react';
import { PRESET_ERRORS, PresetError } from '../data/presets';

interface ErrorLibraryProps {
  onSelectPreset: (preset: PresetError) => void;
}

export const ErrorLibrary: React.FC<ErrorLibraryProps> = ({ onSelectPreset }) => {
  const [filterLang, setFilterLang] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPresets = PRESET_ERRORS.filter(p => {
    const matchesLang = filterLang === 'all' || p.language === filterLang;
    const matchesSearch = !searchQuery.trim() || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.result.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.result.errorCategory.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLang && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search error by name, category, or keyword..."
            className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-3.5 py-2 pl-9 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        {/* Language Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {['all', 'java', 'python', 'javascript', 'cpp'].map((lang) => (
            <button
              key={lang}
              onClick={() => setFilterLang(lang)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all shrink-0 ${
                filterLang === lang
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'all' ? 'All' : lang === 'cpp' ? 'C++' : lang}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Error Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPresets.map((preset) => (
          <div
            key={preset.id}
            className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col justify-between hover:border-slate-700 transition-all duration-200 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-bold uppercase">
                  {preset.language}
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  {preset.badge}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {preset.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                  {preset.result.summary}
                </p>
              </div>

              {/* Code preview snippet */}
              <div className="rounded-lg bg-slate-950 border border-slate-850 p-2.5 font-mono text-[11px] text-slate-300 overflow-hidden max-h-20 relative select-none">
                <pre className="m-0 leading-snug whitespace-pre">
                  <code>{preset.codeSnippet}</code>
                </pre>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-indigo-400 font-medium truncate max-w-[170px]">
                {preset.result.analogy.title}
              </span>
              <button
                onClick={() => onSelectPreset(preset)}
                className="flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
              >
                <span>Inspect</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
