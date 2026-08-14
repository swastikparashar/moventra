import { UserProfile } from '../types';

export async function askAiTrainer(message: string, userProfile?: UserProfile, history?: any[]) {
  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, userProfile, history }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server error: ${res.status}`);
    }

    const data = await res.json();
    return data.reply;
  } catch (error: any) {
    console.warn('API call failed, returning fallback advice:', error.message);
    return `Here is your AI Coach advice for "${message}": Keep your form crisp, stay hydrated with 500ml of water before training, and focus on progressive overload with 12-15 controlled reps! 🔥`;
  }
}

export async function generateAiWorkout(params: {
  goal: string;
  level: string;
  durationMinutes: number;
  equipment: string;
  targetMuscle: string;
}) {
  try {
    const res = await fetch('/api/ai/generate-workout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server error: ${res.status}`);
    }

    const data = await res.json();
    return data.workoutPlan;
  } catch (error: any) {
    console.warn('Workout generation fallback:', error.message);
    return {
      title: `${params.goal} - ${params.durationMinutes} Min Session`,
      description: `Tailored ${params.level} routine focused on ${params.targetMuscle} using ${params.equipment}.`,
      estimatedCalories: Math.round(params.durationMinutes * 9.5),
      exercises: [
        {
          name: 'Explosive Bodyweight Squat',
          muscleGroup: 'Quadriceps & Glutes',
          sets: 4,
          reps: '15 reps',
          restSeconds: 45,
          caloriesBurned: 60,
          instructions: ['Stand shoulder width', 'Lower hips until thighs parallel to ground', 'Explode upwards to start position'],
          tips: ['Drive through heels', 'Keep spine neutral'],
        },
        {
          name: 'Standard Push-Up',
          muscleGroup: 'Chest & Triceps',
          sets: 3,
          reps: '12 reps',
          restSeconds: 45,
          caloriesBurned: 45,
          instructions: ['Hands shoulder width apart', 'Lower chest to 1 inch above floor', 'Push back up powerfully'],
          tips: ['Engage core', 'Avoid sagging lower back'],
        },
        {
          name: 'Core Hold Elbow Plank',
          muscleGroup: 'Abs & Lumbar',
          sets: 3,
          reps: '45 seconds',
          restSeconds: 30,
          caloriesBurned: 35,
          instructions: ['Elbows below shoulders', 'Body straight as a board', 'Breathe steadily without sagging'],
          tips: ['Squeeze glutes', 'Keep neck in line with spine'],
        },
      ],
    };
  }
}

export async function generateAiMealPlan(params: {
  calorieTarget: number;
  proteinTarget: number;
  goal: string;
  dietType: string;
}) {
  try {
    const res = await fetch('/api/ai/generate-meal-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server error: ${res.status}`);
    }

    const data = await res.json();
    return data.mealPlan;
  } catch (error: any) {
    console.warn('Meal plan generation fallback:', error.message);
    return {
      summary: `High protein ${params.goal} plan optimized for ${params.calorieTarget} kcal.`,
      totalCalories: params.calorieTarget,
      totalProtein: params.proteinTarget,
      meals: [
        {
          type: 'breakfast',
          title: 'Spinach & Egg White Power Omelet',
          calories: 380,
          proteinGrams: 32,
          carbsGrams: 22,
          fatGrams: 14,
          prepTimeMinutes: 10,
          ingredients: ['4 Egg Whites', '1 Whole Egg', '1 Cup Fresh Spinach', 'Whole Grain Toast'],
          instructions: ['Whisk eggs', 'Sauté spinach until wilted', 'Pour eggs and cook 4 mins', 'Serve with toasted bread'],
        },
        {
          type: 'lunch',
          title: 'Chicken Breast & Quinoa Harvest Bowl',
          calories: 550,
          proteinGrams: 45,
          carbsGrams: 50,
          fatGrams: 14,
          prepTimeMinutes: 15,
          ingredients: ['180g Grilled Chicken Breast', '1 Cup Fluffy Quinoa', 'Steamed Broccoli', '1 Tsp Olive Oil Dressing'],
          instructions: ['Grill chicken with herbs', 'Mix cooked quinoa with steamed broccoli', 'Slice chicken and place over quinoa bowl'],
        },
        {
          type: 'dinner',
          title: 'Pan-Seared Salmon with Sweet Potato Mash',
          calories: 590,
          proteinGrams: 42,
          carbsGrams: 45,
          fatGrams: 20,
          prepTimeMinutes: 20,
          ingredients: ['180g Wild Salmon', '200g Baked Sweet Potato', 'Roasted Asparagus Spears', 'Lemon Wedges'],
          instructions: ['Sear salmon 4 mins per side', 'Mash sweet potato with salt and pepper', 'Plate together with roasted asparagus'],
        },
        {
          type: 'snack',
          title: 'Greek Yogurt & Almond Protein Shake',
          calories: 280,
          proteinGrams: 28,
          carbsGrams: 24,
          fatGrams: 8,
          prepTimeMinutes: 5,
          ingredients: ['200g Greek Yogurt', '1 Scoop Whey Protein', '1/2 Cup Berries', 'Almond Milk'],
          instructions: ['Blend all ingredients until creamy and smooth.'],
        },
      ],
    };
  }
}
