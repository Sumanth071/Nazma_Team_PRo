import React, { useState } from 'react';
import {
  ZoomIn,
  Scan,
  Layers,
  Crosshair,
  Eye,
  Info,
  Maximize2,
  SlidersHorizontal,
} from 'lucide-react';

interface ZoomPatch {
  id: string;
  name: string;
  shortName: string;
  magnification: string;
  scale: number;
  originX: number; // percentage 0-100
  originY: number; // percentage 0-100
  clinicalStandard: string;
  pathologyObservation: string;
  diagnosticSignificance: string;
  colorScheme: {
    border: string;
    badge: string;
    glow: string;
  };
}

interface MicroscopicZoomInspectionProps {
  imageUrl: string;
  className?: string;
  predictedClass?: string;
}

const DEFAULT_PATCHES: ZoomPatch[] = [
  {
    id: 'patch-crypt',
    name: 'Mucosal Crypt & Pit Pattern',
    shortName: 'Glandular Crypts',
    magnification: '3.5x Optical Zoom',
    scale: 3.5,
    originX: 48,
    originY: 52,
    clinicalStandard: 'Kudo Pit Pattern (Types III-V)',
    pathologyObservation: 'Tubular elongation and glandular orifice branching with crypt lumen distortion.',
    diagnosticSignificance: 'Primary indicator of adenomatous neoplastic dysplasia vs benign hyperplasia.',
    colorScheme: {
      border: 'border-cyan-500/50 hover:border-cyan-400',
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      glow: 'shadow-cyan-500/20',
    },
  },
  {
    id: 'patch-vessels',
    name: 'Microvascular Capillary Loops',
    shortName: 'Vascular Network',
    magnification: '3.0x Optical Zoom',
    scale: 3.0,
    originX: 58,
    originY: 42,
    clinicalStandard: 'NICE / Sano Criteria',
    pathologyObservation: 'Sub-epithelial capillary density enhancement with micro-vessel irregularity.',
    diagnosticSignificance: 'Differentiates between superficial benign vessels and neoplastic proliferation.',
    colorScheme: {
      border: 'border-blue-500/50 hover:border-blue-400',
      badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      glow: 'shadow-blue-500/20',
    },
  },
  {
    id: 'patch-margin',
    name: 'Lesion Margin & Demarcation Line',
    shortName: 'Boundary Margin',
    magnification: '2.5x Optical Zoom',
    scale: 2.5,
    originX: 36,
    originY: 60,
    clinicalStandard: 'Paris / Demarcation Line',
    pathologyObservation: 'Sharp mucosal demarcation boundary distinguishing lesion base from normal bowel wall.',
    diagnosticSignificance: 'Crucial for assessing complete endo-mucosal resection (EMR) margins.',
    colorScheme: {
      border: 'border-emerald-500/50 hover:border-emerald-400',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      glow: 'shadow-emerald-500/20',
    },
  },
];

export const MicroscopicZoomInspection: React.FC<MicroscopicZoomInspectionProps> = ({
  imageUrl,
  className = '',
  predictedClass = 'Adenomatous Polyp',
}) => {
  const [selectedPatch, setSelectedPatch] = useState<ZoomPatch>(DEFAULT_PATCHES[0]);
  const [nbiEnhancement, setNbiEnhancement] = useState(false);
  const [reticleVisible, setReticleVisible] = useState(true);

  // NBI filter simulated enhancement (Narrow Band Imaging cyan/blue hemoglobin filter)
  const filterStyle = nbiEnhancement
    ? 'contrast(140%) brightness(95%) hue-rotate(140deg) saturate(130%)'
    : 'none';

  return (
    <div className={`space-y-4 rounded-2xl bg-[#0c1326] border border-slate-800 p-5 shadow-xl ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <ZoomIn className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                3-Region Microscopic Zoom Inspection
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold">
                CLINICAL ROI HUD
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              High-magnification optical crops demonstrating microscopic polyp diagnostic markers
            </p>
          </div>
        </div>

        {/* Enhancement Toggles */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setNbiEnhancement(!nbiEnhancement)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              nbiEnhancement
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-sm shadow-cyan-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Narrow Band Imaging (NBI) simulation filter"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>NBI Spectral Filter: {nbiEnhancement ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => setReticleVisible(!reticleVisible)}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              reticleVisible
                ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
            title="Toggle targeting crosshairs"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3 Zoomed Preview Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {DEFAULT_PATCHES.map((patch, idx) => {
          const isSelected = selectedPatch.id === patch.id;

          return (
            <div
              key={patch.id}
              onClick={() => setSelectedPatch(patch)}
              className={`group relative rounded-2xl border-2 transition-all cursor-pointer overflow-hidden p-3 bg-slate-950/80 ${
                isSelected
                  ? `${patch.colorScheme.border} shadow-lg ${patch.colorScheme.glow} ring-1 ring-blue-500/50`
                  : 'border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              {/* Card Title & Magnification Tag */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-mono font-bold text-slate-300">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-white truncate max-w-[140px]">
                    {patch.shortName}
                  </span>
                </div>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md border ${patch.colorScheme.badge}`}>
                  {patch.magnification.split(' ')[0]}
                </span>
              </div>

              {/* Zoomed Image Container */}
              <div className="relative w-full h-36 rounded-xl overflow-hidden bg-black border border-slate-800/80 flex items-center justify-center">
                <div
                  className="w-full h-full transition-transform duration-500 ease-out"
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundPosition: `${patch.originX}% ${patch.originY}%`,
                    backgroundSize: `${patch.scale * 100}%`,
                    backgroundRepeat: 'no-repeat',
                    filter: filterStyle,
                  }}
                />

                {/* Reticle HUD overlay */}
                {reticleVisible && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-12 h-12 border border-cyan-400/60 rounded-full flex items-center justify-center animate-pulse">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                    </div>
                    {/* Corner targeting brackets */}
                    <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400/70" />
                    <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400/70" />
                    <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400/70" />
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400/70" />
                  </div>
                )}

                <div className="absolute bottom-1.5 left-2 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-cyan-300 border border-cyan-500/30">
                  {patch.originX}% X / {patch.originY}% Y
                </div>
              </div>

              {/* Clinical Standard Note */}
              <div className="mt-2 text-[11px] text-slate-400 line-clamp-1">
                <strong className="text-slate-300 font-semibold">{patch.clinicalStandard}:</strong>{' '}
                {patch.pathologyObservation}
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Focal Detail Panel */}
      <div className="rounded-xl bg-slate-950/90 border border-slate-800/80 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-blue-400 uppercase">
              Selected Focal Patch:
            </span>
            <span className="text-sm font-bold text-white">{selectedPatch.name}</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${selectedPatch.colorScheme.badge}`}>
              {selectedPatch.magnification}
            </span>
          </div>

          <span className="text-[11px] text-slate-400 font-mono">
            Clinical Standard: <strong className="text-slate-200">{selectedPatch.clinicalStandard}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-800/60">
          <div className="space-y-1">
            <span className="text-slate-400 font-medium">Pathological Observation:</span>
            <p className="text-slate-200 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              {selectedPatch.pathologyObservation}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 font-medium">Diagnostic Significance ({predictedClass}):</span>
            <p className="text-slate-200 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              {selectedPatch.diagnosticSignificance}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
