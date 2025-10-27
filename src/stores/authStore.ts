/**
 * Auth Store - Správa autentizačního stavu
 */

import { create } from 'zustand';
import { AuthService } from '../services/authService';
import { StorageService } from '../services/storageService';
import { SessionService } from '../services/sessionService';
import type { LoginCredentials } from '../types';

interface AuthStore {
  // State
  isAuthenticated: boolean;
  apiKey: string | null;
  username: string | null;
  error: string | null;
  isLoading: boolean;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithApiKey: (apiKey: string) => Promise<void>;
  logout: () => void;
  restoreSession: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  // Initial state
  isAuthenticated: false,
  apiKey: null,
  username: null,
  error: null,
  isLoading: false,

  // Přihlášení pomocí username/password
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await AuthService.login(credentials);
      StorageService.saveApiKey(response.api_key);
      
      // Nastavit API klíč pro SessionService
      SessionService.setApiKey(response.api_key);
      
      set({
        isAuthenticated: true,
        apiKey: response.api_key,
        username: response.username,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Přihlášení selhalo',
        isLoading: false,
        isAuthenticated: false,
      });
    }
  },

  // Přihlášení pomocí API klíče
  loginWithApiKey: async (apiKey) => {
    set({ isLoading: true, error: null });
    try {
      // Validovat API klíč
      const isValid = await AuthService.validateApiKey(apiKey);
      
      if (isValid) {
        StorageService.saveApiKey(apiKey);
        
        // Nastavit API klíč pro SessionService
        SessionService.setApiKey(apiKey);
        
        set({
          isAuthenticated: true,
          apiKey,
          username: null,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          error: 'Neplatný API klíč',
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      set({
        error: 'Chyba při validaci API klíče',
        isLoading: false,
        isAuthenticated: false,
      });
    }
  },

  // Odhlášení
  logout: () => {
    StorageService.clearApiKey();
    AuthService.logout();
    set({
      isAuthenticated: false,
      apiKey: null,
      username: null,
      error: null,
    });
  },

  // Obnovit session z localStorage
  restoreSession: () => {
    const apiKey = StorageService.getApiKey();
    if (apiKey) {
      // Nastavit API klíč pro SessionService
      SessionService.setApiKey(apiKey);
      
      set({
        isAuthenticated: true,
        apiKey,
        username: null,
      });
    }
  },

  // Vymazat chybu
  clearError: () => set({ error: null }),
}));