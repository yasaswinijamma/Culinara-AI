import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserPreferences, WeeklyPlan, RecipeDetails } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = "gemini-2.5-flash";

export const generateMealPlan = async (prefs: UserPreferences): Promise<WeeklyPlan> => {
  const prompt = `
    Create a ${prefs.days}-day meal plan.
    Cuisine focus: ${prefs.cuisine}.
    Dietary Preference: ${prefs.diet}.
    Allergies/Restrictions: ${prefs.allergies || "None"}.
    Ingredients available in fridge (try to use these): ${prefs.ingredients.join(", ") || "Standard pantry items"}.

    The plan must include Breakfast, Lunch, Snack, and Dinner for each day.
    Be creative but accessible.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "A catchy name for this weekly plan" },
      summary: { type: Type.STRING, description: "A brief 1-sentence summary of the plan's vibe" },
      days: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.INTEGER },
            meals: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: ["Breakfast", "Lunch", "Snack", "Dinner"] },
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  caloriesEstimate: { type: Type.INTEGER },
                },
                required: ["type", "name", "description", "caloriesEstimate"]
              }
            }
          },
          required: ["day", "meals"]
        }
      }
    },
    required: ["title", "summary", "days"]
  };

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are a world-class nutritionist and chef who creates accessible, healthy, and delicious meal plans.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as WeeklyPlan;
  } catch (error) {
    console.error("Error generating meal plan:", error);
    throw error;
  }
};

export const generateRecipe = async (mealName: string, contextDescription: string, prefs: UserPreferences): Promise<RecipeDetails> => {
  const prompt = `
    Provide a detailed recipe for: "${mealName}".
    Context from plan: ${contextDescription}.
    Dietary Context: ${prefs.diet}.
    Make it easy to follow.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      prepTime: { type: Type.STRING },
      cookTime: { type: Type.STRING },
      servings: { type: Type.INTEGER },
      ingredients: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING } 
      },
      instructions: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING } 
      },
      nutritionalInfo: {
        type: Type.OBJECT,
        properties: {
          calories: { type: Type.INTEGER },
          protein: { type: Type.STRING },
          carbs: { type: Type.STRING },
          fats: { type: Type.STRING },
        },
        required: ["calories", "protein", "carbs", "fats"]
      },
      tips: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["name", "prepTime", "cookTime", "ingredients", "instructions", "nutritionalInfo"]
  };

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        systemInstruction: "You are a helpful chef. Provide clear, step-by-step cooking instructions.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as RecipeDetails;
  } catch (error) {
    console.error("Error generating recipe:", error);
    throw error;
  }
};
