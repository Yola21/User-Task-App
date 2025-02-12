import { Component } from '@angular/core';

import { Task } from '@take-home/shared';
import { take } from 'rxjs';
import { TasksService } from '../tasks.service';
import { Router } from '@angular/router';
import { StorageService } from '../../storage/storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'take-home-list-component',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {
  constructor(
    private storageService: StorageService,
    protected tasksService: TasksService,
    private router: Router,
    private toastr: ToastrService,
  ) {
    this.getTaskList();
  }

  onDoneTask(item: Task): void {
    item.completed = true;
    this.storageService.updateTaskItem(item);
    this.tasksService.getTasksFromStorage();
    this.toastr.success('Task marked as completed successfully!', 'Success', {
      positionClass: 'toast-bottom-center'
    });
  }

  onDeleteTask(item: Task): void {
    item.isArchived = true;
    this.storageService.updateTaskItem(item);
    this.tasksService.getTasksFromStorage();
    this.toastr.success('Task deleted successfully!', 'Success', {
      positionClass: 'toast-bottom-center'
    });
  }
  
  onAddTask(): void {
    this.router.navigate(['add']);
  }

  private getTaskList(): void {
    this.tasksService
      .getTasksFromApi()
      .pipe(take(1))
      .subscribe(async (tasks) => {
        tasks.forEach(async (task) => {
          await this.storageService.updateTaskItem(task);
        });
        await this.tasksService.getTasksFromStorage();
      });
  }
}
