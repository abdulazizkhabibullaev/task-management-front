import { TableColumnType, type TableColumn } from '../types/columns';

export enum PageNames {
  PROJECTS = 'projects',
  TASKS = 'tasks',
}

export const getTableColumns = (page_name: PageNames, lang = 'uz') => {
  let columns: TableColumn[] = [];

  switch (page_name) {
    case PageNames.PROJECTS:
      columns = [
        {
          key: 'name',
          type: TableColumnType.STRING,
          translation_key: 'NAME',
        },
        {
          key: 'task_count',
          type: TableColumnType.NUMBER,
          translation_key: 'TASK_COUNT',
        },
      ];
      break;

    case PageNames.TASKS:
      columns = [
        {
          key: 'title',
          type: TableColumnType.STRING,
          translation_key: 'TITLE',
        },
        {
          key: 'created_at',
          type: TableColumnType.DATE,
          translation_key: 'CREATED_AT',
          date_format: 'DD.MM.YYYY HH:mm',
        },
        {
          key: 'priority',
          type: TableColumnType.ENUM,
          translation_key: 'PRIORITY',
          enum_values: {
            low: { translation_key: 'LOW', color: '#67C23A' },
            medium: { translation_key: 'MEDIUM', color: '#E6A23C' },
            high: { translation_key: 'HIGH', color: '#F56C6C' },
          },
        },
        {
          key: 'due_date',
          type: TableColumnType.DATE,
          translation_key: 'DUE_DATE',
          date_format: 'DD.MM.YYYY',
        },
        {
          key: 'status',
          type: TableColumnType.ENUM,
          translation_key: 'STATUS',
          enum_values: {
            to_do: { translation_key: 'TO_DO', color: '#909399' },
            in_progress: {
              translation_key: 'IN_PROGRESS',
              color: '#E6A23C',
            },
            completed: { translation_key: 'COMPLETED', color: '#67C23A' },
          },
        },
      ];
      break;
  }

  return columns;
};
