import React, { useState } from 'react';

interface HeatmapViewerProps {
  originalSrc: string;
  heatmapSrc?: string;
  altText?: string;
}

export const HeatmapViewer: React.FC<HeatmapViewerProps> = ({
  originalSrc,
  heatmapSrc,
  altText = 'Colonoscopy Polyp Analysis',
}) => {
  const [activeMode, setActiveMode] = useState<'sideBySide' | 'heatmapOnly' | 'originalOnly'>('sideBySide');

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Visual Explainability (Deep Feature Attention)
        </span>
        {heatmapSrc && (
          <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveMode('sideBySide')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                activeMode === 'sideBySide'
                  ? 'bg-white dark:bg-emerald-500/20 text-blue-600 dark:text-emerald-400 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Side-by-Side
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('heatmapOnly')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                activeMode === 'heatmapOnly'
                  ? 'bg-white dark:bg-emerald-500/20 text-blue-600 dark:text-emerald-400 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Heatmap
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('originalOnly')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                activeMode === 'originalOnly'
                  ? 'bg-white dark:bg-emerald-500/20 text-blue-600 dark:text-emerald-400 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Original
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(activeMode === 'sideBySide' || activeMode === 'originalOnly') && (
          <div className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 aspect-square flex items-center justify-center">
            <img
              src={originalSrc}
              alt={`${altText} - Original`}
              className="w-full h-full object-contain"
            />
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-[11px] font-semibold text-slate-200">
              Original Colonoscopy Image
            </div>
          </div>
        )}

        {(activeMode === 'sideBySide' || activeMode === 'heatmapOnly') && heatmapSrc && (
          <div className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 aspect-square flex items-center justify-center">
            <img
              src={heatmapSrc}
              alt={`${altText} - Visual Attention Heatmap`}
              className="w-full h-full object-contain"
            />
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Visual Attention Map Overlay
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 italic">
        The localized attention map highlights high-activation mucosal feature zones identified during automated image analysis.
      </p>
    </div>
  );
};
