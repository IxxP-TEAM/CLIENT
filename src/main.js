import './assets/main.css'
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";


import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import "@vueup/vue-quill/dist/vue-quill.snow.css"; 
import "quill/dist/quill.snow.css"; 
import { Chart, registerables } from 'chart.js'; 
Chart.register(...registerables);

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
