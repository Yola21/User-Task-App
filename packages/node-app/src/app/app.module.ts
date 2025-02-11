import { Module } from '@nestjs/common';

import { TASKS_STORE_DI_TOKEN, tasksStore } from './tasks/tasks.store';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';

@Module({
  imports: [],
  controllers: [TasksController],
  providers: [
    TasksService,
    { provide: TASKS_STORE_DI_TOKEN, useValue: tasksStore },
  ],
})
export class AppModule {}
