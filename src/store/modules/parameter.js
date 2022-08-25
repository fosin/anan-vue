import vuex from '@/store'
import { postRequest } from '@/utils/request'
import { Notification } from 'element-ui'
import Vue from 'vue'

const parameter = {
  state: {
    parameterData: {}
  },
  mutations: {
    SET_PARAMETER_DATA: (state, data) => {
      state.parameterData = data
    }
  },
  actions: {
    // 获取字典数据
    loadParameterValue({ commit, state }, paras) {
      return new Promise((resolve, reject) => {
        const parameterData = state.parameterData
        if (!paras.type) {
          reject('获取参数值失败,没有或传入的参数类型type无效')
          return
        }
        if (!paras.name) {
          reject('获取参数值失败,没有或传入的参数name无效')
          return
        }
        let pValue = parameterData[paras.name]
        if (pValue) {
          resolve(pValue)
          return
        }
        postRequest('gateway/platform/api/parameter/value', paras, false).then(response => {
          if (!response.data.data) {
            reject('error')
          }
          pValue = response.data.data
          state.parameterData[paras.name] = pValue
          commit('SET_PARAMETER_DATA', state.parameterData)
          resolve(pValue)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default parameter

Vue.prototype.loadOrganizParameterValue = function(name, defaultValue, description) {
  return Vue.prototype.loadAllParameterValue(1, name, defaultValue, description)
}
Vue.prototype.loadUserParameterValue = function(name, defaultValue, description) {
  return Vue.prototype.loadAllParameterValue(2, name, defaultValue, description)
}
Vue.prototype.loadAllParameterValue = function(type, name, defaultValue, description) {
  return new Promise((resolve, reject) => {
    const p = {
      type: type,
      name: name,
      defaultValue: defaultValue,
      description: description
    }
    vuex.dispatch('loadParameterValue', p).then(res => {
      resolve(res)
    }).catch((error) => {
      Notification.error({
        title: '加载参数失败，入参信息：' + p.toString(),
        message: error.message,
        type: 'error',
        duration: 5000
      })
      reject(error)
    })
  })
}
