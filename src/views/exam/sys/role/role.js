import { postRequest } from '@/utils/request'

export function fetchList(data = {}) {
  return postRequest('gateway/exam/api/sys/role/list', data)
}

