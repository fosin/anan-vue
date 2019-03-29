import request from '@/utils/request'

// 获取数据分页列表
export function listParameterPage(page) {
  return request({
    url: '/platform/v1/parameter/pageList',
    method: 'post',
    data: page
  })
}
// 获取所有数据列表
export function listParameter() {
  return request({
    url: '/platform/v1/parameter/list',
    method: 'post'
  })
}

export function postParameter(obj) {
  return request({
    url: '/platform/v1/parameter/',
    method: 'post',
    data: obj
  })
}

export function getParameter(id, method) {
  return request({
    url: '/platform/v1/parameter/' + id,
    method: method || 'post'
  })
}

export function deleteParameter(id) {
  return request({
    url: '/platform/v1/parameter/' + id,
    method: 'delete'
  })
}

export function putParameter(obj) {
  return request({
    url: '/platform/v1/parameter',
    method: 'put',
    data: obj
  })
}

export function fetchUserParameterValue(key, defaultValue, description, method) {
  const p = {
    type: 2,
    name: key,
    defaultValue: defaultValue,
    description: description
  }
  return fetchParameterValue(p, method)
}

export function fetchOrganizParameterValue(key, defaultValue, description, method) {
  const p = {
    type: 1,
    name: key,
    defaultValue: defaultValue,
    description: description
  }
  return fetchParameterValue(p, method)
}

export function fetchParameterValue(parameter, method) {
  return request({
    url: '/platform/v1/parameter/value',
    method: method || 'post',
    data: parameter
  })
}

export function applyParameter(id) {
  return request({
    url: '/platform/v1/parameter/apply/' + id,
    method: 'post'
  })
}

export function applysParameter() {
  return request({
    url: '/platform/v1/parameter/applys',
    method: 'post'
  })
}
