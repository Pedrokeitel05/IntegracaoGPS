import React, { useState, useEffect } from "react";
import { Employee, JobPosition, Company } from "../types";
import { X, User, FileText, Briefcase, Building } from "lucide-react";
import { JOB_POSITIONS, COMPANIES } from "../constants/companyData";

interface EditEmployeeModalProps {
  isOpen: boolean;
  employee: Employee | null;
  onClose: () => void;
  onSave: (updatedEmployee: Employee) => void;
}

export function EditEmployeeModal({
  isOpen,
  employee,
  onClose,
  onSave,
}: EditEmployeeModalProps) {
  const [formData, setFormData] = useState<Partial<Employee>>({});

  useEffect(() => {
    // Popula o formulário quando um funcionário é selecionado para edição
    if (employee) {
      setFormData(employee);
    }
  }, [employee]);

  if (!isOpen || !employee) {
    return null;
  }

  const handleSave = () => {
    onSave(formData as Employee);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-blue-900 border border-white/20 rounded-2xl p-8 max-w-2xl w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Editar Cadastro</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-blue-200 text-sm font-medium mb-2">
              <User className="inline h-4 w-4 mr-2" />
              Nome Completo
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName || ""}
              onChange={handleChange}
              className="w-full bg-transparent border-b-2 border-blue-500/30 py-3 px-1 text-white placeholder-gray-400 transition-colors duration-300 focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-blue-200 text-sm font-medium mb-2">
              <FileText className="inline h-4 w-4 mr-2" />
              CPF
            </label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf || ""}
              onChange={handleChange}
              className="w-full bg-transparent border-b-2 border-blue-500/30 py-3 px-1 text-white placeholder-gray-400 transition-colors duration-300 focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-blue-200 text-sm font-medium mb-2">
              <Briefcase className="inline h-4 w-4 mr-2" />
              Cargo
            </label>
            <select
              name="jobPosition"
              value={formData.jobPosition || ""}
              onChange={handleChange}
              className="w-full px-1 py-3 bg-blue-900 border-b-2 border-blue-500/30 text-white focus:outline-none focus:border-blue-400"
            >
              {JOB_POSITIONS.map((position) => (
                <option key={position} value={position} className="bg-slate-800">
                  {position}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-blue-200 text-sm font-medium mb-2">
              <Building className="inline h-4 w-4 mr-2" />
              Empresa Grupo GPS
            </label>
            <select
              name="company"
              value={formData.company || ""}
              onChange={handleChange}
              className="w-full px-1 py-3 bg-blue-900 border-b-2 border-blue-500/30 text-white focus:outline-none focus:border-blue-400"
            >
              {COMPANIES.map((company) => (
                <option key={company} value={company} className="bg-slate-800">
                  {company}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}
