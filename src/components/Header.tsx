import React from 'react';
import { FirestoreUserProfile } from '../services/firebase';
import {
  Flame,
  Sun,
  Moon,
  Zap,
  Sparkles,
  ShieldCheck,
  LogIn,
  UserCheck,
  CreditCard,
  User,
} from 'lucide-react';

interface HeaderProps {
  currentUser: FirestoreUserProfile | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onReplaySplash?: () => void;
  onOpenLegalModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  isDarkMode,
  setIsDarkMode,
  onOpenAuth,
  onOpenProfile,
  onReplaySplash,
  onOpenLegalModal,
}) => {
  const isAdmin = currentUser?.isAdmin === true;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'workouts', label: 'Workouts' },
    { id: 'ai-trainer', label: 'AI Trainer' },
    { id: 'nutrition', label: 'Nutrition' },
    { id: 'progress', label: 'Progress' },
    { id: 'challenges', label: 'Challenges' },
    { id: 'community', label: 'Community' },
    { id: 'reminders', label: 'Reminders' },
    { id: 'admin', label: 'Admin Portal', isAdminOnly: true },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/90 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div
            onClick={() => setActiveTab('dashboard')}
            className="cursor-pointer flex items-center gap-2 sm:gap-3 group"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Zap className="w-4 h-4 sm:w-6 sm:h-6 text-black fill-black" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-black tracking-tight text-white font-sans">
                Moventra <span className="text-green-400">AI</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 ml-2 tracking-widest font-bold">
                PRO ATHLETE
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-zinc-900/80 p-1.5 rounded-2xl border border-white/10">
          {navItems.map((item) => {
            if (item.isAdminOnly && !isAdmin) return null;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  isActive
                    ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20 font-extrabold'
                    : item.isAdminOnly
                    ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.isAdminOnly && <ShieldCheck className="w-3.5 h-3.5" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Legal Policies Button */}
          {onOpenLegalModal && (
            <button
              onClick={onOpenLegalModal}
              className="p-2 rounded-xl bg-zinc-900 border border-white/10 hover:border-emerald-500/50 text-emerald-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
              title="Legal Policies & Medical Compliance"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </button>
          )}

          {/* Replay Intro Splash Button */}
          {onReplaySplash && (
            <button
              onClick={onReplaySplash}
              className="p-2 rounded-xl bg-zinc-900 border border-white/10 hover:bg-white/5 text-emerald-400 transition-colors flex items-center gap-1.5 text-xs font-bold"
              title="Replay Welcome Intro"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </button>
          )}

          {/* User Profile / Auth State Button */}
          {currentUser ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 px-2 sm:px-2.5 py-1 rounded-xl bg-zinc-900 border border-white/10 hover:border-emerald-500/50 transition-all shrink-0"
            >
              <div className="hidden md:flex flex-col items-end text-right">
                <span className="text-xs font-black text-white leading-tight">{currentUser.fullName}</span>
                <span className="text-[9px] font-extrabold text-emerald-400 tracking-wider uppercase">
                  {currentUser.isAdmin ? 'ADMIN' : 'ATHLETE'}
                </span>
              </div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <User className="w-4 h-4" />
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-black font-extrabold text-[11px] sm:text-xs hover:opacity-90 transition-opacity flex items-center gap-1 sm:gap-1.5 shadow-lg shadow-emerald-500/20 shrink-0 whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
