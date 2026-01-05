import { isObject } from 'class-validator';
import { dayjs } from 'element-plus';
import type { Ref } from 'vue';

export class Utils {
  dateFormat(day?: Date | string) {
    if (!day) return '';
    return dayjs(day).format('DD.MM.YYYY');
  }

  timeFormat(day?: Date | string) {
    if (!day) return '';
    return dayjs(day).format('DD.MM.YYYY HH:mm');
  }

  getImageUrl(url?: string) {
    if (!url) return '';
    return import.meta.env.VITE_BASE_URL + '/' + url;
  }

  getUploadUrl() {
    return import.meta.env.VITE_BASE_URL + '/upload';
  }

  setFormValue(form: any, data: any) {
    for (const key of Object.keys(form)) {
      if (data[key]) form[key] = data[key];
    }
  }

  cleanPayload(payload: any) {
    const parsed: Record<string, any> = {};
    Object.keys(payload).forEach(key => {
      if (payload[key] !== undefined && payload[key] !== null && payload[key] !== '') {
        parsed[key] = payload[key];
      }
      if (Array.isArray(payload[key])) {
        payload[key].forEach((el: any) => this.cleanPayload(el));
      }
    });
    return parsed;
  }

  resetForm(payload: any) {
    Object.keys(payload).forEach(key => {
      if (typeof payload[key] === 'string') payload[key] = '';
      else if (isObject(payload[key])) payload[key] = {};
      else if (Array.isArray(payload[key])) payload[key] = [];
      else if (typeof payload[key] === 'boolean') payload[key] = false;
      else if (typeof payload[key] === 'number') payload[key] = undefined;
    });
    return payload;
  }

  debounce(func: Function, wait: number = 300) {
    let timeout: any;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  getObjectValue(obj: Object, propertyPath: string) {
    return propertyPath.split('.').reduce((nestedObject: any, key: string) => {
      if (nestedObject && typeof nestedObject === 'object') {
        return nestedObject[key];
      }
      return undefined;
    }, obj);
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async validateForm(formRefs: Ref<any>[]) {
    let isFormValid = true;
    for (let form of formRefs) {
      const isValid = await form.value.isFormValid();
      if (!isValid) isFormValid = false;
    }
    return isFormValid;
  }
}

export const utils = new Utils();
