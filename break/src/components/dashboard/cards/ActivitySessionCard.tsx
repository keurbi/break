import React, { useEffect, useState } from "react";
import { Activity, ActivitySession } from "../../../types/dashboard";

interface ActivitySessionCardProps {
  session: ActivitySession;
  activity?: Activity;
}

const ActivitySessionCard: React.FC<ActivitySessionCardProps> = ({
  session,
  activity,
}) => {
  const [dateText, setDateText] = useState<string>(() => {
    // Stable SSR: use ISO date string to avoid locale mismatch
    try {
      return new Date(session.date).toISOString().slice(0, 10);
    } catch {
      return String(session.date);
    }
  });

  useEffect(() => {
    // Client: replace with locale-specific formatting after mount
    try {
      setDateText(new Date(session.date).toLocaleDateString());
    } catch {}
  }, [session.date]);

  return (
    <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-base text-gray-800">
            {activity?.title || "Activité"}
          </h3>
          <p className="text-gray-600 mb-2 text-sm">
            {activity?.description || "Description non disponible"}
          </p>
          <div className="flex items-center space-x-3 text-sm text-gray-500">
            <span suppressHydrationWarning>📅 {dateText}</span>
            <span>⏱️ {session.duration} min</span>
            <span>📊 Difficulté {activity?.difficulty || "N/A"}/5</span>
          </div>
        </div>
        <div className="text-right">
          <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
            Terminée
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 pt-3 border-t border-gray-100">
        <div className="text-center">
          <p className="text-gray-500 text-sm">Stress</p>
          <p className="font-bold text-red-600 text-sm">
            {session.feedback.stressBefore} → {session.feedback.stressAfter}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 text-sm">Énergie</p>
          <p className="font-bold text-green-600 text-sm">
            {session.feedback.energyBefore} → {session.feedback.energyAfter}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 text-sm">Humeur</p>
          <p className="font-bold text-blue-600 text-sm">
            {session.feedback.moodBefore} → {session.feedback.moodAfter}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 text-sm">Concentration</p>
          <p className="font-bold text-orange-600 text-sm">
            {session.feedback.concentration}/10
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActivitySessionCard;
