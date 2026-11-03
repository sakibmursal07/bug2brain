import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  HelpCircle, 
  CheckCircle, 
  Cpu, 
  Zap, 
  Lightbulb, 
  Copy, 
  Check, 
  Share2,
  Ghost,
  Layers,
  AlignLeft,
  ShieldAlert,
  Terminal as TerminalIcon
} from 'lucide-react';
import { AnalysisResult } from '../types';
import { CodeDiffView } from './CodeDiffView';
import { LineBreakdown } from './LineBreakdown';
import { UnderstandingChallenge } from './UnderstandingChallenge';
import { TerminalRunner } from './TerminalRunner';

interface ErrorAnalyzerProps {
  result: AnalysisResult;
  isLiveAI: boolean;
  onChallengeCompleted?: () => void;
}

export const ErrorAnalyzer: React.FC<ErrorAnalyzerProps> = ({
  result,
  isLiveAI,
  onChallengeCompleted
}) => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'lineByLine' | 'terminal'>('comparison');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Audio Speech synthesis using Web Speech API
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported by your browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const narrationText = `Error: ${result.title}. Here is why this happened: ${result.summary}. Analogy: ${result.analogy.title}. ${result.analogy.story}. Machine expectation: ${result.rootCause.machineExpectation}. Reality: ${result.rootCause.actualReality}.`;
    const utterance = new SpeechSynthesisUtterance(narrationText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handleCopySummary = () => {
    const text = `[Bug2Brain Analysis]\nError: ${result.title}\nCategory: ${result.errorCategory}\nSummary: ${result.summary}\nAnalogy: ${result.analogy.title} - ${result.analogy.story}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const renderAnalogyIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Ghost': return <Ghost className="w-6 h-6 text-indigo-400" />;
      case 'Layers': return <Layers className="w-6 h-6 text-amber-400" />;
      case 'AlignLeft': return <AlignLeft className="w-6 h-6 text-cyan-400" />;
      case 'ShieldAlert': return <ShieldAlert className="w-6 h-6 text-rose-400" />;
      default: return <HelpCircle className="w-6 h-6 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Headline */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
              {result.errorCategory}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {result.language.toUpperCase()}
            </span>
            {isLiveAI ? (
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Sparkles className="w-3 h-3" />
                <span>Live Gemini Analysis</span>
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 px-2 py-0.5 rounded bg-slate-800/80">
                Curated Tutor Engine
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSpeech}
              title={isPlayingAudio ? "Stop reading explanation" : "Listen to explanation"}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                isPlayingAudio
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 animate-pulse'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isPlayingAudio ? 'Listening...' : 'Listen to Tutor'}</span>
            </button>

            <button
              onClick={handleCopySummary}
              title="Copy analysis summary"
              className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-3">
          {result.title}
        </h2>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-4xl">
          {result.summary}
        </p>
      </div>

      {/* Grid: Analogy & Root Cause */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ELI5 Analogy Card */}
        <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/20 via-slate-900/60 to-slate-950 p-6 flex flex-col justify-between shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors pointer-events-none" />
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                {renderAnalogyIcon(result.analogy.icon)}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  Mental Model Analogy
                </span>
                <h3 className="text-base font-bold text-white">
                  {result.analogy.title}
                </h3>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed font-sans pt-1">
              {result.analogy.story}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs text-indigo-300/80">
            <Lightbulb className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Connecting code to physical intuition prevents copy-pasting blindness.</span>
          </div>
        </div>

        {/* Detective Breakdown: Under the Hood */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col justify-between shadow-lg space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                  Under the Hood
                </span>
                <h3 className="text-base font-bold text-white">
                  Why the Runtime Choked
                </h3>
              </div>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-850">
                <span className="text-slate-500 uppercase tracking-wider text-[10px] block font-bold mb-0.5">
                  Machine Expectation
                </span>
                <span className="text-emerald-300 font-mono text-xs">
                  {result.rootCause.machineExpectation}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-850">
                <span className="text-slate-500 uppercase tracking-wider text-[10px] block font-bold mb-0.5">
                  Actual Reality in Memory / Syntax
                </span>
                <span className="text-rose-300 font-mono text-xs">
                  {result.rootCause.actualReality}
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 italic">
            {result.rootCause.whyItFailed}
          </p>
        </div>
      </div>

      {/* Code Solution, Line-by-Line & Terminal Section */}
      <div className="space-y-4">
        {/* Navigation tabs for code views */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'comparison'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Code Comparison (Diff)
            </button>
            <button
              onClick={() => setActiveTab('lineByLine')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'lineByLine'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Line-by-Line Changes ({result.lineBreakdown?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('terminal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'terminal'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <TerminalIcon className="w-3.5 h-3.5" />
              <span>Interactive Console Simulator</span>
            </button>
          </div>
        </div>

        {activeTab === 'comparison' && (
          <CodeDiffView
            originalCode={result.originalCode}
            correctedCode={result.correctedCode}
            language={result.language}
          />
        )}

        {activeTab === 'lineByLine' && (
          <LineBreakdown changes={result.lineBreakdown} />
        )}

        {activeTab === 'terminal' && (
          <TerminalRunner
            originalCode={result.originalCode}
            correctedCode={result.correctedCode}
            language={result.language}
            analysis={result}
          />
        )}
      </div>

      {/* How to Prevent It Forever */}
      {result.preventionTips && result.preventionTips.length > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              How to Prevent This Bug Forever
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.preventionTips.map((tip, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-850 text-xs sm:text-sm text-slate-300"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Your Understanding Challenge */}
      <UnderstandingChallenge
        challenge={result.challenge}
        onChallengeCompleted={onChallengeCompleted}
      />
    </div>
  );
};
