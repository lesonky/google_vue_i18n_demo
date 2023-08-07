import { createApp } from 'vue'
import './style.css'
import '@arco-design/web-vue/dist/arco.css';

import App from './App.vue'
import ArcoVue from '@arco-design/web-vue';

const app = createApp(App);
app.use(ArcoVue);
app.mount('#app');

document.body.setAttribute('arco-theme', 'dark')

