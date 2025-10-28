/**
 * Chat Store - Správa chatových zpráv s backend integrací
 */

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { SessionService } from '../services/sessionService';
import type { ChatMessage, MessageStatus } from '../types';

interface ChatStore {
  // State
  messages: ChatMessage[];
  isAgentTyping: boolean;
  error: string | null;
  currentSessionId: string | null; // Aktuální session_id z backendu

  // Actions
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => ChatMessage;
  updateMessageStatus: (id: string, status: MessageStatus, error?: string) => void;
  setAgentTyping: (isTyping: boolean) => void;
  clearMessages: () => void;
  loadMessagesForSession: (sessionId: string) => Promise<void>;
  setError: (error: string | null) => void;
  setCurrentSessionId: (sessionId: string | null) => void;
  getCurrentSessionId: () => string | null;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  // Initial state
  messages: [],
  isAgentTyping: false,
  error: null,
  currentSessionId: null,

  // Přidat novou zprávu
  addMessage: (messageData) => {
    // If this is an agent message, check the last agent message to avoid duplicates
    if (messageData.role === 'agent') {
      const lastAgent = get().messages
        .slice()
        .reverse()
        .find((m) => m.role === 'agent');

      if (lastAgent && lastAgent.content === messageData.content) {
        console.log('💾 ChatStore: Duplicate agent message detected, skipping add.');
        return lastAgent;
      }
    }

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
      // Zprávy jsou nyní na backendu, neukládáme do LocalStorage
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
      
      // Zprávy jsou na backendu, neukládáme do LocalStorage
      return { messages: newMessages };
    });
  },

  // Nastavit stav "agent píše"
  setAgentTyping: (isTyping) => set({ isAgentTyping: isTyping }),

  // Vymazat všechny zprávy (pouze lokálně)
  clearMessages: () => set({ messages: [] }), // 🔑 Nemazat currentSessionId!

  // Načíst zprávy pro konkrétní session z backendu
  loadMessagesForSession: async (sessionId) => {
    try {
      console.log('📥 Loading messages for session:', sessionId);
      const history = await SessionService.getSessionHistory(sessionId);
      
      // Převést backend historii na ChatMessage objekty
      const messages: ChatMessage[] = history.history.map((msg, index) => ({
        id: `${sessionId}-${index}`, // Generujeme ID z pozice
        sessionId: sessionId,
        role: msg.role === 'assistant' ? 'agent' : 'user', // Backend používá 'assistant', my 'agent'
        content: msg.content,
        timestamp: Date.now() - (history.history.length - index) * 1000, // Odhad timestampu
        status: 'sent' as MessageStatus,
      }));

      set({ 
        messages, 
        error: null,
        currentSessionId: sessionId, // 🔑 Nastavit currentSessionId při načtení zpráv
      });

      console.log('✅ Messages loaded from backend:', messages.length);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Nepodařilo se načíst zprávy';
      console.error('❌ Chyba při načítání zpráv:', error);
      set({ error: errorMessage, messages: [] });
    }
  },

  // Nastavit chybu
  setError: (error) => set({ error }),

  // Nastavit aktuální session ID (z backendu)
  setCurrentSessionId: (sessionId) => {
    console.log('🔑 Setting current session ID:', sessionId);
    set({ currentSessionId: sessionId });
  },

  // Získat aktuální session ID
  getCurrentSessionId: () => get().currentSessionId,
}));