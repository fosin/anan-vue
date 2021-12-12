import Page404 from '@/views/platform/errorPage/404'
/* Layout */
import Layout from '@/views/platform/layout/Layout'
import { Notification } from 'element-ui'
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/**
 //当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 hidden: true // (默认 false)

 //当设置 noredirect 的时候该路由在面包屑导航中不可被点击
 redirect: noredirect

 //当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 //只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 //若你想不管路由下面的 children 声明的个数都显示你的根路由
 //你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 alwaysShow: true

 name:'router-name'            //设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 meta : {
  title: 'title'              //设置该路由在侧边栏和面包屑中展示的名字
  icon: 'svg-name'            //设置该路由的图标
  noCache: true               //如果设置为true ,则不会被 <keep-alive> 缓存(默认 false)
  affix: true                  if set true, the tag will affix in the tags-view
  breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
  activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
}
 **/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/platform/redirect/index')
      }
    ]
  },
  { path: '/login', component: () => import('@/views/platform/login/index'), hidden: true },
  { path: '/authredirect', component: () => import('@/views/platform/login/authredirect'), hidden: true },
  { path: '/401', component: () => import('@/views/platform/errorPage/401'), hidden: true },
  { path: '/404', component: Page404, hidden: true },
  { path: '/500', component: () => import('@/views/platform/errorPage/500'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'Dashboard',
    children: [{
      path: 'Dashboard',
      component: () => import('@/views/platform/dashboard/index'),
      name: 'Dashboard',
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }, {
      path: 'UserInfo',
      component: () => import('@/views/platform/user/info'),
      name: 'UserInfo',
      meta: { title: 'UserInfo', icon: 'user' },
      hidden: true
    }]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  { path: '*', redirect: '/404', hidden: true }
]

export function dynamicAsyncRouter(ananPermissionTree) {
  const routers = dynamicAddAsyncRouter(ananPermissionTree)
  return routers.concat(asyncRouterMap)
}

/**
 * 根据后台权限标识(anan_perimission.code)创建动态路由
 * @returns {*}
 * @param ananPermissionTree 用户权限树
 */
export function dynamicAddAsyncRouter(ananPermissionTree) {
  const aRouter = []
  if (!ananPermissionTree) {
    return aRouter
  }
  ananPermissionTree.forEach(permission => {
    const {
      code,
      type,
      status,
      icon,
      url,
      children,
      routePath
    } = permission
    const rroute = routePath || code
    // 未开启的权限则也不显示
    if (status !== 0) {
      return
    }
    // 优先从预定义中加载，如果没有找到则自动创建
    let singelRouter = findAsyncRouter(code)
    if (isEmpty(singelRouter)) {
      const nUrl = (url || 'views/platform/errorPage/404')
      switch (type) {
        // 组件菜单
        case 1:
          singelRouter = {
            name: code,
            path: rroute,
            component: resolve => require(['@/' + nUrl + '.vue'], resolve).catch(error => {
              Notification.error({
                title: '获取组件失败',
                message: error.message
              })
            }),
            meta: {
              title: code,
              icon: icon
            },
            children: isEmpty(children) ? [] : dynamicAddAsyncRouter(children)
          }
          break
        // 直接链接菜单
        case 2:
          singelRouter = {
            name: code,
            path: rroute,
            component: resolve => require(['@/views/platform/layout/Iframe.vue'], resolve).catch(error => {
              Notification.error({
                title: '获取组件失败',
                message: error.message
              })
            }),
            props: (route) => ({ src: route.query.src }),
            meta: {
              src: url,
              title: code,
              icon: icon
            },
            children: isEmpty(children) ? [] : dynamicAddAsyncRouter(children)
          }
          break
        // 目录菜单
        case 3:
          singelRouter = {
            name: code,
            path: '/' + code,
            component: resolve => require(['@/views/platform/layout/Layout.vue'], resolve).catch(error => {
              Notification.error({
                title: '获取组件失败',
                message: error.message
              })
            }),
            meta: {
              title: code,
              icon: icon
            },
            redirect: 'noredirect',
            children: isEmpty(children) ? [] : dynamicAddAsyncRouter(children)
          }
          break
        // 间接链接菜单
        case 4:
          singelRouter = {
            name: code,
            path: rroute,
            component: resolve => require(['@/views/platform/layout/Iframe.vue'], resolve).catch(error => {
              Notification.error({
                title: '获取组件失败',
                message: error.message
              })
            }),
            meta: {
              url: url,
              title: code,
              icon: icon
            },
            children: isEmpty(children) ? [] : dynamicAddAsyncRouter(children)
          }
          break
        // 子组件
        case 6:
          singelRouter = {
            name: code,
            path: rroute,
            component: resolve => require(['@/' + nUrl + '.vue'], resolve).catch(error => {
              Notification.error({
                title: '获取组件失败',
                message: error.message
              })
            }),
            meta: {
              title: code,
              icon: icon
            },
            hidden: true,
            children: isEmpty(children) ? [] : dynamicAddAsyncRouter(children)
          }
          break
        // 外部链接菜单
        case 7:
          var realUrl = url
          if (!url.startsWith('http') && process.env.VUE_APP_BASE_API !== '/') {
            realUrl = process.env.VUE_APP_BASE_API + url
          }
          singelRouter = {
            name: code,
            component: Layout,
            path: realUrl,
            meta: {
              url: realUrl,
              title: code,
              icon: icon
            },
            children: []
          }
          break
        // 只遍历菜单类型
        default:
          return
      }
    }
    singelRouter.meta.type = type
    aRouter.push(singelRouter)
  })
  return aRouter
}

/**
 * @return {boolean}
 */
function isEmpty(val) {
  if (val instanceof Array) {
    if (val.length === 0) return true
  } else if (val instanceof Object) {
    if (JSON.stringify(val) === '{}') return true
  } else {
    return val === 'null' || val == null || val === 'undefined' || val === ''
  }
  return false
}

/**
 * 根据后台权限标识(anan_perimission.code)在异步路由中查找是否存在，存在则返回对应路由
 * @param permissionCode
 * @returns {*}
 */
function findAsyncRouter(permissionCode) {
  let rc = {}
  for (let j = 0; j < asyncRouterMap.length; j++) {
    const router = asyncRouterMap[j]
    if (router.name && router.name === permissionCode) {
      rc = router
      rc.children = []
      break
    }
  }
  return rc
}
