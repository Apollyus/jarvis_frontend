/**
 * SessionItem - Jednotlivá session v seznamu
 */

import type { ChatSession } from '../../types';

interface SessionItemProps {
  session: ChatSession;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export const SessionItem = ({ session, isActive, onSelect, onDelete }: SessionItemProps) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Včera';
    } else {
      return date.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short' });
    }
  };

  return (
    <div
      onClick={onSelect}
      className="group relative px-3 py-3 rounded-lg cursor-pointer transition-all"
      style={{
        backgroundColor: isActive ? 'var(--color-background)' : 'transparent',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3
            className="text-sm font-medium truncate"
            style={{
              color: isActive ? 'var(--color-primary-600)' : 'var(--color-text-primary)',
            }}
          >
            {session.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            <span>{formatDate(session.lastMessageAt)}</span>
            {session.messageCount > 0 && (
              <>
                <span>•</span>
                <span>{session.messageCount} zpráv</span>
              </>
            )}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50 cursor-pointer"
          style={{ color: 'var(--color-text-tertiary)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#dc2626';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-text-tertiary)';
          }}
          aria-label="Smazat session"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
};