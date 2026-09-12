import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { Badge } from '../../components/Badge';
import {
  Plus,
  Download,
  ToggleLeft,
  ToggleRight,
  CheckCircle2,
  Trash2,
  X,
} from 'lucide-react';
import { ModelRegistryItem } from '../../types';

export const ModelManagement: React.FC = () => {
  const [models, setModels] = useState<ModelRegistryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Form State
  const [name, setName] = useState('Polyp AI Model');
  const [version, setVersion] = useState('v1.3.0');
  const [backbone, setBackbone] = useState('Deep Feature Extractor (Standard)');
  const [classifier, setClassifier] = useState('Ensemble Classifier V2');
  const [accuracy, setAccuracy] = useState('90.2');
  const [status, setStatus] = useState<'Validation' | 'Experimental'>('Validation');

  const fetchModels = async () => {
    setLoading(true);
    try {
      const res = await api.get('/models');
      setModels(res.data.models || []);
    } catch (err) {
      console.error('Failed to load models:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleCreateModel = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/models', {
        name,
        version,
        backbone,
        classifier,
        datasetVersion: 'ColoPolyp-DB-v1.0',
        metrics: {
          accuracy: Number(accuracy) / 100,
          precision: (Number(accuracy) - 1) / 100,
          recall: (Number(accuracy) - 0.5) / 100,
          f1Score: (Number(accuracy) - 0.8) / 100,
          rocAuc: 0.985,
          sensitivity: (Number(accuracy) - 0.5) / 100,
          specificity: (Number(accuracy) - 1.2) / 100,
        },
        status,
      });
      setModalOpen(false);
      setMessage(`Model ${version} registered successfully.`);
      fetchModels();
      setTimeout(() => setMessage(''), 4000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to register model');
    } finally {
      setSaving(false);
    }
  };

  const handleActivateModel = async (id: string, ver: string) => {
    try {
      await api.post(`/models/${id}/activate`);
      setMessage(`Model ${ver} promoted to live active production.`);
      fetchModels();
      setTimeout(() => setMessage(''), 4000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to activate model');
    }
  };

  const handleDeleteModel = async (id: string, ver: string) => {
    if (!window.confirm(`Are you sure you want to delete model version ${ver}?`)) {
      return;
    }
    try {
      await api.delete(`/models/${id}`);
      setMessage(`Model ${ver} removed.`);
      fetchModels();
      setTimeout(() => setMessage(''), 4000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete model');
    }
  };

  const handleDownloadModelManifest = (m: ModelRegistryItem) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(m, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `model-${m.version}-spec.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Header matching Screen 12 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Models</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage AI models and active deployments
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Model</span>
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {/* Models Table Card */}
      <div className="bg-white dark:bg-[#0d1838] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden p-6 space-y-5 transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-semibold">
                <th className="pb-3 pl-2">Model Name</th>
                <th className="pb-3">Version</th>
                <th className="pb-3">BackBone</th>
                <th className="pb-3">Classifier</th>
                <th className="pb-3">Accuracy</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {models.map((m) => {
                const isProduction = m.status === 'Production';

                return (
                  <tr key={m._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 pl-2 font-bold text-slate-900 dark:text-white">{m.name}</td>
                    <td className="py-3.5 font-mono text-slate-600 dark:text-slate-400">{m.version}</td>
                    <td className="py-3.5 text-slate-700 dark:text-slate-300">{m.backbone}</td>
                    <td className="py-3.5 text-slate-700 dark:text-slate-300">{m.classifier}</td>
                    <td className="py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                      {(m.metrics.accuracy * 100).toFixed(1)}%
                    </td>
                    <td className="py-3.5">
                      <Badge status={m.status} />
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      <div className="flex items-center justify-end gap-2 text-slate-500 dark:text-slate-400">
                        <button
                          type="button"
                          onClick={() => !isProduction && handleActivateModel(m._id, m.version)}
                          title={isProduction ? 'Currently Active in Production' : 'Promote to Production'}
                          className={`p-1 rounded-lg transition-colors ${
                            isProduction ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                          }`}
                        >
                          {isProduction ? (
                            <ToggleRight className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-slate-400" />
                          )}
                        </button>
                        <button
                          type="button"
                          title="Download Checkpoint Specification"
                          onClick={() => handleDownloadModelManifest(m)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        {!isProduction && (
                          <button
                            type="button"
                            onClick={() => handleDeleteModel(m._id, m.version)}
                            title="Delete Model"
                            className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <div>Showing 1-{models.length} of {models.length} versioned pipelines</div>
        </div>
      </div>

      {/* UPLOAD/REGISTER MODEL MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white dark:bg-[#0e1a42] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">New Model</h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateModel} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Model Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Version</label>
                  <input
                    type="text"
                    required
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder="e.g. v1.3.0"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Validation Accuracy (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={accuracy}
                    onChange={(e) => setAccuracy(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Feature Extractor</label>
                <select
                  value={backbone}
                  onChange={(e) => setBackbone(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Deep Feature Extractor (Standard)">Deep Feature Extractor (Standard)</option>
                  <option value="Deep Feature Extractor (High Res)">Deep Feature Extractor (High Res)</option>
                  <option value="Baseline Feature Extractor">Baseline Feature Extractor</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Classification Method</label>
                <select
                  value={classifier}
                  onChange={(e) => setClassifier(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Ensemble Classifier V2">Ensemble Classifier V2</option>
                  <option value="Gradient Boosting Classifier">Gradient Boosting Classifier</option>
                  <option value="Multi-Class Dense Classifier">Multi-Class Dense Classifier</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Validation">Validation</option>
                  <option value="Experimental">Experimental</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs disabled:opacity-50"
                >
                  {saving ? 'Registering...' : 'Register Pipeline'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
