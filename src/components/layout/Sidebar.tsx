/**
 * Sidebar - Levý panel s sessions
 */

import { SessionList } from '../session/SessionList';
import { ThemeSwitcher } from '../common/ThemeSwitcher';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  return (
    <aside
      className={`flex flex-col border-r transition-all duration-300 ${
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
            <button
              onClick={onToggle}
              className="p-2 rounded-lg transition-colors hover:bg-opacity-80 cursor-pointer"
              style={{
                backgroundColor: 'var(--color-secondary-100)',
                color: 'var(--color-text-secondary)',
              }}
              aria-label="Zavřít sidebar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
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