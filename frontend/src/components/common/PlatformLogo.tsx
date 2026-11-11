import React from 'react';
import masarLogoImg from '../../assets/masar-logo.png';

interface LogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
}

export const PlatformLogo: React.FC<LogoProps> = ({
  className = '',
  size = 48,
  showText = false,
}) => {
  const numSize = typeof size === 'number' ? `${size}px` : size;

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src={masarLogoImg}
        alt="شعار منصة مسار"
        style={{ width: numSize, height: numSize }}
        className="object-contain flex-shrink-0 rounded-xl transition-transform duration-300 hover:scale-105"
      />
      {showText && (
        <div className="flex flex-col text-right">
          <span className="text-base font-black text-[#111111] dark:text-[#FFFFFF] tracking-wide leading-tight">
            مسار
          </span>
          <span className="text-[10px] text-[#FFCB74] font-bold font-mono tracking-wider">
            MASAR
          </span>
        </div>
      )}
    </div>
  );
};

export default PlatformLogo;
