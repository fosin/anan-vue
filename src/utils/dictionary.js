import { listDictionaryDetailByCode } from '@/api/dictionary'
import { Message } from 'element-ui'

export default (Vue) => {
  Vue.prototype.listDictionaryDetailsByCode = function listDictionaryDetailsByCode(code, callback) {
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
    listDictionaryDetailByCode(code).then(response => {
      callback(response.data.data)
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

