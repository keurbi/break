import React from "react";
import WellBeingCard from "../cards/WellBeingCard";
import { DashboardStats } from "../../../types/dashboard";

interface WellBeingImpactProps {
  stats: DashboardStats;
}

const WellBeingImpact: React.FC<WellBeingImpactProps> = ({ stats }) => {
  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="bg-gradient-to-r from-pink-500 to-red-500 w-1 h-7 rounded-full mr-3"></div>
        <h2 className="text-xl font-bold text-gray-800">
          💪 Impact sur votre bien-être
        </h2>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <WellBeingCard
            title="Réduction stress"
            icon="🧘"
            value={Math.abs(stats.avgStressReduction)}
            subtitle="points en moyenne"
            colorScheme="red"
          />
          <WellBeingCard
            title="Gain d'énergie"
            icon="⚡"
            value={stats.avgEnergyGain}
            subtitle="points en moyenne"
            colorScheme="green"
          />
          <WellBeingCard
            title="Amélioration humeur"
            icon="😊"
            value={stats.avgMoodImprovement}
            subtitle="points en moyenne"
            colorScheme="blue"
          />
        </div>

        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
          <div className="flex items-center">
            <span className="text-xl mr-3">💡</span>
            <div>
              <p className="text-sm font-semibold text-blue-800">
                Motivation moyenne
              </p>
              <p className="text-base font-bold text-blue-900">
                {stats.avgMotivation.toFixed(1)}/10
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellBeingImpact;
