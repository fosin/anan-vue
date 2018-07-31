import request from '@/utils/request'

export function treeOrganiz() {
  return request({
    url: '/platform/organiz/tree',
    method: 'post'
  })
}
export function listOrganizChild(pId) {
  return request({
    url: '/platform/organiz/listChild/' + pId,
    method: 'post'
  })
}
export function listOrganiz() {
  return request({
    url: '/platform/organiz/list',
    method: 'post'
  })
}
export function postOrganiz(obj) {
  return request({
    url: '/platform/organiz/',
    method: 'post',
    data: obj
  })
}

export function getOrganiz(id) {
  return request({
    url: '/platform/organiz/' + id,
    method: 'get'
  })
}

export function deleteOrganiz(id) {
  return request({
    url: '/platform/organiz/' + id,
    method: 'delete'
  })
}

export function putOrganiz(obj) {
  return request({
    url: '/platform/organiz',
    method: 'put',
    data: obj
  })
}
