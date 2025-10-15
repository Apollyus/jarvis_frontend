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
      color: '#10b981',
      text: 'Připojeno',
      bgColor: '#d1fae5',
    },
    connecting: {
      color: '#f59e0b',
      text: 'Připojování...',
      bgColor: '#fef3c7',
    },
    disconnected: {
      color: '#9ca3af',
      text: 'Odpojeno',
      bgColor: '#f3f4f6',
    },
    error: {
      color: '#ef4444',
      text: 'Chyba připojení',
      bgColor: '#fee2e2',
    },
  };

  const config = statusConfig[status];

  return (
    <div 
      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
      style={{
        backgroundColor: config.bgColor,
        color: config.color,
      }}
    >
      <span 
        className="w-2 h-2 rounded-full animate-pulse"
        style={{ backgroundColor: config.color }}
      />
      <span>{config.text}</span>
      {reconnectAttempts > 0 && (
        <span className="opacity-70">
          ({reconnectAttempts})
        </span>
      )}
    </div>
  );
};