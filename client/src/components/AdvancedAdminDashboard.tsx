import { useState } from "react";
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
  Target,
  Download,
  BookOpen,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { Module, JobPosition, Employee } from "../types";
import { ExportPanel } from "./ExportPanel";

interface AdvancedAdminDashboardProps {
  onLogout: () => void;
  modules: Module[];
  employees: Employee[];
  onUpdateModule: (moduleId: string, updates: Partial<Module>) => void;
  onAddModule: (newModule: Omit<Module, "id">) => void;
  onDeleteModule: (moduleId: string) => void;
  onReorderModules: (reorderedModules: Module[]) => void;
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
  onUpdateModule,
  onAddModule,
  onDeleteModule,
  onReorderModules,
}: AdvancedAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'modules' | 'export'>('modules');
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
  };

  const handleSave = () => {
    if (editingModule) {
      onUpdateModule(editingModule.id, formData);
      setEditingModule(null);
      resetForm();
    }
  };

  const handleAdd = () => {
    if (formData.title && formData.description) {
      onAddModule({
        ...formData,
        order: modules.length + 1,
      });
      setShowAddForm(false);
      resetForm();
    }
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

  const handleToggleLock = (module: Module) =>
    onUpdateModule(module.id, { isLocked: !module.isLocked });

  const handleMove = (direction: "up" | "down", module: Module) => {
    const currentIndex = sortedModules.findIndex((m) => m.id === module.id);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex >= 0 && newIndex < sortedModules.length) {
      const reorderedModules = [...sortedModules];
      [reorderedModules[currentIndex], reorderedModules[newIndex]] = 
      [reorderedModules[newIndex], reorderedModules[currentIndex]];
      
      onReorderModules(reorderedModules);
    }
  };

  const handleTargetAreaChange = (area: JobPosition, checked: boolean) => {
    const newTargetAreas = checked
      ? [...formData.targetAreas, area]
      : formData.targetAreas.filter((a) => a !== area);
    setFormData({ ...formData, targetAreas: newTargetAreas });
  };

  const jobPositions: JobPosition[] = [
    "Segurança/Recepção",
    "Limpeza Geral", 
    "Limpeza Hospitalar",
    "Administrativo",
    "Gerência",
    "Técnico",
    "Outros"
  ];

  const completedEmployees = employees.filter(emp => emp.completionDate);
  const inProgressEmployees = employees.filter(emp => !emp.completionDate);

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
                className="bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-500 hover:to-gray-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
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
                <p className="text-2xl font-bold text-white">{modules.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500/20 rounded-full p-3">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-green-200 text-sm">Funcionários Concluídos</p>
                <p className="text-2xl font-bold text-white">{completedEmployees.length}</p>
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
                <p className="text-2xl font-bold text-white">{inProgressEmployees.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sistema de Abas */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('modules')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
              activeTab === 'modules'
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-blue-200 hover:bg-white/20'
            }`}
          >
            <Target className="h-5 w-5" />
            <span>Gerenciar Módulos</span>
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
              activeTab === 'export'
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-blue-200 hover:bg-white/20'
            }`}
          >
            <Download className="h-5 w-5" />
            <span>Exportar Dados</span>
          </button>
        </div>

        {/* Conteúdo das Abas */}
        {activeTab === 'modules' && (
          <div>
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

            {/* Lista de Módulos */}
            <div className="space-y-4">
              {sortedModules.map((module, index) => (
                <div
                  key={module.id}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-semibold">
                          #{module.order}
                        </span>
                        <h3 className="text-lg font-semibold text-white">
                          {module.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {module.isLocked ? (
                            <Lock className="h-4 w-4 text-red-400" />
                          ) : (
                            <Unlock className="h-4 w-4 text-green-400" />
                          )}
                        </div>
                      </div>
                      <p className="text-blue-200 mb-3">{module.description}</p>
                      {module.targetAreas && module.targetAreas.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {module.targetAreas.map((area) => (
                            <span
                              key={area}
                              className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-md text-xs"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleMove("up", module)}
                        disabled={index === 0}
                        className="bg-blue-500/20 hover:bg-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed text-blue-400 p-2 rounded-lg transition-colors"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleMove("down", module)}
                        disabled={index === sortedModules.length - 1}
                        className="bg-blue-500/20 hover:bg-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed text-blue-400 p-2 rounded-lg transition-colors"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleLock(module)}
                        className={`p-2 rounded-lg transition-colors ${
                          module.isLocked
                            ? "bg-red-500/20 hover:bg-red-500/40 text-red-400"
                            : "bg-green-500/20 hover:bg-green-500/40 text-green-400"
                        }`}
                      >
                        {module.isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleEdit(module)}
                        className="bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-400 p-2 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteModule(module.id)}
                        className="bg-red-500/20 hover:bg-red-500/40 text-red-400 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal de Edição/Adição */}
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
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ex: Recursos Humanos"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-2">
                        Descrição
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-200 mb-3">
                        Áreas de Trabalho
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {jobPositions.map((position) => (
                          <label key={position} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.targetAreas.includes(position)}
                              onChange={(e) => handleTargetAreaChange(position, e.target.checked)}
                              className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                            />
                            <span className="text-white text-sm">{position}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="isLocked"
                        checked={formData.isLocked}
                        onChange={(e) => setFormData({ ...formData, isLocked: e.target.checked })}
                        className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="isLocked" className="text-white text-sm">
                        Módulo bloqueado inicialmente
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-4 mt-8">
                    <button
                      onClick={editingModule ? handleSave : handleAdd}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                    >
                      <Save className="h-5 w-5" />
                      <span>{editingModule ? "Salvar Alterações" : "Adicionar Módulo"}</span>
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

        {activeTab === 'export' && (
          <ExportPanel allEmployees={employees} />
        )}
      </div>
    </div>
  );
}