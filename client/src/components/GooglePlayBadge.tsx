import React from 'react';
import { Download } from 'lucide-react';

export const GooglePlayIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 512 512"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Google Play Logo"
    role="img"
  >
    {/* Google Play Cyan/Blue Wedge */}
    <path
      fill="#4285F4"
      d="M32.5 15.2c-5.7 6.1-9.2 15.4-9.2 27.2v427.2c0 11.8 3.5 21.1 9.2 27.2l1.4 1.4 239.3-239.3v-5.8L33.9 13.8l-1.4 1.4z"
    />
    {/* Google Play Yellow/Amber Triangle */}
    <path
      fill="#FBBC04"
      d="M352.4 316.5l-79.2-79.2v-5.8l79.2-79.2 1.8 1 93.9 53.4c26.8 15.2 26.8 40.2 0 55.4l-93.9 53.4-1.8 1z"
    />
    {/* Google Play Red Diagonal */}
    <path
      fill="#EA4335"
      d="M273.2 231.5L32.5 496.8c8.8 9.3 23.4 10.4 39.8 1.1l281.9-160.2-81-106.2z"
    />
    {/* Google Play Green Diagonal */}
    <path
      fill="#34A853"
      d="M273.2 237.3l81-106.2L72.3 14.1C55.9 4.8 41.3 5.9 32.5 15.2l240.7 222.1z"
    />
  </svg>
);

interface GooglePlayBadgeProps {
  onClick?: () => void;
  showInstallButton?: boolean;
  installLabel?: string;
  onInstallClick?: () => void;
  className?: string;
}

export const GooglePlayBadge: React.FC<GooglePlayBadgeProps> = ({
  onClick,
  showInstallButton = true,
  installLabel = 'Install App',
  onInstallClick,
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* Official Google Play Badge */}
      <button
        type="button"
        onClick={onClick || onInstallClick}
        title="Get Colorectal Polyp Diagnostic on Google Play Store"
        aria-label="Get it on Google Play"
        className="flex items-center gap-2.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-black hover:bg-slate-950 text-white border border-slate-700/90 hover:border-slate-500 shadow-md hover:shadow-cyan-500/10 transition-all cursor-pointer group active:scale-98"
      >
        <GooglePlayIcon className="w-5 h-5 shrink-0 transition-transform group-hover:scale-105" />
        <div className="text-left leading-none">
          <span className="block text-[8px] sm:text-[9px] uppercase tracking-wider text-slate-400 group-hover:text-slate-300 font-semibold">
            GET IT ON
          </span>
          <span className="block text-xs sm:text-sm font-bold text-white tracking-tight mt-0.5">
            Google Play
          </span>
        </div>
      </button>

      {/* Direct Install Option Button */}
      {showInstallButton && (
        <button
          type="button"
          onClick={onInstallClick || onClick}
          title="Direct 1-Tap Install Diagnostic App"
          aria-label="Install App"
          className="px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/25 transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{installLabel}</span>
        </button>
      )}
    </div>
  );
};
