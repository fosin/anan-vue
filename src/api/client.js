import request from '@/utils/request'

// 获取客户端授权数据分页列表
export function listClientPage(page) {
  return request({
    url: '/auth/client/pageList',
    method: 'post',
    data: page
  })
}
// 获取所有客户端授权数据列表
export function listClient() {
  return request({
    url: '/auth/client/list',
    method: 'post'
  })
}

export function postClient(obj) {
  return request({
    url: '/auth/client/',
    method: 'post',
    data: obj
  })
}

export function getClient(id) {
  return request({
    url: '/auth/client/' + id,
    method: 'get'
  })
}

export function deleteClient(id) {
  return request({
    url: '/auth/client/' + id,
    method: 'delete'
  })
}

export function putClient(obj) {
  return request({
    url: '/auth/client',
    method: 'put',
    data: obj
  })
}
