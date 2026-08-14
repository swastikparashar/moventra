import React, { useState } from 'react';
import { Bell, Droplets, Dumbbell, Utensils, Moon, CheckCircle2, Clock, Volume2, Sparkles, Send } from 'lucide-react';
import {
  sendWorkoutReminderPush,
  sendGoalAchievementPush,
  sendCommunityInteractionPush,
  sendPushNotification,
  initFCM
} from '../../services/fcmService';

export const RemindersView: React.FC = () => {
  const [workoutReminder, setWorkoutReminder] = useState(true);
  const [workoutTime, setWorkoutTime] = useState('07:30');

  const [waterReminder, setWaterReminder] = useState(true);
  const [waterIntervalHours, setWaterIntervalHours] = useState(2);

  const [mealReminder, setMealReminder] = useState(true);
  const [sleepReminder, setSleepReminder] = useState(true);
  const [sleepTime, setSleepTime] = useState('22:30');

  const [fcmNotice, setFcmNotice] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customBody, setCustomBody] = useState('');

  // Handle FCM Push Notification test
  const triggerPushNotification = async (type: 'workout' | 'goal' | 'community' | 'custom', titleStr?: string, bodyStr?: string) => {
    try {
      await initFCM();
      if (type === 'workout') {
        const title = titleStr || 'Daily Workout Reminder';
        const body = bodyStr || `Scheduled session starting at ${workoutTime}! Get ready to crush your goals.`;
        await sendWorkoutReminderPush(title, workoutTime);
        setFcmNotice(`📱 Push Notification Sent: ${title}`);
      } else if (type === 'goal') {
        await sendGoalAchievementPush('7-Day Calorie Goal Crushed!', 'You achieved 100% of your daily protein & calorie targets!');
        setFcmNotice('🏆 Goal Achievement Push Notification Sent!');
      } else if (type === 'community') {
        await sendCommunityInteractionPush('Alex Rivera', 'liked your progress transformation photo', 'Leg Day Mastery');
        setFcmNotice('💬 Community Interaction Push Notification Sent!');
      } else if (type === 'custom' && customTitle && customBody) {
        await sendPushNotification({
          type: 'general',
          title: customTitle,
          body: customBody,
          timestamp: new Date().toISOString()
        });
        setFcmNotice(`🚀 Custom FCM Push Dispatched: "${customTitle}"`);
        setCustomTitle('');
        setCustomBody('');
      }
      setTimeout(() => setFcmNotice(''), 4500);
    } catch (err) {
      console.warn('FCM Push notification error:', err);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <Bell className="w-8 h-8 text-emerald-400" />
          Smart Notification & Reminders
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          Stay accountable with automated alerts for workouts, hydration schedules, meal timing, and sleep recovery.
        </p>
      </div>

      {fcmNotice && (
        <div className="p-4 bg-emerald-950/90 border border-emerald-500/50 rounded-2xl text-emerald-400 text-sm flex items-center gap-3 animate-pulse shadow-lg">
          <Volume2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span className="font-semibold">{fcmNotice}</span>
        </div>
      )}

      {/* FCM Quick Test Bar */}
      <div className="bg-zinc-900/90 border border-emerald-500/30 p-5 rounded-3xl shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Test FCM Push Triggers</h3>
          </div>
          <button
            onClick={() => initFCM()}
            className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-bold hover:bg-emerald-500/30 transition-colors"
          >
            Enable Browser Push Permission
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            onClick={() => triggerPushNotification('workout')}
            className="p-3 bg-zinc-950 border border-zinc-800 hover:border-emerald-500/50 rounded-xl text-left transition-all"
          >
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5" />
              Workout Reminder Push
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Alerts session starting at {workoutTime}</div>
          </button>

          <button
            onClick={() => triggerPushNotification('goal')}
            className="p-3 bg-zinc-950 border border-zinc-800 hover:border-amber-500/50 rounded-xl text-left transition-all"
          >
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Goal Achievement Push
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Notifies 100% calorie/protein targets</div>
          </button>

          <button
            onClick={() => triggerPushNotification('community')}
            className="p-3 bg-zinc-950 border border-zinc-800 hover:border-cyan-500/50 rounded-xl text-left transition-all"
          >
            <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5" />
              Community Push
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Notifies likes/comments on workout posts</div>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Workout Reminder */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Daily Workout Reminder</h3>
              <p className="text-xs text-zinc-400">Get notified 15 minutes before your scheduled session</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="time"
              value={workoutTime}
              onChange={(e) => setWorkoutTime(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white font-mono"
            />
            <button
              onClick={() => setWorkoutReminder(!workoutReminder)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                workoutReminder ? 'bg-emerald-500' : 'bg-zinc-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  workoutReminder ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
            <button
              onClick={() => triggerPushNotification('workout', 'Daily Workout Alert 🏋️‍♂️', `It's time for your workout session scheduled for ${workoutTime}`)}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-xs text-emerald-400 border border-emerald-500/30 font-semibold transition-colors"
            >
              Test FCM Push
            </button>
          </div>
        </div>

        {/* Water Intake Reminder */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <Droplets className="w-6 h-6 fill-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Hydration Reminder</h3>
              <p className="text-xs text-zinc-400">Periodic drink water alerts throughout active hours</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={waterIntervalHours}
              onChange={(e) => setWaterIntervalHours(Number(e.target.value))}
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white"
            >
              <option value={1}>Every 1 Hour</option>
              <option value={2}>Every 2 Hours</option>
              <option value={3}>Every 3 Hours</option>
            </select>
            <button
              onClick={() => setWaterReminder(!waterReminder)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                waterReminder ? 'bg-emerald-500' : 'bg-zinc-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  waterReminder ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
            <button
              onClick={() => triggerPushNotification('goal', 'Hydration Goal Alert 💧', 'Drink 250ml of water to reach your 3.0L goal!')}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-xs text-cyan-400 border border-cyan-500/30 font-semibold transition-colors"
            >
              Test FCM Push
            </button>
          </div>
        </div>

        {/* Meal Timings Reminder */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Meal Timings Notification</h3>
              <p className="text-xs text-zinc-400">Reminders for high-protein breakfast, lunch & dinner</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setMealReminder(!mealReminder)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                mealReminder ? 'bg-emerald-500' : 'bg-zinc-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  mealReminder ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
            <button
              onClick={() => triggerPushNotification('goal', 'Nutrition Milestone 🥗', 'Time for your high-protein post-workout meal!')}
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-xs text-amber-400 border border-amber-500/30 font-semibold transition-colors"
            >
              Test FCM Push
            </button>
          </div>
        </div>

        {/* Sleep & Recovery Reminder */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400">
              <Moon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Sleep & Recovery Wind-Down</h3>
              <p className="text-xs text-zinc-400">Bedtime notification for optimal 8-hour recovery sleep</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="time"
              value={sleepTime}
              onChange={(e) => setSleepTime(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white font-mono"
            />
            <button
              onClick={() => setSleepReminder(!sleepReminder)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                sleepReminder ? 'bg-emerald-500' : 'bg-zinc-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  sleepReminder ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
            <button
              onClick={() => triggerPushNotification('workout', 'Bedtime Recovery 🌙', `Wind down at ${sleepTime} for 8 hours of optimal muscle repair sleep.`)}
              className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-xs text-purple-400 border border-purple-500/30 font-semibold transition-colors"
            >
              Test FCM Push
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
