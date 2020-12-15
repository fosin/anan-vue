import { postRequest } from '@/utils/request'

export function pagingTree(data) {
  return postRequest('gateway/exam/api/sys/depart/paging', data)
}

export function fetchTree(data) {
  return postRequest('gateway/exam/api/sys/depart/tree', data)
}

export function fetchDetail(id) {
  const data = { id: id }
  return postRequest('gateway/exam/api/sys/depart/detail', data)
}

export function deleteData(ids) {
  const data = { ids: ids }
  return postRequest('gateway/exam/api/sys/depart/delete', data)
}

export function saveData(data) {
  return postRequest('gateway/exam/api/sys/depart/save', data)
}

export function sortData(id, sort) {
  const data = { id: id, sort: sort }
  return postRequest('gateway/exam/api/sys/depart/sort', data)
}
