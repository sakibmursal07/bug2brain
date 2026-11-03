import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Dumbbell, 
  Lightbulb, 
  CheckCircle2, 
  Eye, 
  RefreshCw, 
  Sparkles, 
  ArrowRight,
  PlusCircle,
  Filter,
  Check
} from 'lucide-react';
import { DrillItem, ErrorCategory, MistakePattern, SupportedLanguage } from '../types';
import { CURATED_DRILLS } from '../services/storageService';
import { CodeEditor } from './CodeEditor';

interface PracticeDrillsProps {
  patterns: MistakePattern[];
}

export const PracticeDrills: React.FC<PracticeDrillsProps> = ({ patterns }) => {
  const [drillList, setDrillList] = useState<DrillItem[]>(CURATED_DRILLS);
  const [selectedDrill, setSelectedDrill] = useState<DrillItem>(drillList[0]);
  const [userCode, setUserCode] = useState(drillList[0].buggyCode);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [verified, setVerified] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);

  // Custom drill creation state
  const [newTitle, setNewTitle] = useState('');
  const [newLang, setNewLang] = useState<SupportedLanguage>('python');
  const [newCategory, setNewCategory] = useState<ErrorCategory>('Null / Undefined');
  const [newBuggyCode, setNewBuggyCode] = useState('');
  const [newFixedCode, setNewFixedCode] = useState('');
  const [newExplanation, setNewExplanation] = useState('');

  const filteredDrills = categoryFilter === 'all'
    ? drillList
    : drillList.filter(d => d.category === categoryFilter);

  const handleSelectDrill = (drill: DrillItem) => {
    setSelectedDrill(drill);
    setUserCode(drill.buggyCode);
    setShowHint(false);
    setShowSolution(false);
    setVerified(false);
  };

  const handleCheckFix = () => {
    const lower = userCode.toLowerCase();
    let passed = false;

    if (selectedDrill.category === 'Null / Undefined') {
      passed = lower.includes('if') || lower.includes('null') || lower.includes('?.') || lower.includes('??');
    } else if (selectedDrill.category === 'Bounds & Indexing') {
      passed = lower.includes('enumerate') || lower.includes('len(items)') || !lower.includes('+ 1');
    } else if (selectedDrill.category === 'Memory & Pointers') {
      passed = lower.includes('.at(') || lower.includes('.size()') || lower.includes('empty');
    } else {
      passed = userCode.trim() !== selectedDrill.buggyCode.trim();
    }

    if (passed) {
      setVerified(true);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } else {
      alert('Keep going! Make sure you add defensive checks or fix the boundary logic.');
    }
  };

  const handleReset = () => {
    setUserCode(selectedDrill.buggyCode);
    setShowSolution(false);
    setShowHint(false);
    setVerified(false);
  };

  const handleCreateDrill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBuggyCode.trim() || !newFixedCode.trim()) {
      alert('Please fill out title, buggy code, and solution.');
      return;
    }

    const created: DrillItem = {
      id: `custom-drill-${Date.now()}`,
      title: newTitle,
      language: newLang,
      category: newCategory,
      difficulty: 'Medium',
      description: 'Custom community drill to test defensive habits.',
      buggyCode: newBuggyCode,
      fixedCode: newFixedCode,
      hint: 'Inspect variables for edge cases or boundaries.',
      explanation: newExplanation || 'Defensive programming prevents runtime failure.'
    };

    const updated = [created, ...drillList];
    setDrillList(updated);
    setSelectedDrill(created);
    setUserCode(created.buggyCode);
    setIsCreatingCustom(false);
    // Reset form
    setNewTitle('');
    setNewBuggyCode('');
    setNewFixedCode('');
    setNewExplanation('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Personalized Practice Drills
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Interactive coding mini-challenges calibrated to fix your recurring habits.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCreatingCustom(!isCreatingCustom)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isCreatingCustom ? 'Back to Drills' : 'Create Custom Drill'}</span>
          </button>
        </div>

        {patterns.length > 0 && (
          <div className="mt-4 p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              Targeting your top error category: <strong>{patterns[0].category}</strong>. Solve these to build instinctive defensive habits!
            </span>
          </div>
        )}
      </div>

      {/* Custom Drill Creator Modal / Drawer */}
      {isCreatingCustom ? (
        <form onSubmit={handleCreateDrill} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-4 animate-in fade-in">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-indigo-400" />
            <span>Add a Custom Coding Drill</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Challenge Title
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Prevent Unhandled Null in User Profile"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as ErrorCategory)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 outline-none cursor-pointer"
              >
                <option value="Null / Undefined">Null / Undefined</option>
                <option value="Bounds & Indexing">Bounds & Indexing</option>
                <option value="Type Mismatch">Type Mismatch</option>
                <option value="Memory & Pointers">Memory & Pointers</option>
                <option value="Syntax & Structure">Syntax & Structure</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1">
                Buggy Code Snippet
              </label>
              <textarea
                value={newBuggyCode}
                onChange={(e) => setNewBuggyCode(e.target.value)}
                placeholder="// Code containing the trap"
                rows={5}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-rose-200 outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                Corrected Solution Code
              </label>
              <textarea
                value={newFixedCode}
                onChange={(e) => setNewFixedCode(e.target.value)}
                placeholder="// Code with defensive guard"
                rows={5}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-emerald-200 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Explanation of the Fix
            </label>
            <input
              type="text"
              value={newExplanation}
              onChange={(e) => setNewExplanation(e.target.value)}
              placeholder="Why this defensive change resolves the bug"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreatingCustom(false)}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg"
            >
              Save Custom Drill
            </button>
          </div>
        </form>
      ) : (
        /* Main Grid: Drill Selector on left, Workout editor on right */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Drill Menu */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              <span>Workout Drills</span>
              <span className="text-[11px] font-mono text-slate-500">{filteredDrills.length} available</span>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
              {['all', 'Null / Undefined', 'Bounds & Indexing', 'Memory & Pointers'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2 py-1 rounded-lg font-semibold shrink-0 transition-all ${
                    categoryFilter === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat.split(' ')[0]}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {filteredDrills.map((drill) => {
                const isSelected = selectedDrill.id === drill.id;
                return (
                  <button
                    key={drill.id}
                    onClick={() => handleSelectDrill(drill)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {drill.language.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-semibold text-rose-400">
                        {drill.category}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-200">
                      {drill.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {drill.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Drill Workspace */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                      {selectedDrill.difficulty} Challenge
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-rose-400 font-medium">
                      {selectedDrill.category}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {selectedDrill.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-amber-400 border border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>{showHint ? 'Hide Hint' : 'Hint'}</span>
                  </button>

                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 border border-slate-800 bg-slate-950 hover:text-white transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{showSolution ? 'Hide Solution' : 'View Fix'}</span>
                  </button>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {selectedDrill.description}
              </p>

              {/* Hint Alert */}
              {showHint && (
                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2 animate-in fade-in">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{selectedDrill.hint}</span>
                </div>
              )}

              {/* Solution Alert */}
              {showSolution && (
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Model Solution</span>
                  </div>
                  <pre className="p-3 bg-slate-950 text-emerald-200 rounded-lg font-mono overflow-x-auto whitespace-pre">
                    <code>{selectedDrill.fixedCode}</code>
                  </pre>
                  <p className="text-slate-300">{selectedDrill.explanation}</p>
                </div>
              )}

              {/* Interactive Code Editor */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Your Refactored Code
                </label>
                <CodeEditor
                  value={userCode}
                  onChange={setUserCode}
                  language={selectedDrill.language}
                  label="Drill Sandbox"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Snippet</span>
                </button>

                <button
                  onClick={handleCheckFix}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
                >
                  <span>Verify Fix</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {verified && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm flex items-center gap-3 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold block">Excellent job! Defensive pattern verified.</span>
                    <span className="text-slate-300 text-xs">{selectedDrill.explanation}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
