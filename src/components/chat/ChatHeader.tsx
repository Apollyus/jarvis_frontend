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
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-900">{sessionTitle}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <ConnectionStatus status={connectionStatus} reconnectAttempts={reconnectAttempts} />
          
          {onLogout && (
            <button
              onClick={onLogout}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
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