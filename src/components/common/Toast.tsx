/**
 * Toast - Notifikační komponenta
 */

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
}

export const Toast = ({ message, type = 'info', duration = 3000, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const typeConfig = {
    success: {
      bg: 'bg-green-100',
      border: 'border-green-400',
      text: 'text-green-800',
      icon: '✓',
    },
    error: {
      bg: 'bg-red-100',
      border: 'border-red-400',
      text: 'text-red-800',
      icon: '✕',
    },
    info: {
      bg: 'bg-blue-100',
      border: 'border-blue-400',
      text: 'text-blue-800',
      icon: 'ℹ',
    },
  };

  const config = typeConfig[type];

  return (
    <div
      className={`fixed bottom-4 right-4 ${config.bg} ${config.border} ${config.text} border rounded-lg p-4 shadow-lg max-w-sm animate-slide-up`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <span className="text-xl" aria-hidden="true">
          {config.icon}
        </span>
        <p className="flex-1">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Zavřít"
        >
          ✕
        </button>
      </div>
    </div>
  );
};