import axios from 'axios'
import { MessageBox } from 'element-ui'
import store from '../store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style

NProgress.configure({ easing: 'ease', speed: 1000, showSpinner: false })// NProgress Configuration
// 全局设置方式
// 超时时间
// axios.defaults.timeout = 30000
// 跨域请求，允许保存cookie
// axios.defaults.withCredentials = true
// axios.defaults.headers.common['Authorization'] = 'Basic Y2RwOmRldg=='
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 30000, // request timeout
  withCredentials: true // 跨域请求，允许保存cookie
})
let reLogin = false

// request interceptor
service.interceptors.request.use(config => {
  NProgress.start() // start progress bar
  if (store.getters.token.access_token && store.getters.userInfo) {
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    config.headers['Authorization'] = WordCap(store.getters.token.token_type) + ' ' + store.getters.token.access_token
  }
  return config
}, error => {
  NProgress.done()
  return Promise.reject(getRealError(4, error))
})

// respone interceptor
service.interceptors.response.use(response => {
  NProgress.done()
  const data = response.data
  if (response.status !== 200) {
    return Promise.reject(getRealError(3, response))
  } else {
    if (data.code === 1) { // success
      return response
    } else { // failure
      return Promise.reject(getRealError(2, response))
    }
  }
}, error => {
  NProgress.done()
  // 尝试刷新access_toekn续用登录状态
  if (!reLogin && error.response && error.response.status && error.response.status === 401) {
    reLogin = true
    store.dispatch('RefreshAccessToken').then(() => {
      reLogin = false
    }).catch(() => {
      MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
        reLogin = false
      }).catch(() => {
        reLogin = false
      })
    })
  }
  return Promise.reject(getRealError(1, error))
})

/**
 * 首字母大写
 * @return {string}
 */
function WordCap(s) {
  return s.toLowerCase().replace(/\b([\w|']+)\b/g, function(word) {
    return word.replace(word.charAt(0), word.charAt(0).toUpperCase())
  })
}
function getRealError(from, error) {
  switch (from) {
    case 1:
      error.message = JSON.stringify(error.response.data)
      break
    case 2:
      error.message = '(' + error.data.code + ')' + error.data.msg
      break
    case 3:
      error.message = '(' + error.status + ')' + error.message || '(' + error.data.code + ')' + error.data.msg
      break
    case 4:
      error.message = error
      break
    default:
      error.message = error
  }
  return error
}
export default service
