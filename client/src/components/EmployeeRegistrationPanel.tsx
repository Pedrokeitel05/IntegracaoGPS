import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  UserPlus,
  FileText,
  Briefcase,
  Building,
  UserCheck,
} from "lucide-react";
import { Employee, JobPosition, Company } from "../types";
import { JOB_POSITIONS, COMPANIES } from "../constants/companyData";

interface EmployeeRegistrationPanelProps {
  allEmployees: Employee[];
  onRegister: (data: any) => void;
}

export function EmployeeRegistrationPanel({
  allEmployees,
  onRegister,
}: EmployeeRegistrationPanelProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    cpf: "",
    jobPosition: "" as JobPosition,
    company: "" as Company,
    hiredBy: "",
  });

  const formatCPF = (value: string) =>
    value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, cpf: formatCPF(e.target.value) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userExists = allEmployees.some((emp) => emp.cpf === formData.cpf);
    if (userExists) {
      toast.error("CPF já cadastrado no sistema.");
      return;
    }

    onRegister({
      ...formData,
    });

    toast.success("Colaborador cadastrado com sucesso!");

    setFormData({
      fullName: "",
      cpf: "",
      jobPosition: "" as JobPosition,
      company: "" as Company,
      hiredBy: "",
    });
  };

  const isFormValid =
    formData.fullName &&
    formData.cpf.length === 14 &&
    formData.jobPosition &&
    formData.company &&
    formData.hiredBy;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <UserPlus className="h-12 w-12 text-blue-400" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">
          Cadastro de Novo Colaborador
        </h2>
        <p className="text-blue-200 max-w-xl mx-auto">
          Preencha os dados abaixo para conceder acesso à plataforma de
          integração.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        <div>
          <label className="block text-blue-200 text-sm font-medium mb-2">
            <FileText className="inline h-4 w-4 mr-2" />
            Nome Completo
          </label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, fullName: e.target.value }))
            }
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            placeholder="Digite o nome completo"
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
            value={formData.cpf}
            onChange={handleCPFChange}
            maxLength={14}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
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
            value={formData.jobPosition}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                jobPosition: e.target.value as JobPosition,
              }))
            }
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          >
            <option value="" className="bg-slate-800">
              Selecione um cargo
            </option>
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
            required
            value={formData.company}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                company: e.target.value as Company,
              }))
            }
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          >
            <option value="" className="bg-slate-800">
              Selecione uma empresa
            </option>
            {COMPANIES.map((company) => (
              <option key={company} value={company} className="bg-slate-800">
                {company}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-blue-200 text-sm font-medium mb-2">
            <UserCheck className="inline h-4 w-4 mr-2" />
            Nome do Contratante (RH)
          </label>
          <input
            type="text"
            required
            value={formData.hiredBy}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, hiredBy: e.target.value }))
            }
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            placeholder="Digite o nome de quem realizou o cadastro"
          />
        </div>
        <div className="pt-4">
          <button
            type="submit"
            disabled={!isFormValid}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:from-gray-600 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <UserPlus className="h-5 w-5" />
            <span>Finalizar Cadastro</span>
          </button>
        </div>
      </form>
    </div>
  );
}
