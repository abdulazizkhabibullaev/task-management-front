import type { Task } from '@/common/types/task';
import { Api } from '../api';

export class TaskApi extends Api {
  create(data: Partial<Task>) {
    return this.execute<Task>('post', 'task/create', data);
  }

  getById(id: number) {
    return this.execute<Task>('get', `task/${id}`, null);
  }

  update(data: Partial<Task>) {
    return this.execute<Task>('put', `task`, data);
  }

  setStatus(data: {_id: string, status: Task['status']}) {
    return this.execute<Task>('put', `task`, data);
  }

  delete(id: number) {
    return this.execute<any>('delete', `task/${id}`, null);
  }

  getStatistics() {
    return this.execute<any>('get', 'task/statistics', null);
  }
}
