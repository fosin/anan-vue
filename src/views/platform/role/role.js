import request, { getRequest, postRequest } from '@/utils/request'

// 获取角色的已拥有用户列表
export function listRoleUsers(id) {
  return request({
    url: 'gateway/platform/api/role/user/batch/' + id,
    method: 'get'
  })
}

// 获取角色的所有未拥有的用户列表
export function listOtherUsers(id) {
  return request({
    url: 'gateway/platform/api/role/user/other/' + id,
    method: 'get'
  })
}

// 更新角色的用户
export function putRoleUsers(id, obj) {
  return request({
    url: 'gateway/platform/api/role/user/batch/' + id,
    method: 'put',
    data: obj
  })
}

// 获取角色分页列表
export function listRolePage(page) {
  return request({
    url: 'gateway/platform/api/role/paging',
    method: 'post',
    data: page
  })
}

// 获取角色的所有权限列表
export function listRolePermissions(id) {
  return request({
    url: 'gateway/platform/api/role/permission/batch/' + id,
    method: 'get'
  })
}

// 更新角色权限
export function putRolePermissions(id, rolePermissions) {
  return request({
    url: 'gateway/platform/api/role/permission/batch/' + id,
    method: 'put',
    data: rolePermissions
  })
}
// 获取所有角色列表
export function listRole(data = {}) {
  return postRequest('gateway/platform/api/role/list', data)
}

// 根据机构ID查询该机构及子机构的所有角色
export function listOrganizRole(organizId) {
  return request({
    url: 'gateway/platform/api/role/list/organizId/' + organizId,
    method: 'get'
  })
}
export function postRole(obj) {
  return request({
    url: 'gateway/platform/api/role/',
    method: 'post',
    data: obj
  })
}

export function getRole(id, params) {
  return getRequest('gateway/platform/api/role/' + id, params)
}

export function deleteRole(id) {
  return request({
    url: 'gateway/platform/api/role/' + id,
    method: 'delete'
  })
}

export function putRole(obj) {
  return request({
    url: 'gateway/platform/api/role',
    method: 'put',
    data: obj
  })
}
