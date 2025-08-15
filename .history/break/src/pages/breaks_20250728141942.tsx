import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import PageTitleCard from '../components/PageTitleCard';
import PageContainer from '../components/PageContainer';

type Break = {
    id: number;
    start: string;
    end?: string;
    timeStart?: string;
    userId?: string;
};

function getSeconds(start: string, end?: string) {
    if (!start) return 0;
    const [h1, m1, s1] = start.split(':').map(Number);
    const date1 = new Date();
    date1.setHours(h1, m1, s1 || 0, 0);
    const date2 = new Date();
    if (end) {
        const [h2, m2, s2] = end.split(':').map(Number);
        date2.setHours(h2, m2, s2 || 0, 0);
    } else {
        date2.setTime(Date.now());
    }
    return Math.max(0, Math.floor((date2.getTime() - date1.getTime()) / 1000));
}

function formatTimer(seconds: number) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')} : ${sec.toString().padStart(2, '0')}`;
}

function isToday(dateString: string) {
    const d = new Date(dateString);
    const now = new Date();
    return (
        d.getDate() === now.getDate() &&
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
    );
}

const Breaks = () => {
    const [breaks, setBreaks] = useState<Break[]>([]);
    const [onBreak, setOnBreak] = useState(false);
    const [currentSeconds, setCurrentSeconds] = useState(0);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const auth = getAuth();
        setUserId(auth.currentUser ? auth.currentUser.uid : null);

        const savedBreaks = localStorage.getItem('breaks');
        const savedOnBreak = localStorage.getItem('onBreak');
        if (savedBreaks) setBreaks(JSON.parse(savedBreaks));
        if (savedOnBreak) setOnBreak(savedOnBreak === 'true');
    }, []);

    const todayBreaks = breaks.filter(
        (b) => b.userId === userId && b.timeStart && isToday(b.timeStart)
    );

    const currentBreak = todayBreaks.find((b) => !b.end);

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        if (onBreak && currentBreak && currentBreak.start) {
            interval = setInterval(() => {
                setCurrentSeconds(getSeconds(currentBreak.start));
            }, 1000);
            setCurrentSeconds(getSeconds(currentBreak.start));
        } else {
            setCurrentSeconds(0);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [onBreak, currentBreak]);

    const handleStartBreak = () => {
        const auth = getAuth();
        const uid = auth.currentUser ? auth.currentUser.uid : '';
        const newBreak: Break = {
            id: Date.now(),
            start: new Date().toLocaleTimeString(),
            userId: uid,
            timeStart: new Date().toISOString(),
        };
        const updatedBreaks = [newBreak, ...breaks];
        setBreaks(updatedBreaks);
        setOnBreak(true);
        localStorage.setItem('breaks', JSON.stringify(updatedBreaks));
        localStorage.setItem('onBreak', 'true');
    };

    const handleEndBreak = async () => {
        const endTime = new Date().toLocaleTimeString();
        const updatedBreaks = breaks.map((b, i) =>
            i === 0 && !b.end ? { ...b, end: endTime } : b
        );
        setBreaks(updatedBreaks);
        setOnBreak(false);
        localStorage.setItem('breaks', JSON.stringify(updatedBreaks));
        localStorage.setItem('onBreak', 'false');

        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user && breaks.length > 0) {
                const db = getFirestore();
                const start = breaks[0].start;
                const end = endTime;
                const [h1, m1, s1] = start.split(':').map(Number);
                const [h2, m2, s2] = end.split(':').map(Number);
                const date1 = new Date();
                date1.setHours(h1, m1, s1 || 0, 0);
                const date2 = new Date();
                date2.setHours(h2, m2, s2 || 0, 0);
                const duration = Math.max(
                    0,
                    Math.round((date2.getTime() - date1.getTime()) / 60000)
                );
                await addDoc(collection(db, 'breaks'), {
                    duration: duration,
                    timeStart: date1.toISOString(),
                    userId: `/users/${user.uid}`,
                });
            }
        } catch (err) {}
    };

    return (
        <Layout>
            <PageContainer>
                <PageTitleCard title="Prendre une pause" />
                <div className='flex flex-col items-center justify-start min-h-screen py-2 relative'>
                    <div className='flex flex-row items-start w-full max-w-6xl mx-auto mt-2 mb-16 gap-12'>
                        <div className='flex flex-col items-center flex-[1.5] mt-12'>
                            <div className='text-8xl font-bold text-[#7346FF] bg-white px-32 py-16 rounded-lg mb-10 shadow border-[#7346FF] w-full text-center'>
                                {onBreak && currentBreak && !currentBreak.end
                                    ? formatTimer(currentSeconds)
                                    : formatTimer(0)}
                            </div>
                            {!onBreak ? (
                                <button
                                    onClick={handleStartBreak}
                                    className='bg-[#7346FF] text-white px-12 py-6 rounded-lg font-bold text-2xl hover:bg-[#5a36cc] transition mb-10 w-full'
                                >
                                    Commencer une pause
                                </button>
                            ) : (
                                <button
                                    onClick={handleEndBreak}
                                    className='bg-[#CFAAFF] text-white px-12 py-6 rounded-lg font-bold text-2xl hover:bg-[#7346FF] transition mb-10 w-full'
                                >
                                    Terminer la pause
                                </button>
                            )}
                        </div>
                        <div className='flex-1 flex flex-col justify-start mt-12'>
                            <table className='w-full text-2xl bg-white rounded-2xl shadow-lg'>
                                <thead>
                                    <tr>
                                        <th colSpan={3}>
                                            <h2 className='text-3xl font-bold mb-4 mt-4 text-center text-[#7346FF]'>
                                                Pauses du jour
                                            </h2>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th className='p-5 text-left'>Début</th>
                                        <th className='p-5 text-left'>Fin</th>
                                        <th className='p-5 text-left'>Durée</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {todayBreaks.map((b, idx) => {
                                        let duration = '';
                                        if (b.end) {
                                            const [h1, m1, s1] = b.start.split(':').map(Number);
                                            const [h2, m2, s2] = b.end.split(':').map(Number);
                                            const date1 = new Date();
                                            date1.setHours(h1, m1, s1 || 0, 0);
                                            const date2 = new Date();
                                            date2.setHours(h2, m2, s2 || 0, 0);
                                            const diffMs = Math.max(0, date2.getTime() - date1.getTime());
                                            const totalSeconds = Math.floor(diffMs / 1000);
                                            const min = Math.floor(totalSeconds / 60);
                                            const sec = totalSeconds % 60;
                                            duration = `${min.toString().padStart(2, '0')} min ${sec.toString().padStart(2, '0')} s`;
                                        }
                                        const isLast = idx === todayBreaks.length - 1;
                                        return (
                                            <tr
                                                key={b.id}
                                                className={`text-2xl${!isLast ? ' border-b' : ''}`}
                                            >
                                                <td className='p-5'>{b.start}</td>
                                                <td className='p-5'>
                                                    {b.end || (
                                                        <span className='italic text-gray-400'>En cours</span>
                                                    )}
                                                </td>
                                                <td className='p-5'>
                                                    {b.end ? (
                                                        duration
                                                    ) : (
                                                        <span className='italic text-gray-400'>En cours</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {todayBreaks.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={3}
                                                className='p-5 text-center text-gray-400 text-2xl'
                                            >
                                                Aucune pause prise aujourd'hui.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </PageContainer>
        </Layout>
    );
};

export default Breaks;