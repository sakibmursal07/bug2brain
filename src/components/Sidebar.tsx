import React from 'react';
import { 
  Bug, 
  Brain, 
  Search, 
  BookOpen, 
  Dumbbell, 
  Activity, 
  Settings, 
  Sparkles,
  ChevronRight,
  Code2
} from 'lucide-react';

export type NavigationTab = 'inspector' | 'library' | 'drills' | 'analytics';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  onOpenSettings: () => void;
  hasApiKey: boolean;
  mistakeCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSettings,
  hasApiKey,
  mistakeCount,
}) => {
  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'inspector',
      label: 'Diagnose Error',
      icon: <Search className="w-4 h-4" />
    },
    {
      id: 'library',
      label: 'Error Library',
      icon: <BookOpen className="w-4 h-4" />
    },
    {
      id: 'drills',
      label: 'Practice Drills',
      icon: <Dumbbell className="w-4 h-4" />
    },
    {
      id: 'analytics',
      label: 'Mistake DNA',
      icon: <Activity className="w-4 h-4" />,
      badge: mistakeCount > 0 ? mistakeCount : undefined
    }
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none md:h-screen md:sticky md:top-0">
      {/* Top Brand & Nav */}
      <div className="p-4 md:p-5 space-y-6">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('inspector')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600/20 transition-colors">
            <Bug className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">Bug2Brain</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">v1.2</span>
            </div>
            <p className="text-[11px] text-slate-500">Learn from your errors</p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2">
            Workspace
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-indigo-400' : 'text-slate-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: AI Status & Settings Button */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        {/* Engine status indicator */}
        <div className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-850 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${hasApiKey ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-slate-400 text-[11px] font-medium">
              {hasApiKey ? 'Gemini 3.8 Flash' : 'Local Engine'}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {hasApiKey ? 'Live AI' : 'Active'}
          </span>
        </div>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900/80 border border-slate-800/80 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Settings & Sync</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        </button>
      </div>
    </aside>
  );
};
