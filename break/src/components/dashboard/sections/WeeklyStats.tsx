import React from "react";
import { DashboardStats } from "../../../types/dashboard";

interface WeeklyStatsProps {
  stats: DashboardStats;
  activitiesCount: number;
}

const WeeklyStats: React.FC<WeeklyStatsProps> = ({ stats, activitiesCount }) => {
  return (
    <div className="mb-7">
      <div className="flex items-center mb-4">
        <div className="bg-gradient-to-r from-green-500 to-teal-500 w-1 h-7 rounded-full mr-3"></div>
        <h2 className="text-xl font-bold text-gray-800">
          📈 Résumé de la semaine
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-5 border border-blue-200">
          <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
            <span className="mr-2">⏱️</span>
            Pauses cette semaine
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Total des pauses</span>
              <span className="font-bold text-blue-900">
                {stats.weekTotalPauses}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Temps total</span>
              <span className="font-bold text-blue-900">
                {stats.weekTotalMinutes} min
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">Moyenne/jour</span>
              <span className="font-bold text-blue-900">
                {Math.round(stats.weekTotalPauses / 7)} pauses
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-5 border border-green-200">
          <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center">
            <span className="mr-2">🎯</span>
            Activités cette semaine
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-green-700">Total activités</span>
              <span className="font-bold text-green-900">
                {stats.weekActivities.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-green-700">Temps total</span>
              <span className="font-bold text-green-900">
                {stats.weekActivities.reduce(
                  (sum, a) => sum + a.duration,
                  0
                )}{" "}
                min
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-green-700">Activités populaires</span>
              <span className="font-bold text-green-900">
                {activitiesCount} types
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyStats;
