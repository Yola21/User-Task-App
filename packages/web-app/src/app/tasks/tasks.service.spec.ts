import { TasksService } from './tasks.service';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { StorageService } from '../storage/storage.service';
import { Task, TaskPriority, generateTask } from '@take-home/shared';
import Fuse from 'fuse.js';

jest.mock('fuse.js', () => {
  class MockFuse {
    list: { title: string }[];
    constructor(list: { title: string }[] = []) {
      this.list = list;
    }

    search(query: string) {
      return this.list
        .filter((item) => item.title.includes(query))
        .map((item) => ({ item }));
    }
  }

  return {
    __esModule: true,
    default: MockFuse,
  };
});

class MockStorageService {
  getTasks(): Promise<Task[]> {
    return Promise.resolve([]);
  }
}

describe('TasksService', () => {
  let service: TasksService;
  let storageService: StorageService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TasksService,
        { provide: StorageService, useClass: MockStorageService },
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TasksService);
    storageService = TestBed.inject(StorageService);
    service.tasks = [
      generateTask({ title: 'Load App' }),
      generateTask({ title: 'Take home assignment' }),
      generateTask({ title: 'Thank you for your time' }),
    ];
    service['fuse'] = new Fuse(service.tasks, { keys: ['title'], threshold: 0.3 });
  });

  describe('getTasksFromApi', () => {
    it('should send a GET request to /tasks', (done) => {
      service.getTasksFromApi().subscribe(done);

      const endpointUrl = '/api/tasks';
      const req = httpTestingController.expectOne(endpointUrl);
      expect(req.request.method).toEqual('GET');
      req.flush(null);
      httpTestingController.verify();
    });

    it('should return the received data', () => {
      const fakeData = [1, 2, 3];

      service.getTasksFromApi().subscribe((data) => {
        expect(data).toEqual(fakeData);
      });
      const endpointUrl = '/api/tasks';
      const req = httpTestingController.expectOne(endpointUrl);
      req.flush(fakeData);
    });
  });

  describe('getTasksFromStorage', () => {
    it('should load tasks from storage', async () => {
      jest.spyOn(storageService, 'getTasks').mockResolvedValueOnce([]);
      await service.getTasksFromStorage();
      expect(service.tasks).toEqual([]);
      expect(storageService.getTasks).toHaveBeenCalledTimes(1);
    });

    it('should filter tasks by isArchived', async () => {
      jest.spyOn(storageService, 'getTasks').mockResolvedValueOnce([]);
      jest.spyOn(service, 'filterTask');
      await service.getTasksFromStorage();
        expect(service.tasks).toEqual([]);
        expect(service.filterTask).toHaveBeenCalledTimes(1);
        expect(service.filterTask).toHaveBeenCalledWith('isArchived');
    });
  });

  describe('filterTask', () => {
    it('should filter task by isArchived key', () => {
      service.tasks = [generateTask(), generateTask({ isArchived: true })];
      service.filterTask('isArchived');
      expect(service.tasks.length).toEqual(1);
    });

    it('should filter task by priority key', () => {
      service.tasks = [
        generateTask({ priority: TaskPriority.LOW }),
        generateTask({ priority: TaskPriority.HIGH }),
      ];
      service.filterTask('priority');
      expect(service.tasks.length).toEqual(1);
    });

    it('should filter task by completed key', () => {
      service.tasks = [
        generateTask({ completed: false }),
        generateTask({ completed: true }),
      ];
      service.filterTask('completed');
      expect(service.tasks.length).toEqual(1);
    });

    it('should filter task by scheduledDate key', () => {
      service.tasks = [
        generateTask({ scheduledDate: new Date('2025-02-12') }),
        generateTask({ scheduledDate: new Date('2025-02-13') }),
      ];
      service.filterTask('scheduledDate');
      expect(service.tasks.length).toEqual(1);
    });
    
  });

  describe('searchTask', () => {
    it('should search task list for title with search term', () => {
      service.searchTask('home');
      expect(service.tasks.length).toEqual(1);
    });

    it('should reset task list if search term is empty', () => {
      service.searchTask('');
      expect(service.tasks.length).toEqual(3);
    });

    it.todo('should search task list for a fuzzy match on title');
  });
});
