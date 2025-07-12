import React from 'react';
import SmartSummaryCard from './SmartSummaryCard';
import TodaysSnapshot from './TodaysSnapshot';
import QuickActions from './QuickActions';
import SmartAlertCard from './SmartAlertCard';
import ActivityFeed from './ActivityFeed';

interface EnhancedDashboardProps {
  onFeatureSelect: (feature: string) => void;
}

const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({ onFeatureSelect }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Smart Summary Card */}
      <SmartSummaryCard />

      {/* Today's Snapshot and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodaysSnapshot />
        <QuickActions
          onAddTransaction={() => onFeatureSelect('dashboard')}
          onAddRecurring={() => onFeatureSelect('recurring')}
          onAddGoal={() => onFeatureSelect('goals')}
          onTransfer={() => onFeatureSelect('transfers')}
          onViewInsights={() => onFeatureSelect('insights')}
          onExport={() => onFeatureSelect('export')}
        />
      </div>

      {/* Smart Alert Card */}
      <SmartAlertCard />

      {/* Activity Feed */}
      <ActivityFeed />
    </div>
  );
};

export default EnhancedDashboard;