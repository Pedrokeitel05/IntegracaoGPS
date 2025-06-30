import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useAdmin() {
  const [isAdminMode, setIsAdminMode] = useLocalStorage('adminMode', false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const login = useCallback((username: string, password: string) => {
    if (username === 'admin' && password === 'admin') {
      setIsAdminMode(true);
      setShowLoginModal(false);
      return true;
    }
    return false;
  }, [setIsAdminMode]);

  const logout = useCallback(() => {
    setIsAdminMode(false);
    setShowLoginModal(false);
  }, [setIsAdminMode]);

  const openLoginModal = useCallback(() => {
    setShowLoginModal(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setShowLoginModal(false);
  }, []);

  return {
    isAdminMode,
    showLoginModal,
    login,
    logout,
    openLoginModal,
    closeLoginModal,
  };
}