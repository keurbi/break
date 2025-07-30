import React from "react";

interface WellBeingCardProps {
  title: string;
  icon: string;
  value: number;
  subtitle: string;
  colorScheme: "red" | "green" | "blue";
}

const colorSchemes = {
  red: {
    border: "border-red-100",
    valueColor: "text-red-600",
  },
  green: {
    border: "border-green-100",
    valueColor: "text-green-600",
  },
  blue: {
    border: "border-blue-100",
    valueColor: "text-blue-600",
  },
};

const WellBeingCard: React.FC<WellBeingCardProps> = ({
  title,
  icon,
  value,
  subtitle,
  colorScheme,
}) => {
  const colors = colorSchemes[colorScheme];
  const formattedValue = value > 0 && colorScheme !== "red" ? `+${value.toFixed(1)}` : 
                        colorScheme === "red" && value > 0 ? `-${value.toFixed(1)}` : 
                        value.toFixed(1);

  return (
    <div className={`text-center p-4 bg-white rounded-lg shadow-sm border ${colors.border}`}>
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="text-base font-semibold text-gray-800 mb-2">{title}</h3>
      <p className={`text-2xl font-bold ${colors.valueColor}`}>
        {formattedValue}
      </p>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
};

export default WellBeingCard;
