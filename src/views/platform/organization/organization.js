import request, { getRequest, postRequest } from '@/utils/request'

export function treeAllChildOrganiz(pid) {
  return getRequest('gateway/platform/v1/organiz/treeAllChild/' + pid)
}

export function listOrganizChild(pid) {
  return getRequest('gateway/platform/v1/organiz/listChild/' + pid)
}
export function listOrganizAllChild(pid) {
  return getRequest('gateway/platform/v1/organiz/listAllChild/' + pid)
}
export function listOrganiz(data = {}) {
  return postRequest('gateway/platform/v1/organiz/list', data)
}
export function postOrganiz(obj) {
  return postRequest('gateway/platform/v1/organiz/', obj)
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
  return postRequest('gateway/platform/v1/organiz/permissions/' + id)
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
