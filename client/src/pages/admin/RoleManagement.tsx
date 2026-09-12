import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import {
  ShieldCheck,
  Save,
  Plus,
  Trash2,
  X,
  CheckCircle2,
} from 'lucide-react';

const ALL_PERMISSIONS = [
  { id: 'prediction:create', label: 'Upload & Run AI Inference', category: 'Inference' },
  { id: 'prediction:read', label: 'View Own Predictions', category: 'Inference' },
  { id: 'prediction:review', label: 'Add Clinical Review Notes', category: 'Clinical' },
  { id: 'case:create', label: 'Create Patient Colonoscopy Cases', category: 'Clinical' },
  { id: 'case:read', label: 'Access Patient Case Studies', category: 'Clinical' },
  { id: 'case:update', label: 'Update Patient Diagnoses', category: 'Clinical' },
  { id: 'report:create', label: 'Generate PDF Analysis Reports', category: 'Reports' },
  { id: 'report:read', label: 'Download Generated Reports', category: 'Reports' },
  { id: 'model:read', label: 'Inspect Model Registry & Metrics', category: 'Models' },
  { id: 'model:update', label: 'Activate & Archive Models', category: 'Models' },
  { id: 'dataset:read', label: 'View Benchmark Datasets', category: 'Dataset' },
  { id: 'dataset:update', label: 'Manage Dataset Cohorts', category: 'Dataset' },
  { id: 'user:*', label: 'Full User Account Administration', category: 'Administration' },
  { id: 'audit:*', label: 'Access Security Audit Logs', category: 'Administration' },
  { id: 'system:*', label: 'Modify Global AI Parameters', category: 'Administration' },
];

export const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<any | null>(null);
  const [activePermissions, setActivePermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Create Role Modal
  const [createRoleModalOpen, setCreateRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await api.get('/roles');
      setRoles(res.data.roles || []);
      if (res.data.roles?.length > 0) {
        // preserve current selection if available
        const current = selectedRole
          ? res.data.roles.find((r: any) => r._id === selectedRole._id) || res.data.roles[0]
          : res.data.roles[0];
        setSelectedRole(current);
        setActivePermissions(current.permissions || []);
      }
    } catch (err) {
      console.error('Failed to load roles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleRoleSelect = (role: any) => {
    setSelectedRole(role);
    setActivePermissions(role.permissions || []);
    setSaveMessage('');
  };

  const togglePermission = (permId: string) => {
    if (activePermissions.includes(permId)) {
      setActivePermissions(activePermissions.filter((p) => p !== permId));
    } else {
      setActivePermissions([...activePermissions, permId]);
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    setSaving(true);
    setSaveMessage('');
    try {
      await api.put(`/roles/${selectedRole._id}/permissions`, {
        permissions: activePermissions,
      });
      setSaveMessage(`Permissions updated for role ${selectedRole.name}.`);
      fetchRoles();
      setTimeout(() => setSaveMessage(''), 4000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to save permissions');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/roles', {
        name: newRoleName,
        description: newRoleDescription,
        permissions: ['prediction:read', 'report:read', 'case:read'],
      });
      setCreateRoleModalOpen(false);
      setNewRoleName('');
      setNewRoleDescription('');
      setSaveMessage(`Custom role created.`);
      fetchRoles();
      setTimeout(() => setSaveMessage(''), 4000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create role');
    }
  };

  const handleDeleteRole = async (role: any) => {
    if (!window.confirm(`Are you sure you want to delete custom role ${role.name}?`)) {
      return;
    }
    try {
      await api.delete(`/roles/${role._id}`);
      setSaveMessage(`Role ${role.name} deleted.`);
      fetchRoles();
      setTimeout(() => setSaveMessage(''), 4000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete role');
    }
  };

  const categories = ['Inference', 'Clinical', 'Reports', 'Models', 'Dataset', 'Administration'];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Roles & Permissions
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage user roles and system permissions
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateRoleModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Role</span>
        </button>
      </div>

      {saveMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Main Grid: Roles List + Permissions Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Role Selector */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0d1838] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4 h-fit transition-colors">
          <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Available Roles
          </h2>

          <div className="space-y-2">
            {roles.map((role) => {
              const isSelected = selectedRole?._id === role._id;
              const isCore = ['Admin', 'Researcher', 'Clinician'].includes(role.name);

              return (
                <div
                  key={role._id}
                  onClick={() => handleRoleSelect(role)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between ${
                    isSelected
                      ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-500 dark:border-blue-500 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <ShieldCheck
                        className={`w-4 h-4 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}
                      />
                      <span className={`text-xs font-bold ${isSelected ? 'text-blue-900 dark:text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                        {role.name}
                      </span>
                      {isCore && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                          System
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {role.description || 'Configured platform access role.'}
                    </p>
                    <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 pt-1">
                      {role.permissions?.length || 0} permissions active
                    </div>
                  </div>

                  {!isCore && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRole(role);
                      }}
                      title="Delete Custom Role"
                      className="p-1 rounded text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Permissions Matrix */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0d1838] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-6 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Active Role Configuration
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {selectedRole?.name || 'Select a Role'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {selectedRole?.description}
              </p>
            </div>

            <button
              type="button"
              disabled={saving}
              onClick={handleSavePermissions}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all w-fit disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Role Permissions'}</span>
            </button>
          </div>

          {/* Grouped Permission Checkboxes */}
          <div className="space-y-5">
            {categories.map((category) => {
              const categoryPerms = ALL_PERMISSIONS.filter((p) => p.category === category);

              return (
                <div key={category} className="space-y-2.5">
                  <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {category} Capabilities
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {categoryPerms.map((p) => {
                      const isChecked = activePermissions.includes(p.id) || activePermissions.includes('*');

                      return (
                        <label
                          key={p.id}
                          className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/60 text-slate-800 dark:text-slate-200'
                              : 'bg-slate-50/40 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => togglePermission(p.id)}
                            className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-xs font-medium block truncate">
                              {p.label}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block truncate">
                              {p.id}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CREATE ROLE MODAL */}
      {createRoleModalOpen && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-[#0e1a42] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">New Role</h2>
              <button
                type="button"
                onClick={() => setCreateRoleModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRole} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Role Name</label>
                <input
                  type="text"
                  required
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="e.g. Endoscopy Nurse, Chief Pathologist"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                  placeholder="Role responsibilities and department scope..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateRoleModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                >
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
