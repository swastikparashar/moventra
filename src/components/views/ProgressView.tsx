import React, { useState } from 'react';
import { UserProfile, Badge } from '../../types';
import {
  TrendingUp,
  Award,
  Flame,
  Scale,
  Ruler,
  Calendar,
  CheckCircle2,
  Trophy,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';

interface ProgressViewProps {
  user: UserProfile;
  badges: Badge[];
}

export const ProgressView: React.FC<ProgressViewProps> = ({ user, badges }) => {
  const [measurementChest, setMeasurementChest] = useState(102);
  const [measurementWaist, setMeasurementWaist] = useState(82);
  const [measurementHips, setMeasurementHips] = useState(98);
  const [measurementArms, setMeasurementArms] = useState(38);
  const [measurementThighs, setMeasurementThighs] = useState(58);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState('');

  // Sample historical data for graphs
  const weightHistoryData = [
    { date: 'Jul 01', weight: 78.5, bmi: 24.8 },
    { date: 'Jul 08', weight: 77.2, bmi: 24.4 },
    { date: 'Jul 15', weight: 76.5, bmi: 24.1 },
    { date: 'Jul 22', weight: 75.8, bmi: 23.9 },
    { date: 'Jul 29', weight: 74.8, bmi: 23.6 },
    { date: 'Aug 05', weight: 74.0, bmi: 23.4 },
  ];

  const calorieHistoryData = [
    { day: 'Mon', calories: 420 },
    { day: 'Tue', calories: 510 },
    { day: 'Wed', calories: 380 },
    { day: 'Thu', calories: 490 },
    { day: 'Fri', calories: 560 },
    { day: 'Sat', calories: 340 },
    { day: 'Sun', calories: 450 },
  ];

  const handleSaveMeasurements = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccessMsg('Body measurements recorded successfully!');
    setTimeout(() => setSavedSuccessMsg(''), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-emerald-400" />
          Progress & Analytics
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          Monitor your body composition trends, weight history, workout calories, and unlocked badges.
        </p>
      </div>

      {/* Monthly Statistics Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl shadow-lg">
          <span className="text-xs font-bold text-zinc-400 uppercase">Weight Change</span>
          <div className="text-3xl font-black text-emerald-400 mt-1">-4.5 kg</div>
          <span className="text-xs text-zinc-500 block mt-1">Last 30 Days</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl shadow-lg">
          <span className="text-xs font-bold text-zinc-400 uppercase">Workouts Finished</span>
          <div className="text-3xl font-black text-white mt-1">24 Sessions</div>
          <span className="text-xs text-zinc-500 block mt-1">Total 14.5 Hours</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl shadow-lg">
          <span className="text-xs font-bold text-zinc-400 uppercase">Total Calories Burned</span>
          <div className="text-3xl font-black text-amber-400 mt-1">11,450 kcal</div>
          <span className="text-xs text-zinc-500 block mt-1">Avg 380 kcal/day</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl shadow-lg">
          <span className="text-xs font-bold text-zinc-400 uppercase">Level & XP</span>
          <div className="text-3xl font-black text-cyan-400 mt-1">Level 7</div>
          <span className="text-xs text-zinc-500 block mt-1">{user.xpPoints} XP Total</span>
        </div>
      </div>

      {/* Graphs Row: Weight History & Calorie Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weight & BMI Trend Graph */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Weight & BMI History</h3>
              <p className="text-xs text-zinc-400">Weekly weigh-in progress towards {user.targetWeight}kg</p>
            </div>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
              Target: {user.targetWeight}kg
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightHistoryData}>
                <defs>
                  <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
                <YAxis domain={[70, 80]} stroke="#71717a" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="weight" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#weightGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Calories Burned Graph */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Weekly Calories Burned</h3>
              <p className="text-xs text-zinc-400">Active workout calorie expenditure</p>
            </div>
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calorieHistoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="day" stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="calories" fill="#F59E0B" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Body Measurements Log Form */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-xl">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Ruler className="w-5 h-5 text-emerald-400" />
          Body Measurements Tracker
        </h3>
        <p className="text-xs text-zinc-400 mb-6">Track circumferential girth measurements (in cm) for tape test evaluation.</p>

        {savedSuccessMsg && (
          <div className="mb-4 p-3 bg-emerald-950 border border-emerald-800 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{savedSuccessMsg}</span>
          </div>
        )}

        <form onSubmit={handleSaveMeasurements} className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Chest (cm)</label>
            <input
              type="number"
              value={measurementChest}
              onChange={(e) => setMeasurementChest(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Waist (cm)</label>
            <input
              type="number"
              value={measurementWaist}
              onChange={(e) => setMeasurementWaist(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Hips (cm)</label>
            <input
              type="number"
              value={measurementHips}
              onChange={(e) => setMeasurementHips(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Arms (cm)</label>
            <input
              type="number"
              value={measurementArms}
              onChange={(e) => setMeasurementArms(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Thighs (cm)</label>
            <input
              type="number"
              value={measurementThighs}
              onChange={(e) => setMeasurementThighs(Number(e.target.value))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="col-span-2 sm:col-span-5 text-right mt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-colors shadow-md shadow-emerald-500/20"
            >
              Update Measurements
            </button>
          </div>
        </form>
      </div>

      {/* Achievement Badges Grid */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-xl">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          Achievement Badges
        </h3>
        <p className="text-xs text-zinc-400 mb-6">Earn trophies & XP by hitting workout milestones and maintaining streaks.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                badge.unlocked
                  ? 'bg-zinc-950 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                  : 'bg-zinc-950/40 border-zinc-800 opacity-60'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                  badge.unlocked
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                }`}
              >
                <Trophy className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-sm">{badge.title}</h4>
                  {badge.unlocked && (
                    <span className="text-[10px] bg-emerald-500 text-black px-2 py-0.5 rounded-full font-extrabold">
                      Unlocked
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2 mt-0.5">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
