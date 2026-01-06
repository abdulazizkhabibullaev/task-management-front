<template>
  <div class="projects">
    <Table
      :page-name="PageNames.PROJECTS"
      data-url="project/paging"
      @create="openCreateDialog"
      ref="tableRef"
      @edit="openEditDialog"
      @delete="handleDeleteById"
    />

    <FormDrawer
      :is-opened="dialogVisible"
      @closed="closeDialog"
      @submit="handleSubmit"
      :loading="isLoading"
      item="project"
      :is-editing="isEdit"
      :editable="true"
    >
      <template #form>
        <el-form
          :model="projectForm"
          ref="projectFormRef"
          label-position="top"
          :rules="projectRules"
          @submit.prevent="handleSubmit"
        >
          <TextInput
            :label="$t('FORMS.NAME')"
            prop="name"
            :model-value="projectForm.name"
            @input="(val: string) => (projectForm.name = val)"
            :disabled="isLoading"
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

const isLoading = ref(false);
const dialogVisible = ref(false);
const isEdit = ref(false);
const editingId = ref();
const projectFormRef = ref<FormInstance>();
const tableRef = ref();

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

const openEditDialog = async (id: string) => {
  try {
    isEdit.value = true;
    editingId.value = id;
    dialogVisible.value = true;
    const item = await $api.project.getById(id);
    projectForm.name = item.name;
  } catch (e) {}
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
        isLoading.value = true;
        if (isEdit.value && editingId.value) {
          await $api.project.update({
            _id: editingId.value,
            name: projectForm.name,
          });
          ElMessage.success($t('MESSAGES.SUCCESS_UPDATE'));
        } else {
          await $api.project.create({
            name: projectForm.name,
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
    await $api.project.delete(id);
    ElMessage.success($t('MESSAGES.SUCCESS_DELETE'));
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
