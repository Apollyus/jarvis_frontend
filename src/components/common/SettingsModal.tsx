import React from 'react';
import { API_CONFIG } from '../../config/api.config';


const SettingsModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const handleTickTickLogin = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/ticktick/auth`);
      console.log('Response status:', response);
      const data = await response.json();
      console.log('Response data:', data);
      console.log('Redirecting to:', data.auth_url);
      if (data.auth_url !== undefined) {
        window.location.href = data.auth_url;
      }
    } catch (error) {
      alert('Nepodařilo se zahájit přihlášení do TickTick.');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px] relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>
          ×
        </button>
        <h2 className="text-gray-900 text-xl font-bold mb-4">Nastavení</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleTickTickLogin}
        >
          Přihlásit se do TickTick
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
