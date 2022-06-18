import { postRequest } from '@/utils/request'

/**
 * 考试详情
 * @param data
 */
export function fetchDetail(id, refs = '1') {
  return postRequest('gateway/exam/api/exam/exam/' + id, { refs: refs })
}

/**
 * 保存题库
 * @param data
 */
export function createOrUpdate(data) {
  return postRequest('gateway/exam/api/exam/exam/createOrUpdate', data)
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
export function fetchList(data = {}) {
  return postRequest('gateway/exam/api/exam/exam/list', data)
}
