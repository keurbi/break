'use client';

import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import PageTitleCard from '../../components/PageTitleCard';
import PageContainer from '../../components/PageContainer';
import { fetchWithAuth } from '../../utils/fetchWithAuth';

type Activity = {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  difficulty?: number;
  type?: string;
  subType?: string;
  resource?: string;
  benefits?: string[];
  tags?: string[];
  tips?: string[];
};

const defaultForm: Activity = {
  id: '',
  title: '',
  description: '',
  duration: 0,
  difficulty: 1,
  type: '',
  subType: '',
  resource: '',
  benefits: [],
  tags: [],
  tips: [],
};

const PAGE_SIZE = 8;

const ActivitiesPage = () => {
  const [form, setForm] = useState<Activity>(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  const API_URL = 'http://localhost:3100/api/activities';

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const res = await fetchWithAuth(`${API_URL}?limit=100`);
        if (res && res.ok) {
          const data = await res.json();
          const items = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
          setActivities(items as Activity[]);
        }
      } catch {
        // ignore
      }
      setLoading(false);
    };
    fetchActivities();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (['duration', 'difficulty'].includes(name)) {
      setForm({ ...form, [name]: Number(value) });
    } else if (['benefits', 'tags', 'tips'].includes(name)) {
      setForm({ ...form, [name]: value.split(',').map(v => v.trim()).filter(Boolean) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.title || !form.description) {
      setError('Titre et description requis.');
      return;
    }

    try {
      let res;
      if (editingId) {
        res = await fetchWithAuth(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, resourceUrl: form.resource }),
        });
      } else {
        res = await fetchWithAuth(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, resourceUrl: form.resource }),
        });
      }
      if (!res) return;
      if (!res.ok) {
        let data;
        try {
          data = await res.json();
        } catch {
          data = {};
        }
        setError(data?.error || 'Erreur lors de la création/mise à jour.');
        return;
      }
      setForm(defaultForm);
      setEditingId(null);
      // Refresh activities
      const activitiesRes = await fetchWithAuth(`${API_URL}?limit=100`);
      if (activitiesRes && activitiesRes.ok) {
        const data = await activitiesRes.json();
        const items = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
        setActivities(items as Activity[]);
      }
    } catch (err: any) {
      setError('Erreur réseau ou serveur.');
    }
  };

  const handleEdit = (activity: Activity) => {
    setEditingId(activity.id);
    setForm({
      id: activity.id,
      title: activity.title || '',
      description: activity.description || '',
      duration: activity.duration || 0,
      difficulty: activity.difficulty || 1,
      type: activity.type || '',
      subType: activity.subType || '',
      resource: activity.resource || '',
      benefits: activity.benefits || [],
      tags: activity.tags || [],
      tips: activity.tips || [],
    });
    setError(null);
  };

  // Pagination logic
  const totalPages = Math.ceil(activities.length / PAGE_SIZE);
  const paginatedActivities = activities.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Layout>
      <PageContainer>
        <PageTitleCard title="Créer une activité" />
        <div
          className="flex flex-row items-start w-full max-w-[1600px] mx-auto gap-10"
          style={{
            height: 'calc(100vh - 250px)',
            minHeight: 400,
            maxHeight: 650,
          }}
        >
          {/* Formulaire à gauche */}
          <form
            onSubmit={handleSubmit}
            className="flex-[2.5] max-w-4xl w-full bg-white rounded-xl shadow p-8 space-y-6"
            style={{ alignSelf: 'flex-start', minHeight: 0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                name="title"
                type="text"
                placeholder="Titre"
                value={form.title}
                onChange={handleChange}
                className="w-full px-6 py-4 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary text-[#7346FF] font-bold text-lg"
                required
              />
              <input
                name="type"
                type="text"
                placeholder="Type"
                value={form.type}
                onChange={handleChange}
                className="w-full px-6 py-4 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary text-[#7346FF] font-bold text-lg"
              />
              <input
                name="subType"
                type="text"
                placeholder="Sous-type"
                value={form.subType}
                onChange={handleChange}
                className="w-full px-6 py-4 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary text-[#7346FF] font-bold text-lg"
              />
              <input
                name="duration"
                type="number"
                placeholder="Durée (min)"
                value={form.duration}
                onChange={handleChange}
                min={0}
                className="w-full px-6 py-4 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary text-[#7346FF] font-bold text-lg"
              />
              <select
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
                className="w-full px-6 py-4 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary text-[#7346FF] font-bold text-lg"
              >
                <option value={1}>Facile</option>
                <option value={2}>Moyen</option>
                <option value={3}>Difficile</option>
              </select>
              <input
                name="resource"
                type="text"
                placeholder="Lien ressource"
                value={form.resource}
                onChange={handleChange}
                className="w-full px-6 py-4 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary text-[#7346FF] font-bold text-lg"
              />
              <input
                name="benefits"
                type="text"
                placeholder="Bénéfices (séparés par des virgules)"
                value={form.benefits?.join(', ') || ''}
                onChange={handleChange}
                className="w-full px-6 py-4 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary text-[#7346FF] font-bold text-lg"
              />
              <input
                name="tags"
                type="text"
                placeholder="Tags (séparés par des virgules)"
                value={form.tags?.join(', ') || ''}
                onChange={handleChange}
                className="w-full px-6 py-4 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary text-[#7346FF] font-bold text-lg"
              />
              <input
                name="tips"
                type="text"
                placeholder="Conseils (séparés par des virgules)"
                value={form.tips?.join(', ') || ''}
                onChange={handleChange}
                className="w-full px-6 py-4 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary text-[#7346FF] font-bold text-lg"
              />
            </div>
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="w-full px-6 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary text-[#7346FF] font-bold text-lg resize-none"
              required
              style={{ minHeight: 60, maxHeight: 90 }}
            />
            <div style={{ minHeight: 32 }}>
              {error && (
                <div className="text-red-500 text-sm text-center h-8 flex items-center justify-center">
                  {error}
                </div>
              )}
            </div>
            <div className="flex justify-center gap-4">
              <button
                type="submit"
                className="cursor-pointer bg-[#7346FF] hover:bg-[#5a36cc] text-white font-bold px-8 py-4 rounded-lg shadow transition hover:scale-105 active:scale-95"
              >
                {editingId ? "Mettre à jour l'activité" : "Créer l'activité"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(defaultForm);
                    setError(null);
                  }}
                  className="cursor-pointer px-8 py-4 rounded-lg border border-[#7346FF] text-[#7346FF] font-bold bg-white hover:bg-[#F5F2FF] hover:border-[#5a36cc] hover:text-[#5a36cc] transition hover:scale-105 active:scale-95"
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
          {/* Liste des activités à droite */}
          <div
            className="flex-1 max-w-xl w-full bg-white rounded-xl shadow p-6 ml-0 md:ml-4"
            style={{
              alignSelf: 'flex-start',
              minHeight: 0,
              maxHeight: 600,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <h3 className="text-2xl font-bold text-[#7346FF] mb-4">Activités existantes</h3>
            {loading ? (
              <div className="text-center text-[#7346FF]">Chargement...</div>
            ) : (
              <>
                <ul className="flex-1">
                  {paginatedActivities.map((activity) => (
                    <li
                      key={activity.id}
                      className={`cursor-pointer select-none px-4 py-2 rounded-lg mb-2 font-bold text-[#7346FF] transition
                        ${editingId === activity.id
                          ? 'bg-[#E5E0FF] border border-[#7346FF]'
                          : 'hover:bg-[#F5F2FF] hover:scale-[1.03] hover:shadow-md hover:text-[#5a36cc] cursor-pointer'}`}
                      onClick={() => handleEdit(activity)}
                      style={{ transition: 'all 0.15s', cursor: 'pointer' }}
                    >
                      {activity.title}
                    </li>
                  ))}
                  {paginatedActivities.length === 0 && (
                    <li className="text-gray-400 text-center py-8">Aucune activité</li>
                  )}
                </ul>
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-4 mb-0">
                    <button
                      type="button"
                      className="cursor-pointer px-3 py-1 rounded bg-gray-200 text-[#7346FF] font-bold disabled:opacity-50 transition hover:bg-[#E5E0FF] hover:text-[#5a36cc] hover:scale-105 active:scale-95"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      &lt;
                    </button>
                    <span className="font-bold text-[#7346FF]">
                      Page {page} / {totalPages}
                    </span>
                    <button
                      type="button"
                      className="cursor-pointer px-3 py-1 rounded bg-gray-200 text-[#7346FF] font-bold disabled:opacity-50 transition hover:bg-[#E5E0FF] hover:text-[#5a36cc] hover:scale-105 active:scale-95"
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                    >
                      &gt;
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default ActivitiesPage;