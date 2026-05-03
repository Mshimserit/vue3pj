import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useWalletStore = defineStore('wallet', () => {
  const walletInfo = ref({
    balance: 0,
    couponCount: 0
  })

  const isBalanceEnough = computed(() => walletInfo.value.balance > 0)

  const updateWalletInfo = (info) => {
    walletInfo.value = { ...walletInfo.value, ...info }
  }

  const resetWalletInfo = () => {
    walletInfo.value = {
      balance: 0,
      couponCount: 0
    }
  }

  return {
    walletInfo,
    isBalanceEnough,
    updateWalletInfo,
    resetWalletInfo
  }
}, {
  persist: true
})
