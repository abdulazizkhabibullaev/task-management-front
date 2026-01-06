<template>
  <div class="page">
    <div class="header">
      <el-row justify="space-between">
        <el-col :span="4" v-if="props.createButton">
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
            <el-col :span="4">
              <Button
                v-if="props.exportButton"
                style="background-color: #34d6af; border: none; height: 36px"
                full-width
                border-radius="8px"
                @click="handleExport"
              >
                <template #default>
                  <v-icon name="file"></v-icon>
                  <span style="padding-left: 5px">{{ $t('TABLE.EXCEL') }}</span>
                </template>
              </Button>
            </el-col>
            <el-col :span="5" v-if="props.searchable">
              <el-input
                v-model="search"
                :placeholder="$t('COMMANDS.SEARCH')"
                :prefix-icon="Search"
                class="search"
                @input="handleSearchChange"
                style="background-color: #fff"
              />
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
    >
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
      >
      </el-table-column>
      <el-table-column v-if="props.selection" type="selection" />
      <el-table-column
        v-for="column in columns"
        :key="column.key"
        :label="$t(`TABLE.${column.translation_key}`)"
        :prop="column.key"
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
        width="140px"
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
      <el-table-column v-if="props.manualColumn">
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
import { Delete, Edit, Search } from '@element-plus/icons-vue';
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
const dialogOpened = ref(false);
const deletingId = ref();
const nf = new NumberFormat();
const getPagingData = async (queryParams: any = {}) => {
  isLoading.value = true;
  try {
    let payload = { page: 1, limit: 50, ...mainPayload.value };
    if (props.searchable && search) payload.search = search.value;
    if (props.queryParams) payload = { ...payload, ...props.queryParams };
    if (queryParams) payload = { ...payload, ...queryParams };
    const resp = await $api.common.getPagingData(props.dataUrl, payload);

    data.value = resp.data;
    total.value = resp.total;
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
      if (cellValue) return dayjs(cellValue).format(column.date_format);
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
.page {
  .table {
    height: 75vh;
  }

  .header {
    min-height: 45px;
    border-radius: 12px 12px 0 0;

    .title {
      padding: 16px;
      font-weight: 400;
      font-size: 24px;
      line-height: 27.28px;
    }
    .header-content {
      padding-left: 10px;
    }
    .btn {
      height: 36px;
    }
    .search {
      border-radius: 10px;
      height: 36px;
    }
  }

  .pagination {
    display: flex;
    justify-content: end;
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
  --el-table-border: 1px solid #8484845d;
}
</style>
