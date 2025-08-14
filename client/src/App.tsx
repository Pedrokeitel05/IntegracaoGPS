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
import { Module } from "./types";
// ModuleQuiz não é mais necessário aqui, pois será gerenciado por ModuleContent
// import { ModuleQuiz } from "./components/ModuleQuiz";

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

  const [isInitialized, setIsInitialized] = useState(false);
  // Simplificamos o estado. Agora só precisamos saber qual módulo está ativo.
  const [activeModule, setActiveModule] = useState<Module | null>(null);

  useEffect(() => {
    if (!isInitialized) {
      initializeModules();
      setIsInitialized(true);
    }
  }, [isInitialized, initializeModules]);

  const handleStartOnboarding = () => setCurrentStep("registration");
  const handleRegistrationAttempt = (data: any) => loginByCpf(data);

  const handleModuleStart = (moduleId: string) => {
    const moduleToShow = modules.find((m) => m.id === moduleId);
    if (moduleToShow) {
      setActiveModule(moduleToShow);
    }
  };

  // Esta é a única função necessária para finalizar um módulo.
  // Ela será chamada pelo ModuleContent quando todas as etapas (vídeo e/ou quiz) forem concluídas.
  const handleModuleComplete = () => {
    if (activeModule) {
      completeModule(activeModule.id);
      setActiveModule(null); // Volta para a tela de navegação
    }
  };

  const handleBackToModules = () => {
    setActiveModule(null);
  };

  const handleBackToWelcome = () => setCurrentStep("welcome");

  // Lógica para determinar quais módulos mostrar para o funcionário logado
  const employeeModules = employee
    ? modules
        .filter(
          (module) =>
            !module.targetAreas ||
            module.targetAreas.length === 0 ||
            module.targetAreas.includes(employee.jobPosition as any),
        )
        // Atualiza o estado 'isCompleted' de cada módulo com base nos dados do funcionário
        .map((m) => ({
          ...m,
          isCompleted: employee.completedModules?.includes(m.id) ?? false,
        }))
        .sort((a, b) => a.order - b.order)
    : [];

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={
          {
            /* ... */
          }
        }
      />

      {isAdminMode ? (
        <AdvancedAdminDashboard
          onLogout={logout}
          modules={modules}
          employees={allEmployees}
          onRegisterEmployee={registerEmployee}
          onUpdateEmployee={updateEmployee}
          onDeleteEmployee={deleteEmployee}
          onUpdateModule={updateModule}
          onAddModule={addModule}
          onDeleteModule={deleteModule}
          onReorderModules={reorderModules}
          onRecordAbsence={recordAbsence}
          onToggleBlock={toggleBlockStatus}
        />
      ) : activeModule && employee ? (
        // O ModuleContent agora gerencia todo o fluxo interno (vídeo, quiz, etc.)
        <ModuleContent
          module={activeModule}
          onComplete={handleModuleComplete} // Passa a função de completar
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
              // Passa a lista de módulos já filtrada e atualizada
              return (
                <ModuleNavigation
                  modules={employeeModules}
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
