/**
 * useWebSocket Hook - Správa WebSocket připojení a zpráv
 */

import { useEffect, useCallback } from 'react';
import { useWebSocketStore } from '../stores/websocketStore';
import { useChatStore } from '../stores/chatStore';
import { useSessionStore } from '../stores/sessionStore';
import { WebSocketService } from '../services/websocketService';
import type { WSMessage, WSOutgoingMessage } from '../types';

export const useWebSocket = () => {
  const {
    status,
    error,
    reconnectAttempts,
    connect,
    disconnect,
    sendMessage,
    setStatus,
    setError,
    resetReconnectAttempts,
  } = useWebSocketStore();

  const { addMessage, setAgentTyping } = useChatStore();
  const { activeSessionId } = useSessionStore();

  // Handler pro příchozí zprávy
  const handleMessage = useCallback((message: WSMessage) => {
    console.log('🔵 WebSocket received message:', message);
    
    if (message.type === 'response' && message.message) {
      if (!activeSessionId) {
        console.error('Chyba: Přijata zpráva od agenta, ale není aktivní session.');
        return;
      }
      // Agent odpověď
      addMessage({
        sessionId: activeSessionId,
        role: 'agent',
        content: message.message,
        status: 'sent',
      });
      setAgentTyping(false);
    } else if (message.type === 'status') {
      // Status zpráva (např. "agent začal psát" nebo "Processing...")
      if (message.message === 'typing') {
        setAgentTyping(true);
      } else if (message.message === 'Processing...') {
        setAgentTyping(true);
      }
      // Ostatní status zprávy ignorujeme nebo logujeme
    } else if (message.type === 'error') {
      // Chybová zpráva - zobrazíme ji jako system message v chatu
      const errorMessage = message.message || message.error || 'Neznámá chyba';
      
      if (!activeSessionId) {
        console.error('WebSocket error:', errorMessage);
        setError(errorMessage);
        return;
      }
      
      // Zobrazíme error jako system zprávu v chatu
      addMessage({
        sessionId: activeSessionId,
        role: 'system',
        content: `⚠️ ${errorMessage}`,
        status: 'sent',
      });
      
      setAgentTyping(false);
    }
  }, [activeSessionId, addMessage, setAgentTyping, setError]);

  // Handler pro změnu stavu připojení
  const handleStatusChange = useCallback((newStatus: string) => {
    setStatus(newStatus as any);
    
    if (newStatus === 'connected') {
      resetReconnectAttempts();
    }
  }, [setStatus, resetReconnectAttempts]);

  // Nastavit message listener při mount
  useEffect(() => {
    const unsubscribeMessage = WebSocketService.onMessage(handleMessage);
    const unsubscribeStatus = WebSocketService.onStatusChange(handleStatusChange);

    return () => {
      unsubscribeMessage();
      unsubscribeStatus();
    };
  }, [handleMessage, handleStatusChange]);

  // Odeslat zprávu
  const send = useCallback((message: WSOutgoingMessage) => {
    sendMessage(message);
  }, [sendMessage]);

  return {
    status,
    error,
    reconnectAttempts,
    isConnected: status === 'connected',
    isConnecting: status === 'connecting',
    connect,
    disconnect,
    send,
  };
};
