import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textClassName?: string;
  subtitle?: string;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  textClassName = '',
  subtitle = 'Precision Endoscopy AI',
  className = '',
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8 sm:w-10 sm:h-10',
    lg: 'w-10 h-10 sm:w-12 sm:h-12',
    xl: 'w-13 h-13 sm:w-16 sm:h-16',
  };

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-base sm:text-xl',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-2xl sm:text-3xl',
  };

  const subtitleSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px] sm:text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  return (
    <div className={`flex items-center gap-2 sm:gap-3 select-none ${className}`}>
      {/* High-Tech Medical Cross & Neural AI Logo Mark */}
      <div className={`relative ${iconDimensions[size]} shrink-0 shadow-lg shadow-emerald-500/25 transition-transform duration-200 hover:scale-105`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          <defs>
            <linearGradient id="brandGradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="55%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Squircle Background */}
          <rect width="48" height="48" rx="13" fill="url(#brandGradient)" />
          
          {/* Diagnostic Optical Ring */}
          <circle cx="24" cy="24" r="16.5" stroke="rgba(255,255,255,0.28)" strokeWidth="1.2" strokeDasharray="3 2" />

          {/* Medical Cross Arms */}
          <rect x="20.5" y="10.5" width="7" height="27" rx="3.5" fill="white" filter="url(#softGlow)" />
          <rect x="10.5" y="20.5" width="27" height="7" rx="3.5" fill="white" filter="url(#softGlow)" />

          {/* Center Neural Core Node */}
          <circle cx="24" cy="24" r="4.2" fill="#0284c7" />
          <circle cx="24" cy="24" r="2" fill="white" />

          {/* Neural Synapse Terminals */}
          <circle cx="24" cy="11" r="2.2" fill="#a7f3d0" />
          <circle cx="24" cy="37" r="2.2" fill="#a7f3d0" />
          <circle cx="11" cy="24" r="2.2" fill="#bae6fd" />
          <circle cx="37" cy="24" r="2.2" fill="#bae6fd" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col justify-center min-w-0">
          <div className={`font-extrabold tracking-tight leading-tight flex items-center ${titleSizes[size]} ${textClassName || 'text-white'}`}>
            <span>Polyp</span>
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent font-black">AI</span>
          </div>
          {subtitle && (
            <div className={`text-slate-300 dark:text-slate-400 font-medium tracking-wide truncate ${subtitleSizes[size]}`}>
              {subtitle}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
