import request from '@/utils/request'

// 获取客户端授权数据分页列表
export function pageUrl(url, method) {
  return request({
    url: url,
    method: method || 'post'
  })
}
