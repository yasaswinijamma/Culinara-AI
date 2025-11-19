import React from 'react';
import { RecipeDetails } from '../types';
import { X, Clock, Users, Flame, ChefHat, CheckCircle2 } from 'lucide-react';

interface RecipeModalProps {
  recipe: RecipeDetails | null;
  isLoading: boolean;
  onClose: () => void;
}

export const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, isLoading, onClose }) => {
  if (!recipe && !isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col animate-scaleIn">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-slate-100 transition-colors z-10"
        >
          <X className="w-6 h-6 text-slate-500" />
        </button>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 font-medium animate-pulse">Chefs are writing your recipe...</p>
          </div>
        ) : recipe && (
          <>
            {/* Header Image Placeholder (Color Block) */}
            <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white">
               <ChefHat className="w-12 h-12 opacity-20" />
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Title & Meta */}
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-4">{recipe.name}</h2>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg">
                    <Clock className="w-4 h-4" />
                    <span className="font-semibold">{recipe.prepTime} prep</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg">
                    <Flame className="w-4 h-4" />
                    <span className="font-semibold">{recipe.cookTime} cook</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg">
                    <Users className="w-4 h-4" />
                    <span className="font-semibold">{recipe.servings} servings</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Ingredients */}
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3 border-b pb-2">Ingredients</h3>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ing, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Nutrition */}
                <div className="bg-slate-50 p-4 rounded-xl h-fit">
                   <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Nutrition / Serving</h3>
                   <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Calories</span>
                        <span className="font-medium text-slate-800">{recipe.nutritionalInfo.calories}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Protein</span>
                        <span className="font-medium text-slate-800">{recipe.nutritionalInfo.protein}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Carbs</span>
                        <span className="font-medium text-slate-800">{recipe.nutritionalInfo.carbs}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Fats</span>
                        <span className="font-medium text-slate-800">{recipe.nutritionalInfo.fats}</span>
                      </div>
                   </div>
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Instructions</h3>
                <div className="space-y-4">
                  {recipe.instructions.map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm">
                        {i + 1}
                      </div>
                      <p className="text-slate-600 pt-1 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              {recipe.tips && recipe.tips.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                  <h4 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Chef's Tips
                  </h4>
                  <ul className="list-disc list-inside text-sm text-yellow-800/80 space-y-1">
                    {recipe.tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};