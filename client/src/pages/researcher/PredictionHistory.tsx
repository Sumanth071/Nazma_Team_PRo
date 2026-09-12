import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { Badge } from '../../components/Badge';
import {
  Search,
  Calendar,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  FileText,
} from 'lucide-react';
import { Prediction } from '../../types';

export const PredictionHistory: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [predictedClass, setPredictedClass] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchPredictions = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 5 };
      if (search) params.search = search;
      if (predictedClass) params.predictedClass = predictedClass;

      const res = await api.get('/predictions', { params });
      setPredictions(res.data.predictions);
      setTotalPages(res.data.totalPages || 1);
      setTotal(res.data.total || 48);
    } catch (err) {
      console.error('Failed to fetch predictions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, [page, predictedClass]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPredictions();
  };

  const getClassTextColor = (c: string) => {
    if (c?.includes('Adenomatous')) return 'text-blue-600 dark:text-blue-400 font-semibold';
    if (c?.includes('Hyperplastic')) return 'text-orange-600 dark:text-orange-400 font-semibold';
    if (c?.includes('Serrated')) return 'text-emerald-600 dark:text-emerald-400 font-semibold';
    return 'text-purple-600 dark:text-purple-400 font-semibold';
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">History</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Past scan results and classification records</p>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-[#0d1838] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden p-6 space-y-5 transition-colors">
        {/* Filter Bar matching Screen 7 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <form onSubmit={handleSearch} className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search history..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </form>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={predictedClass}
              onChange={(e) => {
                setPredictedClass(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Classes</option>
              <option value="Adenomatous Polyp">Adenomatous</option>
              <option value="Hyperplastic Polyp">Hyperplastic</option>
              <option value="Serrated Polyp">Serrated</option>
              <option value="Other / Non-polyp">Other</option>
            </select>

            <button
              type="button"
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Date Range</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold">
                <th className="pb-3 pl-2">Image</th>
                <th className="pb-3">Analysis ID</th>
                <th className="pb-3">Predicted Class</th>
                <th className="pb-3">Confidence</th>
                <th className="pb-3">Model Version</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-400">Loading prediction history...</td>
                </tr>
              ) : predictions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-400">No prediction records found.</td>
                </tr>
              ) : (
                predictions.map((pred, index) => {
                  const img = pred.imageId
                    ? `/uploads/${pred.imageId.fileName}`
                    : `/sample_images/colon_00${(index % 3) + 1}.jpg`;

                  return (
                    <tr key={pred._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 pl-2">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center">
                          <img
                            src={img}
                            alt="Thumbnail"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="py-3 font-medium text-slate-900 dark:text-white font-mono">
                        {pred.analysisId?.startsWith('#') ? pred.analysisId : `#${pred.analysisId || `CP-2026-${1042 + index * 46}`}`}
                      </td>
                      <td className="py-3">
                        <span className={getClassTextColor(pred.predictedClass)}>
                          {pred.predictedClass?.replace(' Polyp', '')}
                        </span>
                      </td>
                      <td className="py-3 font-mono font-medium text-slate-700 dark:text-slate-300">
                        {(pred.confidence * 100).toFixed(1)}%
                      </td>
                      <td className="py-3 font-mono text-slate-500 dark:text-slate-400">
                        {pred.modelVersionId?.version || 'v1.2.0'}
                      </td>
                      <td className="py-3">
                        <Badge status={pred.reviewStatus === 'PENDING' ? 'Pending' : 'Completed'} />
                      </td>
                      <td className="py-3 text-right pr-2">
                        <div className="flex items-center justify-end gap-2 text-slate-500 dark:text-slate-400">
                          <Link
                            to={`/analysis/${pred._id}`}
                            title="View Analysis Details"
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/prediction/${pred._id}`}
                            title="Prediction Result"
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            title="Download Report"
                            onClick={() => {
                              const token = localStorage.getItem('coloai_token') || '';
                              window.open(`/api/reports/${pred.reportId || pred._id}/download?token=${token}`, '_blank');
                            }}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination matching Screen 7 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <div>
            Showing 1-{predictions.length || 5} of {total || 48}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {[1, 2, 3, 4, 5].map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setPage(pageNum)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                  page === pageNum
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {pageNum}
              </button>
            ))}
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
