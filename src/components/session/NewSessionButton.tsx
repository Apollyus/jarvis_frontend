/**
 * NewSessionButton - Tlačítko pro vytvoření nové session
 */

interface NewSessionButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const NewSessionButton = ({ onClick, disabled = false }: NewSessionButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border cursor-pointer"
      style={{
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-text-primary)',
        borderColor: 'var(--color-border)',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-surface)';
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      <span>Nová konverzace</span>
    </button>
  );
};