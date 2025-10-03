/**
 * App - Hlavní aplikační komponenta
 */

import { useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useSession } from './hooks/useSession';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AppLayout } from './components/layout/AppLayout';
import { ChatContainer } from './components/chat/ChatContainer';
import { LoginPage } from './pages/LoginPage';

function App() {
  const { isAuthenticated, restoreSession } = useAuth();
  const { loadSessions, createSession, sessions, activeSessionId } = useSession();

  // Při mount obnovit session a načíst sessions
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // Načíst sessions po přihlášení
  useEffect(() => {
    if (isAuthenticated) {
      loadSessions();
    }
  }, [isAuthenticated, loadSessions]);

  // Vytvořit první session pokud žádná neexistuje
  useEffect(() => {
    if (isAuthenticated && sessions.length === 0 && !activeSessionId) {
      createSession();
    }
  }, [isAuthenticated, sessions.length, activeSessionId, createSession]);

  // Pokud není přihlášen, zobrazit login
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Hlavní aplikace
  return (
    <ErrorBoundary>
      <AppLayout>
        <ChatContainer />
      </AppLayout>
    </ErrorBoundary>
  );
}

export default App;
