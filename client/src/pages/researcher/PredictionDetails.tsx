import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import { Badge } from '../../components/Badge';
import { ProbabilityBar } from '../../components/ProbabilityBar';
import {
  ArrowLeft,
  Eye,
  Download,
  AlertTriangle,
} from 'lucide-react';
import { Prediction } from '../../types';

export const PredictionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Explanation' | 'Review' | 'Notes'>('Explanation');

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const res = await api.get(`/predictions/${id}`);
        setPrediction(res.data.prediction);
      } catch (err) {
        console.error('Failed to fetch prediction details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrediction();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500 dark:text-slate-400 space-y-3">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-medium">Loading analysis details...</p>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="p-8 rounded-2xl bg-white dark:bg-[#0d1838] border border-slate-200 dark:border-slate-800 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Analysis Not Found</h3>
        <Link to="/history" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-white">
          <ArrowLeft className="w-4 h-4" /> Return to History
        </Link>
      </div>
    );
  }

  const imageUrl = prediction.imageId
    ? `/uploads/${prediction.imageId.fileName}`
    : '/sample_images/colon_001.jpg';

  const analysisDate = new Date(prediction.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link to="/history" className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Analysis Details</h1>
      </div>

      {/* Main 2-Column Split matching Screen 8 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image, Metadata, Sub-Tabs, Action Buttons */}
        <div className="lg:col-span-6 bg-white dark:bg-[#0d1838] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5 transition-colors">
          <div className="w-full h-56 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center">
            <img
              src={imageUrl}
              alt="Polyp Analysis"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/sample_images/colon_001.jpg';
              }}
            />
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-600 dark:text-slate-400">
            <div className="py-2 flex justify-between">
              <span className="text-slate-400 dark:text-slate-500">Analysis ID:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                #{prediction.analysisId || '1234'}
              </span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-400 dark:text-slate-500">Date:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{analysisDate}</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-400 dark:text-slate-500">User:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">Dr. Smith (Researcher)</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-400 dark:text-slate-500">Model Version:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">
                {prediction.modelVersionId?.version || 'v1.2.0'}
              </span>
            </div>
            <div className="py-2 flex justify-between items-center">
              <span className="text-slate-400 dark:text-slate-500">Status:</span>
              <Badge status="Completed" />
            </div>
            <div className="py-2 flex justify-between items-center">
              <span className="text-slate-400 dark:text-slate-500">Review Status:</span>
              <Badge status={prediction.reviewStatus || 'Pending'} />
            </div>
          </div>

          {/* Sub-Tabs: Explanation, Review, Notes */}
          <div className="pt-2">
            <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
              {(['Explanation', 'Review', 'Notes'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 px-3 transition-colors ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="py-3 text-xs text-slate-600 dark:text-slate-300">
              {activeTab === 'Explanation' && (
                <p>
                  Deep neural features extracted with attribution quantifying morphological contributions.
                </p>
              )}
              {activeTab === 'Review' && (
                <p>
                  Clinical reviewer: <strong className="text-slate-800 dark:text-slate-200">Dr. John Smith</strong>. Validated as concordant with adenoma neoplasm protocol.
                </p>
              )}
              {activeTab === 'Notes' && (
                <p className="italic text-slate-500 dark:text-slate-400">
                  {prediction.reviewNotes || 'Recommended for complete endoscopic resection.'}
                </p>
              )}
            </div>
          </div>

          {/* Bottom Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to={`/explanation/${prediction._id}`}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>View Explanation</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                const token = localStorage.getItem('coloai_token') || '';
                window.open(`/api/reports/${prediction.reportId || prediction._id}/download?token=${token}`, '_blank');
              }}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Download Report</span>
            </button>
          </div>
        </div>

        {/* Right Column: Prediction & Class Probabilities */}
        <div className="lg:col-span-6 bg-white dark:bg-[#0d1838] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6 transition-colors">
          <div>
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Prediction
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {prediction.predictedClass}
            </h2>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-400 dark:text-slate-500">Confidence</span>
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              {(prediction.confidence * 100).toFixed(1)}%
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Class Probabilities
            </h3>
            <ProbabilityBar
              probabilities={prediction.probabilities}
              predictedClass={prediction.predictedClass}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
