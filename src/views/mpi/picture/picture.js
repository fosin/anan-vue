import request, { postRequest } from '@/utils/request'

// 获取半身照数据分页列表
export function listPicturePage(page) {
  return request({
    url: 'gateway/mpi/v1/picture/paging',
    method: 'post',
    data: page
  })
}
// 获取半身照所有数据列表
export function listPicture(data = {}) {
  return postRequest('gateway/platform/v1/picture/list', data)
}
// 新建半身照
export function postPicture(obj) {
  return request({
    url: 'gateway/mpi/v1/picture',
    method: 'post',
    data: obj
  })
}
// 根据主键ID获取半身照数据
export function getPicture(id, method) {
  return request({
    url: 'gateway/mpi/v1/picture/' + id,
    method: method || 'post'
  })
}
// 根据主键ID删除半身照一条数据
export function deletePicture(id) {
  return request({
    url: 'gateway/mpi/v1/picture/' + id,
    method: 'delete'
  })
}
// 根据实体类数据更新半身照数据
export function putPicture(obj) {
  return request({
    url: 'gateway/mpi/v1/picture',
    method: 'put',
    data: obj
  })
}
