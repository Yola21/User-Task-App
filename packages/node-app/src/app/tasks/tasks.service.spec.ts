import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { Task, generateTask } from '@take-home/shared';
import { TASKS_STORE_DI_TOKEN, tasksStore } from './tasks.store';

describe('AppService', () => {
  let service: TasksService;

  const fakeTasks: Task[] = [generateTask(), generateTask()];

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TASKS_STORE_DI_TOKEN, useValue: tasksStore },
      ],
    }).compile();

    service = app.get(TasksService);
  });

  describe('getTasks', () => {
    it('should return a list with all tasks in the store', () => {
      jest.spyOn(service, 'getTasks').mockReturnValue(fakeTasks);
      const result = service.getTasks();
      expect(result).toEqual(fakeTasks);
    });
  });
});
