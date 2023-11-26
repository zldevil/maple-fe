import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import pinia from '@/store/index'
import { registElSvgIcon } from '@/common/utils/svgIcons'

const app = createApp(App)
registElSvgIcon(app)
app.use(pinia).use(ElementPlus).use(router).mount('#app')
