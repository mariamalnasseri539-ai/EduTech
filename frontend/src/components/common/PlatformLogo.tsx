import React from 'react';

interface LogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
}

export const PlatformLogo: React.FC<LogoProps> = ({
  className = "",
  size = 48,
  showText = false
}) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 800"
        width={size}
        height={size}
        className="flex-shrink-0 transition-transform duration-300 hover:scale-105"
      >
        <defs>
          {/* Circular Clip Path so nothing protrudes outside the badge */}
          <clipPath id="logo-circle-clip">
            <circle cx="400" cy="400" r="378" />
          </clipPath>
        </defs>

        {/* Base Background Circle */}
        <circle cx="400" cy="400" r="380" fill="#111111" stroke="#2F2F2F" strokeWidth="8" />

        {/* Group clipped strictly inside the circular badge */}
        <g clipPath="url(#logo-circle-clip)">
          {/* Subtle Tech & Data Circuit Rings */}
          <circle cx="400" cy="400" r="350" fill="none" stroke="#2F2F2F" strokeDasharray="6,12" strokeWidth="2" />
          <circle cx="400" cy="400" r="320" fill="none" stroke="#2F2F2F" strokeWidth="1.5" />
          <path d="M 400,20 A 380,380 0 0,1 780,400" fill="none" stroke="#FFCB74" strokeWidth="2" opacity="0.35" />
          <path d="M 400,780 A 380,380 0 0,1 20,400" fill="none" stroke="#FFCB74" strokeWidth="2" opacity="0.35" />
          <circle cx="400" cy="80" r="5" fill="#FFCB74" />
          <circle cx="720" cy="400" r="5" fill="#FFCB74" />

          {/* The Smart Code & Progress Board */}
          <g transform="translate(260, 160)">
            <rect width="360" height="240" rx="20" fill="#2F2F2F" stroke="#FFCB74" strokeWidth="4" />
            <rect x="10" y="10" width="340" height="220" rx="12" fill="#181818" />

            {/* Dashboard Code & Metrics */}
            <path d="M 25,35 L 35,25 L 25,15 M 40,35 L 50,35" fill="none" stroke="#FFCB74" strokeWidth="3" strokeLinecap="round" />
            <line x1="65" y1="25" x2="160" y2="25" stroke="#F6F6F6" strokeDasharray="5,5" strokeWidth="3" opacity="0.5" />
            <line x1="25" y1="60" x2="140" y2="60" stroke="#FFCB74" strokeWidth="4" strokeLinecap="round" />
            <line x1="25" y1="80" x2="110" y2="80" stroke="#F6F6F6" strokeWidth="3" strokeLinecap="round" opacity="0.8" />

            {/* Progression Graph */}
            <circle cx="280" cy="70" r="14" fill="none" stroke="#FFCB74" strokeWidth="3" />
            <path d="M 180,180 L 220,130 L 260,150 L 320,100" fill="none" stroke="#FFCB74" strokeWidth="4" strokeLinejoin="round" />
            <circle cx="180" cy="180" r="5" fill="#FFCB74" />
            <circle cx="220" cy="130" r="5" fill="#F6F6F6" />
            <circle cx="260" cy="150" r="5" fill="#FFCB74" />
            <circle cx="320" cy="100" r="7" fill="#FFCB74" />
          </g>

          {/* AI Tutor Robot with Teaching Stick */}
          <g id="tutor-robot">
            <ellipse cx="620" cy="560" rx="28" ry="10" fill="#FFCB74" opacity="0.4" />
            <path d="M 590,555 L 620,585 L 650,555 Z" fill="#FFCB74" opacity="0.8" />

            {/* Pointing Arm & Teacher Stick */}
            <path d="M 570,440 Q 470,410 440,380" fill="none" stroke="#2F2F2F" strokeWidth="14" strokeLinecap="round" />
            <path d="M 570,440 Q 470,410 440,380" fill="none" stroke="#F6F6F6" strokeWidth="8" strokeLinecap="round" />
            <circle cx="440" cy="380" r="9" fill="#2F2F2F" />
            <circle cx="440" cy="380" r="5" fill="#FFCB74" />

            {/* Pointer Stick */}
            <line x1="445" y1="385" x2="330" y2="280" stroke="#FFCB74" strokeWidth="8" strokeLinecap="round" />

            {/* Robot Torso */}
            <path d="M 550,450 C 550,550 690,550 690,450 Z" fill="#F6F6F6" stroke="#2F2F2F" strokeWidth="4" />
            <rect x="580" y="440" width="80" height="80" rx="40" fill="#2F2F2F" />
            <circle cx="620" cy="480" r="14" fill="#FFCB74" />

            {/* Robot Head & Face Screen */}
            <rect x="605" y="385" width="30" height="25" rx="5" fill="#2F2F2F" />
            <rect x="540" y="280" width="160" height="120" rx="60" fill="#F6F6F6" stroke="#2F2F2F" strokeWidth="4" />
            <rect x="560" y="295" width="120" height="80" rx="40" fill="#2F2F2F" />
            <ellipse cx="595" cy="330" rx="14" ry="8" fill="#FFCB74" />
            <ellipse cx="645" cy="330" rx="14" ry="8" fill="#FFCB74" />
            <path d="M 610,355 Q 620,365 630,355" fill="none" stroke="#FFCB74" strokeWidth="4" strokeLinecap="round" />
            <rect x="525" y="320" width="15" height="40" rx="7" fill="#FFCB74" />
            <rect x="700" y="320" width="15" height="40" rx="7" fill="#FFCB74" />
            <line x1="620" y1="280" x2="620" y2="255" stroke="#2F2F2F" strokeWidth="4" />
            <circle cx="620" cy="250" r="8" fill="#FFCB74" />
          </g>

          {/* Young Adult Student (Faceless Silhouette - شخص بدون ملامح متصل انسيابياً بالرقبة والجسد) */}
          <g id="faceless-student">
            {/* Backpack on the left */}
            <path d="M 125,450 Q 85,460 92,600 Q 105,670 145,640 Z" fill="#202020" stroke="#111111" strokeWidth="4" />
            <path d="M 148,460 L 140,580" stroke="#FFCB74" strokeWidth="5" strokeLinecap="round" opacity="0.6" />

            {/* Torso & Hoodie (Seamlessly connected shoulders) */}
            <path
              d="M 120,780 L 120,530 C 120,445 165,420 200,420 L 220,420 C 255,420 300,445 300,530 L 300,780 Z"
              fill="#2A2A2A"
              stroke="#111111"
              strokeWidth="4"
            />
            {/* Hoodie Collar Detail & Golden Accent */}
            <path d="M 180,425 Q 210,470 240,425" fill="#1E1E1E" stroke="#FFCB74" strokeWidth="3" />
            <path d="M 170,540 Q 210,575 250,540" fill="none" stroke="#F6F6F6" strokeWidth="2" opacity="0.4" />

            {/* Continuous Neck (Firmly connects chin to hoodie with NO gaps) */}
            <path
              d="M 194,340 L 194,435 L 226,435 L 226,340 Z"
              fill="#F9C29D"
            />
            {/* Subtle soft jaw shadow for realistic depth */}
            <path d="M 194,360 Q 210,375 226,360 L 226,375 Q 210,388 194,375 Z" fill="#E2A682" opacity="0.5" />

            {/* Arm & Smart Tablet */}
            <path d="M 130,530 Q 170,630 215,630" fill="none" stroke="#252525" strokeWidth="26" strokeLinecap="round" />
            <circle cx="215" cy="630" r="13" fill="#F9C29D" />

            {/* Futuristic Learning Tablet */}
            <g transform="translate(205, 560) rotate(12)">
              <rect width="64" height="92" rx="8" fill="#111111" stroke="#F6F6F6" strokeWidth="3" />
              <rect x="5" y="5" width="54" height="82" rx="5" fill="#202020" />
              <line x1="12" y1="18" x2="42" y2="18" stroke="#FFCB74" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="12" y1="28" x2="48" y2="28" stroke="#F6F6F6" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <line x1="12" y1="38" x2="36" y2="38" stroke="#F6F6F6" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <path d="M 12,65 L 24,52 L 34,58 L 46,45" fill="none" stroke="#FFCB74" strokeWidth="2" strokeLinecap="round" />
            </g>
            <circle cx="270" cy="610" r="13" fill="#F9C29D" />

            {/* Faceless Head Shape (100% بدون ملامح نهائياً - لا عينين ولا أنف ولا فم) */}
            <ellipse cx="210" cy="320" rx="42" ry="50" fill="#F9C29D" stroke="#111111" strokeWidth="3.5" />

            {/* Modern Hair Silhouette */}
            <path
              d="M 166,310 C 166,230 254,230 254,295 C 248,260 228,245 204,248 C 182,250 172,272 166,310 Z"
              fill="#2B1E16"
              stroke="#111111"
              strokeWidth="2.5"
            />

            {/* Modern EdTech Headphones */}
            <path d="M 162,315 C 162,230 258,230 258,315" fill="none" stroke="#FFCB74" strokeWidth="8" strokeLinecap="round" />
            <rect x="154" y="298" width="14" height="30" rx="7" fill="#2F2F2F" stroke="#FFCB74" strokeWidth="3" />
            <rect x="252" y="298" width="14" height="30" rx="7" fill="#2F2F2F" stroke="#FFCB74" strokeWidth="3" />
          </g>
        </g>
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-lg leading-tight text-[#111111] dark:text-[#F6F6F6]">
            Adaptive<span className="text-[#FFCB74]">Learn</span>
          </span>
          <span className="text-xs text-gray-400 font-mono tracking-wider">
            AI EDTECH
          </span>
        </div>
      )}
    </div>
  );
};

export default PlatformLogo;
