import { Component } from '@angular/core';
import { TasksService } from '../tasks.service';
import { Task } from '@take-home/shared';
import { MatChipSelectionChange } from '@angular/material/chips';

@Component({
  selector: 'take-home-filters-component',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent {
  constructor(protected tasksService: TasksService) {}

  filterTask(field: keyof Task, event: MatChipSelectionChange) {
    if (event.selected) {
      this.tasksService.filterTask(field);
    } else {
      this.tasksService.getTasksFromStorage();
    }
  }
}
