# Referenční příručka - Příklady kódu

Tento dokument obsahuje praktické příklady implementace klíčových částí aplikace.

---

## 1. TypeScript Types - Příklady

### Auth Types
```typescript
// src/types/auth.types.ts
export interface AuthState {
  isAuthenticated: boolean;
  apiKey: string | null;
  username: string | null;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  api_key: string;
  username: string;
  expires_at?: string;
}
```

### WebSocket Types
```typescript
// src/types/websocket.types.ts
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface WSMessage {
  type: 'status' | 'response' | 'error';
  content?: string;
  error?: string;
  timestamp?: number;
}

export interface WSOutgoingMessage {
  session_id: string;
  message: string;
  timestamp: number;
}
```

### Chat Types
```typescript
// src/types/chat.types.ts
export type MessageRole = 'user' | 'agent' | 'system';
export type MessageStatus = 'sending' | 'sent' | 'error';

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  status?: MessageStatus;
  error?: string;
}
```

---

## 2. Zustand Stores - Příklady

### Auth Store
```typescript
// src/stores/authStore.ts
import { create } from 'zustand';
import { AuthService } from '@/services/auth.service';
import { StorageService } from '@/services/storage.service';
import type { LoginCredentials } from '@/types/auth.types';

interface AuthStore {
  isAuthenticated: boolean;
  apiKey: string | null;
  username: string | null;
  error: string | null;
  isLoading: boolean;
  
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithApiKey: (apiKey: string) => void;
  logout: () => void;
  restoreSession: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  apiKey: null,
  username: null,
  error: null,
  isLoading: false,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await AuthService.login(credentials);
      StorageService.saveApiKey(response.api_key);
      set({
        isAuthenticated: true,
        apiKey: response.api_key,
        username: response.username,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Přihlášení selhalo',
        isLoading: false,
      });
    }
  },

  loginWithApiKey: (apiKey) => {
    StorageService.saveApiKey(apiKey);
    set({
      isAuthenticated: true,
      apiKey,
      username: null,
    });
  },

  logout: () => {
    StorageService.clearApiKey();
    set({
      isAuthenticated: false,
      apiKey: null,
      username: null,
    });
  },

  restoreSession: () => {
    const apiKey = StorageService.getApiKey();
    if (apiKey) {
      set({
        isAuthenticated: true,
        apiKey,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
```

### WebSocket Store
```typescript
// src/stores/websocketStore.ts
import { create } from 'zustand';
import { WebSocketService } from '@/services/websocket.service';
import type { ConnectionStatus, WSOutgoingMessage } from '@/types/websocket.types';

interface WebSocketStore {
  status: ConnectionStatus;
  error: string | null;
  reconnectAttempts: number;
  
  connect: (apiKey: string) => void;
  disconnect: () => void;
  sendMessage: (message: WSOutgoingMessage) => void;
  setStatus: (status: ConnectionStatus) => void;
  setError: (error: string | null) => void;
  incrementReconnectAttempts: () => void;
  resetReconnectAttempts: () => void;
}

export const useWebSocketStore = create<WebSocketStore>((set, get) => ({
  status: 'disconnected',
  error: null,
  reconnectAttempts: 0,

  connect: (apiKey) => {
    set({ status: 'connecting', error: null });
    WebSocketService.connect(apiKey);
  },

  disconnect: () => {
    WebSocketService.disconnect();
    set({ status: 'disconnected', reconnectAttempts: 0 });
  },

  sendMessage: (message) => {
    if (get().status === 'connected') {
      WebSocketService.sendMessage(message);
    } else {
      set({ error: 'Není připojeno k serveru' });
    }
  },

  setStatus: (status) => set({ status }),
  
  setError: (error) => set({ error }),
  
  incrementReconnectAttempts: () => 
    set((state) => ({ reconnectAttempts: state.reconnectAttempts + 1 })),
  
  resetReconnectAttempts: () => set({ reconnectAttempts: 0 }),
}));
```

