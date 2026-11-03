import React from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  ArrowUpRight, 
  TrendingUp,
  Dumbbell
} from 'lucide-react';
import { MistakePattern, MistakeRecord } from '../types';

interface MistakeAnalyticsProps {
  history: MistakeRecord[];
  patterns: MistakePattern[];
  onToggleMastered: (id: string) => void;
  onClearHistory: () => void;
  onSelectMistake: (mistake: MistakeRecord) => void;
  onGoToDrills: () => void;
}

export const MistakeAnalytics: React.FC<MistakeAnalyticsProps> = ({
  history,
  patterns,
  onToggleMastered,
  onClearHistory,
  onSelectMistake,
  onGoToDrills
}) => {
  const totalErrors = history.length;
  const masteredCount = history.filter(h => h.mastered).length;
  const topPattern = patterns[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Errors Logged
          </span>
          <span className="text-2xl font-extrabold text-white">{totalErrors}</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Mastered Concepts
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-emerald-400">{masteredCount}</span>
            <span className="text-xs text-slate-500 font-mono">/ {totalErrors}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Top Weakness
          </span>
          <span className="text-sm font-bold text-amber-400 truncate block">
            {topPattern ? topPattern.category : 'None yet'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Mastery Rate
          </span>
          <span className="text-2xl font-extrabold text-indigo-400">
            {totalErrors > 0 ? Math.round((masteredCount / totalErrors) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* Weakness Alert Card */}
      {topPattern && (
        <div className={`rounded-xl border p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          topPattern.riskLevel === 'Critical Trap' 
            ? 'bg-rose-950/20 border-rose-500/30 text-rose-200' 
            : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg border mt-0.5 shrink-0 ${
              topPattern.riskLevel === 'Critical Trap' 
                ? 'bg-rose-500/20 border-rose-500/30 text-rose-400' 
                : 'bg-amber-500/20 border-amber-500/30 text-amber-400'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-950/60 border border-current">
                  {topPattern.riskLevel}
                </span>
                <span className="text-xs font-bold text-white">
                  Recurring: {topPattern.category} ({topPattern.count} times)
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {topPattern.advice}
              </p>
            </div>
          </div>

          <button
            onClick={onGoToDrills}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0"
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Practice Drills</span>
          </button>
        </div>
      )}

      {/* Mistake DNA Category Breakdown */}
      {patterns.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              <span>Category Distribution</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">Session habits</span>
          </div>

          <div className="space-y-3 pt-1">
            {patterns.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-300">{item.category}</span>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-slate-500">{item.count} errors</span>
                    <span className="font-bold text-indigo-400">{item.percentage}%</span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden border border-slate-850">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Journal */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Mistake Journal
            </h3>
            <span className="text-[11px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
              {history.length}
            </span>
          </div>

          {totalErrors > 0 && (
            <button
              onClick={() => {
                if (confirm('Clear your mistake history?')) {
                  onClearHistory();
                }
              }}
              className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 py-1 px-2 rounded-lg hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl space-y-1">
            <p className="text-xs text-slate-400">No errors recorded yet.</p>
            <p className="text-[11px] text-slate-500">
              Analyze a code snippet in the Diagnose tab to log it in your journal.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((record) => (
              <div
                key={record.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  record.mastered
                    ? 'border-emerald-500/30 bg-emerald-950/10'
                    : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                }`}
              >
                <div 
                  onClick={() => onSelectMistake(record)}
                  className="cursor-pointer group flex-1"
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                      {record.language.toUpperCase()}
                    </span>
                    <span className="text-[11px] font-semibold text-rose-400">
                      {record.errorCategory}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                    <span>{record.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                    {record.summary}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onToggleMastered(record.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      record.mastered
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${record.mastered ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span>{record.mastered ? 'Mastered' : 'Mark Mastered'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
