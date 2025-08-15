import React from "react";
import WeeklyStats from "./sections/WeeklyStats";
import RecentActivities from "./sections/RecentActivities";
import { Activity, ActivitySession, DashboardStats } from "../../types/dashboard";

interface DashboardStatsProps {
  stats: DashboardStats;
  activities: Activity[];
  recentActivitySessions: ActivitySession[];
}

const DashboardStatsComponent: React.FC<DashboardStatsProps> = ({
  stats,
  activities,
  recentActivitySessions,
}) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-md p-5">
      <WeeklyStats stats={stats} activitiesCount={activities.length} />
      <RecentActivities
        sessions={recentActivitySessions}
        activities={activities}
      />
    </div>
  );
};

export default DashboardStatsComponent;
