/**
 * Storage Service - Správa LocalStorage pro persistence dat
 */

import type { ChatSession, ChatMessage } from '../types';
import { STORAGE_KEYS } from '../utils/constants';

class StorageServiceClass {
  /**
   * Uložit API klíč
   */
  saveApiKey(apiKey: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
    } catch (error) {
      console.error('Chyba při ukládání API klíče:', error);
    }
  }

  /**
   * Načíst API klíč
   */
  getApiKey(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.API_KEY);
    } catch (error) {
      console.error('Chyba při načítání API klíče:', error);
      return null;
    }
  }

  /**
   * Smazat API klíč
   */
  clearApiKey(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.API_KEY);
    } catch (error) {
      console.error('Chyba při mazání API klíče:', error);
    }
  }

  /**
   * Uložit seznam sessions
   */
  saveSessions(sessions: ChatSession[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (error) {
      console.error('Chyba při ukládání sessions:', error);
    }
  }

  /**
   * Načíst seznam sessions
   */
  getSessions(): ChatSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Chyba při načítání sessions:', error);
      return [];
    }
  }

  /**
   * Uložit zprávy pro konkrétní session
   */
  saveMessages(sessionId: string, messages: ChatMessage[]): void {
    try {
      const key = `${STORAGE_KEYS.MESSAGES_PREFIX}${sessionId}`;
      localStorage.setItem(key, JSON.stringify(messages));
    } catch (error) {
      console.error('Chyba při ukládání zpráv:', error);
    }
  }

  /**
   * Načíst zprávy pro konkrétní session
   */
  getMessages(sessionId: string): ChatMessage[] {
    try {
      const key = `${STORAGE_KEYS.MESSAGES_PREFIX}${sessionId}`;
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Chyba při načítání zpráv:', error);
      return [];
    }
  }

  /**
   * Smazat zprávy pro konkrétní session
   */
  clearMessages(sessionId: string): void {
    try {
      const key = `${STORAGE_KEYS.MESSAGES_PREFIX}${sessionId}`;
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Chyba při mazání zpráv:', error);
    }
  }

  /**
   * Uložit ID aktivní session
   */
  saveActiveSessionId(sessionId: string | null): void {
    try {
      if (sessionId) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, sessionId);
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
      }
    } catch (error) {
      console.error('Chyba při ukládání aktivní session:', error);
    }
  }

  /**
   * Načíst ID aktivní session
   */
  getActiveSessionId(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
    } catch (error) {
      console.error('Chyba při načítání aktivní session:', error);
      return null;
    }
  }

  /**
   * Vymazat všechna data
   */
  clearAll(): void {
    try {
      // Vymazat API klíč
      this.clearApiKey();
      
      // Vymazat sessions
      const sessions = this.getSessions();
      sessions.forEach(session => {
        this.clearMessages(session.id);
      });
      
      localStorage.removeItem(STORAGE_KEYS.SESSIONS);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    } catch (error) {
      console.error('Chyba při mazání všech dat:', error);
    }
  }
}

// Export singleton instance
export const StorageService = new StorageServiceClass();