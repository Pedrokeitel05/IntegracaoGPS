import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
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
    allEmployees,
    setCurrentStep,
    registerEmployee,
    loginByCpf,
    completeModule,
    initializeModules,
    updateModule,
    addModule,
    deleteModule,
    reorderModules,
    resetOnboarding,
    updateEmployee,
    deleteEmployee,
    recordAbsence,
    toggleBlockStatus,
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
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      initializeModules();
      setIsInitialized(true);
    }
  }, [isInitialized, initializeModules]);

  const handleStartOnboarding = () => setCurrentStep("registration");
  const handleRegistrationAttempt = (data: any) => loginByCpf(data);
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
  const handleBackToWelcome = () => setCurrentStep("welcome");

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={
          {
            // ...
          }
        }
      />

      {isAdminMode ? (
        <AdvancedAdminDashboard
          onLogout={logout}
          modules={modules}
          employees={allEmployees}
          onRegisterEmployee={registerEmployee}
          onUpdateModule={updateModule}
          onAddModule={addModule}
          onDeleteModule={deleteModule}
          onReorderModules={reorderModules}
          onUpdateEmployee={updateEmployee}
          onDeleteEmployee={deleteEmployee}
          onRecordAbsence={recordAbsence}
          onToggleBlock={toggleBlockStatus}
        />
      ) : activeModule ? (
        <ModuleContent
          moduleId={activeModule}
          onComplete={handleModuleComplete}
          onBack={handleBackToModules}
        />
      ) : (
        (() => {
          switch (currentStep) {
            case "registration":
              return (
                <RegistrationForm
                  onSubmit={handleRegistrationAttempt}
                  onBack={handleBackToWelcome}
                />
              );
            case "modules":
              if (!employee) {
                setCurrentStep("welcome");
                return null;
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
        })()
      )}
    </>
  );
}

export default App;
