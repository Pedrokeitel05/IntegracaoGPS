import { JOB_POSITIONS, COMPANIES } from "../constants/companyData";

export interface QuestionOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
  correctOptionId: string;
}

export interface AbsenceRecord {
  reason: string;
  date: string;
}

export type HistoryEventType =
  | "CRIAÇÃO"
  | "EDIÇÃO"
  | "BLOQUEIO"
  | "DESBLOQUEIO"
  | "AUSÊNCIA";

export interface HistoryRecord {
  type: HistoryEventType;
  date: string;
  details: string;
  author: string;
}

export interface Employee {
  id: string;
  fullName: string;
  cpf: string;
  jobPosition: string;
  company: string;
  registrationDate: string;
  completedModules: string[];
  completionDate?: string;
  isBlocked?: boolean;
  hiredBy?: string;
  nonCompletionReason?: string;
  nonCompletionDate?: string;
  nonCompletionRecords?: AbsenceRecord[];
  history?: HistoryRecord[];
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
  questions?: Question[];
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

export type JobPosition = (typeof JOB_POSITIONS)[number];

export type Company = (typeof COMPANIES)[number];
