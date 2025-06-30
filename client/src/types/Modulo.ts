export interface Module {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isLocked: boolean;
  videoUrl?: string; // novo campo opcional
}