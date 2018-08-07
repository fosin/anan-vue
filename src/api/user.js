import request from '@/utils/request'

// 获取用户的所有角色列表
export function listUserRoles(id) {
  return request({
    url: '/platform/user/roles/' + id,
    method: 'post'
  })
}

// 获取用户的所有未拥有的角色列表
export function listOtherRoles(id) {
  return request({
    url: '/platform/user/otherRoles/' + id,
    method: 'post'
  })
}

// 更新用户的角色
export function putUserRoles(id, obj) {
  return request({
    url: '/platform/user/roles/' + id,
    method: 'put',
    data: obj
  })
}

// 获取用户的所有权限列表
export function listUserPermissions(id) {
  return request({
    url: '/platform/user/permissions/' + id,
    method: 'post'
  })
}

// 更新用户权限
export function putUserPermissions(id, permissions) {
  return request({
    url: '/platform/user/permissions/' + id,
    method: 'put',
    data: permissions
  })
}

export function listUserPage(page) {
  return request({
    url: '/platform/user/pageList',
    method: 'post',
    data: page
  })
}

export function listUser() {
  return request({
    url: '/platform/user/list',
    method: 'post'
  })
}

export function resetPassword(id) {
  return request({
    url: '/platform/user/resetPassword/' + id,
    method: 'post'
  })
}
export function changePassword(passObj) {
  return request({
    url: '/platform/user/changePassword',
    method: 'post',
    params: passObj
  })
}
export function postUser(obj) {
  return request({
    url: '/platform/user/',
    method: 'post',
    data: obj
  })
}

export function postUserRoles(obj) {
  return request({
    url: '/platform/user/',
    method: 'post',
    data: obj
  })
}

export function getUser(id) {
  return request({
    url: '/platform/user/' + id,
    method: 'get'
  })
}

export function deleteUser(id) {
  return request({
    url: '/platform/user/' + id,
    method: 'delete'
  })
}

export function putUser(obj) {
  return request({
    url: '/platform/user',
    method: 'put',
    data: obj
  })
}
