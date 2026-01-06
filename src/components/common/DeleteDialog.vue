<template>
  <el-dialog
    :model-value="props.visible"
    center
    @closed="() => $emit('cancel')"
    class="delete-dialog"
  >
    <div class="content">
      <v-icon name="trash" class="icon"></v-icon>
      <span class="text">{{ props.text }}</span>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <Button
          :name="$t('COMMANDS.CANCEL')"
          :type="ButtonType.DEFAULT"
          @click="() => $emit('cancel')"
          border-radius="12px"
          w="140px"
          class="default-button"
          :disabled="props.disabled"
        ></Button>
        <Button
          :name="$t('COMMANDS.CONFIRM')"
          @click="() => $emit('confirm')"
          border-radius="12px"
          w="140px"
          :disabled="props.disabled"
        ></Button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ButtonType } from '@/common/types/common';
import Button from '@/components/common/Button.vue';
import { $t } from '@/plugins/i18n';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  text: {
    type: String,
    default: $t('COMMON.DELETE_CONFIRM'),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
const $emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'confirm'): void;
}>();
</script>
<style lang="scss" scoped>
.delete-dialog {
  .dialog-footer {
    .default-button:hover {
      background-color: inherit;
      border-color: inherit;
    }
  }
}
</style>
<style lang="scss">
.delete-dialog {
  width: 370px;
  height: 220px;
  border-radius: 24px;
  .content {
    flex-direction: column;
    display: flex;
    align-items: center;
    .text {
      font-weight: 700;
      font-size: 15px;
      line-height: 20.46px;
      color: black;
      margin-top: 28px;
      margin-bottom: 24px;
    }
  }
}
</style>
