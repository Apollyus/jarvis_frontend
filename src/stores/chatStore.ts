/**
 * Chat Store - Správa chatových zpráv
 */

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from '../services/storageService';
import type { ChatMessage, MessageStatus } from '../types';

interface ChatStore {
  // State
  messages: ChatMessage[];
  isAgentTyping: boolean;
  error: string | null;

  // Actions
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => ChatMessage;
  updateMessageStatus: (id: string, status: MessageStatus, error?: string) => void;
  setAgentTyping: (isTyping: boolean) => void;
  clearMessages: () => void;
  loadMessagesForSession: (sessionId: string) => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  // Initial state
  messages: [],
  isAgentTyping: false,
  error: null,

  // Přidat novou zprávu
  addMessage: (messageData) => {
    const message: ChatMessage = {
      ...messageData,
      id: uuidv4(),
      timestamp: Date.now(),
      status: messageData.status || 'sent',
    };

    console.log('💾 ChatStore: Adding message:', message);

    set((state) => {
      const newMessages = [...state.messages, message];
      console.log('💾 ChatStore: Total messages now:', newMessages.length);
      // Uložit do storage
      StorageService.saveMessages(message.sessionId, newMessages);
      return { messages: newMessages };
    });

    return message;
  },

  // Aktualizovat status zprávy
  updateMessageStatus: (id, status, error) => {
    set((state) => {
      const newMessages = state.messages.map((msg) =>
        msg.id === id ? { ...msg, status, error } : msg
      );
      
      // Uložit do storage
      const sessionId = state.messages.find(msg => msg.id === id)?.sessionId;
      if (sessionId) {
        StorageService.saveMessages(sessionId, newMessages);
      }
      
      return { messages: newMessages };
    });
  },

  // Nastavit stav "agent píše"
  setAgentTyping: (isTyping) => set({ isAgentTyping: isTyping }),

  // Vymazat všechny zprávy
  clearMessages: () => set({ messages: [] }),

  // Načíst zprávy pro konkrétní session
  loadMessagesForSession: (sessionId) => {
    const messages = StorageService.getMessages(sessionId);
    set({ messages, error: null });
  },

  // Nastavit chybu
  setError: (error) => set({ error }),
}));