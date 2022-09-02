import request, { getRequest, postRequest } from '@/utils/request'

// 获取个人基本信息表数据分页列表
export function listPatientinfoPage(page) {
  return request({
    url: 'gateway/mpi/api/patientinfo/paging',
    method: 'post',
    data: page
  })
}
// 获取个人基本信息表数据分页列表
export function listPatientinfoPageByStatus(page, status) {
  return request({
    url: 'gateway/mpi/api/patientinfo/paging/status/' + status,
    method: 'post',
    data: page
  })
}
// 获取个人基本信息表所有数据列表
export function listPatientinfo(data = {}) {
  return postRequest('gateway/mpi/api/patientinfo/list', data)
}
// 新建个人基本信息表
export function postPatientinfo(obj) {
  return request({
    url: 'gateway/mpi/api/patientinfo',
    method: 'post',
    data: obj
  })
}
// 根据主键ID获取个人基本信息表数据
export function getPatientinfo(id, params) {
  return getRequest('gateway/mpi/api/patientinfo/' + id, params)
}
// 根据主键ID删除个人基本信息表一条数据
export function deletePatientinfo(id) {
  return request({
    url: 'gateway/mpi/api/patientinfo/' + id,
    method: 'delete'
  })
}
// 根据实体类数据更新个人基本信息表数据
export function putPatientinfo(obj) {
  return request({
    url: 'gateway/mpi/api/patientinfo',
    method: 'put',
    data: obj
  })
}
// 根据实体类数据更新个人基本信息表数据
export function statusPatientinfo(id, status) {
  return request({
    url: 'gateway/mpi/api/patientinfo/status/' + id + '/' + status,
    method: 'post'
  })
}
// 注销合并后的患者信息
export function cancelPatients(obj) {
  return request({
    url: 'gateway/mpi/api/patientinfo/cancelPatients/' + obj,
    method: 'post'
  })
}
