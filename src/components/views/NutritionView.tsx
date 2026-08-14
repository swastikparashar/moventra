import React, { useState } from 'react';
import { UserProfile, Meal } from '../../types';
import { generateAiMealPlan } from '../../services/api';
import { VoiceNoteRecorder } from '../VoiceNoteRecorder';
import {
  Utensils,
  Sparkles,
  Flame,
  Plus,
  Clock,
  PieChart as PieIcon,
  Calculator,
  Droplets,
  CheckCircle2,
  Loader2,
  Search,
  Mic,
  Volume2,
} from 'lucide-react';

interface NutritionViewProps {
  user: UserProfile;
  meals: Meal[];
  onAddMeal: (meal: Meal) => void;
  onUpdateWater: (ml: number) => void;
  waterMl: number;
}

export const NutritionView: React.FC<NutritionViewProps> = ({
  user,
  meals,
  onAddMeal,
  onUpdateWater,
  waterMl,
}) => {
  const [activeTab, setActiveTab] = useState<'planner' | 'calculator' | 'ai'>('planner');
  const [selectedMealType, setSelectedMealType] = useState<string>('all');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [aiMealPlanResult, setAiMealPlanResult] = useState<any | null>(null);

  // Saved Voice Notes state
  const [nutritionVoiceNotes, setNutritionVoiceNotes] = useState<
    Array<{ id: string; transcript: string; audioUrl?: string; timestamp: string }>
  >([
    {
      id: 'v1',
      transcript: 'Had 3 scrambled eggs with spinach, avocado, and whole wheat toast for breakfast.',
      timestamp: '08:30 AM',
    },
  ]);

  // Calorie & Protein Calculator State
  const [calcWeight, setCalcWeight] = useState(user.weight);
  const [calcHeight, setCalcHeight] = useState(user.height);
  const [calcAge, setCalcAge] = useState(user.age);
  const [calcActivity, setCalcActivity] = useState('moderate');
  const [calcGoal, setCalcGoal] = useState('fat_loss');

  // Calculate BMR & TDEE
  const bmr = Math.round(10 * calcWeight + 6.25 * calcHeight - 5 * calcAge + 5);
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    intense: 1.9,
  };
  const tdee = Math.round(bmr * (activityMultipliers[calcActivity] || 1.55));
  let targetCalories = tdee;
  if (calcGoal === 'fat_loss') targetCalories = tdee - 500;
  if (calcGoal === 'muscle_gain') targetCalories = tdee + 300;

  const targetProtein = Math.round(calcWeight * 2.0); // 2g per kg
  const targetFat = Math.round((targetCalories * 0.25) / 9);
  const targetCarbs = Math.round((targetCalories - (targetProtein * 4 + targetFat * 9)) / 4);

  // Current logged totals
  const totalCaloriesLogged = meals.reduce((acc, m) => acc + m.calories, 0);
  const totalProteinLogged = meals.reduce((acc, m) => acc + m.proteinGrams, 0);
  const totalCarbsLogged = meals.reduce((acc, m) => acc + m.carbsGrams, 0);
  const totalFatLogged = meals.reduce((acc, m) => acc + m.fatGrams, 0);

  const filteredMeals = meals.filter(
    (m) => selectedMealType === 'all' || m.type === selectedMealType
  );

  const handleGenerateAiMealPlan = async () => {
    setIsGeneratingPlan(true);
    const plan = await generateAiMealPlan({
      calorieTarget: user.dailyCalorieGoal || 2200,
      proteinTarget: user.proteinGoalG || 140,
      goal: user.goal || 'Fat Loss',
      dietType: 'High Protein Balanced',
    });
    setIsGeneratingPlan(false);
    setAiMealPlanResult(plan);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Utensils className="w-8 h-8 text-emerald-400" />
            Nutrition & Macro Tracker
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Track daily macros, discover high-protein recipes, and generate AI-driven meal plans.
          </p>
        </div>

        {/* Sub Tabs */}
        <div className="flex bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800">
          <button
            onClick={() => setActiveTab('planner')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'planner'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Meal Log
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'calculator'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Calorie Calculator
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'ai'
                ? 'bg-emerald-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            AI Meal Planner
          </button>
        </div>
      </div>

      {/* Daily Macro Progress Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl shadow-lg">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-zinc-400 uppercase">Total Calories</span>
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalCaloriesLogged} <span className="text-xs text-zinc-500 font-normal">/ {user.dailyCalorieGoal} kcal</span></div>
          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden mt-3">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: `${Math.min(100, (totalCaloriesLogged / user.dailyCalorieGoal) * 100)}%` }} />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl shadow-lg">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-zinc-400 uppercase">Protein (g)</span>
            <span className="text-xs font-bold text-emerald-400">Target: {user.proteinGoalG}g</span>
          </div>
          <div className="text-2xl font-black text-white">{totalProteinLogged}g</div>
          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden mt-3">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, (totalProteinLogged / user.proteinGoalG) * 100)}%` }} />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl shadow-lg">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-zinc-400 uppercase">Carbohydrates</span>
            <span className="text-xs font-bold text-cyan-400">Target: ~220g</span>
          </div>
          <div className="text-2xl font-black text-white">{totalCarbsLogged}g</div>
          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden mt-3">
            <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${Math.min(100, (totalCarbsLogged / 220) * 100)}%` }} />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl shadow-lg">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold text-zinc-400 uppercase">Healthy Fats</span>
            <span className="text-xs font-bold text-rose-400">Target: ~60g</span>
          </div>
          <div className="text-2xl font-black text-white">{totalFatLogged}g</div>
          <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden mt-3">
            <div className="bg-rose-400 h-full rounded-full" style={{ width: `${Math.min(100, (totalFatLogged / 60) * 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'planner' && (
        <div className="space-y-6">
          {/* Voice Note Recording Section */}
          <VoiceNoteRecorder
            title="Record Nutrition Voice Note"
            placeholder="Speak what you ate (e.g. 'I had 200g chicken breast with 1 cup brown rice and steamed broccoli for lunch')..."
            category="nutrition"
            accentColor="emerald"
            onSaveVoiceNote={(note) => {
              setNutritionVoiceNotes((prev) => [
                {
                  id: 'vn_' + Date.now(),
                  transcript: note.transcript,
                  audioUrl: note.audioUrl,
                  timestamp: note.timestamp,
                },
                ...prev,
              ]);

              // Also auto-add a custom voice meal log!
              onAddMeal({
                id: 'voice_meal_' + Date.now(),
                title: note.transcript.substring(0, 35) + (note.transcript.length > 35 ? '...' : ''),
                type: 'snack',
                calories: 380,
                proteinGrams: 30,
                carbsGrams: 35,
                fatGrams: 12,
                imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=400&q=80',
                ingredients: [note.transcript],
                prepTimeMinutes: 5,
              });
            }}
          />

          {/* Saved Nutrition Voice Notes List */}
          {nutritionVoiceNotes.length > 0 && (
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <Mic className="w-4 h-4 text-emerald-400" />
                <span>Recorded Nutrition Notes ({nutritionVoiceNotes.length})</span>
              </h3>
              <div className="space-y-2">
                {nutritionVoiceNotes.map((vn) => (
                  <div
                    key={vn.id}
                    className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <p className="text-white font-medium leading-relaxed">"{vn.transcript}"</p>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                        <span>{vn.timestamp}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold">Logged to Nutrition</span>
                      </div>
                    </div>
                    {vn.audioUrl && (
                      <button
                        onClick={() => {
                          const a = new Audio(vn.audioUrl);
                          a.play();
                        }}
                        className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 transition-colors shrink-0"
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

          {/* Filters */}
          <div className="flex gap-2 border-b border-zinc-800 pb-3">
            {['all', 'breakfast', 'lunch', 'dinner', 'snack'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedMealType(type)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  selectedMealType === type
                    ? 'bg-emerald-500 text-black'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Meal List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMeals.map((meal) => (
              <div
                key={meal.id}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 flex flex-col sm:flex-row gap-5 shadow-lg group hover:border-emerald-500/50 transition-all"
              >
                <img
                  src={meal.imageUrl}
                  alt={meal.title}
                  className="w-full sm:w-36 h-36 object-cover rounded-2xl group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {meal.type}
                      </span>
                      <span className="text-xs text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        {meal.prepTimeMinutes} mins
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {meal.title}
                    </h3>

                    {/* Macros breakdown row */}
                    <div className="flex items-center gap-3 my-3 text-xs text-zinc-300">
                      <span className="font-extrabold text-amber-400">{meal.calories} kcal</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">{meal.proteinGrams}g Protein</span>
                      <span>•</span>
                      <span className="text-cyan-400">{meal.carbsGrams}g Carbs</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                    <span className="text-xs text-zinc-400 font-medium">{meal.ingredients.length} ingredients</span>
                    <button
                      onClick={() => onAddMeal(meal)}
                      className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center gap-1.5 border border-zinc-700 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Log Meal</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-xl">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-400" />
              BMR & TDEE Calorie Calculator
            </h3>
            <p className="text-xs text-zinc-400 mb-6">Calculate exact basal metabolic rate & target macros for fat loss or muscle gain.</p>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={calcHeight}
                    onChange={(e) => setCalcHeight(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Age</label>
                  <input
                    type="number"
                    value={calcAge}
                    onChange={(e) => setCalcAge(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Activity Level</label>
                  <select
                    value={calcActivity}
                    onChange={(e) => setCalcActivity(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="sedentary">Sedentary (Office job)</option>
                    <option value="light">Lightly Active (1-2 workouts)</option>
                    <option value="moderate">Moderately Active (3-5 workouts)</option>
                    <option value="active">Very Active (6-7 workouts)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Target Goal</label>
                  <select
                    value={calcGoal}
                    onChange={(e) => setCalcGoal(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="fat_loss">Fat Loss (-500 kcal deficit)</option>
                    <option value="maintenance">Weight Maintenance</option>
                    <option value="muscle_gain">Muscle Gain (+300 kcal surplus)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Calculated Target Intake</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                  <span className="text-xs text-zinc-500 block">Basal Metabolic Rate (BMR)</span>
                  <span className="text-2xl font-black text-white">{bmr} kcal</span>
                </div>
                <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                  <span className="text-xs text-zinc-500 block">Daily Energy Expenditure</span>
                  <span className="text-2xl font-black text-white">{tdee} kcal</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-950 to-zinc-950 border border-emerald-500/40 p-5 rounded-2xl mb-6">
                <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Recommended Target</div>
                <div className="text-4xl font-black text-white my-1">{targetCalories} <span className="text-sm text-zinc-400">kcal/day</span></div>
                <div className="grid grid-cols-3 gap-2 mt-4 text-xs font-semibold">
                  <div className="bg-zinc-900 p-2 rounded-xl text-emerald-400 text-center">{targetProtein}g Protein</div>
                  <div className="bg-zinc-900 p-2 rounded-xl text-cyan-400 text-center">{targetCarbs}g Carbs</div>
                  <div className="bg-zinc-900 p-2 rounded-xl text-rose-400 text-center">{targetFat}g Fat</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-black text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-emerald-400" />
                AI Recipe & Meal Generator
              </h3>
              <p className="text-sm text-zinc-400">Generate a custom 1-day meal plan based on your exact calorie & macro requirements.</p>
            </div>
            <button
              onClick={handleGenerateAiMealPlan}
              disabled={isGeneratingPlan}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 text-black font-extrabold text-sm flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {isGeneratingPlan ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 fill-black" />}
              <span>Generate AI Meal Plan</span>
            </button>
          </div>

          {aiMealPlanResult ? (
            <div className="space-y-4">
              <div className="bg-emerald-950/60 border border-emerald-800 p-4 rounded-2xl text-emerald-300 text-sm">
                <strong>AI Summary:</strong> {aiMealPlanResult.summary}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiMealPlanResult.meals?.map((m: any, idx: number) => (
                  <div key={idx} className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold uppercase text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800">{m.type}</span>
                      <span className="text-xs font-bold text-amber-400">{m.calories} kcal</span>
                    </div>
                    <h4 className="font-bold text-white text-base mb-1">{m.title}</h4>
                    <p className="text-xs text-zinc-400 mb-3">{m.proteinGrams}g Protein • {m.carbsGrams}g Carbs • {m.fatGrams}g Fat</p>
                    <div className="text-xs text-zinc-300 font-mono bg-zinc-900 p-2.5 rounded-xl">
                      <strong>Ingredients:</strong> {m.ingredients?.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-zinc-500">
              <Utensils className="w-12 h-12 text-zinc-700 mx-auto mb-3 animate-bounce" />
              <p className="text-base font-bold text-white mb-1">No AI Meal Plan generated yet</p>
              <p className="text-xs">Click "Generate AI Meal Plan" above to trigger Gemini nutrition synthesis.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
