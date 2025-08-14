import { useState, useCallback, useEffect } from "react";
import { database } from "../firebase";
import { ref, onValue, get, push, update, remove, set } from "firebase/database";
import toast from "react-hot-toast";
import {
  Employee,
  Module,
  JobPosition,
  Company,
  HistoryRecord,
  HistoryEventType,
} from "../types";

// Função auxiliar para garantir que o módulo tenha todos os campos necessários
const ensureModuleDefaults = (module: Partial<Module>, id: string, order: number): Module => {
  return {
    id: id,
    title: module.title || "Módulo sem Título",
    description: module.description || "",
    isLocked: module.isLocked === undefined ? true : module.isLocked,
    isCompleted: module.isCompleted || false,
    order: module.order || order,
    targetAreas: module.targetAreas || [],
    questions: module.questions || [],
    videoUrl: module.videoUrl || "",
    isCustom: module.isCustom === undefined ? false : module.isCustom,
  };
};

export function useOnboarding() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [currentStep, setCurrentStep] = useState<string>("welcome");
  const [modules, setModules] = useState<Module[]>([]);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const modulesRef = ref(database, "modules");
    onValue(modulesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const moduleList = Object.keys(data).map((key, index) => 
          ensureModuleDefaults(data[key], key, index + 1)
        );
        setModules(moduleList);
      } else {
        setModules([]);
      }
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
      } else {
        setAllEmployees([]);
      }
    });

    const savedEmployee = localStorage.getItem("gps_employee");
    if (savedEmployee) {
      setEmployee(JSON.parse(savedEmployee));
      setCurrentStep("modules");
    }
  }, []);

  const addHistoryRecord = async (
    employeeId: string,
    type: HistoryEventType,
    details: string,
  ) => {
    const employeeRef = ref(database, `employees/${employeeId}`);
    const snapshot = await get(employeeRef);
    if (snapshot.exists()) {
      const currentEmployee = snapshot.val();
      const newRecord: HistoryRecord = {
        type,
        details,
        date: new Date().toISOString(),
        author: "Admin",
      };
      const updatedHistory = [...(currentEmployee.history || []), newRecord];
      await update(employeeRef, { history: updatedHistory });
    }
  };

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

      // Salva como objeto: { id: módulo }
      const modulesObject = baseModules.reduce((acc, module) => {
        acc[module.id] = module;
        return acc;
      }, {} as Record<string, Module>);

      await set(modulesRef, modulesObject);
    }

  }, []);

  const registerEmployee = useCallback(
    (employeeData: Omit<Employee, "id" | "history" | "registrationDate" | "completedModules">) => {
      const newEmployeeData: Partial<Employee> = {
        ...employeeData,
        registrationDate: new Date().toISOString(),
        completedModules: ["registration"],
        isBlocked: false,
        history: [
          {
            type: "CRIAÇÃO",
            date: new Date().toISOString(),
            details: `Registo criado por ${employeeData.hiredBy || "Admin"}.`,
            author: employeeData.hiredBy || "Admin",
          },
        ],
      };
      push(ref(database, "employees"), newEmployeeData);
    },
    [],
  );

  const loginByCpf = useCallback(
      (loginData: {
        cpf: string;
        jobPosition: JobPosition;
        company: Company;
      }) => {
        const foundEmployee = allEmployees.find(
          (emp) => emp.cpf === loginData.cpf,
        );
        if (!foundEmployee) return { status: "CPF_NOT_FOUND" };
        if (foundEmployee.isBlocked) return { status: "USER_BLOCKED" };
        if (foundEmployee.jobPosition !== loginData.jobPosition)
          return { status: "JOB_MISMATCH" };
        if (foundEmployee.company !== loginData.company)
          return { status: "COMPANY_MISMATCH" };
        localStorage.setItem("gps_employee", JSON.stringify(foundEmployee));
        setEmployee(foundEmployee);
        setCurrentStep("modules");
        return { status: "SUCCESS", employee: foundEmployee };
    },
    [allEmployees],
  );

  const updateEmployee = useCallback(
      async (employeeId: string, updates: Partial<Employee>) => {
        const employeeRef = ref(database, `employees/${employeeId}`);

        const snapshot = await get(employeeRef);
        if (!snapshot.exists()) {
          toast.error("Erro: Colaborador não encontrado.");
          return;
        }
        const originalEmployee = snapshot.val() as Employee;

        const editableFields: (keyof Employee)[] = [
          "fullName",
          "cpf",
          "jobPosition",
          "company",
        ];

        const sanitizedUpdates: Partial<Employee> = {};
        editableFields.forEach((key) => {
          if (
            updates[key] !== undefined &&
            updates[key] !== originalEmployee[key]
          ) {
            sanitizedUpdates[key] = updates[key];
          }
        });

        if (Object.keys(sanitizedUpdates).length === 0) {
          toast.success("Nenhuma alteração para salvar.");
          return;
        }

        // Dicionário para traduzir os nomes dos campos
        const fieldTranslations: Record<string, string> = {
          fullName: "Nome Completo",
          cpf: "CPF",
          jobPosition: "Cargo",
          company: "Empresa",
        };

        // Gera a string de detalhes usando os nomes traduzidos
        const changes = Object.keys(sanitizedUpdates)
          .map((key) => {
            const typedKey = key as keyof Employee;
            const oldValue = originalEmployee[typedKey] || "vazio";
            const newValue = sanitizedUpdates[typedKey] || "vazio";
            const translatedKey = fieldTranslations[typedKey] || typedKey; // Usa a tradução ou o nome original
            return `Campo "${translatedKey}" alterado de "${oldValue}" para "${newValue}"`;
          })
          .join("; ");

        const finalUpdates: Partial<Employee> = { ...sanitizedUpdates };
        const details = `Dados atualizados: ${changes}.`;
        const newRecord: HistoryRecord = {
          type: "EDIÇÃO",
          details,
          date: new Date().toISOString(),
          author: "Admin",
        };

        const updatedHistory = [...(originalEmployee.history || []), newRecord];
        finalUpdates.history = updatedHistory;

        await update(employeeRef, finalUpdates);
    },
    [],
  );

  const toggleBlockStatus = useCallback(async (employee: Employee) => {
    const newStatus = !employee.isBlocked;
    const eventType = newStatus ? "BLOQUEIO" : "DESBLOQUEIO";
    const details = `Acesso do utilizador foi ${newStatus ? "bloqueado" : "desbloqueado"}.`;
    await addHistoryRecord(employee.id, eventType, details);

    const employeeRef = ref(database, `employees/${employee.id}`);
    update(employeeRef, { isBlocked: newStatus });
  }, []);

  const recordAbsence = useCallback(
      async (employee: Employee, reason: string) => {
        await addHistoryRecord(employee.id, "AUSÊNCIA", `Motivo: ${reason}`);
        const employeeRef = ref(database, `employees/${employee.id}`);
        update(employeeRef, { isBlocked: true });
    },
    [],
  );

  const deleteEmployee = useCallback((employeeId: string) => {
    const employeeRef = ref(database, `employees/${employeeId}`);
    remove(employeeRef);
  }, []);

  const completeModule = useCallback(
    (moduleId: string) => {
      if (!employee) return;
      const newCompletedModules = [
        ...new Set([...(employee.completedModules || []), moduleId]),
      ];

      const updatedEmployee: Employee = {
        ...employee,
        completedModules: newCompletedModules,
      };

      setEmployee(updatedEmployee);
      localStorage.setItem("gps_employee", JSON.stringify(updatedEmployee));

      const employeeUpdates: Partial<Employee> = {
        completedModules: newCompletedModules,
      };

      const assignedModules = modules.filter(
        (module) =>
          !module.targetAreas ||
          module.targetAreas.length === 0 ||
          module.targetAreas.includes(employee.jobPosition as any),
      );

      const allModulesCompleted = assignedModules.every((module) =>
        newCompletedModules.includes(module.id),
      );

      if (allModulesCompleted && !employee.completionDate) {
        employeeUpdates.completionDate = new Date().toISOString();
        updatedEmployee.completionDate = employeeUpdates.completionDate;
        localStorage.setItem("gps_employee", JSON.stringify(updatedEmployee));
      }

      update(ref(database, `employees/${employee.id}`), employeeUpdates);

      // --- LÓGICA DE DESBLOQUEIO CORRIGIDA ---
      const currentModule = modules.find(m => m.id === moduleId);
      if (currentModule) {
        const nextModule = modules.sort((a, b) => a.order - b.order).find(m => m.order === currentModule.order + 1);
        if (nextModule) {
          update(ref(database, `modules/${nextModule.id}`), { isLocked: false });
        }
      }
    },
    [employee, modules],
  );

  const updateModule = useCallback(
    async (moduleId: string, updates: Partial<Module>) => {
      const moduleRef = ref(database, `modules/${moduleId}`);
      await update(moduleRef, updates);
    },
    [],
  );

  // --- FUNÇÃO DE ADICIONAR MÓDULO CORRIGIDA ---
  const addModule = useCallback(
    async (newModuleData: Omit<Module, "id">) => {
      const newModuleRef = push(ref(database, "modules"));
      const moduleId = newModuleRef.key;

      if (moduleId) {
        const highestOrder = modules.reduce((max, m) => Math.max(max, m.order || 0), 0);
        const finalModule = ensureModuleDefaults(newModuleData, moduleId, highestOrder + 1);

        await set(newModuleRef, finalModule);
      }
    },
    [modules], 
  );

  const deleteModule = useCallback(async (moduleId: string) => {
    await remove(ref(database, `modules/${moduleId}`));
  }, []);

  const reorderModules = useCallback(
    async (reorderedModules: Module[]) => {
      const updates: { [key: string]: any } = {};
      reorderedModules.forEach((module, index) => {
        updates[`/${module.id}/order`] = index + 1;
      });
      await update(ref(database, "modules"), updates);
    },
    [],
  );

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
  };
}