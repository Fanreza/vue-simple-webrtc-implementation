import { reactive } from 'vue'
import { io } from 'socket.io-client'

export const socket = io('ws://localhost:3000')

socket.on('user-connected', (userId) => {
  console.log('user-connected:asfasfasfas ', userId)
})
