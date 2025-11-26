import React from 'react';

interface AristotelesProps {
  emotion?: 'happy' | 'thinking' | 'excited';
  className?: string;
}

export const Aristoteles: React.FC<AristotelesProps> = ({ emotion = 'happy', className = '' }) => {
  return (
    <div className={`relative ${className} animate-float`}>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-2xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Antenna */}
        <line x1="100" y1="50" x2="100" y2="20" stroke="#EF4444" strokeWidth="4" />
        <circle cx="100" cy="20" r="8" fill="#EF4444" className="animate-pulse" />

        {/* Head */}
        <rect x="50" y="50" width="100" height="80" rx="20" fill="#FFFFFF" stroke="#F97316" strokeWidth="4" />
        
        {/* Screen/Face */}
        <rect x="60" y="60" width="80" height="50" rx="10" fill="#333333" />
        
        {/* Eyes */}
        {emotion === 'thinking' ? (
           <>
             <circle cx="80" cy="80" r="6" fill="#FACC15" />
             <line x1="110" y1="80" x2="130" y2="80" stroke="#FACC15" strokeWidth="3" />
           </>
        ) : emotion === 'excited' ? (
           <>
             <path d="M 75 85 Q 80 75 85 85" stroke="#FACC15" strokeWidth="3" fill="none" />
             <path d="M 115 85 Q 120 75 125 85" stroke="#FACC15" strokeWidth="3" fill="none" />
           </>
        ) : (
           <>
             <circle cx="80" cy="80" r="8" fill="#FACC15" />
             <circle cx="120" cy="80" r="8" fill="#FACC15" />
           </>
        )}

        {/* Mouth */}
        <path d="M 85 95 Q 100 105 115 95" stroke="#FACC15" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Body */}
        <path d="M 60 140 L 140 140 L 130 190 L 70 190 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="3" />
        
        {/* Details */}
        <circle cx="100" cy="165" r="15" fill="#FFFFFF" opacity="0.8" />
        <path d="M 95 165 L 105 165 M 100 160 L 100 170" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
        
        {/* Arms */}
        <path d="M 60 150 Q 30 160 40 180" stroke="#9CA3AF" strokeWidth="8" strokeLinecap="round" />
        <path d="M 140 150 Q 170 160 160 180" stroke="#9CA3AF" strokeWidth="8" strokeLinecap="round" />
      </svg>
    </div>
  );
};