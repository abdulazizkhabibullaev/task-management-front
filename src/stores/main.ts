import type { User } from '@/common/types/user';
import myCookie from '@/common/utils/my-cookie';
import { defineStore } from 'pinia';
import { $api } from '../common/api';

export const useMainStore = defineStore('mainStore', {
  state: () =>
    ({
      token: '',
      user: undefined,
    }) as { token: string | undefined; user: User | undefined },

  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user,
  },

  actions: {
    async setToken(token?: string | null) {
      if (!token) {
        this.token = undefined;
        myCookie.clear();
      } else {
        this.token = token;
        myCookie.setToken(token);
      }
    },

    async setUser(user: User | null) {
      this.user = user || undefined;
    },

    async login(login_data: any) {
      const response = await $api.user.login({
        phone_number: login_data.login,
        password: login_data.password,
      });
      await this.setToken(response.token);
      await this.setUser(response.user || response);
      return response;
    },

    async register(register_data: any) {
      const response = await $api.user.register(register_data);
      return response;
    },

    async getMe() {
      const user = await $api.user.getProfile();
      await this.setUser(user);
    },

    async logout() {
      await this.setToken(null);
      await this.setUser(null);
    },
  },
  persist: true,
});
