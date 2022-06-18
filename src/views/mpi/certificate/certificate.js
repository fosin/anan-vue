import request, { postRequest } from '@/utils/request'

// 获取相关证件信息数据分页列表
export function listCertificatePage(page) {
  return request({
    url: 'gateway/mpi/v1/certificate/paging',
    method: 'post',
    data: page
  })
}
// 获取相关证件信息所有数据列表
export function listCertificate(data = {}) {
  return postRequest('gateway/platform/v1/certificate/list', data)
}
// 根据病人主索引ID查找该病人所有证件信息
export function listCertificateByEmpId(id, page) {
  return request({
    url: 'gateway/mpi/v1/certificate/list/empId/' + id,
    method: 'post',
    data: page
  })
}
// 新建相关证件信息
export function postCertificate(obj) {
  return request({
    url: 'gateway/mpi/v1/certificate',
    method: 'post',
    data: obj
  })
}
// 根据主键ID获取相关证件信息数据
export function getCertificate(id, method) {
  return request({
    url: 'gateway/mpi/v1/certificate/' + id,
    method: method || 'post'
  })
}
// 根据主键ID删除相关证件信息一条数据
export function deleteCertificate(id) {
  return request({
    url: 'gateway/mpi/v1/certificate/' + id,
    method: 'delete'
  })
}
// 根据实体类数据更新相关证件信息数据
export function putCertificate(obj) {
  return request({
    url: 'gateway/mpi/v1/certificate',
    method: 'put',
    data: obj
  })
}
