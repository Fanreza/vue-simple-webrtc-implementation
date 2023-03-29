<script setup lang="ts">
import { peer } from '@/peerService'
import { useRoute } from 'vue-router'
import { ref } from 'vue'
import { useRoomStore } from '@/stores/roomStore'
import { socket } from '@/socket'
import { Icon } from '@iconify/vue'

const roomStore = useRoomStore()

const route = useRoute()

const localVideo = ref<HTMLVideoElement>()
const currentStream = ref<MediaStream>()

const peers = ref({})

peer.on('open', (id: any) => {
  console.log('peer.id: ', peer.id)
  socket.emit('join-room', route.params.id, peer.id)

  roomStore.userId = peer.id
})

socket.on('user-disconnected', (userId) => {
  if (peers.value[userId]) peers.value[userId].close()
})

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true
  })
  .then((stream) => {
    localVideo.value.srcObject = stream
    currentStream.value = stream

    peer.on('call', (call) => {
      call.answer(stream)
      const video = document.createElement('video')
      console.log('call.peer: ', call.peer)

      call.on('stream', (userVideoStream) => {
        console.log('userVideoStream: answer', userVideoStream)
        addVideoStream(video, userVideoStream)
      })
    })

    socket.on('new-user-connected', (userId) => {
      if (userId != peer.id) {
        console.log('New user: ' + userId)
        connectToNewUser(userId, stream)
      }
    })

    console.log('stream: ', stream)

    socket.emit('connection-request', route.params.id, peer.id)
  })

const connectToNewUser = (userId: string, stream: MediaStream) => {
  const call = peer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', (userVideoStream) => {
    console.log('userVideoStream: call', userVideoStream)
    addVideoStream(video, userVideoStream)
  })

  call.on('close', () => {
    video.remove()
  })

  peers.value[userId] = call
}

const addVideoStream = (video: HTMLVideoElement, stream: MediaStream) => {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })

  document.querySelector('.video-wrapper')?.append(video)
}

// Mute
const audioToggleColor = ref('#3c4043')
const mute = () => {
  if (currentStream.value?.getAudioTracks()[0].enabled === true) {
    currentStream.value?.getAudioTracks().forEach((track) => {
      track.enabled = false
    })
    audioToggleColor.value = '#ea4335'
  } else {
    currentStream.value?.getAudioTracks().forEach((track) => {
      track.enabled = true
    })
    audioToggleColor.value = '#3c4043'
  }
}

// Pause Video
const videoToggleColor = ref('#3c4043')
const pauseVideo = () => {
  if (currentStream.value?.getVideoTracks()[0].enabled === true) {
    currentStream.value?.getVideoTracks().forEach((track) => {
      track.enabled = false
    })
    videoToggleColor.value = '#ea4335'
  } else {
    currentStream.value?.getVideoTracks().forEach((track) => {
      track.enabled = true
    })
    videoToggleColor.value = '#3c4043'
  }
}
</script>

<template>
  <div class="container-app">
    <div class="video-wrapper">
      <video ref="localVideo" class="video" autoplay muted></video>
    </div>

    <div class="video-control">
      <!-- mute button -->
      <button @click="mute" class="audio-toggle">
        <Icon icon="ic:outline-mic" class="icon" />
      </button>

      <!-- pause video button -->
      <button @click="pauseVideo" class="video-toggle">
        <Icon icon="material-symbols:camera-video-outline" class="icon" />
      </button>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.container-app {
  @apply bg-[#202124] h-full;

  .video-wrapper {
    @apply grid grid-cols-4 gap-4;

    .video {
      transform: rotateY(180deg);
    }
  }
}

.video-control {
  @apply bg-[#202124] py-5 absolute bottom-0 right-0 left-0 flex justify-center gap-x-3;

  button {
    @apply p-2  rounded-full;

    .icon {
      @apply text-white text-2xl;
    }
  }

  .audio-toggle {
    background-color: v-bind(audioToggleColor);
  }

  .video-toggle {
    background-color: v-bind(videoToggleColor);
  }
}
</style>
