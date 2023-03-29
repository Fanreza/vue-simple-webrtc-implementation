let videoTrack = null

self.onmessage = (event) => {
  videoTrack = event.data.getVideoTracks()[0]
  startCapturing()
}

const startCapturing = () => {
  const imageCapture = new ImageCapture(videoTrack)
  setInterval(() => {
    imageCapture.grabFrame().then((imageBitmap) => {
      const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(imageBitmap, 0, 0)
      const imageData = ctx.getImageData(0, 0, imageBitmap.width, imageBitmap.height)
      self.postMessage(imageData)
    })
  }, 100)
}
