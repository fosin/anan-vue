import { postRequest } from '@/utils/request'

export function login(data) {
  return postRequest('gateway/exam/api/sys/user/login', data)
}

export function getInfo(token) {
  return postRequest('gateway/exam/api/sys/user/info?token=' + token)
}

export function logout() {
  return postRequest('gateway/exam/api/sys/user/logout', {})
}

export function reg(data) {
  return postRequest('gateway/exam/api/sys/user/reg', data)
}