### Chat Store
```typescript
// src/stores/chatStore.ts
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { StorageService } from '@/services/storage.service';
import type { ChatMessage, MessageStatus } from '@/types/chat.types';

interface ChatStore {
  messages: ChatMessage[];
  isAgentTyping: boolean;
  error: string | null;
  
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => ChatMessage;
  updateMessageStatus: (id: string, status: MessageStatus) => void;
  setAgentTyping: (isTyping: boolean) => void;
  clearMessages: () => void;
  loadMessagesForSession: (sessionId: string) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  isAgentTyping: false,
  error: null,

  addMessage: (messageData) => {
    const message: ChatMessage = {
      ...messageData,
      id: uuidv4(),
      timestamp: Date.now(),
      status: 'sent',
    };
    
    set((state) => {
      const newMessages = [...state.messages, message];
      // Uložit do storage
      StorageService.saveMessages(message.sessionId, newMessages);
      return { messages: newMessages };
    });
    
    return message;
  },

  updateMessageStatus: (id, status) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, status } : msg
      ),
    }));
  },

  setAgentTyping: (isTyping) => set({ isAgentTyping: isTyping }),

  clearMessages: () => set({ messages: [] }),

  loadMessagesForSession: (sessionId) => {
    const messages = StorageService.getMessages(sessionId);
    set({ messages });
  },
}));
```

---

## 3. Services - Příklady

### Storage Service
```typescript
// src/services/storage.service.ts
import type { ChatSession, ChatMessage } from '@/types';

class StorageServiceClass {
  private readonly KEYS = {
    API_KEY: 'mcp_chat_api_key',
    SESSIONS: 'mcp_chat_sessions',
    MESSAGES_PREFIX: 'mcp_chat_messages_',
  };

  // API Key
  saveApiKey(apiKey: string): void {
    localStorage.setItem(this.KEYS.API_KEY, apiKey);
  }

  getApiKey(): string | null {
    return localStorage.getItem(this.KEYS.API_KEY);
  }

  clearApiKey(): void {
    localStorage.removeItem(this.KEYS.API_KEY);
  }

  // Sessions
  saveSessions(sessions: ChatSession[]): void {
    localStorage.setItem(this.KEYS.SESSIONS, JSON.stringify(sessions));
  }

  getSessions(): ChatSession[] {
    const data = localStorage.getItem(this.KEYS.SESSIONS);
    return data ? JSON.parse(data) : [];
  }

  // Messages
  saveMessages(sessionId: string, messages: ChatMessage[]): void {
    const key = `${this.KEYS.MESSAGES_PREFIX}${sessionId}`;
    localStorage.setItem(key, JSON.stringify(messages));
  }

  getMessages(sessionId: string): ChatMessage[] {
    const key = `${this.KEYS.MESSAGES_PREFIX}${sessionId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  clearMessages(sessionId: string): void {
    const key = `${this.KEYS.MESSAGES_PREFIX}${sessionId}`;
    localStorage.removeItem(key);
  }
}

export const StorageService = new StorageServiceClass();
```

### Auth Service
```typescript
// src/services/auth.service.ts
import type { LoginCredentials, LoginResponse } from '@/types/auth.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class AuthServiceClass {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Přihlášení selhalo');
    }

    return response.json();
  }

  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      // Zkusit připojit WebSocket s API klíčem
      const ws = new WebSocket(`${API_BASE_URL}/ws/chat?api_key=${apiKey}`);
      
      return new Promise((resolve) => {
        ws.onopen = () => {
          ws.close();
          resolve(true);
        };
        ws.onerror = () => {
          resolve(false);
        };
      });
    } catch {
      return false;
    }
  }
}

export const AuthService = new AuthServiceClass();
```

### WebSocket Service
```typescript
// src/services/websocket.service.ts
import type { WSMessage, WSOutgoingMessage, ConnectionStatus } from '@/types/websocket.types';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/chat';
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 1000;

class WebSocketServiceClass {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private messageCallbacks: ((message: WSMessage) => void)[] = [];
  private statusCallbacks: ((status: ConnectionStatus) => void)[] = [];

  connect(apiKey: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.updateStatus('connecting');
    this.ws = new WebSocket(`${WS_URL}?api_key=${apiKey}`);

    this.ws.onopen = () => {
      console.log('WebSocket připojen');
      this.reconnectAttempts = 0;
      this.updateStatus('connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WSMessage = JSON.parse(event.data);
        this.messageCallbacks.forEach((cb) => cb(message));
      } catch (error) {
        console.error('Chyba při parsování zprávy:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.updateStatus('error');
    };

    this.ws.onclose = () => {
      console.log('WebSocket odpojen');
      this.updateStatus('disconnected');
      this.attemptReconnect(apiKey);
    };
  }

  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.reconnectAttempts = 0;
  }

  sendMessage(message: WSOutgoingMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket není připojen');
    }
  }

