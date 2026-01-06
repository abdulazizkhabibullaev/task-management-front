<template>
  <div class="login">
    <LanguageSelect class="language" />
    <div class="login-card">
      <div class="form">
        <div class="form-header">
          <h1 class="form-title">{{ $t('COMMANDS.LOGIN') }}</h1>
          <p class="form-subtitle">{{ $t('COMMON.LOGIN_SUBTITLE') }}</p>
        </div>

        <el-form
          :model="loginForm"
          ref="loginFormRef"
          label-position="top"
          @submit.prevent="handleLogin"
          :rules="loginRules"
        >
          <PhoneNumberInput
            :value="loginForm.login"
            @input="(val: string) => (loginForm.login = val)"
            :disabled="loading"
          />

          <TextInput
            :label="$t('FORMS.PASSWORD')"
            prop="password"
            type="password"
            :model-value="loginForm.password"
            @input="(val: string) => (loginForm.password = val)"
            :disabled="loading"
            @keyup.enter="handleLogin"
          />

          <Button
            :name="$t('COMMANDS.LOGIN')"
            @click="handleLogin"
            :loading="loading"
            :disabled="loading"
            full-width
          />
        </el-form>

        <div class="register-link">
          <span>{{ $t('COMMON.NO_ACCOUNT') }}</span>
          <el-button type="primary" link @click="goToRegister">
            {{ $t('COMMANDS.REGISTER') }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Button from '@/components/common/Button.vue';
import PhoneNumberInput from '@/components/common/form-elements/PhoneNumberInput.vue';
import TextInput from '@/components/common/form-elements/TextInput.vue';
import LanguageSelect from '@/components/common/LanguageSelect.vue';
import { $t } from '@/plugins/i18n';
import router from '@/router';
import { useMainStore } from '@/stores/main';
import { ElMessage, type FormRules } from 'element-plus';
import { reactive, ref } from 'vue';

const loading = ref(false);
const loginFormRef = ref();
const mainStore = useMainStore();

const loginForm = reactive({
  login: '',
  password: '',
});

const loginRules = reactive<FormRules>({
  login: [
    {
      required: true,
      message: $t('FORMS.REQUIRED'),
      trigger: ['blur'],
    },
  ],
  password: [
    {
      required: true,
      message: $t('FORMS.REQUIRED'),
      trigger: ['blur'],
    },
    {
      min: 6,
      message: $t('FORMS.PASSWORD_MIN_LENGTH'),
      trigger: ['blur'],
    },
  ],
});

const handleLogin = async () => {
  try {
    loading.value = true;
    await loginFormRef.value.validate(async (valid: boolean) => {
      if (valid) {
        await mainStore.login({
          login: loginForm.login,
          password: loginForm.password,
        });
        ElMessage.success($t('MESSAGES.SUCCESS'));
        router.push({ name: 'dashboard' });
      }
    });
  } catch (e: any) {
  } finally {
    loading.value = false;
  }
};

const goToRegister = () => {
  router.push({ name: 'register' });
};
</script>

<style lang="scss" scoped>
.login {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f6fa;
  padding: 20px;

  .language {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 120px;
  }

  .login-card {
    background: #fff;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 420px;
  }

  .form {
    .form-header {
      margin-bottom: 24px;

      .form-title {
        font-size: 24px;
        font-weight: 600;
        color: #333;
        margin: 0 0 8px 0;
      }

      .form-subtitle {
        font-size: 14px;
        color: #666;
        margin: 0;
      }
    }

    .register-link {
      margin-top: 24px;
      text-align: center;
      font-size: 14px;
      color: #666;

      span {
        margin-right: 4px;
      }
    }
  }
}
</style>

<style>
.el-form-item--label-top .el-form-item__label {
  margin-bottom: 4px;
  color: #333;
  line-height: 24px;
  font-weight: 500;
}
</style>
