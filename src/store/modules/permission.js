import { constantRouterMap, dynamicAsyncRouter } from '@/router'
import { getWebStore, setWebStore, removeWebStore } from '@/utils/webStorage'

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
        const routes = dynamicAsyncRouter(permissionTree.children)
        commit('SET_ROUTERS', routes)
        resolve()
      })
    }
  }
}

export default permission
