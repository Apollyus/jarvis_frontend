/**
 * WebSocket Store - Správa WebSocket připojení
 */

import { create } from 'zustand';
import { WebSocketService } from '../services/websocketService';
import type { ConnectionStatus, WSOutgoingMessage } from '../types';

interface WebSocketStore {
  // State
  status: ConnectionStatus;
  error: string | null;
  reconnectAttempts: number;

  // Actions
  connect: (apiKey: string) => void;
  disconnect: () => void;
  sendMessage: (message: WSOutgoingMessage) => void;
  setStatus: (status: ConnectionStatus) => void;
  setError: (error: string | null) => void;
  incrementReconnectAttempts: () => void;
  resetReconnectAttempts: () => void;
}

export const useWebSocketStore = create<WebSocketStore>((set, get) => ({
  // Initial state
  status: 'disconnected',
  error: null,
  reconnectAttempts: 0,

  // Připojit WebSocket
  connect: (apiKey) => {
    set({ status: 'connecting', error: null });
    WebSocketService.connect(apiKey);
  },

  // Odpojit WebSocket
  disconnect: () => {
    WebSocketService.disconnect();
    set({ status: 'disconnected', reconnectAttempts: 0, error: null });
  },

  // Odeslat zprávu
  sendMessage: (message) => {
    const { status } = get();
    if (status === 'connected') {
      WebSocketService.sendMessage(message);
    } else {
      set({ error: 'Není připojeno k serveru' });
    }
  },

  // Nastavit stav připojení
  setStatus: (status) => set({ status }),

  // Nastavit chybu
  setError: (error) => set({ error }),

  // Inkrementovat počet reconnect pokusů
  incrementReconnectAttempts: () =>
    set((state) => ({ reconnectAttempts: state.reconnectAttempts + 1 })),

  // Resetovat počet reconnect pokusů
  resetReconnectAttempts: () => set({ reconnectAttempts: 0 }),
}));