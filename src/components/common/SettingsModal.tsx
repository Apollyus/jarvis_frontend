import React from 'react';
import { API_CONFIG } from '../../config/api.config';


const SettingsModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const handleTickTickLogin = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/ticktick/auth`);
      const data = await response.json();
      console.log('Redirecting to:', data.url);
      if (data.url !== undefined) {
        window.location.href = data.url;
      }
    } catch (error) {
      alert('Nepodařilo se zahájit přihlášení do TickTick.');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px] relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">Nastavení</h2>
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
