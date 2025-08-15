import React from "react";
import TodayOverview from "./sections/TodayOverview";
import WellBeingImpact from "./sections/WellBeingImpact";
import { DashboardStats } from "../../types/dashboard";

interface DashboardOverviewProps {
  stats: DashboardStats;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ stats }) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-md p-5">
      <TodayOverview stats={stats} />
      <WellBeingImpact stats={stats} />
    </div>
  );
};

export default DashboardOverview;
