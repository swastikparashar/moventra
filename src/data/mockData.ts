import { WorkoutPlan, Exercise, Meal, Badge, Challenge, CommunityPost, LeaderboardUser, UserProfile, Announcement, DailyLog } from '../types';

export const initialUserProfile: UserProfile = {
  id: 'usr_001',
  name: 'SWASTIK PARASHAR',
  email: 'swastik.parashar@example.com',
  title: 'C.E.O & FOUNDER',
  role: 'C.E.O & FOUNDER',
  avatar: '/swastik_ceo.jpg',
  age: 26,
  gender: 'male',
  weight: 74,
  height: 178,
  targetWeight: 70,
  goal: 'fat_loss',
  level: 'intermediate',
  dailyStepGoal: 10000,
  dailyWaterGoalMl: 3000,
  dailyCalorieGoal: 2200,
  proteinGoalG: 140,
  streakDays: 6,
  xpPoints: 1450,
  isAdmin: true,
};

export const sampleExercises: Exercise[] = [
  {
    id: 'ex_pushup',
    name: 'Standard Push-Up',
    category: 'home',
    muscleGroup: 'Chest & Triceps',
    difficulty: 'beginner',
    sets: 3,
    reps: '12 - 15 reps',
    restSeconds: 45,
    caloriesBurned: 45,
    imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop&q=80',
    animationType: 'pushup',
    instructions: [
      'Place hands slightly wider than shoulder-width apart on the floor.',
      'Extend legs back so you are balanced on your hands and toes.',
      'Keep your core tight and back straight in a plank position.',
      'Lower your elbows until your chest nearly touches the floor.',
      'Push back up explosively to starting position.'
    ],
    tips: ['Keep your spine neutral', 'Avoid sagging hips', 'Exhale as you push upward'],
    equipmentNeeded: 'None (Bodyweight)'
  },
  {
    id: 'ex_squat',
    name: 'Bodyweight Deep Squat',
    category: 'home',
    muscleGroup: 'Quadriceps & Glutes',
    difficulty: 'beginner',
    sets: 4,
    reps: '15 - 20 reps',
    restSeconds: 60,
    caloriesBurned: 60,
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80',
    animationType: 'squat',
    instructions: [
      'Stand with feet shoulder-width apart, toes pointing slightly outward.',
      'Engage your core and keep your chest lifted high.',
      'Push your hips back and bend knees to lower as if sitting in a low chair.',
      'Lower until thighs are parallel to the ground.',
      'Drive through heels to stand back up to starting stance.'
    ],
    tips: ['Keep knees tracking over toes', 'Keep weight balanced in heels', 'Inhale down, exhale up'],
    equipmentNeeded: 'None (Bodyweight)'
  },
  {
    id: 'ex_plank',
    name: 'Core Hold Elbow Plank',
    category: 'hiit',
    muscleGroup: 'Abs & Core Stability',
    difficulty: 'beginner',
    sets: 3,
    durationSeconds: 45,
    restSeconds: 30,
    caloriesBurned: 35,
    imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=600&auto=format&fit=crop&q=80',
    animationType: 'plank',
    instructions: [
      'Lie face down and place elbows directly beneath shoulders.',
      'Extend legs behind you resting on toes.',
      'Engage abdominal muscles, glutes, and quads to keep body in a rigid line.',
      'Hold position steadily without letting hips arch or sag.'
    ],
    tips: ['Breathe steadily', 'Do not hold your breath', 'Squeeze glutes for stability'],
    equipmentNeeded: 'Yoga Mat'
  },
  {
    id: 'ex_jumping_jacks',
    name: 'Cardio Jumping Jacks',
    category: 'cardio',
    muscleGroup: 'Full Body & Heart Rate',
    difficulty: 'beginner',
    sets: 3,
    durationSeconds: 60,
    restSeconds: 30,
    caloriesBurned: 80,
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80',
    animationType: 'jumping_jacks',
    instructions: [
      'Stand straight with feet together and arms at your sides.',
      'Jump up, spreading feet wider than hips while swinging arms overhead.',
      'Immediately jump back landing softly in starting position.',
      'Repeat rhythmically at a steady pace.'
    ],
    tips: ['Land softly on balls of feet', 'Maintain light knees', 'Keep breathing rhythmic'],
    equipmentNeeded: 'None'
  },
  {
    id: 'ex_bicep_curl',
    name: 'Dumbbell Bicep Curl',
    category: 'gym',
    muscleGroup: 'Biceps & Forearms',
    difficulty: 'intermediate',
    sets: 3,
    reps: '10 - 12 reps',
    restSeconds: 60,
    caloriesBurned: 40,
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
    animationType: 'bicep_curl',
    instructions: [
      'Stand holding dumbbells at arm length with palms facing forward.',
      'Keep elbows tucked tightly near your torso.',
      'Curl dumbbells toward shoulders contracting biceps at top.',
      'Slowly lower dumbbells back down under control.'
    ],
    tips: ['Do not swing your lower back', 'Control the descent', 'Focus on bicep squeeze'],
    equipmentNeeded: 'Dumbbells'
  },
  {
    id: 'ex_lunges',
    name: 'Walking Reverse Lunges',
    category: 'fat_loss',
    muscleGroup: 'Glutes, Quads & Hamstrings',
    difficulty: 'intermediate',
    sets: 3,
    reps: '12 per leg',
    restSeconds: 45,
    caloriesBurned: 65,
    imageUrl: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=600&auto=format&fit=crop&q=80',
    animationType: 'lunges',
    instructions: [
      'Stand upright with feet hip-width apart.',
      'Step backward with left foot and bend both knees to 90-degree angles.',
      'Ensure front knee stays directly above ankle.',
      'Drive through right heel to return to standing position.',
      'Alternate legs for specified reps.'
    ],
    tips: ['Keep torso upright', 'Don’t let back knee slam the ground', 'Engage core for balance'],
    equipmentNeeded: 'Bodyweight or Dumbbells'
  },
  {
    id: 'ex_yoga_downward',
    name: 'Yoga Downward Facing Dog',
    category: 'yoga',
    muscleGroup: 'Hamstrings, Shoulders & Spine',
    difficulty: 'beginner',
    sets: 2,
    durationSeconds: 60,
    restSeconds: 30,
    caloriesBurned: 25,
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80',
    animationType: 'yoga_downward_dog',
    instructions: [
      'Start on hands and knees with wrists under shoulders and knees under hips.',
      'Tuck toes and lift knees off floor pushing hips up toward ceiling.',
      'Straighten legs gently and press heels down toward floor.',
      'Press firmly into palms and lengthen through spine.'
    ],
    tips: ['Bend knees slightly if hamstrings feel tight', 'Relax neck and head between arms'],
    equipmentNeeded: 'Yoga Mat'
  },
  {
    id: 'ex_burpees',
    name: 'High Intensity Burpees',
    category: 'hiit',
    muscleGroup: 'Full Body Explosive',
    difficulty: 'advanced',
    sets: 4,
    reps: '10 - 15 reps',
    restSeconds: 60,
    caloriesBurned: 95,
    imageUrl: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=600&auto=format&fit=crop&q=80',
    animationType: 'burpees',
    instructions: [
      'Stand straight, drop into squat position, and place hands on floor.',
      'Kick feet back into a push-up position.',
      'Perform a push-up, then jump feet forward back to hands.',
      'Explode upward into air reaching arms high.'
    ],
    tips: ['Pace yourself continuously', 'Soft landing on jump', 'Keep core tight in plank'],
    equipmentNeeded: 'None'
  }
];

