import React, { useState } from 'react';
import { UserProfile, WorkoutPlan, Exercise } from '../../types';
import { askAiTrainer, generateAiWorkout } from '../../services/api';
import { FirestoreUserProfile } from '../../services/firebase';
import {
  Bot,
  Sparkles,
  Send,
  Loader2,
  Brain,
  Zap,
  CheckCircle2,
  RefreshCw,
  Play,
  Dumbbell,
  ShieldCheck,
  Calendar,
  Lock,
  Crown,
  CreditCard,
} from 'lucide-react';

interface AiTrainerViewProps {
  user: UserProfile;
  currentUser?: FirestoreUserProfile | null;
  onSaveGeneratedPlan: (plan: WorkoutPlan) => void;
  onStartWorkout: (plan: WorkoutPlan) => void;
}

export const AiTrainerView: React.FC<AiTrainerViewProps> = ({
  user,
  currentUser,
  onSaveGeneratedPlan,
  onStartWorkout,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'generator' | 'daily'>('chat');

  // Chat state
  const [messages, setMessages] = useState<
    { sender: 'ai' | 'user'; text: string; timestamp: string }[]
  >([
    {
      sender: 'ai',
      text: `Hello ${user.name}! 👋 I am your dedicated Moventra AI Personal Trainer. How can I coach you today? You can ask me to evaluate your form, adjust your current plan, suggest high-protein snacks, or craft a quick 20-minute session!`,
      timestamp: 'Just now',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Generator Form state
  const [genGoal, setGenGoal] = useState(user.goal || 'fat_loss');
  const [genLevel, setGenLevel] = useState(user.level || 'intermediate');
  const [genDuration, setGenDuration] = useState(30);
  const [genEquipment, setGenEquipment] = useState('Dumbbells & Bodyweight');
  const [genMuscle, setGenMuscle] = useState('Full Body');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<WorkoutPlan | null>(null);

  // Handle AI Chat submission
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || isChatLoading) return;

    const userText = inputMsg;
    setInputMsg('');
    const newMsgs = [
      ...messages,
      { sender: 'user' as const, text: userText, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ];
    setMessages(newMsgs);
    setIsChatLoading(true);

    const historyPayload = newMsgs.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      content: m.text,
    }));

    const reply = await askAiTrainer(userText, user, historyPayload);
    setIsChatLoading(false);

    setMessages((prev) => [
      ...prev,
      {
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Handle AI Workout Plan Generation
  const handleGenerateWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    const rawResult = await generateAiWorkout({
      goal: genGoal,
      level: genLevel,
      durationMinutes: genDuration,
      equipment: genEquipment,
      targetMuscle: genMuscle,
    });

    setIsGenerating(false);

    // Map to WorkoutPlan format
    const plan: WorkoutPlan = {
      id: `ai_plan_${Date.now()}`,
      title: rawResult.title || 'Custom AI Fitness Plan',
      description: rawResult.description || 'AI-crafted workout tailored for your biometrics.',
      category: 'fat_loss',
      level: genLevel as any,
      durationMinutes: genDuration,
      totalCalories: rawResult.estimatedCalories || Math.round(genDuration * 9.5),
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
      exercises: (rawResult.exercises || []).map((ex: any, idx: number) => ({
        id: `ai_ex_${idx}`,
        name: ex.name || 'Exercise',
        category: 'home',
        muscleGroup: ex.muscleGroup || genMuscle,
        difficulty: genLevel as any,
        sets: ex.sets || 3,
        reps: ex.reps || '12 reps',
        restSeconds: ex.restSeconds || 45,
        caloriesBurned: ex.caloriesBurned || 40,
        imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=80',
        animationType: idx % 2 === 0 ? 'squat' : 'pushup',
        instructions: ex.instructions || ['Perform exercise with controlled posture.'],
        tips: ex.tips || ['Keep core engaged'],
        equipmentNeeded: genEquipment,
      })),
    };

    setGeneratedPlan(plan);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden bg-gradient-to-r from-emerald-950 via-zinc-900 to-zinc-950 border border-emerald-500/30 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500 text-black font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 fill-black" />
                Gemini 3.6 Flash Powered
              </span>
              <span className="text-xs text-zinc-400">Adaptive Coaching</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              AI Personal Trainer
            </h1>
            <p className="text-zinc-300 text-sm mt-1 max-w-xl">
              Get personalized workout generation, instant technique guidance, and smart recovery recommendations based on your profile.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-400 bg-zinc-900/80 px-3 py-1 rounded-xl border border-zinc-800 w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>AI guidance is for general fitness guidance only and not medical advice.</span>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex gap-2 bg-zinc-950/80 p-1.5 rounded-2xl border border-zinc-800">
            <button
              onClick={() => setActiveSubTab('chat')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeSubTab === 'chat'
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Coach Chat
            </button>
            <button
              onClick={() => setActiveSubTab('generator')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeSubTab === 'generator'
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Plan Generator
            </button>
            <button
              onClick={() => setActiveSubTab('daily')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                activeSubTab === 'daily'
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Daily Advice
            </button>
          </div>
        </div>
      </div>

      {/* Sub Tab Content */}
      {activeSubTab === 'chat' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[550px]">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 border ${
                    msg.sender === 'user'
                      ? 'bg-zinc-800 border-zinc-700 text-white'
                      : 'bg-emerald-950 border-emerald-800 text-emerald-400'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <span className="text-xs font-bold">You</span>
                  ) : (
                    <Bot className="w-5 h-5" />
                  )}
                </div>

                <div>
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-emerald-500 text-black font-medium rounded-tr-none'
                        : 'bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-zinc-500 block mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isChatLoading && (
              <div className="flex items-center gap-3 text-emerald-400 text-xs font-semibold bg-emerald-950/40 p-3 rounded-2xl border border-emerald-900/50 w-fit">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI Coach is analyzing your request...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="px-4 py-2 bg-zinc-950 border-t border-zinc-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
            <span className="text-zinc-500 font-bold shrink-0">Try asking:</span>
            {[
              'How can I fix my squat depth?',
              'Suggest a 20-min HIIT fat loss session',
              'What should I eat post-workout for recovery?',
              'How to overcome a bench press plateau?',
            ].map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => setInputMsg(suggestion)}
                className="px-3 py-1 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 shrink-0 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendChat} className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center gap-3">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Ask your AI personal trainer anything..."
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 placeholder-zinc-500"
            />
            <button
              type="submit"
              disabled={isChatLoading || !inputMsg.trim()}
              className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-extrabold text-sm flex items-center gap-2 transition-colors shadow-md shadow-emerald-500/20"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      )}

      {activeSubTab === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Generator Controls */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-xl">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Brain className="w-5 h-5 text-emerald-400" />
              Generate Customized AI Workout
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              Our AI algorithm crafts precise set, rep, and exercise progression tailored to your exact equipment & duration.
            </p>

            <form onSubmit={handleGenerateWorkout} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Target Goal</label>
                  <select
                    value={genGoal}
                    onChange={(e) => setGenGoal(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Fat Loss & Toning">Fat Loss & Toning</option>
                    <option value="Hypertrophy Muscle Gain">Hypertrophy Muscle Gain</option>
                    <option value="Pure Strength Building">Pure Strength Building</option>
                    <option value="Endurance & Cardio Stamina">Endurance & Cardio Stamina</option>
                    <option value="Mobility & Yoga Flow">Mobility & Yoga Flow</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Experience Level</label>
                  <select
                    value={genLevel}
                    onChange={(e) => setGenLevel(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Duration (Minutes)</label>
                  <select
                    value={genDuration}
                    onChange={(e) => setGenDuration(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value={15}>15 Mins (Express)</option>
                    <option value={30}>30 Mins (Standard)</option>
                    <option value={45}>45 Mins (Intense)</option>
                    <option value={60}>60 Mins (Pro)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Focus Muscle Group</label>
                  <select
                    value={genMuscle}
                    onChange={(e) => setGenMuscle(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Full Body">Full Body</option>
                    <option value="Chest & Triceps">Chest & Triceps</option>
                    <option value="Back & Biceps">Back & Biceps</option>
                    <option value="Quads, Hamstrings & Glutes">Quads, Hamstrings & Glutes</option>
                    <option value="Abs & Core Stability">Abs & Core Stability</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Available Equipment</label>
                <input
                  type="text"
                  value={genEquipment}
                  onChange={(e) => setGenEquipment(e.target.value)}
                  placeholder="e.g. Dumbbells, Resistance Bands, Kettlebell, Bodyweight"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 text-black font-extrabold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>AI Model Building Workout...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 fill-black" />
                    <span>Generate AI Workout Routine</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Generated Result Output */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-xl flex flex-col justify-between">
            {generatedPlan ? (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                    Generated Plan Ready
                  </span>
                  <span className="text-xs text-amber-400 font-bold">~{generatedPlan.totalCalories} kcal</span>
                </div>

                <h3 className="text-2xl font-black text-white mb-2">{generatedPlan.title}</h3>
                <p className="text-sm text-zinc-400 mb-6">{generatedPlan.description}</p>

                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Exercise Sequence</h4>
                <div className="space-y-3 mb-6">
                  {generatedPlan.exercises.map((ex, i) => (
                    <div key={i} className="bg-zinc-950 p-3.5 rounded-2xl border border-zinc-800 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white text-sm">{ex.name}</div>
                        <div className="text-xs text-emerald-400">{ex.muscleGroup} • {ex.sets} Sets ({ex.reps})</div>
                      </div>
                      <span className="text-xs text-zinc-400 font-mono bg-zinc-900 px-2.5 py-1 rounded-lg">
                        {ex.restSeconds}s rest
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      onSaveGeneratedPlan(generatedPlan);
                    }}
                    className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs border border-zinc-700 transition-colors"
                  >
                    Save to My Workouts
                  </button>
                  <button
                    onClick={() => onStartWorkout(generatedPlan)}
                    className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-emerald-500/20"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    Start Now
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-zinc-500">
                <Bot className="w-16 h-16 text-zinc-700 mb-4 animate-bounce" />
                <p className="text-base font-bold text-white mb-1">Ready to Build Your Custom Routine</p>
                <p className="text-xs max-w-xs">Fill out the parameters on the left and click "Generate AI Workout Routine".</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'daily' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-xl">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              Daily Recommended Exercises
            </h3>
            <p className="text-xs text-zinc-400 mb-4">AI-selected daily movements based on your current recovery state & target muscle groups.</p>
            
            <div className="space-y-3">
              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Morning Mobility Routine</span>
                  <span className="text-xs text-emerald-400 font-semibold">10 Mins</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">Light hip openers & spinal twists to activate nervous system.</p>
              </div>
              <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Core Plank Hold Circuit</span>
                  <span className="text-xs text-amber-400 font-semibold">15 Mins</span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">3 sets of elbow planks & side planks for waist stability.</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-xl">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              Smart Recovery & Sleep Status
            </h3>
            <p className="text-xs text-zinc-400 mb-4">AI recovery score calculated from recent workout intensity and rest cycles.</p>
            
            <div className="bg-emerald-950/40 border border-emerald-900/60 p-4 rounded-2xl mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-emerald-400">Recovery Score: 92%</span>
                <span className="text-xs bg-emerald-500 text-black px-2.5 py-0.5 rounded-full font-bold">Optimal</span>
              </div>
              <p className="text-xs text-emerald-200/80 mt-1">Your muscles are well-rested. Recommended: High intensity leg or push day today!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
