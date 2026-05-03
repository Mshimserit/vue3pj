import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { lazyPlugin } from './directives'
import { componentPlugin } from '@/components/index'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

//引入初始化样式文件
import '@/styles/common.scss'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(lazyPlugin)
app.use(componentPlugin)

// 全局错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue Error:', err)
  console.error('Error Info:', info)

  // 可以上报到错误监控平台
  // reportError(err, info)
}

// 未捕获的 Promise 错误
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason)
  // 可以在这里显示错误消息或上报
})

app.mount('#app')

