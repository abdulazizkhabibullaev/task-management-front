import type { Project } from '@/common/types/project';
import { Api } from '../api';

export class ProjectApi extends Api {
  create(data: Partial<Project>) {
    return this.execute<Project>('post', 'project/create', data);
  }

  getById(id: string) {
    return this.execute<Project>('get', `project/get-by-id/${id}`, null);
  }

  update(data: Partial<Project>) {
    return this.execute<Project>('put', `project/update`, data);
  }

  delete(id: string) {
    return this.execute<any>('delete', `project/delete/${id}`, null);
  }
}
