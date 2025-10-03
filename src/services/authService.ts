/**
 * Auth Service - Správa autentizace a HTTP komunikace
 */

import type { LoginCredentials, LoginResponse } from '../types';
import { API_CONFIG, API_ENDPOINTS } from '../config/api.config';

class AuthServiceClass {
  /**
   * Přihlášení pomocí username a password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'Přihlášení selhalo');
      }

      const data: LoginResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Nepodařilo se připojit k serveru');
    }
  }

  /**
   * Validace API klíče
   * Zkusí připojit WebSocket s API klíčem
   */
  async validateApiKey(apiKey: string): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const wsUrl = `${API_CONFIG.WS_URL}?api_key=${apiKey}`;
        const ws = new WebSocket(wsUrl);

        const timeout = setTimeout(() => {
          ws.close();
          resolve(false);
        }, 5000);

        ws.onopen = () => {
          clearTimeout(timeout);
          ws.close();
          resolve(true);
        };

        ws.onerror = () => {
          clearTimeout(timeout);
          resolve(false);
        };
      } catch {
        resolve(false);
      }
    });
  }

  /**
   * Odhlášení (volitelné - může zavolat backend endpoint)
   */
  async logout(): Promise<void> {
    try {
      // Volitelně: zavolat logout endpoint na backendu
      // await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.LOGOUT}`, {
      //   method: 'POST',
      // });
    } catch (error) {
      console.error('Chyba při odhlášení:', error);
    }
  }
}

// Export singleton instance
export const AuthService = new AuthServiceClass();