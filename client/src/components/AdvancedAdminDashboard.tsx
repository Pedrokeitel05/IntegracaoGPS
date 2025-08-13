import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  Settings,
  Plus,
  Edit,
  Trash2,
  LogOut,
  Save,
  X,
  Lock,
  Unlock,
  ArrowUp,
  ArrowDown,
  Users,
  LayoutList,
  Download,
  BookOpen,
  Calendar,
  CheckCircle,
  UserPlus,
} from "lucide-react";
import { Module, JobPosition, Employee, AbsenceRecord } from "../types";
import { ExportPanel } from "./ExportPanel";
import { EmployeeRegistrationPanel } from "./EmployeeRegistrationPanel";
import { EmployeeManagementPanel } from "./EmployeeManagementPanel";
import { JOB_POSITIONS, COMPANIES } from "../constants/companyData";

interface AdvancedAdminDashboardProps {
  onLogout: () => void;
  modules: Module[];
  employees: Employee[];
  onRegisterEmployee: (employeeData: any) => void;
  onUpdateEmployee: (employeeId: string, updates: Partial<Employee>) => void;
  onDeleteEmployee: (employeeId: string) => void;
  onUpdateModule: (moduleId: string, updates: Partial<Module>) => void;
  onAddModule: (newModule: Omit<Module, "id">) => void;
  onDeleteModule: (moduleId: string) => void;
  onReorderModules: (reorderedModules: Module[]) => void;
  onRecordAbsence: (employee: Employee, reason: string) => void;
  onToggleBlock: (employee: Employee) => void;
}

interface ModuleFormData {
  title: string;
  description: string;
  videoUrl: string;
  targetAreas: JobPosition[];
  isLocked: boolean;
  order: number;
}

