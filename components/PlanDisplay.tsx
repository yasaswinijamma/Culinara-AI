import React, { useState } from 'react';
import { WeeklyPlan, DailyPlan, MealBasicInfo } from '../types';
import { Clock, ChevronRight, Flame, Coffee, Sun, Moon, Apple } from 'lucide-react';

interface PlanDisplayProps {
  plan: WeeklyPlan;
  onViewRecipe: (meal: MealBasicInfo) => void;
}

const MealIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'Breakfast': return <Coffee className="w-4 h-4 text-orange-500" />;
    case 'Lunch': return <Sun className="w-4 h-4 text-yellow-600" />;
    case 'Dinner': return <Moon className="w-4 h-4 text-indigo-500" />;
    default: return <Apple className="w-4 h-4 text-green-500" />;
  }
};

export const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, onViewRecipe }) => {
  const [activeDay, setActiveDay] = useState(1);

  const currentDayPlan = plan.days.find(d => d.day === activeDay) || plan.days[0];

  return (
    <div className="w-full max-w-5xl mx-auto animate-fadeInUp">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">{plan.title}</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">{plan.summary}</p>
      </div>

      {/* Day Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide justify-center">
        {plan.days.map((d) => (
          <button
            key={d.day}
            onClick={() => setActiveDay(d.day)}
            className={`flex-shrink-0 px-6 py-2 rounded-full font-medium transition-all duration-200 whitespace-nowrap
              ${activeDay === d.day
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
          >
            Day {d.day}
          </button>
        ))}
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentDayPlan.meals.map((meal, index) => (
          <div
            key={`${activeDay}-${index}`}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-200 group"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-lg">
                <MealIcon type={meal.type} />
                <span className="text-xs font-bold uppercase tracking-wide text-slate-600">{meal.type}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400 text-xs">
                 <Flame className="w-3 h-3" />
                 <span>{meal.caloriesEstimate} kcal</span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-emerald-700 transition-colors">
              {meal.name}
            </h3>
            <p className="text-slate-600 text-sm mb-6 line-clamp-2">
              {meal.description}
            </p>

            <button
              onClick={() => onViewRecipe(meal)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-emerald-200 text-emerald-700 font-medium hover:bg-emerald-50 transition-colors"
            >
              View Recipe
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};