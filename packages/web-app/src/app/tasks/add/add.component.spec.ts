import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StorageService } from '../../storage/storage.service';
import { AddComponent } from './add.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Router } from '@angular/router';
import { MatButtonHarness } from '@angular/material/button/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputHarness } from '@angular/material/input/testing';
import { ToastrModule } from 'ngx-toastr';
import { MatNativeDateModule } from '@angular/material/core';
import { TaskPriority } from '@take-home/shared';

class MockStorageService {
  addTaskItem(): void {
    return;
  }
}

describe('AddComponent', () => {
  let fixture: ComponentFixture<AddComponent>;
  let loader: HarnessLoader;
  let component: AddComponent;
  let storageService: StorageService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ToastrModule.forRoot(),
      ],
      declarations: [AddComponent],
      providers: [{ provide: StorageService, useClass: MockStorageService }],
    }).compileComponents();
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    storageService = TestBed.inject(StorageService);
    fixture = TestBed.createComponent(AddComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeDefined();
  });

  it('should display the title', () => {
    const title = fixture.debugElement.query(By.css('h1'));
    expect(title.nativeElement.textContent).toEqual('Add Task');
  });

  it('should allow selecting a date using the date picker', async () => {
    const dateInput = await loader.getHarness(
      MatInputHarness.with({ selector: '[formControlName="scheduledDate"]' }),
    );

    const expectedDate = new Date(2024, 11, 25);

    component.taskForm.controls['scheduledDate'].setValue(expectedDate);
    fixture.detectChanges();

    const inputValue = await dateInput.getValue();
    expect(inputValue).toContain('12/25/2024');

    expect(component.taskForm.controls['scheduledDate'].value).toEqual(
      expectedDate,
    );
  });

  it(`should navigate to home when cancel button is clicked`, async () => {
    jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    jest.spyOn(component, 'onCancel');
    const cancelButton = await loader.getHarness(
      MatButtonHarness.with({ selector: '[data-testid="cancel"]' }),
    );
    await cancelButton.click();
    fixture.detectChanges();
    expect(component.onCancel).toHaveBeenCalledTimes(1);
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it(`should prevent adding task without a valid title`, async () => {
    const addButton = await loader.getHarness(
      MatButtonHarness.with({ selector: '[data-testid="add-task"]' }),
    );
  
    expect(await addButton.isDisabled()).toBeTruthy();
  
    component['addTaskForm'].controls['title'].setValue('Invalid');
    component['addTaskForm'].controls['title'].markAsTouched();
    component['addTaskForm'].controls['title'].updateValueAndValidity();
    fixture.detectChanges();
  
    expect(await addButton.isDisabled()).toBeTruthy();
  
    component['addTaskForm'].controls['title'].setValue('This is a valid title');
    component['addTaskForm'].controls['title'].markAsTouched();
    component['addTaskForm'].controls['title'].updateValueAndValidity();
    fixture.detectChanges();
  
    expect(await addButton.isDisabled()).toBeTruthy();
  
    const validDate = new Date();
    validDate.setDate(validDate.getDate() + 3);
  
    component['addTaskForm'].controls['scheduledDate'].setValue(validDate);
    component['addTaskForm'].controls['priority'].setValue(TaskPriority.MEDIUM);
  
    component['addTaskForm'].markAllAsTouched();
    component['addTaskForm'].updateValueAndValidity();
    fixture.detectChanges();
  
    expect(await addButton.isDisabled()).toBeFalsy();
  });

  it(`should create a new task for a valid submission and navigate home`, async () => {
    jest.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    jest.spyOn(component, 'onSubmit');
    jest.spyOn(storageService, 'addTaskItem').mockResolvedValue();
    component['addTaskForm'].controls['title'].setValue('Adding a test task');
    component['addTaskForm'].controls['description'].setValue(
      'This task should be added to the list',
    );
    component['addTaskForm'].controls['scheduledDate'].setValue(
      new Date('2025-02-15'),
    );
    fixture.detectChanges();
    const addButton = await loader.getHarness(
      MatButtonHarness.with({ selector: '[data-testid="add-task"]' }),
    );
    await addButton.click();
    fixture.detectChanges();
    expect(component.onSubmit).toBeCalledTimes(1);
    expect(storageService.addTaskItem).toBeCalledTimes(1);
    expect(storageService.addTaskItem).toBeCalledWith(
      expect.objectContaining({
        isArchived: false,
        title: 'Adding a test task',
        description: 'This task should be added to the list',
        scheduledDate: new Date('2025-02-15'),
      }),
    );
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });
});
