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
  const { loadSessions } = useSession();

  // Při mount obnovit session a načíst sessions
  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // Načíst sessions po přihlášení z backendu
  useEffect(() => {
    if (isAuthenticated) {
      loadSessions();
    }
  }, [isAuthenticated, loadSessions]);

  // NEBUDEME automaticky vytvářet session - backend ji vytvoří při první zprávě

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
