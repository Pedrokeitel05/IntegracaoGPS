import { useState } from 'react';
import { Settings, Plus, Edit, Trash2, LogOut, Save, X, Lock, Unlock, ArrowUp, ArrowDown, Users, Target } from 'lucide-react';
import { Module, JobPosition } from '../types';

interface AdvancedAdminDashboardProps {
  onLogout: () => void;
  modules: Module[];
  onUpdateModule: (moduleId: string, updates: Partial<Module>) => void;
  onAddModule: (newModule: Omit<Module, 'id'>) => void;
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

const jobPositions: JobPosition[] = [
  'Segurança/Recepção',
  'Limpeza Geral', 
  'Limpeza Hospitalar',
  'Administrativo',
  'Gerência',
  'Técnico',
  'Outros'
];

export function AdvancedAdminDashboard({ 
  onLogout, 
  modules, 
  onUpdateModule, 
  onAddModule, 
  onDeleteModule,
  onReorderModules 
}: AdvancedAdminDashboardProps) {
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<ModuleFormData>({
    title: '',
    description: '',
    videoUrl: '',
    targetAreas: [],
    isLocked: false,
    order: 1,
  });

  // Ordenar módulos por order
  const sortedModules = [...modules].sort((a, b) => a.order - b.order);

  const handleSave = () => {
    if (editingModule) {
      // Atualizar módulo existente
      onUpdateModule(editingModule.id, {
        title: formData.title,
        description: formData.description,
        videoUrl: formData.videoUrl,
        targetAreas: formData.targetAreas,
        isLocked: formData.isLocked,
        order: formData.order,
      });
      setEditingModule(null);
    } else if (showAddForm) {
      // Adicionar novo módulo
      onAddModule({
        title: formData.title,
        description: formData.description,
        videoUrl: formData.videoUrl,
        isLocked: formData.isLocked,
        isCompleted: false,
        order: formData.order,
        targetAreas: formData.targetAreas,
        isCustom: true,
      });
      setShowAddForm(false);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      videoUrl: '',
      targetAreas: [],
      isLocked: false,
      order: modules.length + 1,
    });
  };

  const handleEdit = (module: Module) => {
    setEditingModule(module);
    setFormData({
      title: module.title,
      description: module.description,
      videoUrl: module.videoUrl || '',
      targetAreas: module.targetAreas || [],
      isLocked: module.isLocked,
      order: module.order,
    });
    setShowAddForm(false);
  };

