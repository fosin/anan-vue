import request from '@/utils/request'

export function GetPermissions() {
  return request({
    url: '/platform/permission/list',
    method: 'get'
  })
}
export function fetchTree(type) {
  return request({
    url: '/platform/permission/listTree/' + type,
    method: 'get'
  })
}
export function fetchUserPermissionsTree(userId, type) {
  return request({
    url: '/platform/permission/userPermissionsTree/' + userId + '/' + type,
    method: 'get'
  })
}
export function fetchChild(pId) {
  return request({
    url: '/platform/permission/listChild/' + pId,
    method: 'post'
  })
}

export function postObj(obj) {
  return request({
    url: '/platform/permission/',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/platform/permission/' + id,
    method: 'get'
  })
}

export function deleteObj(id) {
  return request({
    url: '/platform/permission/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/platform/permission/',
    method: 'put',
    data: obj
  })
}
