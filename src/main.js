/* import 'babel-polyfill'*/
import Vue from 'vue'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css
import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog'// error log
import './utils/permission' // permission control
import { getRequest, postRequest, deleteRequest, putRequest } from './utils/request'
// if (process.env.NODE_ENV === 'development') {
//   import('./mock') // simulation data
// }
import * as filters from './filters' // global filters
import permission from './directive/permission/index.js' // 权限判断指令
import dictionary from './utils/dictionary' // 字典服务
import parameter from './utils/parameter' // 个性化参数服务
import waves from './directive/waves/index.js' // 水波效果
import './views/vhr/utils/filter_utils'

Vue.prototype.getRequest = getRequest
Vue.prototype.postRequest = postRequest
Vue.prototype.deleteRequest = deleteRequest
Vue.prototype.putRequest = putRequest

require('es6-promise').polyfill()
Vue.use(dictionary)
Vue.use(parameter)
Vue.use(permission)
Vue.use(waves)

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
