/**
 * ChatHeader - Hlavička chatu se session názvem
 */

import { ConnectionStatus } from '../common/ConnectionStatus';
import type { ConnectionStatus as ConnectionStatusType } from '../../types';

interface ChatHeaderProps {
  sessionTitle: string;
  connectionStatus: ConnectionStatusType;
  reconnectAttempts?: number;
  onLogout?: () => void;
}

export const ChatHeader = ({
  sessionTitle,
  connectionStatus,
  reconnectAttempts = 0,
  onLogout,
}: ChatHeaderProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{sessionTitle}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <ConnectionStatus status={connectionStatus} reconnectAttempts={reconnectAttempts} />
          
          {onLogout && (
            <button
              onClick={onLogout}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label="Odhlásit se"
            >
              Odhlásit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};