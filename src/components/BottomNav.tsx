import React from 'react';
import {
  Home,
  Dumbbell,
  Bot,
  Utensils,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'workouts', label: 'Workouts', icon: Dumbbell },
    { id: 'ai-trainer', label: 'AI Coach', icon: Bot, isHighlighted: true },
    { id: 'nutrition', label: 'Nutrition', icon: Utensils },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'challenges', label: 'Challenges', icon: Trophy },
    { id: 'community', label: 'Social', icon: Users },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 border-t border-zinc-800/80 backdrop-blur-xl px-1 sm:px-3 py-1 pb-safe flex items-center justify-between max-w-full overflow-x-auto scrollbar-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        if (tab.isHighlighted) {
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative -top-2.5 flex flex-col items-center group shrink-0 px-1"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-emerald-500 via-green-400 to-emerald-600 flex items-center justify-center text-black shadow-lg shadow-emerald-500/30 group-active:scale-95 transition-transform border-2 border-zinc-950">
                <Bot className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-extrabold text-emerald-400 mt-0.5 tracking-tight whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center py-1 px-1 sm:px-2 rounded-xl transition-all shrink-0 min-w-[42px] sm:min-w-[50px] ${
              isActive ? 'text-emerald-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            <span className="text-[8.5px] sm:text-[10px] tracking-tight mt-0.5 whitespace-nowrap">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
