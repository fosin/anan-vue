import request from '@/utils/request'
import { encrypt } from '@/utils/aesUtil'
import CryptoJS from 'crypto-js'

export function getAccessToken(loginForm) {
  const username = loginForm.username.trim()
  const password = loginForm.password.trim()
  const rememberMe = loginForm.rememberMe
  const grant_type = 'password'
  const scope = 'webApp'
  const randomStr = ''
  const code = ''

  const iv = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex)
  const salt = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex)
  const iterationCount = 1000
  const keySize = 128
  const passPhrase = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex)
  const cipheru = encrypt(keySize, iterationCount, salt, iv, passPhrase, username)
  const cipherp = encrypt(keySize, iterationCount, salt, iv, passPhrase, password)
  return request({
    url: '/auth/oauth/token',
    method: 'post',
    headers: {
      'Authorization': 'Basic d2ViQXBwOiQyYSQxMCR4S2ZEY2JPYzFJYmgwVlJXUklzUTRPM1ZrOUp4YkYvMzBXZHouZTJoQk5BQVFLUjVVemlJSw=='
    },
    params: { a: cipheru, b: cipherp, c: passPhrase, d: iv, e: salt, f: keySize, g: iterationCount, randomStr, code, grant_type, scope, 'remember-me': rememberMe }
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
      'Authorization': 'Basic d2ViQXBwOiQyYSQxMCR4S2ZEY2JPYzFJYmgwVlJXUklzUTRPM1ZrOUp4YkYvMzBXZHouZTJoQk5BQVFLUjVVemlJSw=='
    },
    params: { refresh_token, grant_type, scope }
  })
}

export function logout() {
  return request({
    url: '/auth/oauth/removeToken',
    method: 'post'
  })
}

export function getUserInfo() {
  return request({
    url: '/auth/oauth/principal',
    method: 'get'
  })
}

