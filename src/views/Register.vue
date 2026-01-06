<template>
  <div class="register">
    <LanguageSelect class="language" />
    <div class="register-card">
      <div class="form">
        <div class="form-header">
          <h1 class="form-title">{{ $t('FORMS.REGISTER') }}</h1>
          <p class="form-subtitle">{{ $t('FORMS.REGISTER_SUBTITLE') }}</p>
        </div>

        <el-form
          :model="registerForm"
          ref="registerFormRef"
          label-position="top"
          @submit.prevent="handleRegister"
          :rules="registerRules"
        >
          <TextInput
            :label="$t('FORMS.FULL_NAME')"
            prop="full_name"
            :model-value="registerForm.full_name"
            @input="(val: string) => (registerForm.full_name = val)"
            :disabled="loading"
          />

          <PhoneNumberInput
            :value="registerForm.login"
            @input="(val: string) => (registerForm.login = val)"
            :disabled="loading"
          />

          <TextInput
            :label="$t('FORMS.PASSWORD')"
            prop="password"
            type="password"
            :model-value="registerForm.password"
            @input="(val: string) => (registerForm.password = val)"
            :disabled="loading"
          />

          <TextInput
            :label="$t('FORMS.CONFIRM_PASSWORD')"
            prop="confirmPassword"
            type="password"
            :model-value="registerForm.confirmPassword"
            @input="(val: string) => (registerForm.confirmPassword = val)"
            @keyup.enter="handleRegister"
            :disabled="loading"
          />

          <Button
            :name="$t('FORMS.REGISTER')"
            @click="handleRegister"
            :loading="loading"
            :disabled="loading"
            full-width
          />
        </el-form>

        <div class="login-link">
          <span>{{ $t('COMMON.HAVE_ACCOUNT') }}</span>
          <el-button type="primary" link @click="goToLogin">
            {{ $t('COMMANDS.LOGIN') }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { $api } from '@/common/api';
import Button from '@/components/common/Button.vue';
import PhoneNumberInput from '@/components/common/form-elements/PhoneNumberInput.vue';
import TextInput from '@/components/common/form-elements/TextInput.vue';
import LanguageSelect from '@/components/common/LanguageSelect.vue';
import { $t } from '@/plugins/i18n';
import router from '@/router';
import { useMainStore } from '@/stores/main';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { reactive, ref } from 'vue';

const loading = ref(false);
const registerFormRef = ref<FormInstance>();
const mainStore = useMainStore();

const registerForm = reactive({
  full_name: '',
  login: '',
  password: '',
  confirmPassword: '',
});

const validatePasswordMatch = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error($t('FORMS.REQUIRED')));
  } else if (value !== registerForm.password) {
    callback(new Error($t('FORMS.PASSWORDS_NOT_MATCH')));
  } else {
    callback();
  }
};

const registerRules = reactive<FormRules>({
  full_name: [
    {
      required: true,
      message: $t('FORMS.REQUIRED'),
      trigger: ['blur'],
    },
  ],
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
  confirmPassword: [
    {
      validator: validatePasswordMatch,
      trigger: ['blur', 'change'],
    },
  ],
});

const handleRegister = async () => {
  try {
    loading.value = true;
    await registerFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        const response = await $api.user.register({
          full_name: registerForm.full_name,
          phone_number: registerForm.login,
          password: registerForm.password,
        });
        await mainStore.setToken(response.token);
        await mainStore.setUser(response);
        ElMessage.success($t('MESSAGES.SUCCESS'));
        router.push({ name: 'dashboard' });
      }
    });
  } catch (e: any) {
  } finally {
    loading.value = false;
  }
};

const goToLogin = () => {
  router.push({ name: 'login' });
};
</script>

<style lang="scss" scoped>
.register {
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

  .register-card {
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

    .login-link {
      margin-top: 16px;
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
