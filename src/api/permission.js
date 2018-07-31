import request from '@/utils/request'

export function listPermissions() {
  return request({
    url: '/platform/permission/list',
    method: 'get'
  })
}
export function treePermissions(type) {
  return request({
    url: '/platform/permission/tree/' + type,
    method: 'post'
  })
}
export function treeUserPermissions(userId, type) {
  return request({
    url: '/platform/permission/userPermissionsTree/' + userId + '/' + type,
    method: 'get'
  })
}
export function listChildPermissions(pId) {
  return request({
    url: '/platform/permission/listChild/' + pId,
    method: 'post'
  })
}
export function postPermission(obj) {
  return request({
    url: '/platform/permission/',
    method: 'post',
    data: obj
  })
}

export function getPermission(id) {
  return request({
    url: '/platform/permission/' + id,
    method: 'get'
  })
}

export function deletePermission(id) {
  return request({
    url: '/platform/permission/' + id,
    method: 'delete'
  })
}

export function putPermission(obj) {
  return request({
    url: '/platform/permission/',
    method: 'put',
    data: obj
  })
}
