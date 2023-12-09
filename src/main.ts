import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import pinia from '@/store/index'
import { registElSvgIcon } from '@/common/utils/svgIcons'
import '@/theme/index.scss'
import { ElMessage } from 'element-plus'

const app = createApp(App)
registElSvgIcon(app)
app.use(pinia).use(ElementPlus).use(router).mount('#app')
// 全局error处理
app.config.errorHandler = function (err: any, vm, info) {
  // 如果是断言错误，则进行提示即可
  if (err.name == 'AssertError') {
    ElMessage.error(err.message)
  } else {
    console.error(err, info)
  }
}
