import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const TIMELINE_DATA = [
  { date: 'Apr 22', count: 110 },
  { date: 'Apr 23', count: 140 },
  { date: 'Apr 24', count: 135 },
  { date: 'Apr 25', count: 180 },
  { date: 'Apr 26', count: 195 },
  { date: 'Apr 27', count: 230 },
  { date: 'Apr 28', count: 258 },
];

const CLASS_DATA = [
  { name: 'Adenomatous', value: 52, color: '#2563eb' },
  { name: 'Hyperplastic', value: 28, color: '#f97316' },
  { name: 'Serrated', value: 14, color: '#10b981' },
  { name: 'Other', value: 6, color: '#8b5cf6' },
];

export const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Predictions' | 'Model Performance' | 'User Analytics'>('Overview');

  return (
    <div className="space-y-6">
      {/* Top Header matching Screen 14 */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Analytics</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">System usage trends and classification metrics</p>
      </div>

      {/* Sub-Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
        {(['Overview', 'Predictions', 'Model Performance', 'User Analytics'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-4 transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Grid: Predictions Over Time + Class Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Predictions Over Time Line Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0d1838] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Predictions Over Time
            </h2>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">Apr 22 - Apr 28</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={TIMELINE_DATA} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0e1a42',
                    borderColor: '#1e293b',
                    color: '#ffffff',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#2563eb' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Class Distribution Donut Chart with Center Total */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0d1838] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 flex flex-col justify-between transition-colors">
          <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Class Distribution
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
            <div className="w-48 h-48 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CLASS_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={78}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {CLASS_DATA.map((entry, index) => (
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
              {/* Center Counter: 1,248 Total matching Screen 14 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-xl font-black text-slate-900 dark:text-white leading-none">1,248</span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium leading-none mt-1">Total</span>
              </div>
            </div>

            {/* Legend on right matching Screen 14 */}
            <div className="space-y-2.5 text-xs">
              {CLASS_DATA.map((d) => (
                <div key={d.name} className="flex items-center justify-between gap-4">
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

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 text-center">
            Global incidence ratios across clinical repositories.
          </div>
        </div>
      </div>
    </div>
  );
};
