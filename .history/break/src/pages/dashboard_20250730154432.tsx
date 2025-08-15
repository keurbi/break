import React, { useState } from "react";
import Layout from "../components/Layout";
import PageTitleCard from "../components/PageTitleCard";
import PageContainer from "../components/PageContainer";
import DashboardNavigation from "../components/dashboard/DashboardNavigation";
import DashboardOverview from "../components/dashboard/DashboardOverview";
import DashboardStatsComponent from "../components/dashboard/DashboardStats";
import { useDashboardData } from "../hooks/useDashboardData";

const Dashboard = () => {
  const { activities, recentActivitySessions, loading, stats } = useDashboardData();
  const [currentCard, setCurrentCard] = useState(1);

  if (loading) {
    return (
      <Layout>
        <PageContainer>
          <PageTitleCard title="Mon Dashboard" />
          <div className="w-full bg-white rounded-xl shadow p-8 text-center">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer>
        <PageTitleCard title="Mon Dashboard Personnel" />

        <DashboardNavigation
          currentCard={currentCard}
          onCardChange={setCurrentCard}
        />

        {currentCard === 1 && <DashboardOverview stats={stats} />}

        {currentCard === 2 && (
          <DashboardStatsComponent
            stats={stats}
            activities={activities}
            recentActivitySessions={recentActivitySessions}
          />
        )}
      </PageContainer>
    </Layout>
  );
};

export default Dashboard;
