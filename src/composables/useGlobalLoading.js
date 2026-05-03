import { ref } from 'vue'

const isLoading = ref(false)
const message = ref('加载中...')

export const showLoading = (msg = '加载中...') => {
  message.value = msg
  isLoading.value = true
}

export const hideLoading = () => {
  isLoading.value = false
}

export const useGlobalLoading = () => {
  return {
    isLoading,
    message,
    showLoading,
    hideLoading
  }
}