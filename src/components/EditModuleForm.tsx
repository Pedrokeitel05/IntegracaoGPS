import React, { useState } from 'react';
import { Module } from '../types';

interface Props {
  module: Module;
  onSave: (updated: Module) => void;
  onCancel: () => void;
}

export function EditModuleForm({ module, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(module.title);
  const [description, setDescription] = useState(module.description);
  const [videoUrl, setVideoUrl] = useState(module.videoUrl || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...module, title, description, videoUrl });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 p-4 bg-slate-800 rounded-lg text-white">
      <div className="mb-4">
        <label className="block mb-1">Título</label>
        <input 
          type="text" 
          value={title} 
          onChange={e => setTitle(e.target.value)}
          className="w-full rounded p-2 text-black"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Descrição</label>
        <textarea 
          value={description} 
          onChange={e => setDescription(e.target.value)}
          className="w-full rounded p-2 text-black"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Link do Vídeo (YouTube)</label>
        <input 
          type="text" 
          value={videoUrl} 
          onChange={e => setVideoUrl(e.target.value)}
          className="w-full rounded p-2 text-black"
        />
      </div>
      <div className="flex space-x-4">
        <button type="submit" className="bg-green-600 px-4 py-2 rounded">Salvar</button>
        <button type="button" className="bg-gray-500 px-4 py-2 rounded" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}