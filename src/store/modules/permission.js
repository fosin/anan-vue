import { constantRouterMap, dynamicAsyncRouter } from '@/router'
import { getWebStore, setWebStore, removeWebStore } from '@/utils/webStorage'

function clearData(commit) {
  commit('SET_ROUTERS', [])
  removeWebStore('ananAddRouters')
  removeWebStore('ananRouters')
}

const permission = {
  state: {
    ananRouters: getWebStore({
      name: 'ananRouters'
    }) || constantRouterMap,
    ananAddRouters: getWebStore({
      name: 'ananAddRouters'
    }) || []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.ananAddRouters = routers
      setWebStore({
        name: 'ananAddRouters',
        content: routers
      })
      state.ananRouters = constantRouterMap.concat(routers)
      setWebStore({
        name: 'ananRouters',
        content: state.ananRouters
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
    GenerateRoutes({ commit }, ananPermissionTree) {
      return new Promise(resolve => {
        const routes = dynamicAsyncRouter(ananPermissionTree.children)
        commit('SET_ROUTERS', routes)
        resolve()
      })
    }
  }
}

export default permission
