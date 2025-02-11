import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Task, TaskPriority } from '@take-home/shared';
import { StorageService } from '../../storage/storage.service';
import { faker } from '@faker-js/faker';
import { scheduled } from 'rxjs';

@Component({
  selector: 'take-home-add-component',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent {
  protected addTaskForm: FormGroup = new FormGroup({
    title: new FormControl(null, [
      Validators.required,
      Validators.minLength(10),
    ]),
    description: new FormControl(null),
    priority: new FormControl(
      { value: TaskPriority.MEDIUM, disabled: false },
      {
        validators: Validators.required,
      },
    ),
    scheduledDate: new FormControl(null, Validators.required),
  });
  protected priorities = Object.values(TaskPriority);

  get taskForm(): FormGroup {
    return this.addTaskForm;
  }

  constructor(private storageService: StorageService, private router: Router) {}

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    return date >= today && date <= nextWeek;
  };

  onSubmit() {
    const newTask: Task = {
      ...this.addTaskForm.getRawValue(),
      uuid: faker.string.uuid(),
      isArchived: false,
      scheduledDate: this.addTaskForm.value.scheduledDate,
    };

    this.storageService.addTaskItem(newTask);
    this.router.navigate(['']);
  }

  onCancel(): void {
    this.router.navigate(['']);
  }
}
