import request, { getRequest, postRequest } from '@/utils/request'

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

export function getParameter(id, params) {
  return getRequest('gateway/platform/api/parameter/' + id, params)
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
  return getRequest('gateway/platform/api/parameter/apply/' + id)
}

export function applysParameter() {
  return getRequest('gateway/platform/api/parameter/applys')
}
