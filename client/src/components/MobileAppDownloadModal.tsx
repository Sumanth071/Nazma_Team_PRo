import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  QrCode,
  CheckCircle,
  X,
  ExternalLink,
  ShieldCheck,
  Share2,
  PlusSquare,
  Sparkles,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface MobileAppDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileAppDownloadModal: React.FC<MobileAppDownloadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'android' | 'qrcode' | 'apk' | 'ios'>('android');
  const { canInstall, isInstalled, promptInstall } = usePWAInstall();

  if (!isOpen) return null;

  const liveUrl = window.location.origin;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 sm:p-7 text-left space-y-5 my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Download ColoAI Mobile App</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                PWA & APK READY
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Install native mobile diagnostic application on Android & iOS devices
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer text-center ${
              activeTab === 'android'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Android WebAPK
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('qrcode')}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer text-center ${
              activeTab === 'qrcode'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Scan QR Code
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('apk')}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer text-center ${
              activeTab === 'apk'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Play Store / APK
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer text-center ${
              activeTab === 'ios'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            iPhone / iOS
          </button>
        </div>

        {/* Tab 1: Android WebAPK Direct Install */}
        {activeTab === 'android' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 space-y-1">
                  <p className="font-bold text-white text-sm">Real-World Native Android Experience</p>
                  <p className="text-slate-400 leading-relaxed">
                    Installs directly to your Android device app drawer. Opens full-screen without Chrome browser address bars, loads instantly, and runs offline via Service Worker.
                  </p>
                </div>
              </div>

              {canInstall && !isInstalled ? (
                <button
                  type="button"
                  onClick={promptInstall}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer active:scale-98"
                >
                  <Download className="w-4 h-4" />
                  <span>Click to 1-Tap Install on this Device</span>
                </button>
              ) : isInstalled ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-center font-semibold">
                  ✓ ColoAI App is already installed on this device!
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs space-y-1.5">
                  <p className="font-semibold">To install onto your mobile phone:</p>
                  <p className="text-slate-300">
                    Open Chrome on your phone, visit <strong className="text-white underline">{liveUrl}</strong>, tap the 3 dots menu (⋮) and select <strong>"Add to Home Screen"</strong> or <strong>"Install App"</strong>.
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                <span className="block font-bold text-white">Full Screen</span>
                <span className="text-slate-400">Zero browser UI</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                <span className="block font-bold text-white">Offline Cached</span>
                <span className="text-slate-400">PWA Service Worker</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800">
                <span className="block font-bold text-white">App Icon</span>
                <span className="text-slate-400">Adaptive WebAPK</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Scan QR Code */}
        {activeTab === 'qrcode' && (
          <div className="space-y-4 text-center animate-in fade-in duration-150">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center space-y-3">
              <div className="p-3 bg-white rounded-2xl shadow-xl">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    liveUrl
                  )}`}
                  alt="ColoAI App Mobile QR Code"
                  className="w-44 h-44 object-contain"
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-white">Scan with Android Camera or iPhone</p>
                <p className="text-[11px] text-slate-400 max-w-xs">
                  Instantly opens the diagnostic platform on your smartphone ready for 1-tap installation.
                </p>
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 break-all">
              Live URL: <span className="text-cyan-400 font-semibold">{liveUrl}</span>
            </div>
          </div>
        )}

        {/* Tab 3: Play Store & Standalone APK */}
        {activeTab === 'apk' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-slate-300">
                  <h4 className="font-bold text-white text-sm">Google Play Store & Standalone APK Package</h4>
                  <p className="text-slate-400 leading-relaxed">
                    ColoAI is 100% compliant with Google's Trusted Web Activity (TWA) and Microsoft PWABuilder specifications for Google Play Store packaging.
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 space-y-2 text-[11px] text-slate-300">
                <div className="font-semibold text-white">How to generate `.apk` / `.aab` for your Guide or Play Store:</div>
                <ol className="list-decimal list-inside space-y-1 text-slate-400">
                  <li>Visit <strong className="text-emerald-400">pwabuilder.com</strong> on your computer.</li>
                  <li>Paste the live URL: <code className="text-white bg-slate-950 px-1 py-0.5 rounded">{liveUrl}</code></li>
                  <li>Click <strong>"Package for Android"</strong>.</li>
                  <li>Download the signed <strong className="text-white">ColoAI-Polyp-Diagnostic.apk</strong> to share directly or submit to Google Play Console!</li>
                </ol>
              </div>

              <a
                href={`https://www.pwabuilder.com?url=${encodeURIComponent(liveUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open PWABuilder to Package Android APK</span>
              </a>
            </div>
          </div>
        )}

        {/* Tab 4: iOS Instructions */}
        {activeTab === 'ios' && (
          <div className="space-y-4 animate-in fade-in duration-150 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <h4 className="font-bold text-white">Apple iPhone / iPad Installation:</h4>
              <ol className="space-y-2.5 text-slate-300">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-emerald-400 shrink-0">
                    1
                  </span>
                  <span>
                    Open <strong className="text-white">Safari</strong> on your iPhone and visit the live URL.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-emerald-400 shrink-0">
                    2
                  </span>
                  <span>
                    Tap the <strong>Share</strong> button{' '}
                    <Share2 className="w-3.5 h-3.5 inline text-blue-400 mx-1" /> in the bottom navigation bar.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-emerald-400 shrink-0">
                    3
                  </span>
                  <span>
                    Select <strong>Add to Home Screen</strong>{' '}
                    <PlusSquare className="w-3.5 h-3.5 inline text-slate-300 mx-1" /> and tap <strong>Add</strong>.
                  </span>
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
