/**
 * Session Store - Správa chatových sessions s backend integrací
 */

import { create } from 'zustand';
import { SessionService } from '../services/sessionService';
import type { ChatSession } from '../types';
import { SESSION_DEFAULTS } from '../utils/constants';

interface SessionStore {
  // State
  sessions: ChatSession[];
  activeSessionId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  createSession: () => Promise<string>;
  setActiveSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => Promise<void>;
  updateSessionTitle: (sessionId: string, title: string) => void;
  updateSessionLastMessage: (sessionId: string) => void;
  loadSessions: () => Promise<void>;
  loadSessionInfo: (sessionId: string) => Promise<void>;
  clearSessions: () => void;
  setError: (error: string | null) => void;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  // Initial state
  sessions: [],
  activeSessionId: null,
  isLoading: false,
  error: null,

  // Vytvořit novou session na backendu
  createSession: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await SessionService.createSession();
      const sessionId = response.session_id;

      const newSession: ChatSession = {
        id: sessionId,
        title: SESSION_DEFAULTS.DEFAULT_TITLE,
        createdAt: Date.now(),
        lastMessageAt: Date.now(),
        messageCount: 0,
      };

      set((state) => ({
        sessions: [...state.sessions, newSession],
        activeSessionId: sessionId,
        isLoading: false,
      }));

      console.log('✅ Nová session vytvořena:', sessionId);
      return sessionId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Nepodařilo se vytvořit session';
      console.error('❌ Chyba při vytváření session:', error);
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Nastavit aktivní session
  setActiveSession: (sessionId) => {
    const { sessions } = get();
    const session = sessions.find((s) => s.id === sessionId);
    
    if (session) {
      set({ activeSessionId: sessionId });
    } else {
      console.warn('⚠️ Session nenalezena:', sessionId);
    }
  },

  // Smazat session na backendu
  deleteSession: async (sessionId) => {
    set({ isLoading: true, error: null });
    try {
      await SessionService.deleteSession(sessionId);

      set((state) => {
        const newSessions = state.sessions.filter((s) => s.id !== sessionId);

        // Pokud mažeme aktivní session, nastavit jinou
        let newActiveSessionId = state.activeSessionId;
        if (state.activeSessionId === sessionId) {
          newActiveSessionId = newSessions.length > 0 ? newSessions[0].id : null;
        }

        return {
          sessions: newSessions,
          activeSessionId: newActiveSessionId,
          isLoading: false,
        };
      });

      console.log('✅ Session smazána:', sessionId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Nepodařilo se smazat session';
      console.error('❌ Chyba při mazání session:', error);
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Aktualizovat název session (pouze lokálně)
  updateSessionTitle: (sessionId, title) => {
    set((state) => {
      const newSessions = state.sessions.map((s) =>
        s.id === sessionId
          ? { ...s, title: title.slice(0, SESSION_DEFAULTS.TITLE_MAX_LENGTH) }
          : s
      );
      return { sessions: newSessions };
    });
  },

  // Aktualizovat čas poslední zprávy (pouze lokálně)
  updateSessionLastMessage: (sessionId) => {
    set((state) => {
      const newSessions = state.sessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              lastMessageAt: Date.now(),
              messageCount: s.messageCount + 1,
            }
          : s
      );
      return { sessions: newSessions };
    });
  },

  // Načíst sessions z backendu
  loadSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await SessionService.getSessions();
      
      // Převést session IDs na ChatSession objekty
      const sessions: ChatSession[] = await Promise.all(
        response.sessions.map(async (sessionId) => {
          try {
            const info = await SessionService.getSessionInfo(sessionId);
            return {
              id: sessionId,
              title: SESSION_DEFAULTS.DEFAULT_TITLE, // Můžeme později přidat generování z první zprávy
              createdAt: new Date(info.updated_at).getTime(), // Použijeme updated_at jako fallback
              lastMessageAt: new Date(info.updated_at).getTime(),
              messageCount: info.message_count,
            };
          } catch (error) {
            console.error('Chyba při načítání info pro session:', sessionId, error);
            // Fallback pokud info selže
            return {
              id: sessionId,
              title: SESSION_DEFAULTS.DEFAULT_TITLE,
              createdAt: Date.now(),
              lastMessageAt: Date.now(),
              messageCount: 0,
            };
          }
        })
      );

      // Seřadit podle lastMessageAt (nejnovější první)
      sessions.sort((a, b) => b.lastMessageAt - a.lastMessageAt);

      set({
        sessions,
        isLoading: false,
      });

      console.log('✅ Sessions načteny z backendu:', sessions.length);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Nepodařilo se načíst sessions';
      console.error('❌ Chyba při načítání sessions:', error);
      set({ error: errorMessage, isLoading: false, sessions: [] });
    }
  },

  // Načíst info o konkrétní session
  loadSessionInfo: async (sessionId) => {
    try {
      const info = await SessionService.getSessionInfo(sessionId);
      
      set((state) => {
        const newSessions = state.sessions.map((s) =>
          s.id === sessionId
            ? {
                ...s,
                lastMessageAt: new Date(info.updated_at).getTime(),
                messageCount: info.message_count,
              }
            : s
        );
        return { sessions: newSessions };
      });
    } catch (error) {
      console.error('Chyba při načítání session info:', error);
    }
  },

  // Vymazat všechny sessions (pouze lokálně - backend má TTL)
  clearSessions: () => {
    set({
      sessions: [],
      activeSessionId: null,
    });
  },

  // Nastavit chybu
  setError: (error) => set({ error }),
}));