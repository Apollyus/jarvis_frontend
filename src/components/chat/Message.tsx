/**
 * Message - Jednotlivá chatová zpráva
 */

import type { ChatMessage } from '../../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageProps {
  message: ChatMessage;
}

export const Message = ({ message }: MessageProps) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('cs-CZ', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div 
          className="text-sm px-4 py-2 rounded-full"
          style={{
            backgroundColor: 'var(--color-secondary-100)',
            color: 'var(--color-text-secondary)',
          }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-4 mb-8 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div 
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
        style={{
          backgroundColor: isUser ? 'var(--color-primary-500)' : 'var(--color-secondary-200)',
          color: isUser ? 'white' : 'var(--color-text-primary)',
        }}
      >
        {isUser ? '👤' : '🤖'}
      </div>

      {/* Message content */}
      <div className="flex-1 max-w-3xl">
        <div className={`flex items-center gap-2 mb-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
            {isUser ? 'Vy' : 'Asistent'}
          </span>
          <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            {formatTime(message.timestamp)}
            {message.status === 'sending' && ' • Odesílání...'}
            {message.status === 'error' && ' • Chyba'}
          </span>
        </div>

        <div 
          className="rounded-lg px-4 py-3"
          style={{
            backgroundColor: isUser ? 'var(--color-surface)' : 'transparent',
            border: isUser ? '1px solid var(--color-border)' : 'none',
          }}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap break-words" style={{ color: 'var(--color-text-primary)' }}>
              {message.content}
            </p>
          ) : (
            <div 
              className="prose prose-sm max-w-none"
              style={{ color: 'var(--color-text-primary)' }}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}

          {message.error && (
            <p className="text-xs mt-2" style={{ color: '#dc2626' }}>
              Chyba: {message.error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};