<template>
  <div class="header">
    <el-icon v-if="isMobile" class="menu-toggle" :size="24" @click="$emit('toggle-menu')">
      <Expand />
    </el-icon>

    <div class="header-right">
      <LanguageSelect class="language-select" />

      <el-dropdown trigger="click" @command="handleCommand">
        <div class="user-menu">
          <el-avatar :size="38" class="user-avatar">
            {{ userInitial }}
          </el-avatar>
          <span v-if="!isMobile" class="user-name">{{ userName }}</span>
          <el-icon :size="16">
            <ArrowDown />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item disabled>
              <div class="user-info">
                <div class="user-email">{{ userEmail }}</div>
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <el-icon :size="16">
                <SwitchButton />
              </el-icon>
              <span>{{ $t('COMMANDS.LOGOUT') }}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import LanguageSelect from '@/components/common/LanguageSelect.vue';
import { useResponsive } from '@/composables/useResponsive';
import { useMainStore } from '@/stores/main';
import { ArrowDown, Expand, SwitchButton } from '@element-plus/icons-vue';
import { computed } from 'vue';

defineEmits<{
  'toggle-menu': [];
}>();

const mainStore = useMainStore();
const { isMobile } = useResponsive();

const userName = computed(() => mainStore.user?.full_name || 'User');
const userEmail = computed(() => mainStore.user?.phone_number || '');
const userInitial = computed(() => {
  const name = mainStore.user?.full_name || 'U';
  return name.charAt(0).toUpperCase();
});

const handleCommand = async (command: string) => {
  if (command === 'logout') {
    await mainStore.logout();
    window.location.reload();
  }
};
</script>

<style scoped lang="scss">
.header {
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;

  .menu-toggle {
    cursor: pointer;
    color: #666;
    transition: color 0.3s;

    &:hover {
      color: #409eff;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-left: auto;
  }

  .language-select {
    width: 120px;
  }

  .user-menu {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    padding: 4px 12px;
    border-radius: 6px;

    &:hover {
      background: #f5f5f5;
    }

    .user-avatar {
      background: #409eff;
      color: #fff;
    }

    .user-name {
      font-size: 14px;
      font-weight: 500;
      color: #1a1a1a;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .user-info {
    padding: 4px 0;

    .user-phone {
      font-size: 13px;
      color: #666;
    }
  }
}

@media (max-width: 768px) {
  .header {
    padding: 0 16px;

    .language-select {
      width: 80px;
    }

    .user-menu {
      gap: 8px;
      padding: 4px 8px;
    }
  }
}
</style>
