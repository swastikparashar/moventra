import React, { useState, useEffect } from 'react';
import { WorkoutPlan, Exercise } from '../types';
import { ExerciseAnimationCanvas } from './ExerciseAnimationCanvas';
import { Play, Pause, SkipForward, CheckCircle2, X, Timer, Flame, Trophy, Award, Sparkles } from 'lucide-react';
import { sendGoalAchievementPush } from '../services/fcmService';

interface ActiveWorkoutSessionProps {
  workout: WorkoutPlan;
  onClose: () => void;
  onComplete: (workoutId: string, calories: number) => void;
}

export const ActiveWorkoutSession: React.FC<ActiveWorkoutSessionProps> = ({
  workout,
  onClose,
  onComplete,
}) => {
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(30);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0);

  const currentExercise: Exercise = workout.exercises[currentExerciseIdx] || workout.exercises[0];

  // Safe HTML5 Audio sound trigger for rest completion (prevents AudioDestinationNode errors)
  const playBeep = () => {
    try {
      const sampleRate = 22050;
      const duration = 0.35;
      const numSamples = Math.floor(sampleRate * duration);
      const buffer = new ArrayBuffer(44 + numSamples * 2);
      const view = new DataView(buffer);
      const writeString = (offset: number, str: string) => {
        for (let i = 0; i < str.length; i++) {
          view.setUint8(offset + i, str.charCodeAt(i));
        }
      };
      writeString(0, 'RIFF');
      view.setUint32(4, 36 + numSamples * 2, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true); // PCM
      view.setUint16(22, 1, true); // Mono
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeString(36, 'data');
      view.setUint32(40, numSamples * 2, true);
      for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        const sample = Math.sin(2 * Math.PI * 880 * t) * Math.exp(-t * 6) * 0.4;
        const clamped = Math.max(-1, Math.min(1, sample));
        view.setInt16(44 + i * 2, clamped < 0 ? clamped * 0x8000 : clamped * 0x7FFF, true);
      }
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const uri = 'data:audio/wav;base64,' + btoa(binary);
      const audio = new Audio(uri);
      audio.volume = 0.8;
      audio.play().catch(() => {});
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  };

  // Rest Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (isResting && !isPaused && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer((t) => t - 1);
      }, 1000);
    } else if (isResting && restTimer === 0) {
      playBeep();
      setIsResting(false);
      // Move to next set or next exercise
      if (currentSet < (currentExercise?.sets || 3)) {
        setCurrentSet((s) => s + 1);
      } else {
        advanceExercise();
      }
    }
    return () => clearInterval(interval);
  }, [isResting, isPaused, restTimer, currentSet, currentExercise]);

  const advanceExercise = () => {
    setTotalCaloriesBurned((prev) => prev + (currentExercise?.caloriesBurned || 20));

    if (currentExerciseIdx < workout.exercises.length - 1) {
      setCurrentExerciseIdx((idx) => idx + 1);
      setCurrentSet(1);
      setIsResting(false);
    } else {
      setIsFinished(true);
      playBeep();
      onComplete(workout.id, totalCaloriesBurned + (currentExercise?.caloriesBurned || 20));
      
      // Dispatch Goal Achievement FCM Push Notification
      try {
        sendGoalAchievementPush(
          `Workout Complete: ${workout.title}`,
          `Great job! You burned ~${totalCaloriesBurned + (currentExercise?.caloriesBurned || 20)} kcal and earned +150 XP!`
        );
      } catch (e) {
        console.warn('Could not dispatch workout goal completion push:', e);
      }
    }
  };

  const handleSetComplete = () => {
    if (currentSet < (currentExercise?.sets || 3)) {
      setRestTimer(currentExercise?.restSeconds || 30);
      setIsResting(true);
    } else {
      advanceExercise();
    }
  };

  if (isFinished) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <div className="bg-zinc-900 border border-emerald-500/40 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-600" />
          
          <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/50 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Trophy className="w-10 h-10 text-emerald-400" />
          </div>

          <h2 className="text-3xl font-extrabold text-white mb-2">Workout Completed!</h2>
          <p className="text-zinc-400 text-sm mb-6">Awesome effort! You crushed the <span className="text-emerald-400 font-semibold">{workout.title}</span> routine.</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-zinc-800/80 p-4 rounded-2xl border border-zinc-700">
              <Flame className="w-6 h-6 text-amber-400 mb-1 mx-auto" />
              <div className="text-2xl font-black text-white">{totalCaloriesBurned}</div>
              <div className="text-xs text-zinc-400">Calories Burned</div>
            </div>
            <div className="bg-zinc-800/80 p-4 rounded-2xl border border-zinc-700">
              <Award className="w-6 h-6 text-emerald-400 mb-1 mx-auto" />
              <div className="text-2xl font-black text-white">+150 XP</div>
              <div className="text-xs text-zinc-400">Level Progress</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-black font-bold text-base hover:opacity-90 transition-opacity shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 fill-black" />
            Claim Rewards & Exit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 flex flex-col text-white overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400">
            Ex {currentExerciseIdx + 1} of {workout.exercises.length}
          </div>
          <h3 className="font-bold text-lg text-white truncate max-w-[200px] sm:max-w-xs">{workout.title}</h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Active Workout View */}
      <div className="flex-1 overflow-y-auto p-4 max-w-2xl mx-auto w-full flex flex-col justify-between">
        <div>
          {/* Rest Screen Overlay */}
          {isResting ? (
            <div className="bg-zinc-900/90 border border-emerald-500/40 rounded-3xl p-8 text-center my-6 flex flex-col items-center justify-center shadow-xl">
              <Timer className="w-12 h-12 text-emerald-400 mb-2 animate-pulse" />
              <div className="text-zinc-400 text-sm uppercase tracking-wider font-semibold mb-1">Rest Period</div>
              <div className="text-6xl font-black text-emerald-400 font-mono my-2">{restTimer}s</div>
              <p className="text-zinc-300 text-sm mb-6">Catch your breath & prepare for Set {currentSet} of {currentExercise.name}</p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setRestTimer((t) => t + 10)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-sm font-semibold"
                >
                  +10 sec
                </button>
                <button
                  onClick={() => setIsResting(false)}
                  className="px-6 py-2 rounded-xl bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400"
                >
                  Skip Rest
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Exercise Graphic Canvas */}
              <div className="mb-4">
                <ExerciseAnimationCanvas
                  animationType={currentExercise.animationType}
                  muscleGroup={currentExercise.muscleGroup}
                />
              </div>

              {/* Exercise Header */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{currentExercise.name}</h2>
                    <p className="text-sm text-emerald-400 font-medium">{currentExercise.muscleGroup}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-white">Set {currentSet}</span>
                    <span className="text-xs text-zinc-400 block">/ {currentExercise.sets} Sets</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-zinc-800/80 text-sm text-zinc-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Target: <strong>{currentExercise.reps || `${currentExercise.durationSeconds}s`}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>~{currentExercise.caloriesBurned} kcal</span>
                  </div>
                </div>
              </div>

              {/* Instructions List */}
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 mb-4">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Key Technique Steps</h4>
                <ul className="space-y-1.5 text-sm text-zinc-300">
                  {currentExercise.instructions.slice(0, 3).map((inst, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{inst}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-zinc-800 flex items-center gap-3">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
          </button>

          <button
            onClick={handleSetComplete}
            disabled={isResting}
            className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 hover:opacity-90 text-black font-extrabold text-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            <CheckCircle2 className="w-6 h-6 fill-black text-emerald-500" />
            Complete Set {currentSet}
          </button>

          <button
            onClick={advanceExercise}
            className="p-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            title="Skip Exercise"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
