
import { useTheme } from '../../hooks/useTheme.tsx';

export const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all cursor-pointer"
      style={{
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text-primary)',
      }}
      onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-border)';
              }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-background)';
      }}
    >
      <span className="flex items-center gap-2">
        {theme === 'light' ? (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <span>Světlý režim</span>
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            <span>Tmavý režim</span>
          </>
        )}
      </span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );
};

