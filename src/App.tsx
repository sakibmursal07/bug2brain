import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Terminal, 
  RotateCcw, 
  AlertCircle,
  Code2,
  ChevronDown,
  Layers,
  BookOpen
} from 'lucide-react';
import { AnalysisResult, MistakePattern, MistakeRecord, SupportedLanguage } from './types';
import { PRESET_ERRORS, PresetError } from './data/presets';
import { analyzeBugWithAI } from './services/geminiService';
import { 
  calculateMistakeDNA, 
  clearMistakeHistory, 
  getMistakeHistory, 
  getStoredApiKey, 
  saveMistakeRecord, 
  toggleMasteredMistake 
} from './services/storageService';
import { Sidebar, NavigationTab } from './components/Sidebar';
import { CodeEditor } from './components/CodeEditor';
import { ErrorAnalyzer } from './components/ErrorAnalyzer';
import { MistakeAnalytics } from './components/MistakeAnalytics';
import { PracticeDrills } from './components/PracticeDrills';
import { ErrorLibrary } from './components/ErrorLibrary';
import { SettingsModal } from './components/SettingsModal';
import { AppTheme, applyThemeClass, getStoredTheme } from './components/ThemeCustomizer';

const SUPPORTED_LANGUAGES: { value: SupportedLanguage; label: string }[] = [
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'csharp', label: 'C#' },
];

