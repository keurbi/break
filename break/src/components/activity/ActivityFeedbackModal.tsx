import React, { useState } from "react";
import { Activity } from "../../types/dashboard";

interface FeedbackData {
  stressBefore: number;
  stressAfter: number;
  energyBefore: number;
  energyAfter: number;
  moodBefore: number;
  moodAfter: number;
  difficulty: number;
  motivation: number;
  pain: number;
  concentration: number;
}

interface ActivityFeedbackModalProps {
  activity: Activity;
  duration: number;
  isOpen: boolean;
  onSubmit: (feedback: FeedbackData) => void;
  onClose: () => void;
}

const ActivityFeedbackModal: React.FC<ActivityFeedbackModalProps> = ({
  activity,
  duration,
  isOpen,
  onSubmit,
  onClose,
}) => {
  const [feedback, setFeedback] = useState<FeedbackData>({
    stressBefore: 5,
    stressAfter: 5,
    energyBefore: 5,
    energyAfter: 5,
    moodBefore: 5,
    moodAfter: 5,
    difficulty: 5,
    motivation: 5,
    pain: 1,
    concentration: 5,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  if (!isOpen) return null;

  const handleSliderChange = (field: keyof FeedbackData, value: number) => {
    setFeedback((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(feedback);
  };

  const renderSlider = (
    label: string,
    field: keyof FeedbackData,
    min: number = 1,
    max: number = 10,
    emoji: string = "📊"
  ) => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
          <span>{emoji}</span>
          <span>{label}</span>
        </label>
        <span className="text-lg font-bold text-[#7346FF]">
          {feedback[field]}/{max}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={feedback[field]}
        onChange={(e) => handleSliderChange(field, parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        style={{
          background: `linear-gradient(to right, #7346FF 0%, #7346FF ${
            ((feedback[field] - min) / (max - min)) * 100
          }%, #e5e7eb ${
            ((feedback[field] - min) / (max - min)) * 100
          }%, #e5e7eb 100%)`,
        }}
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
  Comment vous sentiez-vous AVANT l’activité ?
      </h3>
      {renderSlider("Niveau de stress", "stressBefore", 1, 10, "😰")}
      {renderSlider("Niveau d'énergie", "energyBefore", 1, 10, "⚡")}
      {renderSlider("Humeur générale", "moodBefore", 1, 10, "😊")}
    </div>
  );

  const renderStep2 = () => (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
  Comment vous sentez-vous APRÈS l’activité ?
      </h3>
      {renderSlider("Niveau de stress", "stressAfter", 1, 10, "😰")}
      {renderSlider("Niveau d'énergie", "energyAfter", 1, 10, "⚡")}
      {renderSlider("Humeur générale", "moodAfter", 1, 10, "😊")}
    </div>
  );

  const renderStep3 = () => (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
  Évaluation de l’activité
      </h3>
      {renderSlider("Difficulté perçue", "difficulty", 1, 5, "📊")}
      {renderSlider("Motivation ressentie", "motivation", 1, 10, "🔥")}
      {renderSlider("Douleur/inconfort", "pain", 1, 5, "🩹")}
      {renderSlider("Niveau de concentration", "concentration", 1, 10, "🧠")}
    </div>
  );

  return (
    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Feedback de l’activité
              </h2>
              <p className="text-gray-600 text-sm">
                {activity.title} • {duration} minutes
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>
                Étape {currentStep} sur {totalSteps}
              </span>
              <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#7346FF] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex justify-between">
            <button
              onClick={currentStep === 1 ? onClose : handlePrevious}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {currentStep === 1 ? "Annuler" : "Précédent"}
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-[#7346FF] text-white rounded-lg hover:bg-[#5f39d9] transition-colors"
              >
                Suivant
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
              >
                ✅ Enregistrer
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #7346ff;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #7346ff;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default ActivityFeedbackModal;
