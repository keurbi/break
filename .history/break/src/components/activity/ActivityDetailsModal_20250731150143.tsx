import React from "react";
import { Activity } from "../../types/dashboard";

interface ActivityDetailsModalProps {
  activity: Activity;
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

const ActivityDetailsModal: React.FC<ActivityDetailsModalProps> = ({
  activity,
  isOpen,
  onClose,
  onStart,
}) => {
  if (!isOpen) return null;

  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "sport":
      case "exercise":
        return "🏃‍♂️";
      case "relaxation":
      case "meditation":
        return "🧘‍♀️";
      case "breathing":
        return "🫁";
      case "stretching":
        return "🤸‍♀️";
      default:
        return "🎯";
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return "text-green-600 bg-green-100";
    if (difficulty <= 3) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getDifficultyText = (difficulty: number) => {
    if (difficulty <= 2) return "Facile";
    if (difficulty <= 3) return "Modéré";
    return "Difficile";
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{getActivityIcon(activity.type)}</span>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {activity.title}
                </h2>
                <p className="text-gray-600 text-sm">
                  {activity.type} • {activity.subType}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Description et Info Cards en layout side-by-side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Description */}
            <div className="lg:col-span-2">
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {activity.description}
              </p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">⏱️</span>
                  <div>
                    <p className="text-xs text-blue-600 font-medium">Durée</p>
                    <p className="text-base font-bold text-blue-800">
                      {activity.duration} min
                    </p>
                  </div>
                </div>
              </div>
              <div
                className={`border rounded-lg p-3 ${getDifficultyColor(
                  activity.difficulty
                )}`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">📊</span>
                  <div>
                    <p className="text-xs font-medium">Difficulté</p>
                    <p className="text-base font-bold">
                      {getDifficultyText(activity.difficulty)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          {activity.benefits && activity.benefits.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Bienfaits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {activity.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          {activity.tips && activity.tips.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Conseils
              </h3>
              <div className="space-y-2">
                {activity.tips.map((tip, index) => (
                  <div
                    key={index}
                    className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
                  >
                    <div className="flex items-start space-x-2">
                      <span className="text-yellow-600 mt-0.5">💡</span>
                      <p className="text-gray-700 text-sm">{tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resource */}
          {activity.resource && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Ressource
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                {activity.resource.startsWith("http") ? (
                  <a
                    href={activity.resource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Voir la ressource 🔗
                  </a>
                ) : (
                  <p className="text-gray-700">{activity.resource}</p>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {activity.tags && activity.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {activity.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={onStart}
              className="px-8 py-3 bg-[#7346FF] text-white rounded-lg font-semibold hover:bg-[#5f39d9] transition-colors flex items-center space-x-2"
            >
              <span>🚀</span>
              <span>Commencer l&apos;activité</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailsModal;
