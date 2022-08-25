import request, { postRequest } from '@/utils/request'

// 获取数据分页列表
export function listParameterPage(page) {
  return request({
    url: 'gateway/platform/api/parameter/paging',
    method: 'post',
    data: page
  })
}
// 获取所有数据列表
export function listParameter(data = {}) {
  return postRequest('gateway/platform/api/parameter/list', data)
}

export function postParameter(obj) {
  return request({
    url: 'gateway/platform/api/parameter/',
    method: 'post',
    data: obj
  })
}

export function getParameter(id, method) {
  return request({
    url: 'gateway/platform/api/parameter/' + id,
    method: method || 'post'
  })
}

export function deleteParameter(id) {
  return request({
    url: 'gateway/platform/api/parameter/' + id,
    method: 'delete'
  })
}

export function putParameter(obj) {
  return request({
    url: 'gateway/platform/api/parameter',
    method: 'put',
    data: obj
  })
}

export function applyParameter(id) {
  return request({
    url: 'gateway/platform/api/parameter/apply/' + id,
    method: 'post'
  })
}

export function applysParameter() {
  return postRequest('gateway/platform/api/parameter/applys')
}
