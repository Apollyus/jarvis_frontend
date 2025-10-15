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
      <div className="flex-1 flex items-center justify-center" style={{ color: 'var(--color-text-secondary)' }}>
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Začněte konverzaci
          </h2>
          <p className="text-sm">
            Napište zprávu do pole níže a zahajte dialog s AI asistentem
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        {isAgentTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};