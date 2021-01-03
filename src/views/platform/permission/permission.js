import request from '@/utils/request'

export function listPermissions() {
  return request({
    url: 'gateway/platform/v1/permission/list',
    method: 'get'
  })
}
export function treePermissions(type) {
  return request({
    url: 'gateway/platform/v1/permission/tree/' + type,
    method: 'post'
  })
}
export function treeUserPermissions(userId, type) {
  return request({
    url: 'gateway/platform/v1/permission/userPermissionsTree/' + userId + '/' + type,
    method: 'get'
  })
}
export function listChildPermissions(pid) {
  return request({
    url: 'gateway/platform/v1/permission/listChild/' + pid,
    method: 'post'
  })
}
export function postPermission(obj) {
  return request({
    url: 'gateway/platform/v1/permission/',
    method: 'post',
    data: obj
  })
}

export function getPermission(id, method) {
  return request({
    url: 'gateway/platform/v1/permission/' + id,
    method: method || 'post'
  })
}

export function deletePermission(id) {
  return request({
    url: 'gateway/platform/v1/permission/' + id,
    method: 'delete'
  })
}

export function putPermission(obj) {
  return request({
    url: 'gateway/platform/v1/permission/',
    method: 'put',
    data: obj
  })
}

export function getPermissionVname(validServices, typeOptions, permission) {
  let vname = ''
  // 如果是目录菜单，则附加服务名称
  if (permission.type === 3 || permission.level === 1) {
    validServices.forEach((value, index) => {
      if (value.id === permission.serviceId) {
        vname = '[' + value.name + ']-'
      }
    })
  }
  // 附加权限名称
  vname = vname + '(' + permission.name + ')-'
  // 附加类型名称
  if (typeOptions && typeOptions.length > 0) {
    typeOptions.forEach((typeOption, index) => {
      if (typeOption.name === permission.type) {
        vname = vname + '{' + typeOption.value + '}'
      }
    })
  }
  // 附加权限唯一ID
  if (permission.type === 5) {
    vname = vname + '-' + permission.id
  }
  return vname
}
