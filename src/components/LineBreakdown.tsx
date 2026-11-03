import React from 'react';
import { PlusCircle, RefreshCw, MinusCircle, Info } from 'lucide-react';
import { LineChange } from '../types';

interface LineBreakdownProps {
  changes: LineChange[];
}

export const LineBreakdown: React.FC<LineBreakdownProps> = ({ changes }) => {
  if (!changes || changes.length === 0) {
    return (
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/30 text-center text-slate-400 text-sm">
        No specific line alterations detected.
      </div>
    );
  }

  const getActionBadge = (action: LineChange['action']) => {
    switch (action) {
      case 'added':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <PlusCircle className="w-3 h-3" />
            <span>Added</span>
          </span>
        );
      case 'modified':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <RefreshCw className="w-3 h-3" />
            <span>Modified</span>
          </span>
        );
      case 'removed':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <MinusCircle className="w-3 h-3" />
            <span>Removed</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Info className="w-3 h-3" />
            <span>Context</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <span>Line-by-Line Changes Explained</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
            {changes.length} {changes.length === 1 ? 'step' : 'steps'}
          </span>
        </h4>
        <span className="text-xs text-slate-500">Why each change matters</span>
      </div>

      <div className="space-y-3">
        {changes.map((change, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-all hover:border-slate-700 space-y-2.5"
          >
            {/* Header of line item */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-400 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                  Line {change.lineNumber}
                </span>
                {getActionBadge(change.action)}
              </div>
            </div>

            {/* Code snippets comparison if present */}
            {(change.originalLine || change.newLine) && (
              <div className="rounded-lg bg-slate-950 p-2.5 font-mono text-xs space-y-1.5 border border-slate-850">
                {change.originalLine && (
                  <div className="text-rose-400 flex items-start gap-2">
                    <span className="select-none text-rose-600 font-bold">-</span>
                    <span className="overflow-x-auto">{change.originalLine}</span>
                  </div>
                )}
                {change.newLine && (
                  <div className="text-emerald-400 flex items-start gap-2">
                    <span className="select-none text-emerald-600 font-bold">+</span>
                    <span className="overflow-x-auto">{change.newLine}</span>
                  </div>
                )}
              </div>
            )}

            {/* Explanation */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans pl-1 border-l-2 border-indigo-500/40">
              {change.explanation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
