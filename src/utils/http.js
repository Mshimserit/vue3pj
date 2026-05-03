import axios from "axios";
import 'element-plus/theme-chalk/el-message.css'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/userStore'
import router from '@/router'
import { showLoading, hideLoading } from '@/composables/useGlobalLoading'

// 重试配置
const RETRY_CONFIG = {
    count: 3,
    delay: 1000
}

// 安全解析本地存储数据
export const safeParseJSON = (str, defaultValue = null) => {
    if (!str) return defaultValue
    try {
        return JSON.parse(str)
    } catch (error) {
        console.warn('JSON 解析失败:', error)
        return defaultValue
    }
}

const httpInstance = axios.create({
    baseURL: 'http://pcapi-xiaotuxian-front-devtest.itheima.net',
    timeout: 10000
})

// 添加请求拦截器
httpInstance.interceptors.request.use(function (config) {
    const userStore = useUserStore()
    const token = userStore.userInfo.token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    // 初始化重试次数
    config.__retryCount = config.__retryCount ?? 0
    showLoading()
    return config;
}, function (error) {
    return Promise.reject(error);
});

// 添加响应拦截器
httpInstance.interceptors.response.use(function (response) {
    const res = response.data

    if (res.code !== '1') {
        const message = res.msg || '请求失败'
        ElMessage.error(message)
        hideLoading()
        return Promise.reject(new Error(message))
    }

    hideLoading()
    return response;
}, async function (error) {
    const config = error.config

    // 重试逻辑
    if (config && config.__retryCount < RETRY_CONFIG.count) {
        config.__retryCount += 1
        await new Promise(resolve => setTimeout(resolve, RETRY_CONFIG.delay))
        
        try {
            const response = await httpInstance(config)
            return response
        } catch (retryError) {
            return Promise.reject(retryError)
        }
    }

    const userStore = useUserStore()

    let message = '网络异常，请稍后重试'

    if (error.response) {
        console.error('HTTP Error Details:', {
            url: error.config?.url,
            status: error.response.status,
            data: error.response.data
        })

        const statusMap = {
            400: '请求参数错误',
            401: '登录已过期，请重新登录',
            403: '没有权限访问',
            404: '请求的资源不存在',
            500: '服务器错误',
            502: '网关错误',
            503: '服务不可用'
        }

        message = statusMap[error.response.status]
            || error.response.data?.message
            || '网络异常，请稍后重试'
    } else if (error.code === 'ECONNABORTED') {
        message = '请求超时，请稍后重试或检查网络连接'
    } else if (error.request) {
        message = '网络连接失败，请检查网络设置'
    }

    ElMessage({
        type: 'error',
        message,
        duration: 3000
    })

    hideLoading()

    if (error.response?.status === 401) {
        userStore.clearUserInfo()
        router.push('/login')
    }

    return Promise.reject(error);
});

export default httpInstance;