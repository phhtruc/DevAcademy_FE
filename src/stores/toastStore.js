import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', {
  state: () => ({
    toastId: null,
    currentStatus: null,
  }),
  actions: {
    setToast(id, status) {
      this.toastId = id
      this.currentStatus = status
    },
    clearToast() {
      this.toastId = null
      this.currentStatus = null
    }
  }
})
