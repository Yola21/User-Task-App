import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '@take-home/shared';
import { StorageService } from '../storage/storage.service';
import Fuse from 'fuse.js';

@Injectable({ providedIn: 'root' })
export class TasksService {
  tasks: Task[] = [];
  private fuse!: Fuse<Task>;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) {}

  getTasksFromApi(): Observable<Task[]> {
    const endpointUrl = '/api/tasks';
    return this.http.get<Task[]>(endpointUrl);
  }

  async getTasksFromStorage(): Promise<void> {
    this.tasks = await this.storageService.getTasks();
    this.initializeFuse();
    this.filterTask('isArchived');
  }

  private initializeFuse() {
    this.fuse = new Fuse(this.tasks, {
      keys: ['title'],
      threshold: 0.3,
    });
  }

  filterTask(key: keyof Task): void {
    switch (key) {
      case 'isArchived':
        this.tasks = this.tasks.filter((task) => !task.isArchived);
        break;
      case 'priority':
        this.tasks = this.tasks.filter((task) => task.priority === 'HIGH');
        break;
      case 'scheduledDate': {
        const today = new Date().toISOString().split('T')[0];
        this.tasks = this.tasks.filter((task) => {
          const taskDate = new Date(task.scheduledDate);
          return taskDate?.toISOString().split('T')[0] === today;
        });
        break;
      }
      case 'completed':
        this.tasks = this.tasks.filter((task) => !task.completed);
    }
  }

  searchTask(search: string): void {
    if (search) {
      const results = this.fuse.search(search);
      this.tasks = results.map((result) => result.item);
    } else {
      this.getTasksFromStorage();
    }
  }
}
