import axios from 'axios'
import { MessageBox, Notification } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '../store'
// import { cacheAdapterEnhancer } from '@/utils/cache'

// progress bar style

NProgress.configure({ showSpinner: false })// NProgress Configuration
// 全局设置方式
// 超时时间
// axios.defaults.timeout = 30000
// 跨域请求，允许保存cookie
// axios.defaults.withCredentials = true
// axios.defaults.headers.common['Authorization'] = 'Basic Y2RwOmRldg=='
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// create an axios instance
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api的base_url
  timeout: 30000, // request timeout
  // adapter: cacheAdapterEnhancer(axios.defaults.adapter, {
  //   enabledByDefault: false,
  //   maxAge: 5000
  // }),
  withCredentials: true // 跨域请求，允许保存cookie
})
let reLogin = false
let errorStatus = false

// request interceptor
request.interceptors.request.use(config => {
  NProgress.start() // start progress bar
  if (errorStatus) {
    return Promise.reject('系统崩溃了，请重新登陆系统，再尝试！')
  }
  if (store.getters.ananToken.access_token && store.getters.ananUserInfo) {
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    config.headers['Authorization'] = wordCap(store.getters.ananToken.token_type) + ' ' + store.getters.ananToken.access_token
  }
  // 如果请求没有附加API版本号，则附加默认版本号
  const params = config.params
  if (!params || (!params['version'] && config.url.indexOf('version') < 1)) {
    if (!params) config.params = {}
    config.params['version'] = '2018-10-17'
  }
  return config
}, error => {
  NProgress.done()
  return Promise.reject(getRealError(4, error))
})

// respone interceptor
request.interceptors.response.use(response => {
  NProgress.done()
  // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
  // 否则的话抛出错误
  const data = response.data
  if (data && data.code > 8) {
    return Promise.reject(getRealError(2, response))
  }
  return Promise.resolve(response)
}, error => {
  NProgress.done()
  // 我们可以在这里对异常状态作统一处理
  // 尝试刷新access_toekn续用登录状态
  const status = error.response.status
  switch (status) {
    case 401:
      directReLogin()
      break
    case 403:
      store.dispatch('RefreshAccessToken').then(() => {
        reLogin = false
        return Promise.resolve()
      }).catch(() => {
        directReLogin()
        reLogin = false
      })
      break
    default:
      break
  }
  return Promise.reject(getRealError(1, error))
})
/**
 * 重新登陆
 */
function directReLogin() {
  if (!reLogin) {
    reLogin = true
    MessageBox.confirm('无效的登陆信息，取消继续留在该页面或者重新登录', '确定登出', {
      confirmButtonText: '重新登录',
      cancelButtonText: '取消',
      type: 'error'
    }).then(() => {
      store.dispatch('FedLogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }).catch(() => {
      reLogin = false
      errorStatus = true
    })
  }
}

/**
 * 首字母大写
 * @return {string}
 */
function wordCap(s) {
  return s.toLowerCase().replace(/\b([\w|']+)\b/g, function(word) {
    return word.replace(word.charAt(0), word.charAt(0).toUpperCase())
  })
}
function getRealError(from, error) {
  switch (from) {
    case 1:
      if (error.response && error.response.data.data) {
        error.message = error.response.data.data
      }
      break
    case 2:
      error.message = error.data.msg + '(错误号：' + error.data.code + ')'
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
export default request

export const postRequest = (url, data, params) => {
  return request({ url: url, data: data, params: params, method: 'post' })
}

export const putRequest = (url, data, params) => {
  return request({ url: url, data: data, params: params, method: 'put' })
}

export const deleteRequest = (url, data, params) => {
  return request({ url: url, data: data, params: params, method: 'delete' })
}

export const getRequest = (url, params) => {
  return request({ url: url, params: params, method: 'get' })
}

/**
 * 上传文件（FormData数据格式）
 * @param {string} url 请求地址
 * @param {formData} formData formdata
 * @param {boolean} notify 失败后是否自动提示
 * @returns promise
 */
export const uploadFormRequest = (url, formData) => {
  return request({ url: url,
    data: formData,
    method: 'post',
    timeout: 120000,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

/**
 * 上传文件
 * @param url
 * @param data
 */
export function uploadFileRequest(url, file) {
  const formData = new FormData()
  formData.append('file', file)

  return uploadFormRequest(url, formData)
}

export function downloadFileRequest(url, data) {
  return request({ url: url,
    data: data,
    method: 'post',
    timeout: 120000,
    responseType: 'blob'
  })
}

/**
 * 导出Excel文件
 * @param url 请求地址
 * @param data 请求数据
 */
export function exportExcelRequest(url, data) {
  downloadFileRequest(url, data).then(res => {
    // 文件下载
    const blob = new Blob([res.data.data], {
      type: 'application/vnd.ms-excel'
    })

    // 获得文件名称
    const fileName = '导出的数据.xlsx'
    let link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', fileName)
    link.click()
    link = null
    MessageBox.success('导出成功!')
  }).catch(reason => {
    Notification.error({
      title: '导出Excel文件失败',
      message: process.env.NODE_ENV === 'development' ? url + ':' + reason.message : reason.message,
      type: 'error',
      duration: 5000
    })
  })
}
