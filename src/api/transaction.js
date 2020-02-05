import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'gateway/transaction/list',
    method: 'get',
    params: query
  })
}
