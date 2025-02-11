import { Injectable } from '@angular/core';
import { openDB } from 'idb';
import { from, Observable } from 'rxjs';

import { Task } from '@take-home/shared';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private dbName = 'take-home';
  private dbVersion = 1;
  private tasks = 'tasks';

  constructor() {
    this.restoreIndexedDB();
    // this.resetIndexedDB();
  }

  // Create / Update
  async addTaskItem(item: Task) {
    await this.addTask(item);
  }

  async updateTaskItem(item: Task) {
    await this.updateTask(item);
  }

  // Read
  getTask(id: string | null): Promise<Task> {
    const dbPromise = openDB(`${this.dbName}`, this.dbVersion);
    return dbPromise.then((db) => {
      return db.get(`${this.tasks}`, id ? id : '');
    });
  }

  getTasks(): Promise<Task[]> {
    const dbPromise = openDB(`${this.dbName}`, this.dbVersion);
    return dbPromise.then((db) => {
      return db.getAll(`${this.tasks}`);
    });
  }

  getItem<T>(storeName: string, id: string | null): Observable<T> {
    const dbPromise = openDB(`${this.dbName}`, this.dbVersion);
    return from(
      dbPromise.then((db) => {
        return db.get(storeName, id ? id : '');
      }),
    );
  }

  getItems<T>(storeName: string): Promise<T[]> {
    const dbPromise = openDB(`${this.dbName}`, this.dbVersion);
    return dbPromise.then((db) => {
      return db.getAll(storeName);
    });
  }

  async resetIndexedDB() {
    const tasks = this.clearTasks();
    await Promise.allSettled([tasks]).then(() => {
      this.restoreIndexedDB();
    });
  }

  private addTask(item: Task) {
    const dbPromise = openDB(`${this.dbName}`, this.dbVersion);
    return dbPromise.then((db) => {
      return db.add(this.tasks, item, item.uuid);
    });
  }

  private updateTask(item: Task) {
    const dbPromise = openDB(`${this.dbName}`, this.dbVersion);
    return dbPromise.then((db) => {
      return db.put(this.tasks, item, item.uuid);
    });
  }

  private clearTasks() {
    const dbPromise = openDB(`${this.dbName}`, this.dbVersion);
    return dbPromise.then((db) => {
      return db.clear(`${this.tasks}`);
    });
  }

  private restoreIndexedDB(tasks = `${this.tasks}`) {
    openDB(`${this.dbName}`, this.dbVersion, {
      upgrade(db) {
        db.createObjectStore(tasks).createIndex('uuid', 'uuid', {
          unique: true,
        });
      },
    });
  }
}
