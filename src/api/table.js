import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'gateway/table/list',
    method: 'get',
    params
  })
}
