/**
 * Chatová session
 */
export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  lastMessageAt: number;
  messageCount: number;
}

/**
 * Stav sessions
 */
export interface SessionState {
  sessions: ChatSession[];
  activeSessionId: string | null;
  isLoading: boolean;
}