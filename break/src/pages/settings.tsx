import React, { useState } from 'react';
import { Edit, ChevronDown, ChevronUp } from 'lucide-react';
import Layout from '../components/Layout';
import PageTitleCard from '../components/PageTitleCard';
import PageContainer from '../components/PageContainer';

const sections = [
  { key: 'user', label: "Informations de l’utilisateur" },
  { key: 'config', label: 'Configuration' },
  { key: 'notif', label: 'Notifications' },
  { key: 'privacy', label: 'Confidentialité' },
];

const SettingsPage = () => {
  const userInfo = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
  };

  const [settings, setSettings] = useState({
    theme: 'Light',
    language: 'English',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    activitySummary: true,
    marketingEmails: false,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'Public',
    showActivity: true,
    allowTagging: true,
  });

  const [openSection, setOpenSection] = useState<string>('user');

  const handleEditUserInfo = () => {
    console.log('Edit user info');
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationSettings((prevSettings) => ({
      ...prevSettings,
      [name]: checked,
    }));
  };

  const handlePrivacyChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    if (e.target instanceof HTMLInputElement) {
      const { name, checked } = e.target;
      setPrivacySettings((prevSettings) => ({
        ...prevSettings,
        [name]: checked,
      }));
    } else {
      const { name, value } = e.target;
      setPrivacySettings((prevSettings) => ({
        ...prevSettings,
        [name]: value,
      }));
    }
  };

  return (
    <Layout>
      <PageContainer>
        <PageTitleCard title="Paramètres" />
        <div className="p-8">
          {/* Accordion Sections */}
          {/* User Info */}
          <div className="bg-white shadow-md rounded-lg mb-4">
            <button
              className="w-full flex justify-between items-center p-6 focus:outline-none"
              onClick={() => setOpenSection(openSection === 'user' ? '' : 'user')}
              aria-expanded={openSection === 'user'}
            >
              <span className="text-2xl font-bold">{sections[0].label}</span>
              {openSection === 'user' ? <ChevronUp /> : <ChevronDown />}
            </button>
            {openSection === 'user' && (
              <div className="px-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg">Prénom: {userInfo.firstName}</p>
                    <p className="text-lg">Nom: {userInfo.lastName}</p>
                    <p className="text-lg">Email: {userInfo.email}</p>
                  </div>
                  <button onClick={handleEditUserInfo} className="text-blue-500 hover:text-blue-700">
                    <Edit className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Configuration */}
          <div className="bg-white shadow-md rounded-lg mb-4">
            <button
              className="w-full flex justify-between items-center p-6 focus:outline-none"
              onClick={() => setOpenSection(openSection === 'config' ? '' : 'config')}
              aria-expanded={openSection === 'config'}
            >
              <span className="text-2xl font-bold">{sections[1].label}</span>
              {openSection === 'config' ? <ChevronUp /> : <ChevronDown />}
            </button>
            {openSection === 'config' && (
              <div className="px-6 pb-6">
                <div className="mb-4">
                  <label className="block text-lg mb-2">Thème</label>
                  <select
                    name="theme"
                    value={settings.theme}
                    onChange={handleSettingsChange}
                    className="border rounded p-2 w-full"
                  >
                    <option value="Light">Clair</option>
                    <option value="Dark">Sombre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-lg mb-2">Langue</label>
                  <select
                    name="language"
                    value={settings.language}
                    onChange={handleSettingsChange}
                    className="border rounded p-2 w-full"
                  >
                    <option value="English">Anglais</option>
                    <option value="French">Français</option>
                    <option value="Spanish">Espagnol</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="bg-white shadow-md rounded-lg mb-4">
            <button
              className="w-full flex justify-between items-center p-6 focus:outline-none"
              onClick={() => setOpenSection(openSection === 'notif' ? '' : 'notif')}
              aria-expanded={openSection === 'notif'}
            >
              <span className="text-2xl font-bold">{sections[2].label}</span>
              {openSection === 'notif' ? <ChevronUp /> : <ChevronDown />}
            </button>
            {openSection === 'notif' && (
              <div className="px-6 pb-6 space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    name="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onChange={handleNotificationChange}
                    className="mr-2 h-5 w-5"
                  />
                  <label htmlFor="emailNotifications" className="text-lg">Notifications par email</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="pushNotifications"
                    name="pushNotifications"
                    checked={notificationSettings.pushNotifications}
                    onChange={handleNotificationChange}
                    className="mr-2 h-5 w-5"
                  />
                  <label htmlFor="pushNotifications" className="text-lg">Notifications push</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="activitySummary"
                    name="activitySummary"
                    checked={notificationSettings.activitySummary}
                    onChange={handleNotificationChange}
                    className="mr-2 h-5 w-5"
                  />
                    <label htmlFor="activitySummary" className="text-lg">Résumé d&apos;activité hebdomadaire</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="marketingEmails"
                    name="marketingEmails"
                    checked={notificationSettings.marketingEmails}
                    onChange={handleNotificationChange}
                    className="mr-2 h-5 w-5"
                  />
                  <label htmlFor="marketingEmails" className="text-lg">Emails marketing et promotions</label>
                </div>
              </div>
            )}
          </div>

          {/* Confidentialité */}
          <div className="bg-white shadow-md rounded-lg mb-4">
            <button
              className="w-full flex justify-between items-center p-6 focus:outline-none"
              onClick={() => setOpenSection(openSection === 'privacy' ? '' : 'privacy')}
              aria-expanded={openSection === 'privacy'}
            >
              <span className="text-2xl font-bold">{sections[3].label}</span>
              {openSection === 'privacy' ? <ChevronUp /> : <ChevronDown />}
            </button>
            {openSection === 'privacy' && (
              <div className="px-6 pb-6">
                <div className="mb-4">
                  <label className="block text-lg mb-2">Visibilité du profil</label>
                  <select
                    name="profileVisibility"
                    value={privacySettings.profileVisibility}
                    onChange={handlePrivacyChange}
                    className="border rounded p-2 w-full"
                  >
                    <option value="Public">Public</option>
                    <option value="Friends">Amis seulement</option>
                    <option value="Private">Privé</option>
                  </select>
                </div>
                <div className="mb-4 flex items-center">
                  <input
                    type="checkbox"
                    id="showActivity"
                    name="showActivity"
                    checked={privacySettings.showActivity}
                    onChange={handlePrivacyChange}
                    className="mr-2 h-5 w-5"
                  />
                  <label htmlFor="showActivity" className="text-lg">Afficher mon activité aux autres utilisateurs</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allowTagging"
                    name="allowTagging"
                    checked={privacySettings.allowTagging}
                    onChange={handlePrivacyChange}
                    className="mr-2 h-5 w-5"
                  />
                  <label htmlFor="allowTagging" className="text-lg">Autoriser les autres à me mentionner</label>
                </div>
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    </Layout>
  );
};

export default SettingsPage;