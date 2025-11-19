export enum MealType {
  Breakfast = 'Breakfast',
  Lunch = 'Lunch',
  Snack = 'Snack',
  Dinner = 'Dinner'
}

export interface MealBasicInfo {
  type: MealType;
  name: string;
  description: string;
  caloriesEstimate: number;
}

export interface DailyPlan {
  day: number;
  meals: MealBasicInfo[];
}

export interface WeeklyPlan {
  title: string;
  summary: string;
  days: DailyPlan[];
}

export interface RecipeDetails {
  name: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
  nutritionalInfo: {
    calories: number;
    protein: string;
    carbs: string;
    fats: string;
  };
  tips: string[];
}

export interface UserPreferences {
  ingredients: string[];
  cuisine: string;
  diet: string;
  days: number;
  allergies: string;
}

export type LoadingState = 'idle' | 'generating-plan' | 'generating-recipe' | 'error' | 'success';