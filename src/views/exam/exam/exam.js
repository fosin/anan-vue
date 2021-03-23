import { postRequest } from '@/utils/request'

/**
 * 题库详情
 * @param data
 */
export function fetchDetail(id) {
  return postRequest('gateway/exam/api/exam/exam/detail', { id: id })
}

/**
 * 保存题库
 * @param data
 */
export function saveData(data) {
  return postRequest('gateway/exam/api/exam/exam/save', data)
}

/**
 * 准备试题
 * @param data
 */
export function prepareQus(data) {
  return postRequest('gateway/exam/api/exam/exam/prepareQus', data)
}

/**
 * 题库详情
 * @param data
 */
export function fetchList() {
  return postRequest('gateway/exam/api/exam/exam/paging', { current: 1, size: 100 })
}
