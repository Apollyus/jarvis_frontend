/**
 * useSession Hook - Správa sessions
 */

import { useSessionStore } from '../stores/sessionStore';
import { useChatStore } from '../stores/chatStore';

export const useSession = () => {
  const {
    sessions,
    activeSessionId,
    isLoading,
    createSession,
    setActiveSession,
    deleteSession,
    updateSessionTitle,
    updateSessionLastMessage,
    loadSessions,
  } = useSessionStore();

  const { loadMessagesForSession, clearMessages } = useChatStore();

  // Aktivní session objekt
  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;

  // Přepnout na session
  const switchSession = (sessionId: string) => {
    setActiveSession(sessionId);
    loadMessagesForSession(sessionId);
  };

  // Vytvořit novou session a přepnout na ni
  const createNewSession = (title?: string) => {
    const newSessionId = createSession(title);
    clearMessages();
    return newSessionId;
  };

  // Smazat session
  const removeSession = (sessionId: string) => {
    deleteSession(sessionId);
    // Pokud mažeme aktivní session, zprávy se automaticky vymažou v store
    if (sessionId === activeSessionId && sessions.length > 1) {
      const remainingSessions = sessions.filter((s) => s.id !== sessionId);
      if (remainingSessions.length > 0) {
        switchSession(remainingSessions[0].id);
      }
    }
  };

  return {
    sessions,
    activeSession,
    activeSessionId,
    isLoading,
    createSession: createNewSession,
    switchSession,
    deleteSession: removeSession,
    updateSessionTitle,
    updateSessionLastMessage,
    loadSessions,
  };
};