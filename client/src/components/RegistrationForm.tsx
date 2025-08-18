import React, { useState } from "react";
import {
  User,
  FileText,
  Building,
  Briefcase,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { JOB_POSITIONS, COMPANIES } from "../constants/companyData";

interface RegistrationFormProps {
  onSubmit: (data: any) => { status: string; [key: string]: any } | null;
  onBack: () => void;
}

export function RegistrationForm({ onSubmit, onBack }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    cpf: "",
    jobPosition: "" as JobPosition,
    company: "" as Company,
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatCPF = (value: string) =>
    value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((prev) => ({ ...prev, cpf: formatCPF(e.target.value) }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = onSubmit(formData);

    if (result) {
      switch (result.status) {
        case "SUCCESS":
          setIsSubmitted(true);
          break;
        case "CPF_NOT_FOUND":
          setError(
            "CPF não encontrado. Por favor, contate o RH para poder prosseguir.",
          );
          break;
        case "JOB_MISMATCH":
          setError(
            "O cargo selecionado está incorreto. Verifique seus dados ou contate o RH.",
          );
          break;
        case "COMPANY_MISMATCH":
          setError(
            "A empresa selecionada está incorreta. Verifique seus dados ou contate o RH.",
          );
          break;
        case "USER_BLOCKED":
          setError(
            "Seu acesso está bloqueado. Por favor, contate o RH para mais informações.",
          );
          break;
        default:
          setError("Ocorreu um erro inesperado. Tente novamente.");
          break;
      }
    } else {
      setError(
        "CPF não encontrado. Por favor, contate o RH para poder prosseguir.",
      );
    }
  };

  const isFormValid =
    formData.fullName &&
    formData.cpf.length === 14 &&
    formData.jobPosition &&
    formData.company &&
    termsAccepted;

  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <User className="h-12 w-12 text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Iniciar Integração
            </h2>
            <p className="text-blue-200">
              Preencha seus dados para acessar o treinamento.
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
                {JOB_POSITIONS.map((position) => (
                  <option
                    key={position}
                    value={position}
                    className="bg-slate-800"
                  >
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
                {COMPANIES.map((company) => (
                  <option
                    key={company}
                    value={company}
                    className="bg-slate-800"
                  >
                    {company}
                  </option>
                ))}
              </select>
            </div>

            {/* Início da Seção Adicionada */}
            <div className="pt-2">
              <label className="flex items-start space-x-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    disabled={isSubmitted}
                    className="peer absolute h-5 w-5 opacity-0"
                  />
                  <div className="h-5 w-5 mt-0.5 rounded-md border-2 border-blue-400 bg-transparent transition-all duration-300 group-hover:border-blue-300 peer-checked:bg-blue-400 peer-checked:border-transparent flex items-center justify-center flex-shrink-0">
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
                </div>
                <span className="text-white text-sm group-hover:text-blue-200 transition-colors">
                  Declaro que todas as informações fornecidas no cabeçalho são verdadeiras, que realizarei a integração e as avaliações propostas, comprometendo-me a não compartilhá-lo com terceiros.
                </span>
              </label>
            </div>

            <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-500/30">
              <div className="flex items-center text-blue-200 text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                Data de Cadastro: {new Date().toLocaleString("pt-BR")}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row-reverse gap-4 pt-2">
              <button
                type="submit"
                disabled={!isFormValid || isSubmitted}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-blue-800 disabled:to-blue-700 disabled:opacity-50 text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {isSubmitted ? "Acesso Liberado!" : "Acessar Treinamento"}
              </button>
              <button
                type="button"
                onClick={onBack}
                className="w-full sm:w-1/3 bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300"
              >
                Voltar
              </button>
            </div>
          </form>

          {isSubmitted && (
            <div className="mt-6 p-4 bg-green-900/30 border border-green-500/30 rounded-xl">
              <p className="text-green-200 text-center">
                ✓ Cadastro validado com sucesso! Você será redirecionado.
              </p>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-900/30 border border-red-500/30 rounded-xl flex items-center justify-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-300" />
              <p className="text-red-200 text-center">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
