import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { Badge } from '../../components/Badge';
import { DateRangePicker, DateRange } from '../../components/DateRangePicker';
import {
  Search,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  FileText,
  RotateCcw,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { Prediction } from '../../types';
import { getImageUrl, getReportDownloadUrl } from '../../utils/apiConfig';

export const PredictionHistory: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [predictedClass, setPredictedClass] = useState('');
  const [reviewStatus, setReviewStatus] = useState('');
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: '',
    endDate: '',
    label: 'All Time',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchPredictions = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 10 };
      if (debouncedSearch) params.search = debouncedSearch;
      if (predictedClass) params.predictedClass = predictedClass;
      if (reviewStatus) params.reviewStatus = reviewStatus;
      if (dateRange.startDate) params.startDate = dateRange.startDate;
      if (dateRange.endDate) params.endDate = dateRange.endDate;

      const res = await api.get('/predictions', { params });
      setPredictions(res.data.predictions || []);
      setTotalPages(res.data.totalPages || 1);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error('Failed to fetch predictions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, [page, debouncedSearch, predictedClass, reviewStatus, dateRange]);

  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setPredictedClass('');
    setReviewStatus('');
    setDateRange({ startDate: '', endDate: '', label: 'All Time' });
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    search ||
    predictedClass ||
    reviewStatus ||
    dateRange.startDate ||
    dateRange.endDate
  );

  const getClassTextColor = (c: string) => {
    if (c?.includes('Adenomatous')) return 'text-blue-600 dark:text-blue-400 font-semibold';
    if (c?.includes('Hyperplastic')) return 'text-orange-600 dark:text-orange-400 font-semibold';
    if (c?.includes('Serrated')) return 'text-emerald-600 dark:text-emerald-400 font-semibold';
    return 'text-purple-600 dark:text-purple-400 font-semibold';
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Scan History</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Explore, search, and filter past scan results and clinical classifications</p>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="self-start sm:self-auto px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center gap-1.5 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-[#0d1838] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden p-6 space-y-5 transition-colors">
        {/* Filter Bar with Search, Class, Status & Date Range */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Field */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by analysis ID, finding, diagnosis..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Interactive Filters: Class, Review Status & Date Range */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Predicted Class Filter */}
            <select
              value={predictedClass}
              onChange={(e) => {
                setPredictedClass(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="">All Polyp Classes</option>
              <option value="Adenomatous Polyp">Adenomatous Polyp</option>
              <option value="Hyperplastic Polyp">Hyperplastic Polyp</option>
              <option value="Serrated Polyp">Serrated Polyp</option>
              <option value="Other / Non-polyp">Other / Non-polyp</option>
            </select>

            {/* Review Status Filter */}
            <select
              value={reviewStatus}
              onChange={(e) => {
                setReviewStatus(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="">All Review Statuses</option>
              <option value="PENDING">Pending Review</option>
              <option value="REVIEWED">Clinically Reviewed</option>
              <option value="REQUIRES_FURTHER_REVIEW">Requires Further Review</option>
            </select>

            {/* Interactive Date Range Picker */}
            <DateRangePicker
              value={dateRange}
              onChange={(newRange) => {
                setDateRange(newRange);
                setPage(1);
              }}
              placeholder="Date Range"
            />
          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" />
              Active:
            </span>

            {debouncedSearch && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-[11px] font-medium">
                Keyword: "{debouncedSearch}"
                <X className="w-3 h-3 cursor-pointer hover:opacity-75" onClick={() => setSearch('')} />
              </span>
            )}

            {predictedClass && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[11px] font-medium">
                Class: {predictedClass}
                <X className="w-3 h-3 cursor-pointer hover:opacity-75" onClick={() => setPredictedClass('')} />
              </span>
            )}

            {reviewStatus && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-[11px] font-medium">
                Status: {reviewStatus}
                <X className="w-3 h-3 cursor-pointer hover:opacity-75" onClick={() => setReviewStatus('')} />
              </span>
            )}

            {(dateRange.startDate || dateRange.endDate) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium">
                Date: {dateRange.label}
                <X
                  className="w-3 h-3 cursor-pointer hover:opacity-75"
                  onClick={() => setDateRange({ startDate: '', endDate: '', label: 'All Time' })}
                />
              </span>
            )}

            <span className="text-[11px] text-slate-400 dark:text-slate-500 ml-auto">
              Found {total} record{total === 1 ? '' : 's'}
            </span>
          </div>
        )}

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
                <th className="pb-3">Scan Date</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-slate-400">Loading prediction history...</td>
                </tr>
              ) : predictions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-slate-400">No prediction records matching your filter criteria.</td>
                </tr>
              ) : (
                predictions.map((pred, index) => {
                  const img = pred.imageId
                    ? getImageUrl(`/uploads/${pred.imageId.fileName}`)
                    : getImageUrl(`/sample_images/colon_00${(index % 3) + 1}.jpg`);

                  const scanDate = pred.createdAt
                    ? new Date(pred.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Apr 28, 2025';

                  return (
                    <tr key={pred._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 pl-2">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center">
                          <img
                            src={img}
                            alt="Thumbnail"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/sample_images/colon_001.jpg';
                            }}
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
                      <td className="py-3 font-mono text-slate-600 dark:text-slate-400 text-[11px] whitespace-nowrap">
                        {scanDate}
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
                              window.open(getReportDownloadUrl(pred.reportId || pred._id, token), '_blank');
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
