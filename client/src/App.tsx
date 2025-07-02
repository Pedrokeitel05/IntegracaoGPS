import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast"; // O import continua o mesmo
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
      initializeModules();
    }
  }, [employee, modules, initializeModules]);

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
  const handleBackToWelcome = () => setCurrentStep("welcome");

  return (
    <>
      {/* Bloco do Toaster com novo estilo e posição */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          // Estilo base para todas as notificações
          style: {
            background: "rgba(15, 23, 42, 0.8)", // Fundo azul escuro semi-transparente
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "16px",
            color: "#FFFFFF",
            minWidth: "300px",
          },
          // Estilo para notificações de SUCESSO
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10B981", // Verde
              secondary: "#FFFFFF",
            },
          },
          // Estilo para notificações de ERRO
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#EF4444", // Vermelho
              secondary: "#FFFFFF",
            },
          },
        }}
      />

      {/* O resto da sua lógica de renderização continua aqui */}
      {isAdminMode ? (
        <AdvancedAdminDashboard
          onLogout={logout}
          modules={modules}
          employees={allEmployees}
          onUpdateModule={updateModule}
          onAddModule={addModule}
          onDeleteModule={deleteModule}
          onReorderModules={reorderModules}
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
                  onSubmit={handleRegistrationSubmit}
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
