import React from 'react';
import { ClassProbability } from '../types';

interface ProbabilityBarProps {
  probabilities: ClassProbability[];
  predictedClass: string;
}

const CLASS_COLORS: Record<string, { bar: string; text: string }> = {
  'Adenomatous Polyp': { bar: 'bg-blue-600', text: 'text-blue-600 dark:text-blue-400' },
  'Adenomatous': { bar: 'bg-blue-600', text: 'text-blue-600 dark:text-blue-400' },
  'Hyperplastic Polyp': { bar: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400' },
  'Hyperplastic': { bar: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400' },
  'Serrated Polyp': { bar: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
  'Serrated': { bar: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
  'Other / Non-polyp': { bar: 'bg-purple-500', text: 'text-purple-600 dark:text-purple-400' },
  'Other': { bar: 'bg-purple-500', text: 'text-purple-600 dark:text-purple-400' },
};

export const ProbabilityBar: React.FC<ProbabilityBarProps> = ({ probabilities, predictedClass }) => {
  return (
    <div className="space-y-4">
      {probabilities.map((item) => {
        const isSelected = item.className === predictedClass;
        const percentage = (item.probability * 100).toFixed(1);
        const styling = CLASS_COLORS[item.className] || {
          bar: isSelected ? 'bg-blue-600' : 'bg-slate-400 dark:bg-slate-600',
          text: isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300',
        };

        return (
          <div key={item.className} className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-medium">
              <span className={`font-semibold ${isSelected ? styling.text : 'text-slate-700 dark:text-slate-300'}`}>
                {item.className.replace(' Polyp', '')}
              </span>
              <span className={`font-mono ${isSelected ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                {percentage}%
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${styling.bar}`}
                style={{ width: `${Math.max(2, item.probability * 100)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
