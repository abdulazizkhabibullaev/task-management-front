import { Api } from './api';
import { ProjectApi } from './modules/project';
import { TaskApi } from './modules/task';
import { UserApi } from './modules/user';

export const $api = {
  common: new Api(),
  user: new UserApi(),
  project: new ProjectApi(),
  task: new TaskApi(),
};
