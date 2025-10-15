/**
 * TypingIndicator - Animovaný indikátor "agent píše"
 */

export const TypingIndicator = () => {
  return (
    <div className="flex gap-4 mb-8">
      {/* Avatar */}
      <div 
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm"
        style={{
          backgroundColor: 'var(--color-secondary-200)',
          color: 'var(--color-text-primary)',
        }}
      >
        🤖
      </div>

      {/* Typing animation */}
      <div className="flex-1 max-w-3xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
            Asistent
          </span>
        </div>
        <div className="flex items-center gap-1 px-4 py-3">
          <div 
            className="w-2 h-2 rounded-full animate-bounce" 
            style={{ 
              animationDelay: '0ms',
              backgroundColor: 'var(--color-text-tertiary)',
            }}
          />
          <div 
            className="w-2 h-2 rounded-full animate-bounce" 
            style={{ 
              animationDelay: '150ms',
              backgroundColor: 'var(--color-text-tertiary)',
            }}
          />
          <div 
            className="w-2 h-2 rounded-full animate-bounce" 
            style={{ 
              animationDelay: '300ms',
              backgroundColor: 'var(--color-text-tertiary)',
            }}
          />
        </div>
      </div>
    </div>
  );
};