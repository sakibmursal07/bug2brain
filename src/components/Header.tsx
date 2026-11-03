import React from 'react';
import { 
  Bug, 
  Brain, 
  Sparkles, 
  Key, 
  Volume2, 
  VolumeX, 
  Dumbbell, 
  Activity, 
  BookOpen, 
  Search,
  BookMarked,
  Palette
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'inspector' | 'analytics' | 'drills' | 'library';
  setActiveTab: (tab: 'inspector' | 'analytics' | 'drills' | 'library') => void;
  onOpenApiKeyModal: () => void;
  onOpenExportModal: () => void;
  onOpenThemeModal: () => void;
  hasApiKey: boolean;
  isSpeechActive: boolean;
  onToggleSpeech: () => void;
  mistakeCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenApiKeyModal,
  onOpenExportModal,
  onOpenThemeModal,
  hasApiKey,
  isSpeechActive,
  onToggleSpeech,
  mistakeCount
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('inspector')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-rose-500 p-[1px] shadow-lg group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center relative overflow-hidden">
              <Bug className="w-5 h-5 text-rose-400 absolute transition-all duration-300 group-hover:-translate-y-6 group-hover:opacity-0" />
              <Brain className="w-5 h-5 text-indigo-400 absolute transition-all duration-300 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100" />
              <div className="w-2 h-2 rounded-full bg-emerald-400 absolute bottom-1 right-1 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center">
                Bug<span className="text-rose-400">2</span>Brain
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                AI Tutor
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Learn programming through your own errors</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('inspector')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'inspector'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Inspector</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all relative ${
              activeTab === 'analytics'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Mistake DNA</span>
            {mistakeCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-[10px] text-white flex items-center justify-center font-bold">
                {mistakeCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('drills')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'drills'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Daily</span> Drills
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === 'library'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden md:inline">Error</span> Library
          </button>
        </nav>

        {/* Actions: Export, Theme, Audio, API Key */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Export / Revision Sheet */}
          <button
            onClick={onOpenExportModal}
            title="Export Revision Sheet / Backup"
            className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <BookMarked className="w-4 h-4" />
          </button>

          {/* Theme customizer */}
          <button
            onClick={onOpenThemeModal}
            title="Visual Workspace Theme"
            className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <Palette className="w-4 h-4" />
          </button>

          {/* TTS Audio toggle */}
          <button
            onClick={onToggleSpeech}
            title={isSpeechActive ? "Voice narration is enabled" : "Enable voice narration"}
            className={`p-2 rounded-lg border transition-all ${
              isSpeechActive 
                ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' 
                : 'border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {isSpeechActive ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Gemini API Key status / button */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              hasApiKey
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20'
            }`}
          >
            {hasApiKey ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Gemini AI Active</span>
                <span className="sm:hidden">AI On</span>
              </>
            ) : (
              <>
                <Key className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add Gemini Key</span>
                <span className="sm:hidden">Key</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
