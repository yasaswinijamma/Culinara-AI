import React, { useState } from 'react';
import { InputSection } from './components/InputSection';
import { PlanDisplay } from './components/PlanDisplay';
import { RecipeModal } from './components/RecipeModal';
import { UserPreferences, WeeklyPlan, MealBasicInfo, RecipeDetails, LoadingState } from './types';
import { generateMealPlan, generateRecipe } from './services/gemini';
import { ArrowLeft, ChefHat } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'input' | 'plan'>('input');
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  
  // Recipe Modal State
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [activeRecipe, setActiveRecipe] = useState<RecipeDetails | null>(null);
  const [recipeLoading, setRecipeLoading] = useState(false);

  const handleGeneratePlan = async (newPrefs: UserPreferences) => {
    setPrefs(newPrefs);
    setLoadingState('generating-plan');
    setError(null);

    try {
      const generatedPlan = await generateMealPlan(newPrefs);
      setPlan(generatedPlan);
      setView('plan');
      setLoadingState('success');
    } catch (e) {
      setError("Failed to generate plan. Please check your connection and try again.");
      setLoadingState('error');
    }
  };

  const handleViewRecipe = async (meal: MealBasicInfo) => {
    setShowRecipeModal(true);
    setActiveRecipe(null); // Clear previous
    setRecipeLoading(true);

    try {
      if (prefs) {
        const details = await generateRecipe(meal.name, meal.description, prefs);
        setActiveRecipe(details);
      }
    } catch (e) {
       // Fallback or error handling for modal
       console.error(e);
       setShowRecipeModal(false);
       alert("Could not fetch recipe details.");
    } finally {
      setRecipeLoading(false);
    }
  };

  const handleBack = () => {
    setView('input');
    setPlan(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-600">
            <ChefHat className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tight text-slate-800">Culinara<span className="text-emerald-600">AI</span></span>
          </div>
          
          {view === 'plan' && (
            <button 
              onClick={handleBack}
              className="text-sm font-medium text-slate-500 hover:text-emerald-600 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Start Over
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="max-w-3xl mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">Dismiss</button>
          </div>
        )}

        {view === 'input' ? (
          <div className="animate-fadeIn">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Your Personal <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">AI Chef</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Generate fully customized meal plans based on what you have in your fridge and what you love to eat.
              </p>
            </div>
            <InputSection 
              onGenerate={handleGeneratePlan} 
              isGenerating={loadingState === 'generating-plan'} 
            />
          </div>
        ) : (
          plan && (
            <PlanDisplay 
              plan={plan} 
              onViewRecipe={handleViewRecipe} 
            />
          )
        )}
      </main>

      {/* Recipe Modal */}
      {showRecipeModal && (
        <RecipeModal 
          recipe={activeRecipe} 
          isLoading={recipeLoading} 
          onClose={() => setShowRecipeModal(false)} 
        />
      )}

      {/* Footer */}
      <footer className="py-8 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Culinara AI. Powered by Gemini.</p>
      </footer>
    </div>
  );
};

export default App;