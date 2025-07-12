import React from 'react';
import { getCategoryColor, getCategoryEmoji, getCategoryDisplayName } from '../utils/categoryColors';

interface CategoryBadgeProps {
  categoryId: string;
  showEmoji?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ 
  categoryId, 
  showEmoji = true, 
  size = 'sm',
  className = '' 
}) => {
  const categoryInfo = getCategoryColor(categoryId);
  const emoji = getCategoryEmoji(categoryId);
  const displayName = getCategoryDisplayName(categoryId);

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`inline-flex items-center space-x-1 rounded-full font-medium border ${categoryInfo.color} ${sizeClasses[size]} ${className}`}>
      {showEmoji && <span>{emoji}</span>}
      <span>{displayName}</span>
    </span>
  );
};

export default CategoryBadge;