import request, { postRequest } from '@/utils/request'

export function getDicData(data, keyName, keyValue) {
  for (const dicDetail of data) {
    if (dicDetail[keyName] === keyValue) {
      return dicDetail
    }
  }
  return keyValue
}

export function getDicValue(data, keyName, keyValue, valueName) {
  if (!data || data.length === 0 || !keyName || !valueName) {
    return keyValue
  }
  if (keyValue === undefined || keyValue === null) {
    return null
  }
  const detail = getDicData(data, keyName, keyValue)
  if (typeof detail === 'object') {
    return detail[valueName]
  } else {
    return detail
  }
}

// 获取数据分页列表
export function findDictionaryPage(page) {
  return request({
    url: 'gateway/platform/v1/dictionary/paging',
    method: 'post',
    data: page
  })
}

// 获取所有数据列表
export function listDictionary(data = {}) {
  return postRequest('gateway/platform/v1/dictionary/list', data)
}

export function postDictionary(obj) {
  return request({
    url: 'gateway/platform/v1/dictionary/',
    method: 'post',
    data: obj
  })
}

export function getDictionary(id, method) {
  return request({
    url: 'gateway/platform/v1/dictionary/' + id,
    method: method || 'post'
  })
}

export function deleteDictionary(id) {
  return request({
    url: 'gateway/platform/v1/dictionary/' + id,
    method: 'delete'
  })
}

export function putDictionary(obj) {
  return request({
    url: 'gateway/platform/v1/dictionary',
    method: 'put',
    data: obj
  })
}

// 以下是字典明细的后台方法
// 获取数据分页列表
export function findDictionaryDetailPage(page) {
  return request({
    url: 'gateway/platform/v1/dictionarydetail/paging',
    method: 'post',
    data: page
  })
}

// 获取所有数据列表
export function listDictionaryDetail(data = {}) {
  return postRequest('gateway/platform/v1/dictionarydetail/list', data)
}

export function postDictionaryDetail(obj) {
  return request({
    url: 'gateway/platform/v1/dictionarydetail/',
    method: 'post',
    data: obj
  })
}

export function listDictionaryDetailsByDicId(dicId, method) {
  return request({
    url: 'gateway/platform/v1/dictionarydetail/batch/' + dicId,
    method: method || 'post'
  })
}

export function getDictionaryDetail(id, method) {
  return request({
    url: 'gateway/platform/v1/dictionarydetail/' + id,
    method: method || 'post'
  })
}

export function deleteDictionaryDetail(id) {
  return request({
    url: 'gateway/platform/v1/dictionarydetail/' + id,
    method: 'delete'
  })
}

export function putDictionaryDetail(obj) {
  return request({
    url: 'gateway/platform/v1/dictionarydetail',
    method: 'put',
    data: obj
  })
}
