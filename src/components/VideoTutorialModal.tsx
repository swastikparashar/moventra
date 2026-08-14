import React, { useState } from 'react';
import { Exercise } from '../types';
import { ExerciseAnimationCanvas } from './ExerciseAnimationCanvas';
import { X, Play, Pause, CheckCircle2, ShieldAlert, Sparkles, Flame, Layers } from 'lucide-react';

interface VideoTutorialModalProps {
  exercise: Exercise | null;
  onClose: () => void;
  onStartExercise: (exercise: Exercise) => void;
}

export const VideoTutorialModal: React.FC<VideoTutorialModalProps> = ({
  exercise,
  onClose,
  onStartExercise,
}) => {
  const [isPlayingVideo, setIsPlayingVideo] = useState(true);

  if (!exercise) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-xl w-full text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video / Animated Preview Container */}
        <div className="relative rounded-2xl overflow-hidden mb-5 border border-zinc-800 bg-zinc-950">
          <ExerciseAnimationCanvas
            animationType={exercise.animationType}
            muscleGroup={exercise.muscleGroup}
          />
        </div>

        {/* Header Info */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                {exercise.difficulty}
              </span>
              <span className="text-xs text-zinc-400">{exercise.equipmentNeeded}</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white">{exercise.name}</h3>
            <p className="text-sm text-emerald-400 font-semibold">{exercise.muscleGroup}</p>
          </div>

          <div className="text-right bg-zinc-800/60 p-2.5 rounded-xl border border-zinc-700/50">
            <div className="text-lg font-black text-white">{exercise.sets} Sets</div>
            <div className="text-xs text-zinc-400 font-medium">
              {exercise.reps || `${exercise.durationSeconds}s`}
            </div>
          </div>
        </div>

        {/* Key Metrics Pill Row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-zinc-800/40 p-3 rounded-xl border border-zinc-800 text-center">
            <Flame className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <div className="text-sm font-extrabold text-white">~{exercise.caloriesBurned} kcal</div>
            <div className="text-[11px] text-zinc-400">Burn Est.</div>
          </div>
          <div className="bg-zinc-800/40 p-3 rounded-xl border border-zinc-800 text-center">
            <Layers className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <div className="text-sm font-extrabold text-white">{exercise.restSeconds}s Rest</div>
            <div className="text-[11px] text-zinc-400">Between Sets</div>
          </div>
          <div className="bg-zinc-800/40 p-3 rounded-xl border border-zinc-800 text-center">
            <Sparkles className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
            <div className="text-sm font-extrabold text-white">HD Video</div>
            <div className="text-[11px] text-zinc-400 font-medium">Form Motion</div>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Step-by-Step Execution Guide
          </h4>
          <ol className="space-y-2">
            {exercise.instructions.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800 text-sm text-zinc-300">
                <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Pro Tips & Injury Prevention */}
        {exercise.tips && exercise.tips.length > 0 && (
          <div className="mb-6 bg-amber-950/30 border border-amber-900/50 p-4 rounded-2xl">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Coach Form Tips
            </h4>
            <ul className="space-y-1 text-xs text-amber-200/90 list-disc list-inside">
              {exercise.tips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
