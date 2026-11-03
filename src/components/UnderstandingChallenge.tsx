import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { HelpCircle, CheckCircle2, XCircle, Lightbulb, ArrowRight, Award } from 'lucide-react';
import { QuizChallenge } from '../types';

interface UnderstandingChallengeProps {
  challenge: QuizChallenge;
  onChallengeCompleted?: () => void;
}

export const UnderstandingChallenge: React.FC<UnderstandingChallengeProps> = ({
  challenge,
  onChallengeCompleted
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setSubmitted(true);
    if (selectedOption === challenge.correctOptionIndex) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      if (onChallengeCompleted) {
        onChallengeCompleted();
      }
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setSubmitted(false);
    setShowHint(false);
  };

  const isCorrect = submitted && selectedOption === challenge.correctOptionIndex;

  return (
    <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/30 via-slate-900/40 to-slate-950 p-6 shadow-xl relative overflow-hidden">
      {/* Glow decorative circle */}
      <div className="absolute -right-16 -top-16 w-44 h-44 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Award className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <span>Test Your Understanding</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                Micro-Challenge
              </span>
            </h4>
            <p className="text-xs text-slate-400">Can you spot or prevent this error in a similar scenario?</p>
          </div>
        </div>

        {challenge.hint && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 px-3 py-1.5 rounded-xl border border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{showHint ? 'Hide Hint' : 'Hint'}</span>
          </button>
        )}
      </div>

      {/* Hint box */}
      {showHint && challenge.hint && (
        <div className="mb-4 p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2 animate-in fade-in">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>{challenge.hint}</span>
        </div>
      )}

      {/* Question */}
      <div className="space-y-3 mb-5">
        <p className="text-sm font-medium text-slate-200 leading-relaxed">
          {challenge.question}
        </p>

        {challenge.codeSnippet && (
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-3.5 font-mono text-xs text-indigo-200 overflow-x-auto">
            <pre className="m-0 whitespace-pre">
              <code>{challenge.codeSnippet}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-2.5 mb-6">
        {challenge.options.map((option, idx) => {
          let optionStyle = 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60';
          
          if (submitted) {
            if (idx === challenge.correctOptionIndex) {
              optionStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-200';
            } else if (idx === selectedOption) {
              optionStyle = 'border-rose-500 bg-rose-950/40 text-rose-200';
            } else {
              optionStyle = 'border-slate-850 bg-slate-950/40 text-slate-500 opacity-60';
            }
          } else if (selectedOption === idx) {
            optionStyle = 'border-indigo-500 bg-indigo-950/50 text-white ring-1 ring-indigo-500';
          }

          return (
            <button
              key={idx}
              disabled={submitted}
              onClick={() => setSelectedOption(idx)}
              className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-sans transition-all flex items-start justify-between gap-3 ${optionStyle}`}
            >
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full border border-current/40 flex items-center justify-center font-mono text-[11px] shrink-0 mt-0.5">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="leading-snug">{option}</span>
              </div>

              {submitted && idx === challenge.correctOptionIndex && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              )}
              {submitted && idx === selectedOption && idx !== challenge.correctOptionIndex && (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom action & explanation */}
      {!submitted ? (
        <button
          disabled={selectedOption === null}
          onClick={handleSubmit}
          className={`flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white transition-all ${
            selectedOption !== null
              ? 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>Check My Answer</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className={`p-4 rounded-xl border text-xs sm:text-sm ${
            isCorrect 
              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200' 
              : 'bg-rose-950/30 border-rose-500/30 text-rose-200'
          }`}>
            <div className="font-bold flex items-center gap-2 mb-1.5">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Spot on! You understand the concept.</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>Not quite, but that is how real programmers learn!</span>
                </>
              )}
            </div>
            <p className="text-slate-300 font-sans leading-relaxed">{challenge.explanation}</p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleReset}
              className="text-xs text-indigo-400 hover:text-indigo-300 px-3 py-1.5 rounded-lg hover:bg-indigo-500/10 font-semibold"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