export const sampleWorkoutPlans: WorkoutPlan[] = [
  {
    id: 'plan_fat_burner',
    title: '30-Min Full Body Fat Burner',
    description: 'High-energy interval circuit designed to burn maximum calories and boost metabolic rate.',
    category: 'fat_loss',
    level: 'beginner',
    durationMinutes: 30,
    totalCalories: 320,
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    isFeatured: true,
    exercises: [
      sampleExercises[3], // jumping jacks
      sampleExercises[0], // pushup
      sampleExercises[1], // squat
      sampleExercises[5], // lunges
      sampleExercises[2], // plank
    ]
  },
  {
    id: 'plan_muscle_builder',
    title: 'Hypertrophy Muscle Gain Circuit',
    description: 'Targeted resistance exercises focused on hyper-stimulating chest, arms, and leg growth.',
    category: 'muscle_gain',
    level: 'intermediate',
    durationMinutes: 45,
    totalCalories: 410,
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80',
    isFeatured: true,
    exercises: [
      sampleExercises[4], // bicep curl
      sampleExercises[0], // pushup
      sampleExercises[1], // squat
      sampleExercises[5], // lunges
      sampleExercises[7], // burpees
    ]
  },
  {
    id: 'plan_home_no_equipment',
    title: 'Zero-Equipment Home Sculpt',
    description: 'No gym required! Complete bodyweight routine perfect for home workouts or quick travel sessions.',
    category: 'home',
    level: 'beginner',
    durationMinutes: 25,
    totalCalories: 260,
    imageUrl: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=600&auto=format&fit=crop&q=80',
    exercises: [
      sampleExercises[0], // pushup
      sampleExercises[1], // squat
      sampleExercises[2], // plank
      sampleExercises[3], // jumping jacks
    ]
  },
  {
    id: 'plan_hiit_blast',
    title: 'Tabata HIIT Shred',
    description: 'Intense 20-minute Tabata style intervals to maximize post-workout excess oxygen consumption (EPOC).',
    category: 'hiit',
    level: 'advanced',
    durationMinutes: 20,
    totalCalories: 350,
    imageUrl: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=600&auto=format&fit=crop&q=80',
    exercises: [
      sampleExercises[7], // burpees
      sampleExercises[3], // jumping jacks
      sampleExercises[5], // lunges
      sampleExercises[2], // plank
    ]
  },
  {
    id: 'plan_yoga_flow',
    title: 'Morning Energy Yoga & Stretch',
    description: 'Decompress tightness, improve spinal mobility, and boost mental focus with mindful breathwork.',
    category: 'yoga',
    level: 'beginner',
    durationMinutes: 20,
    totalCalories: 120,
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80',
    exercises: [
      sampleExercises[6], // downward dog
      sampleExercises[2], // plank
    ]
  },
  {
    id: 'plan_gym_beast',
    title: 'Gym Strength & Power',
    description: 'Heavy compound loads focused on building raw power, bone density, and muscle mass.',
    category: 'gym',
    level: 'advanced',
    durationMinutes: 50,
    totalCalories: 480,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
    exercises: [
      sampleExercises[1], // squat
      sampleExercises[4], // bicep curl
      sampleExercises[5], // lunges
      sampleExercises[7], // burpees
    ]
  }
];

