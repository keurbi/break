import React from "react";

interface DashboardNavigationProps {
  currentCard: number;
  onCardChange: (card: number) => void;
}

const DashboardNavigation: React.FC<DashboardNavigationProps> = ({
  currentCard,
  onCardChange,
}) => {
  return (
    <div className="flex justify-center my-3">
      <div className="bg-white rounded-lg shadow-sm p-1 flex space-x-1">
        <button
          onClick={() => onCardChange(1)}
          className={`px-3 py-1.5 rounded-md font-medium transition-all text-sm ${
            currentCard === 1
              ? "bg-[#7346FF] text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          📊 Vue d’ensemble
        </button>
        <button
          onClick={() => onCardChange(2)}
          className={`px-3 py-1.5 rounded-md font-medium transition-all text-sm ${
            currentCard === 2
              ? "bg-[#7346FF] text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          📈 Détails & Activités
        </button>
      </div>
    </div>
  );
};

export default DashboardNavigation;
