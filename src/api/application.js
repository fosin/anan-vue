import request from '@/utils/request'

// 获取客户端授权数据分页列表
export function loadUIUrl(url, method) {
  return request({
    url: url,
    method: method || 'post'
  })
}
export function loadServiceNames(method) {
  return request({
    url: 'gateway/platform/api/application/serviceNames',
    method: method || 'post'
  })
}