export const sampleMeals: Meal[] = [
  {
    id: 'meal_001',
    title: 'Avocado & Egg Power Toast',
    type: 'breakfast',
    calories: 420,
    proteinGrams: 24,
    carbsGrams: 35,
    fatGrams: 20,
    prepTimeMinutes: 10,
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=80',
    ingredients: ['2 Slices Whole Grain Bread', '1/2 Ripe Avocado', '2 Large Pasture Eggs', 'Chili Flakes & Sea Salt'],
    instructions: ['Toast whole grain bread to golden crispness.', 'Mash avocado with sea salt and spread over toast.', 'Poach or fry eggs to soft yolk.', 'Top toast with eggs and chili flakes.']
  },
  {
    id: 'meal_002',
    title: 'Grilled Salmon Quinoa Bowl',
    type: 'lunch',
    calories: 580,
    proteinGrams: 42,
    carbsGrams: 48,
    fatGrams: 22,
    prepTimeMinutes: 20,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
    ingredients: ['180g Wild Salmon Fillet', '1 Cup Cooked Quinoa', 'Steamed Broccoli & Edamame', 'Lemon Olive Oil Dressing'],
    instructions: ['Season salmon with herbs, pepper, and olive oil.', 'Pan sear salmon 4 mins per side until flakey.', 'Assemble quinoa bowl with edamame and steamed broccoli.', 'Top with salmon and drizzle lemon dressing.']
  },
  {
    id: 'meal_003',
    title: 'Lean Beef & Sweet Potato Mash',
    type: 'dinner',
    calories: 620,
    proteinGrams: 48,
    carbsGrams: 52,
    fatGrams: 18,
    prepTimeMinutes: 25,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80',
    ingredients: ['200g Lean Ground Beef (93%)', '200g Baked Sweet Potato', 'Roasted Asparagus', 'Garlic & Rosemary'],
    instructions: ['Bake sweet potatoes until tender and mash.', 'Brown lean ground beef with garlic and rosemary.', 'Roast asparagus in oven at 200°C for 12 mins.', 'Plate together for high-protein recovery meal.']
  },
  {
    id: 'meal_004',
    title: 'Greek Yogurt Berry Protein Bowl',
    type: 'snack',
    calories: 280,
    proteinGrams: 26,
    carbsGrams: 30,
    fatGrams: 6,
    prepTimeMinutes: 5,
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=80',
    ingredients: ['200g Non-Fat Greek Yogurt', '1 Scoop Whey Protein', '1/2 Cup Mixed Berries', 'Chia Seeds & Honey Drizzle'],
    instructions: ['Mix Greek yogurt with protein powder until smooth.', 'Top with fresh blueberries, raspberries, and chia seeds.', 'Drizzle lightly with raw honey.']
  }
];

