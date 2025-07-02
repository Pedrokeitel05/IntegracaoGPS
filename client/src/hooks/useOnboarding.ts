import { useState, useCallback, useEffect } from "react";
import { database } from "../firebase";
import { ref, set, onValue, get } from "firebase/database";
import { Employee, Module, JobPosition } from "../types";

export function useOnboarding() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [currentStep, setCurrentStep] = useState<string>("welcome");
  const [modules, setModules] = useState<Module[]>([]);

  // Ouve por alterações nos módulos em tempo real
  useEffect(() => {
    const modulesRef = ref(database, "modules");
    onValue(modulesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setModules(Array.isArray(data) ? data : Object.values(data));
      }
    });

    // Carrega os dados do funcionário do armazenamento local ao iniciar
    const savedEmployee = localStorage.getItem("gps_employee");
    if (savedEmployee) {
      setEmployee(JSON.parse(savedEmployee));
      setCurrentStep("modules");
    }
  }, []);

  // Cria os módulos base APENAS se a base de dados estiver vazia
  const initializeModules = useCallback(async (jobPosition: JobPosition) => {
    const modulesRef = ref(database, "modules");
    const snapshot = await get(modulesRef);

    if (!snapshot.exists()) {
      const baseModules: Module[] = [
        {
          id: "registration",
          title: "Cadastro",
          description: "Complete seu cadastro",
          isLocked: false,
          isCompleted: true,
          order: 1,
          targetAreas: [
            "Segurança/Recepção",
            "Limpeza Geral",
            "Limpeza Hospitalar",
            "Administrativo",
            "Gerência",
            "Técnico",
            "Outros",
          ],
          isCustom: false,
        },
        {
          id: "hr",
          title: "Recursos Humanos",
          description: "Políticas e procedimentos da empresa",
          isLocked: false,
          isCompleted: false,
          order: 2,
          targetAreas: [
            "Segurança/Recepção",
            "Limpeza Geral",
            "Limpeza Hospitalar",
            "Administrativo",
            "Gerência",
            "Técnico",
            "Outros",
          ],
          isCustom: false,
        },
        {
          id: "quality",
          title: "Garantia de Qualidade",
          description: "Padrões e processos de qualidade",
          isLocked: true,
          isCompleted: false,
          order: 3,
          targetAreas: [
            "Segurança/Recepção",
            "Limpeza Geral",
            "Limpeza Hospitalar",
            "Administrativo",
            "Gerência",
            "Técnico",
            "Outros",
          ],
          isCustom: false,
        },
        {
          id: "safety",
          title: "Segurança do Trabalho e Meio Ambiente",
          description: "Protocolos de segurança e diretrizes ambientais",
          isLocked: true,
          isCompleted: false,
          order: 4,
          targetAreas: [
            "Segurança/Recepção",
            "Limpeza Geral",
            "Limpeza Hospitalar",
            "Administrativo",
            "Gerência",
            "Técnico",
            "Outros",
          ],
          isCustom: false,
        },
        {
          id: "benefits",
          title: "Benefícios",
          description: "Benefícios e remuneração dos funcionários",
          isLocked: true,
          isCompleted: false,
          order: 5,
          targetAreas: [
            "Segurança/Recepção",
            "Limpeza Geral",
            "Limpeza Hospitalar",
            "Administrativo",
            "Gerência",
            "Técnico",
            "Outros",
          ],
          isCustom: false,
        },
      ];
      await set(modulesRef, baseModules);
    }
  }, []);

  const registerEmployee = useCallback(
    (
      employeeData: Omit<
        Employee,
        "id" | "registrationDate" | "completedModules"
      >,
    ) => {
      const newEmployee: Employee = {
        ...employeeData,
        id: crypto.randomUUID(),
        registrationDate: new Date().toISOString(),
        completedModules: ["registration"],
      };
      localStorage.setItem("gps_employee", JSON.stringify(newEmployee));
      setEmployee(newEmployee);
      setCurrentStep("modules");
      initializeModules(employeeData.jobPosition as JobPosition);
    },
    [initializeModules],
  );

  const completeModule = useCallback(
    (moduleId: string) => {
      if (!employee) return;
      const updatedEmployee = {
        ...employee,
        completedModules: [...employee.completedModules, moduleId],
      };
      localStorage.setItem("gps_employee", JSON.stringify(updatedEmployee));
      setEmployee(updatedEmployee);

      const newModules = modules.map((module, index) => {
        if (module.id === moduleId) return { ...module, isCompleted: true };
        if (index > 0 && modules[index - 1].id === moduleId)
          return { ...module, isLocked: false };
        return module;
      });
      set(ref(database, "modules"), newModules);
    },
    [employee, modules],
  );

  const updateModule = useCallback(
    (moduleId: string, updates: Partial<Module>) => {
      const newModules = modules.map((module) =>
        module.id === moduleId ? { ...module, ...updates } : module,
      );
      set(ref(database, "modules"), newModules);
    },
    [modules],
  );

  const addModule = useCallback(
    (newModule: Omit<Module, "id">) => {
      const moduleWithId: Module = { ...newModule, id: Date.now().toString() };
      const newModules = [...modules, moduleWithId];
      set(ref(database, "modules"), newModules);
    },
    [modules],
  );

  const deleteModule = useCallback(
    (moduleId: string) => {
      const newModules = modules.filter((module) => module.id !== moduleId);
      set(ref(database, "modules"), newModules);
    },
    [modules],
  );

  const reorderModules = useCallback((reorderedModules: Module[]) => {
    const modulesWithNewOrder = reorderedModules.map((module, index) => ({
      ...module,
      order: index + 1,
    }));
    set(ref(database, "modules"), modulesWithNewOrder);
  }, []);

  const resetOnboarding = useCallback(() => {
    localStorage.removeItem("gps_employee");
    setEmployee(null);
    setCurrentStep("welcome");
  }, []);

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
    resetOnboarding,
  };
}
