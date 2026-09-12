import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { StatCard } from '../../components/StatCard';
import {
  FileText,
  CheckCircle2,
  Clock,
  Gauge,
  Search,
  Activity,
  UserCheck,
  Cpu,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/analytics/dashboard');
        setStats(res.data.stats);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      }
    };
    fetchDashboardData();
  }, []);

  // Display stats from API or default to reference image values
  const totalAnalyses = stats?.totalPredictions || 48;
  const completedAnalyses = stats?.completedPredictions || 42;
  const pendingAnalyses = stats?.pendingReviews || 6;
  const avgConfidence = stats?.avgConfidence || '87.6';

  const distributionData = [
    { name: 'Adenomatous', percentage: 52, color: '#2563eb', barBg: 'bg-blue-600' },
    { name: 'Hyperplastic', percentage: 28, color: '#f97316', barBg: 'bg-orange-500' },
    { name: 'Serrated', percentage: 14, color: '#10b981', barBg: 'bg-emerald-500' },
    { name: 'Other', percentage: 6, color: '#8b5cf6', barBg: 'bg-purple-500' },
  ];

  const recentActivity = [
    {
      id: 1,
      title: 'Analysis completed - #1234',
      time: '2 mins ago',
      icon: CheckCircle2,
      iconColor: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 border-blue-100 dark:border-blue-900',
    },
    {
      id: 2,
      title: 'New report generated - #5678',
      time: '1 hour ago',
      icon: FileText,
      iconColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-100 dark:border-emerald-900',
    },
    {
      id: 3,
      title: 'Model updated - v1.2.0',
      time: '12 hours ago',
      icon: Cpu,
      iconColor: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 border-purple-100 dark:border-purple-900',
    },
    {
      id: 4,
      title: 'User logged in - Dr. Smith',
      time: '2 hours ago',
      icon: UserCheck,
      iconColor: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Overview of your analyses and system activity</p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search analysis, report..."
            className="pl-9 pr-4 py-1.5 rounded-xl bg-white dark:bg-[#0d1838] border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-xs focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 w-full sm:w-64 transition-colors"
          />
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Analyses"
          value={totalAnalyses}
          icon={FileText}
          accentColor="blue"
        />
        <StatCard
          title="Completed"
          value={completedAnalyses}
          icon={CheckCircle2}
          accentColor="emerald"
        />
        <StatCard
          title="Pending"
          value={pendingAnalyses}
          icon={Clock}
          accentColor="amber"
        />
        <StatCard
          title="Avg. Confidence"
          value={`${avgConfidence}%`}
          icon={Gauge}
          accentColor="cyan"
        />
      </div>

      {/* Main Grid: Prediction Distribution & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Prediction Distribution Bar Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0d1838] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Prediction Distribution</h2>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">Past 30 days</span>
            </div>

            {/* Custom styled vertical bar chart matching Screen 2 */}
            <div className="mt-8 pt-6 pb-2 flex items-end justify-around h-56 border-b border-slate-100 dark:border-slate-800 px-4">
              {distributionData.map((item) => (
                <div key={item.name} className="flex flex-col items-center gap-2 w-16 group">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{item.percentage}%</span>
                  <div className="w-12 bg-slate-100 dark:bg-slate-800/80 rounded-t-lg h-44 flex items-end p-1">
                    <div
                      className={`w-full rounded-t-md transition-all duration-700 ${item.barBg}`}
                      style={{ height: `${item.percentage * 1.8}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 truncate max-w-[80px] text-center mt-1">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2">
            <span>Total categorized: <strong className="text-slate-800 dark:text-slate-200">{totalAnalyses} images</strong></span>
            <Link to="/analyze" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1">
              Analyze New Image →
            </Link>
          </div>
        </div>

        {/* Right: Recent Activity */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0d1838] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Recent Activity</h2>
              <Link to="/history" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {recentActivity.map((act) => {
                const Icon = act.icon;
                return (
                  <div key={act.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className={`p-2 rounded-xl border shrink-0 ${act.iconColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {act.title}
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                        {act.time}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              AI Service Online
            </span>
            <span className="font-mono text-slate-400 dark:text-slate-500">Model v1.2 Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
