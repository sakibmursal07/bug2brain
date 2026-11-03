import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Lightbulb, 
  CheckCircle2, 
  Eye, 
  RefreshCw, 
  Sparkles, 
  ArrowRight,
  PlusCircle,
  Filter
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
      description: 'Custom drill to practice defensive programming.',
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
    setNewTitle('');
    setNewBuggyCode('');
    setNewFixedCode('');
    setNewExplanation('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Bar with Weakness Callout & Custom Drill Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {patterns.length > 0 ? (
          <div className="text-xs text-indigo-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>
              Targeting: <strong>{patterns[0].category}</strong>
            </span>
          </div>
        ) : (
          <div className="text-xs text-slate-500">
            Calibrated practice exercises to strengthen defensive coding habits
          </div>
        )}

        <button
          onClick={() => setIsCreatingCustom(!isCreatingCustom)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
          <span>{isCreatingCustom ? 'Back to Drills' : 'Add Custom Drill'}</span>
        </button>
      </div>

      {isCreatingCustom ? (
        <form onSubmit={handleCreateDrill} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-indigo-400" />
            <span>Create a Custom Practice Drill</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Challenge Title
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Guard Against Empty List Access"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as ErrorCategory)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none cursor-pointer"
              >
                <option value="Null / Undefined">Null / Undefined</option>
                <option value="Bounds & Indexing">Bounds & Indexing</option>
                <option value="Type Mismatch">Type Mismatch</option>
                <option value="Memory & Pointers">Memory & Pointers</option>
                <option value="Syntax & Structure">Syntax & Structure</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-rose-400 mb-1">
                Buggy Code Snippet
              </label>
              <textarea
                value={newBuggyCode}
                onChange={(e) => setNewBuggyCode(e.target.value)}
                placeholder="// Code with bug"
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-rose-200 outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-400 mb-1">
                Fixed Solution Code
              </label>
              <textarea
                value={newFixedCode}
                onChange={(e) => setNewFixedCode(e.target.value)}
                placeholder="// Corrected code with defense"
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-emerald-200 outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Explanation
            </label>
            <input
              type="text"
              value={newExplanation}
              onChange={(e) => setNewExplanation(e.target.value)}
              placeholder="Why this change prevents the failure"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsCreatingCustom(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              Save Drill
            </button>
          </div>
        </form>
      ) : (
        /* Master-Detail Split Grid */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Filterable List */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {['all', 'Null / Undefined', 'Bounds & Indexing', 'Memory & Pointers'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-all ${
                    categoryFilter === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat.split(' ')[0]}
                </button>
              ))}
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredDrills.map((drill) => {
                const isSelected = selectedDrill.id === drill.id;
                return (
                  <button
                    key={drill.id}
                    onClick={() => handleSelectDrill(drill)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-950/30 text-white ring-1 ring-indigo-500'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:bg-slate-900/70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-bold">
                        {drill.language.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-medium text-rose-400">
                        {drill.category}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-200">
                      {drill.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Exercise Workspace */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-850 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  {selectedDrill.difficulty} Challenge • {selectedDrill.category}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {selectedDrill.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-amber-400 border border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Hide Hint' : 'Hint'}</span>
                </button>

                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 border border-slate-800 bg-slate-950 hover:text-white transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showSolution ? 'Hide Fix' : 'View Fix'}</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedDrill.description}
            </p>

            {showHint && (
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{selectedDrill.hint}</span>
              </div>
            )}

            {showSolution && (
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Model Solution</span>
                </div>
                <pre className="p-2.5 bg-slate-950 text-emerald-200 rounded-lg font-mono overflow-x-auto whitespace-pre">
                  <code>{selectedDrill.fixedCode}</code>
                </pre>
                <p className="text-slate-400 text-[11px]">{selectedDrill.explanation}</p>
              </div>
            )}

            {/* Editor */}
            <div className="space-y-1">
              <CodeEditor
                value={userCode}
                onChange={setUserCode}
                language={selectedDrill.language}
                label="Refactor Sandbox"
                heightClass="min-h-[160px]"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white py-1 px-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>

              <button
                onClick={handleCheckFix}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-indigo-600/25 transition-all active:scale-95"
              >
                <span>Verify Fix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {verified && (
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Great job! Defensive pattern verified.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
