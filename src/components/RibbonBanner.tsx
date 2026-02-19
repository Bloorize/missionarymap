"use client";

interface RibbonBannerProps {
  text?: string;
  className?: string;
}

export function RibbonBanner({ text = "Called to Serve", className = "" }: RibbonBannerProps) {
  return (
    <div className={`w-full flex justify-center ${className}`}>
      <svg
        viewBox="0 0 400 80"
        className="w-full max-w-2xl h-20 md:h-24"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="ribbonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e5c9a8" />
            <stop offset="50%" stopColor="#d4a574" />
            <stop offset="100%" stopColor="#b8956a" />
          </linearGradient>
          <linearGradient id="ribbonBorder" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c9a227" />
            <stop offset="100%" stopColor="#a67c52" />
          </linearGradient>
          <filter id="ribbonShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Main ribbon body */}
        <path
          d="M 25,45 Q 200,15 375,45 L 395,35 Q 200,65 5,35 L 25,45 Z"
          fill="url(#ribbonGradient)"
          stroke="url(#ribbonBorder)"
          strokeWidth="2"
          filter="url(#ribbonShadow)"
        />

        {/* Text */}
        <text
          x="200"
          y="42"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#5c4033"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="24"
          fontWeight="bold"
          letterSpacing="2"
        >
          {text}
        </text>
      </svg>
    </div>
  );
}
