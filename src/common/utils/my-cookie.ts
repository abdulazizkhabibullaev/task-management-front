import { useMainStore } from '@/stores/main';
import { dayjs } from 'element-plus';
import { Cookies } from 'typescript-cookie';
import type { User } from '../types/user';

const KEYS = ['Authorization', 'lang', 'user'] as const;

type ConfigKeysUnion = (typeof KEYS)[number];

class MyCookie {
  private cookies = Cookies;
  private TOKEN: ConfigKeysUnion = 'Authorization';
  private LANG: ConfigKeysUnion = 'lang';
  private USER: ConfigKeysUnion = 'user';
  private domain: string | undefined;

  constructor() {
    this.domain = '';
    setTimeout(() => {
      this.domain = this.cookies?.attributes?.domain;
    }, 1);
  }

  getMainStore() {
    return useMainStore();
  }

  // set val with key to cookie
  set(key: ConfigKeysUnion, val: any, expires = 1) {
    if (typeof val == 'object') val = JSON.stringify(val);

    this.cookies.set(key, val, {
      domain: this.domain,
      expires: dayjs(new Date()).endOf('day').add(30, 'days').toDate(),
    });
  }

  // get from cookie
  get(key: ConfigKeysUnion): any {
    return this.cookies.get(key) as string;
  }

  // get JSON Object from cookie
  getJSON(key: any): any {
    if (this.cookies.get(key)) return JSON.parse(this.cookies.get(key) as any);
    return null;
  }

  // removes key from cookie. ! domain is important
  remove(key: ConfigKeysUnion) {
    if (key) {
      this.cookies.remove(key);
    }
  }

  // Get key from cookie and remove
  pop(key: ConfigKeysUnion) {
    const value = this.get(key);
    this.remove(key);
    return value;
  }

  // clear everything from cookie
  clear() {
    this.remove(this.TOKEN);
    this.remove(this.USER);
    this.getMainStore().setUser(null);
    this.getMainStore().setToken(null);
  }

  async setToken(token: string) {
    this.set(this.TOKEN, encodeURIComponent(JSON.stringify(token)));
  }

  //   auth token getter
  getToken() {
    const token = this.get(this.TOKEN);

    return token ? JSON.parse(decodeURIComponent(token)) : undefined;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token && token !== 'undefined' && token !== 'null';
  }

  setUser(user: User) {
    this.set(this.USER, user);
    this.getMainStore().setUser(user);
  }

  getUser(): User {
    return this.getJSON(this.USER);
  }

  getLang(): 'uz' | 'ru' | 'en' {
    return this.get(this.LANG);
  }

  setLang(lang: string) {
    return this.set(this.LANG, lang);
  }
}

export const myCookie = new MyCookie();

declare global {
  interface Window {
    myCookie: any;
  }
}
window.myCookie = myCookie;

export default myCookie;
