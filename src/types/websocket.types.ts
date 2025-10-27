/**
 * Stav WebSocket připojení
 */
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

/**
 * WebSocket zpráva od serveru
 */
export interface WSMessage {
  type: 'status' | 'response' | 'error';
  message?: string;
  error?: string;
  session_id?: string; // Backend vrací session_id v response
  timestamp?: number;
}

/**
 * WebSocket zpráva pro odeslání
 */
export interface WSOutgoingMessage {
  session_id?: string; // Volitelné - pokud není, backend vytvoří nový
  message: string;
  timestamp: number;
}

/**
 * WebSocket stav
 */
export interface WebSocketState {
  status: ConnectionStatus;
  error: string | null;
  reconnectAttempts: number;
}