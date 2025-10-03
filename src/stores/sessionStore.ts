/**
 * Session Store - Správa chatových sessions
 */

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from '../services/storageService';
import type { ChatSession } from '../types';
import { SESSION_DEFAULTS } from '../utils/constants';

interface SessionStore {
  // State
  sessions: ChatSession[];
  activeSessionId: string | null;
  isLoading: boolean;

  // Actions
  createSession: (title?: string) => string;
  setActiveSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  updateSessionTitle: (sessionId: string, title: string) => void;
  updateSessionLastMessage: (sessionId: string) => void;
  loadSessions: () => void;
  clearSessions: () => void;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  // Initial state
  sessions: [],
  activeSessionId: null,
  isLoading: false,

  // Vytvořit novou session
  createSession: (title) => {
    const newSession: ChatSession = {
      id: uuidv4(),
      title: title || SESSION_DEFAULTS.DEFAULT_TITLE,
      createdAt: Date.now(),
      lastMessageAt: Date.now(),
      messageCount: 0,
    };

    set((state) => {
      const newSessions = [...state.sessions, newSession];
      StorageService.saveSessions(newSessions);
      StorageService.saveActiveSessionId(newSession.id);
      return {
        sessions: newSessions,
        activeSessionId: newSession.id,
      };
    });

    return newSession.id;
  },

  // Nastavit aktivní session
  setActiveSession: (sessionId) => {
    const { sessions } = get();
    const session = sessions.find((s) => s.id === sessionId);
    
    if (session) {
      StorageService.saveActiveSessionId(sessionId);
      set({ activeSessionId: sessionId });
    }
  },

  // Smazat session
  deleteSession: (sessionId) => {
    set((state) => {
      const newSessions = state.sessions.filter((s) => s.id !== sessionId);
      StorageService.saveSessions(newSessions);
      StorageService.clearMessages(sessionId);

      // Pokud mažeme aktivní session, nastavit jinou
      let newActiveSessionId = state.activeSessionId;
      if (state.activeSessionId === sessionId) {
        newActiveSessionId = newSessions.length > 0 ? newSessions[0].id : null;
        StorageService.saveActiveSessionId(newActiveSessionId);
      }

      return {
        sessions: newSessions,
        activeSessionId: newActiveSessionId,
      };
    });
  },

  // Aktualizovat název session
  updateSessionTitle: (sessionId, title) => {
    set((state) => {
      const newSessions = state.sessions.map((s) =>
        s.id === sessionId
          ? { ...s, title: title.slice(0, SESSION_DEFAULTS.TITLE_MAX_LENGTH) }
          : s
      );
      StorageService.saveSessions(newSessions);
      return { sessions: newSessions };
    });
  },

  // Aktualizovat čas poslední zprávy
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
      StorageService.saveSessions(newSessions);
      return { sessions: newSessions };
    });
  },

  // Načíst sessions z storage
  loadSessions: () => {
    set({ isLoading: true });
    const sessions = StorageService.getSessions();
    const activeSessionId = StorageService.getActiveSessionId();
    
    set({
      sessions,
      activeSessionId,
      isLoading: false,
    });
  },

  // Vymazat všechny sessions
  clearSessions: () => {
    const { sessions } = get();
    sessions.forEach((session) => {
      StorageService.clearMessages(session.id);
    });
    StorageService.saveSessions([]);
    StorageService.saveActiveSessionId(null);
    set({
      sessions: [],
      activeSessionId: null,
    });
  },
}));