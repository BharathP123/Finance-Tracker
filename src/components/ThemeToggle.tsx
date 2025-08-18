import React, { useEffect, useState } from "react";
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [pulseKey, setPulseKey] = useState(0);
  const isDark = theme === 'dark';

  useEffect(() => {
    // Set page background color dynamically
    document.body.style.backgroundColor = isDark ? 'hsl(0 0% 0%)' : 'hsl(0 0% 90%)';
  }, [isDark]);

  const handleToggle = () => {
    toggleTheme();
    setPulseKey((prev) => prev + 1);
  };

  return (
    <>
      <style>
        {`
          .socket {
            background: inherit;
            border-radius: 1.5rem;
            box-shadow: -0.05em 0.1em 0.2em -0.2em white;
          }

          .theme-button {
            background: inherit;
          }

          .socket-shadow {
            position: absolute;
            inset: 0;
            opacity: 0.5;
            border-radius: inherit;
            box-shadow: 0em 0.075em 0.1em 0em white;
            animation: ping 0.6s ease-in-out;
            pointer-events: none;
          }

          @keyframes ping {
            0% {
              transform: scale(0.95);
              opacity: 0.6;
            }
            100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }
        `}
      </style>

      <div className="socket w-11 h-10 relative flex items-center justify-center">
        <button
          onClick={handleToggle}
          className={`theme-button relative w-full h-full flex items-center justify-center transition-transform duration-300 rounded-[1.5rem] shadow-lg ${
            isDark ? "scale-95" : "scale-105"
          }`}
          title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          <div key={pulseKey} className="socket-shadow" />

          {/* Moon Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-6 h-6 z-10 transition-colors duration-500 ${
              isDark ? "text-white" : "text-zinc-800"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
            />
          </svg>
        </button>
      </div>
    </>
  );
};

export default ThemeToggle;
