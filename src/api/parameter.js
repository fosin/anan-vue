import request from '@/utils/request'

// 获取数据分页列表
export function listParameterPage(page) {
  return request({
    url: '/platform/parameter/pageList',
    method: 'post',
    data: page
  })
}
// 获取所有数据列表
export function listParameter() {
  return request({
    url: '/platform/parameter/list',
    method: 'post'
  })
}

export function postParameter(obj) {
  return request({
    url: '/platform/parameter/',
    method: 'post',
    data: obj
  })
}

export function getParameter(id) {
  return request({
    url: '/platform/parameter/' + id,
    method: 'get'
  })
}

export function deleteParameter(id) {
  return request({
    url: '/platform/parameter/' + id,
    method: 'delete'
  })
}

export function putParameter(obj) {
  return request({
    url: '/platform/parameter',
    method: 'put',
    data: obj
  })
}

export function fetchUserParameterValue(key, defaultValue, description, method) {
  return fetchParameterValue(2, key, method, defaultValue, description)
}

export function fetchOrganizParameterValue(key, defaultValue, description, method) {
  return fetchParameterValue(1, key, method, defaultValue, description)
}

export function fetchParameterValue(type, key, method, defaultValue, description) {
  if (!type || !key) {
    return undefined
  }
  if (defaultValue && defaultValue) {
    return request({
      url: '/platform/parameter/value/' + type + '/' + key + '/' + defaultValue + '/' + description,
      method: method || 'post'
    })
  }
  return request({
    url: '/platform/parameter/value/' + type + '/' + key,
    method: method || 'post'
  })
}

export function applyParameter(id) {
  return request({
    url: '/platform/parameter/apply/' + id,
    method: 'post'
  })
}

export function applysParameter() {
  return request({
    url: '/platform/parameter/applys',
    method: 'post'
  })
}
