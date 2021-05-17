import request, { postRequest } from '@/utils/request'
import { encrypt } from '@/utils/aesUtil'
import CryptoJS from 'crypto-js'

// 获取用户的所有角色列表
export function listUserRoles(id) {
  return request({
    url: 'gateway/platform/v1/user/roles/' + id,
    method: 'post'
  })
}

// 获取用户的所有未拥有的角色列表
export function listOtherRoles(id) {
  return request({
    url: 'gateway/platform/v1/user/otherRoles/' + id,
    method: 'post'
  })
}

// 更新用户的角色
export function putUserRoles(id, obj) {
  return request({
    url: 'gateway/platform/v1/user/roles/' + id,
    method: 'put',
    data: obj
  })
}

// 获取用户的所有权限列表
export function listUserPermissions(id) {
  return request({
    url: 'gateway/platform/v1/user/permissions/' + id,
    method: 'post'
  })
}

// 更新用户权限
export function putUserPermissions(id, permissions) {
  return request({
    url: 'gateway/platform/v1/user/permissions/' + id,
    method: 'put',
    data: permissions
  })
}

export function listUserPage(page) {
  return request({
    url: 'gateway/platform/v1/user/paging',
    method: 'post',
    data: page
  })
}

export function listUser() {
  return postRequest('gateway/platform/v1/user/list')
}

// 根据机构ID查询该机构及子机构的所有用户
export function listOrganizUser(organizId, status) {
  if (status === null || status === undefined) {
    status = -1
  }
  return request({
    url: 'gateway/platform/v1/user/childList/organizId/' + organizId + '/' + status,
    method: 'post'
  })
}

export function resetPassword(id) {
  return request({
    url: 'gateway/platform/v1/user/resetPassword/' + id,
    method: 'post'
  })
}
export function changePassword(passObj) {
  const iv = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex)
  const salt = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex)
  const iterationCount = 999
  const keySize = 128
  const passPhrase = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex)
  const cipherPassword = encrypt(keySize, iterationCount, salt, iv, passPhrase, passObj.password)
  const cipherConfirmPassword1 = encrypt(keySize, iterationCount, salt, iv, passPhrase, passObj.confirmPassword1)
  const cipherConfirmPassword2 = encrypt(keySize, iterationCount, salt, iv, passPhrase, passObj.confirmPassword2)
  const cipher = {
    a: cipherPassword, b: cipherConfirmPassword1, c: passPhrase, d: iv, e: salt, f: keySize, g: iterationCount,
    h: cipherConfirmPassword2,
    i: passObj.id
  }
  return request({
    url: 'gateway/platform/v1/user/changePassword',
    method: 'post',
    params: cipher
  })
}
export function postUser(obj) {
  return request({
    url: 'gateway/platform/v1/user/',
    method: 'post',
    data: obj
  })
}

export function postUserRoles(obj) {
  return request({
    url: 'gateway/platform/v1/user/',
    method: 'post',
    data: obj
  })
}

export function getUser(id, method) {
  return request({
    url: 'gateway/platform/v1/user/' + id,
    method: method || 'post'
  })
}

export function deleteUser(id) {
  return request({
    url: 'gateway/platform/v1/user/' + id,
    method: 'delete'
  })
}

export function putUser(obj) {
  return request({
    url: 'gateway/platform/v1/user',
    method: 'put',
    data: obj
  })
}
