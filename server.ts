import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// AI Personal Trainer Chat Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, userProfile, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemInstruction = `You are FitLife AI, an elite, encouraging, and highly knowledgeable certified personal trainer, nutritionist, and sports scientist.
User Context:
Name: ${userProfile?.name || 'Athlete'}
Goal: ${userProfile?.goal || 'general fitness'}
Level: ${userProfile?.level || 'beginner'}
Weight: ${userProfile?.weight || 70}kg, Height: ${userProfile?.height || 170}cm, Age: ${userProfile?.age || 25}

Guidelines:
1. Provide actionable, concise, safety-first exercise & nutrition advice.
2. Use supportive, motivating tone with clear formatting (bullet points, bold highlights).
3. If asked about workout routines, specify recommended sets, reps, and form cues.
4. Keep responses focused, encouraging, and easy to follow.`;

    const chat = ai.chats.create({
      model: 'gemini-3.6-flash',
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    // Send history if provided
    if (Array.isArray(history)) {
      for (const h of history) {
        if (h.role === 'user' && h.content) {
          await chat.sendMessage({ message: h.content });
        }
      }
    }

    const response = await chat.sendMessage({ message });
    return res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Error in AI Trainer chat:', error);
    return res.status(500).json({
      error: 'Failed to generate response from AI Personal Trainer',
      details: error?.message || 'Unknown error',
    });
  }
});

// Generate Custom Workout Plan Endpoint
app.post('/api/ai/generate-workout', async (req, res) => {
  try {
    const { goal, level, durationMinutes, equipment, targetMuscle } = req.body;

    const prompt = `Generate a customized workout plan for a user with the following details:
- Goal: ${goal || 'Fat Loss & Toning'}
- Experience Level: ${level || 'Intermediate'}
- Workout Duration: ${durationMinutes || 30} minutes
- Available Equipment: ${equipment || 'Bodyweight & Dumbbells'}
- Focus Area: ${targetMuscle || 'Full Body'}

Return a structured JSON object.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an expert strength & conditioning coach. Return only valid JSON adhering strictly to the schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            estimatedCalories: { type: Type.NUMBER },
            exercises: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  muscleGroup: { type: Type.STRING },
                  sets: { type: Type.NUMBER },
                  reps: { type: Type.STRING },
                  restSeconds: { type: Type.NUMBER },
                  caloriesBurned: { type: Type.NUMBER },
                  instructions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  tips: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['name', 'muscleGroup', 'sets', 'reps', 'restSeconds', 'instructions'],
              },
            },
          },
          required: ['title', 'description', 'estimatedCalories', 'exercises'],
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error('Empty response from AI model');
    }

    const workoutPlan = JSON.parse(jsonText);
    return res.json({ workoutPlan });
  } catch (error: any) {
    console.error('Error in generate-workout:', error);
    return res.status(500).json({
      error: 'Failed to generate custom workout plan',
      details: error?.message || 'Unknown error',
    });
  }
});

// Generate Meal Plan Endpoint
app.post('/api/ai/generate-meal-plan', async (req, res) => {
  try {
    const { calorieTarget, proteinTarget, goal, dietType } = req.body;

    const prompt = `Generate a 1-day healthy meal plan for a fitness enthusiast:
- Daily Calorie Target: ${calorieTarget || 2200} kcal
- Daily Protein Target: ${proteinTarget || 140} grams
- Fitness Goal: ${goal || 'Fat Loss'}
- Dietary Preference: ${dietType || 'Balanced High Protein'}

Return structured JSON with meals for breakfast, lunch, dinner, and snack.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are a sports nutritionist. Return only valid JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            totalCalories: { type: Type.NUMBER },
            totalProtein: { type: Type.NUMBER },
            meals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, description: 'breakfast, lunch, dinner, or snack' },
                  title: { type: Type.STRING },
                  calories: { type: Type.NUMBER },
                  proteinGrams: { type: Type.NUMBER },
                  carbsGrams: { type: Type.NUMBER },
                  fatGrams: { type: Type.NUMBER },
                  prepTimeMinutes: { type: Type.NUMBER },
                  ingredients: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  instructions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['type', 'title', 'calories', 'proteinGrams', 'carbsGrams', 'fatGrams', 'ingredients'],
              },
            },
          },
          required: ['summary', 'totalCalories', 'totalProtein', 'meals'],
        },
      },
    });

    const jsonText = response.text;
    const mealPlan = JSON.parse(jsonText || '{}');
    return res.json({ mealPlan });
  } catch (error: any) {
    console.error('Error in generate-meal-plan:', error);
    return res.status(500).json({
      error: 'Failed to generate meal plan',
      details: error?.message || 'Unknown error',
    });
  }
});

// Setup Vite / Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
