import store from '@/store'

function checkPermission(el, binding) {
  const { value } = binding
  const ananPermissions = store.getters && store.getters.ananPermissions
  if (value && typeof (value) === 'string') {
    const hasPermission = ananPermissions[value] || false
    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  } else {
    throw new Error(`need permission! Like v-permission="'1'"`)
  }
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}
