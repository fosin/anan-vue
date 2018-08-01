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
