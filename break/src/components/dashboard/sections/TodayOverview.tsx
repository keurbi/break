import React from "react";
import StatsCard from "../cards/StatsCard";
import { DashboardStats } from "../../../types/dashboard";

interface TodayOverviewProps {
  stats: DashboardStats;
}

const TodayOverview: React.FC<TodayOverviewProps> = ({ stats }) => {
  return (
    <div className="mb-7">
      <div className="flex items-center mb-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-1 h-7 rounded-full mr-3"></div>
            <h2 className="text-xl font-bold text-gray-800">
              📊 Vue d’ensemble aujourd’hui
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Pauses"
          icon="⏱️"
          value={stats.totalPauses}
          subtitle={`${stats.totalMinutes} min total`}
          colorScheme="blue"
        />
        <StatsCard
          title="Activités"
          icon="🎯"
          value={stats.todayActivities.length}
          subtitle={`${stats.todayActivities.reduce(
            (sum, a) => sum + a.duration,
            0
          )} min total`}
          colorScheme="green"
        />
        <StatsCard
          title="Durée moy."
          icon="📏"
          value={stats.avgMinutes}
          subtitle="min/pause"
          colorScheme="purple"
        />
        <StatsCard
          title="Concentration"
          icon="🧠"
          value={stats.avgConcentration.toFixed(1)}
          subtitle="/10 moy."
          colorScheme="orange"
        />
      </div>
    </div>
  );
};

export default TodayOverview;
