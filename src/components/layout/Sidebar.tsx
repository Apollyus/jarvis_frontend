/**
 * Sidebar - Levý panel s sessions
 */

import { SessionList } from '../session/SessionList';
import { ThemeSwitcher } from '../common/ThemeSwitcher';

export const Sidebar = () => {
  return (
    <aside className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">MCP Agent Chat</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Váš AI asistent</p>
      </div>
      
      <SessionList />

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <ThemeSwitcher />
      </div>
    </aside>
  );
};