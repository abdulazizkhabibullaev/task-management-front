<template>
  <div class="tasks">
    <Table
      :page-name="PageNames.TASKS"
      data-url="task/paging"
      @create="openCreateDialog"
      :query-params="filters"
      ref="tableRef"
      @edit="openEditDialog"
      @delete="handleDeleteById"
    >
      <template #header>
        <el-col :span="15">
          <el-row :gutter="20">
            <el-col :span="7">
              <filter-select
                clearable
                filterable
                remote
                remote-url="project/paging"
                @change="(val: any) => (filters.project_id = val)"
                :placeholder="$t('FORMS.PROJECT')"
              />
            </el-col>
            <el-col :span="7">
              <filter-select
                :options="priorityOptions"
                :model-value="filters.priority"
                @change="(val: any) => (filters.priority = val)"
                :placeholder="$t('FORMS.PRIORITY')"
                clearable
                filterable
                select-key="value"
              />
            </el-col>
            <el-col :span="7">
              <filter-select
                :options="statusOptions"
                :model-value="filters.status"
                @change="(val: any) => (filters.status = val)"
                :placeholder="$t('FORMS.STATUS')"
                clearable
                filterable
                select-key="value"
              />
            </el-col>
          </el-row>
        </el-col>
      </template>
    </Table>

    <FormDrawer
      :is-opened="dialogVisible"
      @closed="closeDialog"
      @submit="handleSubmit"
      :loading="isLoading"
      item="task"
      :is-editing="isEdit"
      :editable="true"
    >
      <template #form>
        <el-form
          :model="taskForm"
          ref="taskFormRef"
          label-position="top"
          :rules="taskRules"
        >
          <TextInput
            :label="$t('FORMS.TITLE')"
            prop="title"
            :model-value="taskForm.title"
            @input="(val: string) => (taskForm.title = val)"
            :disabled="isLoading"
          />

          <TextInput
            :label="$t('FORMS.DESCRIPTION')"
            prop="description"
            type="textarea"
            :rows="4"
            :model-value="taskForm.description"
            @input="(val: string) => (taskForm.description = val)"
            :disabled="isLoading"
          />

          <Select
            :model-value="taskForm.project"
            prop="project_id"
            data-url="project/paging"
            :label="$t('FORMS.PROJECT')"
            :default-option="taskForm.project"
            @change="
              (val: any) => {
                taskForm.project_id = val?._id;
                taskForm.project = val;
              }
            "
            :placeholder="$t('FORMS.SELECT_PROJECT')"
            :disabled="isLoading"
          />

          <el-form-item :label="$t('FORMS.PRIORITY')" prop="priority">
            <el-radio-group
              v-model="taskForm.priority"
              class="priority-group"
              :disabled="isLoading"
            >
              <el-radio-button value="low">
                <el-icon><ArrowDown /></el-icon>
                <span>{{ $t('COMMON.LOW') }}</span>
              </el-radio-button>
              <el-radio-button value="medium">
                <el-icon><Minus /></el-icon>
                <span>{{ $t('COMMON.MEDIUM') }}</span>
              </el-radio-button>
              <el-radio-button value="high">
                <el-icon><ArrowUp /></el-icon>
                <span>{{ $t('COMMON.HIGH') }}</span>
              </el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item :label="$t('FORMS.DUE_DATE')" prop="due_date">
            <DatePicker
              :model-value="taskForm.due_date"
              @change="(val: any) => (taskForm.due_date = val)"
              :disabled="isLoading"
            />
          </el-form-item>
        </el-form>
      </template>
    </FormDrawer>
  </div>
</template>

<script lang="ts" setup>
import { $api } from '@/common/api';
import { PageNames } from '@/common/constants/table';
import type { Project } from '@/common/types/project';
import DatePicker from '@/components/common/DatePicker.vue';
import FormDrawer from '@/components/common/FormDrawer.vue';
import Table from '@/components/common/Table.vue';
import Select from '@/components/common/form-elements/Select.vue';
import TextInput from '@/components/common/form-elements/TextInput.vue';
import { $t } from '@/plugins/i18n';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { ArrowDown, ArrowUp, Minus } from '@element-plus/icons-vue';
import { computed, reactive, ref, watch } from 'vue';

const isLoading = ref(false);
const dialogVisible = ref(false);
const isEdit = ref(false);
const editingId = ref();
const taskFormRef = ref<FormInstance>();
const tableRef = ref();

const filters = reactive({
  project_id: undefined,
  status: undefined,
  priority: undefined,
});

const taskForm = reactive({
  title: '',
  description: '',
  project_id: '',
  project: {} as Project,
  priority: 'low',
  due_date: null as Date | null,
});

