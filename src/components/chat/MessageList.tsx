/**
 * MessageList - Scrollovatelný seznam zpráv
 */

import { useEffect, useRef, useState } from 'react';
import type { ChatMessage } from '../../types';
import { Message } from './Message';
import { TypingIndicator } from './TypingIndicator';

interface MessageListProps {
  messages: ChatMessage[];
  isAgentTyping: boolean;
  sessionTitle: string;
  processingTime?: string;
  onTitleChange?: (newTitle: string) => void;
}

export const MessageList = ({ 
  messages, 
  isAgentTyping, 
  sessionTitle, 
  processingTime,
  onTitleChange 
}: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(sessionTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  console.log('🖼️ MessageList render:', { messageCount: messages.length, isAgentTyping });

  // Auto-scroll na konec při nové zprávě
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAgentTyping]);

  // Focus input při zahájení editace
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Aktualizovat editedTitle když se změní sessionTitle
  useEffect(() => {
    setEditedTitle(sessionTitle);
  }, [sessionTitle]);

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditedTitle(sessionTitle);
  };

  const handleSaveEdit = () => {
    const trimmed = editedTitle.trim();
    if (trimmed && trimmed !== sessionTitle && onTitleChange) {
      onTitleChange(trimmed);
    } else {
      setEditedTitle(sessionTitle);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedTitle(sessionTitle);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 relative">
      {/* Sticky nadpis uprostřed */}
      <div 
        className="sticky top-0 z-10 pt-6 pb-4"
        style={{ 
          backgroundColor: 'var(--color-background)',
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          {isEditing ? (
            <div className="flex items-center justify-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSaveEdit}
                className="text-2xl font-semibold text-center px-3 py-1 rounded-lg border-2 max-w-md"
                style={{
                  color: 'var(--color-text-primary)',
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-primary-500)',
                }}
                maxLength={100}
              />
            </div>
          ) : (
            <h1 
              className="text-2xl font-semibold mb-1 cursor-pointer inline-flex items-center gap-2 px-3 py-1 rounded-lg transition-colors group"
              style={{ color: 'var(--color-text-primary)' }}
              onClick={handleStartEdit}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {sessionTitle}
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </h1>
          )}
          {processingTime && !isEditing && (
            <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
              Zpracováno za {processingTime}
            </p>
          )}
        </div>
      </div>

      {/* Zprávy */}
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-[calc(100%-120px)]" style={{ color: 'var(--color-text-secondary)' }}>
          <div className="text-center max-w-md">
            <div className="text-5xl mb-4">💬</div>
            <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Začněte konverzaci
            </h2>
            <p className="text-sm">
              Napište zprávu do pole níže a zahajte dialog s AI asistentem
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto pb-8">
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          {isAgentTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};