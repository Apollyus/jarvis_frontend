/**
 * ChatContainer - Hlavní kontejner pro chat
 */

import { useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import { useSession } from '../../hooks/useSession';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useAuth } from '../../hooks/useAuth';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { SESSION_DEFAULTS } from '../../utils/constants';

export const ChatContainer = () => {
  const { messages, isAgentTyping, sendMessage } = useChat();
  const { activeSession } = useSession();
  const { status, reconnectAttempts, connect, isConnected } = useWebSocket();
  const { apiKey, logout } = useAuth();

  // Připojit WebSocket při mount
  useEffect(() => {
    if (apiKey && !isConnected) {
      connect(apiKey);
    }
  }, [apiKey, isConnected, connect]);

  const sessionTitle = activeSession?.title || SESSION_DEFAULTS.DEFAULT_TITLE;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <ChatHeader
        sessionTitle={sessionTitle}
        connectionStatus={status}
        reconnectAttempts={reconnectAttempts}
        onLogout={logout}
      />
      
      <MessageList messages={messages} isAgentTyping={isAgentTyping} />
      
      <ChatInput
        onSend={sendMessage}
        disabled={!isConnected}
        placeholder={
          isConnected
            ? 'Napište zprávu...'
            : 'Čekání na připojení...'
        }
      />
    </div>
  );
};