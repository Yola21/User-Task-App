import { Inject, Injectable } from '@nestjs/common';
import { Task, TaskPriority, generateTask } from '@take-home/shared';
import { TASKS_STORE_DI_TOKEN } from './tasks.store';

@Injectable()
export class TasksService {
  constructor(
    @Inject(TASKS_STORE_DI_TOKEN)
    private tasksStore: Task[],
  ) {}

  getTasks(): Task[] {
    return this.tasksStore;
  }
}
