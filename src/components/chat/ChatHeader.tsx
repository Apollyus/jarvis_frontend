/**
 * ChatHeader - Hlavička chatu se session názvem
 */

import { ConnectionStatus } from '../common/ConnectionStatus';
import type { ConnectionStatus as ConnectionStatusType } from '../../types';
import SettingsModal from '../common/SettingsModal';
import { useState } from 'react';

interface ChatHeaderProps {
  sessionTitle: string;
  connectionStatus: ConnectionStatusType;
  reconnectAttempts?: number;
  onLogout?: () => void;
  processingTime?: string;
}

export const ChatHeader = ({
  sessionTitle,
  connectionStatus,
  reconnectAttempts = 0,
  onLogout,
  processingTime,
}: ChatHeaderProps) => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="border-b px-6 py-4" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
      {/* Top row - connection status a akce */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Settings button */}
          <button
            className="p-2 rounded-lg transition-all hover:scale-105 cursor-pointer"
            style={{
              backgroundColor: 'var(--color-secondary-100)',
              color: 'var(--color-text-secondary)',
            }}
            onClick={() => setSettingsOpen(true)}
            aria-label="Nastavení"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v6m0 6v6M1 12h6m6 0h6" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <ConnectionStatus status={connectionStatus} reconnectAttempts={reconnectAttempts} />

          {onLogout && (
            <button
              onClick={onLogout}
              className="text-sm px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              style={{
                color: 'var(--color-text-secondary)',
                backgroundColor: 'var(--color-secondary-100)',
              }}
              aria-label="Odhlásit se"
            >
              Odhlásit
            </button>
          )}
        </div>
      </div>

      {/* Title row */}
      <div>
        <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
          {sessionTitle}
        </h1>
        {processingTime && (
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            Zpracováno za {processingTime}
          </p>
        )}
      </div>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};