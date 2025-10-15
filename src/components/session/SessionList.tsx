/**
 * SessionList - Seznam všech sessions
 */

import { useSession } from '../../hooks/useSession';
import { SessionItem } from './SessionItem';
import { NewSessionButton } from './NewSessionButton';

export const SessionList = () => {
  const { sessions, activeSessionId, createSession, switchSession, deleteSession } = useSession();

  // Seřadit sessions podle poslední zprávy
  const sortedSessions = [...sessions].sort((a, b) => b.lastMessageAt - a.lastMessageAt);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="p-3">
        <NewSessionButton onClick={() => createSession()} />
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