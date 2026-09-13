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
} from 'lucide-react';

interface RecentUploadItem {
  id: string;
  name: string;
  size: string;
  url: string;
}

const RECENT_UPLOADS: RecentUploadItem[] = [
  {
    id: 'colon_001',
    name: 'colon_001.jpg',
    size: '2.4 MB',
    url: '/sample_images/colon_001.jpg',
  },
  {
    id: 'colon_002',
    name: 'colon_002.jpg',
    size: '1.8 MB',
    url: '/sample_images/colon_002.jpg',
  },
  {
    id: 'colon_003',
    name: 'colon_003.jpg',
    size: '3.1 MB',
    url: '/sample_images/colon_003.jpg',
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

  // SCREEN 4: Processing State
  if (isProcessing) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Analysis in Progress</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Automated feature extraction and lesion classification
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left card: Sequential Stepper */}
          <div className="lg:col-span-7 bg-white dark:bg-[#0d1838] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 transition-colors">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Processing Steps</h2>

            <div className="space-y-2.5">
              {PROCESSING_STEPS.map((step, idx) => {
                const isCompleted = idx < currentStepIndex;
                const isInProgress = idx === currentStepIndex;

                return (
                  <div
                    key={step.id}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-all ${
                      isCompleted
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                        : isInProgress
                        ? 'bg-blue-50/80 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
                        : 'bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : isInProgress ? (
                        <Loader2 className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
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
                        <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">Completed</span>
                      )}
                      {isInProgress && (
                        <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">In progress</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right card: Thumbnail + Processing bar */}
          <div className="lg:col-span-5 bg-white dark:bg-[#0d1838] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col items-center justify-center text-center space-y-5 transition-colors">
            <div className="relative w-44 h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner bg-slate-950 flex items-center justify-center">
              <img
                src={previewUrl || '/sample_images/colon_001.jpg'}
                alt="Analyzing Colonoscopy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-blue-900/20 backdrop-blur-xs flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            </div>

            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span>Processing...</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xs">
              Extracting high-resolution visual feature representations.
            </p>
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

          {/* Recent Uploads Section */}
          <div className="bg-white dark:bg-[#0d1838] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-3 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Recent Preloaded Samples
              </h3>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">Click to Test</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {RECENT_UPLOADS.map((item) => (
                <div
                  key={item.id}
                  onClick={() => selectRecent(item)}
                  className="group cursor-pointer rounded-xl border border-slate-200 dark:border-slate-800 p-2.5 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all flex sm:flex-col items-center gap-3 sm:gap-0 bg-slate-50/50 dark:bg-slate-900/50"
                >
                  <div className="w-20 h-16 sm:w-full sm:h-24 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center shrink-0">
                    <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="sm:mt-2 text-left sm:text-center w-full min-w-0">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{item.name}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500">{item.size} • 1-Click Load</div>
                  </div>
                </div>
              ))}
            </div>
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
