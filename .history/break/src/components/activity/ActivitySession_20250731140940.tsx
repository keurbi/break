import React, { useState, useEffect } from "react";
import { Activity } from "../../types/dashboard";

interface ActivitySessionProps {
  activity: Activity;
  onComplete: (duration: number) => void;
  onCancel: () => void;
}

const ActivitySession: React.FC<ActivitySessionProps> = ({
  activity,
  onComplete,
  onCancel,
}) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleComplete = () => {
    setIsRunning(false);
    onComplete(Math.floor(timeElapsed / 60)); // Duration en minutes
  };

  const handleCancel = () => {
    setIsRunning(false);
    onCancel();
  };

  const progress = Math.min((timeElapsed / (activity.duration * 60)) * 100, 100);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#7346FF] to-[#5f39d9] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        {/* Activity Header */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#7346FF] to-[#5f39d9] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-white">
              {activity.type.toLowerCase() === 'sport' ? '🏃‍♂️' : 
               activity.type.toLowerCase() === 'relaxation' ? '🧘‍♀️' : 
               activity.type.toLowerCase() === 'breathing' ? '🫁' : '🎯'}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{activity.title}</h2>
          <p className="text-gray-600">{activity.type} • {activity.subType}</p>
        </div>

        {/* Timer */}
        <div className="mb-8">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#7346FF]"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeDasharray={`${progress}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-800">
                {formatTime(timeElapsed)}
              </span>
            </div>
          </div>
          <p className="text-gray-600">
            Objectif: {activity.duration} min
          </p>
        </div>

        {/* Resource */}
        {activity.resource && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">Ressource :</p>
            {activity.resource.startsWith('http') ? (
              <a
                href={activity.resource}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline text-sm"
              >
                Ouvrir la ressource 🔗
              </a>
            ) : (
              <p className="text-blue-700 text-sm">{activity.resource}</p>
            )}
          </div>
        )}

        {/* Status */}
        <div className="mb-6">
          {isPaused ? (
            <div className="flex items-center justify-center space-x-2 text-yellow-600">
              <span>⏸️</span>
              <span className="font-medium">En pause</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <span>▶️</span>
              <span className="font-medium">En cours...</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={handleCancel}
            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm"
          >
            ❌ Arrêter
          </button>
          
          <button
            onClick={handlePauseResume}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
          >
            {isPaused ? '▶️ Reprendre' : '⏸️ Pause'}
          </button>
          
          <button
            onClick={handleComplete}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold text-sm"
          >
            ✅ Terminé
          </button>
        </div>

        {/* Tips */}
        {activity.tips && activity.tips.length > 0 && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 font-medium mb-2">💡 Conseil :</p>
            <p className="text-yellow-700 text-sm">
              {activity.tips[Math.floor(Math.random() * activity.tips.length)]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivitySession;
