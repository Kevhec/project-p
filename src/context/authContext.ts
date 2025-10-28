import type { AuthContextType } from '@/types/auth';
import { createContext, useContext } from 'react';

const AuthContext = createContext<AuthContextType>({
  loading: true,
  login: () => null,
})

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export {
  AuthContext,
  useAuth,
}