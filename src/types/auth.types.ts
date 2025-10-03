/**
 * Stav autentizace uživatele
 */
export interface AuthState {
  isAuthenticated: boolean;
  apiKey: string | null;
  username: string | null;
  error: string | null;
}

/**
 * Přihlašovací údaje
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Odpověď z login endpointu
 */
export interface LoginResponse {
  api_key: string;
  username: string;
  expires_at?: string;
}