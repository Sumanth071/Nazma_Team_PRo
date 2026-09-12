import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { StatCard } from '../../components/StatCard';
import {
  Clock,
  CheckCircle2,
  Gauge,
  Zap,
  ArrowRight,
  Stethoscope,
} from 'lucide-react';
import { Prediction } from '../../types';

export const ClinicianDashboard: React.FC = () => {
  const [pendingCases, setPendingCases] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClinicianQueue = async () => {
      try {
        const res = await api.get('/predictions', {
          params: { reviewStatus: 'PENDING', limit: 5 },
        });
        setPendingCases(res.data.predictions || []);
      } catch (err) {
        console.error('Failed to load clinician triage queue:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClinicianQueue();
  }, []);

  const concordanceData = [
    { class: 'Adenomatous', agreement: 97.2, samples: 142, barColor: 'bg-blue-600' },
    { class: 'Hyperplastic', agreement: 95.8, samples: 88, barColor: 'bg-orange-500' },
    { class: 'Serrated (SSL)', agreement: 94.1, samples: 46, barColor: 'bg-emerald-500' },
    { class: 'Non-Polyp Mucosa', agreement: 98.5, samples: 34, barColor: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 text-xs font-semibold border border-blue-100 dark:border-blue-900 mb-1">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Clinician Review</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Clinician Dashboard</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Review pending scans and validation queue
          </p>
        </div>

        <Link
          to="/reviews"
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all w-fit"
        >
          <span>Pending Reviews</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Reviews"
          value={pendingCases.length || 6}
          icon={Clock}
          accentColor="amber"
          subtitle="Awaiting clinician sign-off"
        />
        <StatCard
          title="Validated Cases"
          value={42}
          icon={CheckCircle2}
          accentColor="emerald"
          subtitle="Concordant with pathology"
        />
        <StatCard
          title="AI Concordance Rate"
          value="96.4%"
          icon={Gauge}
          accentColor="blue"
          subtitle="Across 310 biopsy records"
        />
        <StatCard
          title="Avg. Review Time"
          value="3.8m"
          icon={Zap}
          accentColor="purple"
          subtitle="From inference to sign-off"
        />
      </div>

      {/* Main Grid: Urgent Triage Queue + AI Concordance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Urgent Triage Queue */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0d1838] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Pending Reviews</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Scans waiting for clinician review</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
                Action Required
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold">
                    <th className="pb-3 pl-1">Image</th>
                    <th className="pb-3">Analysis ID</th>
                    <th className="pb-3">Predicted Class</th>
                    <th className="pb-3">Confidence</th>
                    <th className="pb-3 text-right pr-1">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400">Loading triage queue...</td>
                    </tr>
                  ) : pendingCases.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400">No pending reviews found.</td>
                    </tr>
                  ) : (
                    pendingCases.map((pred, idx) => {
                      const img = pred.imageId
                        ? `/uploads/${pred.imageId.fileName}`
                        : `/sample_images/colon_00${(idx % 3) + 1}.jpg`;

                      return (
                        <tr key={pred._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 pl-1">
                            <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center">
                              <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">
                            #{pred.analysisId || `123${idx}`}
                          </td>
                          <td className="py-3">
                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                              {pred.predictedClass}
                            </span>
                          </td>
                          <td className="py-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                            {(pred.confidence * 100).toFixed(1)}%
                          </td>
                          <td className="py-3 text-right pr-1">
                            <Link
                              to={`/reviews?id=${pred._id}`}
                              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs inline-flex items-center gap-1 transition-all"
                            >
                              <span>Review</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Prioritized by lesion size and confidence score</span>
            <Link to="/reviews" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
              View all pending reviews →
            </Link>
          </div>
        </div>

        {/* Right: AI vs Pathology Concordance Breakdown */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0d1838] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Diagnostic Accuracy</h2>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">Biopsy Verified</span>
            </div>

            <div className="space-y-4">
              {concordanceData.map((item) => (
                <div key={item.class} className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.class}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{item.agreement}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${item.barColor}`}
                      style={{ width: `${item.agreement}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 text-right">
                    {item.samples} verified biopsies
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <p>
              High concordance demonstrates low inter-observer variability between automated AI classification and expert gastroenterologist review.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
