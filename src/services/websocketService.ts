/**
 * WebSocket Service - Správa WebSocket připojení a komunikace
 */

import type { WSMessage, WSOutgoingMessage, ConnectionStatus } from '../types';
import { API_CONFIG } from '../config/api.config';

type MessageCallback = (message: WSMessage) => void;
type StatusCallback = (status: ConnectionStatus) => void;

class WebSocketServiceClass {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private reconnectTimeout: number | null = null;
  private messageCallbacks: MessageCallback[] = [];
  private statusCallbacks: StatusCallback[] = [];
  private currentApiKey: string | null = null;
  private manuallyClosed = false;

  /**
   * Připojit WebSocket
   */
  connect(apiKey: string): void {
    // Pokud se API klíč změnil, odpojit starý socket
    if (this.currentApiKey && this.currentApiKey !== apiKey && this.ws) {
      console.log('🔄 API klíč se změnil, odpojuji starý socket...');
      this.ws.close();
      this.ws = null;
    }

    // Pokud už existuje socket se STEJNÝM klíčem, a je v procesu připojování nebo již otevřen,
    // nepokoušíme se vytvořit nový - zabrání to duplikovaným spojením.
    const wsState = this.ws?.readyState;
    if ((wsState === WebSocket.OPEN || wsState === WebSocket.CONNECTING) && this.currentApiKey === apiKey) {
      console.log('✅ WebSocket už je připojen se stejným API klíčem');
      return;
    }

    // Ujistíme se, že starý reconnect timeout je zrušen
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout as any);
      this.reconnectTimeout = null;
    }

    // Reset manuallyClosed flag když voláme connect explicitně
    this.manuallyClosed = false;
    this.currentApiKey = apiKey;
    this.updateStatus('connecting');

    try {
      const wsUrl = `${API_CONFIG.WS_URL}?api_key=${apiKey}`;
      console.log('🔌 Connecting to WebSocket...');
      
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onerror = this.handleError.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
    } catch (error) {
      console.error('Chyba při vytváření WebSocket:', error);
      this.updateStatus('error');
    }
  }

  /**
   * Odpojit WebSocket
   */
  disconnect(): void {
    // Zrušit reconnect timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    // Označíme, že bylo provedené manuální zavření (to zamezí reconnectu)
    this.manuallyClosed = true;

    // Zavřít WebSocket
    if (this.ws) {
      try {
        this.ws.close();
      } catch (e) {
        console.error('Chyba při zavírání WebSocket:', e);
      }
      this.ws = null;
    }

    this.reconnectAttempts = 0;
    this.currentApiKey = null;
    this.updateStatus('disconnected');
  }

  /**
   * Odeslat zprávu
   */
  sendMessage(message: WSOutgoingMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
      } catch (error) {
        console.error('Chyba při odesílání zprávy:', error);
      }
    } else {
      console.error('WebSocket není připojen');
    }
  }

  /**
   * Registrovat callback pro příchozí zprávy
   */
  onMessage(callback: MessageCallback): () => void {
    this.messageCallbacks.push(callback);
    // Vrátit funkci pro zrušení registrace
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Registrovat callback pro změny stavu
   */
  onStatusChange(callback: StatusCallback): () => void {
    this.statusCallbacks.push(callback);
    // Vrátit funkci pro zrušení registrace
    return () => {
      this.statusCallbacks = this.statusCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Handler pro otevření spojení
   */
  private handleOpen(): void {
    console.log('WebSocket připojen');
    this.reconnectAttempts = 0;
    this.updateStatus('connected');
  }

  /**
   * Handler pro příchozí zprávu
   */
  private handleMessage(event: MessageEvent): void {
    try {
      const message: WSMessage = JSON.parse(event.data);
      this.messageCallbacks.forEach(callback => {
        try {
          callback(message);
        } catch (error) {
          console.error('Chyba v message callback:', error);
        }
      });
    } catch (error) {
      console.error('Chyba při parsování zprávy:', error);
    }
  }

  /**
   * Handler pro chybu
   */
  private handleError(error: Event): void {
    console.error('WebSocket error:', error);
    this.updateStatus('error');
  }

  /**
   * Handler pro zavření spojení
   */
  private handleClose(event: CloseEvent): void {
    console.log('WebSocket odpojen', { code: event.code, reason: event.reason });
    
    // Vypisování specifických důvodů podle kódu
    if (event.code === 1001) {
      console.error('⚠️ WebSocket zavřen serverem (code 1001 - Going Away)');
      console.error('💡 Backend pravděpodobně odmítl připojení - zkontrolujte backend logy');
    } else if (event.code === 1006) {
      console.error('⚠️ WebSocket zavřen abnormálně (code 1006)');
      console.error('💡 Možná síťový problém nebo backend spadl');
    } else if (event.code === 1008) {
      console.error('⚠️ WebSocket zavřen kvůli policy violation (code 1008)');
      console.error('💡 Možná špatný API klíč nebo nedostatečná oprávnění');
    }
    
    this.updateStatus('disconnected');

    // Pokud bylo explicitně zavřeno uživatelem, nedělej reconnect
    if (this.manuallyClosed) {
      this.manuallyClosed = false; // reset flag
      return;
    }

    // Pokusit se o reconnect
    if (this.currentApiKey && this.reconnectAttempts < API_CONFIG.MAX_RECONNECT_ATTEMPTS) {
      this.attemptReconnect();
    }
  }

  /**
   * Pokusit se o reconnect s exponenciálním backoff
   */
  private attemptReconnect(): void {
    if (!this.currentApiKey) return;

    this.reconnectAttempts++;
    const delay = API_CONFIG.RECONNECT_DELAY * Math.pow(2, this.reconnectAttempts - 1);

    console.log(
      `Reconnect pokus ${this.reconnectAttempts}/${API_CONFIG.MAX_RECONNECT_ATTEMPTS} za ${delay}ms`
    );

    this.reconnectTimeout = setTimeout(() => {
      if (this.currentApiKey) {
        this.connect(this.currentApiKey);
      }
    }, delay);
  }

  /**
   * Aktualizovat stav a notifikovat callbacky
   */
  private updateStatus(status: ConnectionStatus): void {
    this.statusCallbacks.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        console.error('Chyba v status callback:', error);
      }
    });
  }

  /**
   * Získat aktuální počet reconnect pokusů
   */
  getReconnectAttempts(): number {
    return this.reconnectAttempts;
  }

  /**
   * Resetovat počet reconnect pokusů
   */
  resetReconnectAttempts(): void {
    this.reconnectAttempts = 0;
  }
}

// Export singleton instance
export const WebSocketService = new WebSocketServiceClass();