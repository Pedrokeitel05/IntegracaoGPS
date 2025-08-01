export interface Employee {
  id: string;
  fullName: string;
  cpf: string;
  jobPosition: string;
  company: string;
  registrationDate: string;
  completedModules: string[];
  completionDate?: string; // NOVO CAMPO ADICIONADO
}

export interface Module {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  isLocked: boolean;
  isCompleted: boolean;
  requiredFor?: string[];
  content?: ModuleContent;
  order: number;
  targetAreas: JobPosition[];
  isCustom?: boolean;
}

export interface ModuleContent {
  sections: ContentSection[];
  totalDuration: number;
}

export interface ContentSection {
  id: string;
  title: string;
  type: "video" | "text" | "quiz" | "interactive";
  duration: number;
  completed: boolean;
  content: string;
}

export type JobPosition =
  | "Segurança/Recepção"
  | "Limpeza Geral"
  | "Limpeza Hospitalar"
  | "Administrativo"
  | "Gerência"
  | "Técnico"
  | "Outros";

export type Company =
  | "GPS Segurança"
  | "GPS Limpeza"
  | "GPS Hospitalar"
  | "GPS Facilities"
  | "GPS Tecnologia";
