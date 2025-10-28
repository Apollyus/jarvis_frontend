/**
 * Sidebar - Levý panel s sessions
 */

import { useState } from 'react';
import { SessionList } from '../session/SessionList';
import { ThemeSwitcher } from '../common/ThemeSwitcher';
import { useSession } from '../../hooks/useSession';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const { refreshSessions } = useSession();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshSessions();
    setTimeout(() => setIsRefreshing(false), 500); // Reset po 500ms pro vizuální feedback
  };

  return (
    <aside
      className={`flex flex-col border-r rounded-r-3xl transition-all duration-300 ${
        isOpen ? 'w-80' : 'w-0'
      }`}
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        overflow: isOpen ? 'visible' : 'hidden',
      }}
    >
      {isOpen && (
        <>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
            <div>
              <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                Chat
              </h2>
              <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                AI Asistent
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* 🆕 Refresh button */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-text-secondary)',
                }}
                onMouseEnter={(e) => {
                  if (!isRefreshing) {
                    e.currentTarget.style.backgroundColor = 'var(--color-border)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-background)';
                }}
                aria-label="Obnovit konverzace"
                title="Obnovit konverzace"
              >
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  className={isRefreshing ? 'animate-spin' : ''}
                >
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
                </svg>
              </button>

              <button
                onClick={onToggle}
                className="p-2 rounded-lg transition-colors cursor-pointer"
                style={{
                  backgroundColor: 'var(--color-background)',
                  color: 'var(--color-text-secondary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-border)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-background)';
                }}
                aria-label="Zavřít sidebar"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            </div>
          </div>

          <SessionList />

          <div className="p-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <ThemeSwitcher />
          </div>
        </>
      )}
    </aside>
  );
};