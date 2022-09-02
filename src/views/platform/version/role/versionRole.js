import request, { getRequest, postRequest } from '@/utils/request'

// 获取版本角色分页列表
export function listVersionRolePage(page) {
  return request({
    url: 'gateway/platform/api/version/role/paging',
    method: 'post',
    data: page
  })
}

// 根据机构ID获取该机构及下级机构的版本角色分页列表
export function listVersionRolePageByVersionId(page, versionId) {
  return request({
    url: 'gateway/platform/api/version/role/paging/versionId/' + versionId,
    method: 'post',
    data: page
  })
}

// 获取版本角色的所有权限列表
export function listVersionRolePermissions(id) {
  return request({
    url: 'gateway/platform/api/version/role/permissions/' + id,
    method: 'get'
  })
}

// 更新版本角色权限
export function putVersionRolePermissions(id, rolePermissions) {
  return request({
    url: 'gateway/platform/api/version/role/permissions/' + id,
    method: 'put',
    data: rolePermissions
  })
}
// 获取所有版本角色列表
export function listVersionRole(data = {}) {
  return postRequest('gateway/platform/api/version/role/list', data)
}

export function postVersionRole(obj) {
  return request({
    url: 'gateway/platform/api/version/role/',
    method: 'post',
    data: obj
  })
}

export function getVersionRole(id, params) {
  return getRequest('gateway/platform/api/version/role/' + id, params)
}

export function deleteVersionRole(id) {
  return request({
    url: 'gateway/platform/api/version/role/' + id,
    method: 'delete'
  })
}

export function putVersionRole(obj) {
  return request({
    url: 'gateway/platform/api/version/role',
    method: 'put',
    data: obj
  })
}
