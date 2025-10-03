/**
 * useWebSocket Hook - Správa WebSocket připojení a zpráv
 */

import { useEffect, useCallback } from 'react';
import { useWebSocketStore } from '../stores/websocketStore';
import { useChatStore } from '../stores/chatStore';
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

  const { setAgentTyping } = useChatStore();

  // Nastavit message listener při mount
  useEffect(() => {
    const unsubscribeMessage = WebSocketService.onMessage(handleMessage);
    const unsubscribeStatus = WebSocketService.onStatusChange(handleStatusChange);

    return () => {
      unsubscribeMessage();
      unsubscribeStatus();
    };
  }, []);

  // Handler pro příchozí zprávy
  const handleMessage = useCallback((message: WSMessage) => {
    console.log('🔵 WebSocket received message:', message);
    
    if (message.type === 'response' && message.content) {
      // Agent odpověď
      console.log('📨 Agent response received:', message.content);
      setAgentTyping(false);
      // TODO: Přidat zprávu od agenta (sessionId se nastaví z aktivní session)
      console.warn('⚠️ Agent message NOT added to store - this is the bug!');
    } else if (message.type === 'status') {
      // Status zpráva (např. "agent začal psát")
      if (message.content === 'typing') {
        setAgentTyping(true);
      }
    } else if (message.type === 'error') {
      // Chybová zpráva
      setError(message.error || 'Neznámá chyba');
      setAgentTyping(false);
    }
  }, [setAgentTyping, setError]);

  // Handler pro změnu stavu připojení
  const handleStatusChange = useCallback((newStatus: string) => {
    setStatus(newStatus as any);
    
    if (newStatus === 'connected') {
      resetReconnectAttempts();
    }
  }, [setStatus, resetReconnectAttempts]);

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