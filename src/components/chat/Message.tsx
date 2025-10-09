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
      <div className="flex justify-center my-2">
        <div className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm px-4 py-2 rounded-full">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`rounded-lg px-4 py-2 ${
            isUser
              ? 'bg-primary-600 dark:bg-primary-700 text-white'
              : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          ) : (
            // Render agent messages as Markdown (supports GFM)
            <div className="prose dark:prose-invert max-w-full whitespace-pre-wrap break-words">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            </div>
          )}

          {message.error && (
            <p className="text-xs mt-1 text-red-200">Chyba: {message.error}</p>
          )}
        </div>
        <div
          className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${isUser ? 'text-right' : 'text-left'}`}
        >
          {formatTime(message.timestamp)}
          {message.status === 'sending' && ' • Odesílání...'}
          {message.status === 'error' && ' • Chyba'}
        </div>
      </div>
    </div>
  );
};