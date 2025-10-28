import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import router from './router';
import Aura from '@primeuix/themes/aura';
import {  Ripple, Toast, ToastService } from 'primevue';


import 'primeicons/primeicons.css';
const app = createApp(App);
app.use(router);
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});
app.use(ToastService);
app.component('Toast', Toast);
app.directive('ripple', Ripple);
app.mount('#app');