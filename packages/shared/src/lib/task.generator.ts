import { faker } from '@faker-js/faker';
import { Task, TaskPriority } from './task.interface';

export function generateTask(partial?: Partial<Task>): Task {
  return {
    uuid: faker.string.uuid(),
    title: faker.lorem.sentence(),
    completed: faker.datatype.boolean(),
    description: faker.lorem.paragraph(),
    priority: faker.helpers.arrayElement(Object.values(TaskPriority)),
    isArchived: false,
    scheduledDate: faker.date.soon({ days: 5 }),
    ...partial,
  };
}
