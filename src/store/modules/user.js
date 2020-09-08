import { getAccessToken, refreshAccessToken, logout, getUserInfo, getUserPermissionTree } from '@/api/login'
import { getWebStore, setWebStore, removeWebStore } from '@/utils/webStorage'

const user = {
  state: {
    ananUserInfo: getWebStore({
      name: 'ananUserInfo'
    }) || {},
    ananPermissions: getWebStore({
      name: 'ananPermissions'
    }) || {},
    ananPermissionTree: getWebStore({
      name: 'ananPermissionTree'
    }) || {},
    ananToken: getWebStore({
      name: 'ananToken'
    }) || {},
    ananCurrentOrganiz: getWebStore({
      name: 'ananCurrentOrganiz'
    }) || {},
    ananCurrentRole: getWebStore({
      name: 'ananCurrentRole'
    }) || 0
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.ananToken = token
      setWebStore({
        name: 'ananToken',
        content: state.ananToken
      })
    },
    SET_USER: (state, ananUserInfo) => {
      if (!ananUserInfo.avatar) {
        ananUserInfo.avatar = ''
      }
      state.ananUserInfo = ananUserInfo
      setWebStore({
        name: 'ananUserInfo',
        content: state.ananUserInfo
      })
    },
    SET_PERMISSIONS: (state, ananPermissions) => {
      const list = {}
      for (let i = 0; i < ananPermissions.length; i++) {
        list[ananPermissions[i]] = true
      }
      state.ananPermissions = list
      setWebStore({
        name: 'ananPermissions',
        content: state.ananPermissions
      })
    },
    SET_PERMISSION_TREE: (state, ananPermissionTree) => {
      state.ananPermissionTree = ananPermissionTree
      setWebStore({
        name: 'ananPermissionTree',
        content: state.ananPermissionTree
      })
    },
    SET_CURRENT_ORGANIZ: (state, ananCurrentOrganiz) => {
      state.ananCurrentOrganiz = ananCurrentOrganiz
      setWebStore({
        name: 'ananCurrentOrganiz',
        content: state.ananCurrentOrganiz
      })
    },
    SET_CURRENT_ROLE: (state, ananCurrentRole) => {
      state.ananCurrentRole = ananCurrentRole
      setWebStore({
        name: 'ananCurrentRole',
        content: state.ananCurrentRole
      })
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit, state, dispatch }, loginForm) {
      return new Promise((resolve, reject) => {
        const access_token = state.ananToken.access_token
        if (access_token) {
          // 根据服务器返回的失效时间定时刷新access_token
          setTimeout(function() {
            dispatch('RefreshAccessToken').then(res => { // 拉取user_info
            }).catch((error) => {
              reject(error)
            })
          }, ((state.ananToken.expires_in || 7200) - 120) * 1000)
          resolve()
        } else {
          getAccessToken(loginForm).then(response => {
            commit('SET_TOKEN', response.data)
            // 根据服务器返回的失效时间定时刷新access_token
            setTimeout(function() {
              dispatch('RefreshAccessToken').then(res => { // 拉取user_info
              }).catch((error) => {
                reject(error)
              })
            }, ((response.data.expires_in || 7200) - 60) * 1000)
            resolve()
          }).catch(error => {
            reject(error)
          })
        }
      })
    },
    // 刷新toeken
    RefreshAccessToken({ commit, state }) {
      return new Promise((resolve, reject) => {
        const refresh_token = state.ananToken.refresh_token
        if (refresh_token) {
          const access_token = state.ananToken.access_token
          state.ananToken.access_token = ''
          refreshAccessToken(refresh_token).then(response => {
            commit('SET_TOKEN', response.data)
            resolve()
          }).catch(error => {
            state.ananToken.access_token = access_token
            reject(error)
          })
        }
      })
    },
    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(response => {
          if (!response.data) {
            reject('error')
          }
          const data = response.data.claims
          if (!data.enabled || !data.accountNonExpired || !data.accountNonLocked || !data.credentialsNonExpired) { // 验证返回的user是否有效用户
            reject('getInfo: user is disabled!')
          }
          if (data.user) { // 验证返回的user
            commit('SET_USER', data.user)
          } else {
            reject('getInfo: invalid user object !')
          }
          if (data.authorities && data.authorities.length > 0) { // 验证返回的authorities是否是有效数组
            commit('SET_PERMISSIONS', data.authorities)
          } else {
            commit('SET_PERMISSIONS', {})
          }
          getUserPermissionTree(data.user.id).then(response1 => {
            if (!response1.data) {
              reject('error')
            }
            response.ananPermissionTree = response1.data
            if (data) { // 验证返回的权限树
              commit('SET_PERMISSION_TREE', response.ananPermissionTree)
            } else {
              commit('SET_PERMISSION_TREE', {})
            }
            resolve(response)
          }).catch(error => {
            reject(error)
          })
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_ACCESS_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          clearLoginData(commit)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        clearLoginData(commit)
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setWebStore(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_CURRENT_ROLE', data.roles)
          resolve()
        })
      })
    }
  }
}

function clearLoginData(commit) {
  commit('SET_TOKEN', {})
  commit('SET_PERMISSIONS', {})
  commit('SET_PERMISSION_TREE', {})
  commit('SET_USER', {})
  commit('SET_CURRENT_ROLE', 0)
  commit('SET_CURRENT_ORGANIZ', {})
  removeWebStore('ananToken')
  removeWebStore('ananPermissions')
  removeWebStore('ananPermissionTree')
  removeWebStore('ananUserInfo')
  removeWebStore('ananCurrentRole')
  removeWebStore('ananCurrentOrganiz')
}

export default user
