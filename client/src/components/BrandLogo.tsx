import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textClassName?: string;
  subtitle?: string;
  subtitleClassName?: string;
  className?: string;
  imageOnly?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  textClassName = 'text-white',
  subtitle = 'Cancer Classification',
  subtitleClassName = 'text-cyan-400',
  className = '',
  imageOnly = false,
}) => {
  const iconDimensions = {
    sm: 'w-9 h-9',
    md: 'w-10 h-10 sm:w-11 sm:h-11',
    lg: 'w-12 h-12 sm:w-14 sm:h-14',
    xl: 'w-16 h-16 sm:w-20 sm:h-20',
  };

  const titleSizes = {
    sm: 'text-xs sm:text-[13px] font-black',
    md: 'text-sm sm:text-base font-black',
    lg: 'text-lg sm:text-xl font-black',
    xl: 'text-xl sm:text-2xl font-black',
  };

  const subtitleSizes = {
    sm: 'text-[9px] sm:text-[10px]',
    md: 'text-[10px] sm:text-[11px]',
    lg: 'text-xs',
    xl: 'text-xs sm:text-sm',
  };

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Official Colorectal Cancer Classification Emblem */}
      <div
        className={`relative ${iconDimensions[size]} shrink-0 rounded-full p-0.5 bg-gradient-to-tr from-blue-500 via-cyan-400 to-indigo-500 shadow-lg shadow-cyan-500/25 transition-transform duration-200 hover:scale-105 overflow-hidden`}
      >
        <img
          src="/logo.png"
          alt="Colorectal Polyp Cancer Classification Logo"
          className="w-full h-full object-cover rounded-full bg-slate-950"
          loading="eager"
        />
      </div>

      {/* Brand Typography: Colorectal Polyp Cancer Classification */}
      {showText && !imageOnly && (
        <div className="flex flex-col justify-center min-w-0">
          <div
            className={`tracking-tight leading-none drop-shadow-sm ${titleSizes[size]} ${textClassName}`}
          >
            Colorectal Polyp
          </div>
          {subtitle && (
            <div
              className={`font-bold tracking-wider uppercase truncate mt-0.5 drop-shadow-xs ${subtitleSizes[size]} ${subtitleClassName}`}
            >
              {subtitle}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
