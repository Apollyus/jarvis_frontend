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
  timestamp?: number;
}

/**
 * WebSocket zpráva pro odeslání
 */
export interface WSOutgoingMessage {
  session_id: string;
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