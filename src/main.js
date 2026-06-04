import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import BlankLayout from './BlankLayout.vue';
import router from './router';
import i18n from './i18n';
import {  Ripple, Toast, ToastService } from 'primevue';
import ConfirmationService from 'primevue/confirmationservice';


import 'primeicons/primeicons.css';
const app = createApp(App);
app.use(i18n);
app.use(router);

app.use(ToastService);
app.use(ConfirmationService);
app.component('Toast', Toast);
app.directive('ripple', Ripple);
app.mount('#app');

if (localStorage.getItem('auth_token')) {
  import('./service/auth.service.js').then((m) =>
    m.syncCurrentUserFromServer().catch(() => {}),
  );
}