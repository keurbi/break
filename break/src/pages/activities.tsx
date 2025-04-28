import React from 'react';
import Layout from '../components/Layout'; // Assurez-vous que le chemin est correct
import { Heart } from 'lucide-react';

const Activities = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-start h-full py-4 bg-tertiary">
        <h1 className="text-6xl font-bold text-(--color-secondary) mt-4 mb-8 underline">Activités</h1>
        <div className="flex flex-col items-center justify-center flex-1 w-full overflow-hidden">
          <div className="grid grid-cols-3 gap-4 w-full max-w-[99%]">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 relative min-h-[350px] flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-3xl font-medium">Sous-titre</span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">15 mins</span>
                    <button className="p-2 bg-(--color-secondary) rounded-full shadow transform transition-transform hover:translate-x-1 hover:translate-y-1">
                      <Heart className="w-6 h-6 text-white font-bold" />
                    </button>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-(--color-primary) text-center mt-4">Titre de l'activité</h2>
                <button className="mt-4 mx-auto w-1/2 py-2 bg-(--color-primary) text-white rounded-full hover:bg-primary-dark">
                  Faire activité
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full max-w-xl p-4 bg-white rounded-lg shadow-md flex justify-center items-center mt-8 space-x-4">
          <button className="w-10 h-10 flex items-center justify-center bg-(--color-primary) text-white rounded-lg">1</button>
          <button className="w-10 h-10 flex items-center justify-center bg-(--color-primary) text-white rounded-lg">2</button>
          <button className="w-10 h-10 flex items-center justify-center bg-(--color-primary) text-white rounded-lg">3</button>
          <button className="w-10 h-10 flex items-center justify-center text-gray-500" disabled>...</button>
          <button className="w-10 h-10 flex items-center justify-center bg-(--color-primary) text-white rounded-lg">8</button>
          <button className="w-10 h-10 flex items-center justify-center bg-(--color-primary) text-white rounded-lg">9</button>
          <button className="w-10 h-10 flex items-center justify-center bg-(--color-primary) text-white rounded-lg">10</button>
        </div>
      </div>
    </Layout>
  );
};

export default Activities;
