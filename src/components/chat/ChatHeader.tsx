/**
 * ChatHeader - Hlavička chatu se session názvem
 */

import { ConnectionStatus } from '../common/ConnectionStatus';
import type { ConnectionStatus as ConnectionStatusType } from '../../types';
import SettingsModal from '../common/SettingsModal';
import { useState } from 'react';

interface ChatHeaderProps {
  connectionStatus: ConnectionStatusType;
  reconnectAttempts?: number;
  onLogout?: () => void;
}

export const ChatHeader = ({
  connectionStatus,
  reconnectAttempts = 0,
  onLogout,
}: ChatHeaderProps) => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="border-b px-6 py-3" style={{ borderColor: 'var(--color-border)' }}>
      <div className="flex items-center justify-end gap-4">
        <button
          className="p-2 rounded-lg transition-all hover:scale-105 cursor-pointer"
          onClick={() => setSettingsOpen(true)}
          aria-label="Nastavení"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>

        <ConnectionStatus status={connectionStatus} reconnectAttempts={reconnectAttempts} />

        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer hover:scale-105 transition duration-200"
            aria-label="Odhlásit se"
          >
            Odhlásit
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m16 17 5-5-5-5"/>
              <path d="M21 12H9"/>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            </svg>
          </button>
        )}
      </div>
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};