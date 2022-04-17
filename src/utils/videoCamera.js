
import { formatDate } from '@/utils/date'
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
 * 拍照并上传到后台
 */
export const photograph = (videoCamera, canvas = { camera: {}, width: 400, height: 300, encoderOptions: 0.5, imageType: 'image/jpeg' }) => {
  return new Promise(function(resolve, reject) {
    if (!videoCamera || !canvas || !canvas.camera) {
      reject('传入的参数(videoCamera、canvas)无效，拍照无法进行，请检查！')
      return
    }
    if (!canvas.width || canvas.width < 1 || !canvas.height || canvas.height < 1) {
      console.log('传入的像素参数(canvas.width、canvas.height)无效,取默认值400：300')
      canvas.width = 400
      canvas.height = 300
    }

    if (!canvas.encoderOptions || canvas.encoderOptions < 0 || canvas.encoderOptions > 1) {
      console.log('清晰度参数(canvas.encoderOptions)只能在0和1之间，取默认值0.5')
      canvas.encoderOptions = 0.5
    }

    if (!canvas.imageType) {
      console.log('图片类型参数(canvas.imageType)不能无效，取默认值image/jpeg')
      canvas.imageType = 'image/jpeg'
    }
    const cancasctx2d = canvas.camera.getContext('2d')
    // 把当前视频帧内容渲染到canvas上
    cancasctx2d.drawImage(videoCamera, 0, 0, canvas.width, canvas.height)
    // 转base64格式、图片格式转换、图片质量压缩
    const dataUrl = canvas.camera.toDataURL(canvas.imageType, canvas.encoderOptions)
    const fileName = formatDate(new Date(), 'yyyyMMddHHmmss') + '.' + canvas.imageType.replace('image/', '')

    const data = {
      name: fileName,
      dataUrl: dataUrl
    }

    // 由字节转换为KB 判断大小
    // const str = dataUrl.replace('data:' + canvas.imageType + ';base64,', '')
    // const strLength = str.length
    // const fileLength = parseInt(strLength - (strLength / 8) * 2)
    // const size = (fileLength / 1024).toFixed(2)
    // console.log(size)
    // 保存到本地(测试用)
    // const ADOM = document.createElement('a')
    // ADOM.href = dataUrl
    // ADOM.download = fileName
    // ADOM.click()

    resolve(data)
  })
}
