import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import './assets/main.css';

import { setupCalendar, Calendar } from 'v-calendar';
import 'v-calendar/style.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(setupCalendar, {});
app.component('VCalendar', Calendar);

app.mount('#app');
