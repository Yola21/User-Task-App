import { Task, TaskPriority, generateTask } from '@take-home/shared';

export const TASKS_STORE_DI_TOKEN = Symbol('tasks store');

export const tasksStore: Task[] = [
  generateTask({
    uuid: '1',
    title: 'Load App',
    completed: true,
    description: 'Successfully load the app',
    priority: TaskPriority.MEDIUM,
    scheduledDate: new Date(),
  }),
  generateTask({
    uuid: '2',
    title: 'Complete take home assignment',
    completed: false,
    description: 'Task is not complete until all tests pass',
    priority: TaskPriority.HIGH,
    scheduledDate: new Date(),
  }),
];
