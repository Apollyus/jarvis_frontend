/**
 * ProtectedRoute - Ochrana routes před neautorizovaným přístupem
 */

import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, restoreSession } = useAuth();

  useEffect(() => {
    // Zkusit obnovit session při mount
    restoreSession();
  }, [restoreSession]);

  if (!isAuthenticated) {
    // Zobrazit login stránku místo přesměrování
    return null; // V budoucnu zde bude <Navigate to="/login" />
  }

  return <>{children}</>;
};