/**
 * ConnectionStatus - Indikátor stavu WebSocket připojení
 */

import type { ConnectionStatus as ConnectionStatusType } from '../../types';

interface ConnectionStatusProps {
  status: ConnectionStatusType;
  reconnectAttempts?: number;
}

export const ConnectionStatus = ({ status, reconnectAttempts = 0 }: ConnectionStatusProps) => {
  const statusConfig = {
    connected: {
      color: 'bg-green-500',
      text: 'Připojeno',
      icon: '●',
    },
    connecting: {
      color: 'bg-yellow-500',
      text: 'Připojování...',
      icon: '◐',
    },
    disconnected: {
      color: 'bg-gray-400',
      text: 'Odpojeno',
      icon: '○',
    },
    error: {
      color: 'bg-red-500',
      text: 'Chyba připojení',
      icon: '✕',
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={`w-2 h-2 ${config.color} rounded-full`} aria-hidden="true">
        {config.icon}
      </span>
      <span className="text-gray-700">{config.text}</span>
      {reconnectAttempts > 0 && (
        <span className="text-gray-500 text-xs">
          (pokus {reconnectAttempts})
        </span>
      )}
    </div>
  );
};