import request from '@/utils/request'

// 获取卡信息数据分页列表
export function listCardinfoPage(page) {
  return request({
    url: 'mpi/v1/cardinfo/pageList',
    method: 'post',
    data: page
  })
}
// 获取卡信息所有数据列表
export function listCardinfo() {
  return request({
    url: 'mpi/v1/cardinfo/list',
    method: 'post'
  })
}
// 根据病人主索引ID查找该病人所有卡
export function listCardinfoByEmpId(id, page) {
  return request({
    url: 'mpi/v1/cardinfo/list/empId/' + id,
    method: 'post',
    data: page
  })
}
// 新建卡信息
export function postCardinfo(obj) {
  return request({
    url: 'mpi/v1/cardinfo',
    method: 'post',
    data: obj
  })
}
// 根据主键ID获取卡信息数据
export function getCardinfo(id, method) {
  return request({
    url: 'mpi/v1/cardinfo/' + id,
    method: method || 'post'
  })
}
// 根据主键ID删除卡信息一条数据
export function deleteCardinfo(id) {
  return request({
    url: 'mpi/v1/cardinfo/' + id,
    method: 'delete'
  })
}
// 根据实体类数据更新卡信息数据
export function putCardinfo(obj) {
  return request({
    url: 'mpi/v1/cardinfo',
    method: 'put',
    data: obj
  })
}
