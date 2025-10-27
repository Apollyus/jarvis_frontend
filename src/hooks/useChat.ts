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
    getCurrentSessionId,
  } = useChatStore();

  const { activeSessionId, updateSessionLastMessage } = useSessionStore();
  const { send, isConnected } = useWebSocket();

  // Odeslat zprávu
  const sendMessage = useCallback(
    (content: string) => {
      if (!isConnected) {
        console.error('WebSocket není připojen');
        return;
      }

      // Získat aktuální session_id z ChatStore (může být null pro první zprávu)
      const currentSessionId = getCurrentSessionId();
      
      // Přidat uživatelskou zprávu (použijeme activeSessionId nebo currentSessionId jako fallback)
      const sessionIdForMessage = currentSessionId || activeSessionId || 'temp';
      
      const userMessage = addMessage({
        sessionId: sessionIdForMessage,
        role: 'user' as MessageRole,
        content,
        status: 'sending',
      });

      // Odeslat přes WebSocket - session_id je volitelné
      // Pokud je null/undefined, backend vytvoří nový
      try {
        const payload: any = {
          message: content,
          timestamp: Date.now(),
        };
        
        // Přidat session_id pouze pokud existuje
        if (currentSessionId) {
          payload.session_id = currentSessionId;
        }
        
        console.log('📤 Sending message with payload:', payload);
        
        send(payload);

        // Aktualizovat status na sent s malým zpožděním
        setTimeout(() => {
          updateMessageStatus(userMessage.id, 'sent');
        }, 0);

        // Aktualizovat session (pokud existuje)
        if (currentSessionId && activeSessionId) {
          updateSessionLastMessage(activeSessionId);
        }
      } catch (error) {
        console.error('Chyba při odesílání zprávy:', error);
        updateMessageStatus(userMessage.id, 'error', 'Nepodařilo se odeslat zprávu');
      }
    },
    [isConnected, addMessage, send, updateMessageStatus, updateSessionLastMessage, activeSessionId, getCurrentSessionId]
  );

  // Přidat odpověď od agenta
  const addAgentMessage = useCallback(
    (content: string) => {
      if (!activeSessionId) return;

      // Prevent duplicate agent messages: if the most recent agent message
      // already has the same content, don't add it again. This covers the
      // case where both the websocket handler and other logic might try to
      // insert the same agent reply.
      const lastAgent = messages
        .slice()
        .reverse()
        .find((m) => m.role === 'agent');

      if (lastAgent && lastAgent.content === content) {
        // Already have the same agent message — just ensure typing is false
        setAgentTyping(false);
        return;
      }

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