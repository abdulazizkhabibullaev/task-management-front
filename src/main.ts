import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'element-plus/es/components/message/style/css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';
import App from './App.vue';
import './assets/main.css';
import './assets/scss/global.scss';
import { $api } from './common/api';
import myCookie from './common/utils/my-cookie';
import { i18n } from './plugins/i18n';
import router from './router';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);

router.beforeEach((to, from, next) => {
  const token = myCookie.getToken();
  if (to.meta?.auth && !token) {
    myCookie.clear();
    next({ name: 'login' });
  } else if (to.name == 'login' && token) {
    next({ name: 'home' });
  } else {
    next();
  }
});

app.use(router);
app.use(i18n);
app.use(ElementPlus, { size: 'large', zIndex: 3000 });
app.config.globalProperties.$api = $api;

app.mount('#app');
