import React from "react";

interface StatsCardProps {
  title: string;
  icon: string;
  value: number | string;
  subtitle: string;
  colorScheme: "blue" | "green" | "purple" | "orange";
}

const colorSchemes = {
  blue: {
    bg: "from-blue-50 to-blue-100",
    border: "border-blue-200",
    titleColor: "text-blue-700",
    valueColor: "text-blue-800",
    subtitleColor: "text-blue-600",
  },
  green: {
    bg: "from-green-50 to-green-100",
    border: "border-green-200",
    titleColor: "text-green-700",
    valueColor: "text-green-800",
    subtitleColor: "text-green-600",
  },
  purple: {
    bg: "from-purple-50 to-purple-100",
    border: "border-purple-200",
    titleColor: "text-purple-700",
    valueColor: "text-purple-800",
    subtitleColor: "text-purple-600",
  },
  orange: {
    bg: "from-orange-50 to-orange-100",
    border: "border-orange-200",
    titleColor: "text-orange-700",
    valueColor: "text-orange-800",
    subtitleColor: "text-orange-600",
  },
};

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  icon,
  value,
  subtitle,
  colorScheme,
}) => {
  const colors = colorSchemes[colorScheme];

  return (
    <div
      className={`bg-gradient-to-br ${colors.bg} p-4 rounded-xl border ${colors.border} hover:shadow-md transition-shadow`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className={`text-sm font-semibold ${colors.titleColor}`}>
          {title}
        </h3>
        <span className="text-xl">{icon}</span>
      </div>
      <p className={`text-2xl font-bold ${colors.valueColor}`}>{value}</p>
      <p className={`text-sm ${colors.subtitleColor}`}>{subtitle}</p>
    </div>
  );
};

export default StatsCard;
