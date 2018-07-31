import { listDictionaryDetailByCode } from '@/api/dictionary'
import { Message } from 'element-ui'

export function getDictionaryDetailsByCode(code) {
  if (!code) {
    return []
  }
  listDictionaryDetailByCode(code).then(response => {
    return response.data.data
  }).catch(reason => {
    Message({
      title: '获取字典失败',
      message: reason.message,
      type: 'error',
      duration: 5000
    })
  })
  return []
}
