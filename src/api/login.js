import request from '@/utils/request'

export function loginByUsername(username, password) {
  const grant_type = 'password'
  const scope = 'all'
  const randomStr = ''
  const code = ''
  return request({
    url: '/auth/oauth/token',
    // headers: {
    //   'Authorization': 'Basic Y2RwOmRldg=='
    // },
    method: 'post',
    params: { username, password, randomStr, code, grant_type, scope }
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

