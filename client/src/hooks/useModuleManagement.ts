import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Module } from '../types';

export function useModuleManagement() {
  const [customModules, setCustomModules] = useLocalStorage<Module[]>('customModules', []);

  const addModule = useCallback((module: Omit<Module, 'id'>) => {
    const newModule: Module = {
      ...module,
      id: Date.now().toString(),
    };
    setCustomModules(prev => [...prev, newModule]);
    return newModule;
  }, [setCustomModules]);

  const updateModule = useCallback((id: string, updates: Partial<Module>) => {
    setCustomModules(prev => 
      prev.map(module => 
        module.id === id ? { ...module, ...updates } : module
      )
    );
  }, [setCustomModules]);

  const deleteModule = useCallback((id: string) => {
    setCustomModules(prev => prev.filter(module => module.id !== id));
  }, [setCustomModules]);

  const getModule = useCallback((id: string) => {
    return customModules.find(module => module.id === id);
  }, [customModules]);

  return {
    modules: customModules,
    addModule,
    updateModule,
    deleteModule,
    getModule,
  };
}