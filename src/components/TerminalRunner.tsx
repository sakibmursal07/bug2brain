import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  CheckCircle2, 
  AlertOctagon, 
  Trash2, 
  RotateCw, 
  Cpu, 
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import { AnalysisResult, SupportedLanguage } from '../types';
import { simulateCodeExecution, TerminalExecution } from '../services/executionSimulator';

interface TerminalRunnerProps {
  originalCode: string;
  correctedCode: string;
  language: SupportedLanguage;
  analysis?: AnalysisResult | null;
}

export const TerminalRunner: React.FC<TerminalRunnerProps> = ({
  originalCode,
  correctedCode,
  language,
  analysis
}) => {
  const [execution, setExecution] = useState<TerminalExecution | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTarget, setActiveTarget] = useState<'original' | 'corrected' | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRun = (target: 'original' | 'corrected') => {
    setIsRunning(true);
    setActiveTarget(target);
    setExecution(null);

    // Realistic run delay
    setTimeout(() => {
      const code = target === 'original' ? originalCode : correctedCode;
      const result = simulateCodeExecution(code, language, target === 'corrected', analysis);
      setExecution(result);
      setIsRunning(false);
    }, 450);
  };

  const handleCopyLogs = () => {
    if (!execution) return;
    navigator.clipboard.writeText(`${execution.command}\n${execution.output}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl space-y-0">
      {/* Terminal Title Bar */}
      <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {/* OS Window Dots */}
          <div className="flex items-center gap-1.5 mr-1">
            <div className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600" />
          </div>
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-mono font-bold text-slate-300">
              Interactive Execution Sandbox
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
            {language}
          </span>
        </div>

        {/* Run Trigger Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleRun('original')}
            disabled={isRunning}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTarget === 'original' && execution
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-rose-950/40 text-rose-400 border border-rose-500/20 hover:bg-rose-900/50'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>Run Buggy Code</span>
          </button>

          <button
            onClick={() => handleRun('corrected')}
            disabled={isRunning}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
              activeTarget === 'corrected' && execution
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Run Fixed Solution</span>
          </button>

          {execution && (
            <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
              <button
                onClick={handleCopyLogs}
                title="Copy terminal output"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setExecution(null)}
                title="Clear terminal"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Terminal Screen */}
      <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm min-h-[160px] max-h-[300px] overflow-y-auto bg-slate-950 text-slate-200 space-y-3">
        {!execution && !isRunning && (
          <div className="py-8 text-center text-slate-500 space-y-2 select-none">
            <Cpu className="w-6 h-6 mx-auto text-slate-600" />
            <p>Click <span className="text-rose-400 font-bold">"Run Buggy Code"</span> to see the runtime exception trigger live in console,</p>
            <p>or click <span className="text-emerald-400 font-bold">"Run Fixed Solution"</span> to verify clean execution!</p>
          </div>
        )}

        {isRunning && (
          <div className="flex items-center gap-2.5 text-indigo-400 py-6">
            <RotateCw className="w-4 h-4 animate-spin" />
            <span className="text-xs">
              Allocating environment and executing {activeTarget === 'original' ? 'buggy' : 'fixed'} code...
            </span>
          </div>
        )}

        {execution && !isRunning && (
          <div className="space-y-3 animate-in fade-in duration-200">
            {/* Command Header */}
            <div className="flex items-center justify-between text-slate-400 text-xs border-b border-slate-900 pb-2">
              <div className="flex items-center gap-2 text-indigo-300">
                <span className="text-slate-600 select-none">user@sandbox:~$</span>
                <span className="text-white font-bold">{execution.command.replace(/^\$ /, '')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-[11px] font-mono">{execution.executionTimeMs}ms</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  execution.isError 
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {execution.isError ? `Exit Code ${execution.exitCode} (Crash)` : `Exit Code 0 (Success)`}
                </span>
              </div>
            </div>

            {/* Output log */}
            <div className={`whitespace-pre font-mono leading-relaxed rounded-xl p-3.5 border ${
              execution.isError 
                ? 'bg-rose-950/20 border-rose-900/30 text-rose-300' 
                : 'bg-emerald-950/20 border-emerald-900/30 text-emerald-300'
            }`}>
              {execution.output}
            </div>

            {/* Lesson callout */}
            <div className="text-[11px] text-slate-400 italic flex items-center gap-1.5 pt-1">
              {execution.isError ? (
                <>
                  <AlertOctagon className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>The runtime trapped the violation immediately. Check the line-by-line fix above!</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Defensive checks safely intercepted the invalid state before any crash occurred.</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
