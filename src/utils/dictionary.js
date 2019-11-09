import { Notification } from 'element-ui'
export default (Vue) => {
  Vue.prototype.asyncLoadDictionaryByCode = function(code, callback) {
    if (!code) {
      Notification.error({
        title: '获取字典明细失败',
        message: '没有或传入的字典代码code无效!',
        duration: 5000
      })
      return
    }
    if (typeof callback !== 'function') {
      Notification.error({
        title: '获取字典明细失败',
        message: '没有或传入的回调函数callback不正确!',
        duration: 5000
      })
      return
    }
    this.postRequest('/platform/v1/dictionaryDetail/byCode/' + code).then(response => {
      callback(response.data)
    }).catch(reason => {
      Notification.error({
        title: '获取字典明细失败',
        message: reason.message,
        duration: 5000
      })
    })
  }

  Vue.prototype.syncLoadDictionaryByCode = function(code, callback) {
    if (!code) {
      Notification.error({
        title: '获取字典明细失败',
        message: '没有或传入的字典代码code无效!',
        duration: 5000
      })
      return
    }
    if (typeof callback !== 'function') {
      Notification.error({
        title: '获取字典明细失败',
        message: '没有或传入的回调函数callback不正确!',
        duration: 5000
      })
      return
    }
    this.getRequest('/platform/v1/dictionaryDetail/byCode/' + code).then(response => {
      callback(response.data)
    }).catch(reason => {
      Notification.error({
        title: '获取字典明细失败',
        message: reason.message,
        duration: 5000
      })
    })
  }
}

