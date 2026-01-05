<template>
  <el-drawer
    :model-value="props.isOpened"
    @closed="$emit('closed')"
    class="drawer"
    :size="drawerSize"
    destroy-on-close
  >
    <template #header>
      <span class="title">
        {{
          props.customTitle
            ? props.item
            : props.isEditing
              ? $t('FORMS.TITLES.UPDATE', {
                  item: $t(`COMMON.${props.item.toUpperCase()}`),
                })
              : $t('FORMS.TITLES.CREATE', {
                  item: $t(`COMMON.${props.item.toUpperCase()}`).toLowerCase(),
                })
        }}
      </span>
    </template>
    <template #default>
      <slot name="form" class="content"></slot>
    </template>
    <template #footer>
      <Button
        v-if="props.deletable && props.isEditing"
        :name="$t('COMMANDS.DELETE')"
        @click="() => (dialogOpened = true)"
        :type="ButtonType.DANGER"
        class="btn"
        :w="props.deletable && props.isEditing ? '47%' : '100%'"
        margin="0"
        :disabled="props.disabled"
      ></Button>
      <Button
        v-if="props.editable"
        :name="$t('COMMANDS.SAVE')"
        @click="onClick"
        class="btn"
        :w="props.deletable && props.isEditing ? '47%' : '100%'"
        :disabled="props.disabled"
      ></Button>
      <slot name="footer"></slot>
    </template>
  </el-drawer>
  <delete-dialog
    v-if="!props.customDialog"
    :visible="dialogOpened && props.isOpened"
    :disabled="disabled"
    @cancel="() => (dialogOpened = false)"
    @confirm="() => $emit('delete')"
  />
  <slot name="custom-dialog"></slot>
</template>

<script lang="ts" setup>
import { ButtonType } from '@/common/types/common';
import { useResponsive } from '@/composables/useResponsive';
import { computed, ref } from 'vue';
import Button from './Button.vue';

const props = defineProps({
  isOpened: { default: false, type: Boolean },
  item: { required: true, type: String },
  isEditing: { default: false, type: Boolean },
  deletable: { default: true, type: Boolean },
  editable: { default: true, type: Boolean },
  size: { default: '27%', type: String },
  disabled: { type: Boolean, default: false },
  customTitle: { type: Boolean, default: false },
  customDialog: { type: Boolean, default: false },
});

const dialogOpened = ref(false);
const { isMobile, isTablet } = useResponsive();

// Responsive drawer size
const drawerSize = computed(() => {
  if (isMobile.value) return '100%';
  if (isTablet.value) return '50%';
  return props.size;
});

const $emit = defineEmits<{
  (e: 'closed'): void;
  (e: 'submit'): void;
  (e: 'delete'): void;
}>();

const onClick = () => {
  $emit('submit');
};
</script>

<style scoped lang="scss">
@use '@/assets/scss/breakpoints' as *;
@use '@/assets/scss/variables' as *;

.drawer {
  .title {
    color: black;
    font-size: 18px;

    @include mobile {
      font-size: 16px;
    }
  }

  .btn {
    @include mobile {
      width: 100% !important;
      margin-bottom: $spacing-sm;
    }
  }
}
</style>
<style>
.el-drawer .el-drawer__header {
  margin-bottom: 0 !important;
  padding: 20px;
}

@media screen and (max-width: 768px) {
  .el-drawer {
    width: 100% !important;
  }

  .el-drawer .el-drawer__header {
    padding: 16px;
  }

  .el-drawer .el-drawer__body {
    padding: 16px;
  }

  .el-drawer .el-drawer__footer {
    padding: 16px;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
