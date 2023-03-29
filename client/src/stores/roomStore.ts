import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRoomStore = defineStore('user', () => {
  const userId = ref<string | null>(null)

  return {
    userId
  }
})