  const handleDelete = (moduleId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este módulo? Esta ação não pode ser desfeita.')) {
      onDeleteModule(moduleId);
    }
  };

  const handleAddNew = () => {
    setShowAddForm(true);
    setEditingModule(null);
    resetForm();
  };

  const handleCancel = () => {
    setEditingModule(null);
    setShowAddForm(false);
    resetForm();
  };

  const handleToggleLock = (module: Module) => {
    const newLockState = !module.isLocked;
    console.log(`Toggling lock for module ${module.id}: ${module.isLocked} -> ${newLockState}`);
    onUpdateModule(module.id, { isLocked: newLockState });
  };

  const handleMoveUp = (module: Module) => {
    const currentIndex = sortedModules.findIndex(m => m.id === module.id);
    console.log(`Moving up module ${module.id}, current index: ${currentIndex}`);
    
    if (currentIndex > 0) {
      const newModules = [...sortedModules];
      // Trocar posições no array
      [newModules[currentIndex - 1], newModules[currentIndex]] = [newModules[currentIndex], newModules[currentIndex - 1]];
      
      // Reordenar usando a função do hook
      if (onReorderModules) {
        onReorderModules(newModules);
      }
    }
  };

  const handleMoveDown = (module: Module) => {
    const currentIndex = sortedModules.findIndex(m => m.id === module.id);
    console.log(`Moving down module ${module.id}, current index: ${currentIndex}`);
    
    if (currentIndex < sortedModules.length - 1) {
      const newModules = [...sortedModules];
      // Trocar posições no array
      [newModules[currentIndex], newModules[currentIndex + 1]] = [newModules[currentIndex + 1], newModules[currentIndex]];
      
      // Reordenar usando a função do hook
      if (onReorderModules) {
        onReorderModules(newModules);
      }
    }
  };

  const handleTargetAreaChange = (area: JobPosition, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        targetAreas: [...prev.targetAreas, area]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        targetAreas: prev.targetAreas.filter(a => a !== area)
      }));
    }
  };

  const clearAllModules = () => {
    if (window.confirm('ATENÇÃO: Tem certeza que deseja apagar TODOS os módulos? Esta ação não pode ser desfeita.')) {
      if (window.confirm('Esta é sua última chance. Todos os módulos serão permanentemente removidos. Continuar?')) {
        modules.forEach(module => onDeleteModule(module.id));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Cabeçalho */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Settings className="h-8 w-8 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold text-white">Painel Administrativo</h1>
                <p className="text-blue-200">Gerenciamento completo de módulos</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={clearAllModules}
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Limpar Tudo</span>
              </button>
              
              <button
                onClick={onLogout}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <Settings className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-blue-200 text-sm">Total de Módulos</p>
                <p className="text-2xl font-bold text-white">{modules.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500/20 p-3 rounded-lg">
                <Unlock className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-blue-200 text-sm">Módulos Desbloqueados</p>
                <p className="text-2xl font-bold text-white">{modules.filter(m => !m.isLocked).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-blue-200 text-sm">Módulos Customizados</p>
                <p className="text-2xl font-bold text-white">{modules.filter(m => m.isCustom).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Adicionar Novo Módulo */}
        <div className="mb-8">
          <button
            onClick={handleAddNew}
            className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Adicionar Novo Módulo</span>
          </button>
        </div>

        {/* Formulário de Edição/Adição */}
        {(showAddForm || editingModule) && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
            <h3 className="text-xl font-semibold text-white mb-6">
              {editingModule ? 'Editar Módulo' : 'Adicionar Novo Módulo'}
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-blue-200 text-sm font-medium mb-2">
                  Título do Módulo
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  placeholder="Digite o título do módulo"
                />
              </div>

              <div>
                <label className="block text-blue-200 text-sm font-medium mb-2">
                  URL do Vídeo (YouTube)
                </label>
                <input
                  type="text"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <div className="col-span-2">
                <label className="block text-blue-200 text-sm font-medium mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 h-24 resize-none"
                  placeholder="Descreva o conteúdo do módulo"
                />
              </div>

              <div>
                <label className="block text-blue-200 text-sm font-medium mb-2">
                  Ordem do Módulo
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-blue-200 text-sm font-medium mb-2">
                  Status
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isLocked}
                      onChange={(e) => setFormData(prev => ({ ...prev, isLocked: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-blue-200">Módulo Bloqueado</span>
                  </label>
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-blue-200 text-sm font-medium mb-3">
                  Áreas de Trabalho (quem pode ver este módulo)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {jobPositions.map((position) => (
                    <label key={position} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.targetAreas.includes(position)}
                        onChange={(e) => handleTargetAreaChange(position, e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-blue-200 text-sm">{position}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Cancelar</span>
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.title.trim() || formData.targetAreas.length === 0}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-gray-600 disabled:to-gray-500 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Salvar</span>
              </button>
            </div>
          </div>
        )}

        {/* Lista de Módulos */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-xl font-semibold text-white">
              Módulos ({sortedModules.length})
            </h2>
          </div>

          <div className="divide-y divide-white/10">
            {sortedModules.map((module, index) => (
              <div key={module.id} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm font-medium">
                        #{module.order}
                      </span>
                      <h3 className="text-lg font-semibold text-white">{module.title}</h3>
                      {module.isLocked && (
                        <Lock className="h-4 w-4 text-red-400" />
                      )}
                      {!module.isLocked && (
                        <Unlock className="h-4 w-4 text-green-400" />
                      )}
                      {module.isCustom && (
                        <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">
                          Customizado
                        </span>
                      )}
                    </div>
                    <p className="text-blue-200 mb-3">{module.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Target className="h-4 w-4 text-blue-400" />
                        <span className="text-blue-200">
                          Áreas: {module.targetAreas?.join(', ') || 'Todas'}
                        </span>
                      </div>
                      {module.videoUrl && (
                        <span className="text-green-400">✓ Vídeo configurado</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {/* Controles de Ordem */}
                    <button
                      onClick={() => handleMoveUp(module)}
                      disabled={index === 0}
                      className="p-2 text-blue-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Mover para cima"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(module)}
                      disabled={index === sortedModules.length - 1}
                      className="p-2 text-blue-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Mover para baixo"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>

                    {/* Controle de Lock */}
                    <button
                      onClick={() => handleToggleLock(module)}
                      className={`p-2 transition-colors ${
                        module.isLocked 
                          ? 'text-red-400 hover:text-red-300' 
                          : 'text-green-400 hover:text-green-300'
                      }`}
                      title={module.isLocked ? 'Desbloquear módulo' : 'Bloquear módulo'}
                    >
                      {module.isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                    </button>

                    {/* Editar */}
                    <button
                      onClick={() => handleEdit(module)}
                      className="p-2 text-blue-400 hover:text-white transition-colors"
                      title="Editar módulo"
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    {/* Excluir */}
                    <button
                      onClick={() => handleDelete(module.id)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                      title="Excluir módulo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {sortedModules.length === 0 && (
              <div className="px-6 py-12 text-center text-blue-200">
                <Settings className="h-12 w-12 mx-auto mb-4 text-blue-400" />
                <p className="text-lg">Nenhum módulo encontrado</p>
                <p className="text-sm text-blue-300 mt-1">
                  Adicione o primeiro módulo para começar!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}