export function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('inspector');
  
  // Default preset
  const defaultPreset = PRESET_ERRORS[0];
  const [language, setLanguage] = useState<SupportedLanguage>(defaultPreset.language);
  const [codeSnippet, setCodeSnippet] = useState<string>(defaultPreset.codeSnippet);
  const [errorMessage, setErrorMessage] = useState<string>(defaultPreset.errorMessage);

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(defaultPreset.result);
  const [isLiveAI, setIsLiveAI] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // History & DNA
  const [history, setHistory] = useState<MistakeRecord[]>([]);
  const [patterns, setPatterns] = useState<MistakePattern[]>([]);

  // Settings
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isSpeechActive, setIsSpeechActive] = useState(true);

  useEffect(() => {
    applyThemeClass(getStoredTheme());
    setHasApiKey(Boolean(getStoredApiKey()));

    const loadedHistory = getMistakeHistory();
    setHistory(loadedHistory);
    setPatterns(calculateMistakeDNA(loadedHistory));

    if (loadedHistory.length === 0) {
      const seeded = saveMistakeRecord(defaultPreset.result);
      const updated = [seeded];
      setHistory(updated);
      setPatterns(calculateMistakeDNA(updated));
    }
  }, []);

  const handleKeySaved = () => {
    setHasApiKey(Boolean(getStoredApiKey()));
  };

  const handleSelectPreset = (preset: PresetError) => {
    setLanguage(preset.language);
    setCodeSnippet(preset.codeSnippet);
    setErrorMessage(preset.errorMessage);
    setAnalysisResult(preset.result);
    setIsLiveAI(false);
    setActiveTab('inspector');
  };

  const handleRunAnalysis = async () => {
    if (!codeSnippet.trim()) {
      setErrorNotice('Please paste or write a code snippet first.');
      return;
    }

    setErrorNotice(null);
    setIsAnalyzing(true);

    try {
      const { result, isLiveAI: live } = await analyzeBugWithAI(codeSnippet, errorMessage, language);
      setAnalysisResult(result);
      setIsLiveAI(live);

      const savedRecord = saveMistakeRecord(result);
      const updatedHistory = [savedRecord, ...history.filter(h => h.id !== savedRecord.id)];
      setHistory(updatedHistory);
      setPatterns(calculateMistakeDNA(updatedHistory));
    } catch (err: any) {
      console.error(err);
      setErrorNotice(err.message || 'Failed to analyze code snippet.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleToggleMastered = (id: string) => {
    const updated = toggleMasteredMistake(id);
    setHistory(updated);
    setPatterns(calculateMistakeDNA(updated));
  };

  const handleClearHistory = () => {
    clearMistakeHistory();
    setHistory([]);
    setPatterns([]);
  };

  const handleImportHistory = (imported: MistakeRecord[]) => {
    setHistory(imported);
    setPatterns(calculateMistakeDNA(imported));
    localStorage.setItem('bug2brain_mistakes_v1', JSON.stringify(imported));
  };

  const handleSelectMistakeFromHistory = (mistake: MistakeRecord) => {
    setLanguage(mistake.language);
    setCodeSnippet(mistake.originalCode);
    setErrorMessage('');
    const matched = PRESET_ERRORS.find(p => p.id === mistake.id || p.language === mistake.language);
    if (matched) {
      setAnalysisResult(matched.result);
    } else {
      handleRunAnalysis();
    }
    setActiveTab('inspector');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans selection:bg-indigo-500 selection:text-white">
      {/* Sleek App Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        hasApiKey={hasApiKey}
        mistakeCount={history.length}
      />

      {/* Main App Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          
          {/* ===================== TAB 1: DIAGNOSE ===================== */}
          {activeTab === 'inspector' && (
            <div className="space-y-6">
              {/* Top View Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Diagnose Error
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    Deconstruct root causes, learn line-by-line fixes, and practice the concepts.
                  </p>
                </div>

                {/* Compact Preset Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <span className="text-[11px] font-medium text-slate-500 mr-1 shrink-0">
                    Quick Presets:
                  </span>
                  {PRESET_ERRORS.slice(0, 4).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleSelectPreset(p)}
                      className="px-2.5 py-1 rounded-lg text-xs border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700 transition-colors shrink-0"
                    >
                      {p.language.toUpperCase()}: {p.name.split(' ')[1]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editor Workspace Card */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-4">
                {/* Language & Actions Toolbar */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-slate-400">Language:</label>
                    <div className="relative">
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                        className="bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-2.5 py-1.5 text-xs font-medium text-white outline-none cursor-pointer pr-7 appearance-none"
                      >
                        {SUPPORTED_LANGUAGES.map((l) => (
                          <option key={l.value} value={l.value}>{l.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCodeSnippet('');
                      setErrorMessage('');
                      setAnalysisResult(null);
                    }}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-white py-1 px-2 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                </div>

                {/* Code Snippet Input */}
                <div className="space-y-1">
                  <CodeEditor
                    value={codeSnippet}
                    onChange={setCodeSnippet}
                    language={language}
                    placeholder={`// Paste your broken ${language} code snippet here...`}
                    heightClass="min-h-[180px]"
                  />
                </div>

                {/* Optional Terminal Error Input */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Terminal className="w-3.5 h-3.5 text-rose-400" />
                      <span>Compiler / Terminal Error (Optional)</span>
                    </span>
                  </div>
                  <textarea
                    value={errorMessage}
                    onChange={(e) => setErrorMessage(e.target.value)}
                    placeholder="e.g. java.lang.NullPointerException: Cannot invoke method or IndexError: list index out of range..."
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-xs font-mono text-rose-300 placeholder-slate-600 outline-none leading-relaxed"
                  />
                </div>

                {errorNotice && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{errorNotice}</span>
                  </div>
                )}

                {/* Submit Action Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleRunAnalysis}
                    disabled={isAnalyzing}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all shadow-lg ${
                      isAnalyzing
                        ? 'bg-indigo-700 opacity-80 cursor-wait'
                        : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95 shadow-indigo-600/25'
                    }`}
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Diagnosing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                        <span>Diagnose & Explain</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Modular Results View */}
              {analysisResult && (
                <div className="pt-2">
                  <ErrorAnalyzer
                    result={analysisResult}
                    isLiveAI={isLiveAI}
                    onChallengeCompleted={() => {
                      handleToggleMastered(analysisResult.id);
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* ===================== TAB 2: ERROR LIBRARY ===================== */}
          {activeTab === 'library' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-5">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Error Library
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Browse and dissect classic beginner pitfalls across major programming languages.
                </p>
              </div>

              <ErrorLibrary onSelectPreset={handleSelectPreset} />
            </div>
          )}

          {/* ===================== TAB 3: PRACTICE DRILLS ===================== */}
          {activeTab === 'drills' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-5">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Practice Drills
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Solve coding mini-challenges to rewire recurring bug habits.
                </p>
              </div>

              <PracticeDrills patterns={patterns} />
            </div>
          )}

          {/* ===================== TAB 4: MISTAKE DNA ===================== */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-5">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Mistake DNA & History
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  Understand your recurring coding habits and review past error journal entries.
                </p>
              </div>

              <MistakeAnalytics
                history={history}
                patterns={patterns}
                onToggleMastered={handleToggleMastered}
                onClearHistory={handleClearHistory}
                onSelectMistake={handleSelectMistakeFromHistory}
                onGoToDrills={() => setActiveTab('drills')}
              />
            </div>
          )}
        </main>
      </div>

      {/* Unified Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        hasApiKey={hasApiKey}
        onKeySaved={handleKeySaved}
        isSpeechActive={isSpeechActive}
        onToggleSpeech={() => setIsSpeechActive(!isSpeechActive)}
        history={history}
        onImportHistory={handleImportHistory}
        onThemeChanged={(theme) => {
          applyThemeClass(theme);
        }}
      />
    </div>
  );
}

export default App;
