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
  const { activeSession, updateSessionTitle } = useSession();
  const { status, reconnectAttempts, connect, isConnected } = useWebSocket();
  const { apiKey, logout } = useAuth();

  // Připojit WebSocket při mount nebo změně API klíče
  useEffect(() => {
    if (apiKey) {
      connect(apiKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]); // Pouze apiKey v dependencies! connect() je stabilní funkce ze store

  const sessionTitle = activeSession?.title || SESSION_DEFAULTS.DEFAULT_TITLE;
  
  // Simulace processing time - můžete nahradit reálnými daty
  const processingTime = messages.length > 0 ? '0.8s' : undefined;

  const handleTitleChange = (newTitle: string) => {
    if (activeSession?.id) {
      updateSessionTitle(activeSession.id, newTitle);
    }
  };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--color-background)' }}>
      <ChatHeader
        connectionStatus={status}
        reconnectAttempts={reconnectAttempts}
        onLogout={logout}
      />
      
      <MessageList 
        messages={messages} 
        isAgentTyping={isAgentTyping}
        sessionTitle={sessionTitle}
        processingTime={processingTime}
        onTitleChange={handleTitleChange}
      />
      
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