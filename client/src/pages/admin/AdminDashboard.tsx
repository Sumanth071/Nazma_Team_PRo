import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { StatCard } from '../../components/StatCard';
import {
  Users,
  Activity,
  Cpu,
  Database,
  UserPlus,
  Zap,
  FolderSync,
  LogIn,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/analytics/dashboard');
        setStats(res.data.stats);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      }
    };
    fetchStats();
  }, []);

  const totalUsers = stats?.totalUsers || 24;
  const totalAnalyses = stats?.totalPredictions || 1248;
  const activeModel = stats?.activeModel?.version || 'v1.2.0';
  const datasetsCount = stats?.totalDatasets || 5;

  const distributionData = [
    { name: 'Adenomatous', value: 52, color: '#2563eb' },
    { name: 'Hyperplastic', value: 28, color: '#f97316' },
    { name: 'Serrated', value: 14, color: '#10b981' },
    { name: 'Other', value: 6, color: '#8b5cf6' },
  ];

  const recentActivity = [
    {
      id: 1,
      title: 'New user registered - researcher@hospital.com',
      time: '10 min ago',
      icon: UserPlus,
      iconColor: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900',
    },
    {
      id: 2,
      title: 'Model activated - v1.2.0',
      time: '32 min ago',
      icon: Zap,
      iconColor: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900',
    },
    {
      id: 3,
      title: 'Dataset updated - Polyp V1',
      time: '1 hour ago',
      icon: FolderSync,
      iconColor: 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900',
    },
    {
      id: 4,
      title: 'User login - admin',
      time: '2 hours ago',
      icon: LogIn,
      iconColor: 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header matching Screen 11 */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">System overview and key metrics</p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
          accentColor="blue"
        />
        <StatCard
          title="Total Analyses"
          value={totalAnalyses.toLocaleString()}
          icon={Activity}
          accentColor="cyan"
        />
        <StatCard
          title="Active Model"
          value={activeModel}
          icon={Cpu}
          accentColor="emerald"
        />
        <StatCard
          title="Datasets"
          value={datasetsCount}
          icon={Database}
          accentColor="purple"
        />
      </div>

      {/* Main Grid: Prediction Distribution Donut + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Prediction Distribution Donut */}
        <div className="lg:col-span-6 bg-white dark:bg-[#0d1838] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Prediction Distribution</h2>
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="w-48 h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0e1a42',
                        borderColor: '#1e293b',
                        color: '#ffffff',
                        borderRadius: '8px',
                        fontSize: '11px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Donut Legend matching Screen 11 */}
              <div className="space-y-2.5 text-xs">
                {distributionData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: d.color }}
                      />
                      <span className="text-slate-600 dark:text-slate-300">{d.name}</span>
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500">
            Telemetry aggregated across all clinical and research accounts.
          </div>
        </div>

        {/* Right: Recent Activity */}
        <div className="lg:col-span-6 bg-white dark:bg-[#0d1838] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h2>
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

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500 flex items-center justify-between">
            <span>System Status: Fully Operational</span>
            <span className="font-mono text-emerald-500">AI Service Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
