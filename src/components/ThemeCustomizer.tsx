import React, { useEffect, useState } from 'react';
import { Palette, Check, Sparkles } from 'lucide-react';

export type AppTheme = 'midnight' | 'cyberpunk' | 'matrix' | 'nordic';

interface ThemeOption {
  id: AppTheme;
  name: string;
  previewClass: string;
  accentColor: string;
  description: string;
}

const THEMES: ThemeOption[] = [
  {
    id: 'midnight',
    name: 'Midnight Indigo',
    previewClass: 'from-slate-950 via-indigo-950 to-slate-900',
    accentColor: '#6366f1',
    description: 'Clean modern IDE aesthetic with subtle indigo glow'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    previewClass: 'from-purple-950 via-slate-950 to-rose-950',
    accentColor: '#ec4899',
    description: 'High-contrast neon pink, violet, and electric amber'
  },
  {
    id: 'matrix',
    name: 'Matrix Terminal',
    previewClass: 'from-black via-emerald-950 to-slate-950',
    accentColor: '#10b981',
    description: 'Pure hacker green phosphor monochrome style'
  },
  {
    id: 'nordic',
    name: 'Nordic Frost',
    previewClass: 'from-slate-950 via-cyan-950 to-slate-900',
    accentColor: '#06b6d4',
    description: 'Subtle arctic cyan and deep navy tones'
  }
];

const THEME_STORAGE_KEY = 'bug2brain_active_theme';

export function getStoredTheme(): AppTheme {
  return (localStorage.getItem(THEME_STORAGE_KEY) as AppTheme) || 'midnight';
}

export function applyThemeClass(theme: AppTheme) {
  const root = document.documentElement;
  root.classList.remove('theme-midnight', 'theme-cyberpunk', 'theme-matrix', 'theme-nordic');
  root.classList.add(`theme-${theme}`);
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

interface ThemeCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  onThemeChanged: (theme: AppTheme) => void;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  isOpen,
  onClose,
  onThemeChanged
}) => {
  const [currentTheme, setCurrentTheme] = useState<AppTheme>(getStoredTheme());

  useEffect(() => {
    applyThemeClass(currentTheme);
  }, []);

  if (!isOpen) return null;

  const handleSelect = (themeId: AppTheme) => {
    setCurrentTheme(themeId);
    applyThemeClass(themeId);
    onThemeChanged(themeId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Visual Workspace Theme</h3>
              <p className="text-xs text-slate-400">Personalize your coding environment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2.5 py-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            Done
          </button>
        </div>

        <div className="p-6 space-y-3">
          {THEMES.map((theme) => {
            const isSelected = currentTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => handleSelect(theme.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500'
                    : 'border-slate-800 bg-slate-950/50 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${theme.previewClass} border border-slate-700 flex items-center justify-center`}>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.accentColor }} />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                      <span>{theme.name}</span>
                      {isSelected && <Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-sans">
                      {theme.description}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
