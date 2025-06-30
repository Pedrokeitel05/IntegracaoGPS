import React, { useEffect, useState } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { RegistrationForm } from './components/RegistrationForm';
import { ModuleNavigation } from './components/ModuleNavigation';
import { ModuleContent } from './components/ModuleContent';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { useOnboarding } from './hooks/useOnboarding';
import { useAdmin } from './hooks/useAdmin';

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

  const { isAdminMode, showLoginModal, login, logout, openLoginModal, closeLoginModal } = useAdmin();
  const [activeModule, setActiveModule] = useState<string | null>(null);

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

  const handleUpdateModules = (updatedModules: any[]) => {
    // Atualizar os módulos através do hook useOnboarding se necessário
    // Por enquanto, os módulos customizados são gerenciados pelo AdminDashboard
  };

  // Se está no modo admin, mostrar o painel administrativo
  if (isAdminMode) {
    return (
      <AdminDashboard
        onLogout={logout}
        allModules={modules}
        onUpdateModule={handleUpdateModules}
      />
    );
  }

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
      return (
        <>
          <WelcomeScreen onStart={handleStartOnboarding} onAdminClick={openLoginModal} />
          <AdminLoginModal
            isOpen={showLoginModal}
            onClose={closeLoginModal}
            onLogin={login}
          />
        </>
      );
    
    case 'registration':
      return (
        <>
          <RegistrationForm onSubmit={handleRegistrationSubmit} />
          <AdminLoginModal
            isOpen={showLoginModal}
            onClose={closeLoginModal}
            onLogin={login}
          />
        </>
      );
    
    case 'modules':
      if (!employee) {
        setCurrentStep('welcome');
        return (
          <>
            <WelcomeScreen onStart={handleStartOnboarding} onAdminClick={openLoginModal} />
            <AdminLoginModal
              isOpen={showLoginModal}
              onClose={closeLoginModal}
              onLogin={login}
            />
          </>
        );
      }
      return (
        <>
          <ModuleNavigation
            modules={modules}
            employee={employee}
            onModuleStart={handleModuleStart}
            onAdminClick={openLoginModal}
          />
          <AdminLoginModal
            isOpen={showLoginModal}
            onClose={closeLoginModal}
            onLogin={login}
          />
        </>
      );
    
    default:
      return (
        <>
          <WelcomeScreen onStart={handleStartOnboarding} onAdminClick={openLoginModal} />
          <AdminLoginModal
            isOpen={showLoginModal}
            onClose={closeLoginModal}
            onLogin={login}
          />
        </>
      );
  }
}

export default App;