  onMessage(callback: (message: WSMessage) => void): () => void {
    this.messageCallbacks.push(callback);
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter((cb) => cb !== callback);
    };
  }

  onStatusChange(callback: (status: ConnectionStatus) => void): () => void {
    this.statusCallbacks.push(callback);
    return () => {
      this.statusCallbacks = this.statusCallbacks.filter((cb) => cb !== callback);
    };
  }

  private attemptReconnect(apiKey: string): void {
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error('Maximální počet pokusů o reconnect překročen');
      return;
    }

    this.reconnectAttempts++;
    const delay = RECONNECT_DELAY * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`Reconnect pokus ${this.reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} za ${delay}ms`);

    this.reconnectTimeout = setTimeout(() => {
      this.connect(apiKey);
    }, delay);
  }

  private updateStatus(status: ConnectionStatus): void {
    this.statusCallbacks.forEach((cb) => cb(status));
  }
}

export const WebSocketService = new WebSocketServiceClass();
```

---

## 4. Custom Hooks - Příklady

### useAuth Hook
```typescript
// src/hooks/useAuth.ts
import { useAuthStore } from '@/stores/authStore';
import type { LoginCredentials } from '@/types/auth.types';

export const useAuth = () => {
  const {
    isAuthenticated,
    apiKey,
    username,
    error,
    isLoading,
    login,
    loginWithApiKey,
    logout,
    clearError,
  } = useAuthStore();

  return {
    isAuthenticated,
    apiKey,
    username,
    error,
    isLoading,
    login,
    loginWithApiKey,
    logout,
    clearError,
  };
};
```

### useWebSocket Hook
```typescript
// src/hooks/useWebSocket.ts
import { useEffect } from 'react';
import { useWebSocketStore } from '@/stores/websocketStore';
import { useChatStore } from '@/stores/chatStore';
import { WebSocketService } from '@/services/websocket.service';
import { useAuthStore } from '@/stores/authStore';

export const useWebSocket = (sessionId: string | null) => {
  const { status, sendMessage: storeSendMessage, setStatus } = useWebSocketStore();
  const { addMessage, setAgentTyping } = useChatStore();
  const { apiKey } = useAuthStore();

  useEffect(() => {
    if (!apiKey) return;

    // Setup message handler
    const unsubscribeMessage = WebSocketService.onMessage((message) => {
      switch (message.type) {
        case 'status':
          setAgentTyping(true);
          break;
        case 'response':
          if (sessionId && message.content) {
            addMessage({
              sessionId,
              role: 'agent',
              content: message.content,
            });
          }
          setAgentTyping(false);
          break;
        case 'error':
          console.error('WebSocket error:', message.error);
          setAgentTyping(false);
          break;
      }
    });

    // Setup status handler
    const unsubscribeStatus = WebSocketService.onStatusChange((newStatus) => {
      setStatus(newStatus);
    });

    return () => {
      unsubscribeMessage();
      unsubscribeStatus();
    };
  }, [apiKey, sessionId, addMessage, setAgentTyping, setStatus]);

  const sendMessage = (content: string) => {
    if (!sessionId) return;

    const message = {
      session_id: sessionId,
      message: content,
      timestamp: Date.now(),
    };

    storeSendMessage(message);
  };

  return {
    status,
    sendMessage,
    isConnected: status === 'connected',
  };
};
```

---

## 5. Komponenty - Příklady

### LoginForm Component
```typescript
// src/components/auth/LoginForm.tsx
import { useState, FormEvent } from 'react';
import { useAuth } from '@/hooks/useAuth';

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await login({ username, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Uživatelské jméno
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field mt-1"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Heslo
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field mt-1"
          required
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full"
      >
        {isLoading ? 'Přihlašování...' : 'Přihlásit se'}
      </button>
    </form>
  );
};
```

### Message Component
```typescript
// src/components/chat/Message.tsx
import type { ChatMessage } from '@/types/chat.types';
import { formatTimestamp } from '@/utils/formatters';

interface MessageProps {
  message: ChatMessage;
}

export const Message = ({ message }: MessageProps) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-primary-600 text-white'
            : 'bg-gray-200 text-gray-900'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <span className={`text-xs ${isUser ? 'text-primary-200' : 'text-gray-500'} mt-1 block`}>
          {formatTimestamp(message.timestamp)}
        </span>
      </div>
    </div>
  );
};
```

### ChatInput Component
```typescript
// src/components/chat/ChatInput.tsx
import { useState, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t p-4">
      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Napište zprávu... (Enter = odeslat, Shift+Enter = nový řádek)"
          className="input-field flex-1 resize-none"
          rows={3}
          disabled={disabled}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || disabled}
          className="btn-primary h-fit"
        >
          Odeslat
        </button>
      </div>
    </div>
  );
};
```

### ConnectionStatus Component
```typescript
// src/components/common/ConnectionStatus.tsx
import type { ConnectionStatus } from '@/types/websocket.types';

