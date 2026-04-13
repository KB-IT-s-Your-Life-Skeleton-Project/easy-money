import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from './App.vue';
import router from './router';
import './assets/main.css';

import { setupCalendar, Calendar } from 'v-calendar';
import 'v-calendar/style.css';

const app = createApp(App);

// 1. Pinia 인스턴스를 변수에 할당합니다.
const pinia = createPinia();

// 2. 변수(pinia)에 플러그인을 장착합니다.
pinia.use(piniaPluginPersistedstate);

// 3. 앱에 pinia 변수를 전달합니다.
app.use(pinia);

app.use(router);
app.use(setupCalendar, {});
app.component('VCalendar', Calendar);

app.mount('#app');
