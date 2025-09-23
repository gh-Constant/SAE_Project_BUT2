import './styles.css';
import '@fortawesome/fontawesome-free/css/all.css';
import router from './router';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './app/App.vue';
import i18n from './i18n';

const app = createApp(App);
const pinia = createPinia();

// Enregistre Pinia, le routeur et i18n dans l'application
app.use(pinia);
app.use(router);
app.use(i18n);

// Monte l'application sur l'élément HTML avec l'id 'root'
app.mount('#root');
