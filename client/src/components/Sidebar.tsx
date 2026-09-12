import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  UploadCloud,
  History,
  FileText,
  CheckSquare,
  Users,
  ShieldCheck,
  Cpu,
  BarChart3,
  Database,
  ClipboardList,
  UserCheck,
  Settings as SettingsIcon,
  CircleDot,
  FolderKanban,
  Stethoscope,
  Activity,
  X,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onClose }) => {
  const { user } = useAuth();
  const role = user?.role;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
      isActive
        ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
    }`;

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Drawer Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 md:w-60 bg-[#070f26] dark:bg-[#050b1d] border-r border-slate-800/80 flex flex-col justify-between p-4 shrink-0 text-white select-none transition-transform duration-300 ease-in-out md:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6 overflow-y-auto">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-1 py-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-sm shadow-sm text-white">
                <CircleDot className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-base tracking-tight leading-none text-white">
                  Polyp<span className="text-blue-400">AI</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium leading-none mt-1">
                  Colonoscopy Decision Support
                </div>
              </div>
            </div>

            {/* Close button on mobile */}
            <button
              type="button"
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Section */}
          <nav className="space-y-1.5">
            {role === 'Admin' ? (
              <>
                <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Administration
                </div>
                <NavLink to="/admin" end className={linkClass} onClick={handleLinkClick}>
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </NavLink>
                <NavLink to="/cases" className={linkClass} onClick={handleLinkClick}>
                  <FolderKanban className="w-4 h-4 text-blue-400" />
                  <span>Patient Cases</span>
                </NavLink>
                <NavLink to="/admin/users" className={linkClass} onClick={handleLinkClick}>
                  <Users className="w-4 h-4" />
                  <span>Users</span>
                </NavLink>
                <NavLink to="/admin/roles" className={linkClass} onClick={handleLinkClick}>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Roles & Permissions</span>
                </NavLink>
                <NavLink to="/admin/models" className={linkClass} onClick={handleLinkClick}>
                  <Cpu className="w-4 h-4" />
                  <span>Models</span>
                </NavLink>
                <NavLink to="/admin/performance" className={linkClass} onClick={handleLinkClick}>
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Performance</span>
                </NavLink>
                <NavLink to="/admin/datasets" className={linkClass} onClick={handleLinkClick}>
                  <Database className="w-4 h-4" />
                  <span>Datasets</span>
                </NavLink>
                <NavLink to="/admin/analytics" className={linkClass} onClick={handleLinkClick}>
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics</span>
                </NavLink>
                <NavLink to="/admin/audit-logs" className={linkClass} onClick={handleLinkClick}>
                  <ClipboardList className="w-4 h-4" />
                  <span>Audit Logs</span>
                </NavLink>
                <NavLink to="/settings" className={linkClass} onClick={handleLinkClick}>
                  <SettingsIcon className="w-4 h-4" />
                  <span>Settings</span>
                </NavLink>
              </>
            ) : role === 'Clinician' ? (
              <>
                <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Clinical Workflow
                </div>
                <NavLink to="/clinician/dashboard" className={linkClass} onClick={handleLinkClick}>
                  <Stethoscope className="w-4 h-4 text-amber-400" />
                  <span>Clinician Dashboard</span>
                </NavLink>
                <NavLink to="/cases" className={linkClass} onClick={handleLinkClick}>
                  <FolderKanban className="w-4 h-4 text-blue-400" />
                  <span>Patient Cases</span>
                </NavLink>
                <NavLink to="/reviews" className={linkClass} onClick={handleLinkClick}>
                  <CheckSquare className="w-4 h-4 text-amber-400" />
                  <span>Pending Reviews</span>
                </NavLink>
                <NavLink to="/analyze" className={linkClass} onClick={handleLinkClick}>
                  <UploadCloud className="w-4 h-4" />
                  <span>New Analysis</span>
                </NavLink>
                <NavLink to="/history" className={linkClass} onClick={handleLinkClick}>
                  <History className="w-4 h-4" />
                  <span>History</span>
                </NavLink>
                <NavLink to="/reports" className={linkClass} onClick={handleLinkClick}>
                  <FileText className="w-4 h-4" />
                  <span>Reports</span>
                </NavLink>
                <NavLink to="/profile" className={linkClass} onClick={handleLinkClick}>
                  <UserCheck className="w-4 h-4" />
                  <span>Profile</span>
                </NavLink>
              </>
            ) : (
              <>
                <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Research Workflow
                </div>
                <NavLink to="/dashboard" className={linkClass} onClick={handleLinkClick}>
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </NavLink>
                <NavLink to="/cases" className={linkClass} onClick={handleLinkClick}>
                  <FolderKanban className="w-4 h-4 text-blue-400" />
                  <span>Patient Cases</span>
                </NavLink>
                <NavLink to="/analyze" className={linkClass} onClick={handleLinkClick}>
                  <UploadCloud className="w-4 h-4" />
                  <span>New Analysis</span>
                </NavLink>
                <NavLink to="/history" className={linkClass} onClick={handleLinkClick}>
                  <History className="w-4 h-4" />
                  <span>History</span>
                </NavLink>
                <NavLink to="/reports" className={linkClass} onClick={handleLinkClick}>
                  <FileText className="w-4 h-4" />
                  <span>Reports</span>
                </NavLink>
                <NavLink to="/profile" className={linkClass} onClick={handleLinkClick}>
                  <UserCheck className="w-4 h-4" />
                  <span>Profile</span>
                </NavLink>
              </>
            )}
          </nav>
        </div>

        {/* User Card at bottom of sidebar */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-blue-300 shrink-0">
            {user?.name?.slice(0, 2).toUpperCase() || 'DR'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-white truncate leading-tight">
              {user?.name ? user.name.replace(/\s*\((Admin|Researcher|Clinician)\)/i, '') : 'Dr. Sarah Mitchell, MD'}
            </div>
            <div className="text-[10px] text-blue-400 font-medium truncate leading-tight mt-0.5">
              {user?.role === 'Admin'
                ? 'Lead System Admin'
                : user?.role === 'Researcher'
                ? 'AI Oncology Researcher'
                : 'Chief Endoscopist'}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
