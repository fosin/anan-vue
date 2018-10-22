import request from '@/utils/request'

export function listPermissions() {
  return request({
    url: '/platform/v1/permission/list',
    method: 'get'
  })
}
export function treePermissions(type) {
  return request({
    url: '/platform/v1/permission/tree/' + type,
    method: 'post'
  })
}
export function treeUserPermissions(userId, type) {
  return request({
    url: '/platform/v1/permission/userPermissionsTree/' + userId + '/' + type,
    method: 'get'
  })
}
export function listChildPermissions(pId) {
  return request({
    url: '/platform/v1/permission/listChild/' + pId,
    method: 'post'
  })
}
export function postPermission(obj) {
  return request({
    url: '/platform/v1/permission/',
    method: 'post',
    data: obj
  })
}

export function getPermission(id, method) {
  return request({
    url: '/platform/v1/permission/' + id,
    method: method || 'post'
  })
}

export function deletePermission(id) {
  return request({
    url: '/platform/v1/permission/' + id,
    method: 'delete'
  })
}

export function putPermission(obj) {
  return request({
    url: '/platform/v1/permission/',
    method: 'put',
    data: obj
  })
}
