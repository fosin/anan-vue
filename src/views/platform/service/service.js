import { allRequest, deleteRequest, postRequest, putRequest, getRequest } from '@/utils/request'

// 获取系统服务表数据分页列表
export function listServicePage(page) {
  return postRequest('gateway/platform/v1/service/pageList', page)
}

// 获取系统服务表所有数据列表
export function listService() {
  return postRequest('gateway/platform/v1/service/list')
}

// 新建系统服务表
export function postService(obj) {
  return postRequest('gateway/platform/v1/service', obj)
}

// 根据主键ID获取系统服务表数据
export function getService(id, method) {
  if (method) {
    return allRequest('gateway/platform/v1/service/' + id, method)
  }
  return postRequest('gateway/platform/v1/service/' + id)
}

// 根据主键ID删除系统服务表一条数据
export function deleteService(id) {
  return deleteRequest('gateway/platform/v1/service/' + id)
}

// 根据实体类数据更新系统服务表数据
export function putService(obj) {
  return putRequest('gateway/platform/v1/service', obj)
}

// 根据状态码查找所有服务数据,不传参数默认使用post查询status=0的数据
export function getServiceByStatus(status, method) {
  if (!status) status = 0
  const url = 'gateway/platform/v1/service/status/' + status
  if (method === 'get') {
    return getRequest(url, method)
  }
  return postRequest(url)
}
