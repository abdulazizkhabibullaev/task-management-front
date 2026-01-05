<template>
  <div class="dashboard">
    <h1>{{ $t('dashboard.title') }}</h1>

    <div class="stats-grid">
      <div v-for="stat in statistics" :key="stat.key" class="stat-card">
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-label">{{ $t(stat.label) }}</div>
      </div>
    </div>

    <div class="recent-tasks">
      <h2>{{ $t('dashboard.recentTasks') }}</h2>

      <Table
        :page-name="PageNames.TASKS"
        data-url="task/paging"
        :editable="false"
        :deletable="false"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { $api } from '@/common/api';
import { PageNames } from '@/common/constants/table';
import Card from '@/components/common/Card.vue';
import router from '@/router';
import { CircleCheck, Clock, Document, Warning } from '@element-plus/icons-vue';
import { computed, onMounted, ref } from 'vue';

const loading = ref(false);
const taskStats = ref({
  total: 0,
  to_do: 0,
  in_progress: 0,
  completed: 0,
});

const statistics = computed(() => [
  {
    key: 'total',
    label: 'dashboard.stats.totalTasks',
    value: taskStats.value.total,
    icon: Document,
    color: 'blue',
  },
  {
    key: 'to_do',
    label: 'dashboard.stats.toDoTasks',
    value: taskStats.value.to_do,
    icon: Clock,
    color: 'gray',
  },
  {
    key: 'in_progress',
    label: 'dashboard.stats.inProgressTasks',
    value: taskStats.value.in_progress,
    icon: Warning,
    color: 'orange',
  },
  {
    key: 'completed',
    label: 'dashboard.stats.completedTasks',
    value: taskStats.value.completed,
    icon: CircleCheck,
    color: 'green',
  },
]);

const fetchDashboardData = async () => {
  try {
    loading.value = true;

    const statsResponse = await $api.task.getStatistics();
    taskStats.value.total = statsResponse.total || 0;
    taskStats.value.to_do =
      statsResponse.statuses?.find((val: any) => val.status === 'to_do')?.count || 0;
    taskStats.value.in_progress =
      statsResponse.statuses?.find((val: any) => val.status === 'in_progress')?.count ||
      0;
    taskStats.value.completed =
      statsResponse.statuses?.find((val: any) => val.status === 'completed')?.count || 0;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  } finally {
    loading.value = false;
  }
};

const goToTasks = () => {
  router.push({ name: 'tasks' });
};

const viewTask = (id: string) => {
  router.push({ name: 'task-detail', params: { id: id } });
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 24px;

  h1 {
    font-size: 28px;
    font-weight: 600;
    margin: 0 0 24px 0;
    color: #333;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;

    .stat-card {
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #e5e7eb;

      .stat-value {
        font-size: 28px;
        font-weight: 600;
        margin-bottom: 4px;
        color: #333;
      }

      .stat-label {
        font-size: 14px;
        color: #666;
      }
    }
  }

  .recent-tasks {
    h2 {
      font-size: 20px;
      font-weight: 600;
      margin: 0 0 16px 0;
      color: #333;
    }
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 16px;

    h1 {
      font-size: 24px;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>
