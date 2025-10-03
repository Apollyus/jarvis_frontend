/**
 * MessageList - Scrollovatelný seznam zpráv
 */

import { useEffect, useRef } from 'react';
import type { ChatMessage } from '../../types';
import { Message } from './Message';
import { TypingIndicator } from './TypingIndicator';

interface MessageListProps {
  messages: ChatMessage[];
  isAgentTyping: boolean;
}

export const MessageList = ({ messages, isAgentTyping }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  console.log('🖼️ MessageList render:', { messageCount: messages.length, isAgentTyping });

  // Auto-scroll na konec při nové zprávě
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAgentTyping]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <p className="text-lg mb-2">👋</p>
          <p>Zatím žádné zprávy</p>
          <p className="text-sm">Začněte konverzaci se zadáním zprávy níže</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
      {isAgentTyping && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
};