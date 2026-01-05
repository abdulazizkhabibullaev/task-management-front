import { createI18n } from 'vue-i18n';
import uz from '../locales/uz.json';
import ru from '../locales/ru.json';
import en from '../locales/en.json';
import myLocalStorage from '@/common/utils/local-storage';

export type MessageSchema = typeof uz | typeof ru | typeof en;

// define the number format schema
export type NumberSchema = {
  currency: {
    style: 'currency';
    currencyDisplay: 'symbol';
    currency: string;
  };
};

export const i18n = createI18n<[MessageSchema], 'uz' | 'ru' | 'en'>({
  legacy: false,
  locale: myLocalStorage.getLang(),
  fallbackLocale: 'uz',
  messages: {
    uz,
    ru,
    en,
  },
});

export const $t = i18n.global.t;
