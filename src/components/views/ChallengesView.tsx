import React from 'react';
import { Challenge } from '../../types';
import { Trophy, Zap, CheckCircle2, Flame, Award, Timer, ShieldCheck, Sparkles } from 'lucide-react';

interface ChallengesViewProps {
  challenges: Challenge[];
  onCheckInDay: (challengeId: string) => void;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({
  challenges,
  onCheckInDay,
}) => {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <Trophy className="w-8 h-8 text-amber-400" />
          Fitness Challenges & Rewards
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          Join multi-day fitness challenges, check in daily, and unlock exclusive XP badges.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((challenge) => {
          const progressPercent = Math.round(
            (challenge.completedDays.filter(Boolean).length / challenge.totalDays) * 100
          );
          const isTodayCompleted = challenge.completedDays[challenge.currentDay - 1];

          return (
            <div
              key={challenge.id}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-emerald-500/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-black font-black shadow-lg shadow-amber-500/20">
                    <Trophy className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {challenge.title}
                    </h3>
                    <span className="text-xs text-amber-400 font-semibold">{challenge.targetCount}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
                    +{challenge.rewardXp} XP
                  </span>
                </div>
              </div>

              <p className="text-xs text-zinc-400 mb-6">{challenge.description}</p>

              {/* Progress Bar & Day Tracker */}
              <div className="mb-6">
                <div className="flex justify-between items-center text-xs font-bold mb-2">
                  <span className="text-zinc-400">Day {challenge.currentDay} of {challenge.totalDays}</span>
                  <span className="text-emerald-400">{progressPercent}% Completed</span>
                </div>
                <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden mb-4">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-green-400 h-full rounded-full transition-all duration-700"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Day Checkboxes Grid */}
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1">
                  {challenge.completedDays.map((isDone, idx) => (
                    <div
                      key={idx}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold border transition-all ${
                        isDone
                          ? 'bg-emerald-500 text-black border-emerald-400'
                          : idx + 1 === challenge.currentDay
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500 animate-pulse'
                          : 'bg-zinc-950 text-zinc-600 border-zinc-800'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-xs text-zinc-400">Reward: <strong>{challenge.rewardBadge}</strong></span>
                <button
                  onClick={() => onCheckInDay(challenge.id)}
                  disabled={isTodayCompleted}
                  className={`px-5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all shadow-md ${
                    isTodayCompleted
                      ? 'bg-zinc-800 text-zinc-500 cursor-default'
                      : 'bg-gradient-to-r from-emerald-500 to-green-500 text-black hover:opacity-90 shadow-emerald-500/20'
                  }`}
                >
                  {isTodayCompleted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Day Checked-In</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-black" />
                      <span>Check-In Day {challenge.currentDay}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
