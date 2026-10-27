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
        {/* Base Background Circle */}
        <circle cx="400" cy="400" r="380" fill="#111111" stroke="#2F2F2F" strokeWidth="8" />

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

        {/* Young Adult Student with Tablet */}
        <g id="adult-student">
          {/* Backpack */}
          <path d="M 120,440 Q 90,440 95,580 Q 110,650 150,620 Z" fill="#2F2F2F" stroke="#111111" strokeWidth="3" />

          {/* Torso & Hoodie */}
          <path d="M 140,780 L 140,540 C 140,460 270,440 290,540 L 290,780 Z" fill="#2F2F2F" stroke="#111111" strokeWidth="4" />
          <path d="M 175,540 Q 215,580 255,540" fill="none" stroke="#F6F6F6" strokeWidth="2" />

          {/* Arm & Smart Tablet */}
          <path d="M 140,540 Q 180,630 220,630" fill="none" stroke="#2F2F2F" strokeWidth="28" strokeLinecap="round" />
          <circle cx="220" cy="630" r="14" fill="#F9C29D" />

          <g transform="translate(210, 580) rotate(15)">
            <rect width="60" height="90" rx="8" fill="#111111" stroke="#F6F6F6" strokeWidth="3" />
            <rect x="4" y="4" width="52" height="82" rx="4" fill="#2F2F2F" />
            <path d="M 10,15 L 50,45" stroke="#FFCB74" strokeWidth="2" opacity="0.7" />
          </g>
          <circle cx="275" cy="620" r="14" fill="#F9C29D" />

          {/* Mature Head, Hair & Headphones */}
          <rect x="195" y="420" width="40" height="50" rx="5" fill="#F9C29D" stroke="#111111" strokeWidth="3" />
          <path d="M 160,320 C 160,240 260,240 260,320 C 260,390 160,390 160,320 Z" fill="#F9C29D" stroke="#111111" strokeWidth="4" />
          <path d="M 155,300 Q 170,230 240,240 Q 275,250 265,310 Q 250,290 220,290 Q 190,285 170,310 Z" fill="#4A3728" stroke="#111111" strokeWidth="3" />
          <ellipse cx="215" cy="315" rx="4" ry="6" fill="#111111" />
          <ellipse cx="250" cy="313" rx="4" ry="6" fill="#111111" />
          <path d="M 215,345 Q 235,365 250,342" fill="none" stroke="#111111" strokeWidth="4" strokeLinecap="round" />

          {/* Modern Headset */}
          <path d="M 150,320 Q 150,380 205,395" fill="none" stroke="#FFCB74" strokeWidth="8" strokeLinecap="round" />
          <circle cx="150" cy="320" r="15" fill="#2F2F2F" stroke="#FFCB74" strokeWidth="3" />
          <circle cx="265" cy="320" r="10" fill="#2F2F2F" stroke="#FFCB74" strokeWidth="2" />
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
