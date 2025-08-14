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
import { ModuleQuiz } from "./components/ModuleQuiz";

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
  const [activeVideoModule, setActiveVideoModule] = useState<Module | null>(null);
  const [activeQuizModule, setActiveQuizModule] = useState<Module | null>(null);

  useEffect(() => {
    if (!isInitialized) {
      initializeModules();
      setIsInitialized(true);
    }
  }, [isInitialized, initializeModules]);

  const handleStartOnboarding = () => setCurrentStep("registration");

  const handleRegistrationAttempt = (data: any) => loginByCpf(data);
  
  const handleModuleStart = (moduleId: string) => {
    const moduleToShow = modules.find(m => m.id === moduleId);
    if (moduleToShow) {
      setActiveVideoModule(moduleToShow);
    }
  };

  const handleVideoComplete = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    // Se o módulo tiver perguntas, mostra a avaliação
    if (module?.questions && module.questions.length > 0) {
      setActiveVideoModule(null); // Esconde o vídeo
      setActiveQuizModule(module);  // Mostra a avaliação
    } else {
      // Se não tiver, completa o módulo diretamente
      completeModule(moduleId);
      setActiveVideoModule(null);
    }
  };

  const handleQuizComplete = (moduleId: string) => {
    completeModule(moduleId);
    setActiveQuizModule(null);
  };


  const handleBackToModules = () => {
    setActiveVideoModule(null);
    setActiveQuizModule(null);
  };

  const handleBackToWelcome = () => setCurrentStep("welcome");

  return (
    <>
      <Toaster position="bottom-right" toastOptions={{/* ... */}} />

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
      ) : activeQuizModule && employee ? (
        <ModuleQuiz
          module={activeQuizModule}
          employee={employee}
          onComplete={() => handleQuizComplete(activeQuizModule.id)}
          onBack={handleBackToModules}
        />
      ) : activeVideoModule && employee ? (
        <ModuleContent
          module={activeVideoModule} // Passa o objeto completo
          onVideoComplete={handleVideoComplete} // Usa a nova função de callback
          onBack={handleBackToModules}
        />
      ) : (
        (() => {
          switch (currentStep) {
            case "registration":
              return <RegistrationForm onSubmit={handleRegistrationAttempt} onBack={handleBackToWelcome} />;
            case "modules":
              if (!employee) {
                setCurrentStep("welcome");
                return null;
              }
              return <ModuleNavigation modules={modules} employee={employee} onModuleStart={handleModuleStart} onLogout={resetOnboarding} />;
            case "welcome":
            default:
              return (
                <>
                  <WelcomeScreen onStart={handleStartOnboarding} onAdminClick={openLoginModal} />
                  <AdminLoginModal isOpen={showLoginModal} onClose={closeLoginModal} onLogin={login} />
                </>
              );
          }
        })()
      )}
    </>
  );
}

export default App;
