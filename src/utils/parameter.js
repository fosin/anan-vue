import { fetchOrganizParameterValue, fetchUserParameterValue } from '@/api/parameter'
import { Message } from 'element-ui'

export default (Vue) => {
  Vue.prototype.postOrganizParameterValue = function(key, callback) {
    if (!key) {
      Message({
        title: '获取参数值失败',
        message: '没有或传入的参数键无效!',
        type: 'error',
        duration: 5000
      })
      return
    }
    if (typeof callback !== 'function') {
      Message({
        title: '获取参数值失败',
        message: '没有或传入的回调函数callback不正确!',
        type: 'error',
        duration: 5000
      })
      return
    }
    fetchOrganizParameterValue(key).then(response => {
      callback(response.data.data)
    }).catch(reason => {
      Message({
        title: '获取参数值失败',
        message: reason.message,
        type: 'error',
        duration: 5000
      })
    })
  }

  Vue.prototype.getOrganizParameterValue = function(key) {
    if (!key) {
      Message({
        title: '获取参数值失败',
        message: '没有或传入的参数键无效!',
        type: 'error',
        duration: 5000
      })
      return
    }
    fetchOrganizParameterValue(key, 'get').then(response => {
      return response.data.data
    }).catch(reason => {
      Message({
        title: '获取参数值失败',
        message: reason.message,
        type: 'error',
        duration: 5000
      })
    })
  }

  Vue.prototype.postUserParameterValue = function(key, callback) {
    if (!key) {
      Message({
        title: '获取参数值失败',
        message: '没有或传入的参数键无效!',
        type: 'error',
        duration: 5000
      })
      return
    }
    if (typeof callback !== 'function') {
      Message({
        title: '获取参数值失败',
        message: '没有或传入的回调函数callback不正确!',
        type: 'error',
        duration: 5000
      })
      return
    }
    fetchUserParameterValue(key).then(response => {
      callback(response.data.data)
    }).catch(reason => {
      Message({
        title: '获取参数值失败',
        message: reason.message,
        type: 'error',
        duration: 5000
      })
    })
  }

  Vue.prototype.getUserParameterValue = function(key) {
    if (!key) {
      Message({
        title: '获取参数值失败',
        message: '没有或传入的参数键无效!',
        type: 'error',
        duration: 5000
      })
      return
    }
    fetchUserParameterValue(key, 'get').then(response => {
      return response.data.data
    }).catch(reason => {
      Message({
        title: '获取参数值失败',
        message: reason.message,
        type: 'error',
        duration: 5000
      })
    })
  }
}

