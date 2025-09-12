import { useState, useEffect } from 'react';
import { User, AuthState, loginUser } from '@/lib/auth';
import { useLocalStorage } from './useLocalStorage';

export const useAuth = () => {
  const [authData, setAuthData] = useLocalStorage<User | null>('sigea-user', null);
  const [authState, setAuthState] = useState<AuthState>({
    user: authData,
    isAuthenticated: !!authData
  });

  useEffect(() => {
    setAuthState({
      user: authData,
      isAuthenticated: !!authData
    });
  }, [authData]);

  const login = (role: 'admin' | 'teacher' | 'student' | 'kitchen') => {
    const user = loginUser(role);
    setAuthData(user);
    setAuthState({
      user,
      isAuthenticated: true
    });
  };

  const logout = () => {
    setAuthData(null);
    setAuthState({
      user: null,
      isAuthenticated: false
    });
  };

  return {
    ...authState,
    login,
    logout
  };
};