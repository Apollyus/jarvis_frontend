/**
 * Chatová session (frontend reprezentace)
 */
export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  lastMessageAt: number;
  messageCount: number;
}

/**
 * Backend session info (z API)
 */
export interface BackendSession {
  session_id: string;
  message_count: number;
  updated_at: string; // ISO timestamp
  expires_in_seconds: number;
}

/**
 * Session historie (z API)
 */
export interface SessionHistory {
  session_id: string;
  history: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  message_count: number;
}

/**
 * Response z GET /api/sessions
 */
export interface SessionListResponse {
  sessions: string[]; // List of session IDs
  count: number;
}

/**
 * Response z POST /api/sessions/new
 */
export interface NewSessionResponse {
  session_id: string;
  message: string;
}

/**
 * Stav sessions
 */
export interface SessionState {
  sessions: ChatSession[];
  activeSessionId: string | null;
  isLoading: boolean;
}