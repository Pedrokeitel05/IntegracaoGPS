import React, { useState } from "react";
import { Employee } from "../types";
import { Download, Calendar, Users, CheckCircle } from "lucide-react";

interface ExportPanelProps {
  allEmployees: Employee[];
}

export function ExportPanel({ allEmployees }: ExportPanelProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filterEmployeesByDateRange = () => {
    if (!startDate || !endDate) return allEmployees;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Inclui o dia todo

    return allEmployees.filter((employee) => {
      if (!employee.completionDate) return false;
      const completionDate = new Date(employee.completionDate);
      return completionDate >= start && completionDate <= end;
    });
  };

  const exportToCSV = () => {
    const filteredEmployees = filterEmployeesByDateRange();

    if (filteredEmployees.length === 0) {
      alert("Nenhum funcionário encontrado no período selecionado.");
      return;
    }

    const headers = [
      "Nome Completo",
      "CPF",
      "Cargo",
      "Empresa",
      "Data de Registro",
      "Data de Conclusão",
      "Módulos Concluídos",
      "Status",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredEmployees.map((employee) =>
        [
          `"${employee.fullName}"`,
          `"${employee.cpf}"`,
          `"${employee.jobPosition}"`,
          `"${employee.company}"`,
          `"${new Date(employee.registrationDate).toLocaleDateString("pt-BR")}"`,
          `"${employee.completionDate ? new Date(employee.completionDate).toLocaleDateString("pt-BR") : "Em andamento"}"`,
          `"${employee.completedModules.length}"`,
          `"${employee.completionDate ? "Concluído" : "Em andamento"}"`,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `funcionarios_${startDate}_${endDate}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const completedEmployees = allEmployees.filter((emp) => emp.completionDate);
  const inProgressEmployees = allEmployees.filter((emp) => !emp.completionDate);
  const filteredCount = filterEmployeesByDateRange().length;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 max-w-5xl mx-auto">
      <div className="flex items-center space-x-3 mb-6">
        <Download className="h-6 w-6 text-blue-400" />
        <h2 className="text-xl font-bold text-white">Exportar Dados</h2>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-500/30">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-400" />
            <span className="text-blue-200">Total de Funcionários</span>
          </div>
          <p className="text-2xl font-bold text-white mt-1">
            {allEmployees.length}
          </p>
        </div>

        <div className="bg-green-500/20 rounded-lg p-4 border border-green-500/30">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="text-green-200">Concluídos</span>
          </div>
          <p className="text-2xl font-bold text-white mt-1">
            {completedEmployees.length}
          </p>
        </div>

        <div className="bg-yellow-500/20 rounded-lg p-4 border border-yellow-500/30">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-yellow-400" />
            <span className="text-yellow-200">Em Andamento</span>
          </div>
          <p className="text-2xl font-bold text-white mt-1">
            {inProgressEmployees.length}
          </p>
        </div>
      </div>

      {/* Filtros de Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-blue-200 mb-2">
            Data de Início
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-200 mb-2">
            Data de Fim
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Resultado do Filtro */}
      {startDate && endDate && (
        <div className="mb-4 p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
          <p className="text-blue-200">
            <strong>{filteredCount}</strong> funcionário(s) concluíram a
            integração entre{" "}
            <strong>{new Date(startDate).toLocaleDateString("pt-BR")}</strong> e{" "}
            <strong>{new Date(endDate).toLocaleDateString("pt-BR")}</strong>
          </p>
        </div>
      )}

      {/* Botão de Exportar */}
      <button
        onClick={exportToCSV}
        disabled={!startDate || !endDate}
        className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:from-gray-600 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center space-x-2"
      >
        <Download className="h-5 w-5" />
        <span>Exportar para CSV</span>
      </button>

      {(!startDate || !endDate) && (
        <p className="text-center text-yellow-200 text-sm mt-2">
          Selecione ambas as datas para exportar
        </p>
      )}
    </div>
  );
}
