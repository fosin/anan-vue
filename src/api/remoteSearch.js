import request from '@/utils/request'

export function userSearch(name) {
  return request({
    url: 'gateway/search/user',
    method: 'get',
    params: { name }
  })
}
