import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { Badge } from '../../components/Badge';
import {
  FolderKanban,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  Eye,
  X,
  ArrowRight,
  UploadCloud,
} from 'lucide-react';

interface PatientCaseItem {
  _id: string;
  caseId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  procedureDate: string;
  endoscopist: string;
  indication: string;
  anatomicalLocation: string;
  polypFindings: string;
  riskLevel: 'Low' | 'Moderate' | 'High';
  status: 'Scheduled' | 'Completed' | 'Reviewed' | 'Follow-up Required';
  notes?: string;
  createdAt: string;
}

export const CaseManagement: React.FC = () => {
  const [cases, setCases] = useState<PatientCaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<PatientCaseItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: 55,
    patientGender: 'Male' as 'Male' | 'Female' | 'Other',
    endoscopist: 'Dr. Elena Rostova, MD (Chief Endoscopist)',
    indication: 'Screening' as 'Screening' | 'Surveillance' | 'High Risk' | 'Symptomatic',
    anatomicalLocation: 'Sigmoid Colon',
    polypFindings: 'Adenomatous Polyp',
    riskLevel: 'Moderate' as 'Low' | 'Moderate' | 'High',
    status: 'Completed' as 'Scheduled' | 'Completed' | 'Reviewed' | 'Follow-up Required',
    notes: '',
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const fetchCases = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search) params.search = search;
      if (riskFilter) params.riskLevel = riskFilter;
      if (statusFilter) params.status = statusFilter;

      const res = await api.get('/cases', { params });
      setCases(res.data.cases || []);
    } catch (err) {
      console.error('Failed to load cases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [search, riskFilter, statusFilter]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/cases', formData);
      setCreateModalOpen(false);
      setMessage('New patient study record created successfully.');
      setFormData({
        patientName: '',
        patientAge: 55,
        patientGender: 'Male',
        endoscopist: 'Dr. Elena Rostova, MD (Chief Endoscopist)',
        indication: 'Screening',
        anatomicalLocation: 'Sigmoid Colon',
        polypFindings: 'Adenomatous Polyp',
        riskLevel: 'Moderate',
        status: 'Completed',
        notes: '',
      });
      fetchCases();
      setTimeout(() => setMessage(''), 4000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create case');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;
    setSaving(true);
    try {
      await api.put(`/cases/${selectedCase._id}`, formData);
      setEditModalOpen(false);
      setMessage(`Case ${selectedCase.caseId} updated successfully.`);
      fetchCases();
      setTimeout(() => setMessage(''), 4000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update case');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, caseId: string) => {
    if (!window.confirm(`Are you sure you want to delete Case ${caseId}?`)) return;
    try {
      await api.delete(`/cases/${id}`);
      setMessage(`Case ${caseId} deleted.`);
      fetchCases();
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      alert('Failed to delete case.');
    }
  };

  const openEditModal = (c: PatientCaseItem) => {
    setSelectedCase(c);
    setFormData({
      patientName: c.patientName,
      patientAge: c.patientAge,
      patientGender: c.patientGender,
      endoscopist: c.endoscopist,
      indication: c.indication as any,
      anatomicalLocation: c.anatomicalLocation,
      polypFindings: c.polypFindings,
      riskLevel: c.riskLevel,
      status: c.status,
      notes: c.notes || '',
    });
    setEditModalOpen(true);
  };

  const openDetailsModal = (c: PatientCaseItem) => {
    setSelectedCase(c);
    setDetailsModalOpen(true);
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'High':
        return 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900';
      case 'Moderate':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900';
      default:
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900';
    }
  };

  // Stats calculation
  const totalCasesCount = cases.length;
  const highRiskCount = cases.filter((c) => c.riskLevel === 'High').length;
  const reviewedCount = cases.filter((c) => c.status === 'Reviewed').length;
  const followUpCount = cases.filter((c) => c.status === 'Follow-up Required').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Patient Cases</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage patient colonoscopy records
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Case</span>
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {/* 4 Mini KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#0d1838] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors">
          <div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Total Studies</span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{totalCasesCount}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
            <FolderKanban className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#0d1838] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors">
          <div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">High Risk Polyps</span>
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-0.5">{highRiskCount}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#0d1838] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors">
          <div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Clinician Reviewed</span>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{reviewedCount}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#0d1838] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors">
          <div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase">Surveillance Recall</span>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">{followUpCount}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-[#0d1838] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-5 transition-colors">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cases..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Risk Levels</option>
              <option value="High">High Risk</option>
              <option value="Moderate">Moderate Risk</option>
              <option value="Low">Low Risk</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Case Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Follow-up Required">Follow-up Required</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold">
                <th className="pb-3 pl-2">Case ID</th>
                <th className="pb-3">Patient</th>
                <th className="pb-3">Procedure Date</th>
                <th className="pb-3">Location</th>
                <th className="pb-3">Polyp Findings</th>
                <th className="pb-3">Risk Level</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">Loading cases...</td>
                </tr>
              ) : cases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">No patient cases matching criteria.</td>
                </tr>
              ) : (
                cases.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 pl-2 font-mono font-bold text-slate-900 dark:text-white">{c.caseId}</td>
                    <td className="py-3">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{c.patientName}</div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500">
                        {c.patientAge}y • {c.patientGender} • <span className="text-blue-600 dark:text-blue-400 font-medium">{c.endoscopist || 'Dr. Elena Rostova, MD'}</span>
                      </div>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                      {new Date(c.procedureDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">{c.anatomicalLocation}</td>
                    <td className="py-3 font-medium text-slate-900 dark:text-slate-200">{c.polypFindings}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getRiskBadge(c.riskLevel)}`}>
                        {c.riskLevel}
                      </span>
                    </td>
                    <td className="py-3">
                      <Badge status={c.status} />
                    </td>
                    <td className="py-3 text-right pr-2">
                      <div className="flex items-center justify-end gap-1.5 text-slate-500 dark:text-slate-400">
                        <button
                          type="button"
                          onClick={() => openDetailsModal(c)}
                          title="View Case Details"
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(c)}
                          title="Edit Case Record"
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <Link
                          to="/analyze"
                          title="Upload Colonoscopy Image for this Case"
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <UploadCloud className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(c._id, c.caseId)}
                          title="Delete Case"
                          className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <div>Showing {cases.length} clinical patient studies</div>
        </div>
      </div>

      {/* CREATE CASE MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-[#0e1a42] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">New Case</h2>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Patient Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    placeholder="e.g. John Doe"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Age</label>
                  <input
                    type="number"
                    required
                    value={formData.patientAge}
                    onChange={(e) => setFormData({ ...formData, patientAge: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                  <select
                    value={formData.patientGender}
                    onChange={(e) => setFormData({ ...formData, patientGender: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Procedure Indication</label>
                  <select
                    value={formData.indication}
                    onChange={(e) => setFormData({ ...formData, indication: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Screening">Routine Screening</option>
                    <option value="Surveillance">Surveillance / Recall</option>
                    <option value="High Risk">High Risk Family History</option>
                    <option value="Symptomatic">Symptomatic (Bleeding/Pain)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Anatomical Location</label>
                  <input
                    type="text"
                    required
                    value={formData.anatomicalLocation}
                    onChange={(e) => setFormData({ ...formData, anatomicalLocation: e.target.value })}
                    placeholder="e.g. Ascending Colon"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Polyp Findings</label>
                  <select
                    value={formData.polypFindings}
                    onChange={(e) => setFormData({ ...formData, polypFindings: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Adenomatous Polyp">Adenomatous Polyp</option>
                    <option value="Hyperplastic Polyp">Hyperplastic Polyp</option>
                    <option value="Serrated Polyp">Serrated Polyp</option>
                    <option value="Other / Non-polyp">Other / Non-polyp</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Attending Endoscopist & Clinical Title</label>
                <select
                  value={formData.endoscopist}
                  onChange={(e) => setFormData({ ...formData, endoscopist: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Dr. Elena Rostova, MD (Chief Endoscopist)">Dr. Elena Rostova, MD (Chief Endoscopist)</option>
                  <option value="Dr. Marcus Vance, MD (Consultant Pathologist)">Dr. Marcus Vance, MD (Consultant Pathologist)</option>
                  <option value="Dr. Priya Sharma, MBBS (Endoscopy Fellow)">Dr. Priya Sharma, MBBS (Endoscopy Fellow)</option>
                  <option value="Dr. Aris Thorne, MD (Clinical Quality Lead)">Dr. Aris Thorne, MD (Clinical Quality Lead)</option>
                  <option value="Prof. David Chen, PhD (AI Oncology Lead)">Prof. David Chen, PhD (AI Oncology Lead)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Risk Classification</label>
                  <select
                    value={formData.riskLevel}
                    onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Low">Low Risk</option>
                    <option value="Moderate">Moderate Risk</option>
                    <option value="High">High Risk</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Clinical Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Follow-up Required">Follow-up Required</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Clinical Notes & Recommendations</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Endoscopic resection details, pathology follow-up..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs disabled:opacity-50"
                >
                  {saving ? 'Creating...' : 'Create Case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CASE MODAL */}
      {editModalOpen && selectedCase && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-[#0e1a42] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Edit Case {selectedCase.caseId}</h2>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">Update clinical details and risk assessment</p>
              </div>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Patient Name</label>
                  <input
                    type="text"
                    required
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Age</label>
                  <input
                    type="number"
                    required
                    value={formData.patientAge}
                    onChange={(e) => setFormData({ ...formData, patientAge: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Risk Level</label>
                  <select
                    value={formData.riskLevel}
                    onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Low">Low Risk</option>
                    <option value="Moderate">Moderate Risk</option>
                    <option value="High">High Risk</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Follow-up Required">Follow-up Required</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Polyp Findings</label>
                <input
                  type="text"
                  value={formData.polypFindings}
                  onChange={(e) => setFormData({ ...formData, polypFindings: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Attending Endoscopist & Clinical Title</label>
                <select
                  value={formData.endoscopist}
                  onChange={(e) => setFormData({ ...formData, endoscopist: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Dr. Elena Rostova, MD (Chief Endoscopist)">Dr. Elena Rostova, MD (Chief Endoscopist)</option>
                  <option value="Dr. Marcus Vance, MD (Consultant Pathologist)">Dr. Marcus Vance, MD (Consultant Pathologist)</option>
                  <option value="Dr. Priya Sharma, MBBS (Endoscopy Fellow)">Dr. Priya Sharma, MBBS (Endoscopy Fellow)</option>
                  <option value="Dr. Aris Thorne, MD (Clinical Quality Lead)">Dr. Aris Thorne, MD (Clinical Quality Lead)</option>
                  <option value="Prof. David Chen, PhD (AI Oncology Lead)">Prof. David Chen, PhD (AI Oncology Lead)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Clinical Notes</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {detailsModalOpen && selectedCase && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-[#0e1a42] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{selectedCase.caseId}</div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">{selectedCase.patientName}</h2>
              </div>
              <button
                type="button"
                onClick={() => setDetailsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <div className="pt-2 flex justify-between">
                <span className="text-slate-400 dark:text-slate-500">Demographics:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedCase.patientAge} years • {selectedCase.patientGender}
                </span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-400 dark:text-slate-500">Indication:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedCase.indication}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-400 dark:text-slate-500">Procedure Date:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                  {new Date(selectedCase.procedureDate).toLocaleString()}
                </span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-400 dark:text-slate-500">Endoscopist:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedCase.endoscopist}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-400 dark:text-slate-500">Anatomical Location:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedCase.anatomicalLocation}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-400 dark:text-slate-500">Polyp Findings:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedCase.polypFindings}</span>
              </div>
              <div className="pt-2 flex justify-between items-center">
                <span className="text-slate-400 dark:text-slate-500">Risk Level:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getRiskBadge(selectedCase.riskLevel)}`}>
                  {selectedCase.riskLevel}
                </span>
              </div>
              <div className="pt-2 flex justify-between items-center">
                <span className="text-slate-400 dark:text-slate-500">Clinical Status:</span>
                <Badge status={selectedCase.status} />
              </div>
            </div>

            {selectedCase.notes && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                <span className="font-bold text-slate-900 dark:text-white block mb-1">Clinical Notes:</span>
                {selectedCase.notes}
              </div>
            )}

            <div className="pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <Link
                to="/analyze"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <span>Run New Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => setDetailsModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
