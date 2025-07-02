import React, { useState } from "react";
import { User, FileText, Building, Briefcase, Calendar } from "lucide-react";
import { JobPosition, Company } from "../types";

interface RegistrationFormProps {
  onSubmit: (data: {
    fullName: string;
    cpf: string;
    jobPosition: JobPosition;
    company: Company;
  }) => void;
}

export function RegistrationForm({ onSubmit }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    cpf: "",
    jobPosition: "" as JobPosition,
    company: "" as Company,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formatCPF = (value: string) =>
    value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, cpf: formatCPF(e.target.value) }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitted) return;
    setIsSubmitted(true);
    onSubmit(formData);
  };

  const isFormValid =
    formData.fullName &&
    formData.cpf.length === 14 &&
    formData.jobPosition &&
    formData.company;

  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <User className="h-12 w-12 text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Cadastro de Funcionário
            </h2>
            <p className="text-blue-200">
              Complete seu cadastro para iniciar o processo de integração
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-blue-200 text-sm font-medium mb-2">
                <FileText className="inline h-4 w-4 mr-2" />
                Nome Completo
              </label>
              <input
                type="text"
                required
                disabled={isSubmitted}
                value={formData.fullName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, fullName: e.target.value }))
                }
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Digite seu nome completo"
              />
            </div>
            <div>
              <label className="block text-blue-200 text-sm font-medium mb-2">
                <FileText className="inline h-4 w-4 mr-2" />
                CPF
              </label>
              <input
                type="text"
                required
                disabled={isSubmitted}
                value={formData.cpf}
                onChange={handleCPFChange}
                maxLength={14}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="000.000.000-00"
              />
            </div>
            <div>
              <label className="block text-blue-200 text-sm font-medium mb-2">
                <Briefcase className="inline h-4 w-4 mr-2" />
                Cargo
              </label>
              <select
                required
                disabled={isSubmitted}
                value={formData.jobPosition}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    jobPosition: e.target.value as JobPosition,
                  }))
                }
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="" className="bg-slate-800">
                  Selecione seu cargo
                </option>
                <option value="Segurança/Recepção" className="bg-slate-800">
                  Segurança/Recepção
                </option>
                <option value="Limpeza Geral" className="bg-slate-800">
                  Limpeza Geral
                </option>
                <option value="Limpeza Hospitalar" className="bg-slate-800">
                  Limpeza Hospitalar
                </option>
                <option value="Administrativo" className="bg-slate-800">
                  Administrativo
                </option>
                <option value="Gerência" className="bg-slate-800">
                  Gerência
                </option>
                <option value="Técnico" className="bg-slate-800">
                  Técnico
                </option>
                <option value="Outros" className="bg-slate-800">
                  Outros
                </option>
              </select>
            </div>
            <div>
              <label className="block text-blue-200 text-sm font-medium mb-2">
                <Building className="inline h-4 w-4 mr-2" />
                Empresa Grupo GPS
              </label>
              <select
                required
                disabled={isSubmitted}
                value={formData.company}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    company: e.target.value as Company,
                  }))
                }
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="" className="bg-slate-800">
                  Selecione sua empresa
                </option>
                <option value="GPS Segurança" className="bg-slate-800">
                  GPS Segurança
                </option>
                <option value="GPS Limpeza" className="bg-slate-800">
                  GPS Limpeza
                </option>
                <option value="GPS Hospitalar" className="bg-slate-800">
                  GPS Hospitalar
                </option>
                <option value="GPS Facilities" className="bg-slate-800">
                  GPS Facilities
                </option>
                <option value="GPS Tecnologia" className="bg-slate-800">
                  GPS Tecnologia
                </option>
              </select>
            </div>
            <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-500/30">
              <div className="flex items-center text-blue-200 text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                Data de Cadastro: {new Date().toLocaleString("pt-BR")}
              </div>
            </div>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitted}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-gray-600 disabled:to-gray-500 text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {isSubmitted ? "Cadastro Concluído" : "Finalizar Cadastro"}
            </button>
          </form>
          {isSubmitted && (
            <div className="mt-6 p-4 bg-green-900/30 border border-green-500/30 rounded-xl">
              <p className="text-green-200 text-center">
                ✓ Cadastro realizado com sucesso! O primeiro módulo foi
                desbloqueado.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
