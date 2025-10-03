/**
 * useAuth Hook - Zjednodušené rozhraní pro autentizaci
 */

import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
  const {
    isAuthenticated,
    apiKey,
    username,
    error,
    isLoading,
    login,
    loginWithApiKey,
    logout,
    restoreSession,
    clearError,
  } = useAuthStore();

  return {
    isAuthenticated,
    apiKey,
    username,
    error,
    isLoading,
    login,
    loginWithApiKey,
    logout,
    restoreSession,
    clearError,
  };
};