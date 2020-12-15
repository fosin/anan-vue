import { postRequest } from '@/utils/request'

export function fetchList() {
  return postRequest('gateway/exam/api/sys/role/list', {})
}

