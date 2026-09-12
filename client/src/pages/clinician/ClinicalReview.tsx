import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/client';
import { Badge } from '../../components/Badge';
import {
  Save,
  Check,
  FileCheck,
} from 'lucide-react';
import { Prediction } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const ClinicalReview: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const targetId = searchParams.get('id');

  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [reviewStatus, setReviewStatus] = useState<string>('Pending');
  const [reviewNotes, setReviewNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/predictions', { params: { limit: 12 } });
      const items = res.data.predictions || [];
      setPredictions(items);
      if (items.length > 0) {
        const match = targetId
          ? items.find((p: any) => p._id === targetId || p.analysisId === targetId) || items[0]
          : items[0];
        setSelectedPrediction(match);
        setReviewNotes(match.reviewNotes || 'Recommended for complete endoscopic resection.');
        setReviewStatus(match.reviewStatus === 'REVIEWED' ? 'Approved' : 'Pending');
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [targetId]);

  const handleSaveReview = async (markComplete: boolean = false) => {
    if (!selectedPrediction) return;
    setSaving(true);
    setSuccessMessage('');
    try {
      const finalStatus = markComplete ? 'REVIEWED' : 'REQUIRES_FURTHER_REVIEW';
      await api.patch(`/predictions/${selectedPrediction._id}/review`, {
        reviewStatus: finalStatus,
        reviewNotes,
      });
      setSuccessMessage(
        markComplete
          ? `Analysis #${selectedPrediction.analysisId} marked as Reviewed.`
          : `Notes updated for analysis #${selectedPrediction.analysisId}.`
      );
      if (markComplete) {
        setReviewStatus('Reviewed');
      }
    } catch (err) {
      console.error('Failed to save review:', err);
      alert('Failed to save clinical review.');
    } finally {
      setSaving(false);
    }
  };

  const imageUrl = selectedPrediction?.imageId
    ? `/uploads/${selectedPrediction.imageId.fileName}`
    : '/sample_images/colon_001.jpg';

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Clinical Reviews
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Validate AI predictions and record clinical findings</p>
      </div>

      {/* Scan Selector Pills */}
      {predictions.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="font-semibold text-slate-500 dark:text-slate-400 shrink-0">Select Scan:</span>
          {predictions.map((p) => (
            <button
              key={p._id}
              type="button"
              onClick={() => {
                setSelectedPrediction(p);
                setReviewNotes(p.reviewNotes || 'Recommended for complete endoscopic resection.');
                setReviewStatus(p.reviewStatus === 'REVIEWED' ? 'Approved' : 'Pending');
                setSuccessMessage('');
              }}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedPrediction?._id === p._id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400'
              }`}
            >
              #{p.analysisId} • {p.predictedClass}
            </button>
          ))}
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <FileCheck className="w-4 h-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Review Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Image & AI Prediction */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0d1838] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 transition-colors">
          <div className="w-full h-56 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center">
            <img src={imageUrl} alt="Polyp under review" className="w-full h-full object-cover" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              AI Prediction
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {selectedPrediction?.predictedClass || 'Adenomatous Polyp'}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">Confidence:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                {selectedPrediction
                  ? (selectedPrediction.confidence * 100).toFixed(1)
                  : '92.4'}
                %
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-400 dark:text-slate-500">Analysis ID:</span>
            <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 ml-2">
              #{selectedPrediction?.analysisId || '1234'}
            </span>
          </div>
        </div>

        {/* Right column: Review Form */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0d1838] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5 transition-colors">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Review Status
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={reviewStatus}
                onChange={(e) => setReviewStatus(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 w-60"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Flagged for Review">Flagged for Review</option>
                <option value="Disputed">Disputed</option>
              </select>
              <Badge status={reviewStatus} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Reviewer Notes
            </label>
            <textarea
              rows={4}
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Add your clinical review notes..."
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Attending Reviewer & Title</span>
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                {user?.name || 'Dr. Elena Rostova, MD'}
              </div>
              <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                {user?.role === 'Admin'
                  ? 'Lead System Administrator'
                  : user?.role === 'Researcher'
                  ? 'AI Oncology Researcher'
                  : 'Chief Clinical Endoscopist'}
              </div>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Review Timestamp</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {new Date().toLocaleString()}
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSaveReview(false)}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Note'}</span>
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => handleSaveReview(true)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Mark as Reviewed</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
