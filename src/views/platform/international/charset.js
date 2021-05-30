import { allRequest, deleteRequest, getRequest, postRequest, putRequest } from '@/utils/request'

// 获取国际化语言字符集数据分页列表
export function listCharsetPage(page) {
  return postRequest('gateway/platform/v1/international/charset/paging', page)
}

// 获取国际化语言字符集所有数据列表
export function listCharset(data) {
  return postRequest('gateway/platform/v1/international/charset/list', data)
}

// 新建国际化语言字符集
export function postCharset(obj) {
  return postRequest('gateway/platform/v1/international/charset', obj)
}

// 根据主键ID获取国际化语言字符集数据
export function getCharset(id, method) {
  if (method) {
    return allRequest('gateway/platform/v1/international/charset/' + id, method)
  }
  return postRequest('gateway/platform/v1/international/charset/' + id)
}

// 根据主键ID删除国际化语言字符集一条数据
export function deleteCharset(id) {
  return deleteRequest('gateway/platform/v1/international/charset/' + id)
}

// 根据实体类数据更新国际化语言字符集数据
export function putCharset(obj) {
  return putRequest('gateway/platform/v1/international/charset', obj)
}

// 根据语言ID查找所有字符集清单,不传参数默认使用post查询所有的数据
export function getInternationlCharsets(internationalId, method) {
  if (!internationalId) internationalId = 0
  const url = 'gateway/platform/v1/international/charset/internationalId/' + internationalId
  if (method === 'get') {
    return getRequest(url, method)
  }
  return postRequest(url)
}

// 根据语言ID查找所有字符集数据,不传参数默认使用post查询所有的数据
export function findAllByInternationalIdAndServiceId(internationalId, serviceId) {
  return listCharset({
    internationalId: internationalId,
    serviceId: serviceId
  })
}
