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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const sortedModules = [...(modules || [])].sort((a, b) => a.order - b.order);

  // ... (as suas outras funções handle... continuam iguais)
  const handleSave = () => {
    /* ... */
  };
  const resetForm = () => {
    /* ... */
  };
  // etc...

  // LÓGICA DE EXPORTAÇÃO COMPLETA
  const handleExport = () => {
    if (!startDate || !endDate) {
      alert("Por favor, selecione uma data de início e de fim.");
      return;
    }

    // 1. Filtra os funcionários que completaram a integração e têm uma data de conclusão
    const completedEmployees = employees.filter((emp) => emp.completionDate);

    // 2. Filtra por período de datas
    const filteredByDate = completedEmployees.filter((emp) => {
      const completionDate = new Date(emp.completionDate!);
      const start = new Date(startDate);
      const end = new Date(endDate);
      // Ajusta o fim do dia para incluir o dia inteiro selecionado
      end.setHours(23, 59, 59, 999);

      return completionDate >= start && completionDate <= end;
    });

    if (filteredByDate.length === 0) {
      alert("Nenhum funcionário concluiu a integração no período selecionado.");
      return;
    }

    // 3. Cria o conteúdo da planilha (CSV)
    const headers = [
      "Nome Completo",
      "CPF",
      "Cargo",
      "Empresa",
      "Data de Início",
      "Data de Conclusão",
    ];
    const csvRows = [
      headers.join(";"), // Cabeçalho
      ...filteredByDate.map((emp) =>
        [
          `"${emp.fullName}"`,
          `"${emp.cpf}"`,
          `"${emp.jobPosition}"`,
          `"${emp.company}"`,
          `"${new Date(emp.registrationDate).toLocaleDateString("pt-BR")}"`,
          `"${new Date(emp.completionDate!).toLocaleDateString("pt-BR")}"`,
        ].join(";"),
      ),
    ];

    const csvContent = csvRows.join("\n");

    // 4. Cria e descarrega o ficheiro
    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `relatorio_integracao_${startDate}_a_${endDate}.csv`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

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
                  Gerenciamento de módulos e relatórios
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
          
          {/* Sistema de Abas */}
          <div className="flex space-x-4 mt-6">
            <button
              onClick={() => setActiveTab('modules')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'modules'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-blue-200 hover:bg-white/20'
              }`}
            >
              <Settings className="h-5 w-5" />
              <span>Módulos</span>
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'modules' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <Target className="h-6 w-6 text-blue-400" />
                <h2 className="text-xl font-bold text-white">Gerenciar Módulos</h2>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Adicionar Módulo</span>
              </button>
            </div>

            <div className="grid gap-6">
              {sortedModules.map((module) => (
                <div
                  key={module.id}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {module.title}
                      </h3>
                      <p className="text-blue-200 mb-2">{module.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-blue-300">
                        <span>Ordem: {module.order}</span>
                        <span className={module.isLocked ? 'text-red-400' : 'text-green-400'}>
                          {module.isLocked ? 'Bloqueado' : 'Desbloqueado'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingModule(module)}
                        className="bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 p-2 rounded-lg transition-colors"
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
          </div>
        )}

        {activeTab === 'export' && (
          <div>
            <ExportPanel allEmployees={employees} />
          </div>
        )}
      </div>
    </div>
  );
}
