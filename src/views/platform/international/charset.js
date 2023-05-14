import request, { deleteRequest, getRequest, postRequest, putRequest } from '@/utils/request'

// 获取国际化语言字符集数据分页列表
export function listCharsetPage(page) {
  return postRequest('gateway/platform/api/international/charset/paging', page)
}

// 获取国际化语言字符集所有数据列表
export function listCharset(data = {}) {
  return postRequest('gateway/platform/api/international/charset/list', data)
}

// 新建国际化语言字符集
export function postCharset(obj) {
  return postRequest('gateway/platform/api/international/charset', obj)
}

// 根据主键ID获取国际化语言字符集数据
export function getCharset(id, params) {
  return getRequest('gateway/platform/api/international/charset/' + id, params)
}

// 根据主键ID删除国际化语言字符集一条数据
export function deleteCharset(id) {
  return deleteRequest('gateway/platform/api/international/charset/' + id)
}

// 根据实体类数据更新国际化语言字符集数据
export function putCharset(obj) {
  return putRequest('gateway/platform/api/international/charset', obj)
}

// 根据语言ID查找所有字符集清单
export function getInternationlCharsets(internationalId, method) {
  if (!internationalId) internationalId = 0
  // const url = 'gateway/platform/api/international/charset/internationalId/' + internationalId
  const url = 'gateway/platform/api/international/charset/batch/' + internationalId
  return request({
    url: url,
    method: method || 'get'
  })
}

// 根据语言ID查找所有字符集数据
export function findAllByInternationalIdAndServiceId(internationalId, serviceId) {
  return listCharset({
    internationalId: internationalId,
    serviceId: serviceId
  })
}
