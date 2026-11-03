import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Terminal, 
  Play, 
  RotateCcw, 
  Flame, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Code2
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
import { Header } from './components/Header';
import { CodeEditor } from './components/CodeEditor';
import { ErrorAnalyzer } from './components/ErrorAnalyzer';
import { MistakeAnalytics } from './components/MistakeAnalytics';
import { PracticeDrills } from './components/PracticeDrills';
import { ErrorLibrary } from './components/ErrorLibrary';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ExportModal } from './components/ExportModal';
import { ThemeCustomizer, AppTheme, applyThemeClass, getStoredTheme } from './components/ThemeCustomizer';

const SUPPORTED_LANGUAGES: { value: SupportedLanguage; label: string; icon: string }[] = [
  { value: 'java', label: 'Java', icon: '☕' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'javascript', label: 'JavaScript', icon: '⚡' },
  { value: 'typescript', label: 'TypeScript', icon: '🔷' },
  { value: 'cpp', label: 'C++', icon: '⚙️' },
  { value: 'go', label: 'Go', icon: '🐹' },
  { value: 'rust', label: 'Rust', icon: '🦀' },
  { value: 'csharp', label: 'C#', icon: '🟣' },
];

export function App() {
  const [activeTab, setActiveTab] = useState<'inspector' | 'analytics' | 'drills' | 'library'>('inspector');
  
  // Default to Java NullPointerException as highlighted in the user prompt!
  const defaultPreset = PRESET_ERRORS[0];
  const [language, setLanguage] = useState<SupportedLanguage>(defaultPreset.language);
  const [codeSnippet, setCodeSnippet] = useState<string>(defaultPreset.codeSnippet);
  const [errorMessage, setErrorMessage] = useState<string>(defaultPreset.errorMessage);

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(defaultPreset.result);
  const [isLiveAI, setIsLiveAI] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Mistake History & DNA
  const [history, setHistory] = useState<MistakeRecord[]>([]);
  const [patterns, setPatterns] = useState<MistakePattern[]>([]);

  // Modals & Settings
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isSpeechActive, setIsSpeechActive] = useState(true);

  // Initialize storage & theme
  useEffect(() => {
    applyThemeClass(getStoredTheme());

    const loadedKey = getStoredApiKey();
    setHasApiKey(Boolean(loadedKey));

    const loadedHistory = getMistakeHistory();
    setHistory(loadedHistory);
    setPatterns(calculateMistakeDNA(loadedHistory));

    // If history is empty, seed with the default preset so user immediately sees analytics in action!
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
    // Scroll to results
    window.scrollTo({ top: 350, behavior: 'smooth' });
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

      // Save mistake record to history
      const savedRecord = saveMistakeRecord(result);
      const updatedHistory = [savedRecord, ...history.filter(h => h.id !== savedRecord.id)];
      setHistory(updatedHistory);
      setPatterns(calculateMistakeDNA(updatedHistory));

      // Scroll smoothly down to the analysis result
      setTimeout(() => {
        const resultSection = document.getElementById('analysis-results-section');
        if (resultSection) {
          resultSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
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
    
    // Find preset or reconstruct analysis
    const matched = PRESET_ERRORS.find(p => p.id === mistake.id || p.language === mistake.language);
    if (matched) {
      setAnalysisResult(matched.result);
    } else {
      handleRunAnalysis();
    }
    setActiveTab('inspector');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        hasApiKey={hasApiKey}
        isSpeechActive={isSpeechActive}
        onToggleSpeech={() => setIsSpeechActive(!isSpeechActive)}
        mistakeCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'inspector' && (
          <div className="space-y-8">
            {/* Hero / Quick Pitch */}
            <div className="text-center max-w-3xl mx-auto space-y-3 pt-2 pb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                <span>Stop blind copying. Understand every bug deeply.</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                Turn Your Errors Into <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-rose-400 bg-clip-text text-transparent">Programming Superpowers</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-sans">
                Paste your broken code or terminal error. Bug2Brain explains the root cause in simple language, shows the line-by-line fix, and quizzes you to lock in the concept.
              </p>
            </div>

            {/* Quick Presets Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Try a notorious beginner error:</span>
                </span>
                <button
                  onClick={() => setActiveTab('library')}
                  className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline hidden sm:inline"
                >
                  Browse all in Library →
                </button>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {PRESET_ERRORS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-850 bg-slate-900/60 hover:border-indigo-500/50 hover:bg-slate-800/60 text-xs text-slate-300 transition-all shrink-0 active:scale-95"
                  >
                    <span className="font-mono text-indigo-400 font-bold">{preset.language.toUpperCase()}</span>
                    <span>{preset.name.split(':')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Workspace: Code Input & Terminal Error Input */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md shadow-2xl space-y-6">
              {/* Language Selector Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Select Language:
                  </span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.value}
                      onClick={() => setLanguage(lang.value)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        language === lang.value
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <span>{lang.icon}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Snippet Editor */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Your Broken Code Snippet
                  </label>
                  <span className="text-xs text-slate-500">Paste the snippet that failed</span>
                </div>
                <CodeEditor
                  value={codeSnippet}
                  onChange={setCodeSnippet}
                  language={language}
                  placeholder={`// Paste your broken ${language} code here...`}
                  heightClass="min-h-[220px]"
                />
              </div>

              {/* Optional Error Message or Terminal Stack Trace */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-rose-400" />
                    <span>Error Message / Stack Trace (Optional but recommended)</span>
                  </label>
                  <span className="text-xs text-slate-500">Compiler or terminal log</span>
                </div>
                <textarea
                  value={errorMessage}
                  onChange={(e) => setErrorMessage(e.target.value)}
                  placeholder="Paste error output, e.g. java.lang.NullPointerException or IndexError: list index out of range..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl p-3 text-xs sm:text-sm font-mono text-rose-300 placeholder-slate-600 outline-none transition-all leading-relaxed"
                />
              </div>

              {errorNotice && (
                <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorNotice}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <button
                  onClick={() => {
                    setCodeSnippet('');
                    setErrorMessage('');
                    setAnalysisResult(null);
                  }}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>

                <button
                  onClick={handleRunAnalysis}
                  disabled={isAnalyzing}
                  className={`flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-bold text-white uppercase tracking-wider shadow-xl transition-all duration-200 ${
                    isAnalyzing
                      ? 'bg-indigo-700 opacity-80 cursor-wait'
                      : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-95 active:scale-95 shadow-indigo-600/30'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Diagnosing Error...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Explain Error & Teach Me</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Analysis Results Display */}
            <div id="analysis-results-section" className="pt-4">
              {analysisResult && (
                <ErrorAnalyzer
                  result={analysisResult}
                  isLiveAI={isLiveAI}
                  onChallengeCompleted={() => {
                    handleToggleMastered(analysisResult.id);
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* Mistake DNA & Analytics Tab */}
        {activeTab === 'analytics' && (
          <MistakeAnalytics
            history={history}
            patterns={patterns}
            onToggleMastered={handleToggleMastered}
            onClearHistory={handleClearHistory}
            onSelectMistake={handleSelectMistakeFromHistory}
            onGoToDrills={() => setActiveTab('drills')}
          />
        )}

        {/* Personalized Practice Drills Tab */}
        {activeTab === 'drills' && (
          <PracticeDrills patterns={patterns} />
        )}

        {/* Error Library Tab */}
        {activeTab === 'library' && (
          <ErrorLibrary onSelectPreset={handleSelectPreset} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-slate-400">
            <span>Bug2Brain</span>
            <span>•</span>
            <span className="font-normal text-slate-500">Learn Programming Through Your Own Errors</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <button 
              onClick={() => setIsExportModalOpen(true)}
              className="hover:text-indigo-400 transition-colors"
            >
              Export Revision Sheet
            </button>
            <span>•</span>
            <button 
              onClick={() => setIsThemeModalOpen(true)}
              className="hover:text-indigo-400 transition-colors"
            >
              Theme Settings
            </button>
            <span>•</span>
            <button 
              onClick={() => setIsApiKeyModalOpen(true)}
              className="hover:text-indigo-400 transition-colors"
            >
              Gemini AI Settings
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={handleKeySaved}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        history={history}
        onImportHistory={handleImportHistory}
      />

      <ThemeCustomizer
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        onThemeChanged={(theme) => {
          applyThemeClass(theme);
        }}
      />
    </div>
  );
}

export default App;
