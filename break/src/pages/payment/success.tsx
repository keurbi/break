import React from 'react';
import Layout from '../../components/Layout';

const SuccessPage = () => {
  return (
    <Layout>
      <div className="max-w-xl mx-auto mt-16 bg-white p-8 rounded-xl shadow text-center">
        <h1 className="text-3xl font-bold text-green-600">Merci pour votre don 🙏</h1>
        <p className="mt-4 text-gray-700">Votre paiement a été confirmé.</p>
      </div>
    </Layout>
  );
};

export default SuccessPage;
