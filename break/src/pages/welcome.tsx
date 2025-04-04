import React from 'react';
import Layout from '../components/Layout'; 

const WelcomePage = () => {
  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-4">Bienvenue sur la page d'accueil</h1>
        <p className="text-lg">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sequi natus hic accusamus et ipsum, reprehenderit, error harum possimus praesentium aspernatur consequuntur earum ab, reiciendis veritatis repellendus dignissimos. Nihil, minima exercitationem!
        </p>
      </div>
    </Layout>
  );
};

export default WelcomePage;
