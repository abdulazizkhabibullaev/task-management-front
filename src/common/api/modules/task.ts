import type { Task } from '@/common/types/task';
import { Api } from '../api';

export class TaskApi extends Api {
  create(data: Partial<Task>) {
    return this.execute<Task>('post', 'task/create', data);
  }

  getById(id: string) {
    return this.execute<Task>('get', `task/get-by-id/${id}`, null);
  }

  update(data: Partial<Task>) {
    return this.execute<Task>('put', `task/update`, data);
  }

  setStatus(data: { _id: string; status: Task['status'] }) {
    return this.execute<Task>('put', `task/set-status`, data);
  }

  delete(id: string) {
    return this.execute<any>('delete', `task/delete/${id}`, null);
  }

  getStatistics() {
    return this.execute<any>('get', 'task/statistics', null);
  }
}
