import React from 'react';
import { ArrowLeft, MoreVertical } from 'lucide-react';

interface StickyTopBarProps {
  title: string;
  onBack: () => void;
  hasHistory: boolean;
  actions?: React.ReactNode;
}

const StickyTopBar: React.FC<StickyTopBarProps> = ({ 
  title, 
  onBack, 
  hasHistory, 
  actions 
}) => {
  return (
    <div className="sticky top-14 bg-white dark:bg-gray-800 z-30 border-b border-gray-200 dark:border-gray-700 md:hidden transition-colors duration-200">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 active:text-blue-800 dark:active:text-blue-200 transition-colors duration-200 group min-h-[44px] min-w-[44px] -ml-2 pl-2"
        >
          <ArrowLeft className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-0.5 group-active:scale-95" />
          <span className="font-medium text-sm">Back</span>
        </button>

        {/* Title */}
        <div className="flex-1 text-center px-4">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate" style={{ fontSize: '16px', lineHeight: '1.2' }}>
            {title}
          </h1>
        </div>

        {/* Actions or Spacer */}
        <div className="flex items-center space-x-2 min-w-[44px] justify-end">
          {actions || <div className="w-10" />}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 animate-slideIn"></div>
    </div>
  );
};

export default StickyTopBar;