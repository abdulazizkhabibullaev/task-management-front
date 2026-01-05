import type { Project } from '@/common/types/project';
import { Api } from '../api';

export class ProjectApi extends Api {
  create(data: Partial<Project>) {
    return this.execute<Project>('post', 'project/create', data);
  }

  getById(id: number) {
    return this.execute<Project>('get', `project/${id}`, null);
  }

  update(data: Partial<Project>) {
    return this.execute<Project>('put', `project`, data);
  }

  delete(id: number) {
    return this.execute<any>('delete', `project/${id}`, null);
  }
}
