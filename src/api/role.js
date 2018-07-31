import request from '@/utils/request'

// 获取角色分页列表
export function listRolePage(page) {
  return request({
    url: '/platform/role/pageList',
    method: 'post',
    data: page
  })
}

// 获取角色的所有权限列表
export function listRolePermissions(id) {
  return request({
    url: '/platform/role/permissions/' + id,
    method: 'post'
  })
}
// 更新角色权限
export function putRolePermissions(rolePermissions) {
  return request({
    url: '/platform/role/permissions',
    method: 'put',
    data: rolePermissions
  })
}
// 获取所有角色列表
export function listRole() {
  return request({
    url: '/platform/role/list',
    method: 'post'
  })
}

export function postRole(obj) {
  return request({
    url: '/platform/role/',
    method: 'post',
    data: obj
  })
}

export function getRole(id) {
  return request({
    url: '/platform/role/' + id,
    method: 'get'
  })
}

export function deleteRole(id) {
  return request({
    url: '/platform/role/' + id,
    method: 'delete'
  })
}

export function putRole(obj) {
  return request({
    url: '/platform/role',
    method: 'put',
    data: obj
  })
}
