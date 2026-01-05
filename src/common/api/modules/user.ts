import type { User } from '@/common/types/user';
import { Api } from '../api';

export class UserApi extends Api {
  login(data: any) {
    return this.execute<any>('post', 'user/login', data);
  }

  register(data: any) {
    return this.execute<User & { token: string }>('post', 'user/register', data);
  }

  getProfile() {
    return this.execute<User>('get', 'user/profile', null, null, null);
  }
}
