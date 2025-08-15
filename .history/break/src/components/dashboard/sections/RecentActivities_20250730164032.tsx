import React from "react";
import { Activity, ActivitySession } from "../../../types/dashboard";
import ActivitySessionCard from "../cards/ActivitySessionCard";

interface RecentActivitiesProps {
  sessions: ActivitySession[];
  activities: Activity[];
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({
  sessions,
  activities,
}) => {
  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-1 h-7 rounded-full mr-3"></div>
        <h2 className="text-xl font-bold text-gray-800">
          🎯 Activités récentes
        </h2>
      </div>

      {sessions.length > 0 ? (
        <div className="space-y-3">
          {sessions.slice(0, 2).map((session) => {
            const activity = activities.find((a) => a.id === session.activityId);
            return (
              <ActivitySessionCard
                key={session.id}
                session={session}
                activity={activity}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Aucune activité récente
          </h3>
          <p className="text-gray-500 mb-4 text-base">
            Commencez votre première activité pour voir vos statistiques ici !
          </p>
          <div className="bg-white p-3 rounded-lg inline-block border border-gray-200">
            <p className="text-sm text-gray-600">
              💡 Astuce : Visitez la page Activités pour découvrir tous les
              exercices disponibles
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentActivities;
