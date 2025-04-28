import React from 'react';
import Layout from '../components/Layout';

const Settings = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold">Page Settings</h1>
        <p className="mt-4 text-lg">
          Ceci est une page générique. Remplacez ce texte par le contenu spécifique à votre page.
        </p>
      </div>
    </Layout>
  );
};

export default Settings;
