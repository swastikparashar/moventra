import React, { useState } from 'react';
import { UserProfile, DailyLog, WorkoutPlan } from '../../types';
import {
  Flame,
  Footprints,
  Droplets,
  Zap,
  Activity,
  Award,
  Plus,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Sparkles,
  Play,
  Check,
} from 'lucide-react';

interface DashboardViewProps {
  user: UserProfile;
  dailyLog: DailyLog;
  onUpdateWater: (ml: number) => void;
  onUpdateSteps: (steps: number) => void;
  featuredWorkouts: WorkoutPlan[];
  onStartWorkout: (workout: WorkoutPlan) => void;
  onNavigate: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  dailyLog,
  onUpdateWater,
  onUpdateSteps,
  featuredWorkouts,
  onStartWorkout,
  onNavigate,
}) => {
  const [quoteIdx, setQuoteIdx] = useState(0);

  const motivationalQuotes = [
    { quote: "The only bad workout is the one that didn't happen.", author: "Moventra AI Coach" },
    { quote: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
    { quote: "Your body can stand almost anything. It's your mind that you have to convince.", author: "Anonymous" },
    { quote: "Success starts with self-discipline and consistency.", author: "Arnold Schwarzenegger" },
  ];

  // Calculate BMI
  const heightM = user.height / 100;
  const bmi = Number((user.weight / (heightM * heightM)).toFixed(1));
  
  let bmiCategory = 'Normal Weight';
  let bmiColor = 'text-green-400 border-green-500/30 bg-green-500/10';
  if (bmi < 18.5) {
    bmiCategory = 'Underweight';
    bmiColor = 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
  } else if (bmi >= 25 && bmi < 29.9) {
    bmiCategory = 'Overweight';
    bmiColor = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
  } else if (bmi >= 30) {
    bmiCategory = 'Obese';
    bmiColor = 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  }

  // Calculate Fitness Score (0 to 100)
  const calorieScore = Math.min(100, Math.round((dailyLog.caloriesBurned / 400) * 35));
  const waterScore = Math.min(100, Math.round((dailyLog.waterMl / user.dailyWaterGoalMl) * 35));
  const stepScore = Math.min(100, Math.round((dailyLog.steps / user.dailyStepGoal) * 30));
  const fitnessScore = Math.min(100, calorieScore + waterScore + stepScore);

  const nextQuote = () => {
    setQuoteIdx((prev) => (prev + 1) % motivationalQuotes.length);
  };

  const categories = [
    { icon: '🧘', label: 'Yoga', active: false },
    { icon: '⚡', label: 'HIIT', active: true },
    { icon: '💪', label: 'Strength', active: false },
    { icon: '🏃', label: 'Cardio', active: false },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Sleek Daily Hero Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden gap-6">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-green-500/10 blur-[80px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-green-500 text-black text-[10px] font-black uppercase rounded-full tracking-widest inline-block">
              AI Recommendation
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-white tracking-tight">
            Welcome back, <span className="text-emerald-400">{user.name}</span> 👋
          </h2>
          <p className="text-zinc-400 mt-2 text-sm max-w-md">
            Based on your recovery score of 88%, we suggest a high-intensity session today.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={() => {
                if (featuredWorkouts.length > 0) {
                  onStartWorkout(featuredWorkouts[0]);
                } else {
                  onNavigate('workouts');
                }
              }}
              className="bg-white text-black px-6 sm:px-8 py-3 rounded-2xl font-bold hover:bg-green-400 transition-colors text-sm shadow-xl shadow-green-500/10 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Start Workout • 45m</span>
            </button>
            <button
              onClick={() => onNavigate('ai-trainer')}
              className="bg-white/10 hover:bg-white/15 text-white border border-white/10 px-6 py-3 rounded-2xl font-bold transition-colors text-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-green-400" />
              <span>AI Trainer</span>
            </button>
          </div>
        </div>

        {/* Circular Fitness Score Badge */}
        <div className="relative z-10 self-center md:self-auto">
          <div className="inline-flex items-center justify-center p-6 sm:p-8 border-8 border-green-500 rounded-full bg-black/40 shadow-2xl shadow-green-500/20">
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-4xl sm:text-5xl font-black text-white leading-none">{fitnessScore}</span>
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest mt-1">Fitness Score</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sleek Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Fitness Score Card */}
        <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-green-400">
              <Zap className="w-5 h-5 fill-green-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Fitness Level</span>
            </div>
            <span className="text-xs font-mono font-bold text-zinc-400">Lvl {user.level}</span>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-3xl font-bold text-white">{fitnessScore}</span>
            <span className="text-zinc-500 text-xs">/ 100</span>
          </div>
          <div className="w-full bg-zinc-800/80 h-2 rounded-full overflow-hidden mt-2">
            <div className="bg-green-500 h-full rounded-full" style={{ width: `${fitnessScore}%` }}></div>
          </div>
        </div>

        {/* Calories Card */}
        <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-5 flex flex-col justify-between">
          <div className="flex items-center gap-3 text-orange-400 mb-3">
            <Flame className="w-5 h-5 fill-orange-400" />
            <span className="text-xs font-bold uppercase tracking-wider">Calories</span>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-3xl font-bold text-white">{dailyLog.caloriesBurned}</span>
            <span className="text-zinc-500 text-xs">/ 500 kcal</span>
          </div>
          <div className="w-full bg-zinc-800/80 h-2 rounded-full overflow-hidden mt-2">
            <div className="bg-orange-500 h-full rounded-full" style={{ width: `${Math.min(100, (dailyLog.caloriesBurned / 500) * 100)}%` }}></div>
          </div>
        </div>

        {/* Hydration Card */}
        <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 text-blue-400">
              <Droplets className="w-5 h-5 fill-blue-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Hydration</span>
            </div>
            <button
              onClick={() => onUpdateWater(250)}
              className="p-1 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/20 transition-colors"
              title="Add +250ml"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-3xl font-bold text-white">{(dailyLog.waterMl / 1000).toFixed(1)}</span>
            <span className="text-zinc-500 text-xs">/ {(user.dailyWaterGoalMl / 1000).toFixed(1)}L</span>
          </div>
          <div className="w-full bg-zinc-800/80 h-2 rounded-full overflow-hidden mt-2">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min(100, (dailyLog.waterMl / user.dailyWaterGoalMl) * 100)}%` }}></div>
          </div>
        </div>

        {/* Steps Card */}
        <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 text-green-400">
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Steps</span>
            </div>
            <button
              onClick={() => onUpdateSteps(1500)}
              className="p-1 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 transition-colors"
              title="Add +1500 steps"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-3xl font-bold text-white">{dailyLog.steps.toLocaleString()}</span>
            <span className="text-zinc-500 text-xs">daily</span>
          </div>
          <div className="w-full bg-zinc-800/80 h-2 rounded-full overflow-hidden mt-2">
            <div className="bg-green-400 h-full rounded-full" style={{ width: `${Math.min(100, (dailyLog.steps / user.dailyStepGoal) * 100)}%` }}></div>
          </div>
        </div>
      </div>

      {/* Workout Category Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            onClick={() => onNavigate('workouts')}
            className={`cursor-pointer rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all border ${
              cat.active
                ? 'bg-green-500/20 border-green-500/30 text-green-400 shadow-lg shadow-green-500/10'
                : 'bg-white/5 border-white/10 text-zinc-300 hover:border-white/20 hover:bg-white/10'
            }`}
          >
            <span className="text-2xl mb-2">{cat.icon}</span>
            <span className={`text-xs ${cat.active ? 'font-bold text-green-400' : 'font-medium'}`}>
              {cat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Middle Grid: BMI & Streak & AI Quote */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* BMI Card */}
        <div className="bg-zinc-900 border border-white/10 p-6 rounded-[32px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-400" />
                BMI & Body Index
              </h3>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${bmiColor}`}>
                {bmiCategory}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-black text-white">{bmi}</span>
              <span className="text-xs text-zinc-400 font-mono">kg/m²</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                <span className="text-xs text-zinc-500 block">Height</span>
                <span className="font-bold text-white">{user.height} cm</span>
              </div>
              <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                <span className="text-xs text-zinc-500 block">Weight</span>
                <span className="font-bold text-white">{user.weight} kg</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 text-xs text-zinc-400">
            Target Weight: <strong className="text-white">{user.targetWeight} kg</strong> ({Math.abs(user.weight - user.targetWeight)}kg to go)
          </div>
        </div>

        {/* Workout Streak */}
        <div className="bg-zinc-900 border border-white/10 p-6 rounded-[32px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
                Workout Streak
              </h3>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                {user.streakDays} Days Active
              </span>
            </div>

            <p className="text-xs text-zinc-400 mb-4">You have logged in & exercised consistently! Keep up the momentum.</p>

            <div className="grid grid-cols-7 gap-1.5 text-center">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
                const isCompleted = idx < 6;
                return (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-[10px] text-zinc-500 font-medium mb-1">{day}</span>
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center border text-xs font-bold transition-all ${
                        isCompleted
                          ? 'bg-green-500 border-green-400 text-black shadow-md shadow-green-500/20'
                          : 'bg-black/40 border-white/5 text-zinc-600'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-zinc-400">Next Streak Reward</span>
            <span className="text-green-400 font-bold">+200 XP at Day 7</span>
          </div>
        </div>

        {/* AI Quote of the Day */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] flex flex-col justify-between relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Sparkles className="w-32 h-32 text-green-400" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-green-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-green-400" />
                AI Motivation
              </span>
              <button
                onClick={nextQuote}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white transition-colors"
                title="Refresh Quote"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <blockquote className="text-white font-medium text-base italic leading-snug mb-3">
              "{motivationalQuotes[quoteIdx].quote}"
            </blockquote>
          </div>

          <div className="text-right border-t border-white/5 pt-3">
            <cite className="text-xs text-green-400 font-bold not-italic">
              — {motivationalQuotes[quoteIdx].author}
            </cite>
          </div>
        </div>
      </div>

      {/* Featured Workout Routines Row */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-white">Recommended Workouts</h2>
            <p className="text-xs text-zinc-400">Tailored routines based on your fitness level</p>
          </div>
          <button
            onClick={() => onNavigate('workouts')}
            className="text-xs font-bold text-green-400 hover:text-green-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredWorkouts.slice(0, 3).map((plan) => (
            <div
              key={plan.id}
              className="group bg-zinc-900 border border-white/10 rounded-[32px] overflow-hidden hover:border-green-500/50 transition-all duration-300 flex flex-col justify-between shadow-xl"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={plan.imageUrl}
                  alt={plan.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 bg-black/80 backdrop-blur border border-white/10 text-green-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                  {plan.category.replace('_', ' ')}
                </span>
                <span className="absolute bottom-3 right-3 bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  {plan.totalCalories} kcal
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors mb-1">
                    {plan.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 mb-4">{plan.description}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <span className="text-xs text-zinc-400 font-medium">{plan.durationMinutes} mins • {plan.exercises.length} Exercises</span>
                  <button
                    onClick={() => onStartWorkout(plan)}
                    className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-green-500/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                    <span>Start</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
