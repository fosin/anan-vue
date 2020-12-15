import { postRequest } from '@/utils/request'

/**
 * 试卷列表
 * @param data
 */
export function listPaper(userId, examId) {
  return postRequest('gateway/exam/api/paper/paper/paging', { current: 1, size: 5, params: { userId: userId, examId: examId }})
}
