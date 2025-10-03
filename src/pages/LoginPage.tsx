/**
 * LoginPage - Přihlašovací stránka
 */

import { useState } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { ApiKeyInput } from '../components/auth/ApiKeyInput';

export const LoginPage = () => {
  const [loginMethod, setLoginMethod] = useState<'credentials' | 'apiKey'>('credentials');

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">MCP Agent Chat</h1>
          <p className="text-gray-600">Přihlaste se ke svému AI asistentovi</p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Tab přepínače */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setLoginMethod('credentials')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                loginMethod === 'credentials'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Uživatelské jméno
            </button>
            <button
              onClick={() => setLoginMethod('apiKey')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                loginMethod === 'apiKey'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              API Klíč
            </button>
          </div>

          {/* Přihlašovací formuláře */}
          {loginMethod === 'credentials' ? <LoginForm /> : <ApiKeyInput />}
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          MCP Agent Chat &copy; 2025
        </p>
      </div>
    </div>
  );
};