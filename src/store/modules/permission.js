import { asyncRouterMap, constantRouterMap } from '@/router'
import { getWebStore, setWebStore, removeWebStore } from '@/utils/webStorage'
import { fetchUserPermissionsTree } from '@/api/permission'
/**
 * 通过判断是否与当前用户权限匹配
 * @param permissions
 * @param route
 */
function hasPermission(permissions, route) {
  if (!route.meta || !route.meta.permission) return true // 当路由未设置perimission标签时则表示不判断权限
  return permissions[route.meta.permission] || false
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param permissions
 */
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
}
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
    GenerateRoutes({ commit }, userInfo, permissions) {
      // fetchUserPermissionsTree(userInfo.id, 1).then(response => {
      //   // 取所有菜单权限，剔除调根节点
      //   const permissions = response.data.data.children
      // })
      return new Promise(resolve => {
        commit('SET_ROUTERS', filterAsyncRouter(asyncRouterMap, permissions))
        resolve()
      })
    }
  }
}

export default permission