export function AdvancedAdminDashboard({
  onLogout,
  modules,
  employees,
  onRegisterEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
  onUpdateModule,
  onAddModule,
  onDeleteModule,
  onReorderModules,
  onRecordAbsence,
  onToggleBlock,
}: AdvancedAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "modules" | "export" | "register" | "management"
  >("modules");
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<ModuleFormData>({
    title: "",
    description: "",
    videoUrl: "",
    targetAreas: [],
    isLocked: false,
    order: 1,
  });

  const sortedModules = [...(modules || [])].sort((a, b) => a.order - b.order);

  const handleEdit = (module: Module) => {
    setEditingModule(module);
    setFormData({
      title: module.title,
      description: module.description,
      videoUrl: module.videoUrl || "",
      targetAreas: module.targetAreas || [],
      isLocked: module.isLocked,
      order: module.order,
    });
    setShowAddForm(true);
  };

  const handleSave = () => {
    if (editingModule) {
      onUpdateModule(editingModule.id, formData);
      toast.success("Módulo atualizado com sucesso!");
      setEditingModule(null);
      setShowAddForm(false);
      resetForm();
    }
  };

  const handleAdd = () => {
    if (formData.title && formData.description) {
      onAddModule({
        ...formData,
        order: modules.length + 1,
      });
      toast.success("Módulo adicionado com sucesso!");
      setShowAddForm(false);
      resetForm();
    } else {
      toast.error("Título e descrição são obrigatórios.");
    }
  };

  const handleDeleteWithNotification = (moduleId: string) => {
    onDeleteModule(moduleId);
    toast.success("Módulo excluído com sucesso!");
  };

  const handleToggleLockWithNotification = (module: Module) => {
    onUpdateModule(module.id, { isLocked: !module.isLocked });
    toast.success(`Módulo ${!module.isLocked ? "bloqueado" : "desbloqueado"}.`);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      videoUrl: "",
      targetAreas: [],
      isLocked: false,
      order: 1,
    });
  };

  const handleMove = (direction: "up" | "down", module: Module) => {
    const currentIndex = sortedModules.findIndex((m) => m.id === module.id);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex >= 0 && newIndex < sortedModules.length) {
      const reorderedModules = [...sortedModules];
      [reorderedModules[currentIndex], reorderedModules[newIndex]] = [
        reorderedModules[newIndex],
        reorderedModules[currentIndex],
      ];

      onReorderModules(reorderedModules);
      toast.success("Ordem dos módulos atualizada.");
    }
  };

  const handleTargetAreaChange = (area: JobPosition, checked: boolean) => {
    const newTargetAreas = checked
      ? [...formData.targetAreas, area]
      : formData.targetAreas.filter((a) => a !== area);
    setFormData({ ...formData, targetAreas: newTargetAreas });
  };

  const completedEmployees = employees.filter((emp) => emp.completionDate);
  const inProgressEmployees = employees.filter((emp) => !emp.completionDate);

  return (
    <div className="min-h-screen bg-blue-900">
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Settings className="h-8 w-8 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Painel Administrativo
                </h1>
                <p className="text-blue-200">
                  Gerenciamento completo de módulos
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={onLogout}
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <LogOut className="h-5 w-5" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Estatísticas no topo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500/20 rounded-full p-3">
                <BookOpen className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-blue-200 text-sm">Total de Módulos</p>
                <p className="text-2xl font-bold text-white">
                  {modules.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500/20 rounded-full p-3">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-green-200 text-sm">
                  Funcionários Concluídos
                </p>
                <p className="text-2xl font-bold text-white">
                  {completedEmployees.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-500/20 rounded-full p-3">
                <Users className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-yellow-200 text-sm">Em Andamento</p>
                <p className="text-2xl font-bold text-white">
                  {inProgressEmployees.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sistema de Abas */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setActiveTab("modules")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
              activeTab === "modules"
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                : "bg-white/10 text-blue-200 hover:bg-white/20"
            }`}
          >
            <LayoutList className="h-5 w-5" />
            <span>Gerenciar Módulos</span>
          </button>

          <button
            onClick={() => setActiveTab("register")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
              activeTab === "register"
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                : "bg-white/10 text-blue-200 hover:bg-white/20"
            }`}
          >
            <UserPlus className="h-5 w-5" />
            <span>Cadastro de Colaborador</span>
          </button>

          <button
            onClick={() => setActiveTab("export")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
              activeTab === "export"
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                : "bg-white/10 text-blue-200 hover:bg-white/20"
            }`}
          >
            <Download className="h-5 w-5" />
            <span>Exportar Dados</span>
          </button>

          <button
            onClick={() => setActiveTab("management")}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
              activeTab === "management"
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                : "bg-white/10 text-blue-200 hover:bg-white/20"
            }`}
          >
            <Users className="h-5 w-5" />
            <span>Gestão de Cadastros</span>
          </button>
        </div>

        {/* Conteúdo das Abas */}
        {activeTab === "modules" && (
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Lista de Módulos</h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Adicionar Módulo</span>
              </button>
            </div>

            <div className="space-y-4">
              {sortedModules.map((module, index) => (
                <div
                  key={module.id}
                  className="group bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 transition-all duration-300 hover:border-blue-400/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-blue-400 font-mono text-sm">
                          #{module.order.toString().padStart(2, "0")}
                        </span>
                        <h3 className="text-lg font-semibold text-white">
                          {module.title}
                        </h3>
                      </div>
                      <p className="text-blue-200 mb-3">{module.description}</p>
                      {module.targetAreas && module.targetAreas.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {module.targetAreas.map((area) => (
                            <span
                              key={area}
                              className="bg-white/5 text-blue-300 px-2 py-0.5 rounded text-xs font-mono"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => handleMove("up", module)}
                        disabled={index === 0}
                        className="p-2 disabled:opacity-20 disabled:cursor-not-allowed text-blue-300 hover:text-white transition-colors"
                      >
                        <ArrowUp className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleMove("down", module)}
                        disabled={index === sortedModules.length - 1}
                        className="p-2 disabled:opacity-20 disabled:cursor-not-allowed text-blue-300 hover:text-white transition-colors"
                      >
                        <ArrowDown className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleToggleLockWithNotification(module)}
                        className={`p-2 transition-colors ${
                          module.isLocked
                            ? "text-red-400 hover:text-red-300"
                            : "text-green-400 hover:text-green-300"
                        }`}
                      >
                        {module.isLocked ? (
                          <Lock className="h-5 w-5" />
                        ) : (
                          <Unlock className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleEdit(module)}
                        className="p-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteWithNotification(module.id)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {(editingModule || showAddForm) && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-blue-900 border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">
                      {editingModule ? "Editar Módulo" : "Adicionar Módulo"}
                    </h3>
                    <button
                      onClick={() => {
                        setEditingModule(null);
                        setShowAddForm(false);
                        resetForm();
                      }}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">
                        Título do Módulo
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full bg-transparent border-b-2 border-blue-500/30 py-3 px-1 text-white placeholder-gray-400 transition-colors duration-300 focus:outline-none focus:border-blue-400"
                        placeholder="Ex: Recursos Humanos"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">
                        Descrição
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        rows={3}
                        className="w-full bg-transparent border-b-2 border-blue-500/30 py-3 px-1 text-white placeholder-gray-400 transition-colors duration-300 focus:outline-none focus:border-blue-400"
                        placeholder="Descreva o conteúdo do módulo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">
                        URL do Vídeo (opcional)
                      </label>
                      <input
                        type="url"
                        value={formData.videoUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, videoUrl: e.target.value })
                        }
                        className="w-full bg-transparent border-b-2 border-blue-500/30 py-3 px-1 text-white placeholder-gray-400 transition-colors duration-300 focus:outline-none focus:border-blue-400"
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-3">
                        Áreas de Trabalho
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {JOB_POSITIONS.map((position) => (
                          <label
                            key={position}
                            className="flex items-center space-x-3 cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              checked={formData.targetAreas.includes(position)}
                              onChange={(e) =>
                                handleTargetAreaChange(
                                  position,
                                  e.target.checked,
                                )
                              }
                              className="peer absolute h-0 w-0 opacity-0"
                            />
                            <div className="h-5 w-5 rounded-md border-2 border-blue-400 bg-transparent transition-all duration-300 group-hover:border-blue-300 peer-checked:bg-blue-400 peer-checked:border-transparent flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-blue-900 hidden peer-checked:block"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                            <span className="text-white text-sm group-hover:text-blue-200 transition-colors">
                              {position}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        id="isLocked"
                        checked={formData.isLocked}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isLocked: e.target.checked,
                          })
                        }
                        className="peer absolute h-0 w-0 opacity-0"
                      />
                      <div className="h-5 w-5 rounded-md border-2 border-blue-400 bg-transparent transition-all duration-300 group-hover:border-blue-300 peer-checked:bg-blue-400 peer-checked:border-transparent flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-blue-900 hidden peer-checked:block"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span className="text-white text-sm group-hover:text-blue-200 transition-colors">
                        Módulo bloqueado inicialmente
                      </span>
                    </label>
                  </div>
                  <div className="flex space-x-4 mt-8">
                    <button
                      onClick={editingModule ? handleSave : handleAdd}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                    >
                      <Save className="h-5 w-5" />
                      <span>
                        {editingModule
                          ? "Salvar Alterações"
                          : "Adicionar Módulo"}
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingModule(null);
                        setShowAddForm(false);
                        resetForm();
                      }}
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-300"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "export" && <ExportPanel allEmployees={employees} />}

        {activeTab === "register" && (
          <EmployeeRegistrationPanel
            allEmployees={employees}
            onRegister={onRegisterEmployee}
          />
        )}

        {activeTab === "management" && (
          <EmployeeManagementPanel
            employees={employees}
            modules={modules}
            onUpdateEmployee={onUpdateEmployee}
            onDelete={onDeleteEmployee}
            onRecordAbsence={onRecordAbsence}
            onToggleBlock={onToggleBlock}
          />
        )}
      </div>
    </div>
  );
}
