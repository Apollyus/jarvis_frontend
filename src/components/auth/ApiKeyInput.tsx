/**
 * ApiKeyInput - Formulář pro přímé zadání API klíče
 */

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const ApiKeyInput = () => {
  const [apiKey, setApiKey] = useState('');
  const { loginWithApiKey, isLoading, error } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await loginWithApiKey(apiKey.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
          API Klíč
        </label>
        <input
          id="apiKey"
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="input-field font-mono text-sm"
          placeholder="Zadejte váš API klíč"
          required
          disabled={isLoading}
          autoComplete="off"
        />
        <p className="mt-1 text-xs text-gray-500">
          Zadejte API klíč získaný z backendu
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !apiKey.trim()}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" />
            <span>Ověřování...</span>
          </>
        ) : (
          'Pokračovat s API klíčem'
        )}
      </button>
    </form>
  );
};