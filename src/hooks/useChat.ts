/**
 * useChat Hook - Správa chatových zpráv a komunikace
 */

import { useCallback } from 'react';
import { useChatStore } from '../stores/chatStore';
import { useSessionStore } from '../stores/sessionStore';
import { useWebSocket } from './useWebSocket';
import type { MessageRole } from '../types';

export const useChat = () => {
  const {
    messages,
    isAgentTyping,
    error,
    addMessage,
    updateMessageStatus,
    setAgentTyping,
    loadMessagesForSession,
    clearMessages,
  } = useChatStore();

  const { activeSessionId, updateSessionLastMessage } = useSessionStore();
  const { send, isConnected } = useWebSocket();

  // Odeslat zprávu
  const sendMessage = useCallback(
    (content: string) => {
      if (!activeSessionId) {
        console.error('Žádná aktivní session');
        return;
      }

      if (!isConnected) {
        console.error('WebSocket není připojen');
        return;
      }

      // Přidat uživatelskou zprávu
      const userMessage = addMessage({
        sessionId: activeSessionId,
        role: 'user' as MessageRole,
        content,
        status: 'sending',
      });

      // Odeslat přes WebSocket
      try {
        send({
          session_id: activeSessionId,
          message: content,
          timestamp: Date.now(),
        });

        // Aktualizovat status na sent s malým zpožděním, aby se předešlo race condition
        // se přidáním zprávy do stavu.
        setTimeout(() => {
          updateMessageStatus(userMessage.id, 'sent');
        }, 0);

        // Aktualizovat session
        updateSessionLastMessage(activeSessionId);
      } catch (error) {
        console.error('Chyba při odesílání zprávy:', error);
        updateMessageStatus(userMessage.id, 'error', 'Nepodařilo se odeslat zprávu');
      }
    },
    [activeSessionId, isConnected, addMessage, send, updateMessageStatus, updateSessionLastMessage]
  );

  // Přidat odpověď od agenta
  const addAgentMessage = useCallback(
    (content: string) => {
      if (!activeSessionId) return;

      addMessage({
        sessionId: activeSessionId,
        role: 'agent' as MessageRole,
        content,
        status: 'sent',
      });

      updateSessionLastMessage(activeSessionId);
      setAgentTyping(false);
    },
    [activeSessionId, addMessage, updateSessionLastMessage, setAgentTyping]
  );

  return {
    messages,
    isAgentTyping,
    error,
    sendMessage,
    addAgentMessage,
    loadMessagesForSession,
    clearMessages,
  };
};