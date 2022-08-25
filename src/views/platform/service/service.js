import request, { deleteRequest, postRequest, putRequest } from '@/utils/request'

// 获取系统服务表数据分页列表
export function listServicePage(page) {
  return postRequest('gateway/platform/api/service/paging', page)
}

// 获取系统服务表所有数据列表
export function listService(data = {}) {
  return postRequest('gateway/platform/api/service/list', data)
}

// 新建系统服务表
export function postService(obj) {
  return postRequest('gateway/platform/api/service', obj)
}

// 根据主键ID获取系统服务表数据
export function getService(id, method) {
  if (method) {
    return request({ url: 'gateway/platform/api/service/' + id, method: method })
  }
  return postRequest('gateway/platform/api/service/' + id)
}

// 根据主键ID删除系统服务表一条数据
export function deleteService(id) {
  return deleteRequest('gateway/platform/api/service/' + id)
}

// 根据实体类数据更新系统服务表数据
export function putService(obj) {
  return putRequest('gateway/platform/api/service', obj)
}

// 根据状态码查找所有服务数据,不传参数默认使用post查询status=0的数据
export function getServiceByStatus(status) {
  if (!status) status = 0
  return listService({ status: status })
}
