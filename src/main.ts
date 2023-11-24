import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { ElMessage } from 'element-plus';



const app = createApp(App)

app.use(ElementPlus).use(router).mount('#app') 
