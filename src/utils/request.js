import axios from 'axios'
import { MessageBox } from 'element-ui'
import store from '../store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'

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
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api的base_url
  timeout: 30000, // request timeout
  withCredentials: true // 跨域请求，允许保存cookie
})
let reLogin = false

// request interceptor
service.interceptors.request.use(config => {
  NProgress.start() // start progress bar
  if (store.getters.ananToken.access_token && store.getters.ananUserInfo) {
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    config.headers['Authorization'] = WordCap(store.getters.ananToken.token_type) + ' ' + store.getters.ananToken.access_token
  }
  return config
}, error => {
  NProgress.done()
  return Promise.reject(getRealError(4, error))
})

// respone interceptor
service.interceptors.response.use(response => {
  NProgress.done()
  return response
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
      if (error.response && error.response.data) {
        error.message = error.response.data
      }
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

export const allRequest = (url, method, data) => {
  if (data) {
    return service({
      method: method || 'post',
      url: url,
      data: data
    })
  }
  return service({
    method: method || 'post',
    url: url
  })
}

export const postRequest = (url, params) => {
  if (params) {
    return service({
      method: 'post',
      url: url,
      data: params
    })
  }
  return service({
    method: 'post',
    url: url
  })
}

export const uploadFileRequest = (url, params) => {
  return service({
    method: 'post',
    url: url,
    data: params,
    timeout: 120000,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 上传
 * @param url
 * @param data
 */
export function upload(url, file) {
  const formData = new FormData()
  formData.append('file', file)

  return new Promise((resolve, reject) => {
    service({
      url: url,
      method: 'post',
      data: formData,
      timeout: 120000
    }).then(response => {
      console.log(response)
      resolve(response.data)
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 下载
 * @param url
 * @param data
 */
export function download(url, data) {
  return new Promise((resolve, reject) => {
    service({
      url: url,
      method: 'get',
      data: data,
      timeout: 120000,
      responseType: 'blob'
    }).then(res => {
      // 文件下载
      debugger
      const blob = new Blob([res], {
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
    }).catch(err => {
      reject(err)
    })
  })
}

export const putRequest = (url, params) => {
  return service({
    method: 'put',
    url: url,
    data: params
  })
}

export const deleteRequest = (url) => {
  return service({
    method: 'delete',
    url: url
  })
}

export const getRequest = (url) => {
  return service({
    method: 'get',
    url: url
  })
}