export const sampleBadges: Badge[] = [
  { id: 'b_streak_7', title: '7-Day Warrior', description: 'Maintained a 7-day workout streak without missing a day.', icon: 'Flame', unlocked: true, unlockedAt: 'Yesterday', category: 'streak' },
  { id: 'b_hydro_master', title: 'Hydration Master', description: 'Reached daily water goal 5 days in a row.', icon: 'Droplets', unlocked: true, unlockedAt: '3 days ago', category: 'hydration' },
  { id: 'b_step_10k', title: '10k Stepper', description: 'Logged 10,000 steps in a single day.', icon: 'Footprints', unlocked: true, unlockedAt: '5 days ago', category: 'workout' },
  { id: 'b_heavy_lifter', title: 'Power Lifter', description: 'Completed 10 gym strength training sessions.', icon: 'Dumbbell', unlocked: false, category: 'workout' },
  { id: 'b_community_star', title: 'Community Star', description: 'Shared 5 workout achievements with the feed.', icon: 'Award', unlocked: false, category: 'social' },
  { id: 'b_30day_hero', title: '30-Day Legend', description: 'Completed a full 30-Day Fitness Challenge.', icon: 'Trophy', unlocked: false, category: 'challenge' },
];

export const sampleChallenges: Challenge[] = [
  {
    id: 'c_7day',
    title: '7-Day Core & Cardio Boost',
    description: 'Perform a daily 15-min core & cardio blast every morning for 7 consecutive days.',
    totalDays: 7,
    currentDay: 6,
    targetCount: '15 mins/day',
    rewardXp: 500,
    rewardBadge: '7-Day Warrior',
    iconName: 'Zap',
    completedDays: [true, true, true, true, true, true, false],
    category: '7day'
  },
  {
    id: 'c_30day',
    title: '30-Day Total Body Transformation',
    description: 'Progressive daily bodyweight workouts designed to build strength, posture, and endurance.',
    totalDays: 30,
    currentDay: 12,
    targetCount: '1 workout/day',
    rewardXp: 2000,
    rewardBadge: '30-Day Legend',
    iconName: 'ShieldCheck',
    completedDays: Array(12).fill(true).concat(Array(18).fill(false)),
    category: '30day'
  },
  {
    id: 'c_pushup',
    title: '100 Push-Ups Daily Challenge',
    description: 'Accumulate 100 pushups throughout the day across sets of your choice.',
    totalDays: 14,
    currentDay: 4,
    targetCount: '100 reps/day',
    rewardXp: 800,
    rewardBadge: 'Pushup Titan',
    iconName: 'Dumbbell',
    completedDays: [true, true, true, true, false, false, false, false, false, false, false, false, false, false],
    category: 'pushup'
  },
  {
    id: 'c_plank',
    title: '5-Minute Plank Endurance',
    description: 'Build core stability to achieve a continuous 5-minute plank hold by day 21.',
    totalDays: 21,
    currentDay: 8,
    targetCount: 'Build up to 5 min',
    rewardXp: 1200,
    rewardBadge: 'Iron Core',
    iconName: 'Timer',
    completedDays: Array(8).fill(true).concat(Array(13).fill(false)),
    category: 'plank'
  }
];

