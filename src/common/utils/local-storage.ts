export class LocalStorage {
  set(key: string, value: any) {
    window.localStorage.setItem(key, value);
  }

  get(key: string) {
    return window.localStorage.getItem(key);
  }

  getToken() {
    return window.localStorage.getItem('Authorization');
  }

  setLang(lang: string) {
    this.set('lang', lang);
  }

  getLang() {
    return this.get('lang') ?? 'uz';
  }
}

const myLocalStorage = new LocalStorage();

export default myLocalStorage;
