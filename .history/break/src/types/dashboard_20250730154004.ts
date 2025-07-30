export type Break = {
  id: number;
  start: string;
  end?: string;
  note?: number;
  userId?: string;
  timeStart?: string;
};

export type Activity = {
  id: string;
  title: string;
  type: string;
  subType: string;
  duration: number;
  difficulty: number;
  description: string;
  benefits: string[];
  tags: string[];
  tips: string[];
  resource?: string;
};

export type ActivitySession = {
  id: string;
  activityId: string;
  userId: string;
  date: string;
  duration: number;
  feedback: {
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
  };
};

export type DashboardStats = {
  totalPauses: number;
  totalMinutes: number;
  avgMinutes: number;
  weekTotalPauses: number;
  weekTotalMinutes: number;
  todayActivities: ActivitySession[];
  weekActivities: ActivitySession[];
  avgStressReduction: number;
  avgEnergyGain: number;
  avgMoodImprovement: number;
  avgConcentration: number;
  avgMotivation: number;
};
