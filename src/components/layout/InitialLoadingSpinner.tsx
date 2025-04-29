// src/components/layout/InitialLoadingSpinner.tsx
'use client';

import * as React from 'react';

// Simple Cricket-themed SVG Spinner
const CricketSpinner = () => (
    <svg
        width="80"
        height="80"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary animate-spin-slow" // Custom slow spin animation
        style={{ animationDuration: '2s' }} // Control speed via style
    >
        {/* Cricket Bat */}
        <g transform="rotate(45 50 50)">
            <rect x="46" y="15" width="8" height="40" rx="3" fill="currentColor" /> {/* Handle */}
            <path d="M42 55 h16 l5 15 h-26 z" fill="currentColor" /> {/* Blade */}
        </g>
        {/* Cricket Ball */}
        <circle cx="75" cy="25" r="8" fill="hsl(var(--accent))" />
         {/* Dashed circle for effect */}
        <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="2" strokeDasharray="5 5">
            <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="0 50 50"
                to="360 50 50"
                dur="5s" // Slower rotation for the dashed circle
                repeatCount="indefinite"
            />
        </circle>
    </svg>
);


export default function InitialLoadingSpinner() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm">
      <CricketSpinner />
      <p className="mt-4 text-lg font-semibold text-primary animate-pulse">Getting things ready...</p>
    </div>
  );
}

// Add custom animation to globals.css or tailwind.config.js if needed
// Example for tailwind.config.js:
/*
 theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    }
 }
*/

// Or add keyframes directly in globals.css:
/*
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin-slow {
  animation: spin-slow 2s linear infinite;
}
*/