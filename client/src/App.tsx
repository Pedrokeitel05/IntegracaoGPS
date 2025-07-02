import React, { useEffect, useState } from "react";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { RegistrationForm } from "./components/RegistrationForm";
import { ModuleNavigation } from "./components/ModuleNavigation";
import { ModuleContent } from "./components/ModuleContent";
import { AdvancedAdminDashboard } from "./components/AdvancedAdminDashboard";
import { AdminLoginModal } from "./components/AdminLoginModal";
import { useOnboarding } from "./hooks/useOnboarding";
import { useAdmin } from "./hooks/useAdmin";

function App() {
  const {
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
    resetOnboarding,
  } = useOnboarding();

  const {
    isAdminMode,
    showLoginModal,
    login,
    logout,
    openLoginModal,
    closeLoginModal,
  } = useAdmin();
  const [activeModule, setActiveModule] = useState<string | null>(null);

  useEffect(() => {
    if (employee && modules.length === 0) {
      initializeModules(employee.jobPosition as any);
    }
  }, [employee, modules.length, initializeModules]);

  const handleStartOnboarding = () => setCurrentStep("registration");
  const handleRegistrationSubmit = (data: any) => registerEmployee(data);
  const handleModuleStart = (moduleId: string) => {
    if (moduleId !== "registration") setActiveModule(moduleId);
  };
  const handleModuleComplete = () => {
    if (activeModule) {
      completeModule(activeModule);
      setActiveModule(null);
    }
  };
  const handleBackToModules = () => setActiveModule(null);

  if (isAdminMode) {
    return (
      <AdvancedAdminDashboard
        onLogout={logout}
        modules={modules}
        onUpdateModule={updateModule}
        onAddModule={addModule}
        onDeleteModule={deleteModule}
        onReorderModules={reorderModules}
      />
    );
  }

  if (activeModule) {
    return (
      <ModuleContent
        moduleId={activeModule}
        onComplete={handleModuleComplete}
        onBack={handleBackToModules}
      />
    );
  }

  switch (currentStep) {
    case "registration":
      return <RegistrationForm onSubmit={handleRegistrationSubmit} />;

    case "modules":
      if (!employee) {
        setCurrentStep("welcome");
        return null; // Evita piscar a tela
      }
      return (
        <ModuleNavigation
          modules={modules}
          employee={employee}
          onModuleStart={handleModuleStart}
          onLogout={resetOnboarding}
        />
      );

    case "welcome":
    default:
      return (
        <>
          <WelcomeScreen
            onStart={handleStartOnboarding}
            onAdminClick={openLoginModal}
          />
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
