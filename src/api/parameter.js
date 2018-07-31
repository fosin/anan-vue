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

// 以下是参数类型的后台方法
// 获取数据分页列表
export function listParameterTypePage(page) {
  return request({
    url: '/platform/parameterType/pageList',
    method: 'post',
    data: page
  })
}
// 获取所有数据列表
export function listParameterType() {
  return request({
    url: '/platform/parameterType/list',
    method: 'post'
  })
}

export function postParameterType(obj) {
  return request({
    url: '/platform/parameterType/',
    method: 'post',
    data: obj
  })
}

export function getParameterType(id) {
  return request({
    url: '/platform/parameterType/' + id,
    method: 'get'
  })
}

export function deleteParameterType(id) {
  return request({
    url: '/platform/parameterType/' + id,
    method: 'delete'
  })
}

export function putParameterType(obj) {
  return request({
    url: '/platform/parameterType',
    method: 'put',
    data: obj
  })
}
