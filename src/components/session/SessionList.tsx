/**
 * SessionList - Seznam všech sessions
 */

import { useSession } from '../../hooks/useSession';
import { SessionItem } from './SessionItem';
import { NewSessionButton } from './NewSessionButton';

export const SessionList = () => {
  const { sessions, activeSessionId, createSession, switchSession, deleteSession, deleteAllSessions } = useSession();

  // Seřadit sessions podle poslední zprávy
  const sortedSessions = [...sessions].sort((a, b) => b.lastMessageAt - a.lastMessageAt);

  const handleDeleteAll = () => {
    if (sessions.length === 0) return;
    
    const confirmed = confirm(
      `Opravdu chcete smazat všechny konverzace (${sessions.length})?\n\nTato akce je nevratná.`
    );
    
    if (confirmed) {
      deleteAllSessions();
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="p-3 space-y-2">
        <NewSessionButton onClick={() => createSession()} />
        
        {sessions.length > 0 && (
          <button
            onClick={handleDeleteAll}
            className="w-full px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
            style={{
              color: 'var(--color-text-tertiary)',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#dc2626';
              e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-text-tertiary)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            <span>Smazat vše ({sessions.length})</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {sortedSessions.length === 0 ? (
          <div className="text-center text-sm mt-8 px-4" style={{ color: 'var(--color-text-secondary)' }}>
            <p>Zatím žádné konverzace</p>
            <p className="text-xs mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
              Vytvořte novou konverzaci výše
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {sortedSessions.map((session) => (
              <SessionItem
                key={session.id}
                session={session}
                isActive={session.id === activeSessionId}
                onSelect={() => switchSession(session.id)}
                onDelete={() => {
                  if (confirm(`Opravdu chcete smazat konverzaci "${session.title}"?`)) {
                    deleteSession(session.id);
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};