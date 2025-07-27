import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import PageTitleCard from '../components/PageTitleCard';
import PageContainer from '../components/PageContainer';

type Break = {
  id: number;
  start: string;
  end?: string;
  note?: number;
};

function getMinutes(start: string, end?: string) {
  if (!end) return 0;
  const [h1, m1, s1] = start.split(':').map(Number);
  const [h2, m2, s2] = end.split(':').map(Number);
  const date1 = new Date();
  date1.setHours(h1, m1, s1 || 0, 0);
  const date2 = new Date();
  date2.setHours(h2, m2, s2 || 0, 0);
  return Math.round((date2.getTime() - date1.getTime()) / 60000);
}

const Dashboard = () => {
  const [breaks, setBreaks] = useState<Break[]>([]);

  useEffect(() => {
    const savedBreaks = localStorage.getItem('breaks');
    if (savedBreaks) setBreaks(JSON.parse(savedBreaks));
  }, []);

  const totalPauses = breaks.length;
  const totalMinutes = breaks.reduce(
    (sum, b) => sum + getMinutes(b.start, b.end),
    0
  );
  const avgMinutes =
    totalPauses > 0 ? Math.round(totalMinutes / totalPauses) : 0;
  const lastBreak = breaks[0];
  const notes = breaks.map(b => b.note).filter(n => typeof n === 'number') as number[];
  const avgNote =
    notes.length > 0
      ? (notes.reduce((sum, n) => sum + n, 0) / notes.length).toFixed(2)
      : 'N/A';

  return (
    <Layout>
      <PageContainer>
        <PageTitleCard title="Mon Dashboard" />
        <div className="w-full max-w-xl bg-white rounded-lg shadow p-8 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-lg font-bold text-[#7346FF] mb-2">Nombre de pauses</h2>
              <p className="text-3xl font-bold">{totalPauses}</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#7346FF] mb-2">Durée totale des pauses</h2>
              <p className="text-3xl font-bold">{totalMinutes} min</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#7346FF] mb-2">Durée moyenne d'une pause</h2>
              <p className="text-3xl font-bold">{avgMinutes} min</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#7346FF] mb-2">Note moyenne des pauses</h2>
              <p className="text-3xl font-bold">{avgNote}</p>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#7346FF] mb-2">Dernière pause</h2>
            {lastBreak ? (
              <div className="text-lg">
                Début : <span className="font-bold">{lastBreak.start}</span>
                {lastBreak.end && (
                  <>
                    <br />
                    Fin : <span className="font-bold">{lastBreak.end}</span>
                    <br />
                    Durée : <span className="font-bold">{getMinutes(lastBreak.start, lastBreak.end)} min</span>
                  </>
                )}
                {lastBreak.note && (
                  <>
                    <br />
                    Note : <span className="font-bold">{lastBreak.note}</span>
                  </>
                )}
              </div>
            ) : (
              <p className="text-gray-400">Aucune pause prise.</p>
            )}
          </div>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default Dashboard;