export const sampleCommunityPosts: CommunityPost[] = [
  {
    id: 'post_001',
    userId: 'usr_002',
    userName: 'Elena Rostova',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    timestamp: '2 hours ago',
    workoutTitle: '30-Min Full Body Fat Burner',
    content: 'Just smashed the 30-min Fat Burner session! Sweat level 10/10 💦 Feeling super energized for the day!',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    likes: 24,
    isLiked: false,
    comments: [
      { id: 'c1', userName: 'Marcus Vance', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', text: 'Crushing it Elena! Keep pushing 🔥', timestamp: '1 hour ago' },
      { id: 'c2', userName: 'Sophia Chen', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', text: 'That routine is brutal but effective!', timestamp: '30 mins ago' }
    ]
  },
  {
    id: 'post_002',
    userId: 'usr_003',
    userName: 'David Miller',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    timestamp: '5 hours ago',
    workoutTitle: 'Gym Strength & Power',
    content: 'Hit a personal record today: 140kg squat for 5 clean reps! Consistent progressive overload pays off. 💪',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
    likes: 42,
    isLiked: true,
    comments: [
      { id: 'c3', userName: 'SWASTIK PARASHAR', userAvatar: '/swastik_ceo.jpg', text: 'Insane weight man! Congrats on the PR 🚀', timestamp: '4 hours ago' }
    ]
  }
];

export const sampleLeaderboard: LeaderboardUser[] = [
  { rank: 1, id: 'u1', name: 'Samantha Wu', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', score: 3850, streakDays: 24, badge: '🔥 Elite Athlete' },
  { rank: 2, id: 'u2', name: 'David Miller', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', score: 3420, streakDays: 18, badge: '⚡ Beast Mode' },
  { rank: 3, id: 'usr_001', name: 'SWASTIK PARASHAR (You)', avatar: '/swastik_ceo.jpg', score: 1450, streakDays: 6, badge: '🌟 Rising Star' },
  { rank: 4, id: 'u3', name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', score: 1290, streakDays: 9, badge: '💪 Fitness Fanatic' },
  { rank: 5, id: 'u4', name: 'Marcus Vance', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', score: 1100, streakDays: 5, badge: '🎯 Goal Getter' }
];

export const sampleAnnouncements: Announcement[] = [
  { id: 'a1', title: 'Moventra 3.0 Release', message: 'Welcome to Moventra AI! Check out our brand new AI Personal Trainer with adaptive coaching.', date: '2026-08-01', type: 'update' },
  { id: 'a2', title: 'Summer Shred Challenge', message: 'Join the 30-Day Fitness Challenge starting this Monday for exclusive rewards!', date: '2026-08-04', type: 'event' }
];

export const mockDailyLog: DailyLog = {
  date: '2026-08-05',
  caloriesBurned: 380,
  caloriesConsumed: 1850,
  waterMl: 2250,
  steps: 8450,
  completedWorkoutIds: ['plan_fat_burner'],
  weightKg: 74,
  bodyMeasurements: {
    chestCm: 102,
    waistCm: 82,
    hipsCm: 98,
    armsCm: 38,
    thighsCm: 58,
  },
};

// Convenient exports matching App imports
export const mockUser = initialUserProfile;
export const mockWorkoutPlans = sampleWorkoutPlans;
export const mockMeals = sampleMeals;
export const mockBadges = sampleBadges;
export const mockChallenges = sampleChallenges;
export const mockPosts = sampleCommunityPosts;
export const mockLeaderboard = sampleLeaderboard;
export const mockAnnouncements = sampleAnnouncements;

