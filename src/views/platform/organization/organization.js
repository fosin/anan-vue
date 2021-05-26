import request, { postRequest } from '@/utils/request'

export function treeAllChildOrganiz(id) {
  return request({
    url: 'gateway/platform/v1/organiz/treeAllChild/' + id,
    method: 'post',
    data: {}
  })
}

export function listOrganizChild(pid) {
  return request({
    url: 'gateway/platform/v1/organiz/listChild/' + pid,
    method: 'post'
  })
}
export function listOrganizAllChild(pid) {
  return request({
    url: 'gateway/platform/v1/organiz/listAllChild/' + pid,
    method: 'post'
  })
}
export function listOrganiz() {
  return postRequest('gateway/platform/v1/organiz/list')
}
export function postOrganiz(obj) {
  return request({
    url: 'gateway/platform/v1/organiz/',
    method: 'post',
    data: obj
  })
}

export function getOrganiz(id, method) {
  return request({
    url: 'gateway/platform/v1/organiz/' + id,
    method: method || 'post'
  })
}

export function deleteOrganiz(id) {
  return request({
    url: 'gateway/platform/v1/organiz/' + id,
    method: 'delete'
  })
}

export function putOrganiz(obj) {
  return request({
    url: 'gateway/platform/v1/organiz',
    method: 'put',
    data: obj
  })
}

// 获取机构的所有权限列表
export function listOrganizPermissions(id) {
  return request({
    url: 'gateway/platform/v1/organiz/permissions/' + id,
    method: 'post'
  })
}

// 更新机构权限
export function putOrganizPermissions(id, permissions) {
  return request({
    url: 'gateway/platform/v1/organiz/permissions/' + id,
    method: 'put',
    data: permissions
  })
}

export function getOrganizAuth(organizId, method) {
  return request({
    url: 'gateway/platform/v1/organiz/auth/' + organizId,
    method: method || 'post'
  })
}
