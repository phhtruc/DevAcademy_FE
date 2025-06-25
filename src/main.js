import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import 'vue3-toastify/dist/index.css'
import { createPinia } from 'pinia'
import '@toast-ui/editor/dist/toastui-editor.css'; 
import webSocketService from './services/WebSocketService'
import { toast } from 'vue3-toastify'


// Import CSS files
import './assets/images/favicon.ico'
import './assets/css/bootstrap.min.css'
import './assets/css/typography.css'
import './assets/css/style.css'
import './assets/css/responsive.css'

import BootstrapVue3 from "bootstrap-vue-3";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";

const VUE_APP_WEBSOCKET_URL = import.meta.env.VITE_APP_WEBSOCKET_URL || window.runtime_config.VITE_APP_WEBSOCKET_URL;
// Kết nối WebSocket khi ứng dụng khởi động
webSocketService.connect(
  VUE_APP_WEBSOCKET_URL,
);

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(BootstrapVue3)
app.use(pinia)

window.toast = toast

app.mount('#app')
