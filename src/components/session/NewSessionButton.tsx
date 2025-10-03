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
      className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      <span className="text-xl">+</span>
      <span>Nová konverzace</span>
    </button>
  );
};