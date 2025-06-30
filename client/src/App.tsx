import React, { useEffect, useState } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { RegistrationForm } from './components/RegistrationForm';
import { ModuleNavigation } from './components/ModuleNavigation';
import { ModuleContent } from './components/ModuleContent';
import { useOnboarding } from './hooks/useOnboarding';

function App() {
  const {
    employee,
    currentStep,
    modules,
    setCurrentStep,
    registerEmployee,
    completeModule,
    initializeModules,
  } = useOnboarding();

  const [activeModule, setActiveModule] = useState<string | null>(null);

  useEffect(() => {
    if (employee) {
      initializeModules(employee.jobPosition as any);
      if (currentStep === 'welcome') {
        setCurrentStep('modules');
      }
    }
  }, [employee, initializeModules, currentStep, setCurrentStep]);

  const handleStartOnboarding = () => {
    setCurrentStep('registration');
  };

  const handleRegistrationSubmit = (data: any) => {
    registerEmployee(data);
  };

  const handleModuleStart = (moduleId: string) => {
    if (moduleId === 'registration') return;
    setActiveModule(moduleId);
  };

  const handleModuleComplete = () => {
    if (activeModule) {
      completeModule(activeModule);
      setActiveModule(null);
    }
  };

  const handleBackToModules = () => {
    setActiveModule(null);
  };

  // Mostrar conteúdo do módulo se um módulo estiver ativo
  if (activeModule) {
    return (
      <ModuleContent
        moduleId={activeModule}
        onComplete={handleModuleComplete}
        onBack={handleBackToModules}
      />
    );
  }

  // Mostrar tela apropriada baseada no passo atual
  switch (currentStep) {
    case 'welcome':
      return <WelcomeScreen onStart={handleStartOnboarding} />;
    
    case 'registration':
      return <RegistrationForm onSubmit={handleRegistrationSubmit} />;
    
    case 'modules':
      if (!employee) {
        setCurrentStep('welcome');
        return <WelcomeScreen onStart={handleStartOnboarding} />;
      }
      return (
        <ModuleNavigation
          modules={modules}
          employee={employee}
          onModuleStart={handleModuleStart}
        />
      );
    
    default:
      return <WelcomeScreen onStart={handleStartOnboarding} />;
  }
}

export default App;