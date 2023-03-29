<script setup lang="ts">
import { socket } from '@/socket'
import { peer } from '@/peerService'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'vue-router'

import { useRoomStore } from '@/stores/roomStore'

const roomStore = useRoomStore()

const router = useRouter()

const createRooms = () => {
  const roomId = uuidv4()

  socket.emit('join-room', roomId, peer.id)
  roomStore.userId = peer.id
  console.log('peer.id: ', peer.id)

  router.push({ name: 'Room', params: { id: roomId } })
}
</script>

<template>
  <div>
    <button @click="createRooms">Create Room</button>
  </div>
</template>

<style scoped></style>
