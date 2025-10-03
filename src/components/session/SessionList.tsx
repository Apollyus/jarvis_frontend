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
    <div className="flex flex-col h-full">
      <div className="p-4">
        <NewSessionButton onClick={() => createSession()} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {sortedSessions.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8">
            <p>Zatím žádné konverzace</p>
            <p className="text-xs mt-1">Vytvořte novou konverzaci výše</p>
          </div>
        ) : (
          <div className="space-y-2">
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