
/**
 * 打开摄像头
 */
export const callCamera = (videoCamera) => {
  return new Promise(function(resolve, reject) {
    // 旧版本浏览器可能根本不支持mediaDevices，我们首先设置一个空对象
    if (navigator.mediaDevices === undefined) {
      navigator.mediaDevices = {}
    }
    // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
    // 使用getUserMedia，因为它会覆盖现有的属性。
    // 这里，如果缺少getUserMedia属性，就添加它。
    if (navigator.mediaDevices.getUserMedia === undefined) {
      navigator.mediaDevices.getUserMedia = function(constraints) {
        // 首先获取现存的getUserMedia(如果存在)
        const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.getUserMedia
        // 有些浏览器不支持，会返回错误信息
        // 保持接口一致
        if (!getUserMedia) {
          reject(new Error('该浏览器不支持getUserMedia！'))
        }
        // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
        return new Promise(function(resolve, reject) {
          getUserMedia.call(navigator, constraints, resolve, reject)
        })
      }
    }
    // const constraints = {
    //   audio: false,
    //   video: { width: this.videoWidth, height: this.videoHeight, transform: 'scaleX(-1)' }
    // }
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
      // 旧的浏览器可能没有srcObject
      if ('srcObject' in videoCamera) {
        videoCamera.srcObject = stream
      } else {
        // 避免在新的浏览器中使用它，因为它正在被弃用。
        videoCamera.src = window.URL.createObjectURL(stream)
      }
      videoCamera.onloadedmetadata = function(e) {
        videoCamera.play()
      }
      resolve()
    }).catch((reason) => {
      reject(reason)
    })
  })
}
/**
 * 关闭摄像头
 */
export const closeCamera = (videoCamera) => {
  return new Promise(function(resolve, reject) {
    if (!videoCamera.srcObject) {
      reject('无效的videoCamera.srcObject')
    }
    const tracks = videoCamera.srcObject.getTracks()
    if (tracks && tracks.length > 0) {
      tracks.forEach(track => {
        track.stop()
      })
    }
    resolve()
  })
}

/**
 * 删除localStorage、sessionStorage
 */
export const photograph = (videoCamera, cancasCamera, cancasctx2d) => {
  // 把当前视频帧内容渲染到canvas上
  cancasctx2d.drawImage(videoCamera, 0, 0, 640, 480)
  // 转base64格式、图片格式转换、图片质量压缩
  const imgBase64 = cancasCamera.toDataURL('image/jpeg', 0.7)

  // 由字节转换为KB 判断大小
  const str = imgBase64.replace('data:image/jpeg;base64,', '')
  const strLength = str.length
  const fileLength = parseInt(strLength - (strLength / 8) * 2)
  // 图片尺寸  用于判断
  const size = (fileLength / 1024).toFixed(2)
  console.log(size)

  // 上传拍照信息  调用接口上传图片 .........

  // 保存到本地
  const ADOM = document.createElement('a')
  ADOM.href = this.headImgSrc
  ADOM.download = new Date().getTime() + '.jpeg'
  ADOM.click()
}
