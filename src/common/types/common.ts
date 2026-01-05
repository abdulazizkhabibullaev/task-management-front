export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  status_code: number;
  messages: {
    uz: string;
    ru: string;
    en: string;
  };
  time: string;
}

export interface PagingResponse<T> {
  total: number;
  data: T[];
  total_amounts?: any;
}

export interface RequestPayload {
  page: number;
  limit: number;
  search?: string;
  organization_id?: string;
}

export interface NumberFormatOptions {
  prefix?: string;
  suffix?: string;
  separator?: string;
  decimal?: string;
  precision?: number;
  minimumFractionDigits?: number;
  prefill?: boolean;
  reverseFill?: boolean;
  min?: number;
  max?: number;
  nullValue?: string;
  masked?: boolean;
  autoCorrect?: boolean;
  maxValueInclusive?: boolean;
  minValueInclusive?: boolean;
}

export enum ButtonType {
  PRIMARY = 'primary',
  DEFAULT = 'default',
  DANGER = 'danger',
  WARNING = 'warning',
}

export enum InputType {
  QUANTITY = 'quantity',
  CURRENCY = 'currency',
  PERCENT = 'percent',
}

export interface NumberInputType {
  masked: string;
  value: number;
}
