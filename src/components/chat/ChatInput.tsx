/**
 * ChatInput - Textové pole pro zadávání zpráv
 */

import { useState } from 'react';
import type { KeyboardEvent } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput = ({
  onSend,
  disabled = false,
  placeholder = 'Napište zprávu...',
}: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSend(trimmedMessage);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter bez Shift odešle zprávu
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div 
      className="p-6" 
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              rows={1}
              className="input-field resize-none min-h-[56px] max-h-40 pr-12"
              style={{
                height: 'auto',
                minHeight: '56px',
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${Math.min(target.scrollHeight, 160)}px`;
              }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={disabled || !message.trim()}
            className="p-3.5 rounded-xl transition-all flex items-center justify-center disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--color-primary-600)',
              color: 'white',
              minWidth: '56px',
              height: '56px',
            }}
            aria-label="Odeslat zprávu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};