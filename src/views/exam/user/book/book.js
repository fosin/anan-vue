import { postRequest } from '@/utils/request'

/**
 * 题库详情
 * @param examId
 * @param quId
 */
export function nextQu(examId, quId) {
  return postRequest('gateway/exam/api/user/wrong-book/next', { examId: examId, quId: quId })
}
