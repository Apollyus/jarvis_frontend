/**
 * Typ zprávy
 */
export type MessageRole = 'user' | 'agent' | 'system';

/**
 * Status zprávy
 */
export type MessageStatus = 'sending' | 'sent' | 'error';

/**
 * Chatová zpráva
 */
export interface ChatMessage {
  id: string;
  sessionId: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  status?: MessageStatus;
  error?: string;
}

/**
 * Stav chatu
 */
export interface ChatState {
  messages: ChatMessage[];
  isAgentTyping: boolean;
  error: string | null;
}