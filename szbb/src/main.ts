import './style.css'
import { createApp } from 'vue'
import App from './App.vue'
import * as VueRouter from "vue-router"
import { routes } from "./routes"
const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
})
const app = createApp(App)
app.use(router)
app.mount('#app')
