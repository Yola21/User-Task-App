import { Controller, Get } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from '@take-home/shared';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  listTasks(): Task[] {
    return this.tasksService.getTasks();
  }
}
