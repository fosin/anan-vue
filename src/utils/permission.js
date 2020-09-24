import store from '../store'
import router from '../router'
import { Notification } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false })// NProgress Configuration

const whiteList = ['/login', '/authredirect']// no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  // set page title
  document.title = getPageTitle(to.meta.title)

  if (store.getters.ananToken.access_token) { // determine if there has token
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      const userId = store.getters.ananUserInfo.id
      if (userId === undefined || userId < 1) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetUserInfo').then(res => { // 拉取user_info
          store.dispatch('GenerateRoutes', store.getters.ananPermissionTree).then(() => { // 根据permissions权限生成可访问的路由表
            // const addrouters = filterPermission(store.getters.ananAddRouters)
            router.addRoutes(store.getters.ananAddRouters) // 动态添加可访问路由表
            // debugger
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          }).catch((reason) => {
            Notification.error(reason.message)
            store.dispatch('FedLogOut').then(() => {
              next({ path: '/' })
            }).catch((reason) => {
              Notification.error(reason.message)
            })
          })
        }).catch((reason) => {
          Notification.error(reason.message)
          store.dispatch('FedLogOut').then(() => {
            next({ path: '/' })
          }).catch((reason) => {
            Notification.error(reason.message)
          })
        })
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (hasPermission(store.getters.ananPermissions, to.meta.permisson)) {
          next()//
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true }})
        }
        // 可删 ↑
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

/**
 *
 * @param permissions
 * @param metaPermisson
 * @returns {*}
 */
function hasPermission(permissions, metaPermisson) {
  if (!metaPermisson) return true
  return permissions[metaPermisson] || false
}

// function filterPermission(routers) {
//   const aRouter = []
//   if (!routers) {
//     return aRouter
//   }
//   routers.forEach(router => {
//     router.children = filterPermission(router.children)
//     if (router.meta && router.meta.type && router.meta.type !== 2) {
//       aRouter.push(router)
//     }
//   })
//   return aRouter
// }
/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
/* function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value

    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role)
    })

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}*/
