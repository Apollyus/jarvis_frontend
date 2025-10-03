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
      className={`group relative px-3 py-2 rounded-lg cursor-pointer transition-colors ${
        isActive
          ? 'bg-primary-100 dark:bg-primary-900 border border-primary-300 dark:border-primary-700'
          : 'hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3
            className={`text-sm font-medium truncate ${
              isActive ? 'text-primary-900 dark:text-primary-100' : 'text-gray-900 dark:text-gray-100'
            }`}
          >
            {session.title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
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
          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-600 dark:hover:text-red-500 p-1"
          aria-label="Smazat session"
        >
          <span className="text-lg">×</span>
        </button>
      </div>
    </div>
  );
};