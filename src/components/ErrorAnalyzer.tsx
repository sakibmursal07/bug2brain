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
  Share2,
  Ghost,
  Layers,
  AlignLeft,
  ShieldAlert,
  Terminal as TerminalIcon,
  BookOpen,
  Code2,
  Award,
  Check
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
  const [activeTab, setActiveTab] = useState<'overview' | 'diff' | 'terminal' | 'quiz'>('overview');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

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

    const text = `Error: ${result.title}. ${result.summary}. Analogy: ${result.analogy.title}. ${result.analogy.story}.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handleCopySummary = () => {
    const text = `[Bug2Brain Analysis]\nError: ${result.title}\nCategory: ${result.errorCategory}\nSummary: ${result.summary}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const renderAnalogyIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Ghost': return <Ghost className="w-5 h-5 text-indigo-400" />;
      case 'Layers': return <Layers className="w-5 h-5 text-amber-400" />;
      case 'AlignLeft': return <AlignLeft className="w-5 h-5 text-cyan-400" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      default: return <HelpCircle className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden shadow-xl animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950/60">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
              {result.errorCategory}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {result.language.toUpperCase()}
            </span>
            {isLiveAI && (
              <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Sparkles className="w-3 h-3" />
                <span>Live AI</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSpeech}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                isPlayingAudio
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 animate-pulse'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isPlayingAudio ? 'Stop' : 'Listen'}</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
              title="Copy summary"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
          {result.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
          {result.summary}
        </p>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/80 px-4 sm:px-6 gap-2 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 py-3 px-3 font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === 'overview'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Analogy & Explanation</span>
        </button>

        <button
          onClick={() => setActiveTab('diff')}
          className={`flex items-center gap-2 py-3 px-3 font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === 'diff'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Code Solution & Diff</span>
        </button>

        <button
          onClick={() => setActiveTab('terminal')}
          className={`flex items-center gap-2 py-3 px-3 font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === 'terminal'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <TerminalIcon className="w-4 h-4" />
          <span>Console Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-2 py-3 px-3 font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === 'quiz'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Practice Quiz</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-5 sm:p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Analogy */}
              <div className="p-5 rounded-xl border border-indigo-500/20 bg-indigo-950/15 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {renderAnalogyIcon(result.analogy.icon)}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">
                      Mental Model Analogy
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      {result.analogy.title}
                    </h4>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans pt-1">
                  {result.analogy.story}
                </p>
              </div>

              {/* Machine Expectation vs Reality */}
              <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                    Under The Hood
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-850">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Expected</span>
                    <span className="text-emerald-300 font-mono">{result.rootCause.machineExpectation}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-850">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Actual</span>
                    <span className="text-rose-300 font-mono">{result.rootCause.actualReality}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Prevention tips */}
            {result.preventionTips?.length > 0 && (
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>How to Prevent It Forever</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {result.preventionTips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'diff' && (
          <div className="space-y-6">
            <CodeDiffView
              originalCode={result.originalCode}
              correctedCode={result.correctedCode}
              language={result.language}
            />
            {result.lineBreakdown?.length > 0 && (
              <LineBreakdown changes={result.lineBreakdown} />
            )}
          </div>
        )}

        {activeTab === 'terminal' && (
          <TerminalRunner
            originalCode={result.originalCode}
            correctedCode={result.correctedCode}
            language={result.language}
            analysis={result}
          />
        )}

        {activeTab === 'quiz' && (
          <UnderstandingChallenge
            challenge={result.challenge}
            onChallengeCompleted={onChallengeCompleted}
          />
        )}
      </div>
    </div>
  );
};
