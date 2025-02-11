export enum TaskPriority {
  'HIGH' = 'HIGH',
  'MEDIUM' = 'MEDIUM',
  'LOW' = 'LOW',
}

export interface Task {
  uuid: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  completed: boolean;
  isArchived: boolean;
  scheduledDate: Date;
}
