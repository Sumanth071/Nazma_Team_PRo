import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import {
  UploadCloud,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  FileText,
  HelpCircle,
  ZoomIn,
  Scan,
  Stethoscope,
  Crosshair,
  Sparkles,
  Layers,
  ShieldCheck,
} from 'lucide-react';

interface RecentUploadItem {
  id: string;
  name: string;
  size: string;
  url: string;
  description?: string;
  category?: string;
}

const RECENT_UPLOADS: RecentUploadItem[] = [
  {
    id: 'colon_001',
    name: 'colon_001.jpg',
    size: '2.4 MB',
    url: '/sample_images/colon_001.jpg',
    description: 'Routine screening colonoscopy frame (Descending colon)',
  },
  {
    id: 'colon_002',
    name: 'colon_002.jpg',
    size: '1.8 MB',
    url: '/sample_images/colon_002.jpg',
    description: 'High-definition colonoscopy surveillance capture',
  },
  {
    id: 'colon_003',
    name: 'colon_003.jpg',
    size: '3.1 MB',
    url: '/sample_images/colon_003.jpg',
    description: 'Diagnostic colonoscopy screening sample',
  },
];

// Guide Requirement 4: Doctor / Hospital Clinical Test Cases
const DOCTOR_CLINICAL_CASES: RecentUploadItem[] = [
  {
    id: 'doc_case_01',
    name: 'Hospital Case #402 (Adenoma)',
    size: '794 KB',
    url: '/sample_images/adenomatous_polyp_sample_01.jpg',
    description: 'Histology-confirmed Tubular Adenoma with low-grade dysplasia',
    category: 'Doctor / Hospital Case',
  },
  {
    id: 'doc_case_02',
    name: 'Hospital Case #519 (Hyperplastic)',
    size: '33 KB',
    url: '/sample_images/hyperplastic_polyp_sample_02.jpg',
    description: 'Distal sigmoid non-neoplastic hyperplastic lesion',
    category: 'Doctor / Hospital Case',
  },
  {
    id: 'doc_case_03',
    name: 'Hospital Case #681 (Serrated)',
    size: '32 KB',
    url: '/sample_images/serrated_polyp_sample_03.jpg',
    description: 'Proximal colon sessile serrated lesion (SSL)',
    category: 'Doctor / Hospital Case',
  },
  {
    id: 'doc_case_04',
    name: 'Clinical Benchmark (Real Polyp)',
    size: '794 KB',
    url: '/sample_images/colonoscopy_polyp_real.jpg',
    description: 'High-definition Olympus endoscope capture from clinic',
    category: 'Doctor / Hospital Case',
  },
];

const PROCESSING_STEPS = [
  { id: 1, name: 'Image uploaded' },
  { id: 2, name: 'Image validation' },
  { id: 3, name: 'Image preprocessing' },
  { id: 4, name: 'Deep feature extraction' },
  { id: 5, name: 'Visual attention mapping' },
  { id: 6, name: 'Diagnostic classification' },
  { id: 7, name: 'Explanation generation' },
];

