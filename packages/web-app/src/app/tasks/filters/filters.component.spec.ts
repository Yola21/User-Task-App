import { MatChipOptionHarness } from '@angular/material/chips/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { Task } from '@take-home/shared';
import { FiltersComponent } from './filters.component';
import { TasksService } from '../tasks.service';
import { MatChipsModule } from '@angular/material/chips';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

class MockTasksService {
  filterTask(): void {
    return;
  }
  getTasksFromStorage(): Promise<Task[]> {
    return Promise.resolve([]);
  }
}

describe('FiltersComponent', () => {
  let fixture: ComponentFixture<FiltersComponent>;
  let loader: HarnessLoader;
  let tasksService: TasksService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule, MatChipsModule],
      declarations: [FiltersComponent],
      providers: [{ provide: TasksService, useClass: MockTasksService }],
    }).compileComponents();
  });

  beforeEach(() => {
    tasksService = TestBed.inject(TasksService);
    fixture = TestBed.createComponent(FiltersComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeDefined();
  });

  it('should contain 3 mat chips for filtering', async () => {
    jest.spyOn(tasksService, 'filterTask');
    const matChips = await loader.getAllHarnesses(MatChipOptionHarness);
    expect(matChips.length).toEqual(3);
    expect(await matChips[0].getText()).toEqual('High Priority');
    expect(await matChips[1].getText()).toEqual('Not Complete');
    expect(await matChips[2].getText()).toEqual('Due Today');
  });

  it('should filter tasks by priority', async () => {
    jest.spyOn(tasksService, 'filterTask');
    const matChips = await loader.getAllHarnesses(MatChipOptionHarness);
    await matChips[0].select();
    expect(tasksService.filterTask).toHaveBeenCalledTimes(1);
    expect(tasksService.filterTask).toHaveBeenCalledWith('priority');
  });

  it('should filter tasks by completed', async () => {
    jest.spyOn(tasksService, 'filterTask');
    const matChips = await loader.getAllHarnesses(MatChipOptionHarness);
    await matChips[1].select();
    expect(tasksService.filterTask).toHaveBeenCalledTimes(1);
    expect(tasksService.filterTask).toHaveBeenCalledWith('completed');
  });

  it('should filter tasks by scheduledDate', async () => {
    jest.spyOn(tasksService, 'filterTask');
    const matChips = await loader.getAllHarnesses(MatChipOptionHarness);
    await matChips[2].select();
    expect(tasksService.filterTask).toHaveBeenCalledTimes(1);
    expect(tasksService.filterTask).toHaveBeenCalledWith('scheduledDate');
  });
});
