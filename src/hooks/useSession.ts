/**
 * useSession Hook - Správa sessions s backend integrací
 */

import { useSessionStore } from '../stores/sessionStore';
import { useChatStore } from '../stores/chatStore';

export const useSession = () => {
  const {
    sessions,
    activeSessionId,
    isLoading,
    error,
    createSession,
    setActiveSession,
    deleteSession,
    updateSessionTitle,
    updateSessionLastMessage,
    loadSessions,
    refreshSessions,
    clearSessions,
  } = useSessionStore();

  const { loadMessagesForSession, clearMessages, setCurrentSessionId } = useChatStore();

  // Aktivní session objekt
  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;

  // Přepnout na session
  const switchSession = async (sessionId: string) => {
    setActiveSession(sessionId);
    // Načíst zprávy z backendu
    await loadMessagesForSession(sessionId);
  };

  // Vytvořit novou session (na backendu)
  const createNewSession = async () => {
    try {
      const newSessionId = await createSession();
      clearMessages(); // Vymazat staré zprávy z UI
      setCurrentSessionId(newSessionId); // 🔑 Nastavit currentSessionId pro odesílání zpráv
      return newSessionId;
    } catch (error) {
      console.error('Chyba při vytváření nové session:', error);
      throw error;
    }
  };

  // Smazat session (na backendu)
  const removeSession = async (sessionId: string) => {
    try {
      await deleteSession(sessionId);
      
      // Pokud mažeme aktivní session, přepnout na jinou
      if (sessionId === activeSessionId && sessions.length > 1) {
        const remainingSessions = sessions.filter((s) => s.id !== sessionId);
        if (remainingSessions.length > 0) {
          await switchSession(remainingSessions[0].id);
        } else {
          clearMessages();
        }
      }
    } catch (error) {
      console.error('Chyba při mazání session:', error);
      throw error;
    }
  };

  // Smazat všechny sessions (pouze lokálně - backend má TTL)
  const removeAllSessions = () => {
    clearMessages();
    clearSessions();
  };

  return {
    sessions,
    activeSession,
    activeSessionId,
    isLoading,
    error,
    createSession: createNewSession,
    switchSession,
    deleteSession: removeSession,
    deleteAllSessions: removeAllSessions,
    updateSessionTitle,
    updateSessionLastMessage,
    loadSessions,
    refreshSessions, // 🆕 Export refresh metody
  };
};