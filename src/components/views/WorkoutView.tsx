import React, { useState } from 'react';
import { WorkoutPlan, WorkoutCategory, Exercise } from '../../types';
import { FirestoreUserProfile } from '../../services/firebase';
import { sampleExercises } from '../../data/mockData';
import { VideoTutorialModal } from '../VideoTutorialModal';
import { VoiceNoteRecorder } from '../VoiceNoteRecorder';
import {
  Dumbbell,
  Search,
  Filter,
  Flame,
  Clock,
  Play,
  Eye,
  Plus,
  Zap,
  CheckCircle2,
  Mic,
  Volume2,
  Lock,
  Crown,
  CreditCard,
  Settings,
  X,
  Sparkles,
} from 'lucide-react';

interface WorkoutViewProps {
  workoutPlans: WorkoutPlan[];
  currentUser?: FirestoreUserProfile | null;
  onStartWorkout: (workout: WorkoutPlan) => void;
  onAddCustomWorkout: (plan: WorkoutPlan) => void;
}

export const WorkoutView: React.FC<WorkoutViewProps> = ({
  workoutPlans,
  currentUser,
  onStartWorkout,
  onAddCustomWorkout,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedExerciseForDetail, setSelectedExerciseForDetail] = useState<Exercise | null>(null);

  // Focus Exercises State
  const [chosenExerciseIds, setChosenExerciseIds] = useState<string[]>([
    'ex_pushup',
    'ex_squat',
    'ex_plank',
  ]);
  const [isExercisePickerOpen, setIsExercisePickerOpen] = useState<boolean>(false);

  // Saved Workout Voice Notes state
  const [workoutVoiceNotes, setWorkoutVoiceNotes] = useState<
    Array<{ id: string; transcript: string; audioUrl?: string; timestamp: string }>
  >([
    {
      id: 'wv1',
      transcript: 'Completed 4 sets of heavy bench press at 80kg and 3 sets of incline dumbbell press. High energy today!',
      timestamp: '07:15 PM',
    },
  ]);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Workouts' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' },
    { id: 'home', label: 'Home Workout' },
    { id: 'gym', label: 'Gym Workout' },
    { id: 'fat_loss', label: 'Fat Loss' },
    { id: 'muscle_gain', label: 'Muscle Gain' },
    { id: 'strength', label: 'Strength' },
    { id: 'cardio', label: 'Cardio' },
    { id: 'yoga', label: 'Yoga' },
    { id: 'stretching', label: 'Stretching' },
    { id: 'hiit', label: 'HIIT' },
  ];

  const toggleExerciseChoice = (id: string) => {
    if (chosenExerciseIds.includes(id)) {
      setChosenExerciseIds(chosenExerciseIds.filter((exId) => exId !== id));
    } else {
      setChosenExerciseIds([...chosenExerciseIds, id]);
    }
  };

  const handleStartWorkoutCheck = (plan: WorkoutPlan) => {
    onStartWorkout(plan);
  };

  const filteredPlans = workoutPlans.filter((plan) => {
    const matchesCategory = selectedCategory === 'all' || plan.category === selectedCategory || plan.level === selectedCategory;
    const matchesSearch = plan.title.toLowerCase().includes(searchQuery.toLowerCase()) || plan.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Dumbbell className="w-8 h-8 text-emerald-400" />
            Workout Plans & Library
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Choose from science-backed routines or record voice summary notes for your sessions.
          </p>
        </div>
      </div>

      {/* Workout Voice Note Recorder */}
      <VoiceNoteRecorder
        title="Record Workout Summary Voice Note"
        placeholder="Speak your workout summary (e.g. 'Completed 5 sets of squats at 100kg, felt great on depth and knee stability')..."
        category="workout"
        accentColor="cyan"
        onSaveVoiceNote={(note) => {
          setWorkoutVoiceNotes((prev) => [
            {
              id: 'wvn_' + Date.now(),
              transcript: note.transcript,
              audioUrl: note.audioUrl,
              timestamp: note.timestamp,
            },
            ...prev,
          ]);
        }}
      />

      {/* Saved Workout Voice Notes List */}
      {workoutVoiceNotes.length > 0 && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 space-y-3">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <Mic className="w-4 h-4 text-cyan-400" />
            <span>Workout Voice Summaries ({workoutVoiceNotes.length})</span>
          </h3>
          <div className="space-y-2">
            {workoutVoiceNotes.map((vn) => (
              <div
                key={vn.id}
                className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <p className="text-white font-medium leading-relaxed">"{vn.transcript}"</p>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                    <span>{vn.timestamp}</span>
                    <span>•</span>
                    <span className="text-cyan-400 font-bold">Saved to Workout Logs</span>
                  </div>
                </div>
                {vn.audioUrl && (
                  <button
                    onClick={() => {
                      const a = new Audio(vn.audioUrl);
                      a.play();
                    }}
                    className="p-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30 transition-colors shrink-0"
                    title="Listen to recorded audio"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Bar & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search workouts by name, goal, or muscle..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Category Filter Pills (Horizontal Scroll) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-emerald-500 text-black border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Workout Grid */}
      {filteredPlans.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center text-zinc-400">
          <Dumbbell className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <p className="text-base font-bold text-white mb-1">No workouts found</p>
          <p className="text-xs">Try selecting a different category or clearing search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between shadow-xl group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={plan.imageUrl}
                  alt={plan.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 bg-zinc-950/90 backdrop-blur border border-zinc-800 text-emerald-400 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  {plan.level} • {plan.category.replace('_', ' ')}
                </span>
                <span className="absolute bottom-3 right-3 bg-amber-950/90 border border-amber-800 text-amber-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  {plan.totalCalories} kcal
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mb-2">
                    {plan.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 mb-4">{plan.description}</p>

                  {/* Included Exercises Quick Badges */}
                  <div className="mb-4 space-y-1.5">
                    <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Exercise Breakdown ({plan.exercises.length})</span>
                    <div className="flex flex-wrap gap-1.5">
                      {plan.exercises.map((ex, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedExerciseForDetail(ex)}
                          className="px-2.5 py-1 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-xs text-zinc-300 border border-zinc-800 flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3 h-3 text-emerald-400" />
                          <span>{ex.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80">
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>{plan.durationMinutes} mins</span>
                  </div>

                  <button
                    onClick={() => handleStartWorkoutCheck(plan)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:opacity-90 text-black font-extrabold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    <span>Start Workout</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Free Tier Exercise Picker Modal */}
      {isExercisePickerOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-emerald-400" />
                  Select Your 3 Free Exercises
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Free Tier users get access to 3 exercises of their choice. Select up to 3 exercises below:
                </p>
              </div>
              <button
                onClick={() => setIsExercisePickerOpen(false)}
                className="p-2 hover:bg-zinc-800 text-zinc-400 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between bg-zinc-950 p-3 rounded-2xl border border-zinc-800 text-xs">
              <span className="font-bold text-zinc-300">Selected Exercises:</span>
              <span className="font-mono font-extrabold px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                {chosenExerciseIds.length} / 3 Selected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-1">
              {sampleExercises.map((ex) => {
                const isSelected = chosenExerciseIds.includes(ex.id) || chosenExerciseIds.includes(ex.name);
                return (
                  <div
                    key={ex.id}
                    onClick={() => toggleExerciseChoice(ex.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-emerald-950/40 border-emerald-500/60 shadow-md shadow-emerald-500/10'
                        : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                        isSelected
                          ? 'bg-emerald-500 border-emerald-400 text-black'
                          : 'border-zinc-700 bg-zinc-900'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-black stroke-[3]" />}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-white truncate">{ex.name}</p>
                      <p className="text-[10px] text-zinc-400 truncate">{ex.muscleGroup} • {ex.equipmentNeeded}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-3">
              <button
                onClick={() => setIsExercisePickerOpen(false)}
                className="w-full py-3 bg-emerald-500 text-black font-extrabold text-xs rounded-xl hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
              >
                Confirm Selection ({chosenExerciseIds.length}/3)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video / Technique Detail Modal */}
      {selectedExerciseForDetail && (
        <VideoTutorialModal
          exercise={selectedExerciseForDetail}
          onClose={() => setSelectedExerciseForDetail(null)}
          onStartExercise={() => {
            // Can launch quick single exercise
          }}
        />
      )}
    </div>
  );
};
