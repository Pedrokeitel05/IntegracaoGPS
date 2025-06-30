export interface Employee {
  id: string;
  fullName: string;
  cpf: string;
  jobPosition: string;
  company: string;
  registrationDate: string;
  completedModules: string[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  isLocked: boolean;
  isCompleted: boolean;
  requiredFor?: string[];
  content?: ModuleContent;
}

export interface ModuleContent {
  sections: ContentSection[];
  totalDuration: number;
}

export interface ContentSection {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'interactive';
  duration: number;
  completed: boolean;
  content: string;
}

export type JobPosition = 
  | 'Segurança/Recepção'
  | 'Limpeza Geral'
  | 'Limpeza Hospitalar'
  | 'Administrativo'
  | 'Gerência'
  | 'Técnico'
  | 'Outros';

export type Company = 
  | 'GPS Segurança'
  | 'GPS Limpeza'
  | 'GPS Hospitalar'
  | 'GPS Facilities'
  | 'GPS Tecnologia';