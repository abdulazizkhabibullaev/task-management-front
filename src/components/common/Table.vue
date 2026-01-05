<template>
  <div class="page">
    <!-- Filter Panel Slot -->
    <slot name="filter"></slot>

    <div class="header" v-if="props.createButton || props.exportButton">
      <el-row justify="space-between" align="middle">
        <el-col :span="props.createButton ? 4 : 0" v-if="props.createButton">
          <Button
            @click="() => $emit('create')"
            :name="$t('COMMANDS.CREATE')"
            class="btn"
            full-width
            border-radius="6px"
          />
        </el-col>
        <el-col :span="props.createButton ? 20 : 24">
          <el-row :gutter="20" justify="end" class="header-content">
            <slot name="header"></slot>
            <el-col :span="3" v-if="props.exportButton">
              <Button
                style="background-color: #34d6af; border: none; height: 36px"
                full-width
                border-radius="8px"
                @click="handleExport"
                :disabled="isLoading"
                :loading="isDownloading"
              >
                <template #default>
                  <v-icon name="file"></v-icon>
                  <span style="padding-left: 5px">{{ $t('COMMON.EXCEL') }}</span>
                </template>
              </Button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <el-table
      :data="data"
      class="table"
      v-loading="isLoading"
      @row-click="onRowClick"
      :empty-text="$t('TABLE.NOTHING_FOUND')"
      :row-class-name="props.rowClassName"
      :header-row-class-name="props.headerClassName"
      ref="tableRef"
      border
      @select-all="(data: any) => $emit('select-all', data)"
      stripe
    >
      <el-table-column v-if="props.selection" type="selection" />
      <el-table-column
        v-if="props.indexing"
        type="index"
        :index="indexMethod"
        :width="
          Number(mainPayload.page) * Number(mainPayload.limit) < 100
            ? '50px'
            : Number(mainPayload.page) * Number(mainPayload.limit) < 1000
              ? '59px'
              : '75px'
        "
        :label="$t('TABLE.NUMBER')"
      >
      </el-table-column>
      <el-table-column
        v-for="column in columns"
        :key="column.key"
        :label="$t(`TABLE.${column.translation_key}`)"
        :prop="column.key"
        :min-width="column.width || 140"
      >
        <template v-slot="scope">
          <div
            :style="getColumnStyle(column, utils.getObjectValue(scope.row, column.key))"
          >
            {{
              getFormattedCell(
                column,
                utils.getObjectValue(scope.row, column.key),
                scope.row,
              )
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="right"
        v-if="props.deletable || props.editable"
        width="120px"
        :label="$t('TABLE.ACTIONS')"
      >
        <template #default="scope">
          <el-button
            v-if="props.deletable"
            type="danger"
            :icon="Delete"
            size="small"
            circle
            @click.stop="
              () => {
                dialogOpened = true;
                deletingId = scope.row._id;
              }
            "
          />
          <el-button
            v-if="props.editable"
            type="primary"
            :icon="Edit"
            size="small"
            circle
            @click.stop="onEdit(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column v-if="props.manualColumn" :label="props.manualColumnLabel">
        <template #default="scope">
          <slot name="extra" :data="scope"></slot>
        </template>
      </el-table-column>
    </el-table>
    <delete-dialog
      :visible="dialogOpened"
      :disabled="isLoading"
      @cancel="handleDialogClose"
      @confirm="
        () => {
          $emit('delete', deletingId);
          handleDialogClose();
        }
      "
    />
    <div class="pagination">
      <pagination
        :total="total"
        @limit-change="handleLimitChange"
        @page-change="handlePageChange"
        :page="Number(mainPayload.page)"
        :limit="Number(mainPayload.limit)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { $api } from '@/common/api';
import { getTableColumns, PageNames } from '@/common/constants/table';
import { TableColumnType, type TableColumn } from '@/common/types/columns';
import { utils } from '@/common/utils/common';
import myLocalStorage from '@/common/utils/local-storage';
import myCookie from '@/common/utils/my-cookie';
import { NumberFormat } from '@/common/utils/number-format';
import { $t } from '@/plugins/i18n';
import router from '@/router';
import { Delete, Edit } from '@element-plus/icons-vue';
import { dayjs, ElTableColumn } from 'element-plus';
import { computed, onBeforeMount, ref } from 'vue';
import Button from './Button.vue';
import Pagination from './Pagination.vue';

const props = defineProps({
  pageName: { required: true, type: String },
  dataUrl: { required: true, type: String },
  searchable: { type: Boolean, default: true },
  createButton: { type: Boolean, default: true },
  editable: { type: Boolean, default: true },
  deletable: { type: Boolean, default: true },
  indexing: { type: Boolean, default: true },
  queryParams: {
    type: Object,
    default: {},
  },
  manualColumn: {
    type: Boolean,
    default: false,
  },
  manualColumnLabel: {
    type: String,
  },
  title: {
    type: String,
  },
  rowClassName: {
    type: String,
    default: 'visible-row',
  },
  headerClassName: {
    type: String,
    default: 'visible-row',
  },
  selection: {
    default: false,
    type: Boolean,
  },
  exportButton: {
    type: Boolean,
    default: false,
  },
  exportUrl: {
    type: String,
  },
  exportPayload: {
    default: {},
  },
  pagingMethod: {
    type: String,
    default: 'post',
  },
});

const data = ref<any[]>([]);
const columns = ref<TableColumn[]>([]);
const total = ref(0);
const search = ref((router.currentRoute.value.query.search as string) || '');
const tableRef = ref();
const mainPayload = computed<{ page?: number; limit?: number; search: string }>(
  () => router.currentRoute.value.query as any,
);
const isLoading = ref(false);
const isDownloading = ref(false);
const dialogOpened = ref(false);
const deletingId = ref();
const nf = new NumberFormat();
const currentRoute = router.currentRoute.value.name as string;
const getPagingData = async (queryParams: any = {}) => {
  isLoading.value = true;
  try {
    let payload = {
      ...mainPayload.value,
      page: Number(mainPayload.value.page || 1),
      limit: Number(mainPayload.value.limit || 50),
    };
    if (props.searchable && search) payload.search = search.value;
    if (props.queryParams) payload = { ...payload, ...props.queryParams };
    if (queryParams) payload = { ...payload, ...queryParams };
    const resp = await $api.common.getPagingData(
      props.dataUrl,
      payload,
      props.pagingMethod,
    );

    data.value = resp.data;
    total.value = resp.total;
    $emit('data', resp.data);
  } catch (e) {
    console.log(e);
  } finally {
    isLoading.value = false;
  }
};

const indexMethod = (index: number) =>
  (Number(mainPayload.value.page) - 1) * Number(mainPayload.value.limit) + index + 1;

const handleSearchChange = utils.debounce(async (value: string) => {
  search.value = value;
  await router.replace({
    query: { ...router.currentRoute.value.query, search: value || undefined },
  });
  await getPagingData();
});

const handlePageChange = async (page: number) => {
  await router.replace({ query: { ...router.currentRoute.value.query, page: page } });
  await getPagingData();
};

const handleLimitChange = async (limit: number) => {
  await router.replace({ query: { ...router.currentRoute.value.query, limit: limit } });
  await getPagingData();
};
const getFormattedCell = (column: TableColumn, cellValue: any, row?: any) => {
  switch (column.type) {
    case TableColumnType.NUMBER:
      return nf.toReadable(cellValue);

    case TableColumnType.STRING:
      return cellValue;

    case TableColumnType.DATE:
      if (cellValue)
        return dayjs(cellValue).format(column.date_format || 'YYYY-MM-DD HH:mm');
      return '';

    case TableColumnType.ENUM:
      return $t(`COMMON.${column.enum_values?.[cellValue]?.translation_key}`);

    case TableColumnType.ARRAY:
      let result = '';
      if (column.array_values) {
        for (let item of cellValue || []) {
          result +=
            utils.getObjectValue(item, column.array_values.key) +
            ': ' +
            utils.getObjectValue(item, column.array_values.value) +
            ',\n';
        }
      } else if (column.array_key) {
        return cellValue
          .map((item: any) => utils.getObjectValue(item, column.array_key as string))
          .join(', ');
      }
      return result.slice(0, -2);

    default:
      return cellValue;
  }
};

const getColumnStyle = (column: TableColumn, cellValue: any) => {
  const style: Record<string, any> = {};
  if (column.type === TableColumnType.ENUM) {
    const value = column.enum_values?.[cellValue];
    if (value && value.color) style.color = value.color;
  } else if (column.color) style.color = column.color;
  return style;
};

const $emit = defineEmits<{
  (e: 'create'): void;
  (e: 'edit', id: string): void;
  (e: 'delete', id: string): void;
  (e: 'row-click', id: string): void;
  (e: 'row-info', data: any): void;
  (e: 'select-all', data: any): void;
  (e: 'data', data: any): void;
}>();

const onEdit = (row: any) => {
  $emit('edit', row._id);
};

const handleDialogClose = () => {
  deletingId.value = undefined;
  dialogOpened.value = false;
};
const onRowClick = (row: any, column: any, event: Event) => {
  $emit('row-click', row._id);
  $emit('row-info', row);
};

const handleExport = async () => {
  try {
    isLoading.value = true;
    isDownloading.value = true;
    if (props.exportButton && props.exportUrl) {
      const url = await $api.common.execute<string>('post', props.exportUrl, {
        ...router.currentRoute.value.query,
        ...props.exportPayload,
      });
      const a = document.createElement('a');
      a.href = utils.getImageUrl(url);
      document.body.appendChild(a);

      // Trigger the download
      a.click();

      // Remove the anchor element after the download
      document.body.removeChild(a);
    }
  } catch (e) {
  } finally {
    isLoading.value = false;
    isDownloading.value = false;
  }
};

onBeforeMount(async () => {
  const route = router.currentRoute.value.query;
  if (!route.page) {
    await router.replace({ query: { ...router.currentRoute.value.query, page: 1 } });
  }

  if (!route.limit) {
    await router.replace({
      query: {
        ...router.currentRoute.value.query,
        limit: 50,
      },
    });
  }

  columns.value = getTableColumns(
    props.pageName as PageNames,
    myCookie.getLang() || myLocalStorage.getLang(),
  );
  await getPagingData();
});

const appendData = (newData: any) => {
  data.value.unshift(newData);
};

const getSelectionRows = () => tableRef.value.getSelectionRows();
const clearSelection = () => tableRef.value.clearSelection();

defineExpose({
  appendData,
  getPagingData,
  getSelectionRows,
  clearSelection,
});
</script>

<style scoped lang="scss">
@use '@/assets/scss/breakpoints' as *;
@use '@/assets/scss/variables' as *;

.page {
  .table {
    height: 70vh;

    @include mobile {
      height: auto;
      min-height: 50vh;
      max-height: 65vh;
    }

    @include tablet {
      height: 65vh;
    }
  }

  .header {
    min-height: 45px;
    border-radius: 12px 12px 0 0;
    margin-bottom: $spacing-sm;

    .title {
      padding: $spacing-md;
      font-weight: 400;
      font-size: 24px;
      line-height: 27.28px;

      @include mobile {
        font-size: 18px;
        padding: $spacing-sm;
      }
    }

    .header-content {
      padding-left: 10px;

      @include mobile {
        padding-left: 0;
        flex-wrap: wrap;
        gap: $spacing-sm;
      }
    }

    .btn {
      height: 36px;

      @include mobile {
        height: 32px;
        font-size: 12px;
      }
    }

    .search {
      border-radius: 10px;
      height: 36px;

      @include mobile {
        height: 32px;
      }
    }

    // Responsive grid for header on mobile
    @include mobile {
      :deep(.el-row) {
        flex-direction: column;
        gap: $spacing-sm;
      }

      :deep(.el-col) {
        max-width: 100% !important;
        flex: 0 0 100% !important;
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: end;
    margin-top: $spacing-md;

    @include mobile {
      justify-content: center;
      margin-top: $spacing-sm;
    }
  }
}

// Responsive table wrapper
:deep(.el-table) {
  @include mobile {
    font-size: 12px;

    .el-table__header th {
      padding: 8px 4px;
      font-size: 11px;
    }

    .el-table__body td {
      padding: 8px 4px;
    }

    .el-table__cell {
      padding: 6px 4px;
    }
  }
}
</style>

<style>
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
.el-table .production-row {
  --el-table-tr-bg-color: var(--el-color-expand);
}
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning);
}
.el-table .visible-row {
  --el-table-border: 1px solid #84848435;
}
</style>
