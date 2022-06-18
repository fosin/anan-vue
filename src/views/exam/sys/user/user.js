import { postRequest } from '@/utils/request'

export function updateData(data) {
  return postRequest('gateway/exam/api/sys/user/update', data)
}

export function createOrUpdate(data) {
  return postRequest('gateway/exam/api/sys/user/createOrUpdate', data)
}

export function userReg(data) {
  return postRequest('gateway/exam/api/sys/user/reg', data)
}
