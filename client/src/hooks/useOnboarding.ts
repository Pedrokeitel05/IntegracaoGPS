import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useWebSocket } from './useWebSocket';
import { Employee, Module, JobPosition } from '../types';

export function useOnboarding() {
  const [employee, setEmployee] = useLocalStorage<Employee | null>('gps_employee', null);
  const [currentStep, setCurrentStep] = useLocalStorage<string>('gps_current_step', 'welcome');
  const [modules, setModules] = useLocalStorage<Module[]>('gps_modules', []);

  // WebSocket para sincronização em tempo real
  const {
    broadcastModuleUpdate,
    broadcastModulesReorder,
    broadcastModuleAdd,
    broadcastModuleDelete
  } = useWebSocket({
    onModuleUpdate: (moduleId, updates) => {
      console.log('Received module update via WebSocket:', moduleId, updates);
      setModules(prev => prev.map(module => 
        module.id === moduleId ? { ...module, ...updates } : module
      ));
    },
    onModulesReorder: (newModules) => {
      console.log('Received modules reorder via WebSocket:', newModules);
      setModules(newModules);
    },
    onModuleAdd: (newModule) => {
      console.log('Received module add via WebSocket:', newModule);
      setModules(prev => [...prev, newModule]);
    },
    onModuleDelete: (moduleId) => {
      console.log('Received module delete via WebSocket:', moduleId);
      setModules(prev => prev.filter(module => module.id !== moduleId));
    }
  });

  const initializeModules = useCallback((jobPosition: JobPosition) => {
    // Se já existem módulos salvos, não reinicializar
    if (modules.length > 0) return;
    
    const baseModules: Module[] = [
      {
        id: 'registration',
        title: 'Cadastro',
        description: 'Complete seu cadastro',
        isLocked: false,
        isCompleted: !!employee,
        order: 1,
        targetAreas: ['Segurança/Recepção', 'Limpeza Geral', 'Limpeza Hospitalar', 'Administrativo', 'Gerência', 'Técnico', 'Outros'],
        isCustom: false,
      },
      {
        id: 'hr',
        title: 'Recursos Humanos',
        description: 'Políticas e procedimentos da empresa',
        isLocked: false, // Primeiro módulo após registro deve estar desbloqueado
        isCompleted: employee?.completedModules.includes('hr') || false,
        order: 2,
        targetAreas: ['Segurança/Recepção', 'Limpeza Geral', 'Limpeza Hospitalar', 'Administrativo', 'Gerência', 'Técnico', 'Outros'],
        isCustom: false,
      },
      {
        id: 'quality',
        title: 'Garantia de Qualidade',
        description: 'Padrões e processos de qualidade',
        isLocked: !employee?.completedModules.includes('hr'),
        isCompleted: employee?.completedModules.includes('quality') || false,
        order: 3,
        targetAreas: ['Segurança/Recepção', 'Limpeza Geral', 'Limpeza Hospitalar', 'Administrativo', 'Gerência', 'Técnico', 'Outros'],
        isCustom: false,
      },
      {
        id: 'safety',
        title: 'Segurança do Trabalho e Meio Ambiente',
        description: 'Protocolos de segurança e diretrizes ambientais',
        isLocked: !employee?.completedModules.includes('quality'),
        isCompleted: employee?.completedModules.includes('safety') || false,
        order: 4,
        targetAreas: ['Segurança/Recepção', 'Limpeza Geral', 'Limpeza Hospitalar', 'Administrativo', 'Gerência', 'Técnico', 'Outros'],
        isCustom: false,
      },
      {
        id: 'benefits',
        title: 'Benefícios',
        description: 'Benefícios e remuneração dos funcionários',
        isLocked: !employee?.completedModules.includes('safety'),
        isCompleted: employee?.completedModules.includes('benefits') || false,
        order: 5,
        targetAreas: ['Segurança/Recepção', 'Limpeza Geral', 'Limpeza Hospitalar', 'Administrativo', 'Gerência', 'Técnico', 'Outros'],
        isCustom: false,
      },
    ];

    // Adicionar módulos específicos por função
    if (jobPosition === 'Segurança/Recepção') {
      baseModules.push({
        id: 'asset-protection',
        title: 'Proteção de Ativos',
        description: 'Protocolos de segurança e proteção de ativos',
        isLocked: !employee?.completedModules.includes('benefits'),
        isCompleted: employee?.completedModules.includes('asset-protection') || false,
        order: 6,
        targetAreas: ['Segurança/Recepção'],
        isCustom: false,
      });
    } else if (jobPosition === 'Limpeza Geral') {
      baseModules.push({
        id: 'infrastructure',
        title: 'Serviços de Infraestrutura',
        description: 'Protocolos de limpeza e manutenção de infraestrutura',
        isLocked: !employee?.completedModules.includes('benefits'),
        isCompleted: employee?.completedModules.includes('infrastructure') || false,
        order: 6,
        targetAreas: ['Limpeza Geral'],
        isCustom: false,
      });
    } else if (jobPosition === 'Limpeza Hospitalar') {
      baseModules.push({
        id: 'hospital-care',
        title: 'Cuidados Hospitalares',
        description: 'Protocolos de limpeza e higiene hospitalar',
        isLocked: !employee?.completedModules.includes('benefits'),
        isCompleted: employee?.completedModules.includes('hospital-care') || false,
        order: 6,
        targetAreas: ['Limpeza Hospitalar'],
        isCustom: false,
      });
    }

    setModules(baseModules);
  }, [employee]);

  const completeModule = useCallback((moduleId: string) => {
    if (!employee) return;

    const updatedEmployee = {
      ...employee,
      completedModules: [...employee.completedModules, moduleId],
    };
    
    setEmployee(updatedEmployee);
    
    // Atualizar módulos para desbloquear o próximo
    setModules(prev => prev.map((module, index) => {
      if (module.id === moduleId) {
        return { ...module, isCompleted: true };
      }
      // Desbloquear próximo módulo
      if (index > 0 && prev[index - 1].id === moduleId) {
        return { ...module, isLocked: false };
      }
      return module;
    }));
  }, [employee, setEmployee]);

  const registerEmployee = useCallback((employeeData: Omit<Employee, 'id' | 'registrationDate' | 'completedModules'>) => {
    const newEmployee: Employee = {
      ...employeeData,
      id: crypto.randomUUID(),
      registrationDate: new Date().toISOString(),
      completedModules: ['registration'],
    };
    
    setEmployee(newEmployee);
    setCurrentStep('modules');
    initializeModules(employeeData.jobPosition as JobPosition);
  }, [setEmployee, setCurrentStep, initializeModules]);

  const updateModule = useCallback((moduleId: string, updates: Partial<Module>) => {
    console.log(`Updating module ${moduleId}:`, updates);
    setModules(prev => {
      const newModules = prev.map(module => {
        if (module.id === moduleId) {
          const updatedModule = { ...module, ...updates };
          console.log(`Module ${moduleId} updated:`, { old: module, new: updatedModule });
          return updatedModule;
        }
        return module;
      });
      console.log('All modules after update:', newModules);
      
      // Broadcast change via WebSocket
      broadcastModuleUpdate(moduleId, updates);
      
      return newModules;
    });
  }, [setModules, broadcastModuleUpdate]);

  const addModule = useCallback((newModule: Omit<Module, 'id'>) => {
    const moduleWithId: Module = {
      ...newModule,
      id: Date.now().toString(),
    };
    setModules(prev => [...prev, moduleWithId]);
    
    // Broadcast change via WebSocket
    broadcastModuleAdd(moduleWithId);
  }, [broadcastModuleAdd]);

  const deleteModule = useCallback((moduleId: string) => {
    setModules(prev => prev.filter(module => module.id !== moduleId));
    
    // Broadcast change via WebSocket
    broadcastModuleDelete(moduleId);
  }, [broadcastModuleDelete]);

  const reorderModules = useCallback((reorderedModules: Module[]) => {
    // Atualizar os orders baseado na nova posição
    const modulesWithNewOrder = reorderedModules.map((module, index) => ({
      ...module,
      order: index
    }));
    
    console.log('Reordering modules:', modulesWithNewOrder.map(m => ({ id: m.id, order: m.order })));
    setModules(modulesWithNewOrder);
    
    // Broadcast change via WebSocket
    broadcastModulesReorder(modulesWithNewOrder);
  }, [setModules, broadcastModulesReorder]);

  return {
    employee,
    currentStep,
    modules,
    setCurrentStep,
    registerEmployee,
    completeModule,
    initializeModules,
    updateModule,
    addModule,
    deleteModule,
    reorderModules,
  };
}