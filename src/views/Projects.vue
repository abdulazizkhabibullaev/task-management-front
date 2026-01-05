<template>
  <div class="projects">
    <!-- <div class="projects-header">
      <div>
        <h1>{{ $t('project.title') }}</h1>
        <p class="projects-subtitle">{{ $t('project.subtitle') }}</p>
      </div>
    </div> -->

    <Table
      :page-name="PageNames.PROJECTS"
      data-url="project/paging"
      @create="openCreateDialog"
      :query-params="filters"
      ref="tableRef"
      @edit="openEditDialog"
      @delete="handleDeleteById"
    />

    <FormDrawer
      :is-opened="dialogVisible"
      :title="isEdit ? $t('project.editProject') : $t('project.createProject')"
      @closed="closeDialog"
      @submit="handleSubmit"
      :loading="submitLoading"
      item="project"
      :is-editing="isEdit"
      :custom-title="true"
      :editable="true"
    >
      <template #form>
        <el-form
          :model="projectForm"
          ref="projectFormRef"
          label-position="top"
          :rules="projectRules"
        >
          <TextInput
            :label="$t('project.name')"
            prop="name"
            :model-value="projectForm.name"
            @input="(val: string) => (projectForm.name = val)"
            :placeholder="$t('project.namePlaceholder')"
          />
        </el-form>
      </template>
    </FormDrawer>
  </div>
</template>

<script lang="ts" setup>
import { $api } from '@/common/api';
import { PageNames } from '@/common/constants/table';
import Card from '@/components/common/Card.vue';
import FormDrawer from '@/components/common/FormDrawer.vue';
import Table from '@/components/common/Table.vue';
import TextInput from '@/components/common/form-elements/TextInput.vue';
import { $t } from '@/plugins/i18n';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { computed, reactive, ref } from 'vue';

const submitLoading = ref(false);
const dialogVisible = ref(false);
const isEdit = ref(false);
const editingId = ref();
const projectFormRef = ref<FormInstance>();
const tableRef = ref();

const filters = reactive({
  search: '',
});

const projectForm = reactive({
  name: '',
});

const projectRules = computed<FormRules>(() => ({
  name: [
    {
      required: true,
      message: $t('project.nameRequired'),
      trigger: ['blur'],
    },
  ],
}));

const refreshTable = () => {
  tableRef.value?.getPagingData();
};

const openCreateDialog = () => {
  isEdit.value = false;
  resetForm();
  dialogVisible.value = true;
};

const openEditDialog = (project: any) => {
  isEdit.value = true;
  editingId.value = project._id;
  projectForm.name = project.name;
  dialogVisible.value = true;
};

const closeDialog = () => {
  dialogVisible.value = false;
  resetForm();
};

const resetForm = () => {
  editingId.value = undefined;
  projectForm.name = '';
  projectFormRef.value?.clearValidate();
};

const handleSubmit = async () => {
  try {
    await projectFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        submitLoading.value = true;
        if (isEdit.value && editingId.value) {
          await $api.project.update({
            _id: editingId.value,
            name: projectForm.name,
          });
          ElMessage.success($t('project.updateSuccess'));
        } else {
          await $api.project.create({
            name: projectForm.name,
          });
          ElMessage.success($t('project.createSuccess'));
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
    await $api.project.delete(id);
    ElMessage.success($t('project.deleteSuccess'));
    refreshTable();
  } catch (error: any) {}
};
</script>

<style lang="scss" scoped>
.projects {
  padding: 24px;
}

@media (max-width: 768px) {
  .projects {
    padding: 16px;
  }
}
</style>
