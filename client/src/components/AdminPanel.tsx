import React, { useState } from 'react';
import { Module } from '../types';
import { EditModuleForm } from './EditModuleForm';

interface AdminPanelProps {
  modules: Module[];
  onUpdate: (modules: Module[]) => void;
}

export function AdminPanel({ modules, onUpdate }: AdminPanelProps) {
  const [selected, setSelected] = useState<Module | null>(null);

  const handleSave = (updated: Module) => {
    const updatedList = modules.map(m => m.id === updated.id ? updated : m);
    onUpdate(updatedList);
    setSelected(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-white">Painel de Gerenciamento</h1>

      <ul className="space-y-2">
        {modules.map((module) => (
          <li key={module.id} className="bg-slate-700 p-4 rounded-xl text-white flex justify-between items-center">
            <span>{module.title}</span>
            <button 
              className="text-blue-300 underline"
              onClick={() => setSelected(module)}
            >
              Editar
            </button>
          </li>
        ))}
      </ul>

      {selected && (
        <EditModuleForm
          module={selected}
          onSave={handleSave}
          onCancel={() => setSelected(null)}
        />
      )}
    </div>
  );
}