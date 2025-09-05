import React from 'react';
import Layout from '../../components/Layout';

const CancelPage = () => {
  return (
    <Layout>
      <div className="max-w-xl mx-auto mt-16 bg-white p-8 rounded-xl shadow text-center">
        <h1 className="text-3xl font-bold text-red-500">Paiement annulé</h1>
        <p className="mt-4 text-gray-700">Vous pouvez réessayer quand vous voulez.</p>
      </div>
    </Layout>
  );
};

export default CancelPage;
