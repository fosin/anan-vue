import request, { getRequest, postRequest } from '@/utils/request'

export function treeAllChildOrganiz(pid) {
  return getRequest('gateway/platform/api/organiz/treeAllChild/' + pid)
}

export function listOrganizChild(pid) {
  return getRequest('gateway/platform/api/organiz/listChild/' + pid)
}
export function listOrganizAllChild(pid) {
  return getRequest('gateway/platform/api/organiz/listAllChild/' + pid)
}
export function listOrganiz(data = {}) {
  return postRequest('gateway/platform/api/organiz/list', data)
}
export function postOrganiz(obj) {
  return postRequest('gateway/platform/api/organiz/', obj)
}

export function getOrganiz(id, params) {
  return getRequest('gateway/platform/api/organiz/' + id, params)
}

export function deleteOrganiz(id) {
  return request({
    url: 'gateway/platform/api/organiz/' + id,
    method: 'delete'
  })
}

export function putOrganiz(obj) {
  return request({
    url: 'gateway/platform/api/organiz',
    method: 'put',
    data: obj
  })
}

// 获取机构的所有权限列表
export function listOrganizPermissions(id) {
  return getRequest('gateway/platform/api/organiz/permission/batch/' + id)
}

// 更新机构权限
export function putOrganizPermissions(id, permissions) {
  return request({
    url: 'gateway/platform/api/organiz/permission/batch/' + id,
    method: 'put',
    data: permissions
  })
}

export function getOrganizAuth(organizId, method) {
  return request({
    url: 'gateway/platform/api/organiz/auth/' + organizId,
    method: method || 'get'
  })
}
