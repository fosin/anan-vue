import { postRequest } from '@/utils/request'

const dictionary = {
  state: {
    dictionaryData: {}
  },
  mutations: {
    SET_DIACTIONARY_DATA: (state, data) => {
      state.dictionaryData = data
    }
  },
  actions: {
    // 获取字典数据
    LoadDictionaryById({ commit, state, dispatch }, dicId) {
      return new Promise((resolve, reject) => {
        const dics = state.dictionaryData
        if (dics[dicId]) {
          resolve(dics[dicId])
          return
        }
        postRequest('gateway/platform/v1/dictionary/' + dicId).then(response => {
          if (!response.data) {
            reject('error')
          }
          const data = response.data
          postRequest('gateway/platform/v1/dictionaryDetail/byCode/' + dicId).then(response => {
            if (!response.data) {
              reject('error')
            }
            data['details'] = response.data
            state.dictionaryData[dicId] = data
            commit('SET_DIACTIONARY_DATA', state.dictionaryData)
            resolve(data)
          }).catch(error => {
            reject(error)
          })
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default dictionary

import Vue from 'vue'
Vue.prototype.getDicDetailValue = function(dicDetails, dicName) {
  if (!dicDetails || dicDetails.length < 1) {
    return dicName
  }
  for (const dicDetail of dicDetails) {
    if (dicDetail.name === dicName) {
      return dicDetail.value
    }
  }
}
