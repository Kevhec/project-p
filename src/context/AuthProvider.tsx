import type { AuthContextType } from '@/types/auth';
import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { AuthContext } from './authContext';
import { loginPopUp } from '@/config/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthContextType["user"]>()
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  const login = useCallback(async () => {
    setLoading(true);
    try {
      const response = await loginPopUp();
      const user = response.user;
      setUser(user);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    })

    return () => unsubscribe();
  }, [auth])

  const contextValue = useMemo(() => ({
    user,
    loading,
    login,
  }), [user, loading, login])

  return (
    <AuthContext.Provider value={ contextValue }>
      { children }
    </AuthContext.Provider>
  )
}

export default AuthProvider;