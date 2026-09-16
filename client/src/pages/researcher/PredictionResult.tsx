import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import { ProbabilityBar } from '../../components/ProbabilityBar';
import {
  FileText,
  Download,
  RotateCcw,
  AlertTriangle,
  ArrowLeft,
  Eye,
} from 'lucide-react';
import { Prediction } from '../../types';
import { getImageUrl, getReportDownloadUrl } from '../../utils/apiConfig';

export const PredictionResult: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const res = await api.get(`/predictions/${id}`);
        setPrediction(res.data.prediction);
      } catch (err) {
        console.error('Failed to fetch prediction:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrediction();
  }, [id]);

  const handleGenerateReport = async () => {
    if (!prediction) return;
    setReportLoading(true);
    try {
      const res = await api.post('/reports', { predictionId: prediction._id });
      const token = localStorage.getItem('coloai_token') || '';
      window.open(getReportDownloadUrl(res.data.report._id, token), '_blank');
      setPrediction({ ...prediction, reportId: res.data.report._id });
    } catch (err) {
      console.error('Report generation failed:', err);
      alert('Failed to generate report.');
    } finally {
      setReportLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500 dark:text-slate-400 space-y-3">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-medium">Retrieving prediction result...</p>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="p-8 rounded-2xl bg-white dark:bg-[#0d1838] border border-slate-200 dark:border-slate-800 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Prediction Record Not Found</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">The requested analysis ID does not exist in the database.</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </Link>
      </div>
    );
  }

  const imageUrl = prediction.imageId
    ? getImageUrl(`/uploads/${prediction.imageId.fileName}`)
    : getImageUrl('/sample_images/colon_001.jpg');

  const analysisDate = new Date(prediction.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to="/history" className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Prediction Result</h1>
        </div>
        <div className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900 self-start sm:self-auto">
          Analysis ID: {prediction.analysisId}
        </div>
      </div>

      {/* Main 2-Column Split matching Screen 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image + Image Details + Model Information */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0d1838] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6 transition-colors">
          <div className="w-full h-64 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center">
            <img
              src={imageUrl}
              alt="Analyzed Colonoscopy"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = '/sample_images/colon_001.jpg';
              }}
            />
          </div>

          {/* Image Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Image Details
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-600 dark:text-slate-400">
              <div className="py-2 flex justify-between">
                <span className="text-slate-400 dark:text-slate-500">File name:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {prediction.imageId?.originalName || 'colon_001.jpg'}
                </span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400 dark:text-slate-500">Size:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">2.4 MB</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400 dark:text-slate-500">Resolution:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">1024 x 768</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400 dark:text-slate-500">Format:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">JPG</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400 dark:text-slate-500">Uploaded:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{analysisDate}</span>
              </div>
            </div>
          </div>

          {/* Model Information */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Model Information
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-600 dark:text-slate-400">
              <div className="py-2 flex justify-between">
                <span className="text-slate-400 dark:text-slate-500">Model:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">AI Diagnostic Pipeline</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400 dark:text-slate-500">Version:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">v1.2.0</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400 dark:text-slate-500">Feature Extractor:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">Deep Neural Network</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400 dark:text-slate-500">Classifier:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">Ensemble Classifier</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400 dark:text-slate-500">Analyzed:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{analysisDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Predicted Class, Confidence, Class Probabilities */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0d1838] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between space-y-6 transition-colors">
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Predicted Class
              </span>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {prediction.predictedClass}
              </h2>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">Confidence</span>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-black text-slate-900 dark:text-white">
                  {(prediction.confidence * 100).toFixed(1)}%
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                  High Confidence
                </span>
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

          {/* Bottom Action Bar */}
          <div className="pt-5 sm:pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-center gap-2.5 sm:gap-3">
            <Link
              to={`/explanation/${prediction._id}`}
              className="w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-colors min-h-[44px]"
            >
              <Eye className="w-4 h-4" />
              <span>View Visual Explanation</span>
            </Link>

            <button
              type="button"
              onClick={handleGenerateReport}
              disabled={reportLoading}
              className="w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer min-h-[44px]"
            >
              <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{reportLoading ? 'Generating Report...' : 'Download Clinical Report'}</span>
            </button>

            <Link
              to="/analyze"
              className="w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors sm:ml-auto min-h-[44px]"
            >
              <RotateCcw className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Analyze Another</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
