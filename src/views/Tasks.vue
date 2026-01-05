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
    />

    <FormDrawer
      :is-opened="dialogVisible"
      :title="isEdit ? $t('task.editTask') : $t('task.createTask')"
      @closed="closeDialog"
      @submit="handleSubmit"
      :loading="submitLoading"
      item="task"
      :is-editing="isEdit"
      :custom-title="true"
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
            :label="$t('task.title')"
            prop="title"
            :model-value="taskForm.title"
            @input="(val: string) => (taskForm.title = val)"
            :placeholder="$t('task.titlePlaceholder')"
          />

          <TextInput
            :label="$t('task.description')"
            prop="description"
            type="textarea"
            :rows="4"
            :model-value="taskForm.description"
            @input="(val: string) => (taskForm.description = val)"
            :placeholder="$t('task.descriptionPlaceholder')"
          />

          <Select
            :label="$t('task.project')"
            prop="project_id"
            :model-value="taskForm.project_id"
            @change="(val: any) => (taskForm.project_id = val)"
            :options="projectOptions"
            :placeholder="$t('task.selectProject')"
          />

          <Select
            :label="$t('task.status.label')"
            prop="status"
            :model-value="taskForm.status"
            @change="(val: any) => (taskForm.status = val)"
            :options="statusOptions"
            :placeholder="$t('task.selectStatus')"
          />

          <Select
            :label="$t('task.priority.label')"
            prop="priority"
            :model-value="taskForm.priority"
            @change="(val: any) => (taskForm.priority = val)"
            :options="priorityOptions"
            :placeholder="$t('task.selectPriority')"
          />

          <DatePicker
            :label="$t('task.dueDate')"
            prop="due_date"
            :model-value="taskForm.due_date"
            @change="(val: any) => (taskForm.due_date = val)"
            :placeholder="$t('task.selectDueDate')"
          />
        </el-form>
      </template>
    </FormDrawer>
  </div>
</template>

<script lang="ts" setup>
import { $api } from '@/common/api';
import { PageNames } from '@/common/constants/table';
import FormDrawer from '@/components/common/FormDrawer.vue';
import Table from '@/components/common/Table.vue';
import Select from '@/components/common/form-elements/Select.vue';
import TextInput from '@/components/common/form-elements/TextInput.vue';
import DatePicker from '@/components/common/DatePicker.vue';
import { $t } from '@/plugins/i18n';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';

const submitLoading = ref(false);
const dialogVisible = ref(false);
const isEdit = ref(false);
const editingId = ref();
const taskFormRef = ref<FormInstance>();
const tableRef = ref();
const projects = ref<any[]>([]);

const filters = reactive({
  search: '',
  project_id: null as string | null,
  status: null as string | null,
  priority: null as string | null,
});

const taskForm = reactive({
  title: '',
  description: '',
  project_id: null as string | null,
  status: 'to_do',
  priority: 'medium',
  due_date: null as Date | null,
});

const statusOptions = computed(() => [
  { label: $t('task.status.to_do'), value: 'to_do' },
  { label: $t('task.status.in_progress'), value: 'in_progress' },
  { label: $t('task.status.completed'), value: 'completed' },
]);

const priorityOptions = computed(() => [
  { label: $t('task.priority.low'), value: 'low' },
  { label: $t('task.priority.medium'), value: 'medium' },
  { label: $t('task.priority.high'), value: 'high' },
]);

const projectOptions = computed(() =>
  projects.value.map(p => ({ label: p.name, value: p._id })),
);

const taskRules = computed<FormRules>(() => ({
  title: [
    {
      required: true,
      message: $t('task.titleRequired'),
      trigger: ['blur'],
    },
  ],
  project_id: [
    {
      required: true,
      message: $t('task.projectRequired'),
      trigger: ['change'],
    },
  ],
}));

const refreshTable = () => {
  tableRef.value?.getPagingData();
};

const fetchProjects = async () => {
  try {
    const response = await $api.common.getPagingData('project/paging', {
      page: 1,
      limit: 100,
    });
    projects.value = response.data || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
  }
};

const openCreateDialog = () => {
  isEdit.value = false;
  resetForm();
  dialogVisible.value = true;
};

const openEditDialog = (task: any) => {
  isEdit.value = true;
  editingId.value = task._id;
  taskForm.title = task.title;
  taskForm.description = task.description || '';
  taskForm.project_id = task.project_id;
  taskForm.status = task.status;
  taskForm.priority = task.priority;
  taskForm.due_date = task.due_date;
  dialogVisible.value = true;
};

const closeDialog = () => {
  dialogVisible.value = false;
  resetForm();
};

const resetForm = () => {
  editingId.value = undefined;
  taskForm.title = '';
  taskForm.description = '';
  taskForm.project_id = null;
  taskForm.status = 'to_do';
  taskForm.priority = 'medium';
  taskForm.due_date = null;
  taskFormRef.value?.clearValidate();
};

const handleSubmit = async () => {
  try {
    await taskFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        submitLoading.value = true;
        if (isEdit.value && editingId.value) {
          await $api.task.update({
            _id: editingId.value,
            title: taskForm.title,
            description: taskForm.description,
            project_id: taskForm.project_id!,
            status: taskForm.status as 'to_do' | 'in_progress' | 'completed',
            priority: taskForm.priority as 'low' | 'medium' | 'high',
            due_date: taskForm.due_date || undefined,
          });
          ElMessage.success($t('task.updateSuccess'));
        } else {
          await $api.task.create({
            title: taskForm.title,
            description: taskForm.description,
            project_id: taskForm.project_id!,
            status: taskForm.status as 'to_do' | 'in_progress' | 'completed',
            priority: taskForm.priority as 'low' | 'medium' | 'high',
            due_date: taskForm.due_date || undefined,
          });
          ElMessage.success($t('task.createSuccess'));
        }
        closeDialog();
        refreshTable();
      }
    });
  } catch (error: any) {
  } finally {
    submitLoading.value = false;
  }
};

const handleDeleteById = async (id: any) => {
  try {
    await $api.task.delete(id);
    ElMessage.success($t('task.deleteSuccess'));
    refreshTable();
  } catch (error: any) {}
};

onMounted(() => {
  fetchProjects();
});
</script>

<style lang="scss" scoped>
.tasks {
  padding: 24px;
}

@media (max-width: 768px) {
  .tasks {
    padding: 16px;
  }
}
</style>
