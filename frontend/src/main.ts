import './styles.css';
import router from './router';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './app/App.vue';
import i18n from './i18n';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(i18n);
app.mount('#root');
