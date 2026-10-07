import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  FileText,
  Copy,
  Check,
} from 'lucide-react';

interface VoiceExplanationWidgetProps {
  predictedClass: string;
  confidence: number;
  analysisId?: string;
  autoPlay?: boolean;
  className?: string;
}

interface RiskProfile {
  level: 'HIGH' | 'MODERATE-HIGH' | 'LOW' | 'NORMAL';
  label: string;
  badgeClass: string;
  borderClass: string;
  bgClass: string;
  neoplasticPotential: string;
  clinicalAction: string;
  speechText: string;
}

export const VoiceExplanationWidget: React.FC<VoiceExplanationWidgetProps> = ({
  predictedClass,
  confidence,
  analysisId,
  autoPlay = false,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState<number>(1.0);
  const [showTranscript, setShowTranscript] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const confidencePercent = (confidence * 100).toFixed(1);

  // Generate standardized medical risk profile based on clinical guidelines (ESGE/ASGE)
  const getRiskProfile = (): RiskProfile => {
    const pClass = (predictedClass || '').toLowerCase();

    if (pClass.includes('adenoma')) {
      return {
        level: 'HIGH',
        label: 'High Malignant Risk',
        badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        borderClass: 'border-rose-500/40',
        bgClass: 'from-rose-950/30 via-slate-900 to-slate-950',
        neoplasticPotential: 'Pre-cancerous Neoplastic Adenoma (Dysplastic Risk)',
        clinicalAction: 'Complete Endoscopic Mucosal Resection (EMR) and histopathological confirmation strongly advised.',
        speechText: `Diagnostic assessment complete. Analysis reveals an Adenomatous Polyp with ${confidencePercent} percent diagnostic confidence. Clinical Risk Level is High. Adenomatous polyps are established dysplastic lesions with significant malignant transformation risk. Immediate endoscopic mucosal resection and histopathological evaluation are recommended as per clinical guidelines.`,
      };
    }

    if (pClass.includes('serrated')) {
      return {
        level: 'MODERATE-HIGH',
        label: 'Moderate-High Risk',
        badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        borderClass: 'border-amber-500/40',
        bgClass: 'from-amber-950/30 via-slate-900 to-slate-950',
        neoplasticPotential: 'Sessile Serrated Lesion (Alternate Serrated Pathway)',
        clinicalAction: 'En-bloc resection with dedicated mucosal margin inspection; 3-year surveillance colonoscopy.',
        speechText: `Diagnostic assessment complete. The detected lesion is classified as a Serrated Polyp with ${confidencePercent} percent diagnostic confidence. Clinical Risk Level is Moderate to High. Sessile serrated polyps develop through the alternate serrated neoplasia pathway. Complete en-bloc resection with three-year surveillance interval is recommended.`,
      };
    }

    if (pClass.includes('hyperplastic')) {
      return {
        level: 'LOW',
        label: 'Low Risk (Benign)',
        badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        borderClass: 'border-emerald-500/40',
        bgClass: 'from-emerald-950/30 via-slate-900 to-slate-950',
        neoplasticPotential: 'Non-neoplastic Mucosal Proliferation (Negligible Dysplasia)',
        clinicalAction: 'Benign histology. Routine standard surveillance colonoscopy interval.',
        speechText: `Diagnostic assessment complete. The specimen is classified as a Hyperplastic Polyp with ${confidencePercent} percent diagnostic confidence. Clinical Risk Level is Low and Benign. Hyperplastic lesions carry negligible risk of malignant transformation. Standard clinical observation and routine screening are indicated.`,
      };
    }

    return {
      level: 'NORMAL',
      label: 'Minimal / Normal Mucosa',
      badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      borderClass: 'border-blue-500/40',
      bgClass: 'from-blue-950/30 via-slate-900 to-slate-950',
      neoplasticPotential: 'Normal Colorectal Epithelium',
      clinicalAction: 'No polyps identified. Follow normal preventative colonoscopy schedule.',
      speechText: `Diagnostic assessment complete. The scanned endoscopic frame shows normal mucosal architecture with ${confidencePercent} percent confidence. No dysplastic polyp features detected. Continue routine preventative screening.`,
    };
  };

  const risk = getRiskProfile();

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    // Cancel any ongoing speech upon unmount or prediction change
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [predictedClass]);

  // Setup utterance
  const buildUtterance = (): SpeechSynthesisUtterance => {
    const utterance = new SpeechSynthesisUtterance(risk.speechText);
    utterance.rate = rate;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    // Attempt to pick a premium natural English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(
      (v) =>
        (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David')) &&
        v.lang.startsWith('en')
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    return utterance;
  };

  const handlePlay = () => {
    if (!isSupported) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();
    const utt = buildUtterance();
    window.speechSynthesis.speak(utt);
  };

  const handlePause = () => {
    if (!isSupported) return;
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    if (isPlaying) {
      window.speechSynthesis.cancel();
      const utt = buildUtterance();
      utt.rate = newRate;
      window.speechSynthesis.speak(utt);
    }
  };

  const copyTranscript = () => {
    navigator.clipboard.writeText(risk.speechText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isSupported) {
    return (
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
        Audio speech synthesis is not supported on this browser version.
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border ${risk.borderClass} bg-gradient-to-br ${risk.bgClass} p-5 shadow-lg backdrop-blur-md space-y-4 transition-all duration-300 ${className}`}
    >
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
            <Volume2 className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                Clinical AI Voice Briefing
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${risk.badgeClass}`}>
                {risk.label}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Automated verbal summary of polyp classification & oncological risk
            </p>
          </div>
        </div>

        {/* Dynamic Sound Wave Visualizer */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 self-start sm:self-auto">
          <span className="text-[10px] font-mono text-slate-400 mr-1.5">
            {isPlaying ? 'SPEAKING' : isPaused ? 'PAUSED' : 'READY'}
          </span>
          <div className="flex items-end gap-0.5 h-4">
            <span
              className={`w-1 rounded-full bg-blue-500 transition-all ${
                isPlaying ? 'h-4 animate-[bounce_0.6s_infinite]' : 'h-1.5'
              }`}
            />
            <span
              className={`w-1 rounded-full bg-cyan-400 transition-all ${
                isPlaying ? 'h-3 animate-[bounce_0.4s_infinite]' : 'h-2'
              }`}
            />
            <span
              className={`w-1 rounded-full bg-emerald-400 transition-all ${
                isPlaying ? 'h-4 animate-[bounce_0.7s_infinite]' : 'h-1'
              }`}
            />
            <span
              className={`w-1 rounded-full bg-indigo-400 transition-all ${
                isPlaying ? 'h-2.5 animate-[bounce_0.5s_infinite]' : 'h-1.5'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Main Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
        <div className="flex items-center gap-2">
          {!isPlaying ? (
            <button
              type="button"
              onClick={handlePlay}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isPaused ? 'Resume Speech' : 'Play Voice Summary'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePause}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/30 flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause Voice</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleStop}
            title="Replay from start"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Speed Rate Toggle */}
          <div className="flex items-center bg-slate-950/70 border border-slate-800 rounded-xl p-0.5 text-[11px] font-mono">
            {[0.9, 1.0, 1.2].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRateChange(r)}
                className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                  rate === r
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r}x
              </button>
            ))}
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowTranscript(!showTranscript)}
            className="text-[11px] font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 cursor-pointer"
          >
            <FileText className="w-3 h-3 text-blue-400" />
            <span>{showTranscript ? 'Hide Transcript' : 'Show Transcript'}</span>
          </button>

          <button
            type="button"
            onClick={copyTranscript}
            title="Copy voice transcript"
            className="p-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-white cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Transcript & Clinical Action Brief */}
      {showTranscript && (
        <div className="rounded-xl bg-slate-950/80 border border-slate-800/80 p-3.5 space-y-2.5 animate-in fade-in duration-200">
          <div className="flex items-start gap-2">
            <span className="text-[10px] uppercase font-mono font-bold text-slate-500 shrink-0 mt-0.5">
              Audio Script:
            </span>
            <p className="text-xs text-slate-200 leading-relaxed font-normal">
              "{risk.speechText}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 text-[11px]">
            <div className="flex items-start gap-1.5 text-slate-300">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Pathology: </span>
                <span>{risk.neoplasticPotential}</span>
              </div>
            </div>
            <div className="flex items-start gap-1.5 text-slate-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Guideline: </span>
                <span>{risk.clinicalAction}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
