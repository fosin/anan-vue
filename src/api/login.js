import request from '@/utils/request'

export function getAccessToken(loginForm) {
  const username = loginForm.username.trim()
  const password = loginForm.password.trim()
  const rememberMe = loginForm.rememberMe
  const grant_type = 'password'
  const scope = 'webApp'
  const randomStr = ''
  const code = ''
  return request({
    url: '/auth/oauth/token',
    method: 'post',
    headers: {
      'Authorization': 'Basic d2ViQXBwOnQ0ZXQyMzQ2YjJmZmUzNDYyMzQ1NjMy'
    },
    params: { username, password, randomStr, code, grant_type, scope, 'remember-me': rememberMe }
  })
}

export function refreshAccessToken(refresh_token) {
  const grant_type = 'refresh_token'
  const scope = 'webApp'
  if (!refresh_token) {
    return {}
  }
  return request({
    url: '/auth/oauth/token',
    method: 'post',
    headers: {
      'Authorization': 'Basic d2ViQXBwOnQ0ZXQyMzQ2YjJmZmUzNDYyMzQ1NjMy'
    },
    params: { refresh_token, grant_type, scope }
  })
}

export function logout(access_token) {
  return request({
    url: '/auth/oauth/removeToken',
    method: 'post',
    params: { access_token }
  })
}

export function getUserInfo(access_token) {
  if (!access_token) {
    return {}
  }
  return request({
    url: '/auth/auth/principal',
    method: 'get',
    params: { access_token }
  })
}