const priorityOptions = [
  { name: $t('COMMON.LOW'), value: 'low' },
  { name: $t('COMMON.MEDIUM'), value: 'medium' },
  { name: $t('COMMON.HIGH'), value: 'high' },
];

const statusOptions = [
  { name: $t('COMMON.TO_DO'), value: 'to_do' },
  { name: $t('COMMON.IN_PROGRESS'), value: 'in_progress' },
  { name: $t('COMMON.COMPLETED'), value: 'completed' },
];

const taskRules = computed<FormRules>(() => ({
  title: [
    {
      required: true,
      message: $t('COMMON.REQUIRED'),
      trigger: ['blur'],
    },
  ],
  project_id: [
    {
      required: true,
      message: $t('COMMON.REQUIRED'),
      trigger: ['change'],
    },
  ],
}));

const refreshTable = () => {
  tableRef.value?.getPagingData();
};

watch(
  () => filters,
  () => {
    tableRef.value?.getPagingData(filters);
  },
  { deep: true },
);

const openCreateDialog = () => {
  isEdit.value = false;
  resetForm();
  dialogVisible.value = true;
};

const openEditDialog = async (id: string) => {
  try {
    isEdit.value = true;
    editingId.value = id;
    dialogVisible.value = true;
    const task = await $api.task.getById(id);
    taskForm.title = task.title;
    taskForm.description = task.description || '';
    taskForm.project_id = task.project_id;
    taskForm.project = task.project as Project;
    taskForm.priority = task.priority;
    taskForm.due_date = task.due_date as Date;
  } catch {}
};

const closeDialog = () => {
  dialogVisible.value = false;
  resetForm();
};

const resetForm = () => {
  editingId.value = undefined;
  taskForm.title = '';
  taskForm.description = '';
  taskForm.project_id = '';
  taskForm.project = {} as Project;
  taskForm.priority = 'low';
  taskForm.due_date = null;
  taskFormRef.value?.clearValidate();
};

const handleSubmit = async () => {
  try {
    await taskFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        isLoading.value = true;
        if (isEdit.value && editingId.value) {
          await $api.task.update({
            _id: editingId.value,
            title: taskForm.title,
            description: taskForm.description,
            project_id: taskForm.project_id!,
            priority: taskForm.priority as 'low' | 'medium' | 'high',
            due_date: taskForm.due_date || undefined,
          });
          ElMessage.success($t('MESSAGES.SUCCESS_UPDATE'));
        } else {
          await $api.task.create({
            title: taskForm.title,
            description: taskForm.description,
            project_id: taskForm.project_id!,
            priority: taskForm.priority as 'low' | 'medium' | 'high',
            due_date: taskForm.due_date || undefined,
          });
          ElMessage.success($t('MESSAGES.SUCCESS_CREATE'));
        }
        closeDialog();
        refreshTable();
      }
    });
  } catch (error: any) {
  } finally {
    isLoading.value = false;
  }
};

const handleDeleteById = async (id: any) => {
  try {
    await $api.task.delete(id);
    ElMessage.success($t('MESSAGES.SUCCESS_DELETE'));
    refreshTable();
  } catch (error: any) {}
};
</script>

<style lang="scss" scoped>
.tasks {
  padding: 24px;
}

:deep(.priority-group) {
  width: 100%;
  display: flex;
  gap: 8px;

  .el-radio-button {
    flex: 1;

    .el-radio-button__inner {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 15px;
      border-radius: 6px;
      transition: all 0.3s;

      .el-icon {
        font-size: 16px;
      }
    }

    &:first-child .el-radio-button__inner {
      border-radius: 6px;
    }

    &:last-child .el-radio-button__inner {
      border-radius: 6px;
    }
  }

  .el-radio-button:has(.el-radio-button__original-radio[value='low']:checked) {
    .el-radio-button__inner {
      background: #f0f9eb;
      border-color: #67c23a;
      color: #67c23a;
    }
  }

  .el-radio-button:has(.el-radio-button__original-radio[value='medium']:checked) {
    .el-radio-button__inner {
      background: #fdf6ec;
      border-color: #e6a23c;
      color: #e6a23c;
    }
  }

  .el-radio-button:has(.el-radio-button__original-radio[value='high']:checked) {
    .el-radio-button__inner {
      background: #fef0f0;
      border-color: #f56c6c;
      color: #f56c6c;
    }
  }
}

@media (max-width: 768px) {
  .tasks {
    padding: 16px;
  }

  :deep(.priority-group) {
    flex-direction: column;
  }
}
</style>
