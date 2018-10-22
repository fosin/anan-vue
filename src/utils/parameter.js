import { fetchOrganizParameterValue, fetchUserParameterValue } from '@/views/platform/parameter/parameter'
import { Notification } from 'element-ui'

export default (Vue) => {
  Vue.prototype.asyncOrganizParameterValue = function(key, defaultValue, description, callback) {
    if (!key) {
      Notification.error({
        title: '获取参数值失败',
        message: '没有或传入的参数键无效!',
        duration: 5000
      })
      return
    }
    if (typeof callback !== 'function') {
      Notification.error({
        title: '获取参数值失败',
        message: '没有或传入的回调函数callback不正确!',
        duration: 5000
      })
      return
    }
    fetchOrganizParameterValue(key, defaultValue, description).then(response => {
      callback(response.data)
    }).catch(reason => {
      Notification.error({
        title: '获取参数值失败',
        message: reason.message,
        duration: 5000
      })
    })
  }

  Vue.prototype.syncOrganizParameterValue = function(key, defaultValue, description) {
    if (!key) {
      Notification.error({
        title: '获取参数值失败',
        message: '没有或传入的参数键无效!',
        duration: 5000
      })
      return
    }
    fetchOrganizParameterValue(key, defaultValue, description, 'get').then(response => {
      return response.data
    }).catch(reason => {
      Notification.error({
        title: '获取参数值失败',
        message: reason.message,
        duration: 5000
      })
    })
  }

  Vue.prototype.asyncUserParameterValue = function(key, defaultValue, description, callback) {
    if (!key) {
      Notification.error({
        title: '获取参数值失败',
        message: '没有或传入的参数键无效!',
        duration: 5000
      })
      return
    }
    if (typeof callback !== 'function') {
      Notification.error({
        title: '获取参数值失败',
        message: '没有或传入的回调函数callback不正确!',
        duration: 5000
      })
      return
    }
    fetchUserParameterValue(key, defaultValue, description).then(response => {
      callback(response.data)
    }).catch(reason => {
      Notification.error({
        title: '获取参数值失败',
        message: reason.message,
        duration: 5000
      })
    })
  }

  Vue.prototype.syncUserParameterValue = function(key, defaultValue, description) {
    if (!key) {
      Notification.error({
        title: '获取参数值失败',
        message: '没有或传入的参数键无效!',
        duration: 5000
      })
      return
    }
    fetchUserParameterValue(key, defaultValue, description, 'get').then(response => {
      return response.data
    }).catch(reason => {
      Notification.error({
        title: '获取参数值失败',
        message: reason.message,
        duration: 5000
      })
    })
  }
}

