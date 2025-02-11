import { Test, TestingModule } from '@nestjs/testing';

import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { NotImplementedException } from '@nestjs/common';
import { generateTask } from '@take-home/shared';

const mockTasksService = {
  getTasks: () => {
    throw new NotImplementedException();
  },
};

describe('AppController', () => {
  let app: TestingModule;
  let controller: TasksController;
  let service: TasksService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [{ provide: TasksService, useValue: mockTasksService }],
    }).compile();

    controller = app.get(TasksController);
    service = app.get(TasksService);
  });

  describe('getData', () => {
    it('should get the tasks from the service', () => {
      const tasks = [generateTask(), generateTask()];
      jest.spyOn(service, 'getTasks').mockReturnValue(tasks);
      expect(controller.listTasks()).toEqual(tasks);
    });
  });
});
