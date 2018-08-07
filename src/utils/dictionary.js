import { fetchDictionaryDetailsByCode } from '@/api/dictionary'
import { Message } from 'element-ui'

export default (Vue) => {
  Vue.prototype.postDictionaryDetailsByCode = function postDictionaryDetailsByCode(code, callback) {
    if (!code) {
      Message({
        title: '获取字典明细失败',
        message: '没有或传入的字典代码code无效!',
        type: 'error',
        duration: 5000
      })
      return
    }
    if (typeof callback !== 'function') {
      Message({
        title: '获取字典明细失败',
        message: '没有或传入的回调函数callback不正确!',
        type: 'error',
        duration: 5000
      })
      return
    }
    fetchDictionaryDetailsByCode(code).then(response => {
      callback(response.data)
    }).catch(reason => {
      Message({
        title: '获取字典明细失败',
        message: reason.message,
        type: 'error',
        duration: 5000
      })
    })
  }

  Vue.prototype.getDictionaryDetailsByCode = function getDictionaryDetailsByCode(code) {
    if (!code) {
      Message({
        title: '获取字典明细失败',
        message: '没有或传入的字典代码code无效!',
        type: 'error',
        duration: 5000
      })
      return
    }
    fetchDictionaryDetailsByCode(code, 'get').then(response => {
      return response.data
    }).catch(reason => {
      Message({
        title: '获取字典明细失败',
        message: reason.message,
        type: 'error',
        duration: 5000
      })
    })
  }
}

