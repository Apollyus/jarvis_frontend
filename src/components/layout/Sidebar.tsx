/**
 * Sidebar - Levý panel s sessions
 */

import { SessionList } from '../session/SessionList';

export const Sidebar = () => {
  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">MCP Agent Chat</h2>
        <p className="text-sm text-gray-600 mt-1">Váš AI asistent</p>
      </div>
      
      <SessionList />
    </aside>
  );
};