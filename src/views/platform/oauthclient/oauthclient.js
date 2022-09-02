import request, { getRequest, postRequest } from '@/utils/request'

// 获取客户端授权数据分页列表
export function listClientPage(page) {
  return request({
    url: 'gateway/platform/api/oauthclient/paging',
    method: 'post',
    data: page
  })
}
// 获取所有客户端授权数据列表
export function listClient(data = {}) {
  return postRequest('gateway/platform/api/oauthclient/list', data)
}

export function postClient(obj) {
  return request({
    url: 'gateway/platform/api/oauthclient/',
    method: 'post',
    data: obj
  })
}

export function getClient(id, params) {
  return getRequest('gateway/platform/api/oauthclient/' + id, params)
}

export function deleteClient(id) {
  return request({
    url: 'gateway/platform/api/oauthclient/' + id,
    method: 'delete'
  })
}

export function putClient(obj) {
  return request({
    url: 'gateway/platform/api/oauthclient',
    method: 'put',
    data: obj
  })
}
