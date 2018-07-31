import request from '@/utils/request'

export function listUserPage(page) {
  return request({
    url: '/platform/user/pageList',
    method: 'post',
    data: page
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
