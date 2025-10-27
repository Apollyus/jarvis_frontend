/**
 * Storage Service - Správa LocalStorage (pouze API klíč)
 * Sessions a zprávy jsou nyní na backendu (Redis)
 */

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
   * Vymazat všechna data
   */
  clearAll(): void {
    try {
      this.clearApiKey();
      // Vymazat i staré keys pokud existují
      localStorage.removeItem(STORAGE_KEYS.SESSIONS);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
      
      // Vymazat všechny message keys (začínají prefix)
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_KEYS.MESSAGES_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Chyba při mazání všech dat:', error);
    }
  }
}

// Export singleton instance
export const StorageService = new StorageServiceClass();