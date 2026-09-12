import React from 'react';
import { FeatureContribution } from '../types';
import { Info } from 'lucide-react';

interface ShapFeatureChartProps {
  contributions: FeatureContribution[];
}

export const ShapFeatureChart: React.FC<ShapFeatureChartProps> = ({ contributions }) => {
  if (!contributions || contributions.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 text-sm">
        No specific feature contributions available for this analysis.
      </div>
    );
  }

  // Find max absolute value to normalize bar widths
  const maxVal = Math.max(...contributions.map((c) => Math.abs(c.contribution)), 0.1);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2">
        <span>Extracted Morphological / Vascular Feature</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Negative Impact
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Positive Impact
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {contributions.map((item) => {
          const isPositive = item.contribution >= 0;
          const barWidthPercent = (Math.abs(item.contribution) / maxVal) * 100;

          return (
            <div
              key={item.featureId}
              className="group p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-emerald-400 transition-colors">
                    {item.name}
                  </h4>
                  {item.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.description}</p>
                  )}
                </div>
                <span
                  className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                    isPositive
                      ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60'
                      : 'bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60'
                  }`}
                >
                  {isPositive ? `+${item.contribution.toFixed(3)}` : item.contribution.toFixed(3)}
                </span>
              </div>

              {/* Centered zero-axis waterfall visualization */}
              <div className="relative h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex items-center">
                {/* Center marker */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-400 dark:bg-slate-600 z-10" />

                {isPositive ? (
                  <div
                    className="absolute left-1/2 h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-r-full shadow-[0_0_8px_rgba(16,185,129,0.3)] transition-all duration-700"
                    style={{ width: `${barWidthPercent / 2}%` }}
                  />
                ) : (
                  <div
                    className="absolute right-1/2 h-full bg-gradient-to-l from-rose-600 to-rose-400 rounded-l-full shadow-[0_0_8px_rgba(244,63,94,0.3)] transition-all duration-700"
                    style={{ width: `${barWidthPercent / 2}%` }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
        <Info className="w-4 h-4 text-blue-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <p>
          Feature attribution values quantify the contribution of each visual feature toward the diagnostic classification relative to baseline expected values.
        </p>
      </div>
    </div>
  );
};
