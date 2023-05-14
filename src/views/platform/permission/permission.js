import request, { getRequest, postRequest } from '@/utils/request'

export function listChildPermissions(pid) {
  const data = {
    pid: pid,
    sortRules: [{
      sortName: 'sort',
      sortOrder: 'ASC'
    }]
  }
  return postRequest('gateway/platform/api/permission/listChild', data)
}

export function treePermissions(type) {
  return request({
    url: 'gateway/platform/api/permission/tree/' + type,
    method: 'post'
  })
}

export function treeUserPermissions(userId, type) {
  return request({
    url: 'gateway/platform/api/permission/userPermissionsTree/' + userId + '/' + type,
    method: 'get'
  })
}

export function postPermission(obj) {
  return request({
    url: 'gateway/platform/api/permission/',
    method: 'post',
    data: obj
  })
}

export function getPermission(id, params) {
  return getRequest('gateway/platform/api/permission/' + id, params)
}

export function deletePermission(id) {
  return request({
    url: 'gateway/platform/api/permission/' + id,
    method: 'delete'
  })
}

export function putPermission(obj) {
  return request({
    url: 'gateway/platform/api/permission/',
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
