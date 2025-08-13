import React, { useState } from "react";
import toast from "react-hot-toast";
import { Employee, Module } from "../types";
import {
  Users,
  Edit,
  Trash2,
  Lock,
  Unlock,
  UserPlus,
  Search,
  Eye,
  UserX,
} from "lucide-react";
import { ConfirmationModal } from "./ConfirmationModal";
import { EditEmployeeModal } from "./EditEmployeeModal";
import { ViewProgressModal } from "./ViewProgressModal";
import { NonCompletionModal } from "./NonCompletionModal";

interface EmployeeManagementPanelProps {
  employees: Employee[];
  modules: Module[];
  onDelete: (employeeId: string) => void;
  onRecordAbsence: (employee: Employee, reason: string) => void;
  onToggleBlock: (employee: Employee) => void;
  onUpdateEmployee: (employeeId: string, updates: Partial<Employee>) => void;
}

export function EmployeeManagementPanel({
  employees,
  modules,
  onDelete,
  onRecordAbsence,
  onToggleBlock,
  onUpdateEmployee,
}: EmployeeManagementPanelProps) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
  const [isNonCompletionModalOpen, setIsNonCompletionModalOpen] =
    useState(false);
  const [employeeToJustify, setEmployeeToJustify] = useState<Employee | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");

  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    if (employeeToDelete) {
      onDelete(employeeToDelete.id);
      toast.success("Cadastro excluído com sucesso!");
      setEmployeeToDelete(null);
    }
  };

  const handleToggleBlock = (employee: Employee) => {
    onToggleBlock(employee);
  };

  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleSaveEmployee = (updatedEmployee: Employee) => {
    if (editingEmployee) {
      onUpdateEmployee(editingEmployee.id, updatedEmployee);
      toast.success("Cadastro atualizado com sucesso!");
      setIsEditModalOpen(false);
      setEditingEmployee(null);
    }
  };

  const handleJustifyClick = (employee: Employee) => {
    setEmployeeToJustify(employee);
    setIsNonCompletionModalOpen(true);
  };

  const handleSaveJustification = (reason: string) => {
    if (employeeToJustify) {
      onRecordAbsence(employeeToJustify, reason);
      toast.success("Justificativa salva e acesso bloqueado!");
    }
  };

  const getStatusInfo = (employee: Employee) => {
    if (employee.isBlocked)
      return { text: "Bloqueado", style: "bg-red-500/20 text-red-300" };
    if (employee.completionDate)
      return { text: "Concluído", style: "bg-green-500/20 text-green-300" };
    return { text: "Ativo", style: "bg-blue-500/20 text-blue-300" };
  };

  const filteredEmployees = employees.filter((employee) =>
    employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <Users className="h-6 w-6 text-blue-400" />
          <h2 className="text-xl font-bold text-white">Gestão de Cadastros</h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-300 pointer-events-none" />
          <input
            type="text"
            placeholder="Pesquisar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => {
            const status = getStatusInfo(employee);
            return (
              <div
                key={employee.id}
                className="group bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6 border border-white/20"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div className="flex-1 mb-4 sm:mb-0">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-semibold ${status.style}`}
                      >
                        {status.text}
                      </span>
                      <h3 className="text-lg font-semibold text-white">
                        {employee.fullName}
                      </h3>
                    </div>
                    <p className="text-sm text-blue-200 mt-1">
                      CPF: {employee.cpf}
                    </p>
                    <p className="text-sm text-blue-200">
                      Cargo: {employee.jobPosition} | Empresa:{" "}
                      {employee.company}
                    </p>
                    {employee.hiredBy && (
                      <p className="text-xs text-blue-300/70 mt-2">
                        Cadastrado por: {employee.hiredBy}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => setViewingEmployee(employee)}
                      className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                      title="Visualizar Progresso"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    {!employee.completionDate && (
                      <button
                        onClick={() => handleJustifyClick(employee)}
                        className="p-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                        title="Registrar Ausência"
                      >
                        <UserX className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleToggleBlock(employee)}
                      className={`p-2 transition-colors ${employee.isBlocked ? "text-red-400 hover:text-red-300" : "text-green-400 hover:text-green-300"}`}
                      title={
                        employee.isBlocked
                          ? "Desbloquear Acesso"
                          : "Bloquear Acesso"
                      }
                    >
                      {employee.isBlocked ? (
                        <Lock className="h-5 w-5" />
                      ) : (
                        <Unlock className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEditClick(employee)}
                      className="p-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                      title="Editar Cadastro"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(employee)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                      title="Excluir Cadastro"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white/5 rounded-xl">
            <Search className="h-12 w-12 mx-auto text-blue-400 mb-4" />
            <h3 className="text-xl font-bold text-white">
              Nenhum resultado encontrado
            </h3>
            <p className="text-blue-200 mt-2">
              {searchTerm
                ? "Tente um termo de pesquisa diferente."
                : 'Use a aba "Cadastro de Colaborador" para adicionar um.'}
            </p>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        message={
          employeeToDelete
            ? `Tem certeza que deseja excluir o cadastro de ${employeeToDelete.fullName}? Esta ação não pode ser desfeita.`
            : ""
        }
      />
      <EditEmployeeModal
        isOpen={isEditModalOpen}
        employee={editingEmployee}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEmployee}
      />
      <ViewProgressModal
        isOpen={!!viewingEmployee}
        employee={viewingEmployee}
        modules={modules}
        onClose={() => setViewingEmployee(null)}
      />
      <NonCompletionModal
        isOpen={isNonCompletionModalOpen}
        onClose={() => setIsNonCompletionModalOpen(false)}
        onSave={handleSaveJustification}
        employeeName={employeeToJustify?.fullName || ""}
      />
    </div>
  );
}
