import React, { useState } from 'react';
import { UserPreferences } from '../types';
import { CUISINES, DIETARY_PREFERENCES } from '../constants';
import { Plus, X, ChefHat, Sparkles, Utensils } from 'lucide-react';

interface InputSectionProps {
  onGenerate: (prefs: UserPreferences) => void;
  isGenerating: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onGenerate, isGenerating }) => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  
  const [prefs, setPrefs] = useState<UserPreferences>({
    ingredients: [],
    cuisine: 'Any',
    diet: 'No Restrictions',
    days: 3,
    allergies: ''
  });

  const handleAddIngredient = () => {
    if (currentIngredient.trim()) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient('');
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const handleSubmit = () => {
    onGenerate({ ...prefs, ingredients });
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <ChefHat className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Design Your Menu</h2>
        </div>
        <p className="text-emerald-50 opacity-90">
          Tell us what you have and what you like. AI will do the rest.
        </p>
      </div>

      <div className="p-6 space-y-8">
        {/* Ingredients Input */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            What's in your fridge/pantry?
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={currentIngredient}
              onChange={(e) => setCurrentIngredient(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., Eggs, Spinach, Chicken Breast..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
            />
            <button
              onClick={handleAddIngredient}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 rounded-xl transition-colors"
              aria-label="Add ingredient"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
          
          {ingredients.length > 0 ? (
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              {ingredients.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-100 animate-fadeIn"
                >
                  {item}
                  <button
                    onClick={() => handleRemoveIngredient(idx)}
                    className="hover:bg-emerald-200 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">No ingredients added yet. We'll assume a standard pantry.</p>
          )}
        </div>

        {/* Selectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cuisine */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Cuisine Preference
            </label>
            <div className="relative">
              <select
                value={prefs.cuisine}
                onChange={(e) => setPrefs({ ...prefs, cuisine: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none appearance-none bg-white"
              >
                {CUISINES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <Utensils className="absolute right-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Diet */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Dietary Preference
            </label>
            <div className="relative">
              <select
                value={prefs.diet}
                onChange={(e) => setPrefs({ ...prefs, diet: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none appearance-none bg-white"
              >
                {DIETARY_PREFERENCES.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <Sparkles className="absolute right-4 top-3.5 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
          
          {/* Days */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Plan Duration: <span className="text-emerald-600">{prefs.days} Days</span>
            </label>
            <input
              type="range"
              min="1"
              max="7"
              value={prefs.days}
              onChange={(e) => setPrefs({ ...prefs, days: parseInt(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>1 Day</span>
              <span>7 Days</span>
            </div>
          </div>

           {/* Allergies */}
           <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Allergies / Exclusions
            </label>
            <input
              type="text"
              value={prefs.allergies}
              onChange={(e) => setPrefs({ ...prefs, allergies: e.target.value })}
              placeholder="e.g., Peanuts, Shellfish"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
            />
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleSubmit}
          disabled={isGenerating}
          className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2
            ${isGenerating 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-500/30'
            }`}
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating Plan...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Meal Plan
            </>
          )}
        </button>
      </div>
    </div>
  );
};