export enum TableColumnType {
  STRING = 'string',
  NUMBER = 'number',
  DATE = 'date',
  ENUM = 'enum',
  CURRENCY = 'currency',
  ARRAY = 'array',
}

export interface TableColumn {
  key: string;
  translation_key: string;
  type: TableColumnType;
  date_format?: string;
  enum_values?: { [key: string]: { translation_key: string; color?: string } };
  currency_field?: string;
  children?: TableColumn[];
  extra_string?: string;
  width?: string;
  color?: string;
  array_values?: { key: string; value: string };
  array_key?: string;
}
