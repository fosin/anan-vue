import request from '@/utils/request'

export function treeOrganiz(topId) {
  return request({
    url: '/platform/v1/organiz/tree/' + topId,
    method: 'post'
  })
}
export function listOrganizChild(pId) {
  return request({
    url: '/platform/v1/organiz/listChild/' + pId,
    method: 'post'
  })
}
export function listOrganizAllChild(pId) {
  return request({
    url: '/platform/v1/organiz/listAllChild/' + pId,
    method: 'post'
  })
}
export function listOrganiz() {
  return request({
    url: '/platform/v1/organiz/list',
    method: 'post'
  })
}
export function postOrganiz(obj) {
  return request({
    url: '/platform/v1/organiz/',
    method: 'post',
    data: obj
  })
}

export function getOrganiz(id, method) {
  return request({
    url: '/platform/v1/organiz/' + id,
    method: method || 'post'
  })
}

export function deleteOrganiz(id) {
  return request({
    url: '/platform/v1/organiz/' + id,
    method: 'delete'
  })
}

export function putOrganiz(obj) {
  return request({
    url: '/platform/v1/organiz',
    method: 'put',
    data: obj
  })
}

// 获取机构的所有权限列表
export function listOrganizPermissions(id) {
  return request({
    url: '/platform/v1/organiz/permissions/' + id,
    method: 'post'
  })
}

// 更新机构权限
export function putOrganizPermissions(id, permissions) {
  return request({
    url: '/platform/v1/organiz/permissions/' + id,
    method: 'put',
    data: permissions
  })
}

export function getOrganizAuth(organizId, method) {
  return request({
    url: '/platform/v1/organiz/auth/' + organizId,
    method: method || 'post'
  })
}
