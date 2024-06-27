import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { type IMyWallet } from '@/models/MyWallet'

export const useWalletStore = defineStore('walletStore', () => {
  // State
  const wallet = ref<IMyWallet>()

  // Getters
  const getWallet = computed(() => wallet)
  const getSigner = computed(() => wallet.value?.signer)
  const getChain = computed(() => wallet.value?.chain)

  // Actions
  const setWallet = (newWallet: IMyWallet) => {
    wallet.value = newWallet
  }
  const resetWallet = () => {
    wallet.value = undefined
  }

  return {
    wallet,
    getWallet,
    getSigner,
    getChain,
    setWallet,
    resetWallet
  }
})
