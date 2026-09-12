import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import { ArrowLeft } from 'lucide-react';
import { Prediction } from '../../types';

export const Explainability: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const res = await api.get(`/predictions/${id}`);
        setPrediction(res.data.prediction);
      } catch (err) {
        console.error('Failed to load explanation:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrediction();
  }, [id]);

  interface FeatureItem {
    name: string;
    value: number;
    formatted: string;
  }

  const defaultFeatures: FeatureItem[] = [
    { name: 'Feature 127', value: 0.38, formatted: '+0.38' },
    { name: 'Feature 842', value: 0.24, formatted: '+0.24' },
    { name: 'Feature 421', value: 0.18, formatted: '+0.18' },
    { name: 'Feature 093', value: -0.05, formatted: '-0.05' },
    { name: 'Feature 276', value: -0.08, formatted: '-0.08' },
  ];

  const features: FeatureItem[] = prediction?.explanationId?.featureContributions?.length
    ? prediction.explanationId.featureContributions.slice(0, 5).map((f) => ({
        name: f.name || `Feature ${f.featureId}`,
        value: f.contribution,
        formatted: f.contribution >= 0 ? `+${f.contribution.toFixed(2)}` : f.contribution.toFixed(2),
      }))
    : defaultFeatures;

  const imageUrl = prediction?.imageId
    ? `/uploads/${prediction.imageId.fileName}`
    : '/sample_images/colon_001.jpg';

  const heatmapUrl = prediction?.explanationId?.heatmapBase64 || imageUrl;

  return (
    <div className="space-y-6">
      {/* Top Header matching Screen 6 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            to={id ? `/prediction/${id}` : '/dashboard'}
            className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Model Explanation
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Visual attention and feature importance</p>
          </div>
        </div>

        <div className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900 self-start sm:self-auto">
          Visual Attention Active
        </div>
      </div>

      {/* Top Row: Original Image and SHAP Visualization side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original Image Card */}
        <div className="bg-white dark:bg-[#0d1838] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3 transition-colors">
          <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Original Image
          </h2>
          <div className="w-full h-72 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center">
            <img
              src={imageUrl}
              alt="Original Colonoscopy"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* SHAP Visualization Card with Colorbar */}
        <div className="bg-white dark:bg-[#0d1838] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Attention Map
            </h2>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">Jet Attention Overlay</span>
          </div>

          <div className="relative w-full h-72 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center">
            <img
              src={heatmapUrl}
              alt="Attention Heatmap"
              className="w-full h-full object-cover filter contrast-125"
            />
            {/* Colorbar on right matching Screen 6 */}
            <div className="absolute right-3 top-4 bottom-4 w-7 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs p-1.5 flex flex-col items-center justify-between text-[9px] font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="text-rose-600 dark:text-rose-400">High</span>
              <div className="w-2.5 flex-1 my-1 rounded-sm bg-gradient-to-b from-rose-500 via-amber-400 via-emerald-400 to-blue-600" />
              <span className="text-blue-600 dark:text-blue-400">Low</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Feature Contribution Bar Chart and Top Feature Contributions Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Feature Contribution Bar Chart */}
        <div className="bg-white dark:bg-[#0d1838] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 transition-colors">
          <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Feature Contribution
          </h2>

          <div className="space-y-4 pt-2">
            {features.map((item) => {
              const isPositive = item.value >= 0;
              const barWidth = Math.min(100, Math.abs(item.value) * 180);

              return (
                <div key={item.name} className="flex items-center gap-3 text-xs">
                  <span className="w-24 text-slate-600 dark:text-slate-300 font-medium shrink-0">{item.name}</span>
                  <div className="flex-1 flex items-center">
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-3.5 rounded-full overflow-hidden flex items-center px-0.5">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-700 ${
                          isPositive ? 'bg-blue-600' : 'bg-slate-400 dark:bg-slate-600'
                        }`}
                        style={{ width: `${Math.max(8, barWidth)}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-12 text-right font-mono font-bold text-slate-700 dark:text-slate-200 shrink-0">
                    {item.formatted}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Top Feature Contributions Table & Disclaimer Box */}
        <div className="bg-white dark:bg-[#0d1838] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between space-y-4 transition-colors">
          <div>
            <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3">
              Top Feature Contributions
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold">
                    <th className="pb-2">Feature</th>
                    <th className="pb-2 text-right">Contribution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {features.map((f) => (
                    <tr key={f.name}>
                      <td className="py-2.5 font-medium text-slate-700 dark:text-slate-200">{f.name}</td>
                      <td
                        className={`py-2.5 text-right font-mono font-bold ${
                          f.value >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {f.formatted}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Blue Note Callout Box matching Screen 6 */}
          <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 text-[11px] text-blue-900 dark:text-blue-300 leading-relaxed">
            <span className="font-semibold block mb-0.5">Clinical Note:</span>
            Model explanations indicate patterns used during classification and should not be interpreted as definitive clinical evidence.
          </div>
        </div>
      </div>
    </div>
  );
};
