import { useState, useCallback, useEffect } from "react";
import { database } from "../firebase";
import { ref, set, onValue, get, push, update } from "firebase/database"; // Adicionado 'update'
import { Employee, Module, JobPosition } from "../types";

export function useOnboarding() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [currentStep, setCurrentStep] = useState<string>("welcome");
  const [modules, setModules] = useState<Module[]>([]);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const modulesRef = ref(database, "modules");
    onValue(modulesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setModules(Array.isArray(data) ? data : Object.values(data));
    });

    const employeesRef = ref(database, "employees");
    onValue(employeesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const employeeList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setAllEmployees(employeeList);
      }
    });

    const savedEmployee = localStorage.getItem("gps_employee");
    if (savedEmployee) {
      setEmployee(JSON.parse(savedEmployee));
      setCurrentStep("modules");
    }
  }, []);

  const initializeModules = useCallback(async () => {
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
      const newEmployeeData = {
        ...employeeData,
        registrationDate: new Date().toISOString(),
        completedModules: ["registration"],
      };
      const newEmployeeRef = push(ref(database, "employees"), newEmployeeData);
      const newEmployeeForState: Employee = {
        ...newEmployeeData,
        id: newEmployeeRef.key!,
      };
      localStorage.setItem("gps_employee", JSON.stringify(newEmployeeForState));
      setEmployee(newEmployeeForState);
      setCurrentStep("modules");
      initializeModules();
    },
    [initializeModules],
  );

  // LÓGICA DE COMPLETAR MÓDULO ATUALIZADA
  const completeModule = useCallback(
    (moduleId: string) => {
      if (!employee) return;

      // Garante que não há módulos duplicados na lista de concluídos
      const newCompletedModules = [
        ...new Set([...employee.completedModules, moduleId]),
      ];

      // Atualiza o objeto do funcionário no estado local
      const updatedEmployee: Employee = {
        ...employee,
        completedModules: newCompletedModules,
      };
      setEmployee(updatedEmployee);
      localStorage.setItem("gps_employee", JSON.stringify(updatedEmployee));

      // Filtra para saber quais módulos são exigidos para este funcionário
      const assignedModules = modules.filter(
        (module) =>
          !module.targetAreas ||
          module.targetAreas.length === 0 ||
          module.targetAreas.includes(employee.jobPosition as any),
      );

      // Verifica se todos os módulos atribuídos foram concluídos
      const allModulesCompleted = assignedModules.every((module) =>
        newCompletedModules.includes(module.id),
      );

      const employeeUpdates: Partial<Employee> = {
        completedModules: newCompletedModules,
      };

      if (allModulesCompleted && !employee.completionDate) {
        console.log(`Integração concluída para ${employee.fullName}`);
        employeeUpdates.completionDate = new Date().toISOString();
        updatedEmployee.completionDate = employeeUpdates.completionDate; // Atualiza o estado local também
        localStorage.setItem("gps_employee", JSON.stringify(updatedEmployee)); // Atualiza o localStorage com a data
      }

      // Envia as atualizações (módulos concluídos e talvez a data de conclusão) para o Firebase
      update(ref(database, `employees/${employee.id}`), employeeUpdates);

      // Atualiza a lista geral de módulos (para desbloquear o próximo na UI)
      const newModulesState = modules.map((module, index, arr) => {
        let isLocked = module.isLocked;
        // Desbloqueia o próximo módulo se o anterior foi concluído
        const prevModule = arr.find((m) => m.order === module.order - 1);
        if (prevModule && newCompletedModules.includes(prevModule.id)) {
          isLocked = false;
        }
        return {
          ...module,
          isCompleted: newCompletedModules.includes(module.id),
          isLocked,
        };
      });
      set(ref(database, "modules"), newModulesState);
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
  };
}
