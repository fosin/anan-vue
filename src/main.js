/* import 'babel-polyfill'*/
// global css
import '@/styles/index.scss'
import { getDicData, getDicValue } from '@/utils/dic'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Cookies from 'js-cookie'
// A modern alternative to CSS resets
import 'normalize.css/normalize.css'
import Vue from 'vue'
import App from './App'
// 权限判断指令
import permission from './directive/permission/index.js'
// 水波效果
import waves from './directive/waves/index.js'
import './errorLog'
// if (process.env.NODE_ENV === 'development') {
//   import('./mock') // simulation data
// }
import * as filters from './filters'
import './icons'
import i18n from './lang'
import router from './router'
import store from './store'
import './styles/element-variables.scss'
import './utils/permission'
import request, { deleteRequest, getRequest, postRequest, putRequest } from './utils/request'
import './views/vhr/utils/filter_utils'

Vue.prototype.getRequest = getRequest
Vue.prototype.postRequest = postRequest
Vue.prototype.deleteRequest = deleteRequest
Vue.prototype.putRequest = putRequest
Vue.prototype.allRequest = request
Vue.prototype.getDicData = getDicData
Vue.prototype.getDicValue = getDicValue

require('es6-promise').polyfill()
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
