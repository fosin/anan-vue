import request, { postRequest } from '@/utils/request'

// 获取客户端授权数据分页列表
export function listClientPage(page) {
  return request({
    url: 'gateway/platform/v1/oauthclient/paging',
    method: 'post',
    data: page
  })
}
// 获取所有客户端授权数据列表
export function listClient() {
  return postRequest('gateway/platform/v1/oauthclient/list')
}

export function postClient(obj) {
  return request({
    url: 'gateway/platform/v1/oauthclient/',
    method: 'post',
    data: obj
  })
}

export function getClient(id, method) {
  return request({
    url: 'gateway/platform/v1/oauthclient/' + id,
    method: method || 'post'
  })
}

export function deleteClient(id) {
  return request({
    url: 'gateway/platform/v1/oauthclient/' + id,
    method: 'delete'
  })
}

export function putClient(obj) {
  return request({
    url: 'gateway/platform/v1/oauthclient',
    method: 'put',
    data: obj
  })
}
