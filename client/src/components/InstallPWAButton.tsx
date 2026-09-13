import React from 'react';
import { Download, Smartphone, X, Share2, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallPWAButtonProps {
  variant?: 'navbar' | 'banner' | 'card';
  className?: string;
}

export const InstallPWAButton: React.FC<InstallPWAButtonProps> = ({ variant = 'navbar', className = '' }) => {
  const { canInstall, isInstalled, showIOSModal, setShowIOSModal, promptInstall, isIOS } = usePWAInstall();

  if (isInstalled || !canInstall) {
    return null;
  }

  return (
    <>
      {variant === 'navbar' && (
        <button
          type="button"
          onClick={promptInstall}
          title="Install ColoAI Diagnostic App on your device"
          aria-label="Install ColoAI App"
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 border border-emerald-500/40 text-emerald-600 dark:text-emerald-300 font-semibold text-xs transition-all shadow-xs active:scale-95 animate-pulse duration-1000 ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
          <span className="hidden sm:inline">Install App</span>
        </button>
      )}

      {variant === 'banner' && (
        <div className={`p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/90 to-cyan-50/60 dark:from-[#082026]/90 dark:via-[#091f2c]/80 dark:to-[#0d1838]/90 border border-emerald-200/90 dark:border-emerald-500/40 flex items-center justify-between gap-3 shadow-xs dark:shadow-lg transition-all ${className}`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/10 dark:bg-emerald-500/20 flex items-center justify-center border border-emerald-600/20 dark:border-emerald-500/30 shrink-0">
              <Smartphone className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">Install ColoAI Mobile App</p>
              <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 truncate">Launch fullscreen from your home screen</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={promptInstall}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-400 dark:hover:bg-emerald-300 text-white dark:text-slate-950 font-bold text-xs transition-all shadow-sm hover:shadow active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Install
            </button>
          </div>
        </div>
      )}

      {/* iOS Instructions Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-left relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Install on iPhone / iPad</h4>
                <p className="text-xs text-slate-400">Add ColoAI to your Home Screen</p>
              </div>
            </div>

            <ol className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-emerald-400 shrink-0">1</span>
                <span>In Safari, tap the <strong>Share</strong> button <Share2 className="w-3.5 h-3.5 inline text-blue-400 mx-1" /> in the bottom bar.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-emerald-400 shrink-0">2</span>
                <span>Scroll down and select <strong>Add to Home Screen</strong> <PlusSquare className="w-3.5 h-3.5 inline text-slate-300 mx-1" />.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-emerald-400 shrink-0">3</span>
                <span>Tap <strong>Add</strong> in the top-right corner.</span>
              </li>
            </ol>

            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-6 w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
