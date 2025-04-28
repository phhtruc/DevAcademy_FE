import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";

// Import CSS files
import './assets/images/favicon.ico'
import './assets/css/bootstrap.min.css'
import './assets/css/typography.css'
import './assets/css/style.css'
import './assets/css/responsive.css'

import BootstrapVue3 from "bootstrap-vue-3";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";

// Import JS files
import { loadExternalScripts } from './loadScripts.js'

const app = createApp(App)

app.use(router)
app.use(BootstrapVue3)

app.mount('#app')

// Load external JS files
loadExternalScripts()
