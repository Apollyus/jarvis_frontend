/**
 * Session Service - Správa sessions přes REST API
 */

import { API_CONFIG } from '../config/api.config';
import type {
  BackendSession,
  SessionHistory,
  SessionListResponse,
  NewSessionResponse,
} from '../types/session.types';

class SessionServiceClass {
  private apiKey: string | null = null;

  /**
   * Nastavit API klíč pro requests
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * Získat headers s API klíčem
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }

    return headers;
  }

  /**
   * Vytvořit novou session
   * POST /api/sessions/new
   */
  async createSession(): Promise<NewSessionResponse> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/sessions/new`, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'Nepodařilo se vytvořit session');
      }

      return await response.json();
    } catch (error) {
      console.error('Chyba při vytváření session:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Nepodařilo se připojit k serveru');
    }
  }

  /**
   * Získat seznam všech aktivních sessions
   * GET /api/sessions
   */
  async getSessions(): Promise<SessionListResponse> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/sessions`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'Nepodařilo se načíst sessions');
      }

      return await response.json();
    } catch (error) {
      console.error('Chyba při načítání sessions:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Nepodařilo se připojit k serveru');
    }
  }

  /**
   * Získat informace o konkrétní session
   * GET /api/sessions/{session_id}
   */
  async getSessionInfo(sessionId: string): Promise<BackendSession> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/sessions/${sessionId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'Nepodařilo se načíst session info');
      }

      return await response.json();
    } catch (error) {
      console.error('Chyba při načítání session info:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Nepodařilo se připojit k serveru');
    }
  }

  /**
   * Získat historii konverzace
   * GET /api/sessions/{session_id}/history
   */
  async getSessionHistory(sessionId: string): Promise<SessionHistory> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/sessions/${sessionId}/history`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'Nepodařilo se načíst historii');
      }

      return await response.json();
    } catch (error) {
      console.error('Chyba při načítání historie:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Nepodařilo se připojit k serveru');
    }
  }

  /**
   * Smazat session
   * DELETE /api/sessions/{session_id}
   */
  async deleteSession(sessionId: string): Promise<void> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'Nepodařilo se smazat session');
      }

      // Response může být pouze message potvrzující smazání
      await response.json();
    } catch (error) {
      console.error('Chyba při mazání session:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Nepodařilo se připojit k serveru');
    }
  }
}

// Export singleton instance
export const SessionService = new SessionServiceClass();
