'use client';
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../firebase';
import ActivityCard from '../components/ActivityCard';
import ActivityDetailsModal from '../components/activity/ActivityDetailsModal';
import ActivitySession from '../components/activity/ActivitySession';
import ActivityFeedbackModal from '../components/activity/ActivityFeedbackModal';
import PageTitleCard from '../components/PageTitleCard';
import PageContainer from '../components/PageContainer';
import { saveActivitySession } from '../services/activityService';

type Activity = {
    id: string;
    title: string;
    description: string;
    duration: number;
    difficulty: number;
    type: string;
    subType: string;
    resource: string;
    benefits: string[];
    tags: string[];
    tips: string[];
};

const PAGE_SIZE = 6;

const ActivitiesPage = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchActivities = async () => {
            const db = getFirestore(app);
            const querySnapshot = await getDocs(collection(db, 'activities'));
            const acts: Activity[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                acts.push({
                    id: doc.id,
                    title: data.title || '',
                    description: data.description || '',
                    duration: data.duration || 0,
                    difficulty: data.difficulty || 1,
                    type: data.type || '',
                    subType: data.subType || '',
                    resource: data.resource || '',
                    benefits: data.benefits || [],
                    tags: data.tags || [],
                    tips: data.tips || [],
                });
            });
            setActivities(acts);
        };
        fetchActivities();
    }, []);

    const totalPages = Math.ceil(activities.length / PAGE_SIZE);
    const paginatedActivities = activities.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    return (
        <Layout>
            <PageContainer>
                <PageTitleCard title="Toutes les activités" />
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    style={{
                        minHeight: 'calc(100vh - 180px - 56px)',
                        maxHeight: 'calc(100vh - 180px - 56px)',
                    }}
                >
                    {paginatedActivities.map((activity) => (
                        <ActivityCard key={activity.id} activity={activity} />
                    ))}
                </div>
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-4">
                        <button
                            className="px-4 py-2 rounded bg-white text-[#7346FF] font-bold border border-[#7346FF] hover:bg-[#7346FF] hover:text-white transition disabled:opacity-40"
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                        >
                            Précédent
                        </button>
                        <span className="font-bold text-[#7346FF]">
                            {page} / {totalPages}
                        </span>
                        <button
                            className="px-4 py-2 rounded bg-white text-[#7346FF] font-bold border border-[#7346FF] hover:bg-[#7346FF] hover:text-white transition disabled:opacity-40"
                            onClick={() => setPage(page + 1)}
                            disabled={page === totalPages}
                        >
                            Suivant
                        </button>
                    </div>
                )}
            </PageContainer>
        </Layout>
    );
};

export default ActivitiesPage;