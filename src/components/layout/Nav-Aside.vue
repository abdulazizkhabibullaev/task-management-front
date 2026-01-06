<template>
  <div class="sidebar-container" :class="{ collapsed: collapsed }">
    <div class="sidebar-header">
      <div class="brand">
        <h2 v-if="!collapsed">Task Management</h2>
        <h2 v-else>TM</h2>
      </div>
      <el-icon class="toggle-btn" :size="20" @click="$emit('toggle')">
        <Fold v-if="!collapsed" />
        <Expand v-else />
      </el-icon>
    </div>

    <el-menu
      class="nav-menu"
      :collapse="collapsed"
      :default-active="activeMenu"
      :router="true"
    >
      <el-menu-item index="/dashboard" class="nav-item">
        <el-icon :size="20">
          <HomeFilled />
        </el-icon>
        <template #title>
          <span class="nav-text">{{ $t('NAV_ASIDE.DASHBOARD') }}</span>
        </template>
      </el-menu-item>

      <el-menu-item index="/projects" class="nav-item">
        <el-icon :size="20">
          <Folder />
        </el-icon>
        <template #title>
          <span class="nav-text">{{ $t('NAV_ASIDE.PROJECTS') }}</span>
        </template>
      </el-menu-item>

      <el-menu-item index="/tasks" class="nav-item">
        <el-icon :size="20">
          <Document />
        </el-icon>
        <template #title>
          <span class="nav-text">{{ $t('NAV_ASIDE.TASKS') }}</span>
        </template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { HomeFilled, Document, Folder, Fold, Expand } from '@element-plus/icons-vue';

defineProps<{
  collapsed: boolean;
}>();

defineEmits<{
  toggle: [];
}>();

const route = useRoute();
const activeMenu = computed(() => route.path);
</script>

<style lang="scss" scoped>
.sidebar-container {
  height: 100vh;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
  width: 260px;

  &.collapsed {
    width: 64px;
  }

  .sidebar-header {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    border-bottom: 1px solid #e5e7eb;

    .brand {
      h2 {
        margin: 0;
        font-size: 24px;
        font-weight: 700;
        color: #409eff;
      }
    }

    .toggle-btn {
      cursor: pointer;
      color: #666;
      transition: color 0.3s;

      &:hover {
        color: #409eff;
      }
    }
  }

  .nav-menu {
    flex: 1;
    border-right: none;
    padding: 16px 0;

    .nav-item {
      margin: 4px 12px;
      border-radius: 8px;
      height: 48px;
      line-height: 48px;

      &:hover {
        background: #f3f4f6;
      }

      &.is-active {
        background: #409eff;
        color: #fff;

        :deep(.el-icon) {
          color: #fff;
        }
      }

      .nav-text {
        font-size: 14px;
        font-weight: 500;
      }
    }
  }
}

.collapsed {
  .sidebar-header {
    padding: 0 12px;
    justify-content: center;

    .brand h2 {
      font-size: 20px;
    }
  }

  .nav-menu .nav-item {
    margin: 4px 8px;
  }
}
</style>