interface ConnectionStatusProps {
  status: ConnectionStatus;
}

export const ConnectionStatus = ({ status }: ConnectionStatusProps) => {
  const statusConfig = {
    connected: {
      color: 'bg-green-500',
      text: 'Připojeno',
    },
    connecting: {
      color: 'bg-yellow-500',
      text: 'Připojování...',
    },
    disconnected: {
      color: 'bg-gray-500',
      text: 'Odpojeno',
    },
    error: {
      color: 'bg-red-500',
      text: 'Chyba připojení',
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${config.color}`} />
      <span className="text-sm text-gray-600">{config.text}</span>
    </div>
  );
};
```

---

## 6. Utility Functions

### Formatters
```typescript
// src/utils/formatters.ts
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  
  const isToday = date.toDateString() === now.toDateString();
  
  if (isToday) {
    return date.toLocaleTimeString('cs-CZ', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  return date.toLocaleString('cs-CZ', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatSessionTitle = (session: ChatSession): string => {
  return session.title || `Session ${new Date(session.createdAt).toLocaleDateString('cs-CZ')}`;
};
```

### Constants
```typescript
// src/utils/constants.ts
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/chat',
  MAX_RECONNECT_ATTEMPTS: parseInt(import.meta.env.VITE_MAX_RECONNECT_ATTEMPTS || '5'),
  RECONNECT_DELAY: parseInt(import.meta.env.VITE_RECONNECT_DELAY || '1000'),
};

export const STORAGE_KEYS = {
  API_KEY: 'mcp_chat_api_key',
  SESSIONS: 'mcp_chat_sessions',
  MESSAGES_PREFIX: 'mcp_chat_messages_',
};

export const MESSAGE_TYPES = {
  USER: 'user',
  AGENT: 'agent',
  SYSTEM: 'system',
} as const;
```

---

## 7. App Setup

### Main App Component
```typescript
// src/App.tsx
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useWebSocketStore } from '@/stores/websocketStore';
import { LoginForm } from '@/components/auth/LoginForm';
import { AppLayout } from '@/components/layout/AppLayout';

function App() {
  const { isAuthenticated, apiKey, restoreSession } = useAuthStore();
  const { connect } = useWebSocketStore();

  useEffect(() => {
    // Restore session on app start
    restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    // Connect WebSocket when authenticated
    if (isAuthenticated && apiKey) {
      connect(apiKey);
    }
  }, [isAuthenticated, apiKey, connect]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold mb-6">MCP Agent Chat</h1>
          <LoginForm />
        </div>
      </div>
    );
  }

  return <AppLayout />;
}

export default App;
```

### Main Entry Point
```typescript
// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

---

## 8. Environment Setup

### .env.development
```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws/chat
VITE_MAX_RECONNECT_ATTEMPTS=5
VITE_RECONNECT_DELAY=1000
```

### .env.production
```bash
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com/ws/chat
VITE_MAX_RECONNECT_ATTEMPTS=3
VITE_RECONNECT_DELAY=2000
```

---

## 9. Testing Examples

### Service Test
```typescript
// src/services/__tests__/storage.service.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from '../storage.service';

describe('StorageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('měl by uložit a načíst API klíč', () => {
    const apiKey = 'test-api-key';
    StorageService.saveApiKey(apiKey);
    expect(StorageService.getApiKey()).toBe(apiKey);
  });

  it('měl by vymazat API klíč', () => {
    StorageService.saveApiKey('test');
    StorageService.clearApiKey();
    expect(StorageService.getApiKey()).toBeNull();
  });
});
```

### Component Test
```typescript
// src/components/chat/__tests__/Message.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Message } from '../Message';

describe('Message', () => {
  it('měl by zobrazit user message', () => {
    const message = {
      id: '1',
      sessionId: 'session-1',
      role: 'user' as const,
      content: 'Test message',
      timestamp: Date.now(),
    };

    render(<Message message={message} />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });
});
```

---

**Hotovo! Všechny příklady kódu jsou připraveny k použití.**