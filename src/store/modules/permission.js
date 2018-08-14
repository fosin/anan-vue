import { constantRouterMap, dynamicAddAsyncRouter } from '@/router'
import { getWebStore, setWebStore, removeWebStore } from '@/utils/webStorage'

/* Layout */
// import Layout from '@/views/platform/layout/Layout'
// import Page404 from '@/views/platform/errorPage/404'
/**
 * 通过判断是否与当前用户权限匹配
 * @param permissions
 * @param route
 */
/*
function hasPermission(permissions, route) {
  if (!route.meta || !route.meta.permission) return true // 当路由未设置perimission标签时则表示不判断权限
  return permissions[route.meta.permission] || false
}
*/

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param permissions
 */
/*
function filterAsyncRouter(asyncRouterMap, permissions) {
  return asyncRouterMap.filter(route => {
    if (hasPermission(permissions, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, permissions)
      }
      return true
    }
    return false
  })
}*/
/**
 * 根据后台权限标识(cdp_sys_perimission.code)在异步路由中查找是否存在，存在则返回对应路由
 * @param asyncRouterMap
 * @param permissionCode
 * @returns {*}
 */
/* function findAsyncRouter(asyncRouterMap, permissionCode) {
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
}*/
/*
function dynamicAddAsyncRouter(permissionTree) {
  const aRouter = []
  if (!permissionTree) {
    return aRouter
  }
  permissionTree.forEach(permission => {
    const {
      code,
      type,
      status,
      icon,
      url,
      children
    } = permission
    // 未开启的权限则也不显示
    if (status !== 0) {
      return
    }
    let singelRouter = {}
    const nUrl = (url ? '@/' + url : '@/views/platform/errorPage/404')
    switch (type) {
      // 组件菜单
      case 1:
        singelRouter = {
          name: code,
          path: code,
          component: () => import(nUrl),
          // component: (resolve) => require([`${nUrl}`], resolve),
          // component(resolve) {
          //   require([`${nUrl}`], resolve)
          // },
          meta: {
            title: code,
            icon: icon
          },
          children: validatenull(children) ? [] : dynamicAddAsyncRouter(children)
        }
        break
      // 链接菜单
      case 2:
        return
      // 目录菜单
      case 3:
        singelRouter = {
          name: code,
          path: '/' + code,
          component: Layout,
          meta: {
            title: code,
            icon: icon
          },
          redirect: 'noredirect',
          children: validatenull(children) ? [] : dynamicAddAsyncRouter(children)
        }
        break
      // 只遍历菜单类型
      default:
        return
    }

    // const singelRouter = findAsyncRouter(asyncRouterMap, code)
    // singelRouter.children = validatenull(children) ? [] : dynamicAddAsyncRouter(children)
    aRouter.push(singelRouter)
  })
  return aRouter
}
function validatenull(val) {
  if (val instanceof Array) {
    if (val.length === 0) return true
  } else if (val instanceof Object) {
    if (JSON.stringify(val) === '{}') return true
  } else {
    return val === 'null' || val == null || val === 'undefined' || val === undefined || val === ''
  }
  return false
}
*/
function clearData(commit) {
  commit('SET_ROUTERS', [])
  removeWebStore('addRouters')
  removeWebStore('routers')
}

const permission = {
  state: {
    routers: getWebStore({
      name: 'routers'
    }) || constantRouterMap,
    addRouters: getWebStore({
      name: 'addRouters'
    }) || []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      setWebStore({
        name: 'addRouters',
        content: routers
      })
      state.routers = constantRouterMap.concat(routers)
      setWebStore({
        name: 'routers',
        content: state.routers
      })
    }
  },
  actions: {
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        clearData(commit)
        resolve()
      })
    },
    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        clearData(commit)
        resolve()
      })
    },
    GenerateRoutes({ commit }, permissionTree) {
      return new Promise(resolve => {
        const routes = dynamicAddAsyncRouter(permissionTree.children)
        commit('SET_ROUTERS', routes)
        resolve()
      })
    }
  }
}

export default permission
