import { useState } from 'react';
import { Settings, Plus, Edit, Trash2, Video, LogOut, Save } from 'lucide-react';
import { Module } from '../types';
import { useModuleManagement } from '../hooks/useModuleManagement';

interface AdminDashboardProps {
  onLogout: () => void;
  allModules: Module[];
  onUpdateModule: (modules: Module[]) => void;
}

export function AdminDashboard({ onLogout, allModules, onUpdateModule }: AdminDashboardProps) {
  const { modules: customModules, addModule, updateModule, deleteModule } = useModuleManagement();
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
  });

  // Combinar módulos padrão com customizados
  const allModulesList = [...allModules, ...customModules];

  const handleSave = () => {
    if (editingModule) {
      // Atualizar módulo existente
      if (allModules.find(m => m.id === editingModule.id)) {
        // É um módulo padrão - atualizar na lista principal
        const updatedModules = allModules.map(m => 
          m.id === editingModule.id 
            ? { ...m, title: formData.title, description: formData.description, videoUrl: formData.videoUrl }
            : m
        );
        onUpdateModule(updatedModules);
      } else {
        // É um módulo customizado
        updateModule(editingModule.id, {
          title: formData.title,
          description: formData.description,
          videoUrl: formData.videoUrl,
        });
      }
      setEditingModule(null);
    } else if (showAddForm) {
      // Adicionar novo módulo
      addModule({
        title: formData.title,
        description: formData.description,
        videoUrl: formData.videoUrl,
        isLocked: false,
        isCompleted: false,
      });
      setShowAddForm(false);
    }
    
    setFormData({ title: '', description: '', videoUrl: '' });
  };

  const handleEdit = (module: Module) => {
    setEditingModule(module);
    setFormData({
      title: module.title,
      description: module.description,
      videoUrl: module.videoUrl || '',
    });
    setShowAddForm(false);
  };

  const handleDelete = (moduleId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este módulo?')) {
      if (allModules.find(m => m.id === moduleId)) {
        // É um módulo padrão - removê-lo da lista principal
        const updatedModules = allModules.filter(m => m.id !== moduleId);
        onUpdateModule(updatedModules);
      } else {
        // É um módulo customizado
        deleteModule(moduleId);
      }
    }
  };

  const handleAddNew = () => {
    setShowAddForm(true);
    setEditingModule(null);
    setFormData({ title: '', description: '', videoUrl: '' });
  };

  const handleCancel = () => {
    setEditingModule(null);
    setShowAddForm(false);
    setFormData({ title: '', description: '', videoUrl: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Settings className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Botão Adicionar */}
        <div className="mb-6">
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Adicionar Módulo
          </button>
        </div>

        {/* Formulário de Edição/Adição */}
        {(editingModule || showAddForm) && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingModule ? 'Editar Módulo' : 'Adicionar Novo Módulo'}
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite o título do módulo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite a descrição do módulo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL do Vídeo
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                Salvar
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Lista de Módulos */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Módulos ({allModulesList.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {allModulesList.map((module) => (
              <div key={module.id} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {module.title}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {module.description}
                    </p>
                    {module.videoUrl && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">
                        <Video className="h-4 w-4" />
                        <a 
                          href={module.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Ver vídeo
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(module)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(module.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {allModulesList.length === 0 && (
              <div className="px-6 py-12 text-center text-gray-500">
                Nenhum módulo encontrado. Adicione o primeiro módulo!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}