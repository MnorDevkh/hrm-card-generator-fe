import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import {  Ripple, Toast, ToastService } from 'primevue';
import ConfirmationService from 'primevue/confirmationservice';


import 'primeicons/primeicons.css';
const app = createApp(App);
app.use(router);

app.use(ToastService);
app.use(ConfirmationService);
app.component('Toast', Toast);
app.directive('ripple', Ripple);
app.mount('#app');