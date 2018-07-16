import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style

NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })// NProgress Configuration
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

// request interceptor
service.interceptors.request.use(config => {
  NProgress.start() // start progress bar
  if (store.getters.token.access_token) {
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    config.headers['Authorization'] = WordCap(store.getters.token.token_type) + ' ' + store.getters.token.access_token
  }
  return config
}, error => {
  NProgress.done()
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => {
    // debugger
    NProgress.done()
    const data = response.data
    if (response.status !== 200) {
      Message({
        message: 'status:' + response.status + ' message:' + response.message || 'code:' + data.code + ' msg:' + data.msg,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject('error')
    } else {
      if (data.code === 1) { // success
        return response
      } else if (data.code === 100) { // no_action
        Message({
          message: 'code:' + data.code + ' msg:' + data.msg,
          type: 'warning',
          duration: 5 * 1000
        })
        return Promise.reject('error')
      } else { // failure
        Message({
          message: 'code:' + data.code + ' msg:' + data.msg,
          type: 'error',
          duration: 5 * 1000
        })
        // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
        if (data.code === 50008 || data.code === 50012 || data.code === 50014) {
          MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            store.dispatch('FedLogOut').then(() => {
              location.reload() // 为了重新实例化vue-router对象 避免bug
            })
          })
        }
        return Promise.reject('error')
      }
    }
  },
  error => {
    NProgress.done()
    if (error.response && error.response.data) {
      const data = error.response.data
      Message({
        message: 'error:' + data.error + ' description:' + data.error_description,
        type: 'error',
        duration: 5 * 1000
      })
      debugger
      if (error.response.status && error.response.status >= 400 && error.response.status < 500) {
        store.dispatch('RefreshAccessToken').then(() => {
        })
      }
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
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
export default service