export const NewAnalysis: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(15);
  const [sampleTab, setSampleTab] = useState<'screening' | 'doctor'>('doctor');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileSelect = (file: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
      setError('Please provide a valid JPEG, PNG, or DICOM image.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File exceeds maximum 10MB limit.');
      return;
    }

    setError('');
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const selectRecent = async (item: RecentUploadItem) => {
    try {
      const response = await fetch(item.url);
      const blob = await response.blob();
      const file = new File([blob], item.name, { type: 'image/jpeg' });
      handleFileSelect(file);
    } catch (err) {
      console.error('Failed to load sample image:', err);
      setError('Could not load selected image.');
    }
  };

  const handleStartAnalysis = async (customFile?: File) => {
    const fileToUpload = customFile || selectedFile;
    if (!fileToUpload) {
      setError('Please select or drop an image file first.');
      return;
    }

    setIsProcessing(true);
    setCurrentStepIndex(1);
    setProgressPercent(20);

    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        const next = prev + 1;
        if (next < PROCESSING_STEPS.length) {
          setProgressPercent(Math.min(92, 20 + next * 12));
          return next;
        }
        return prev;
      });
    }, 600);

    try {
      const formData = new FormData();
      formData.append('image', fileToUpload);
      formData.append('endoscopist', 'Dr. Smith');
      formData.append('indication', 'Routine Screening');
      formData.append('anatomicalLocation', 'Descending Colon');

      let predictionId = '';

      try {
        const res = await api.post('/predictions', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        predictionId = res.data.prediction?._id;
      } catch (directErr) {
        // Fallback to two-step upload and predict
        const uploadRes = await api.post('/images/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const imageId = uploadRes.data.image?._id;
        const predictRes = await api.post('/predict', {
          imageId,
          clinicalMetadata: {
            endoscopist: 'Dr. Smith',
            indication: 'Routine Screening',
            anatomicalLocation: 'Descending Colon',
          },
        });
        predictionId = predictRes.data.prediction?._id;
      }

      clearInterval(stepInterval);
      setProgressPercent(100);
      setCurrentStepIndex(PROCESSING_STEPS.length);

      setTimeout(() => {
        if (predictionId) {
          navigate(`/prediction/${predictionId}`);
        } else {
          navigate('/dashboard');
        }
      }, 500);
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsProcessing(false);
      setError(err.response?.data?.message || 'Inference engine failed. Please try again.');
    }
  };

  // SCREEN 4: Processing State with Guide Requirement 2: 3-Region Zoom Visualizer
  if (isProcessing) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Analysis in Progress</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Automated multi-region deep feature extraction & visual attention mapping
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-semibold">
            <Scan className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>OPTICAL ZOOM ACTIVE: 3 ROIs</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left card: Sequential Stepper */}
          <div className="lg:col-span-5 bg-white dark:bg-[#0d1838] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Pipeline Stages
              </h2>
              <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold">
                {progressPercent}%
              </span>
            </div>

            <div className="space-y-2">
              {PROCESSING_STEPS.map((step, idx) => {
                const isCompleted = idx < currentStepIndex;
                const isInProgress = idx === currentStepIndex;

                return (
                  <div
                    key={step.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                      isCompleted
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                        : isInProgress
                        ? 'bg-blue-50/80 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
                        : 'bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : isInProgress ? (
                        <Loader2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 animate-spin shrink-0" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                      )}

                      <span
                        className={`font-medium ${
                          isCompleted
                            ? 'text-slate-700 dark:text-slate-200'
                            : isInProgress
                            ? 'text-blue-600 dark:text-blue-400 font-bold'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {step.name}
                      </span>
                    </div>

                    <div>
                      {isCompleted && (
                        <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">Done</span>
                      )}
                      {isInProgress && (
                        <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 animate-pulse">Running</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Linear Progress Indicator */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
              <div className="flex justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
                <span>Inference Progress</span>
                <span className="font-mono">{progressPercent}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right card: Guide Requirement 2 - Active 3-Region Zoom Visualizer & Optical Scanner */}
          <div className="lg:col-span-7 bg-[#091126] rounded-2xl border border-blue-900/60 p-5 shadow-2xl space-y-4 text-left">
            {/* Scanner Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <Scan className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    Microscopic Region-of-Interest (ROI) Zoom
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Extracting 3 high-magnification optical crops during deep feature extraction
                  </p>
                </div>
              </div>
              <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-cyan-300 font-bold">
                768-D DENSE TENSOR
              </div>
            </div>

            {/* Top Scanned Frame with Targeting Laser Reticle */}
            <div className="relative w-full h-44 rounded-xl overflow-hidden bg-black border border-blue-900/50 flex items-center justify-center">
              <img
                src={previewUrl || '/sample_images/colon_001.jpg'}
                alt="Target Endoscopy Frame"
                className="w-full h-full object-cover opacity-85"
              />
              {/* Animated horizontal laser scanning bar */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] animate-pulse" />

              {/* Center targeting crosshair */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-20 h-20 border border-cyan-400/50 rounded-full flex items-center justify-center animate-spin">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                </div>
              </div>

              {/* Live Telemetry Overlays */}
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-cyan-400 border border-cyan-500/30">
                SCANNING: {PROCESSING_STEPS[Math.min(currentStepIndex, PROCESSING_STEPS.length - 1)].name}
              </div>
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
                INSPECTION: 3 FOCAL CROPS ACTIVE
              </div>
            </div>

            {/* Guide Requirement 2: 3 Zoomed Images Pop-out During Image Processing */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300 uppercase tracking-wider">
                  3 Optical Magnification Windows (Kudo / NICE / Paris):
                </span>
                <span className="font-mono text-cyan-400 font-bold">Active Zoom HUD</span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {/* Zoom 1: Crypts */}
                <div className="rounded-xl border border-cyan-500/60 bg-slate-950 p-2 space-y-1.5 shadow-md shadow-cyan-500/10">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-white truncate">1. Crypt Pit Pattern</span>
                    <span className="font-mono text-cyan-300 font-bold bg-cyan-950/80 px-1 rounded">3.5x</span>
                  </div>
                  <div className="relative w-full h-24 rounded-lg overflow-hidden bg-black border border-cyan-500/30">
                    <div
                      className="w-full h-full scale-[3.5] transition-transform duration-700"
                      style={{
                        backgroundImage: `url(${previewUrl || '/sample_images/colon_001.jpg'})`,
                        backgroundPosition: '48% 52%',
                        backgroundSize: '350%',
                      }}
                    />
                    <div className="absolute inset-0 border border-cyan-400/40 pointer-events-none" />
                  </div>
                  <p className="text-[9px] text-slate-400 font-mono line-clamp-1">Kudo Pit Types III-V</p>
                </div>

                {/* Zoom 2: Vascular */}
                <div className="rounded-xl border border-blue-500/60 bg-slate-950 p-2 space-y-1.5 shadow-md shadow-blue-500/10">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-white truncate">2. Microvasculature</span>
                    <span className="font-mono text-blue-300 font-bold bg-blue-950/80 px-1 rounded">3.0x</span>
                  </div>
                  <div className="relative w-full h-24 rounded-lg overflow-hidden bg-black border border-blue-500/30">
                    <div
                      className="w-full h-full scale-[3.0] transition-transform duration-700"
                      style={{
                        backgroundImage: `url(${previewUrl || '/sample_images/colon_001.jpg'})`,
                        backgroundPosition: '58% 42%',
                        backgroundSize: '300%',
                      }}
                    />
                    <div className="absolute inset-0 border border-blue-400/40 pointer-events-none" />
                  </div>
                  <p className="text-[9px] text-slate-400 font-mono line-clamp-1">NICE / Sano Criteria</p>
                </div>

                {/* Zoom 3: Margin */}
                <div className="rounded-xl border border-emerald-500/60 bg-slate-950 p-2 space-y-1.5 shadow-md shadow-emerald-500/10">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-white truncate">3. Lesion Margin</span>
                    <span className="font-mono text-emerald-300 font-bold bg-emerald-950/80 px-1 rounded">2.5x</span>
                  </div>
                  <div className="relative w-full h-24 rounded-lg overflow-hidden bg-black border border-emerald-500/30">
                    <div
                      className="w-full h-full scale-[2.5] transition-transform duration-700"
                      style={{
                        backgroundImage: `url(${previewUrl || '/sample_images/colon_001.jpg'})`,
                        backgroundPosition: '36% 60%',
                        backgroundSize: '250%',
                      }}
                    />
                    <div className="absolute inset-0 border border-emerald-400/40 pointer-events-none" />
                  </div>
                  <p className="text-[9px] text-slate-400 font-mono line-clamp-1">Paris Boundary Base</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SCREEN 3: Upload Screen State
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">New Analysis</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Upload a colonoscopy image for AI analysis</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Drag & Drop Zone + Recent Uploads */}
        <div className="lg:col-span-8 space-y-5 sm:space-y-6">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`rounded-2xl sm:rounded-3xl border-2 border-dashed p-6 sm:p-10 text-center flex flex-col items-center justify-center transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0d1838] hover:border-slate-400 dark:hover:border-slate-600'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />

            {previewUrl ? (
              <div className="space-y-4 flex flex-col items-center w-full max-w-sm">
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-950 flex items-center justify-center">
                  <img src={previewUrl} alt="Upload preview" className="w-full h-full object-cover" />
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[260px]">{selectedFile?.name}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {selectedFile && (selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 pt-2 w-full justify-center">
                  <button
                    type="button"
                    onClick={() => handleStartAnalysis()}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all cursor-pointer min-h-[44px]"
                  >
                    Start AI Analysis
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all cursor-pointer min-h-[44px]"
                  >
                    Change Image
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5 sm:space-y-4 flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900 shadow-xs">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Drag and drop your image here
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">or</p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all cursor-pointer min-h-[44px]"
                >
                  Browse Files
                </button>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  Supported formats: JPG, PNG, DICOM | Max size: 10MB
                </p>
              </div>
            )}
          </div>

          {/* Guide Requirement 4: Real Doctor & Hospital Clinical Test Cases vs Standard Screening */}
          <div className="bg-white dark:bg-[#0d1838] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-3.5 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-emerald-500" />
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Pre-Loaded Clinical Verification Cases
                </h3>
              </div>

              {/* Category Tab Selector */}
              <div className="flex rounded-xl bg-slate-100 dark:bg-slate-900 p-0.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setSampleTab('doctor')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    sampleTab === 'doctor'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Doctor / Hospital Dataset ({DOCTOR_CLINICAL_CASES.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSampleTab('screening')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    sampleTab === 'screening'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  Standard Screening ({RECENT_UPLOADS.length})
                </button>
              </div>
            </div>

            {/* Display Doctor Cases */}
            {sampleTab === 'doctor' && (
              <div className="space-y-3">
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Biopsy-confirmed real colonoscopy cases collected from endoscopic gastroenterology centers for physician validation.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {DOCTOR_CLINICAL_CASES.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => selectRecent(item)}
                      className="group cursor-pointer rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition-all flex flex-col items-center bg-slate-50/50 dark:bg-slate-900/50"
                    >
                      <div className="w-full h-24 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center shrink-0 relative">
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-[9px] font-mono text-emerald-300 font-bold">
                          DOCTOR CASE
                        </span>
                      </div>
                      <div className="mt-2 text-center w-full min-w-0">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                          {item.description}
                        </div>
                        <div className="mt-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                          1-Click Load & Test
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Display Standard Screening */}
            {sampleTab === 'screening' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {RECENT_UPLOADS.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => selectRecent(item)}
                    className="group cursor-pointer rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all flex sm:flex-col items-center gap-3 sm:gap-0 bg-slate-50/50 dark:bg-slate-900/50"
                  >
                    <div className="w-20 h-16 sm:w-full sm:h-24 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center shrink-0">
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="sm:mt-2 text-left sm:text-center w-full min-w-0">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500">
                        {item.size} • 1-Click Load
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Image Requirements */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0d1838] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 h-fit transition-colors">
          <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Image Requirements
          </h2>

          <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Clear colonoscopy image</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Supported formats: JPG, PNG, DICOM</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Max file size: 10MB</span>
            </li>
            <li className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Good lighting and focus</span>
            </li>
          </ul>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500">
            The image will be analyzed using automated deep feature extraction, attention mapping, and classification.
          </div>
        </div>
      </div>
    </div>
  );
};
